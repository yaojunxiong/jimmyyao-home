"use client";

import dynamic from "next/dynamic";

const AiWorldHero = dynamic(
  () => import("@/components/ai-world/AiWorldHero").then((module) => module.AiWorldHero),
  {
    ssr: false,
    loading: () => (
      <main className="grid min-h-[100dvh] place-items-center bg-sky-200 text-sky-950">
        <p className="rounded-full border border-white/70 bg-white/70 px-5 py-3 text-sm font-bold shadow-lg">
          AI Learning World loading...
        </p>
      </main>
    )
  }
);

export function AnimeGate() {
  return <AiWorldHero />;
}
