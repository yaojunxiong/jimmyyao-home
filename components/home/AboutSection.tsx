"use client";

import type { HomeContent } from "@/lib/home-content";
import { useReveal, revealStyles } from "@/lib/use-reveal";

type AboutSectionProps = {
  content: Pick<
    HomeContent,
    "aboutHeading" | "aboutSubheading" | "aboutText" | "aboutTagWork" | "aboutTagStudy" | "aboutTagAi"
  >;
};

const GITHUB_URL = "https://github.com/yaojunxiong";

export function AboutSection({ content }: AboutSectionProps) {
  const reveal = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="about" className="relative overflow-hidden bg-[#07071a] py-16 md:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,.16),transparent_68%)] pointer-events-none" />
      <div className="absolute left-1/2 top-0 h-px w-[min(760px,70vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-400/35 to-transparent shadow-[0_0_35px_rgba(99,102,241,.35)] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 h-[640px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.09] blur-[150px] pointer-events-none" />
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-400/[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute -right-40 bottom-0 h-[460px] w-[460px] rounded-full bg-fuchsia-500/[0.09] blur-[135px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div
          ref={reveal.ref}
          className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-14 xl:gap-16"
          style={reveal.isVisible ? revealStyles.visible : revealStyles.hidden}
        >
          <div className="human-ai-scene relative min-h-[500px] overflow-hidden rounded-[32px] border border-indigo-200/[0.11] bg-gradient-to-br from-indigo-500/[0.15] via-[#0b0d2c]/95 to-cyan-400/[0.07] shadow-[0_42px_130px_rgba(0,0,0,.5),0_0_70px_rgba(79,70,229,.08)] sm:min-h-[540px] lg:min-h-[570px] lg:rounded-[40px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_54%_30%,rgba(129,140,248,.2),transparent_32%),radial-gradient(circle_at_78%_62%,rgba(34,211,238,.12),transparent_28%),linear-gradient(180deg,transparent,rgba(7,7,26,.84))]" />
            <div className="about-scene-grid absolute inset-x-0 bottom-0 h-[64%] opacity-45" />

            <div className="absolute left-6 top-6 z-10 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-[10px] font-semibold uppercase tracking-[.24em] text-indigo-100/65 backdrop-blur-xl sm:left-8 sm:top-8 sm:text-[11px]">
              Human × AI
            </div>

            <div className="absolute right-6 top-6 z-10 flex items-center gap-2 rounded-full border border-emerald-300/10 bg-[#071425]/55 px-3 py-2 text-[9px] uppercase tracking-[.2em] text-emerald-200/55 backdrop-blur-xl sm:right-8 sm:top-8">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.8)]" />
              Co-creating
            </div>

            <WorldCharacters />

            <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between gap-5 sm:bottom-8 sm:left-8 sm:right-8">
              <div>
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[.3em] text-cyan-200/48 sm:text-[10px]">
                  Building together
                </p>
                <p className="max-w-[390px] text-[18px] font-medium leading-snug text-white/90 sm:text-[22px] lg:text-[24px]">
                  Learning, creating and connecting every digital space.
                </p>
              </div>
              <div className="hidden rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right backdrop-blur-xl sm:block">
                <span className="block text-[9px] uppercase tracking-[.2em] text-white/35">Human + AI</span>
                <strong className="text-sm font-medium text-cyan-200/80">One world</strong>
              </div>
            </div>
          </div>

          <div className="lg:pl-1">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[.32em] text-indigo-300/58">
              About the creator
            </p>
            <h2 className="text-[36px] font-semibold leading-[1.05] tracking-[-0.045em] text-white/95 md:text-[50px] lg:text-[54px]">
              {content.aboutHeading}
            </h2>
            <p className="mt-5 max-w-[560px] text-[16px] leading-relaxed text-indigo-100/58 md:text-[17px]">
              {content.aboutSubheading}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Tag label={content.aboutTagWork} color="#818cf8" />
              <Tag label={content.aboutTagStudy} color="#38bdf8" />
              <Tag label={content.aboutTagAi} color="#c084fc" />
            </div>

            <div className="mt-8 space-y-4">
              {content.aboutText.map((paragraph, index) => (
                <p key={index} className="max-w-[570px] text-[15px] leading-8 text-white/55">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-indigo-300/25 bg-gradient-to-r from-indigo-500/20 to-violet-500/15 px-6 py-3 text-[13px] font-medium text-indigo-50 shadow-[0_0_34px_rgba(99,102,241,.16)] transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200/40 hover:from-indigo-500/30 hover:to-violet-500/25"
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
      style={{
        background: `${color}14`,
        color,
        border: `1px solid ${color}2d`,
        boxShadow: `0 0 28px ${color}0d`
      }}
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
    <svg
      viewBox="0 0 760 590"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="aboutStageGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity=".5" />
          <stop offset="58%" stopColor="#4f46e5" stopOpacity=".17" />
          <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="aboutPlatform" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity=".7" />
          <stop offset="48%" stopColor="#818cf8" stopOpacity=".55" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity=".58" />
        </linearGradient>
        <linearGradient id="aboutHoodie" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3d4da2" />
          <stop offset="54%" stopColor="#252866" />
          <stop offset="100%" stopColor="#121735" />
        </linearGradient>
        <linearGradient id="aboutRobotBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4458bc" />
          <stop offset="48%" stopColor="#282d79" />
          <stop offset="100%" stopColor="#14183d" />
        </linearGradient>
        <linearGradient id="aboutDataBeam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="48%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <filter id="aboutSoftGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="aboutBrightGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="380" cy="380" rx="325" ry="210" fill="url(#aboutStageGlow)" />
      <ellipse cx="380" cy="466" rx="305" ry="58" fill="#050615" opacity=".72" />
      <ellipse cx="380" cy="457" rx="280" ry="44" fill="none" stroke="url(#aboutPlatform)" strokeWidth="2" opacity=".72" />
      <ellipse cx="380" cy="457" rx="224" ry="33" fill="none" stroke="#818cf8" strokeWidth="1" strokeDasharray="8 11" opacity=".42" className="about-orbit-line" />
      <path d="M105 456 380 392 655 456 380 518Z" fill="#4338ca" opacity=".055" />
      <path d="M176 431 380 392 586 431M144 459h472M190 486h380" fill="none" stroke="#67e8f9" strokeOpacity=".13" />

      <g opacity=".68">
        <circle cx="108" cy="176" r="3" fill="#67e8f9" />
        <circle cx="646" cy="166" r="4" fill="#c084fc" />
        <circle cx="688" cy="276" r="2.5" fill="#818cf8" />
        <circle cx="74" cy="296" r="2.5" fill="#818cf8" />
        <path d="M91 220h40M111 200v40M628 223h33M644 207v32" stroke="#818cf8" strokeOpacity=".25" />
      </g>

      <g transform="translate(304 75)">
        <g className="about-hologram-float">
          <rect width="152" height="92" rx="18" fill="#0c1435" fillOpacity=".72" stroke="#67e8f9" strokeOpacity=".45" />
          <path d="M20 68 49 46l22 12 31-32 29 18" fill="none" stroke="url(#aboutDataBeam)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="49" cy="46" r="4" fill="#38bdf8" />
          <circle cx="102" cy="26" r="4" fill="#c084fc" />
          <path d="M20 20h43M20 30h25M112 68h19" stroke="#e0e7ff" strokeOpacity=".28" strokeLinecap="round" />
        </g>
      </g>
      <path d="M380 167v56" stroke="#818cf8" strokeOpacity=".28" strokeDasharray="4 7" />
      <circle cx="380" cy="226" r="6" fill="#818cf8" opacity=".72" filter="url(#aboutBrightGlow)" />

      <g transform="translate(100 104)">
        <ellipse cx="150" cy="350" rx="112" ry="30" fill="#11122f" opacity=".7" />
        <g>
          <path d="M91 294 76 354h49l19-64Z" fill="#171b40" />
          <path d="m168 292 13 62h49l-30-69Z" fill="#131735" />
          <rect x="82" y="342" width="51" height="18" rx="9" fill="#0b0d22" />
          <rect x="180" y="342" width="57" height="18" rx="9" fill="#0b0d22" />
        </g>
        <path d="M63 162c11-51 44-77 91-77 49 0 82 29 91 78l22 145c2 15-10 29-26 29H70c-16 0-28-14-26-30Z" fill="url(#aboutHoodie)" stroke="#818cf8" strokeOpacity=".5" strokeWidth="2" />
        <path d="M86 170c17 20 41 31 68 31 29 0 54-12 70-34" fill="none" stroke="#818cf8" strokeOpacity=".3" strokeWidth="2" />
        <path d="m112 150 42 39 43-39" fill="#eef2ff" fillOpacity=".92" />
        <path d="M154 189v116" stroke="#6366f1" strokeOpacity=".5" />
        <path d="M109 218c27 13 65 13 91 0" fill="none" stroke="#38bdf8" strokeOpacity=".18" />
        <rect x="104" y="225" width="100" height="62" rx="13" fill="#090f29" stroke="#67e8f9" strokeOpacity=".42" />
        <path d="M122 247h64M122 263h42" stroke="#67e8f9" strokeOpacity=".62" strokeWidth="4" strokeLinecap="round" />
        <text x="154" y="281" textAnchor="middle" fill="#c7d2fe" fillOpacity=".55" fontSize="13" fontWeight="700">AI</text>

        <path d="M69 178c-27 36-39 75-33 119 3 20 22 31 39 20l55-38" fill="none" stroke="#2f347f" strokeWidth="32" strokeLinecap="round" />
        <path d="M236 179c26 31 37 66 36 103 0 13-8 24-20 29l-37 16" fill="none" stroke="#292f74" strokeWidth="32" strokeLinecap="round" />
        <circle cx="132" cy="278" r="16" fill="#e9c2a0" />
        <circle cx="216" cy="326" r="16" fill="#e9c2a0" />

        <circle cx="154" cy="92" r="67" fill="#edc7a7" />
        <path d="M88 92c-2-59 31-88 71-88 48 0 79 34 66 96-15-28-43-44-77-42-25 1-44 13-60 34Z" fill="#171525" />
        <path d="M95 76c11-42 33-64 68-67" fill="none" stroke="#29243e" strokeWidth="24" strokeLinecap="round" />
        <path d="M208 66c13 22 14 40 9 55" fill="none" stroke="#29243e" strokeWidth="16" strokeLinecap="round" />
        <ellipse cx="132" cy="95" rx="6" ry="5" fill="#252038" />
        <ellipse cx="179" cy="95" rx="6" ry="5" fill="#252038" />
        <path d="M137 119q18 14 37 0" fill="none" stroke="#a5675d" strokeWidth="4" strokeLinecap="round" />
        <path d="M118 82q13-8 26 0M169 82q13-8 26 0" fill="none" stroke="#4b3541" strokeWidth="3" strokeLinecap="round" />
        <circle cx="93" cy="106" r="7" fill="#e8b99a" opacity=".7" />
      </g>

      <g transform="translate(472 148)">
        <ellipse cx="92" cy="300" rx="104" ry="28" fill="#11122f" opacity=".7" />
        <g className="about-buddy-float">
          <path d="M74-8v-27" stroke="#818cf8" strokeWidth="5" strokeLinecap="round" />
          <circle cx="74" cy="-43" r="10" fill="#c084fc" filter="url(#aboutBrightGlow)" />
          <rect x="-4" y="-2" width="156" height="108" rx="38" fill="#111838" stroke="#67e8f9" strokeOpacity=".82" strokeWidth="3" />
          <rect x="12" y="15" width="124" height="70" rx="26" fill="#070d26" />
          <ellipse cx="48" cy="50" rx="10" ry="13" fill="#67e8f9" filter="url(#aboutBrightGlow)" />
          <ellipse cx="101" cy="50" rx="10" ry="13" fill="#c084fc" filter="url(#aboutBrightGlow)" />
          <path d="M57 72q17 11 35 0" fill="none" stroke="#a5f3fc" strokeWidth="4" strokeLinecap="round" />
          <path d="M16 119c5-15 18-24 34-24h48c18 0 33 11 38 28l22 93c5 22-11 43-34 43H36c-24 0-40-23-33-45Z" fill="url(#aboutRobotBody)" stroke="#818cf8" strokeOpacity=".66" strokeWidth="2" />
          <path d="M28 131c30 17 61 18 94 1" fill="none" stroke="#a5b4fc" strokeOpacity=".28" />
          <circle cx="75" cy="170" r="31" fill="#101638" stroke="#818cf8" strokeOpacity=".5" />
          <circle cx="75" cy="170" r="14" fill="#67e8f9" opacity=".88" filter="url(#aboutBrightGlow)" />
          <circle cx="75" cy="170" r="5" fill="#fff" />
          <rect x="-29" y="124" width="35" height="98" rx="17" fill="#292f73" stroke="#818cf8" strokeOpacity=".55" />
          <rect x="143" y="124" width="35" height="98" rx="17" fill="#292f73" stroke="#818cf8" strokeOpacity=".55" />
          <circle cx="-12" cy="224" r="16" fill="#b9c7f7" />
          <circle cx="160" cy="224" r="16" fill="#b9c7f7" />
          <rect x="27" y="246" width="38" height="62" rx="17" fill="#20265f" />
          <rect x="86" y="246" width="38" height="62" rx="17" fill="#20265f" />
          <rect x="17" y="296" width="51" height="18" rx="9" fill="#0b0d22" />
          <rect x="83" y="296" width="51" height="18" rx="9" fill="#0b0d22" />
        </g>
      </g>

      <path
        d="M316 430C357 374 405 371 466 372"
        fill="none"
        stroke="#818cf8"
        strokeOpacity=".2"
        strokeWidth="18"
        filter="url(#aboutSoftGlow)"
      />
      <path
        d="M316 430C357 374 405 371 466 372"
        fill="none"
        stroke="url(#aboutDataBeam)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 10"
        className="about-data-flow"
      />
      <circle cx="365" cy="392" r="6" fill="#38bdf8" filter="url(#aboutBrightGlow)" />
      <circle cx="414" cy="376" r="5" fill="#818cf8" filter="url(#aboutBrightGlow)" />
      <circle cx="460" cy="372" r="6" fill="#c084fc" filter="url(#aboutBrightGlow)" />
    </svg>
  );
}
