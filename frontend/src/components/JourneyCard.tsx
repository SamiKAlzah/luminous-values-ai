"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, HandHeart, Landmark, Leaf, type LucideIcon } from "lucide-react";
import { getJourney } from "../lib/content/load";
import type { JourneyId } from "../lib/types";
import { buttonClasses } from "./Button";
import { useLanguage } from "./LanguageProvider";

const ICONS: Record<JourneyId, LucideIcon> = {
  citizenship_shared_facility: Landmark,
  tolerance_accent: HandHeart,
  peace_before_escalation: Leaf,
};

export default function JourneyCard({ id }: { id: JourneyId }) {
  const { language, copy } = useLanguage();
  const Icon = ICONS[id];
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;
  const journey = getJourney(id).body[language];

  return (
    <article className="flex flex-col rounded-lg border border-line bg-surface-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-tint text-value-green">
          <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="text-small font-semibold text-value-green">{copy.values[id]}</p>
      </div>
      <h3 className="mt-3 text-h3 text-ink">{journey.title}</h3>
      <Link href={`/journey/${id}`} className={buttonClasses("quiet", "mt-5 self-start")}>
        <span>{copy.home.openJourney}</span>
        <Arrow className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
