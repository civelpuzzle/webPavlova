const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Lev01234!",
  database: "web4pz",
  port:3306
});

connection.connect((err) => {
  if (err) {
    console.log("Ошибка подключения");
    return;
  }

  console.log("Подключение успешно");
});

module.exports = connection;
