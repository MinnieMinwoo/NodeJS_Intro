const mysql = require("mysql");

const db = mysql.createConnection({
    host: "",
    user: "",
    password: "", // 비밀번호 재설정 필요
    database: "",
});
db.connect();

module.exports = db;
