import { ExternalLink, Scale, ShieldAlert, ShieldCheck, type LucideIcon } from "lucide-react";

const SOURCES = [
  {
    domain: "القرآن الكريم والتفاسير المعتمدة",
    provider: "مصحف مجمع الملك فهد لطباعة المصحف الشريف",
    url: "https://quranpedia.net",
    desc: "نصوص الآيات القرآنية الكريمة بالرسم العثماني المعتمد مع تفاسير القرون الثلاثة الأولى وتفسير السعدي والميسر.",
  },
  {
    domain: "السنة النبوية والأحاديث الصحيحة",
    provider: "الموسوعة الحديثية - مؤسسة الدرر السنية",
    url: "https://dorar.net/hadith",
    desc: "أحاديث الصحيحين وما صححه جهابذة المحدثين، مع منع تام لأي حديث ضعيف أو موضوع أو لا أصل له.",
  },
  {
    domain: "المفردات والتوطين الثقافي",
    provider: "موسوعة الجمهرة لمفردات المحتوى الإسلامي",
    url: "https://islamic-content.com/dictionary",
    desc: "الترجمات المعتمدة للمصطلحات الشرعية الحساسة باللغات العالمية منعاً للترجمات الاستشراقية المشوهة.",
  },
  {
    domain: "الشبهات والأسئلة الحوارية",
    provider: "المستودع الدعوي الرقمي (بينات - ملف 7937)",
    url: "https://dawa.center",
    desc: "قواعد تفكيك الشبهات بالحكمة والمنطق الإنساني الهادئ دون تشنج أو عدائية.",
  },
];

// A and B answer; C and D hold back, so they carry the danger tone, with an icon.
const LEVELS: { label: string; title: string; desc: string; icon: LucideIcon; holdsBack: boolean }[] = [
  { label: "المستوى (أ)", title: "معلومات مستقرة", desc: "إجابة مباشرة موثقة بالسند الصحيح (قرآن وحديث).", icon: ShieldCheck, holdsBack: false },
  { label: "المستوى (ب)", title: "شرح واستدلال", desc: "استناد للمعتمد وتجنب القطع فيما يحتمل الخلاف.", icon: ShieldCheck, holdsBack: false },
  { label: "المستوى (ج)", title: "مسائل خلافية", desc: "تقييد بالمعتمد أو بيان الخلاف والإحالة للمختصين.", icon: ShieldAlert, holdsBack: true },
  { label: "المستوى (د)", title: "فتوى أو حالة خاصة", desc: "امتناع فوري وإحالة للجهات الرسمية المعتمدة.", icon: ShieldAlert, holdsBack: true },
];

export default function AboutCredentials() {
  return (
    <section aria-labelledby="about-heading" className="space-y-8">
      <div className="max-w-3xl">
        <p className="inline-flex items-center gap-1.5 text-small font-semibold text-accent-ink">
          <Scale className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          المطابقة المؤسسية والشرعية
        </p>
        <h2 id="about-heading" className="mt-1 text-h2 text-ink">
          المرجعية والحزمة العلمية المعتمدة في التحدي
        </h2>
        <p className="mt-2 text-body text-ink-muted">
          تم بناء نظام «قيم مضيئة AI» التزاماً حرفياً بوثيقة «المرجعية والحزمة العلمية والبيانات» الصادرة
          عن تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي 2026م (برعاية مؤسسة باذل الأهلية وسدايا
          ووزارة الاتصالات).
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SOURCES.map((src) => (
          <li key={src.provider} className="rounded-lg border border-line bg-surface-card p-6 shadow-sm">
            <p className="text-small font-semibold text-accent-ink">{src.domain}</p>
            <h3 className="mt-1 text-h3 text-ink">{src.provider}</h3>
            <p className="mt-2 text-body text-ink-muted">{src.desc}</p>
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-md text-small font-semibold text-brand hover:text-brand-hover"
            >
              <span>زيارة المرجع</span>
              <ExternalLink className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>

      <div className="space-y-4">
        <h3 className="text-h3 text-ink">مستويات ضبط الاستجابة الأربعة في النظام</h3>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEVELS.map(({ label, title, desc, icon: Icon, holdsBack }) => (
            <li
              key={label}
              className={`rounded-lg border bg-surface-card p-4 ${holdsBack ? "border-danger" : "border-line"}`}
            >
              <p
                className={`inline-flex items-center gap-1.5 text-small font-bold ${
                  holdsBack ? "text-danger" : "text-brand"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {label}
              </p>
              <p className="mt-1 text-body font-semibold text-ink">{title}</p>
              <p className="mt-1 text-small text-ink-muted">{desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
