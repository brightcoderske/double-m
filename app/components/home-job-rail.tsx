"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AutoScrollRail } from "./auto-scroll-rail";

type Job = {
  id: number;
  reference_code: string;
  title: string;
  location: string;
  employment_type: string;
  description: string;
};

export function HomeJobRail() {
  const [jobs, setJobs] = useState<Job[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((body) => setJobs(body.jobs || []))
      .catch((error) => {
        if (error.name !== "AbortError") setJobs([]);
      });
    return () => controller.abort();
  }, []);

  if (jobs === null)
    return (
      <div className="empty-jobs">
        <span className="loader" />
        <p>Loading verified opportunities…</p>
      </div>
    );

  if (!jobs.length)
    return (
      <div className="empty-jobs">
        <Search />
        <h3>No published vacancies right now</h3>
        <p>
          Create your profile and choose the work you want. We’ll notify you
          when a suitable verified opportunity is published.
        </p>
        <Link className="button dark" href="/register">
          Create candidate profile
        </Link>
      </div>
    );

  return (
    <AutoScrollRail
      className="public-card-rail job-preview-rail"
      label="Published vacancies"
    >
      {jobs.slice(0, 8).map((job) => (
        <article className="job-preview-card" key={job.id}>
          <h3>{job.title}</h3>
          <div>
            <small>
              <MapPin /> {job.location}
            </small>
            <small>
              <BriefcaseBusiness /> {job.employment_type}
            </small>
          </div>
          <p>{job.description}</p>
          <Link href={`/jobs/${job.id}`}>
            View and apply <ArrowRight />
          </Link>
        </article>
      ))}
    </AutoScrollRail>
  );
}
