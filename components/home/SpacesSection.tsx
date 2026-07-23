"use client";

import type { HomeContent, SpaceItem } from "@/lib/home-content";
import { useReveal, revealStyles } from "@/lib/use-reveal";

/* ================================================================
   SpacesSection — 3 background-image cards
   ================================================================ */

type SpacesSectionProps = {
  content: Pick<HomeContent, "spacesHeading" | "spacesIntro" | "spaces">;
};

const ACCENT_MAP: Record<SpaceItem["id"], { color: string; glow: string }> = {
  study: { color: "#3b82f6", glow: "rgba(59,130,246,0.2)" },
  ai: { color: "#6366f1", glow: "rgba(99,102,241,0.2)" },
  forum: { color: "#8b5cf6", glow: "rgba(139,92,246,0.2)" }
};

export function SpacesSection({ content }: SpacesSectionProps) {
  const headerReveal = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="spaces" className="relative bg-deep-gradient py-20 md:py-24 lg:py-28 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,.14),transparent_68%)] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid pointer-events-none" />
      <div className="aurora-glow aurora-glow-purple" />
      <div className="aurora-glow aurora-glow-blue" />

      <div className="section-container relative z-10">
        <header ref={headerReveal.ref} className="mb-12 md:mb-16 text-center"
          style={headerReveal.isVisible ? revealStyles.visible : revealStyles.hidden}>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-5">Core Spaces</p>
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-semibold tracking-[-0.02em] text-white/95 mb-4">
            {content.spacesHeading}
          </h2>
          <p className="text-[16px] md:text-[18px] text-indigo-200/60 max-w-[520px] mx-auto">
            {content.spacesIntro}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {content.spaces.map((space, i) => (
            <SpaceCard key={space.id} space={space} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpaceCard({ space, index }: { space: SpaceItem; index: number }) {
  const accent = ACCENT_MAP[space.id];
  const reveal = useReveal<HTMLDivElement>({ threshold: 0.08, delay: index * 120 });

  return (
    <a href={space.href} target="_blank" rel="noopener noreferrer" className="block group">
      <article
        ref={reveal.ref}
        className="relative h-[400px] md:h-[440px] rounded-2xl overflow-hidden border border-white/[0.06] transition-all duration-500"
        style={{
          ...(reveal.isVisible ? revealStyles.visible : revealStyles.hidden)
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = `0 0 0 1px ${accent.glow}, 0 24px 48px -12px ${accent.glow}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Background image */}
        <img
          src={space.screenshot}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07071a] via-[#07071a]/70 to-transparent" />

        {/* Content on top */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: accent.color }}>
            {space.eyebrow}
          </p>
          <h3 className="text-[20px] font-semibold text-white mb-2">{space.title}</h3>
          <p className="text-[13px] text-white/50 mb-4 line-clamp-2">{space.description}</p>
          <div className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: accent.color }}>
            <span>{space.cta}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:translate-x-[2px]">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </article>
    </a>
  );
}
