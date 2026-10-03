import { CheckCircle2, ExternalLink } from "lucide-react";
import { buttonClasses } from "./Button";

interface ScriptureBlockProps {
  kind: "quran" | "hadith";
  /** Sourced text, rendered exactly as given. */
  text: string;
  reference: string;
  grade: string;
  verificationUrl: string;
}

/**
 * Quran or Hadith in a quiet block: Amiri on scripture-surface with room for
 * diacritics, the reference beneath, then the verification link. No ornament
 * inside; scripture is never decorated.
 */
export default function ScriptureBlock({
  kind,
  text,
  reference,
  grade,
  verificationUrl,
}: ScriptureBlockProps) {
  const isQuran = kind === "quran";

  return (
    <figure className="rounded-xl border border-line bg-scripture-surface p-6 sm:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <figcaption className="text-small font-semibold text-ink">
          {isQuran ? "آية كريمة من القرآن العظيم" : "حديث نبوي شريف ثابت"}
        </figcaption>
        <span className="inline-flex items-center gap-1.5 text-small font-semibold text-success">
          <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          {grade}
        </span>
      </div>

      <blockquote
        lang="ar"
        dir="rtl"
        className={`text-center font-serif text-ink ${
          isQuran ? "text-hadith sm:text-quran" : "text-hadith"
        }`}
      >
        {text}
      </blockquote>

      <p className="mt-4 text-center text-small font-medium text-accent-ink">{reference}</p>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-line pt-4 sm:flex-row">
        <span className="text-small text-ink-muted">
          المصدر المعتمد:{" "}
          {isQuran
            ? "مصحف مجمع الملك فهد لطباعة المصحف الشريف"
            : "الموسوعة الحديثية - الدرر السنية"}
        </span>
        <a
          href={verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("quiet", "w-full sm:w-auto")}
        >
          <span>فحص السند ({isQuran ? "Quranpedia" : "Dorar.net"})</span>
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
    </figure>
  );
}
