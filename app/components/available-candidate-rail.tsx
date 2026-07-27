"use client";

import { BadgeCheck, ChevronRight, MapPin, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { AutoScrollRail } from "./auto-scroll-rail";

type Candidate = {
  id: number;
  public_name: string;
  profession: string;
  location: string;
  best_role?: string;
  education_level?: string;
  work_arrangement?: string;
  profile_image?: string;
};

export function AvailableCandidateRail() {
  const [items, setItems] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<Candidate | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/candidates`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { candidates: [] }))
      .then((body) => setItems(body.candidates || []))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (!items.length) return null;

  return (
    <>
      <AutoScrollRail
        className="public-card-rail candidate-public-rail"
        label="Verified available workers"
      >
        {items.map((candidate) => (
          <article className="candidate-public-card" key={candidate.id}>
            <div className="candidate-photo">
              {candidate.profile_image ? (
                // This image is served only for agency-verified public profiles.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${candidate.profile_image}`}
                  alt={`${candidate.public_name}, verified ${candidate.profession}`}
                />
              ) : (
                <UserRound aria-hidden="true" />
              )}
              <span>
                <BadgeCheck /> Verified
              </span>
            </div>
            <div className="candidate-card-copy">
              <small>Available through Double M</small>
              <h3>{candidate.public_name}</h3>
              <b>{candidate.best_role || candidate.profession}</b>
              <p>
                <MapPin /> {candidate.location}
              </p>
              <button type="button" onClick={() => setSelected(candidate)}>
                Explore summary <ChevronRight />
              </button>
            </div>
          </article>
        ))}
      </AutoScrollRail>
      {selected && (
        <div
          className="profile-summary-modal"
          role="presentation"
          onMouseDown={() => setSelected(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="candidate-summary-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
            <span className="verified-heading">
              <BadgeCheck /> Agency verified
            </span>
            <h2 id="candidate-summary-title">{selected.public_name}</h2>
            <p>
              {selected.profession} based in {selected.location}, currently
              available for a suitable placement.
            </p>
            <dl>
              <div>
                <dt>Best suited for</dt>
                <dd>{selected.best_role || selected.profession}</dd>
              </div>
              {selected.education_level && (
                <div>
                  <dt>Education</dt>
                  <dd>{selected.education_level}</dd>
                </div>
              )}
              {selected.work_arrangement && (
                <div>
                  <dt>Work arrangement</dt>
                  <dd>{selected.work_arrangement.replaceAll("_", " ")}</dd>
                </div>
              )}
            </dl>
            <a className="button dark" href="/hire">
              Ask Double M about this profile
            </a>
            <small>
              Private identity documents and sensitive personal details are
              never displayed publicly.
            </small>
          </section>
        </div>
      )}
    </>
  );
}
