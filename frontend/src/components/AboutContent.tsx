"use client";

import { useLanguage } from "./LanguageProvider";
import { OrnamentBand } from "./Ornament";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-h2 text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default function AboutContent() {
  const { copy } = useLanguage();
  const a = copy.about;

  return (
    <>
      <OrnamentBand height={48} />
      <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <header>
          <h1 className="text-h1 text-ink">{a.title}</h1>
          <p className="mt-2 text-body text-ink-muted">{a.lead}</p>
        </header>

        <Section title={a.howTitle}>
          <ol className="list-decimal space-y-2 ps-6 text-body text-ink">
            {a.howSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </Section>

        <Section title={a.programTitle}>
          <p className="text-body text-ink">{a.programBody}</p>
        </Section>

        <Section title={a.aiTitle}>
          <ul className="list-disc space-y-2 ps-6 text-body text-ink">
            {a.aiPoints.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>

        <Section title={a.privacyTitle}>
          <p className="text-body text-ink">{a.privacyBody}</p>
        </Section>
      </div>
    </>
  );
}
