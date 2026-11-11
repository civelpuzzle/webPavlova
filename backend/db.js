const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Lev01234!",
    database: "web4pz",
    port: 3306,
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
