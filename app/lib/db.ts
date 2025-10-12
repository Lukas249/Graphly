"server-only";

import mysql from "mysql2/promise";

const pool = await mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "user",
  password: process.env.MYSQL_PASSWORD || "Asaasa12",
  database: process.env.MYSQL_DATABASE || "nextjs_db",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
