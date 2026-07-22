"use client";

import type { HomeContent as HomeContentData, HomeLanguage } from "@/lib/home-content";

type HomeContentProps = {
  language: HomeLanguage;
  copy: HomeContentData;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060b14]";

export function HomeContent({ copy }: HomeContentProps) {
  const { spaces, activity, aboutText } = copy;

  return (
    <main id="main" className="relative bg-gradient-to-b from-[#0a1422] via-[#070d18] to-[#04070e] text-slate-200">
      <a
        href="#spaces"
        className={`${focusRing} sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cyan-400 focus:px-4 focus:py-2 focus:font-semibold focus:text-[#04070e]`}
      >
        {copy.ctaGrowth}
      </a>

      {/* Section 2 — Three core spaces */}
      <section
        id="spaces"
        aria-labelledby="spaces-heading"
        className="mx-auto max-w-6xl scroll-mt-20 px-5 pb-20 pt-24 sm:px-8"
      >
        <header className="mb-10 max-w-2xl">
          <h2
            id="spaces-heading"
            className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            {copy.spacesHeading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300">{copy.spacesIntro}</p>
        </header>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {spaces.map((space) => (
            <li key={space.id}>
              <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.06] motion-reduce:transform-none motion-reduce:transition-none">
                <p className="text-xs font-semibold tracking-[0.18em] text-cyan-300/90">
                  {space.eyebrow}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">{space.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{space.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {space.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-cyan-300/70" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={space.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${focusRing} mt-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-[#04070e] transition hover:bg-cyan-300 motion-reduce:transition-none`}
                >
                  {space.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 3 + 4 — Recent activity & About */}
      <section
        id="growth"
        aria-labelledby="growth-heading"
        className="mx-auto max-w-6xl scroll-mt-20 px-5 pb-24 sm:px-8"
      >
        <header className="mb-10 max-w-2xl">
          <h2 id="growth-heading" className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {copy.growthHeading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300">{copy.growthIntro}</p>
        </header>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activity.map((group) => (
            <li
              key={group.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <h3 className="text-sm font-semibold tracking-wide text-cyan-200/90">{group.label}</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-slate-400/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-7">
          <h2 className="text-xl font-semibold text-white">{copy.aboutHeading}</h2>
          <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-300">
            {aboutText.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#04070e]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-bold tracking-tight text-white">{copy.heroName}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{copy.footerTagline}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
            {copy.footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${focusRing} rounded text-slate-300 underline-offset-4 transition hover:text-white hover:underline motion-reduce:transition-none`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
          <p className="text-xs text-slate-500">{copy.copyright}</p>
        </div>
      </footer>
    </main>
  );
}
