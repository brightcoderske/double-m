"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
export default function MyContracts() {
  const [items, setItems] = useState<any[]>([]),
    [selected, setSelected] = useState<any>(null),
    [message, setMessage] = useState("");
  async function load() {
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contracts`, {
      credentials: "include",
    });
    if (r.ok) setItems((await r.json()).contracts);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);
  async function open(id: number) {
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contracts/${id}`,
      { credentials: "include" },
    );
    if (r.ok) setSelected((await r.json()).contract);
  }
  async function sign(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contracts/${selected.id}/sign`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedName: f.get("signedName"),
          accepted: true,
        }),
      },
    );
    setMessage((await r.json()).message);
    if (r.ok) {
      setSelected(null);
      void load();
    }
  }
  return (
    <main className="admin-controls">
      <header>
        <Link href="/dashboard">← Dashboard</Link>
        <span>Private agreements</span>
        <h1>My contracts</h1>
        <p>
          Read the complete agreement before accepting. Your acceptance, name
          and time are recorded against the unchanged contract version.
        </p>
      </header>
      <section className="dash-panel">
        <div className="simple-rows">
          {items.map((c) => (
            <div key={c.id}>
              <b>
                {c.contract_number} · {c.role_title}
                <small>
                  {c.job_reference
                    ? `Job ${c.job_reference}`
                    : "Direct placement"}
                </small>
              </b>
              <button onClick={() => open(c.id)}>
                {c.status === "fully_signed" ? "View signed" : "Review & sign"}
              </button>
            </div>
          ))}
        </div>
      </section>
      {selected && (
        <section className="contract-dialog">
          <div>
            <button onClick={() => setSelected(null)}>Close</button>
            <h2>{selected.contract_number}</h2>
            <iframe
              title="Contract terms"
              sandbox=""
              srcDoc={selected.terms_snapshot}
            />
            <form onSubmit={sign}>
              <label>
                Type your full legal name
                <input name="signedName" required />
              </label>
              <label className="contract-consent">
                <input type="checkbox" required /> I have read and accept this
                agreement.
              </label>
              <button>Accept and sign</button>
            </form>
          </div>
        </section>
      )}
      {message && <div className="admin-toast">{message}</div>}
    </main>
  );
}
