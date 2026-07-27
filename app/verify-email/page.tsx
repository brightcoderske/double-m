"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyEmailContent() {
  const token = useSearchParams().get("token");
  const [message, setMessage] = useState(
    token ? "Verifying your email…" : "This verification link is incomplete.",
  );
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (!token) {
      return () => controller.abort();
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await response.json();
        setMessage(body.message);
        setVerified(response.ok);
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          setMessage("Email verification could not be completed.");
      });
    return () => controller.abort();
  }, [token]);

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span>Email verification</span>
        <h1>{verified ? "Email verified" : "Checking your link"}</h1>
        <p>{message}</p>
        {verified && (
          <Link className="button dark" href="/login">
            Sign in
          </Link>
        )}
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="auth-page">Verifying email…</main>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
