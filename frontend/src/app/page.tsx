"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import BrandBanner from "../components/BrandBanner";
import JourneyCard from "../components/JourneyCard";
import { useLanguage } from "../components/LanguageProvider";
import { OrnamentBand } from "../components/Ornament";
import ReferralNotice from "../components/ReferralNotice";
import RouterBox from "../components/RouterBox";
import { MESSAGES } from "../lib/content/load";
import { JOURNEY_IDS, type RouteResponse } from "../lib/types";

export default function Home() {
  const router = useRouter();
  const { language, copy } = useLanguage();
  const [result, setResult] = useState<RouteResponse | null>(null);

  function handleResult(r: RouteResponse) {
    if (r.outcome === "journey") {
      router.push(`/journey/${r.journeyId}`);
      return;
    }
    setResult(r);
  }

  const referral =
    result && (result.outcome === "refer_safety" || result.outcome === "refer_specialist")
      ? result.outcome
      : null;

  return (
    <>
      <OrnamentBand />
      <div className="mx-auto w-full max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <BrandBanner />
        <header className="max-w-3xl">
          <h1 className="text-h1 text-ink">{copy.home.title}</h1>
          <p className="mt-2 text-body text-ink-muted">{copy.home.lead}</p>
        </header>

        <RouterBox onResult={handleResult} />

        {referral ? (
          <ReferralNotice kind={referral} onStartOver={() => setResult(null)} />
        ) : (
          <>
            {result?.outcome === "picker" && (
              <p
                role="status"
                className="flex items-start gap-3 rounded-lg border border-line bg-brand-tint p-4 text-body text-ink"
              >
                <Info className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <span>{MESSAGES.body[result.reason][language]}</span>
              </p>
            )}

            <section aria-labelledby="journeys-heading">
              <h2 id="journeys-heading" className="text-h2 text-ink">
                {copy.home.cardsTitle}
              </h2>
              <p className="mt-1 text-body text-ink-muted">{copy.home.cardsLead}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {JOURNEY_IDS.map((id) => (
                  <JourneyCard key={id} id={id} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
