"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { AiWorldLanguage } from "@/components/ai-world/i18n";
import { homeContent } from "@/lib/home-content";
import { SpacesSection } from "./SpacesSection";
import { TimelineSection } from "./TimelineSection";
import { ProjectSection } from "./ProjectSection";
import { AboutSection } from "./AboutSection";
import { FooterSection } from "./FooterSection";

/* ================================================================
   PortalHome — orchestrates all sections
   ================================================================ */

const LANG_STORAGE_KEY = "jimmyyao:language";

const AiWorldHero = dynamic(
  () => import("@/components/ai-world/AiWorldHero").then((mod) => ({ default: mod.AiWorldHero })),
  { ssr: false }
);

function resolveInitialLang(): AiWorldLanguage {
  if (typeof window === "undefined") return "ja";
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "zh" || stored === "en" || stored === "ja") return stored;
  } catch { /* ignore */ }
  const nav = navigator.language || "";
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("en")) return "en";
  return "ja";
}

export function PortalHome() {
  const [language, setLanguage] = useState<AiWorldLanguage>("ja");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLanguage(resolveInitialLang());
    setMounted(true);
  }, []);

  const handleLanguageChange = useCallback((next: AiWorldLanguage) => {
    setLanguage(next);
    try { localStorage.setItem(LANG_STORAGE_KEY, next); } catch { /* ignore */ }
  }, []);

  const content = homeContent[language];

  if (!mounted) {
    return <div className="bg-[#07071a] min-h-screen" aria-label="Loading" />;
  }

  return (
    <main className="relative bg-[#07071a] min-h-screen overflow-x-hidden">
      {/* Hero: split layout — left text, right 3D world */}
      <AiWorldHero language={language} onLanguageChange={handleLanguageChange} />

      {/* Core Spaces — 3 cards with real screenshots */}
      <SpacesSection content={content} />

      {/* Growth Timeline — horizontal 4-stage */}
      <TimelineSection content={content} />

      {/* Projects — 4 project screenshot cards */}
      <ProjectSection content={content} />

      {/* About — SVG avatar + robot + tags */}
      <AboutSection content={content} />

      {/* Footer */}
      <FooterSection content={content} />
    </main>
  );
}
