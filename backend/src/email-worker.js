import nodemailer from "nodemailer";
import { config } from "./config.js";
import { db } from "./db.js";
if (!config.SMTP_HOST) {
  console.error(
    "SMTP_HOST is not configured; queued emails remain safely pending.",
  );
  process.exit(1);
}
const transport = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_SECURE === "true",
  auth: config.SMTP_USER
    ? { user: config.SMTP_USER, pass: config.SMTP_PASSWORD }
    : undefined,
});
async function work() {
  const [rows] = await db().execute(
    "SELECT id,recipient,subject,html FROM email_outbox WHERE status='pending' AND available_at<=UTC_TIMESTAMP() ORDER BY id LIMIT 20",
  );
  for (const mail of rows) {
    await db().execute(
      "UPDATE email_outbox SET status='sending',attempts=attempts+1 WHERE id=? AND status='pending'",
      [mail.id],
    );
    try {
      await transport.sendMail({
        from: config.EMAIL_FROM,
        to: mail.recipient,
        subject: mail.subject,
        html: mail.html,
      });
      await db().execute(
        "UPDATE email_outbox SET status='sent',sent_at=UTC_TIMESTAMP(),last_error=NULL WHERE id=?",
        [mail.id],
      );
    } catch (e) {
      await db().execute(
        "UPDATE email_outbox SET status=IF(attempts>=5,'failed','pending'),available_at=DATE_ADD(UTC_TIMESTAMP(),INTERVAL 10 MINUTE),last_error=? WHERE id=?",
        [String(e.message).slice(0, 1000), mail.id],
      );
    }
  }
}
await work();
await db().end();
