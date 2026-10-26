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

app.listen(3000, () => {
    console.log("Сервер запущен");
});
