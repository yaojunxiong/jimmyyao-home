"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { detectAiWorldLanguage, type AiWorldLanguage } from "@/components/ai-world/i18n";
import { HomeContent } from "./HomeContent";
import { homeContent } from "@/lib/home-content";

const AiWorldHero = dynamic(
  () => import("@/components/ai-world/AiWorldHero").then((module) => module.AiWorldHero),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          minHeight: "100dvh",
          background:
            "radial-gradient(circle at 50% 15%, rgba(255,255,255,0.7), transparent 22rem), linear-gradient(180deg, #77d3ff 0%, #bceeff 48%, #e7fff0 100%)"
        }}
      />
    )
  }
);

export function PortalHome() {
  const [language, setLanguage] = useState<AiWorldLanguage>("ja");

  useEffect(() => {
    setLanguage(detectAiWorldLanguage());

    const onStorage = (event: StorageEvent) => {
      if (event.key !== "jimmyyao:language") return;
      const next = event.newValue;
      if (next === "ja" || next === "zh" || next === "en") setLanguage(next);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLanguageChange = (next: AiWorldLanguage) => {
    setLanguage(next);
    try {
      window.localStorage.setItem("jimmyyao:language", next);
    } catch {
      /* ignore storage failures (private mode, etc.) */
    }
  };

  const copy = homeContent[language];

  return (
    <>
      <AiWorldHero language={language} onLanguageChange={handleLanguageChange} />
      <HomeContent language={language} copy={copy} />
    </>
  );
}
