const mysql = require("mysql2");

const connectionPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: null,
  database: "web_task_collections",
  connectionLimit: 5,
});

module.exports = connectionPool;