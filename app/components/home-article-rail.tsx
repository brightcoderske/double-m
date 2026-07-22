"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AutoScrollRail } from "./auto-scroll-rail";

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  cover_image?: string;
};

export function HomeArticleRail({ initial }: { initial: Article[] }) {
  const [items, setItems] = useState(initial);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { articles: [] }))
      .then((body) => {
        const remote = body.articles as Article[];
        const remoteSlugs = new Set(remote.map((item) => item.slug));
        setItems([
          ...remote,
          ...initial.filter((item) => !remoteSlugs.has(item.slug)),
        ]);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [initial]);
  return (
    <AutoScrollRail className="home-article-rail" label="Recruitment guides">
      {items.slice(0, 6).map((article) => {
        const image = article.cover_image?.startsWith("/")
          ? article.cover_image
          : article.cover_image
            ? `${process.env.NEXT_PUBLIC_API_URL}/media/articles/${article.cover_image}`
            : "/images/care-story.webp";
        return (
          <article key={article.slug}>
            <div
              className="home-guide-cover"
              style={{ backgroundImage: `url(${image})` }}
            />
            <span>Double M guide</span>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <Link href={`/blog/${article.slug}`}>
              Read guide <ArrowRight />
            </Link>
          </article>
        );
      })}
    </AutoScrollRail>
  );
}
