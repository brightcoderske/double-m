"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Download, Eye, Search, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
const checkCodes = [
  "phone_call",
  "identity",
  "passport_photo",
  "cv",
  "certificates",
  "references",
  "interview",
  "availability",
];
export default function CandidateReview() {
  const { id } = useParams<{ id: string }>(),
    [data, setData] = useState<any>(null),
    [message, setMessage] = useState(""),
    [query, setQuery] = useState(""),
    [preview, setPreview] = useState<any>(null);
  const load = useCallback(
    async function load() {
      const r = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/staff/candidates/${id}`,
          { credentials: "include" },
        ),
        body = await r.json();
      if (r.ok) setData(body);
      else setMessage(body.message);
    },
    [id],
  );
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  async function update(checkCode: string, status: string) {
    const r = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/staff/candidates/${id}/verification`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            checkCode,
            status,
            note: "Updated during staff review",
          }),
        },
      ),
      body = await r.json();
    setMessage(body.message);
    if (r.ok) void load();
  }
  async function reviewDocument(documentId: number, status: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/staff/documents/${documentId}/status`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );
    const body = await response.json();
    setMessage(body.message);
    if (response.ok) void load();
  }
  async function reviewCandidate(status: string) {
    const note =
      status === "needs_documents"
        ? window.prompt("What should the candidate upload or correct?") || ""
        : "";
    if (status === "needs_documents" && !note) return;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/staff/candidates/${id}/approval`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      },
    );
    const body = await response.json();
    setMessage(body.message);
    if (response.ok) void load();
  }
  if (!data)
    return (
      <main className="admin-controls">
        <p>{message || "Loading protected profile…"}</p>
      </main>
    );
  const documentTypes: Record<string, string[]> = {
    phone_call: [],
    identity: ["national_id"],
    passport_photo: ["passport_photo"],
    cv: ["cv"],
    certificates: ["certificate"],
    references: ["recommendation"],
    interview: [],
    availability: [],
  };
  const mappedTypes = new Set(Object.values(documentTypes).flat());
  const rows = [
    ...checkCodes.flatMap((code) => {
      const check = data.checks.find((item: any) => item.check_code === code);
      const documents = data.documents.filter((document: any) =>
        documentTypes[code].includes(document.document_type),
      );
      return documents.length
        ? documents.map((document: any) => ({ code, check, document }))
        : [{ code, check, document: null }];
    }),
    ...data.documents
      .filter((document: any) => !mappedTypes.has(document.document_type))
      .map((document: any) => ({
        code: "additional_document",
        check: null,
        document,
      })),
  ].filter((row) =>
    `${row.code} ${row.check?.status || "pending"} ${row.document?.document_type || ""} ${row.document?.original_name || ""} ${row.document?.status || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <main className="admin-controls">
      <header>
        <Link href="/dashboard/matching">← Matching workspace</Link>
        <span>Authorised staff review</span>
        <h1>{data.profile.full_name}</h1>
        <p>
          {data.profile.profession} · {data.profile.location} ·{" "}
          {data.profile.email}. Date of birth remains staff-only and is not used
          for matching.
        </p>
        <Link className="button dark" href={`/dashboard/admin/users/${id}`}>
          Edit full profile and documents
        </Link>
        <div className="table-button-group">
          <button onClick={() => reviewCandidate("approved")}>
            Approve candidate
          </button>
          <button onClick={() => reviewCandidate("needs_documents")}>
            Request documents
          </button>
        </div>
      </header>
      <section className="dash-panel verification-register-panel">
        <div className="panel-heading">
          <div>
            <span>Protected candidate evidence</span>
            <h2>Verification and documents</h2>
          </div>
          <span>{data.documents.length} uploaded</span>
        </div>
        <div className="verification-toolbar">
          <Search aria-hidden="true" />
          <input
            type="search"
            placeholder="Search checks or documents"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <small>Previews and downloads are audited.</small>
        </div>
        <div className="table-scroll">
          <table className="operations-table unified-verification-table">
            <thead>
              <tr>
                <th>Check</th>
                <th>Evidence</th>
                <th>Document status</th>
                <th>Verification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ code, check, document }, index) => (
                <tr key={`${code}-${document?.id || index}`}>
                  <td>
                    <b>{code.replaceAll("_", " ")}</b>
                    <small>{document ? "Evidence uploaded" : "No file required or uploaded"}</small>
                  </td>
                  <td>
                    {document ? (
                      <button
                        className="evidence-cell"
                        onClick={() => setPreview(document)}
                      >
                        {document.mime_type?.startsWith("image/") ? (
                          // Protected thumbnail; full preview opens in a modal.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/documents/${document.id}/preview`}
                            alt=""
                          />
                        ) : (
                          <Eye aria-hidden="true" />
                        )}
                        <span>
                          <b>{document.document_type.replaceAll("_", " ")}</b>
                          <small>{document.original_name}</small>
                        </span>
                      </button>
                    ) : (
                      <span className="muted-cell">No document</span>
                    )}
                  </td>
                  <td>
                    {document ? (
                      <span className={`table-status status-${document.status}`}>
                        {document.status.replaceAll("_", " ")}
                      </span>
                    ) : (
                      <span className="muted-cell">—</span>
                    )}
                  </td>
                  <td>
                    {code !== "additional_document" ? (
                      <select
                        className="compact-status-select"
                        value={check?.status || "pending"}
                        onChange={(event) => update(code, event.target.value)}
                        aria-label={`${code.replaceAll("_", " ")} verification status`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_review">In review</option>
                        <option value="verified">Verified</option>
                        <option value="needs_attention">Needs attention</option>
                        <option value="not_required">Not required</option>
                      </select>
                    ) : (
                      <span className="muted-cell">Additional evidence</span>
                    )}
                  </td>
                  <td>
                    {document ? (
                      <div className="compact-row-actions">
                        <button onClick={() => setPreview(document)}>
                          <Eye /> Preview
                        </button>
                        <button
                          className="approve-action"
                          onClick={() =>
                            reviewDocument(document.id, "verified")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="reject-action"
                          onClick={() =>
                            reviewDocument(document.id, "rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="muted-cell">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={5}>No matching checks or documents.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {preview && (
        <div
          className="modal-backdrop document-preview-backdrop"
          onMouseDown={() => setPreview(null)}
        >
          <section
            className="document-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Preview ${preview.original_name}`}
            onMouseDown={(event) => event.stopPropagation()}
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
              src={`${process.env.NEXT_PUBLIC_API_URL}/documents/${preview.id}/preview`}
            />
            <footer>
              <a
                className="button dark"
                href={`${process.env.NEXT_PUBLIC_API_URL}/documents/${preview.id}/preview?download=1`}
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
