const mysql = require("mysql");

//实际使用中可以在应用启动时进行初始化(只需执行一次)  使用mysql-queries写sql查询
require('mysql-queries').init({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "nau_exam_copy",
  port: 3306
});

module.exports = mysql.createConnection({
  host: "localhost", // 主机名
  port: 3306, // MySQL 默认端口为 3306
  user: "root", // 使用 root 用户登入 MySQL
  password: "12345678", // MySQL 密码，用你自己的
  database: "nau_exam_copy" // 使用数据库
}); // mysql.createConnection 方法创建连接实例
