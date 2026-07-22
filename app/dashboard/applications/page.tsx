"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ApplicationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/applications`, {
      credentials: "include",
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.message);
        setItems(body.applications);
      })
      .catch((caught) => setError(caught.message));
  }, []);
  return (
    <main className="workspace-page">
      <header>
        <Link href="/dashboard">← Dashboard</Link>
        <span>Candidate workspace</span>
        <h1>My applications</h1>
        <p>
          Follow every application from receipt through review and placement.
        </p>
      </header>
      {error && <p className="form-error">{error}</p>}
      <section className="dash-panel">
        {items.filter(
          (item) => !["rejected", "not_selected"].includes(item.status),
        ).length ? (
          <div className="payment-table-wrap">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Opportunity</th>
                  <th>Location</th>
                  <th>Work type</th>
                  <th>Progress</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {items
                  .filter(
                    (item) =>
                      !["rejected", "not_selected"].includes(item.status),
                  )
                  .map((item) => (
                    <tr key={item.id}>
                      <td>
                        <b>{item.title || "Private agency opportunity"}</b>
                        <small>
                          {item.reference_code || "Agency matching"}
                        </small>
                      </td>
                      <td>{item.location || "Shared during matching"}</td>
                      <td>
                        {item.employment_type?.replaceAll("_", " ") ||
                          "To be agreed"}
                      </td>
                      <td>
                        <b className={`status-${item.status}`}>
                          {friendlyStatus(item.status)}
                        </b>
                      </td>
                      <td>{new Date(item.updated_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="panel-empty">
            <h2>No applications yet</h2>
            <p>Explore verified jobs and apply using your saved profile.</p>
            <Link className="button dark" href="/jobs">
              View available jobs
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

function friendlyStatus(status: string) {
  return (
    (
      {
        submitted: "Application received",
        under_review: "Under agency review",
        shortlisted: "Shortlisted",
        interview: "Interview stage",
        offered: "Placement offered",
        placed: "Placement confirmed",
      } as Record<string, string>
    )[status] || status.replaceAll("_", " ")
  );
}
