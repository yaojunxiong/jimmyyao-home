"use client";

import type { HomeContent } from "@/lib/home-content";
import { useReveal, revealStyles } from "@/lib/use-reveal";

/* ================================================================
   ProjectSection — 4 project screenshot cards
   ================================================================ */

type ProjectSectionProps = {
  content: Pick<HomeContent, "projectsHeading" | "projectsIntro" | "projects">;
};

export function ProjectSection({ content }: ProjectSectionProps) {
  const headerReveal = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="projects" className="relative bg-deep-gradient py-24 md:py-28 lg:pt-32 lg:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid pointer-events-none" />
      <div className="aurora-glow aurora-glow-blue" />

      <div className="section-container relative z-10">
        <header ref={headerReveal.ref} className="mb-16 md:mb-20 text-center"
          style={headerReveal.isVisible ? revealStyles.visible : revealStyles.hidden}>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-5">Projects & Works</p>
          <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-semibold tracking-[-0.02em] text-white/95 mb-4">
            {content.projectsHeading}
          </h2>
          <p className="text-[16px] md:text-[18px] text-indigo-200/60 max-w-[520px] mx-auto">
            {content.projectsIntro}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-7">
          {content.projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: HomeContent["projects"][number]; index: number }) {
  const reveal = useReveal<HTMLDivElement>({ threshold: 0.08, delay: index * 100 });

  return (
    <a href={project.href} target="_blank" rel="noopener noreferrer" className="block group">
      <article
        ref={reveal.ref}
        className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0c0c28]/80 transition-all duration-500"
        style={reveal.isVisible ? revealStyles.visible : revealStyles.hidden}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)";
          e.currentTarget.style.boxShadow = "0 16px 48px rgba(99,102,241,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Project screenshot */}
        <div className="relative h-[200px] md:h-[220px] overflow-hidden">
          <img
            src={project.screenshot}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c28] via-transparent to-transparent" />
        </div>

        {/* Info */}
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[17px] font-semibold text-white/95">{project.title}</h3>
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
              {project.status}
            </span>
          </div>
          <p className="text-[13px] text-white/40 mb-3">{project.description}</p>
          <div className="flex items-center gap-1.5 text-[12px] text-indigo-400 font-medium">
            <span>访问项目</span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:translate-x-[2px]">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </article>
    </a>
  );
}
