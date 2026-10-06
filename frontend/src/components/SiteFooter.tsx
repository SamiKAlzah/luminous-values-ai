"use client";

import { PROGRAM_SOCIAL_LINKS } from "../lib/social";
import { useLanguage } from "./LanguageProvider";
import { SocialGlyph } from "./SocialIcons";

export default function SiteFooter() {
  const { copy } = useLanguage();

  return (
    <footer className="mt-16 w-full bg-surface-deep text-ink-on-deep">
      {PROGRAM_SOCIAL_LINKS.length > 0 && (
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 border-b border-white/10 px-4 py-4 text-small sm:px-6 lg:px-8">
          <span className="font-bold">{copy.footer.followProgram}</span>
          {PROGRAM_SOCIAL_LINKS.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.social[l.id]}
              className="inline-flex min-h-11 items-center gap-2 underline"
            >
              <SocialGlyph id={l.id} className="h-4 w-4" />
              <span>{l.label}</span>
            </a>
          ))}
        </div>
      )}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-small sm:px-6 md:flex-row lg:px-8">
        <p className="font-bold">{copy.footer.line}</p>
        <p className="text-center">{copy.footer.partners}</p>
        <p>{copy.footer.license}</p>
      </div>
    </footer>
  );
}
