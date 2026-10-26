document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("catalogGrid");
    const categoryFilters = document.getElementById("categoryFilters");
    if (!grid) return;

    let allItems = [];

    fetch("/items")
        .then(response => {
            if (!response.ok) throw new Error("Ошибка сети");
            return response.json();
        })
        .then(items => {
            if (!items || items.length === 0) {
                grid.innerHTML = "<p style='text-align:center; grid-column:1/-1;'>Товары пока не добавлены в базу.</p>";
                return;
            }

            allItems = items;

            // 1. Извлекаем уникальные категории и добавляем "Все" в начало
            const categories = ["Все", ...new Set(items.map(item => item.category_name))];

            // 2. Рендерим кнопки категорий
            if (categoryFilters) {
                categoryFilters.innerHTML = categories.map(cat => `
                    <button class="button button--outline category-btn ${cat === 'Все' ? 'active-category' : ''}" data-category="${cat}">
                        ${cat}
                    </button>
                `).join("");

                // 3. Добавляем обработчики кликов
                const buttons = categoryFilters.querySelectorAll(".category-btn");
                buttons.forEach(btn => {
                    btn.addEventListener("click", () => {
                        // Убираем активный класс у всех кнопок
                        buttons.forEach(b => b.classList.remove("active-category"));

                        // Добавляем активный класс нажатой кнопке
                        btn.classList.add("active-category");

                        const selectedCategory = btn.getAttribute("data-category");
                        renderItems(selectedCategory);
                    });
                });
            }

            // 4. Первичный рендер всех товаров
            renderItems("Все");
        })
        .catch(err => {
            console.error("Ошибка загрузки:", err);
            grid.innerHTML = "<p style='color:red; text-align:center; grid-column:1/-1;'>Не удалось загрузить товары. Проверьте, запущен ли сервер.</p>";
        });

    function renderItems(category) {
        const filteredItems = category === "Все"
            ? allItems
            : allItems.filter(item => item.category_name === category);

        if (filteredItems.length === 0) {
            grid.innerHTML = "<p style='text-align:center; grid-column:1/-1;'>В этой категории пока нет товаров.</p>";
            return;
        }

        const html = filteredItems.map(item => `
            <article class="product-card">
                <div class="product-card__image">
                    <img src="${item.photo}" alt="${item.name}">
                </div>
                <h3 class="product-card__title">${item.name}</h3>
                <p class="product-card__description">
                    <strong>Цена:</strong> ${Number(item.price).toFixed(2)} ₽<br>
                    <strong>Категория:</strong> ${item.category_name}
                </p>
            </article>
        `).join("");
        grid.innerHTML = html;
    }
});
