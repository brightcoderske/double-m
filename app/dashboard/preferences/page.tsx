"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
export default function Preferences() {
  const [message, setMessage] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Saving your preferences…");
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const data = {
      ...raw,
      willingToRelocate: raw.willingToRelocate === "true",
    };
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/candidate/preferences`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    setMessage((await r.json()).message);
  }
  return (
    <main className="admin-controls">
      <header>
        <Link href="/dashboard">← Candidate workspace</Link>
        <span>Matching preferences</span>
        <h1>What work fits you best?</h1>
        <p>
          Use plain English. Be accurate—our team verifies profiles before
          recommending anyone.
        </p>
      </header>
      <div className="admin-grid">
        <form onSubmit={submit}>
          <h2>Your work preferences</h2>
          <label>
            What role are you best at?
            <input
              name="bestRole"
              placeholder="For example: elderly caregiver"
            />
          </label>
          <label>
            What other work can you do?
            <textarea
              name="otherRoles"
              placeholder="For example: cooking, light cleaning and shopping support"
              rows={4}
            />
          </label>
          <label>
            Preferred location
            <input name="preferredLocation" />
          </label>
          <label>
            Live-in or live-out?
            <select name="workArrangement">
              <option value="either">Either</option>
              <option value="live_in">Live-in</option>
              <option value="live_out">Live-out</option>
            </select>
          </label>
          <label>
            Type of work
            <select name="employmentType">
              <option value="any">Any suitable type</option>
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </label>
          <label>
            Minimum salary (KES)
            <input name="minimumSalary" type="number" min="0" />
          </label>
          <label>
            Expected salary (KES)
            <input name="expectedSalary" type="number" min="0" />
          </label>
          <label>
            Available from
            <input name="availableFrom" type="date" />
          </label>
          <label>
            Can you relocate?
            <select name="willingToRelocate">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label>
          <button>Save preferences for matching</button>
        </form>
      </div>
      {message && <div className="admin-toast">{message}</div>}
    </main>
  );
}
