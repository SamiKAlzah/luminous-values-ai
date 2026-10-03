import type { Metadata } from "next";
import AboutCredentials from "../../components/AboutCredentials";
import JudgesConsole from "../../components/JudgesConsole";
import { OrnamentBand, OrnamentDivider } from "../../components/Ornament";

export const metadata: Metadata = {
  title: "حول المنصة والتحقق | قيم مضيئة AI",
  description: "المرجعية الشرعية والحزمة العلمية، ومنصة فحص جدار الأمان للجنة التحكيم.",
};

export default function AboutPage() {
  return (
    <>
      <OrnamentBand height={48} />
      <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <h1 className="text-h1 text-ink">حول المنصة والتحقق</h1>
          <p className="mt-2 text-body text-ink-muted">
            من أين تأتي النصوص، وكيف يضبط النظام ردوده، وأداة للمحكّمين لتجربة جدار الأمان مباشرة.
          </p>
        </header>

        <AboutCredentials />
        <OrnamentDivider />
        <JudgesConsole />
      </div>
    </>
  );
}
