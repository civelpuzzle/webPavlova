const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "",
    user: "",
    password: "",
    database: "",
    port: ,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Проверяем подключение при старте
pool.getConnection((err, connection) => {
    if (err) {
        console.log("Ошибка подключения к БД:", err.message);
        return;
    }
    console.log("Подключение к БД успешно");
    connection.release();
});

module.exports = pool;
