"use client";

import type { HomeContent } from "@/lib/home-content";
import { useReveal, revealStyles } from "@/lib/use-reveal";

type AboutSectionProps = {
  content: Pick<HomeContent, "aboutHeading" | "aboutSubheading" | "aboutText" | "aboutTagWork" | "aboutTagStudy" | "aboutTagAi">;
};

const GITHUB_URL = "https://github.com/yaojunxiong";

export function AboutSection({ content }: AboutSectionProps) {
  const reveal = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="about" className="relative overflow-hidden bg-[#07071a] py-24 md:py-32 lg:py-40">
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 h-[620px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.08] blur-[140px] pointer-events-none" />
      <div className="absolute -left-40 top-16 h-96 w-96 rounded-full bg-cyan-400/[0.07] blur-[120px] pointer-events-none" />
      <div className="absolute -right-40 bottom-0 h-[440px] w-[440px] rounded-full bg-fuchsia-500/[0.08] blur-[130px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div
          ref={reveal.ref}
          className="mx-auto grid max-w-[1120px] items-center gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-16"
          style={reveal.isVisible ? revealStyles.visible : revealStyles.hidden}
        >
          <div className="relative min-h-[430px] overflow-hidden rounded-[36px] border border-white/[0.09] bg-gradient-to-br from-indigo-500/[0.12] via-[#0d0d2b]/90 to-cyan-400/[0.06] shadow-[0_40px_120px_rgba(0,0,0,.45)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(129,140,248,.22),transparent_34%),linear-gradient(180deg,transparent,rgba(7,7,26,.78))]" />
            <div className="absolute left-8 top-8 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-medium uppercase tracking-[.22em] text-indigo-100/60 backdrop-blur-xl">
              Human × AI
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-5">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[.28em] text-cyan-200/50">Building together</p>
                <p className="max-w-[300px] text-xl font-medium leading-snug text-white/90 md:text-2xl">
                  Learning, creating and connecting every digital space.
                </p>
              </div>
              <div className="hidden rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right backdrop-blur-xl sm:block">
                <span className="block text-[10px] uppercase tracking-[.2em] text-white/35">Live world</span>
                <strong className="text-sm text-emerald-300/80">Online</strong>
              </div>
            </div>
            <WorldCharacters />
          </div>

          <div className="lg:pl-2">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[.3em] text-indigo-300/55">About the creator</p>
            <h2 className="text-[34px] font-semibold leading-tight tracking-[-0.035em] text-white/95 md:text-[48px]">
              {content.aboutHeading}
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-indigo-100/55">{content.aboutSubheading}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Tag label={content.aboutTagWork} color="#818cf8" />
              <Tag label={content.aboutTagStudy} color="#38bdf8" />
              <Tag label={content.aboutTagAi} color="#c084fc" />
            </div>

            <div className="mt-8 space-y-4">
              {content.aboutText.map((paragraph, index) => (
                <p key={index} className="max-w-[560px] text-[15px] leading-8 text-white/52">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/15 px-6 py-3 text-[13px] font-medium text-indigo-100 shadow-[0_0_30px_rgba(99,102,241,.12)] transition duration-300 hover:-translate-y-0.5 hover:border-indigo-300/35 hover:bg-indigo-500/25"
              >
                <GitHubIcon />
                <span>Explore GitHub</span>
              </a>
              <span className="text-xs tracking-wide text-white/30">Tokyo · Quality · Learning · AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-4 py-2 text-[12px] font-medium backdrop-blur-xl"
      style={{ background: `${color}14`, color, border: `1px solid ${color}2d`, boxShadow: `0 0 28px ${color}0d` }}
    >
      {label}
    </span>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function WorldCharacters() {
  return (
    <svg viewBox="0 0 640 440" className="absolute inset-x-0 top-4 h-[360px] w-full md:h-[390px]" aria-hidden="true">
      <defs>
        <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity=".34" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="robotBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#11133b" />
        </linearGradient>
        <filter id="softGlow"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>
      <ellipse cx="320" cy="330" rx="235" ry="55" fill="url(#stageGlow)" />
      <ellipse cx="320" cy="348" rx="190" ry="28" fill="#050512" opacity=".55" />
      <circle cx="155" cy="95" r="3" fill="#67e8f9" opacity=".8" />
      <circle cx="470" cy="82" r="4" fill="#c084fc" opacity=".75" />
      <circle cx="525" cy="160" r="2.5" fill="#818cf8" opacity=".7" />

      <g transform="translate(170 105)">
        <path d="M78 102C48 111 29 136 27 183l-4 92h118l-4-92c-2-48-24-73-59-81Z" fill="#20245a" stroke="#818cf8" strokeOpacity=".55" />
        <path d="M42 150c17 14 54 14 78 0" fill="none" stroke="#67e8f9" strokeOpacity=".35" />
        <circle cx="80" cy="63" r="47" fill="#e9c9ae" />
        <path d="M33 64C29 24 52 7 82 8c34 1 53 25 45 62-12-20-31-31-57-29-15 1-27 9-37 23Z" fill="#171629" />
        <path d="M36 53c8-32 23-43 48-45" fill="none" stroke="#2e2948" strokeWidth="16" strokeLinecap="round" />
        <ellipse cx="63" cy="65" rx="5" ry="4" fill="#252038" />
        <ellipse cx="98" cy="65" rx="5" ry="4" fill="#252038" />
        <path d="M67 83q13 11 27 0" fill="none" stroke="#9d665c" strokeWidth="3" strokeLinecap="round" />
        <path d="M54 111l25 23 27-23" fill="#eef2ff" opacity=".92" />
        <path d="M79 134v92" stroke="#6366f1" strokeOpacity=".55" />
        <rect x="43" y="166" width="73" height="48" rx="8" fill="#0b102b" stroke="#38bdf8" strokeOpacity=".4" />
        <path d="M57 184h45M57 196h31" stroke="#67e8f9" strokeOpacity=".65" strokeLinecap="round" />
      </g>

      <g transform="translate(390 120)">
        <ellipse cx="65" cy="184" rx="70" ry="28" fill="#6366f1" opacity=".18" filter="url(#softGlow)" />
        <rect x="15" y="65" width="100" height="112" rx="34" fill="url(#robotBody)" stroke="#818cf8" strokeWidth="2" />
        <rect x="24" y="3" width="82" height="74" rx="28" fill="#171a45" stroke="#67e8f9" strokeOpacity=".75" strokeWidth="2" />
        <path d="M53 37l11 7-11 7M78 37l-11 7 11 7" fill="none" stroke="#67e8f9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M65 3V-18" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="65" cy="-22" r="7" fill="#c084fc" />
        <rect x="-5" y="83" width="25" height="70" rx="12" fill="#292c69" stroke="#818cf8" strokeOpacity=".6" />
        <rect x="110" y="83" width="25" height="70" rx="12" fill="#292c69" stroke="#818cf8" strokeOpacity=".6" />
        <rect x="27" y="168" width="29" height="50" rx="13" fill="#20245a" />
        <rect x="74" y="168" width="29" height="50" rx="13" fill="#20245a" />
        <circle cx="65" cy="117" r="15" fill="#38bdf8" opacity=".18" />
        <circle cx="65" cy="117" r="7" fill="#67e8f9" />
      </g>

      <path d="M310 196C345 150 370 151 397 187" fill="none" stroke="#818cf8" strokeOpacity=".28" strokeDasharray="6 8" />
      <circle cx="351" cy="162" r="5" fill="#c084fc" opacity=".8" />
    </svg>
  );
}
