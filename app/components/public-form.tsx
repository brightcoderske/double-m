"use client";
import { FormEvent, useState } from "react";

export function PublicForm({ kind }: { kind: "candidate" | "employer" }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/${kind === "candidate" ? "auth/register" : "staffing-requests"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      if (!response.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }
  if (state === "done")
    return (
      <div className="form-success">
        <h2>Thank you. We’ve received your details.</h2>
        <p>
          {kind === "candidate"
            ? "Check your email to verify your account and continue your profile."
            : "Our team will review your request and contact you through your preferred channel."}
        </p>
      </div>
    );
  return (
    <form className="public-form" onSubmit={submit}>
      <div className="field-grid">
        <label>
          Full name
          <input name="fullName" autoComplete="name" required minLength={2} />
        </label>
        <label>
          Phone number
          <input name="phone" autoComplete="tel" required />
        </label>
      </div>
      <label>
        Email address
        <input name="email" type="email" autoComplete="email" required />
      </label>
      {kind === "candidate" ? (
        <>
          <label>
            Create password
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
            />
            <small>At least 10 characters.</small>
          </label>
          <div className="field-grid">
            <label>
              Main profession
              <input name="profession" required placeholder="e.g. Caregiver" />
            </label>
            <label>
              Current location
              <input name="location" required />
            </label>
          </div>
          <label className="consent">
            <input
              type="checkbox"
              name="privacyConsent"
              value="true"
              required
            />{" "}
            I agree to the privacy notice and the use of my details for
            recruitment.
          </label>
        </>
      ) : (
        <>
          <div className="field-grid">
            <label>
              Worker or role needed
              <input name="roleNeeded" required />
            </label>
            <label>
              Work location
              <input name="location" required />
            </label>
          </div>
          <label>
            Tell us what you need
            <textarea name="requirements" required minLength={20} rows={5} />
          </label>
          <label>
            Preferred contact
            <select name="preferredContact">
              <option value="phone">Phone call</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </label>
          <label className="consent">
            <input
              type="checkbox"
              name="privacyConsent"
              value="true"
              required
            />{" "}
            I agree to the privacy notice and to being contacted about this
            request.
          </label>
        </>
      )}
      <button className="button dark" disabled={state === "sending"}>
        {state === "sending"
          ? "Sending securely…"
          : kind === "candidate"
            ? "Create my profile"
            : "Submit staffing request"}
      </button>
      {state === "error" && (
        <p className="form-error">
          We couldn’t send this yet. Please check that the secure API is
          running, then try again.
        </p>
      )}
    </form>
  );
}
