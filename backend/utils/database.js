import { Pool } from "pg";
import config from "../config.js";

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("Database connection error:", err.stack);
  } else {
    console.log("Database connected successfully");
  }
});

export default pool;
