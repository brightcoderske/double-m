"use client";
import { FormEvent, useState } from "react";
import { PasswordField } from "./password-field";
export function EmployerAccountForm() {
  const [status, setStatus] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending…");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            accountType: "employer",
            privacyConsent: "true",
          }),
        },
      );
      const b = await r.json();
      setStatus(
        r.ok
          ? "Account created. Check your email and verify it before signing in."
          : b.issues
                ?.map((issue: { message: string }) => issue.message)
                .join(" ") ||
              b.message ||
              "Registration failed.",
      );
    } catch {
      setStatus("We could not connect securely. Please try again.");
    }
  }
  return (
    <form className="public-form" onSubmit={submit}>
      <label>
        Full name
        <input name="fullName" required />
      </label>
      <div className="field-grid">
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Phone
          <input
            name="phone"
            inputMode="numeric"
            pattern="0[0-9]{9}"
            maxLength={10}
            placeholder="0712345678"
            required
          />
        </label>
      </div>
      <label>
        Location
        <input name="location" required />
      </label>
      <label>
        Create password
        <PasswordField
          name="password"
          minLength={8}
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
          title="Use at least 8 characters with a capital letter, lowercase letter and number."
          required
        />
        <small>
          8+ characters with a capital letter, lowercase letter and number.
        </small>
      </label>
      <label className="consent">
        <input type="checkbox" required /> I accept the privacy notice and
        secure processing of my recruitment records.
      </label>
      <button className="button dark">Create employer workspace</button>
      {status && <p aria-live="polite">{status}</p>}
    </form>
  );
}
