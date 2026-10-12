"use client";

import React, { useEffect, useRef, type ReactNode } from "react";

interface SectionRevealProps {
  id?: string;
  children: ReactNode;
  className?: string;
  threshold?: number;
  as?: "section" | "div" | "article";
}

/**
 * Healthcare-style quiet IntersectionObserver reveal component.
 * Applies .reveal-ready and adds .is-visible on viewport intersection (400ms duration, 12px Y translation).
 * When prefers-reduced-motion: reduce is enabled, reveal animation is bypassed.
 */
export function SectionReveal({
  id,
  children,
  className = "",
  threshold = 0.08,
  as: Component = "section",
}: SectionRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      node.classList.add("is-visible");
      return;
    }

    node.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Component id={id} ref={ref as any} className={className}>
      {children}
    </Component>
  );
}
