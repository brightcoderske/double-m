"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Candidate = {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  profession: string;
  location: string;
  profile_completion: number;
  agency_approval_status: string;
  document_count: number;
  verified_document_count: number;
};

export default function PendingCandidates() {
  const [items, setItems] = useState<Candidate[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/candidate-approvals`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((body) => setItems(body.candidates || []))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const visible = items.filter((item) =>
    `${item.full_name} ${item.email} ${item.phone} ${item.profession} ${item.location}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <main className="admin-controls">
      <header>
        <Link href="/dashboard">← Dashboard</Link>
        <span>Candidate review</span>
        <h1>Pending candidate approvals</h1>
      </header>
      <section className="dash-panel">
        <div className="table-filters">
          <input
            type="search"
            placeholder="Search candidates"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span>{visible.length} awaiting attention</span>
        </div>
        <div className="table-scroll">
          <table className="operations-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Role</th>
                <th>Location</th>
                <th>Profile</th>
                <th>Documents</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((candidate) => (
                <tr key={candidate.user_id}>
                  <td>
                    <Link href={`/dashboard/candidates/${candidate.user_id}`}>
                      <b>{candidate.full_name}</b>
                    </Link>
                    <small>{candidate.email} · {candidate.phone}</small>
                  </td>
                  <td>{candidate.profession}</td>
                  <td>{candidate.location}</td>
                  <td>{candidate.profile_completion}%</td>
                  <td>{candidate.verified_document_count || 0}/{candidate.document_count || 0} approved</td>
                  <td>
                    <span className={`table-status status-${candidate.agency_approval_status}`}>
                      {candidate.agency_approval_status.replaceAll("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
              {!visible.length && (
                <tr><td colSpan={6}>No candidates need approval.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
