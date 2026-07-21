"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
type User = {
  id: number;
  email: string;
  role: string;
  status: string;
  created_at: string;
};
export default function Users() {
  const [users, setUsers] = useState<User[]>([]),
    [message, setMessage] = useState("");
  async function load() {
    const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      credentials: "include",
    });
    if (r.ok) setUsers((await r.json()).users);
  }
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
        <div className="payment-table-wrap">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <b>{user.email}</b>
                  </td>
                  <td>{user.role.replaceAll("_", " ")}</td>
                  <td>
                    <span className="payment-status">{user.status}</span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() =>
                        change(
                          user.id,
                          user.status === "suspended" ? "active" : "suspended",
                        )
                      }
                    >
                      {user.status === "suspended" ? "Restore" : "Suspend"}
                    </button>
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
