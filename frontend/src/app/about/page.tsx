import type { Metadata } from "next";
import safetyFloor from "../../../content/safety-floor.json";
import AboutContent, { type ApprovalRow } from "../../components/AboutContent";
import { JOURNEY_LIST, MESSAGES } from "../../lib/content/load";
import type { Approval } from "../../lib/content/schema";
import { UI_COPY } from "../../lib/copy";
import { loadLatestResult } from "../../lib/eval/loadLatest";

export const metadata: Metadata = {
  title: UI_COPY.ar.about.metaTitle,
  description: UI_COPY.ar.about.metaDescription,
};

export default function AboutPage() {
  const approvals: ApprovalRow[] = [
    ...JOURNEY_LIST.map((j) => ({
      id: j.id,
      label: { ar: j.body.ar.title, en: j.body.en.title },
      approval: j.approval,
    })),
    {
      id: MESSAGES.id,
      label: { ar: "رسائل المنصة", en: "Platform messages" },
      approval: MESSAGES.approval,
    },
    {
      id: "safety-floor",
      label: { ar: "قائمة عبارات الأمان", en: "Safety phrase list" },
      approval: safetyFloor.approval as Approval,
    },
  ];

  return <AboutContent approvals={approvals} result={loadLatestResult()} />;
}
