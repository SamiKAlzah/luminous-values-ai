"use client";

import React, { useState } from "react";
import { Check, Copy, ShieldCheck } from "lucide-react";
import { Scenario } from "../data/localDatasets";
import Button from "./Button";
import ScriptureBlock from "./ScriptureBlock";

interface ExperienceCardProps {
  scenario: Scenario;
  fitrahKey: string;
  valueName: string;
  environmentName: string;
}

/**
 * The experience, in reading order: the human insight, the behavioural step,
 * the scripture block with its source link, then a closing share action.
 */
export default function ExperienceCard({
  scenario,
  fitrahKey,
  valueName,
  environmentName,
}: ExperienceCardProps) {
  const [copied, setCopied] = useState(false);
  const gt = scenario.islamic_ground_truth;
  const grade = gt.authenticity_grade || (gt.source_type === "quran" ? "قطعي الثبوت والدلالة" : "صحيح");

  const handleCopy = async () => {
    const text = [
      `${valueName} | ${environmentName}`,
      `«${fitrahKey}»`,
      `الموقف السلوكي: ${scenario.title}\n${scenario.observable_situation}`,
      `الخطوات الإجرائية:\n${scenario.actionable_steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
      `السند الشرعي المعتمد:\n${gt.evidence_text}\nالمصدر: ${gt.reference_source}\nالتحقق: ${gt.verification_url}`,
    ].join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard unavailable (insecure context or denied): leave the button as is
    }
  };

  return (
    <article className="w-full space-y-6">
      {/* 1. الفطرة والوجدان */}
      <header>
        <p className="text-caption text-ink-muted">بوابة الفطرة والوجدان</p>
        <p className="mt-1 text-h3 text-ink">«{fitrahKey}»</p>
      </header>

      {/* 2. الموقف السلوكي والخطوات */}
      <section className="space-y-5 rounded-lg border border-line bg-surface-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
          <div>
            <p className="text-small text-ink-muted">
              الموقف الواقعي المقترح · {environmentName}
            </p>
            <h3 className="mt-1 text-h3 text-ink">{scenario.title}</h3>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-sm bg-brand-tint px-2 py-0.5 text-caption text-ink">
            <ShieldCheck className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />
            سلوك مقاس وملاحظ
          </span>
        </div>

        <p className="rounded-md bg-surface-200 p-4 text-body text-ink">
          <span className="font-bold">الواقع الملاحظ: </span>
          {scenario.observable_situation}
        </p>

        <div>
          <h4 className="mb-3 text-small font-semibold text-ink-muted">خطوات التطبيق خطوة بخطوة</h4>
          <ol className="space-y-3">
            {scenario.actionable_steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-brand text-small font-bold text-on-brand">
                  {idx + 1}
                </span>
                <p className="text-body text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. التأصيل الشرعي ومصادره */}
      <section aria-label="التأصيل الشرعي" className="space-y-4">
        <ScriptureBlock
          kind={gt.source_type}
          text={gt.evidence_text}
          reference={gt.reference_source}
          grade={grade}
          verificationUrl={gt.verification_url}
        />
        <p className="text-body text-ink">
          <span className="font-bold">التوجيه والدلالة: </span>
          {gt.tafseer_insight}
        </p>
      </section>

      {/* 4. المشاركة */}
      <div className="flex flex-col items-start justify-between gap-3 border-t border-line pt-4 sm:flex-row sm:items-center">
        <p className="text-small text-ink-muted">انشر الأثر وشارك السكينة في محيطك ومجتمعك</p>
        <Button variant="quiet" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              <span>تم النسخ</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              <span>نسخ البطاقة</span>
            </>
          )}
        </Button>
        <span role="status" className="sr-only">
          {copied ? "تم نسخ البطاقة" : ""}
        </span>
      </div>
    </article>
  );
}
