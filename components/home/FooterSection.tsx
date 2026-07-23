import type { HomeContent } from "@/lib/home-content";

/* ================================================================
   FooterSection — minimal
   ================================================================ */

type FooterSectionProps = {
  content: Pick<HomeContent, "footerTagline" | "footerLinks" | "copyright">;
};

export function FooterSection({ content }: FooterSectionProps) {
  return (
    <footer className="relative bg-[#07071a] py-14 md:py-20">
      <div className="section-container relative z-10">
        <div className="keyline mb-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <p className="text-[14px] text-indigo-200/30 max-w-[400px]">{content.footerTagline}</p>

          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3" aria-label="Footer">
            {content.footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-indigo-200/25 hover:text-indigo-200/50 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <p className="mt-8 text-[12px] text-indigo-200/15">{content.copyright}</p>
      </div>
    </footer>
  );
}
