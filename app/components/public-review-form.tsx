"use client";

import { Star } from "lucide-react";
import { FormEvent, useState } from "react";

const api = process.env.NEXT_PUBLIC_API_URL;

export function PublicReviewForm() {
  const [rating, setRating] = useState(5);
  const [length, setLength] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setBusy(true);
    setMessage("Submitting privately…");
    const response = await fetch(`${api}/public/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewerName: values.reviewerName,
        reviewText: values.reviewText,
        rating,
        publicationConsent: values.publicationConsent === "true",
      }),
    });
    const body = await response.json();
    setMessage(body.issues?.[0]?.message || body.message);
    if (response.ok) {
      form.reset();
      setRating(5);
      setLength(0);
    }
    setBusy(false);
  }

  return (
    <form className="public-review-form" onSubmit={submit}>
      <label>
        Your name
        <input name="reviewerName" minLength={2} maxLength={150} required />
      </label>
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
          placeholder="Tell others about your genuine Double M experience."
          onChange={(event) => setLength(event.target.value.length)}
          required
        />
        <small>{length}/100 characters</small>
      </label>
      <label className="consent">
        <input
          name="publicationConsent"
          type="checkbox"
          value="true"
          required
        />
        I confirm this is my genuine experience and permit Double M Agency to
        publish my first name, star rating and approved review.
      </label>
      <button className="button dark" disabled={busy}>
        {busy ? "Submitting…" : "Submit review for approval"}
      </button>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
