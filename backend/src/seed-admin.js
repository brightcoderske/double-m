import argon2 from "argon2";
import { db } from "./db.js";

const email = "admin@doublemagency.co.ke";
const temporaryPassword = process.env.ADMIN_SEED_PASSWORD;

if (!temporaryPassword) {
  throw new Error(
    "ADMIN_SEED_PASSWORD is required. Set it temporarily before running this command.",
  );
}

if (
  temporaryPassword.length < 8 ||
  !/[A-Z]/.test(temporaryPassword) ||
  !/[a-z]/.test(temporaryPassword) ||
  !/[0-9]/.test(temporaryPassword)
) {
  throw new Error(
    "ADMIN_SEED_PASSWORD must contain at least 8 characters, an uppercase letter, a lowercase letter and a number.",
  );
}

const passwordHash = await argon2.hash(temporaryPassword, {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
});

const connection = await db().getConnection();
try {
  await connection.beginTransaction();
  await connection.execute(
    `INSERT INTO users
      (email,password_hash,role,status,email_verified_at,force_password_change)
     VALUES (?,?,'administrator','active',UTC_TIMESTAMP(),TRUE)
     ON DUPLICATE KEY UPDATE
       password_hash=VALUES(password_hash),
       role='administrator',
       status='active',
       email_verified_at=COALESCE(email_verified_at,UTC_TIMESTAMP()),
       force_password_change=TRUE`,
    [email, passwordHash],
  );
  await connection.commit();
  console.log(
    `Administrator ${email} is active. A password change is required after sign-in.`,
  );
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
  await db().end();
}
