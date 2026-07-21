"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
const starter = `<h2>Employment agreement</h2><p>This agreement is made on <strong>{{contract_date}}</strong> between <strong>{{employer_name}}</strong> and <strong>{{candidate_name}}</strong>.</p><h3>Role</h3><p>The employee will serve as <strong>{{role_title}}</strong> from {{start_date}} to {{end_date}}.</p><h3>Terms</h3><p>The parties agree to the duties, lawful working conditions, pay, time off, confidentiality and termination terms confirmed during placement.</p>`;
export default function ContractTerms() {
  const [terms, setTerms] = useState(starter),
    [name, setName] = useState("Standard employment agreement"),
    [message, setMessage] = useState("");
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contract-template`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : {}))
      .then((x: { template?: { name: string; terms_html: string } }) => {
        if (x.template) {
          setName(x.template.name);
          setTerms(x.template.terms_html);
        }
      });
  }, []);
  async function submit(e: FormEvent) {
    e.preventDefault();
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/contract-template`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, termsHtml: terms }),
      },
    );
    setMessage((await r.json()).message);
  }
  return (
    <main className="admin-controls">
      <header>
        <Link href="/dashboard/admin">← System controls</Link>
        <span>Version-controlled terms</span>
        <h1>Contract template</h1>
        <p>
          Allowed merge fields: employer_name, candidate_name, role_title,
          start_date, end_date and contract_date, each inside double curly
          brackets. Existing contracts never change when this template changes.
        </p>
      </header>
      <div className="admin-grid">
        <form onSubmit={submit}>
          <label>
            Template name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Rich HTML terms
            <textarea
              rows={20}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </label>
          <button>Save new template version</button>
        </form>
        <section className="dash-panel contract-preview">
          <h2>Isolated preview</h2>
          <iframe title="Contract preview" sandbox="" srcDoc={terms} />
        </section>
      </div>
      {message && <div className="admin-toast">{message}</div>}
    </main>
  );
}
