import { db } from "./db.js";
import { config } from "./config.js";
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
  await db().execute(
    "INSERT INTO email_outbox(recipient,subject,html) VALUES(?,?,?)",
    [recipient, message.subject, message.html],
  );
}
