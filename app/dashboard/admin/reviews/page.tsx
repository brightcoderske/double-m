"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type Review = {
  id: number;
  reviewer_name: string;
  email: string;
  rating: number;
  review_text: string;
  status: string;
  created_at: string;
};

const api = process.env.NEXT_PUBLIC_API_URL;

export default function ReviewModeration() {
  const [items, setItems] = useState<Review[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch(`${api}/admin/reviews`, {
      credentials: "include",
    });
    const body = await response.json();
    if (response.ok) setItems(body.reviews || []);
    else setMessage(body.message);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  async function moderate(id: number, status: "published" | "rejected") {
    const response = await fetch(`${api}/admin/reviews/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const body = await response.json();
    setMessage(body.message);
    if (response.ok) await load();
  }

  return (
    <main className="admin-controls">
      <header>
        <span>Administrator approval</span>
        <h1>Reviews and star ratings</h1>
        <p>Only approved feedback is published on the website.</p>
      </header>
      <section className="dash-panel register-panel">
        <div className="panel-heading">
          <h2>Review register</h2>
          <span>{items.length}</span>
        </div>
        <div className="table-scroll">
          <table className="operations-table">
            <thead>
              <tr>
                <th>Reviewer</th>
                <th>Stars</th>
                <th>Review</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((review) => (
                <tr key={review.id}>
                  <td>
                    <b>{review.reviewer_name}</b>
                    {review.email && <small>{review.email}</small>}
                  </td>
                  <td>
                    <span className="review-stars">
                      {Array.from({ length: review.rating }, (_, index) => (
                        <Star
                          className="filled"
                          key={`${review.id}-${index}`}
                        />
                      ))}
                    </span>
                  </td>
                  <td className="requirements-cell">{review.review_text}</td>
                  <td>{new Date(review.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`table-status status-${review.status}`}>
                      {review.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="table-action"
                        onClick={() => moderate(review.id, "published")}
                      >
                        Approve
                      </button>
                      <button
                        className="table-action danger"
                        onClick={() => moderate(review.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {message && (
        <div className="admin-toast" role="status">
          {message}
        </div>
      )}
    </main>
  );
}
