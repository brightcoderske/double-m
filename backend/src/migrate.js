import fs from "node:fs/promises";
import mysql from "mysql2/promise";
import { config } from "./config.js";
const admin = await mysql.createConnection({
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  user: config.DATABASE_USER,
  password: config.DATABASE_PASSWORD,
  multipleStatements: true,
});
await admin.query(
  `CREATE DATABASE IF NOT EXISTS \`${config.DATABASE_NAME.replaceAll("`", "")}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
);
await admin.changeUser({ database: config.DATABASE_NAME });
const initial = await fs.readFile(
  new URL("../sql/001_initial.sql", import.meta.url),
  "utf8",
);
await admin.query(initial);
const [columns] = await admin.query(
  "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME='users' AND COLUMN_NAME='force_password_change'",
  [config.DATABASE_NAME],
);
if (!columns.length)
  await admin.query(
    "ALTER TABLE users ADD COLUMN force_password_change BOOLEAN NOT NULL DEFAULT FALSE",
  );
for (const file of ["002_operations.sql", "003_admin_commerce.sql"]) {
  const sql = await fs.readFile(
    new URL(`../sql/${file}`, import.meta.url),
    "utf8",
  );
  await admin.query(sql);
}
await admin.end();
console.log("Database schema is current.");
