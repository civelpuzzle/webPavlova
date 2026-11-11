document.addEventListener("DOMContentLoaded", () => {

    // ===== Состояние =====
    let token = localStorage.getItem("adminToken");
    let adminName = localStorage.getItem("adminName") || "";
    let categories = [];
    let suppliers = [];
    let editingItemId = null;

    // ===== DOM-элементы =====
    const authSection = document.getElementById("authSection");
    const dashboardSection = document.getElementById("dashboardSection");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const toggleFormBtn = document.getElementById("toggleFormBtn");
    const authError = document.getElementById("authError");
    const logoutBtn = document.getElementById("logoutBtn");
    const adminNameDisplay = document.getElementById("adminNameDisplay");
    const itemsTableBody = document.getElementById("itemsTableBody");
    const addItemBtn = document.getElementById("addItemBtn");
    const itemModal = document.getElementById("itemModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    const itemForm = document.getElementById("itemForm");
    const modalTitle = document.getElementById("modalTitle");
    const toast = document.getElementById("toast");

    // ===== Инициализация =====
    if (token) {
        showDashboard();
        loadDashboardData();
    } else {
        showAuth();
    }

    // ============================================================
    //  НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ
    // ============================================================

    function showAuth() {
        authSection.style.display = "flex";
        dashboardSection.style.display = "none";
    }

    function showDashboard() {
        authSection.style.display = "none";
        dashboardSection.style.display = "block";
        adminNameDisplay.textContent = adminName ? `👤 ${adminName}` : "";
    }

    // ============================================================
    //  АВТОРИЗАЦИЯ
    // ============================================================

    // Переключение между входом и регистрацией
    toggleFormBtn.addEventListener("click", () => {
        const isLoginVisible = loginForm.style.display !== "none";
        loginForm.style.display = isLoginVisible ? "none" : "block";
        registerForm.style.display = isLoginVisible ? "block" : "none";
        toggleFormBtn.textContent = isLoginVisible
            ? "← Вернуться ко входу"
            : "Создать нового администратора";
        authError.textContent = "";
    });

    // Вход
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        authError.textContent = "";

        const name = document.getElementById("loginName").value.trim();
        const password = document.getElementById("loginPassword").value;

        try {
            const res = await fetch("/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password })
            });

            const data = await res.json();

            if (!res.ok) {
                authError.textContent = data.message || "Ошибка входа";
                return;
            }

            token = data.token;
            adminName = data.adminName || name;
            localStorage.setItem("adminToken", token);
            localStorage.setItem("adminName", adminName);

            showDashboard();
            loadDashboardData();
            showToast("Вход выполнен успешно");
        } catch (err) {
            authError.textContent = "Ошибка сети. Проверьте сервер.";
        }
    });

    // Регистрация
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        authError.textContent = "";

        const name = document.getElementById("regName").value.trim();
        const password = document.getElementById("regPassword").value;
        const email = document.getElementById("regEmail").value.trim();
        const description = document.getElementById("regDescription").value.trim();

        try {
            const res = await fetch("/admin/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password, email, description })
            });

            const data = await res.json();

            if (!res.ok) {
                authError.textContent = data.message || "Ошибка регистрации";
                return;
            }

            showToast("Администратор зарегистрирован. Теперь войдите.");
            // Переключаемся на форму входа
            registerForm.style.display = "none";
            loginForm.style.display = "block";
            toggleFormBtn.textContent = "Создать нового администратора";
            registerForm.reset();
        } catch (err) {
            authError.textContent = "Ошибка сети. Проверьте сервер.";
        }
    });

    // Выход
    logoutBtn.addEventListener("click", () => {
        token = null;
        adminName = "";
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
        showAuth();
        loginForm.reset();
        showToast("Вы вышли из панели");
    });

    // ============================================================
    //  ЗАГРУЗКА ДАННЫХ ДЛЯ ПАНЕЛИ
    // ============================================================

    async function loadDashboardData() {
        try {
            await Promise.all([loadCategories(), loadSuppliers()]);
            await loadItems();
        } catch (err) {
            showToast("Ошибка загрузки данных", "error");
        }
    }

    async function loadCategories() {
        const res = await fetchWithAuth("/admin/categories");
        if (res.status === 401) { logout(); throw new Error("Unauthorized"); }
        categories = await res.json();
    }

    async function loadSuppliers() {
        const res = await fetchWithAuth("/admin/suppliers");
        if (res.status === 401) { logout(); throw new Error("Unauthorized"); }
        suppliers = await res.json();
    }

    async function loadItems() {
        itemsTableBody.innerHTML = `<tr><td colspan="8" class="loading-cell">Загрузка...</td></tr>`;

        const res = await fetchWithAuth("/admin/items");

        if (res.status === 401) {
            logout();
            return;
        }

        if (!res.ok) {
            itemsTableBody.innerHTML = `<tr><td colspan="8" class="loading-cell error-text">Ошибка загрузки</td></tr>`;
            return;
        }

        const items = await res.json();
        renderTable(items);
    }

    // ============================================================
    //  РЕНДЕР ТАБЛИЦЫ
    // ============================================================

    function renderTable(items) {
        if (!items || items.length === 0) {
            itemsTableBody.innerHTML = `<tr><td colspan="8" class="loading-cell">Товаров пока нет</td></tr>`;
            return;
        }

        itemsTableBody.innerHTML = items.map(item => `
            <tr>
                <td>${item.id_item}</td>
                <td>
                    <div class="table-img-wrapper">
                        <img src="${item.photo || '/logo.jpg'}" alt="${escapeHtml(item.name)}"
                             onerror="this.src='/logo.jpg'">
                    </div>
                </td>
                <td class="cell-name">${escapeHtml(item.name)}</td>
                <td>${Number(item.price).toFixed(2)} ₽</td>
                <td>${item.stock_balance}</td>
                <td>${escapeHtml(item.category_name || '—')}</td>
                <td>${escapeHtml(item.supplier_name || '—')}</td>
                <td class="cell-actions">
                    <button class="btn btn-small btn-edit" onclick="editItem(${item.id_item})">✏️</button>
                    <button class="btn btn-small btn-delete" onclick="deleteItem(${item.id_item}, '${escapeHtml(item.name)}')">🗑️</button>
                </td>
            </tr>
        `).join("");
    }

    // Экранирование HTML для защиты от XSS
    function escapeHtml(str) {
        if (!str) return "";
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    // ============================================================
    //  МОДАЛЬНОЕ ОКНО
    // ============================================================

    function openModal(mode, item = null) {
        editingItemId = mode === "edit" ? item.id_item : null;
        modalTitle.textContent = mode === "edit" ? "Редактировать товар" : "Добавить товар";

        // Заполняем выпадающие списки
        const categorySelect = document.getElementById("itemCategory");
        const supplierSelect = document.getElementById("itemSupplier");

        categorySelect.innerHTML = `<option value="" disabled>Выберите категорию</option>` +
            categories.map(c => `<option value="${c.id_category}" ${item && item.id_category === c.id_category ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("");

        supplierSelect.innerHTML = `<option value="" disabled>Выберите поставщика</option>` +
            suppliers.map(s => `<option value="${s.id_supplier}" ${item && item.id_supplier === s.id_supplier ? "selected" : ""}>${escapeHtml(s.name)}</option>`).join("");

        // Заполняем поля
        document.getElementById("itemId").value = item ? item.id_item : "";
        document.getElementById("itemName").value = item ? item.name : "";
        document.getElementById("itemPrice").value = item ? item.price : "";
        document.getElementById("itemStock").value = item ? item.stock_balance : "";
        document.getElementById("itemPhoto").value = item ? (item.photo || "") : "";

        itemModal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        itemModal.style.display = "none";
        document.body.style.overflow = "";
        itemForm.reset();
        editingItemId = null;
    }

    addItemBtn.addEventListener("click", () => openModal("add"));
    closeModalBtn.addEventListener("click", closeModal);
    cancelModalBtn.addEventListener("click", closeModal);
    itemModal.querySelector(".modal__overlay").addEventListener("click", closeModal);

    // ============================================================
    //  CRUD ОПЕРАЦИИ
    // ============================================================

    // Сохранение (создание или обновление)
    itemForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            name: document.getElementById("itemName").value.trim(),
            price: parseFloat(document.getElementById("itemPrice").value),
            stock_balance: parseInt(document.getElementById("itemStock").value, 10),
            id_category: parseInt(document.getElementById("itemCategory").value, 10),
            id_supplier: parseInt(document.getElementById("itemSupplier").value, 10),
            photo: document.getElementById("itemPhoto").value.trim() || null
        };

        try {
            let res;

            if (editingItemId) {
                // PUT — обновление
                res = await fetchWithAuth(`/admin/items/${editingItemId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload)
                });
            } else {
                // POST — создание
                res = await fetchWithAuth("/admin/items", {
                    method: "POST",
                    body: JSON.stringify(payload)
                });
            }

            if (res.status === 401) { logout(); return; }

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || "Ошибка сохранения", "error");
                return;
            }

            showToast(data.message || "Сохранено");
            closeModal();
            await loadItems();
        } catch (err) {
            showToast("Ошибка сети", "error");
        }
    });

    // Редактирование (вызывается из таблицы через onclick)
    window.editItem = async (id) => {
        try {
            const res = await fetchWithAuth("/admin/items");
            if (res.status === 401) { logout(); return; }

            const items = await res.json();
            const item = items.find(i => i.id_item === id);

            if (!item) {
                showToast("Товар не найден", "error");
                return;
            }

            openModal("edit", item);
        } catch (err) {
            showToast("Ошибка загрузки товара", "error");
        }
    };

    // Удаление (вызывается из таблицы через onclick)
    window.deleteItem = async (id, name) => {
        if (!confirm(`Удалить товар «${name}»?`)) return;

        try {
            const res = await fetchWithAuth(`/admin/items/${id}`, {
                method: "DELETE"
            });

            if (res.status === 401) { logout(); return; }

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || "Ошибка удаления", "error");
                return;
            }

            showToast("Товар удалён");
            await loadItems();
        } catch (err) {
            showToast("Ошибка сети", "error");
        }
    };

    // ============================================================
    //  ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // ============================================================

    // Обёртка над fetch с автоматическим добавлением токена
    async function fetchWithAuth(url, options = {}) {
        return fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...(options.headers || {})
            }
        });
    }

    // Выход при просроченном токене
    function logout() {
        token = null;
        adminName = "";
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
        showAuth();
        showToast("Сессия истекла. Войдите заново.", "error");
    }

    // Toast-уведомление
    function showToast(message, type = "success") {
        toast.textContent = message;
        toast.className = `toast toast--visible ${type === "error" ? "toast--error" : "toast--success"}`;

        setTimeout(() => {
            toast.className = "toast";
        }, 3000);
    }
});
