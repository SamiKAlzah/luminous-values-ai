"use client";

import { LifeBuoy, UserRoundCheck } from "lucide-react";
import { MESSAGES } from "../lib/content/load";
import Button from "./Button";
import { useLanguage } from "./LanguageProvider";

interface ReferralNoticeProps {
  kind: "refer_specialist" | "refer_safety";
  onStartOver: () => void;
}

/** Static, reviewer-approved referral text. No journey is offered alongside it. */
export default function ReferralNotice({ kind, onStartOver }: ReferralNoticeProps) {
  const { language, copy } = useLanguage();
  const safety = kind === "refer_safety";
  const Icon = safety ? LifeBuoy : UserRoundCheck;
  const message = MESSAGES.body[kind][language];

  return (
    <section
      role={safety ? "alert" : "status"}
      className={`rounded-lg border p-5 sm:p-6 ${
        safety ? "border-danger bg-surface-card" : "border-line bg-surface-card"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`h-6 w-6 ${safety ? "text-danger" : "text-brand"}`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <h2 className="text-h3 font-bold text-ink">
          {safety ? copy.referral.safetyTitle : copy.referral.specialistTitle}
        </h2>
      </div>
      <p className="mt-3 whitespace-pre-line text-body text-ink">{message}</p>
      <Button variant="quiet" onClick={onStartOver} className="mt-5">
        {copy.referral.startOver}
      </Button>
    </section>
  );
}
