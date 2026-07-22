"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useEffect, useState } from "react";

const api = process.env.NEXT_PUBLIC_API_URL;

export default function Matching() {
  const [requests, setRequests] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${api}/staff/recruitment-requests`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { requests: [] }))
      .then((body) => setRequests(body.requests))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  async function open(request: any) {
    setSelected(request);
    setChosen([]);
    setMessage("Reading requirements and comparing approved profile dataâ€¦");
    const response = await fetch(`${api}/staff/matches/${request.id}`, {
      credentials: "include",
    });
    const body = await response.json();
    setMatches(body.matches || []);
    setMessage(body.notice || "");
  }

  async function share() {
    if (!selected?.employer_user_id) {
      setMessage(
        "Link this request to the employer account before sharing a shortlist.",
      );
      return;
    }
    const response = await fetch(`${api}/staff/shortlists`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employerUserId: selected.employer_user_id,
        staffingRequestId: selected.id,
        candidateUserIds: chosen,
      }),
    });
    setMessage((await response.json()).message);
  }

  return (
    <main className="admin-controls">
      <header>
        <Link href="/dashboard">â† Dashboard</Link>
        <span>Human-reviewed matching</span>
        <h1>Candidates and matching</h1>
        <p>
          Choose a live request, compare explainable recommendations and share a
          focused shortlist. Sensitive identity details are never used for
          scoring.
        </p>
      </header>

      <section className="dash-panel register-panel">
        <div className="panel-heading">
          <h2>Open requests</h2>
          <span>{requests.length}</span>
        </div>
        <div className="table-scroll">
          <table className="operations-table">
            <thead>
              <tr>
                <th>Request</th>
                <th>Role</th>
                <th>Location</th>
                <th>Employer requirements</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className={
                    selected?.id === request.id ? "selected-row" : undefined
                  }
                >
                  <td>
                    <b>{request.reference_code}</b>
                  </td>
                  <td>{request.role_needed}</td>
                  <td>{request.location}</td>
                  <td className="requirements-cell">
                    {request.requirements || "Open to agency guidance"}
                  </td>
                  <td>
                    <span className={`table-status status-${request.status}`}>
                      {request.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td>
                    <button
                      className="table-action"
                      onClick={() => open(request)}
                    >
                      Find matches
                    </button>
                  </td>
                </tr>
              ))}
              {!requests.length && (
                <tr>
                  <td colSpan={6}>No open recruitment requests.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dash-panel register-panel">
        <div className="panel-heading">
          <div>
            <span>
              {selected ? selected.reference_code : "Select a request above"}
            </span>
            <h2>Candidate recommendations</h2>
          </div>
          {chosen.length > 0 && (
            <button onClick={share}>Share {chosen.length} with employer</button>
          )}
        </div>
        {selected && (
          <p className="document-note">
            Publishing from the <Link href="/dashboard/jobs">job register</Link>{" "}
            is the approval step and makes the vacancy available for
            applications.
          </p>
        )}
        {matches.length > 0 ? (
          <div className="table-scroll">
            <table className="operations-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Candidate</th>
                  <th>Profession</th>
                  <th>Location</th>
                  <th>Why this match</th>
                  <th>Score</th>
                  <th>Profile</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((item) => (
                  <tr key={item.candidate.user_id}>
                    <td>
                      <input
                        aria-label={`Select ${item.candidate.full_name}`}
                        type="checkbox"
                        checked={chosen.includes(item.candidate.user_id)}
                        disabled={
                          !chosen.includes(item.candidate.user_id) &&
                          chosen.length >= 6
                        }
                        onChange={(event) =>
                          setChosen((current) =>
                            event.target.checked
                              ? [...current, item.candidate.user_id]
                              : current.filter(
                                  (id) => id !== item.candidate.user_id,
                                ),
                          )
                        }
                      />
                    </td>
                    <td>
                      <b>{item.candidate.full_name}</b>
                    </td>
                    <td>{item.candidate.profession}</td>
                    <td>{item.candidate.location}</td>
                    <td className="requirements-cell">
                      {item.reasons.join(" Â· ")}
                    </td>
                    <td>
                      <b>{item.score}%</b>
                    </td>
                    <td>
                      <Link
                        className="table-action"
                        href={`/dashboard/candidates/${item.candidate.user_id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="panel-empty">Choose an open request to begin.</p>
        )}
      </section>
      {message && <div className="admin-toast">{message}</div>}
    </main>
  );
}
