import { ArrowUpRight, BookOpenCheck, Scale, ShieldAlert, type LucideIcon } from "lucide-react";
import { buttonClasses } from "./Button";

interface GuardrailNoticeProps {
  level: string;
  responseText: string;
  justification?: string;
}

/** Each level has its own icon and label, so meaning never rests on colour alone. */
const LEVELS: Record<string, { label: string; icon: LucideIcon }> = {
  level_d: {
    label: "المستوى (د): فتوى أو حالة خاصة أو نزاع فردي",
    icon: ShieldAlert,
  },
  level_c: {
    label: "المستوى (ج): مسائل خلافية أو قضايا فكرية شائكة",
    icon: Scale,
  },
  anti_hallucination: {
    label: "مقاومة الهلوسة: تصحيح حديث غير ثابت",
    icon: BookOpenCheck,
  },
};

const FALLBACK = { label: "حماية شرعية معتمدة", icon: ShieldAlert };

export default function GuardrailNotice({ level, responseText, justification }: GuardrailNoticeProps) {
  const { label, icon: Icon } = LEVELS[level] ?? FALLBACK;

  return (
    <section
      role="alert"
      className="w-full space-y-4 rounded-lg border border-danger bg-surface-card p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Icon className="mt-1 h-6 w-6 shrink-0 text-danger" strokeWidth={1.5} aria-hidden="true" />
          <div>
            <p className="text-caption font-bold text-danger">جدار الأمان الشرعي · تعذّر الرد</p>
            <h3 className="text-h3 text-ink">امتناع وإحالة وفق ضوابط الحزمة العلمية</h3>
          </div>
        </div>
        <span className="rounded-sm border border-danger px-2 py-0.5 text-caption font-semibold text-danger">
          {label}
        </span>
      </div>

      <p className="rounded-md bg-surface-200 p-4 text-body text-ink">{responseText}</p>

      {justification && (
        <p className="flex items-start gap-2 rounded-md bg-brand-tint p-4 text-small text-ink">
          <Scale className="mt-1 h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} aria-hidden="true" />
          <span>
            <span className="font-bold">السند والضابط المعتمد: </span>
            {justification}
          </span>
        </p>
      )}

      <div className="flex flex-col items-start justify-between gap-3 border-t border-line pt-4 sm:flex-row sm:items-center">
        <p className="text-small text-ink-muted">
          نطاق النظام: التوجيه القيمي والسلوكي العام فقط، ولا يفتي ولا يقضي في الخصومات.
        </p>
        <a
          href="https://www.alifta.gov.sa"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("quiet")}
        >
          <span>بوابة الإفتاء الرسمية</span>
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
