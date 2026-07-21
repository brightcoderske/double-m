"use client";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
type ApprovedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  cover_image?: string;
};
export function ApprovedArticles() {
  const [items, setItems] = useState<ApprovedArticle[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : { articles: [] }))
      .then((x) => setItems(x.articles))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  if (!items.length) return null;
  return (
    <>
      {items.map((a) => (
        <article key={a.slug}>
          {a.cover_image && (
            <div
              className="article-cover"
              role="img"
              aria-label=""
              style={{
                backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}/media/articles/${a.cover_image})`,
              }}
            />
          )}
          <span>
            <Clock3 /> Agency article
          </span>
          <h2>{a.title}</h2>
          <p>{a.excerpt}</p>
          <Link href={`/blog/${a.slug}`}>
            Read guide <ArrowRight />
          </Link>
        </article>
      ))}
    </>
  );
}
