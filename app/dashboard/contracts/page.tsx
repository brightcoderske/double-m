"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
export default function Contracts() {
  const [options, setOptions] = useState<any>(null),
    [contracts, setContracts] = useState<any[]>([]),
    [message, setMessage] = useState("");
  async function load() {
    const [o, c] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/contract-options`, {
        credentials: "include",
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/contracts`, {
        credentials: "include",
      }),
    ]);
    if (o.ok) setOptions(await o.json());
    if (c.ok) setContracts((await c.json()).contracts);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      jobId = f.get("jobId");
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/staff/contracts`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerUserId: f.get("employerUserId"),
          candidateUserId: f.get("candidateUserId"),
          jobId: jobId ? Number(jobId) : undefined,
          roleTitle: f.get("roleTitle"),
          startDate: f.get("startDate"),
          endDate: f.get("endDate") || undefined,
          send: true,
        }),
      },
    );
    setMessage((await r.json()).message);
    if (r.ok) {
      e.currentTarget.reset();
      void load();
    }
  }
  return (
    <main className="admin-controls">
      <header>
        <Link href="/dashboard">← Dashboard</Link>
        <span>Employment agreements</span>
        <h1>Contract register</h1>
        <p>
          Create the same controlled agreement whether registration happened
          online or at the office. Choose the actual job when one exists.
        </p>
      </header>
      <div className="admin-grid">
        <form onSubmit={submit}>
          <h2>Create and send</h2>
          {!options?.template && (
            <p>An administrator must save contract terms first.</p>
          )}
          <label>
            Employer
            <select name="employerUserId" required>
              <option value="">Choose employer</option>
              {options?.employers.map((x: any) => (
                <option value={x.id} key={x.id}>
                  {x.full_name || x.email}
                </option>
              ))}
            </select>
          </label>
          <label>
            Employee / candidate
            <select name="candidateUserId" required>
              <option value="">Choose employee</option>
              {options?.candidates.map((x: any) => (
                <option value={x.id} key={x.id}>
                  {x.full_name || x.email}
                </option>
              ))}
            </select>
          </label>
          <label>
            Job being taken
            <select name="jobId">
              <option value="">Onsite/direct placement</option>
              {options?.jobs.map((x: any) => (
                <option value={x.id} key={x.id}>
                  {x.reference_code} · {x.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Role title
            <input name="roleTitle" required />
          </label>
          <label>
            Start date
            <input name="startDate" type="date" required />
          </label>
          <label>
            End date (optional)
            <input name="endDate" type="date" />
          </label>
          <button disabled={!options?.template}>
            Create and send contract
          </button>
        </form>
        <section className="dash-panel">
          <div className="panel-heading">
            <h2>All contracts</h2>
            <span>{contracts.length}</span>
          </div>
          <div className="simple-rows">
            {contracts.map((c) => (
              <div key={c.id}>
                <b>
                  {c.contract_number} · {c.role_title}
                  <small>
                    {c.job_reference
                      ? `Job ${c.job_reference}`
                      : "Direct placement"}
                  </small>
                </b>
                <span>{c.status.replaceAll("_", " ")}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      {message && <div className="admin-toast">{message}</div>}
    </main>
  );
}
