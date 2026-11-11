const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");
const path = require("path");

const app = express();
const JWT_SECRET = "secretKey"; // В продакшене вынести в .env

// ===== Статика =====
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(express.static(path.join(__dirname, "..", "image")));
app.use(express.json());

// ===== JWT Middleware =====
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Токен не предоставлен" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Недействительный или просроченный токен" });
    }
}

// ============================================================
//  СУЩЕСТВУЮЩИЕ МАРШРУТЫ (без изменений)
// ============================================================

app.get("/items", (req, res) => {
    db.query(
        "SELECT i.id_item, i.name, i.price, c.name 'category_name', i.photo FROM items i JOIN categories c ON c.id_category = i.id_category",
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        }
    );
});

app.post("/createAppMini", async (req, res) => {
    const { first_name, phone } = req.body;
    if (!first_name || !phone) {
        return res.status(400).json({ message: "Необходимо заполнить все поля" });
    }
    try {
        await db.promise().query(
            "INSERT INTO applications (first_name, phone) VALUES (?, ?)",
            [first_name, phone]
        );
        return res.status(201).json({ message: "Заявка успешно создана" });
    } catch (error) {
        console.error("Ошибка при вставке в БД:", error);
        return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
});

// ============================================================
//  АДМИН-ПАНЕЛЬ: Авторизация
// ============================================================

// Регистрация администратора
app.post("/admin/register", async (req, res) => {
    const { name, password, email, description } = req.body;

    // Валидация
    if (!name || !password) {
        return res.status(400).json({ message: "Имя и пароль обязательны" });
    }

    if (password.length < 4) {
        return res.status(400).json({ message: "Пароль должен быть не менее 4 символов" });
    }

    try {
        // Проверяем, существует ли уже такой админ
        const [existing] = await db.promise().query(
            "SELECT * FROM admin_panel WHERE name = ?",
            [name]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Администратор с таким именем уже существует" });
        }

        // Хешируем пароль (bcrypt, 10 раундов)
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.promise().query(
            "INSERT INTO admin_panel (name, password, email, description) VALUES (?, ?, ?, ?)",
            [name, hashedPassword, email || "Нет почты", description || null]
        );

        res.status(201).json({ message: "Администратор зарегистрирован" });
    } catch (error) {
        console.error("Ошибка регистрации:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Авторизация администратора
app.post("/admin/login", async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
    }

    try {
        const [admins] = await db.promise().query(
            "SELECT * FROM admin_panel WHERE name = ?",
            [name]
        );

        if (admins.length === 0) {
            return res.status(404).json({ message: "Администратор не найден" });
        }

        const admin = admins[0];

        // Сравниваем пароль с хешем
        const match = await bcrypt.compare(password, admin.password);

        if (!match) {
            return res.status(400).json({ message: "Неверный пароль" });
        }

        // Создаём JWT-токен (время жизни — 1 час)
        const token = jwt.sign(
            { id: admin.id_admin, name: admin.name },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Авторизация успешна",
            token: token,
            adminName: admin.name
        });
    } catch (error) {
        console.error("Ошибка авторизации:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ============================================================
//  АДМИН-ПАНЕЛЬ: CRUD товаров (защищённые маршруты)
// ============================================================

// GET — все товары (с названиями категорий и поставщиков)
app.get("/admin/items", verifyToken, async (req, res) => {
    try {
        const [items] = await db.promise().query(
            `SELECT i.id_item, i.name, i.price, i.stock_balance,
                    i.id_category, c.name AS category_name,
                    i.id_supplier, s.name AS supplier_name,
                    i.photo
             FROM items i
             JOIN categories c ON c.id_category = i.id_category
             JOIN suppliers s ON s.id_supplier = i.id_supplier
             ORDER BY i.id_item`
        );
        res.json(items);
    } catch (error) {
        console.error("Ошибка получения товаров:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// POST — создать товар
app.post("/admin/items", verifyToken, async (req, res) => {
    const { name, price, stock_balance, id_category, id_supplier, photo } = req.body;

    if (!name || price == null || stock_balance == null || !id_category || !id_supplier) {
        return res.status(400).json({ message: "Заполните все обязательные поля" });
    }

    try {
        const [result] = await db.promise().query(
            "INSERT INTO items (name, price, stock_balance, id_category, id_supplier, photo) VALUES (?, ?, ?, ?, ?, ?)",
            [name, price, stock_balance, id_category, id_supplier, photo || null]
        );

        res.status(201).json({
            message: "Товар добавлен",
            id: result.insertId
        });
    } catch (error) {
        console.error("Ошибка создания товара:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// PUT — обновить товар
app.put("/admin/items/:id", verifyToken, async (req, res) => {
    const { name, price, stock_balance, id_category, id_supplier, photo } = req.body;
    const itemId = req.params.id;

    if (!name || price == null || stock_balance == null || !id_category || !id_supplier) {
        return res.status(400).json({ message: "Заполните все обязательные поля" });
    }

    try {
        const [result] = await db.promise().query(
            "UPDATE items SET name=?, price=?, stock_balance=?, id_category=?, id_supplier=?, photo=? WHERE id_item=?",
            [name, price, stock_balance, id_category, id_supplier, photo || null, itemId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        res.json({ message: "Товар обновлён" });
    } catch (error) {
        console.error("Ошибка обновления товара:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// DELETE — удалить товар
app.delete("/admin/items/:id", verifyToken, async (req, res) => {
    const itemId = req.params.id;

    try {
        const [result] = await db.promise().query(
            "DELETE FROM items WHERE id_item = ?",
            [itemId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        res.json({ message: "Товар удалён" });
    } catch (error) {
        console.error("Ошибка удаления товара:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ============================================================
//  АДМИН-ПАНЕЛЬ: Справочники (для выпадающих списков)
// ============================================================

// Категории
app.get("/admin/categories", verifyToken, async (req, res) => {
    try {
        const [categories] = await db.promise().query(
            "SELECT id_category, name FROM categories ORDER BY name"
        );
        res.json(categories);
    } catch (error) {
        console.error("Ошибка получения категорий:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Поставщики
app.get("/admin/suppliers", verifyToken, async (req, res) => {
    try {
        const [suppliers] = await db.promise().query(
            "SELECT id_supplier, name FROM suppliers ORDER BY name"
        );
        res.json(suppliers);
    } catch (error) {
        console.error("Ошибка получения поставщиков:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// ===== Запуск сервера =====
app.listen(3000, () => {
    console.log("Сервер запущен");
    console.log("http://localhost:3000/");
    console.log("Админ-панель: http://localhost:3000/admin.html");
});
