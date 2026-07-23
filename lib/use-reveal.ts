"use client";

import { useEffect, useId, useRef, useState } from "react";

/* ================================================================
   useReveal — Scroll-triggered reveal animation
   Apple-style fade+blur+translate entrance
   ================================================================ */

type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number; // stagger delay in ms
};

export function useReveal<T extends HTMLElement>({
  threshold = 0.12,
  rootMargin = "0px 0px -40px 0px",
  once = true,
  delay = 0
}: RevealOptions = {}) {
  const ref = useRef<T>(null);
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const timeoutId = setTimeout(() => setIsVisible(true), delay);
            if (once) observer.unobserve(element);
            return () => clearTimeout(timeoutId);
          } else if (!once) {
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, delay]);

  return { ref, isVisible, id };
}

/* Inline styles for animated elements */
export const revealStyles = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
    transform: "translateY(32px)"
  } as React.CSSProperties,
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transform: "translateY(0)",
    transition: "opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), filter 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)"
  } as React.CSSProperties
};
