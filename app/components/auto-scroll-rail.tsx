"use client";
import { ReactNode, useEffect, useRef } from "react";

export function AutoScrollRail({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className: string;
  label: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = rail.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let paused = false;
    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };
    const timer = window.setInterval(() => {
      if (paused || element.scrollWidth <= element.clientWidth) return;
      const card = element.firstElementChild as HTMLElement | null;
      const step = (card?.offsetWidth || element.clientWidth * 0.82) + 12;
      const atEnd =
        element.scrollLeft + element.clientWidth >= element.scrollWidth - 12;
      element.scrollTo({
        left: atEnd ? 0 : element.scrollLeft + step,
        behavior: "smooth",
      });
    }, 4200);
    element.addEventListener("pointerdown", pause);
    element.addEventListener("pointerup", resume);
    element.addEventListener("pointercancel", resume);
    element.addEventListener("mouseenter", pause);
    element.addEventListener("mouseleave", resume);
    return () => {
      window.clearInterval(timer);
      element.removeEventListener("pointerdown", pause);
      element.removeEventListener("pointerup", resume);
      element.removeEventListener("pointercancel", resume);
      element.removeEventListener("mouseenter", pause);
      element.removeEventListener("mouseleave", resume);
    };
  }, []);
  return (
    <div ref={rail} className={className} aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}
