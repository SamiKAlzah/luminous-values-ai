export default function SiteFooter() {
  return (
    <footer className="mt-16 w-full bg-surface-deep text-ink-on-deep">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-small sm:px-6 md:flex-row lg:px-8">
        <p>
          <span className="font-bold">قيم مضيئة AI</span>
          <span> · تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي 2026م</span>
        </p>
        <p className="text-center">
          مؤسسة باذل الأهلية · الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA) · وزارة الاتصالات
          وتقنية المعلومات
        </p>
        <p>مرخص تحت رخصة MIT مفتوحة المصدر</p>
      </div>
    </footer>
  );
}
