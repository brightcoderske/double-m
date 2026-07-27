"use client";

import { Star } from "lucide-react";
import { FormEvent, useState } from "react";

const api = process.env.NEXT_PUBLIC_API_URL;

export default function SubmitReview() {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [length, setLength] = useState(0);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("Submitting your review…");
    const form = event.currentTarget;
    const reviewText = String(new FormData(form).get("reviewText") || "");
    const response = await fetch(`${api}/client/reviews`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, reviewText }),
    });
    const body = await response.json();
    setMessage(body.issues?.[0]?.message || body.message);
    if (response.ok) {
      form.reset();
      setLength(0);
      setRating(5);
    }
    setBusy(false);
  }

  return (
    <main className="workspace-page review-submit-page">
      <header>
        <span>Share your experience</span>
        <h1>Leave a review</h1>
        <p>
          Employers and job seekers can submit genuine feedback. Nothing is
          published until an administrator reviews and approves it.
        </p>
      </header>
      <section className="dash-panel review-submit-card">
        <form onSubmit={submit}>
          <fieldset>
            <legend>Your star rating</legend>
            <div className="rating-picker">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={value <= rating ? "selected" : undefined}
                  onClick={() => setRating(value)}
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                >
                  <Star />
                </button>
              ))}
            </div>
          </fieldset>
          <label>
            Your experience
            <textarea
              name="reviewText"
              minLength={20}
              maxLength={100}
              rows={4}
              placeholder="Tell others what Double M did well."
              onChange={(event) => setLength(event.target.value.length)}
              required
            />
            <small>{length}/100 characters</small>
          </label>
          <button className="button dark" disabled={busy}>
            {busy ? "Submitting…" : "Submit review for approval"}
          </button>
        </form>
        {message && (
          <p className="notice" role="status">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
