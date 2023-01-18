const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "몰?루", //비밀번호 바꿔서 사용
    database: "opentutorials",
});

connection.connect();

connection.query("SELECT * FROM topic", function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});

connection.end();
