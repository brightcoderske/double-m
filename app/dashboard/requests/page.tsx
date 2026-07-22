"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useEffect, useState } from "react";

const api = process.env.NEXT_PUBLIC_API_URL;

export default function EmployerRequests() {
  const [data, setData] = useState<any>({ profile: null, requests: [] });
  const [message, setMessage] = useState("");
  async function load() {
    const response = await fetch(`${api}/client/staffing-requests`, {
      credentials: "include",
    });
    const body = await response.json();
    if (response.ok) setData(body);
    else setMessage(body.message);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Sending your request securely…");
    const form = event.currentTarget;
    const response = await fetch(`${api}/client/staffing-requests`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const body = await response.json();
    setMessage(body.issues?.[0]?.message || body.message);
    if (response.ok) {
      form.reset();
      await load();
    }
  }
  return (
    <main className="workspace-page employer-requests-page">
      <header>
        <span>Employer request</span>
        <h1>Request the right worker.</h1>
        <p>
          Your name, contact and account are attached automatically. Tell us
          only what matters for this role.
        </p>
      </header>
      <div className="request-workspace-grid">
        <form className="dash-panel" onSubmit={submit}>
          <h2>New staffing request</h2>
          <div className="field-grid">
            <label>
              Account name
              <input value={data.profile?.full_name || ""} readOnly />
            </label>
            <label>
              Account email
              <input value={data.profile?.email || ""} readOnly />
            </label>
          </div>
          <label>
            Worker or role needed
            <input
              name="roleNeeded"
              required
              placeholder="e.g. dayburg nanny, househelp or shop attendant"
            />
          </label>
          <label>
            Work location
            <input name="location" required placeholder="Estate or town" />
          </label>
          <label>
            Main duties and expectations
            <textarea name="requirements" required minLength={20} rows={5} />
          </label>
          <label>
            Preferred contact
            <select name="preferredContact">
              <option value="phone">Phone call</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
          </label>
          <label className="consent">
            <input
              type="checkbox"
              name="privacyConsent"
              value="true"
              required
            />
            I confirm that this request is accurate and may be used for agency
            recruitment and matching.
          </label>
          <button>Submit and track request</button>
        </form>
        <section className="dash-panel">
          <div className="panel-heading">
            <h2>My requests</h2>
            <span>{data.requests.length}</span>
          </div>
          <div className="request-status-list">
            {data.requests.map((request: any) => (
              <article key={request.id}>
                <div>
                  <b>{request.role_needed}</b>
                  <small>
                    {request.reference_code} · {request.location}
                  </small>
                </div>
                <span className={`status-${request.status}`}>
                  {request.status.replaceAll("_", " ")}
                </span>
                {request.job_reference && (
                  <p>
                    Vacancy {request.job_reference} · {request.job_status}
                  </p>
                )}
              </article>
            ))}
            {!data.requests.length && (
              <p className="document-note">
                Your submitted requests and their progress will appear here.
              </p>
            )}
          </div>
        </section>
      </div>
      {message && <div className="admin-toast">{message}</div>}
    </main>
  );
}
