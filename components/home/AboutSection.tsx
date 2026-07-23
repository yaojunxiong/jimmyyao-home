"use client";

import type { HomeContent } from "@/lib/home-content";
import { useReveal, revealStyles } from "@/lib/use-reveal";

/* ================================================================
   AboutSection — SVG avatar + robot character + identity tags
   ================================================================ */

type AboutSectionProps = {
  content: Pick<HomeContent, "aboutHeading" | "aboutSubheading" | "aboutText" | "aboutTagWork" | "aboutTagStudy" | "aboutTagAi">;
};

const GITHUB_URL = "https://github.com/yaojunxiong";

export function AboutSection({ content }: AboutSectionProps) {
  const reveal = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="about" className="relative bg-[#07071a] py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid pointer-events-none" />
      <div className="aurora-glow aurora-glow-purple" style={{ top: "20%", left: "-10%" }} />

      <div className="section-container relative z-10">
        <div ref={reveal.ref} className="max-w-[800px] mx-auto"
          style={reveal.isVisible ? revealStyles.visible : revealStyles.hidden}>
          {/* Avatar + Robot illustration */}
          <div className="flex justify-center mb-12">
            <JimmyAvatar />
          </div>

          {/* Heading */}
          <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] text-white/95 text-center mb-3">
            {content.aboutHeading}
          </h2>
          <p className="text-[15px] text-indigo-200/50 text-center mb-8">
            {content.aboutSubheading}
          </p>

          {/* Identity tags */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            <Tag label={content.aboutTagWork} color="#818cf8" />
            <Tag label={content.aboutTagStudy} color="#38bdf8" />
            <Tag label={content.aboutTagAi} color="#c084fc" />
          </div>

          {/* About text */}
          <div className="space-y-4 mb-8 text-center">
            {content.aboutText.map((p, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-white/50 max-w-[580px] mx-auto">
                {p}
              </p>
            ))}
          </div>

          {/* GitHub */}
          <div className="text-center">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/15 hover:border-indigo-500/25 text-[13px] text-indigo-300 hover:text-indigo-200 font-medium transition-all duration-300"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-medium"
      style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
    >
      {label}
    </span>
  );
}

/* --- Custom SVG: Jimmy Avatar with AI robot companion --- */
function JimmyAvatar() {
  return (
    <svg
      viewBox="0 0 280 180"
      width="280"
      height="180"
      className="mx-auto"
      aria-hidden="true"
      role="img"
    >
      <defs>
        <filter id="glow-purple">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-blue">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="bg-grad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#07071a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <ellipse cx="140" cy="140" rx="120" ry="30" fill="url(#bg-grad)" />

      {/* AI Robot companion (right side) */}
      <g transform="translate(185, 65)">
        {/* Body */}
        <rect x="-14" y="-20" width="28" height="35" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.2" />
        {/* Head */}
        <rect x="-12" y="-52" width="24" height="22" rx="7" fill="#2e2a6e" stroke="#818cf8" strokeWidth="1" />
        {/* Eyes */}
        <ellipse cx="-4" cy="-42" rx="3.5" ry="4" fill="#38bdf8" filter="url(#glow-blue)" />
        <ellipse cx="5" cy="-42" rx="3.5" ry="4" fill="#38bdf8" filter="url(#glow-blue)" />
        {/* Antenna */}
        <line x1="0" y1="-52" x2="-6" y2="-64" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="-6" cy="-66" r="3" fill="#c084fc" filter="url(#glow-purple)" />
        {/* Arms */}
        <rect x="-22" y="-16" width="8" height="24" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="0.8" />
        <rect x="14" y="-16" width="8" height="24" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="0.8" />
        {/* Legs */}
        <rect x="-10" y="15" width="9" height="18" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="0.8" />
        <rect x="1" y="15" width="9" height="18" rx="4" fill="#1e1b4b" stroke="#6366f1" strokeWidth="0.8" />
        {/* Heart/indicator */}
        <circle cx="0" cy="-28" r="3" fill="#34d399" opacity="0.7">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Speech/thought bubble with JY */}
        <ellipse cx="20" cy="-32" rx="16" ry="11" fill="#1e1b4b" stroke="#6366f1" strokeWidth="0.6" />
        <text x="20" y="-28" textAnchor="middle" fill="#818cf8" fontSize="7" fontFamily="sans-serif" fontWeight="600">AI</text>
      </g>

      {/* Jimmy Avatar (left side) */}
      <g transform="translate(95, 55)">
        {/* Body */}
        <rect x="-16" y="-10" width="32" height="45" rx="10" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />

        {/* Shoulders */}
        <rect x="-20" y="-10" width="40" height="8" rx="4" fill="#2e2a6e" />

        {/* Head */}
        <circle cx="0" cy="-32" r="16" fill="#e8d5c4" stroke="#6366f1" strokeWidth="0.8" />

        {/* Hair */}
        <path d="M-16,-30 Q-17,-48 -8,-48 Q0,-52 8,-48 Q17,-48 16,-30 Q14,-36 8,-38 Q0,-39 -8,-38 Q-14,-36 -16,-30" fill="#2b2230" />
        <path d="M-16,-30 Q-18,-42 -10,-46" fill="#2b2230" />
        <path d="M16,-30 Q18,-42 10,-46" fill="#2b2230" />

        {/* Eyes */}
        <ellipse cx="-5" cy="-33" rx="3" ry="2.5" fill="#2b2230" />
        <ellipse cx="5" cy="-33" rx="3" ry="2.5" fill="#2b2230" />
        <ellipse cx="-5" cy="-33.5" rx="1" ry="1" fill="white" opacity="0.6" />
        <ellipse cx="5" cy="-33.5" rx="1" ry="1" fill="white" opacity="0.6" />

        {/* Smile */}
        <path d="M-4,-26 Q0,-22 4,-26" stroke="#2b2230" strokeWidth="1" fill="none" strokeLinecap="round" />

        {/* Shirt collar */}
        <path d="M-8,-12 L0,-6 L8,-12" stroke="#6366f1" strokeWidth="1" fill="none" />

        {/* Arms */}
        <rect x="-24" y="-6" width="8" height="28" rx="4" fill="#e8d5c4" />
        <rect x="16" y="-6" width="8" height="28" rx="4" fill="#e8d5c4" />

        {/* Legs */}
        <rect x="-10" y="35" width="9" height="22" rx="4" fill="#2e2a6e" />
        <rect x="1" y="35" width="9" height="22" rx="4" fill="#2e2a6e" />
      </g>

      {/* Connecting line between Jimmy and Robot */}
      <line x1="100" y1="70" x2="175" y2="65" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="4,3" opacity="0.3" />

      {/* Floating particles */}
      <circle cx="140" cy="58" r="1.5" fill="#818cf8" opacity="0.4">
        <animate attributeName="cy" values="58;50;58" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
