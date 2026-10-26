document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("catalogGrid");
    if (!grid) return;

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

            // Рендерим карточки, используя ТОЛЬКО существующие классы из style.css
            const html = items.map(item => `
                <article class="product-card">
                    <div class="product-card__image">
                        <img src="${item.photo}" alt="${item.id_item}">
                    </div>
                    <h3 class="product-card__title">${item.name}</h3>
                    <p class="product-card__description">
                        <strong>Цена:</strong> ${Number(item.price).toFixed(2)} ₽<br>
                        <strong>Категория:</strong> ${item.category_name}<br>
                    </p>
                </article>
            `).join("");

            grid.innerHTML = html;
        })
        .catch(err => {
            console.error("Ошибка загрузки:", err);
            grid.innerHTML = "<p style='color:red; text-align:center; grid-column:1/-1;'>Не удалось загрузить товары. Проверьте, запущен ли сервер.</p>";
        });
});
