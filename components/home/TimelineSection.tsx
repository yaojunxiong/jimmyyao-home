"use client";

import type { HomeContent } from "@/lib/home-content";
import { useReveal, revealStyles } from "@/lib/use-reveal";

/* ================================================================
   TimelineSection — horizontal 4-stage timeline
   ================================================================ */

type TimelineSectionProps = {
  content: Pick<HomeContent, "timelineHeading" | "timelineIntro" | "timelineStages">;
};

const STATUS_STYLE: Record<string, { dot: string; ring: string; text: string }> = {
  current: { dot: "#818cf8", ring: "rgba(129,140,248,0.3)", text: "进行中" },
  done: { dot: "#34d399", ring: "rgba(52,211,153,0.25)", text: "已完成" },
  upcoming: { dot: "rgba(216,216,255,0.3)", ring: "rgba(216,216,255,0.1)", text: "计划中" }
};

const STATUS_LABEL: Record<string, Record<string, string>> = {
  zh: { current: "进行中", done: "已完成", upcoming: "计划中" },
  ja: { current: "進行中", done: "完了", upcoming: "予定" },
  en: { current: "Active", done: "Done", upcoming: "Planned" }
};

export function TimelineSection({ content }: TimelineSectionProps) {
  const headerReveal = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="timeline" className="relative bg-[#07071a] py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid pointer-events-none" />
      <div className="aurora-glow aurora-glow-cyan" />

      <div className="section-container relative z-10">
        <header ref={headerReveal.ref} className="mb-16 md:mb-24 text-center"
          style={headerReveal.isVisible ? revealStyles.visible : revealStyles.hidden}>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-5">Growth Timeline</p>
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-semibold tracking-[-0.02em] text-white/95 mb-4">
            {content.timelineHeading}
          </h2>
          <p className="text-[16px] md:text-[18px] text-indigo-200/60 max-w-[520px] mx-auto">
            {content.timelineIntro}
          </p>
        </header>

        {/* Horizontal timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[88px] left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-[2px] bg-gradient-to-r from-indigo-500/40 via-indigo-400/60 to-indigo-500/40" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {content.timelineStages.map((stage, i) => (
              <TimelineNode key={stage.id} stage={stage} index={i} lang="zh" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineNode({ stage, index, lang }: { stage: HomeContent["timelineStages"][number]; index: number; lang: string }) {
  const reveal = useReveal<HTMLDivElement>({ threshold: 0.08, delay: index * 150 });
  const style = STATUS_STYLE[stage.status];
  const label = STATUS_LABEL[lang]?.[stage.status] ?? stage.status;

  return (
    <div ref={reveal.ref} className="relative flex flex-col items-center text-center"
      style={reveal.isVisible ? revealStyles.visible : revealStyles.hidden}>
      {/* Node circle */}
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 relative z-10"
          style={{ borderColor: style.ring, background: "rgba(7,7,26,0.9)" }}>
          <div className="w-4 h-4 rounded-full" style={{ background: style.dot }} />
        </div>
        {stage.status === "current" && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: style.dot }} />
        )}
      </div>

      {/* Year */}
      <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-indigo-400/60 mb-2">
        {stage.year}
      </span>

      {/* Title */}
      <h3 className="text-[16px] font-semibold text-white/95 mb-1.5">{stage.title}</h3>

      {/* Description */}
      <p className="text-[13px] text-white/40 leading-relaxed max-w-[200px]">{stage.description}</p>

      {/* Status badge */}
      <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium"
        style={{
          background: style.ring,
          color: style.dot,
          border: `1px solid ${style.dot}20`
        }}>
        {label}
      </span>
    </div>
  );
}
