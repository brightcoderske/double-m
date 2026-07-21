"use client";
import { Share2 } from "lucide-react";
export function ShareButton({ title }: { title: string }) {
  async function share() {
    const data = {
      title,
      text: `A practical guide from Double M Agency: ${title}`,
      url: location.href,
    };
    if (navigator.share) await navigator.share(data);
    else await navigator.clipboard.writeText(location.href);
  }
  return (
    <button className="share-button" onClick={share}>
      <Share2 /> Share article
    </button>
  );
}
