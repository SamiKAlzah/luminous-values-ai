"use client";

import { useLanguage } from "./LanguageProvider";
import { OrnamentBand } from "./Ornament";
import SocialIcons from "./SocialIcons";

export default function AboutUsContent() {
  const { copy } = useLanguage();
  const a = copy.aboutUs;

  return (
    <>
      <OrnamentBand height={48} />
      <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <header>
          <h1 className="text-h1 text-ink">{a.title}</h1>
          <p className="mt-2 text-body text-ink">{a.intro}</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-h2 text-ink">{a.visionTitle}</h2>
          <p className="text-body text-ink">{a.vision}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h2 text-ink">{a.missionTitle}</h2>
          <p className="text-body text-ink">{a.mission}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h2 text-ink">{a.goalsTitle}</h2>
          <ul className="list-disc space-y-2 ps-6 text-body text-ink">
            {a.goals.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-h2 text-ink">{a.programsTitle}</h2>
          <p className="text-body text-ink">{a.programs}</p>
        </section>

        <SocialIcons />
      </div>
    </>
  );
}
