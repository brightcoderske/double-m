import { db } from "./db.js";
import { config } from "./config.js";
import nodemailer from "nodemailer";

const transport = config.SMTP_HOST
  ? nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE === "true",
      auth: config.SMTP_USER
        ? { user: config.SMTP_USER, pass: config.SMTP_PASSWORD }
        : undefined,
    })
  : null;
const escape = (v = "") =>
  String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function frame(preview, heading, body, cta, href) {
  return `<!doctype html><html><body style="margin:0;background:#f5f1eb;font-family:Arial,sans-serif;color:#211723"><div style="display:none">${escape(preview)}</div><div style="max-width:620px;margin:auto;padding:36px 20px"><div style="background:#4b174d;padding:24px 30px;color:white;border-radius:16px 16px 0 0"><b style="letter-spacing:2px">DOUBLE M AGENCY</b></div><div style="background:white;padding:36px 30px;border-radius:0 0 16px 16px"><h1 style="font-family:Georgia,serif;font-size:32px;margin:0 0 18px">${escape(heading)}</h1>${body}<a href="${href}" style="display:inline-block;margin-top:22px;background:#d81b72;color:white;text-decoration:none;padding:14px 20px;border-radius:8px;font-weight:bold">${escape(cta)}</a><p style="margin-top:30px;color:#736b75;font-size:13px;line-height:1.6">Questions? Reply to this email and our team will help. Double M Agency will never promise a job or request payment through an unofficial contact.</p></div></div></body></html>`;
}
export const templates = {
  candidateWelcome: (name) => ({
    subject: "Welcome to Double M Agency — your profile starts here",
    html: frame(
      "Your Double M candidate profile is ready",
      `Welcome, ${name}`,
      `<p style="line-height:1.7">Thank you for trusting us with your job search. Complete your experience, availability and documents so our team can consider you for suitable verified opportunities.</p><p style="line-height:1.7"><b>What happens next:</b> your profile remains private, our staff reviews matches, and no placement decision is made by software alone.</p>`,
      "Complete my profile",
      `${config.APP_URL}/dashboard`,
    ),
  }),
  employerWelcome: (name) => ({
    subject: "Welcome to Double M Agency — let’s find the right person",
    html: frame(
      "Your staffing workspace is ready",
      `Welcome, ${name}`,
      `<p style="line-height:1.7">Your secure employer workspace helps you submit and track staffing requests, review agency-approved shortlists, follow placements and request continued support.</p><p style="line-height:1.7">Tell us what success looks like in the role. Our team will clarify the requirements before introducing candidates.</p>`,
      "Open my workspace",
      `${config.APP_URL}/dashboard`,
    ),
  }),
  staffingRequestReceived: (name, reference, role) => ({
    subject: `Staffing request received: ${reference}`,
    html: frame(
      `Your request ${reference} is now tracked`,
      `Thank you, ${name}`,
      `<p style="line-height:1.7">We have received your request for <b>${escape(role)}</b>. Our team will review the duties, location and timing before approving it for matching.</p><p style="line-height:1.7">You can follow each stage from your employer workspace. We will contact you if anything needs clarification.</p>`,
      "Track my request",
      `${config.APP_URL}/dashboard/requests`,
    ),
  }),
  shortlistReady: (reference, role) => ({
    subject: `Your Double M shortlist is ready: ${reference}`,
    html: frame(
      "Your agency-reviewed shortlist is ready",
      role,
      `<p style="line-height:1.7">Our team has reviewed suitable candidates for request <b>${escape(reference)}</b>. Sign in to compare the approved summaries and tell us who you would like to interview.</p>`,
      "Review my shortlist",
      `${config.APP_URL}/dashboard`,
    ),
  }),
  staffingRequestApproved: (reference, role) => ({
    subject: `Your staffing request is approved: ${reference}`,
    html: frame(
      "Your request is moving to matching",
      role,
      `<p style="line-height:1.7">Request <b>${escape(reference)}</b> has been reviewed and approved. The role is now available to suitable candidates while our team continues screening and matching.</p>`,
      "Track request progress",
      `${config.APP_URL}/dashboard/requests`,
    ),
  }),
  jobAlert: (title, location) => ({
    subject: `New verified opportunity: ${title}`,
    html: frame(
      "A role may fit your profile",
      title,
      `<p style="line-height:1.7">A new opportunity in <b>${escape(location)}</b> has been published by Double M Agency. Review the full requirements before applying.</p>`,
      "View opportunity",
      `${config.APP_URL}/jobs`,
    ),
  }),
  passwordReset: (url) => ({
    subject: "Reset your Double M Agency password",
    html: frame(
      "A secure password reset was requested",
      "Reset your password",
      `<p style="line-height:1.7">Use the secure button below within 30 minutes. If you did not request this change, ignore this email; your current password remains unchanged.</p>`,
      "Choose a new password",
      url,
    ),
  }),
};
export async function queueEmail(recipient, message) {
  let emailId = null;
  try {
    const [result] = await db().execute(
      "INSERT INTO email_outbox(recipient,subject,html,status) VALUES(?,?,?,'sending')",
      [recipient, message.subject, message.html],
    );
    emailId = result.insertId;

    if (!transport) {
      throw new Error("SMTP is not configured on the backend");
    }

    await transport.sendMail({
      from: config.EMAIL_FROM,
      to: recipient,
      subject: message.subject,
      html: message.html,
    });
    await db().execute(
      "UPDATE email_outbox SET status='sent',attempts=1,sent_at=UTC_TIMESTAMP(),last_error=NULL WHERE id=?",
      [emailId],
    );
    return { sent: true, id: emailId };
  } catch (error) {
    const reason = String(error?.message || error).slice(0, 1000);
    if (emailId) {
      try {
        await db().execute(
          "UPDATE email_outbox SET status='failed',attempts=1,last_error=? WHERE id=?",
          [reason, emailId],
        );
      } catch (auditError) {
        console.error("Could not record email delivery failure", auditError);
      }
    }
    console.error(
      `Immediate email delivery failed for ${recipient}: ${reason}`,
    );
    return { sent: false, id: emailId, error: reason };
  }
}
