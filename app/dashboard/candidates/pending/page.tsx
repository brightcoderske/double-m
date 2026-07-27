"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Download, Eye, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const api = process.env.NEXT_PUBLIC_API_URL;

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
  const [selected, setSelected] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const response = await fetch(`${api}/staff/candidate-approvals`, {
      credentials: "include",
    });
    const body = await response.json();
    if (response.ok) setItems(body.candidates || []);
    else setMessage(body.message);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function openCandidate(candidateId: number) {
    setMessage("Loading candidate record…");
    const response = await fetch(`${api}/staff/candidates/${candidateId}`, {
      credentials: "include",
    });
    const body = await response.json();
    if (response.ok) {
      setSelected(body);
      setMessage("");
    } else setMessage(body.message);
  }

  async function reviewDocument(documentId: number, status: string) {
    const response = await fetch(
      `${api}/staff/documents/${documentId}/status`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );
    const body = await response.json();
    setMessage(body.message);
    if (response.ok && selected) {
      await openCandidate(selected.profile.user_id);
      await load();
    }
  }

  async function reviewCandidate(status: "approved" | "needs_documents") {
    if (!selected) return;
    const note =
      status === "needs_documents"
        ? window.prompt("What should the candidate upload or correct?") || ""
        : "";
    if (status === "needs_documents" && !note) return;
    const response = await fetch(
      `${api}/staff/candidates/${selected.profile.user_id}/approval`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      },
    );
    const body = await response.json();
    setMessage(body.message);
    if (response.ok) {
      setSelected(null);
      await load();
    }
  }

  const visible = items.filter((item) =>
    `${item.full_name} ${item.email} ${item.phone} ${item.profession} ${item.location}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <main className="admin-controls candidate-approval-page">
      <header>
        <Link href="/dashboard">← Dashboard</Link>
        <span>Candidate review</span>
        <h1>Pending candidate approvals</h1>
      </header>
      <section className="dash-panel">
        <div className="table-filters">
          <input
            type="search"
            placeholder="Search name, phone, email, role or location"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span>{visible.length} awaiting attention</span>
        </div>
        <div className="table-scroll">
          <table className="operations-table approval-register">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Role & location</th>
                <th>Profile</th>
                <th>Documents</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((candidate) => (
                <tr key={candidate.user_id}>
                  <td>
                    <button
                      className="table-name-link"
                      onClick={() => openCandidate(candidate.user_id)}
                    >
                      {candidate.full_name}
                    </button>
                    <small>
                      {candidate.email}
                      <br />
                      {candidate.phone}
                    </small>
                  </td>
                  <td>
                    <b>{candidate.profession}</b>
                    <small>{candidate.location}</small>
                  </td>
                  <td>
                    <b>{candidate.profile_completion}%</b>
                    <small>complete</small>
                  </td>
                  <td>
                    <b>
                      {candidate.verified_document_count || 0}/
                      {candidate.document_count || 0}
                    </b>
                    <small>approved</small>
                  </td>
                  <td>
                    <span
                      className={`table-status status-${candidate.agency_approval_status}`}
                    >
                      {candidate.agency_approval_status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td>
                    <button
                      className="table-action"
                      onClick={() => openCandidate(candidate.user_id)}
                    >
                      <Eye /> Review
                    </button>
                  </td>
                </tr>
              ))}
              {!visible.length && (
                <tr>
                  <td colSpan={6}>No candidates need approval.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
          <section
            className="job-editor-modal candidate-review-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="candidate-review-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span>Candidate approval</span>
                <h2 id="candidate-review-title">
                  {selected.profile.full_name}
                </h2>
              </div>
              <button aria-label="Close" onClick={() => setSelected(null)}>
                <X />
              </button>
            </header>

            <div className="candidate-review-facts">
              <span>
                <small>Email</small>
                {selected.profile.email}
              </span>
              <span>
                <small>Phone</small>
                {selected.profile.phone}
              </span>
              <span>
                <small>Role</small>
                {selected.profile.profession}
              </span>
              <span>
                <small>Location</small>
                {selected.profile.location}
              </span>
              <span>
                <small>Profile strength</small>
                {selected.profile.profile_completion}%
              </span>
              <span>
                <small>Email</small>
                {selected.profile.email_verified_at ? "Verified" : "Pending"}
              </span>
            </div>

            <div className="modal-table-wrap">
              <table className="operations-table document-approval-table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Preview</th>
                    <th>Status</th>
                    <th>Approval</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.documents.map((document: any) => (
                    <tr key={document.id}>
                      <td>
                        <b>{document.document_type.replaceAll("_", " ")}</b>
                        <small>{document.original_name}</small>
                      </td>
                      <td>
                        <button
                          className="document-preview-button"
                          onClick={() => setPreview(document)}
                        >
                          {document.mime_type?.startsWith("image/") ? (
                            // Protected thumbnail. Full preview is opened in-app.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`${api}/documents/${document.id}/preview`}
                              alt=""
                            />
                          ) : (
                            <Eye />
                          )}
                          <span>Open</span>
                        </button>
                      </td>
                      <td>
                        <span className={`table-status status-${document.status}`}>
                          {document.status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td>
                        <div className="table-button-group">
                          <button
                            onClick={() =>
                              reviewDocument(document.id, "verified")
                            }
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              reviewDocument(document.id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!selected.documents.length && (
                    <tr>
                      <td colSpan={4}>No documents uploaded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="modal-actions">
              <Link
                href={`/dashboard/admin/users/${selected.profile.user_id}`}
              >
                Edit profile
              </Link>
              <button onClick={() => reviewCandidate("needs_documents")}>
                Request documents
              </button>
              <button
                className="button dark"
                onClick={() => reviewCandidate("approved")}
              >
                Approve candidate
              </button>
            </footer>
          </section>
        </div>
      )}

      {preview && (
        <div className="modal-backdrop document-preview-backdrop">
          <section
            className="document-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Preview ${preview.original_name}`}
          >
            <header>
              <div>
                <span>{preview.document_type.replaceAll("_", " ")}</span>
                <h2>{preview.original_name}</h2>
              </div>
              <button aria-label="Close preview" onClick={() => setPreview(null)}>
                <X />
              </button>
            </header>
            <iframe
              title={preview.original_name}
              src={`${api}/documents/${preview.id}/preview`}
            />
            <footer>
              <a
                className="button dark"
                href={`${api}/documents/${preview.id}/preview?download=1`}
              >
                <Download /> Download
              </a>
              <button onClick={() => setPreview(null)}>Close</button>
            </footer>
          </section>
        </div>
      )}
      {message && <div className="admin-toast">{message}</div>}
    </main>
  );
}
