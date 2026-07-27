"use client";
import { Share2 } from "lucide-react";
export function ShareButton({
  title,
  url,
  label = "Share article",
  text,
}: {
  title: string;
  url?: string;
  label?: string;
  text?: string;
}) {
  async function share() {
    const shareUrl = url
      ? new URL(url, window.location.origin).toString()
      : window.location.href;
    const data = {
      title,
      text: text || `From Double M Agency: ${title}`,
      url: shareUrl,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      if ((error as DOMException).name !== "AbortError")
        await navigator.clipboard.writeText(shareUrl);
    }
  }
  return (
    <button className="share-button" onClick={share}>
      <Share2 /> {label}
    </button>
  );
}
