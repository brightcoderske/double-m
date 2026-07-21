"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteHeader } from "../components/site-header";
type Result = {
  kind: "Job" | "Article";
  title: string;
  summary: string;
  href: string;
};
export default function SearchPage() {
  const [query, setQuery] = useState(""),
    [remote, setRemote] = useState<Result[]>([]);
  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`).then((r) =>
        r.ok ? r.json() : { jobs: [] },
      ),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`).then((r) =>
        r.ok ? r.json() : { articles: [] },
      ),
    ])
      .then(([j, a]) =>
        setRemote([
          ...j.jobs.map((x: any) => ({
            kind: "Job",
            title: x.title,
            summary: `${x.location} · ${x.employment_type}`,
            href: "/jobs",
          })),
          ...a.articles.map((x: any) => ({
            kind: "Article",
            title: x.title,
            summary: x.excerpt,
            href: `/blog/${x.slug}`,
          })),
        ]),
      )
      .catch(() => {});
  }, []);
  const items = remote.filter((x) =>
    `${x.title} ${x.summary}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="shell">
            <span>Search Double M</span>
            <h1>Find jobs and practical guidance.</h1>
            <div className="global-search">
              <SearchIcon />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try caregiver, Nairobi, interview…"
              />
            </div>
          </div>
        </section>
        <section className="search-results shell">
          {query && !items.length ? (
            <p>No matching published jobs or articles yet.</p>
          ) : (
            items.map((x, i) => (
              <Link href={x.href} key={`${x.kind}-${i}`}>
                <small>{x.kind}</small>
                <b>{x.title}</b>
                <span>{x.summary}</span>
              </Link>
            ))
          )}
        </section>
      </main>
    </>
  );
}
