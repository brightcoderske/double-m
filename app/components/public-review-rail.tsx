"use client";

import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { AutoScrollRail } from "./auto-scroll-rail";

type Review = {
  id: number;
  reviewer_name: string;
  rating: number;
  review_text: string;
};

export function PublicReviewRail() {
  const [items, setItems] = useState<Review[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/reviews`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { reviews: [] }))
      .then((body) => setItems(body.reviews || []))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (!items.length) return null;

  return (
    <AutoScrollRail
      className="public-card-rail review-public-rail"
      label="Verified client reviews"
    >
      {items.map((review) => (
        <article className="review-public-card" key={review.id}>
          <Quote aria-hidden="true" />
          <div
            className="review-stars"
            aria-label={`${review.rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={`${review.id}-${index}`}
                className={index < review.rating ? "filled" : undefined}
              />
            ))}
          </div>
          <p>{review.review_text.slice(0, 100)}</p>
          <b>{review.reviewer_name}</b>
          <small>Verified Double M experience</small>
        </article>
      ))}
    </AutoScrollRail>
  );
}
