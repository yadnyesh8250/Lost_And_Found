import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";

const DB_NAME = process.env.DB_NAME || "campus_sync";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "NIRAJ8250@123";
const DB_HOST = process.env.DB_HOST || "localhost";


try {
  const conn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await conn.end();
} catch (err) {
  // If creation fails, rethrow — Sequelize will also fail and provide details.
  console.error("Error ensuring database exists:", err.message);
  throw err;
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});
export default sequelize;