"use client";

import { BadgeCheck, ExternalLink } from "lucide-react";
import type { Approval, Source } from "../lib/content/schema";
import { fmt } from "../lib/copy";
import { buttonClasses } from "./Button";
import { useLanguage } from "./LanguageProvider";

const SEPARATOR = " · ";

/** Content strings hold "Arabic · English"; show the half that matches the UI language. */
export function localizedPart(value: string, lang: "ar" | "en"): string {
  const i = value.indexOf(SEPARATOR);
  if (i === -1) return value;
  return lang === "ar" ? value.slice(0, i) : value.slice(i + SEPARATOR.length);
}

/**
 * The verified source for a journey. The Arabic text is shown exactly as stored; the
 * translation and the explanation sit in their own blocks so they are never mistaken
 * for the text itself.
 */
export default function TrustCard({ source, approval }: { source: Source; approval: Approval }) {
  const { language, copy } = useLanguage();
  const t = copy.trust;
  const approved = approval.status === "approved";

  return (
    <figure className="rounded-xl border border-line bg-scripture-surface p-5 sm:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <figcaption className="text-small font-semibold text-ink">
          {source.type === "quran" ? t.quran : t.hadith}
        </figcaption>
        <span className="inline-flex items-center gap-1.5 text-small font-semibold text-success">
          <BadgeCheck className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          {t.grade}: {localizedPart(source.grade, language)}
        </span>
      </div>

      <blockquote
        lang="ar"
        dir="rtl"
        className={`text-center font-serif text-ink ${
          source.type === "quran" ? "text-hadith sm:text-quran" : "text-hadith"
        }`}
      >
        {source.arabicText}
      </blockquote>

      <p className="mt-4 text-center text-small font-medium text-accent-ink">
        {t.reference}: {localizedPart(source.reference, language)}
      </p>

      {language === "en" && (
        <section className="mt-6 border-t border-line pt-4">
          <h3 className="text-small font-bold text-ink">{t.translation}</h3>
          <p className="mt-1 text-caption text-ink-muted">{source.translation.name}</p>
          <p className="mt-2 text-body text-ink">{source.translation.text}</p>
        </section>
      )}

      <section className="mt-6 border-t border-line pt-4">
        <h3 className="text-small font-bold text-ink">{t.explanation}</h3>
        <p className="mt-2 text-body text-ink">{source.explanation[language]}</p>
        <p className="mt-2 text-caption text-ink-muted">{t.explanationNote}</p>
      </section>

      <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-line pt-4 sm:flex-row sm:items-center">
        <span className="text-caption text-ink-muted">
          {approved &&
            fmt(t.reviewed, {
              by: approval.reviewedBy,
              date: approval.reviewedAt,
              version: approval.version,
            })}
        </span>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("quiet", "w-full sm:w-auto")}
        >
          <span>{t.verify}</span>
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
    </figure>
  );
}
