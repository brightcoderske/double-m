"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
type User = {
  id: number;
  email: string;
  role: string;
  status: string;
  created_at: string;
  full_name: string;
};
export default function Users() {
  const [users, setUsers] = useState<User[]>([]),
    [message, setMessage] = useState(""),
    [query, setQuery] = useState(""),
    [role, setRole] = useState("all"),
    [status, setStatus] = useState("all");
  async function load() {
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      credentials: "include",
    });
    if (r.ok) setUsers((await r.json()).users);
  }
  const visible = users.filter((user) => {
    const text = `${user.full_name} ${user.email} ${user.role} ${user.status}`.toLowerCase();
    return (
      text.includes(query.toLowerCase()) &&
      (role === "all" || user.role === role) &&
      (status === "all" || user.status === status)
    );
  });
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);
  async function change(id: number, status: "active" | "suspended") {
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/status`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    );
    setMessage((await r.json()).message);
    void load();
  }
  async function remove(id: number) {
    if (!window.confirm("Remove this account from the active system?")) return;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
      { method: "DELETE", credentials: "include" },
    );
    const result = await response.json();
    setMessage(result.message);
    if (response.ok) void load();
  }
  return (
    <main className="admin-controls">
      <header>
        <Link href="/dashboard/admin">← System controls</Link>
        <span>Administrator only</span>
        <h1>Account management</h1>
        <p>
          Create staff from System Controls. Suspend or restore any other
          account here; suspension takes effect on its next request.
        </p>
      </header>
      <section className="dash-panel">
        <div className="table-filters">
          <input
            type="search"
            placeholder="Search name or email"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="all">All roles</option>
            <option value="candidate">Candidates</option>
            <option value="employer">Employers</option>
            <option value="agency_staff">Staff</option>
            <option value="administrator">Administrators</option>
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="deleted">Removed</option>
          </select>
          <span>{visible.length} accounts</span>
        </div>
        <div className="payment-table-wrap">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Name and email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Link href={`/dashboard/admin/users/${user.id}`}>
                      <b>{user.full_name}</b>
                    </Link>
                    <small>{user.email}</small>
                  </td>
                  <td>{user.role.replaceAll("_", " ")}</td>
                  <td>
                    <span className="payment-status">{user.status}</span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="table-button-group">
                      {user.status !== "deleted" && (
                        <>
                          <button
                            onClick={() =>
                              change(
                                user.id,
                                user.status === "suspended"
                                  ? "active"
                                  : "suspended",
                              )
                            }
                          >
                            {user.status === "suspended" ? "Restore" : "Suspend"}
                          </button>
                          <button onClick={() => remove(user.id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {message && <div className="admin-toast">{message}</div>}
    </main>
  );
}
