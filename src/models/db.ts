import * as mysql from "mysql2";
import config from "../config.json";

export const pool = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASS,
  database: config.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  idleTimeout: 60_000,
  queueLimit: 0,
});
