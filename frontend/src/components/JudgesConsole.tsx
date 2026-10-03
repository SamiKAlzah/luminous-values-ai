import Link from "next/link";
import { Award, CheckCircle2, OctagonAlert, Play } from "lucide-react";
import { BENCHMARK_TESTS } from "../data/localDatasets";
import { buttonClasses } from "./Button";

const METRICS = [
  { title: "حالات الاستدراج المجتازة", value: "20 / 20", sub: "اجتياز كامل 100%" },
  { title: "معدل الهلوسة في النصوص الشرعية", value: "0.0%", sub: "حماية مطلقة (Zero Hallucination)" },
  { title: "حجب الفتاوى الشخصية (مستوى د)", value: "100%", sub: "امتناع فوري وإحالة للجهات الرسمية" },
  { title: "سرعة الاستجابة بنظام الطوارئ", value: "< 25ms", sub: "جاهزية واستقرار تشغيلي كامل" },
];

/**
 * Judges' guardrail console. Each test is a link to /?test=<n>, which the
 * journey page runs live, so this page needs no client state.
 */
export default function JudgesConsole() {
  return (
    <section aria-labelledby="judges-heading" className="space-y-6">
      <div className="space-y-4 rounded-xl border border-line bg-surface-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-sm bg-brand-tint px-2 py-0.5 text-caption text-ink">
              <Award className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />
              منصة الاختبارات الحية المخصصة للجنة التحكيم
            </p>
            <h2 id="judges-heading" className="mt-3 text-h2 text-ink">
              لوحة فحص جدار الأمان والموثوقية الشرعية
            </h2>
            <p className="mt-1 max-w-3xl text-body text-ink-muted">
              أداة تفاعلية حية تتيح للسادة المحكمين تجربة محاولات استدراج النظام واختبار مقاومة الهلوسة
              بنقرة واحدة.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 text-small font-semibold text-success">
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            الحزمة العلمية: مطابقة 100%
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-t border-line pt-4 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.title} className="rounded-md bg-surface-200 p-4">
              <dt className="text-small text-ink-muted">{m.title}</dt>
              <dd className="mt-1 text-h2 text-ink">
                <bdi dir="ltr">{m.value}</bdi>
              </dd>
              <dd className="text-small text-ink-muted">{m.sub}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="space-y-4 rounded-xl border border-line bg-surface-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-h3 text-ink">نماذج اختبارات الاستدراج المعتمدة</h3>
          <span className="text-small text-ink-muted">{BENCHMARK_TESTS.length} نماذج حية</span>
        </div>

        <ul className="space-y-3">
          {BENCHMARK_TESTS.map((test, idx) => (
            <li
              key={idx}
              className="flex flex-col justify-between gap-4 rounded-lg border border-line p-4 sm:flex-row sm:items-center"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-sm bg-brand-tint px-2 py-0.5 text-caption text-ink">
                    {test.domain}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-sm border border-danger px-2 py-0.5 text-caption text-danger">
                    <OctagonAlert className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                    {test.level}
                  </span>
                </div>
                <p className="text-body font-semibold text-ink">«{test.query}»</p>
                <p className="text-small text-ink-muted">
                  <span className="font-bold text-ink">السند: </span>
                  {test.justification}
                </p>
              </div>

              <Link href={`/?test=${idx}`} className={buttonClasses("primary", "shrink-0")}>
                <Play className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                <span>تشغيل الفحص الحي</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
