"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function KnowledgePage() {
  const [items, setItems] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [contractTerms, setContractTerms] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  async function load() {
    const [knowledgeResponse, dashboardResponse, termsResponse] =
      await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/knowledge`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/knowledge/contract-terms`, {
          credentials: "include",
        }),
      ]);
    const knowledge = await knowledgeResponse.json();
    const dashboard = await dashboardResponse.json();
    if (!knowledgeResponse.ok) throw new Error(knowledge.message);
    setItems(knowledge.items);
    setRole(dashboard.user?.role || "");
    if (termsResponse.ok) setContractTerms((await termsResponse.json()).terms);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load().catch((caught) => setMessage(caught.message));
  }, []);
  async function acknowledge(id: number) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledge/${id}/acknowledge`,
      { method: "POST", credentials: "include" },
    );
    const body = await response.json();
    setMessage(body.message);
    if (response.ok) {
      await load();
      setEditingId(null);
    }
  }
  async function update(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/staff/knowledge/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, requiresAcknowledgement: true }),
      },
    );
    const body = await response.json();
    setMessage(body.message);
    if (response.ok) await load();
  }
  const staff = role === "administrator" || role === "agency_staff";
  const filtered = items.filter((item) => {
    const search =
      `${item.title} ${item.summary} ${item.category} ${item.content}`.toLowerCase();
    return (
      (category === "all" || item.category === category) &&
      search.includes(query.toLowerCase())
    );
  });
  const pages = Math.max(1, Math.ceil(filtered.length / 25));
  const visible = filtered.slice((page - 1) * 25, page * 25);
  return (
    <main className="workspace-page knowledge-page">
      <header>
        <Link href="/dashboard">← Dashboard</Link>
        <span>Knowledge base</span>
        <h1>Know the process. Know what is expected.</h1>
        <p>
          Agency procedures, rights, responsibilities and placement guidance.
        </p>
      </header>
      {message && (
        <p className="notice" aria-live="polite">
          {message}
        </p>
      )}
      <section className="dash-panel register-panel">
        <div className="register-toolbar">
          <div>
            <h2>Guidance register</h2>
            <span>{filtered.length} records</span>
          </div>
          <div className="table-filters">
            <input
              type="search"
              placeholder="Search all guidance"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">All categories</option>
              {[...new Set(items.map((item) => item.category))].map((value) => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="payment-table-wrap">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Version</th>
                <th>Audience</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contractTerms && (
                <tr>
                  <td>
                    <b>{contractTerms.title}</b>
                    <small>Contract master terms</small>
                  </td>
                  <td>Legal</td>
                  <td>{contractTerms.version}</td>
                  <td>All parties</td>
                  <td>View only</td>
                  <td>
                    <button
                      className="table-action"
                      onClick={() => setEditingId(-1)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              )}
              {visible.map((item) => (
                <tr key={item.id}>
                  <td>
                    <b>{item.title}</b>
                    <small>{item.summary}</small>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.version}</td>
                  <td>{item.audience || "Relevant users"}</td>
                  <td>
                    {item.requires_acknowledgement
                      ? "Agreement required"
                      : "Information"}
                  </td>
                  <td>
                    <button
                      className="table-action"
                      onClick={() => setEditingId(item.id)}
                    >
                      {staff ? "View / edit" : "Read"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-pagination">
          <span>
            Page {page} of {pages} Â· 25 per page
          </span>
          <div>
            <button
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </button>
            <button
              disabled={page === pages}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      {editingId !== null && (
        <div className="workspace-modal" role="dialog" aria-modal="true">
          <div className="workspace-modal-card knowledge-modal">
            <button className="modal-close" onClick={() => setEditingId(null)}>
              Close
            </button>
            {contractTerms && editingId === -1 && (
              <article className="knowledge-terms-card">
                <small>
                  Contract terms · Version {contractTerms.version} · View only
                </small>
                <h2>{contractTerms.title}</h2>
                <p>
                  This is the current agency master copy. Your own contract will
                  replace the merge fields with the agreed person, role, dates
                  and charges before you accept it.
                </p>
                <div
                  className="managed-article"
                  dangerouslySetInnerHTML={{ __html: contractTerms.body }}
                />
              </article>
            )}
            {items
              .filter((item) => item.id === editingId)
              .map((item) => (
                <article key={item.id}>
                  <small>
                    {item.category} · Version {item.version}
                  </small>
                  {staff ? (
                    <form onSubmit={(event) => update(event, item.id)}>
                      <input
                        name="title"
                        defaultValue={item.title}
                        required
                        minLength={5}
                      />
                      <textarea
                        name="summary"
                        defaultValue={item.summary}
                        required
                        minLength={15}
                      />
                      <textarea
                        name="content"
                        defaultValue={item.content}
                        required
                        minLength={100}
                        rows={12}
                      />
                      <button>Save as a new acknowledged version</button>
                      <button type="button" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <h2>{item.title}</h2>
                      <p>{item.summary}</p>
                      <div
                        className="managed-article"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                      {item.requires_acknowledgement &&
                        !staff &&
                        Number(item.acknowledged_version) !==
                          Number(item.version) && (
                          <button onClick={() => acknowledge(item.id)}>
                            I have read and agree
                          </button>
                        )}
                      {!staff &&
                        Number(item.acknowledged_version) ===
                          Number(item.version) && (
                          <b className="acknowledged">
                            ✓ Agreed on{" "}
                            {new Date(
                              item.acknowledged_at,
                            ).toLocaleDateString()}
                          </b>
                        )}
                    </>
                  )}
                </article>
              ))}
          </div>
        </div>
      )}
    </main>
  );
}
