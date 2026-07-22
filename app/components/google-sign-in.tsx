"use client";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (result: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}
export function GoogleSignIn({ role }: { role?: "candidate" | "employer" }) {
  const router = useRouter(),
    container = useRef<HTMLDivElement>(null),
    [error, setError] = useState("");
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const ready = useCallback(() => {
    if (!clientId) {
      return;
    }
    if (!container.current || !window.google) return;
    container.current.replaceChildren();
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential, role }),
            },
          ),
          body = await response.json();
        if (response.ok) router.push("/dashboard");
        else setError(body.message);
      },
    });
    window.google.accounts.id.renderButton(container.current, {
      theme: "outline",
      size: "large",
      width: 320,
      text: role ? "signup_with" : "signin_with",
    });
  }, [clientId, role, router]);
  return (
    <div className="google-auth-block">
      <div className="auth-divider">
        <span>or</span>
      </div>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={ready}
        onReady={ready}
        onError={() =>
          setError("Google could not load. Please refresh and try again.")
        }
      />
      <div className="google-button" ref={container} />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
