const express = require("express");
const db = require("./db");
const path = require("path");

const app = express();

// SELECT * FROM items
// SELECT i.id_item, i.name, i.price, i.stock_balance, i.id_supplier, c.name 'category_name' FROM items i JOIN categories c ON c.id_category = i.id_category

app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(express.static(path.join(__dirname, "..", "image")));
app.use(express.json());

app.get("/items", (req, res) => {
  db.query(
    "SELECT i.id_item, i.name, i.price, c.name 'category_name', i.photo FROM items i JOIN categories c ON c.id_category = i.id_category", (err, results) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }
      res.json(results);
  }
  );
});

app.post("/createAppMini", async (req, res) => {
  const { first_name, phone } = req.body;

  if (!first_name || !phone) {
    return res.status(400).json({
      message: "Необходимо заполнить все поля"
    });
  }

  try {
    // Вызываем .promise() перед .query()
    await db.promise().query(
      "INSERT INTO applications (first_name, phone) VALUES (?, ?)",
      [first_name, phone]
    );

    return res.status(201).json({
      message: "Заявка успешно создана"
    });

  } catch (error) {
    console.error("Ошибка при вставке в БД:", error);
    return res.status(500).json({
      message: "Внутренняя ошибка сервера"
    });
  }
});

app.listen(3000, () => {
  console.log("Сервер запущен");
  console.log("http://localhost:3000/")
});
