"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { SimpleHeader } from "../components/simple-header";
export default function Forgot() {
  const [message, setMessage] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Requesting a secure link…");
    const email = String(new FormData(e.currentTarget).get("email"));
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    setMessage((await r.json()).message);
  }
  return (
    <>
      <SimpleHeader />
      <main className="login-page">
        <form className="form-panel" onSubmit={submit}>
          <h1>Reset your password</h1>
          <p>We will email a one-time link that expires after 30 minutes.</p>
          <label>
            Email address
            <input name="email" type="email" required />
          </label>
          <button className="button dark">Email my reset link</button>
          {message && <p role="status">{message}</p>}
          <p>
            <Link href="/login">Return to sign in</Link>
          </p>
        </form>
      </main>
    </>
  );
}
