import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";

const DB_NAME = process.env.DB_NAME || "campus_sync";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "NIRAJ8250@123";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
const DB_URL = process.env.DATABASE_URL || process.env.MYSQL_URL;

const isCloud = Boolean(DB_URL || (DB_HOST !== "localhost" && DB_HOST !== "127.0.0.1"));

// Only attempt automatic database creation on local environment or when permitted
if (!isCloud) {
  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
    });

    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await conn.end();
  } catch (err) {
    console.warn("Notice: Database creation check skipped or failed:", err.message);
  }
}

let sequelize;

if (DB_URL) {
  sequelize = new Sequelize(DB_URL, {
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  const useSSL = process.env.DB_SSL === "true" || isCloud;
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false,
    ...(useSSL
      ? {
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
        }
      : {}),
  });
}

export default sequelize;