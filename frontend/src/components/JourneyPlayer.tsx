"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getJourney } from "../lib/content/load";
import type { Choice } from "../lib/content/schema";
import { fmt } from "../lib/copy";
import { initialFlow, progress, reduceFlow } from "../lib/journey/flow";
import type { JourneyId } from "../lib/types";
import Button, { buttonClasses } from "./Button";
import { useLanguage } from "./LanguageProvider";
import TrustCard from "./TrustCard";

function ChoiceGroup({
  legend,
  name,
  choices,
  selected,
  onSelect,
  onConfirm,
  confirmLabel,
}: {
  legend: string;
  name: string;
  choices: Choice[];
  selected: number | null;
  onSelect: (i: number) => void;
  onConfirm: () => void;
  confirmLabel: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (selected !== null) onConfirm();
      }}
    >
      <fieldset>
        <legend className="text-small font-semibold text-ink-muted">{legend}</legend>
        <div className="mt-3 space-y-3">
          {choices.map((c, i) => (
            <label
              key={i}
              className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 text-body text-ink ${
                selected === i ? "border-brand bg-brand-tint" : "border-line bg-surface-card hover:border-brand"
              }`}
            >
              <input
                type="radio"
                name={name}
                checked={selected === i}
                onChange={() => onSelect(i)}
                className="mt-2 h-4 w-4 shrink-0 accent-[var(--brand)]"
              />
              <span>{c.text}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit" disabled={selected === null} className="mt-4">
        {confirmLabel}
      </Button>
    </form>
  );
}

export default function JourneyPlayer({ id }: { id: JourneyId }) {
  const { language, copy } = useLanguage();
  const file = getJourney(id);
  const text = file.body[language];
  const j = copy.journey;

  const [flow, dispatch] = useReducer(reduceFlow, undefined, initialFlow);
  // A pending radio selection; confirmed with the button so arrow keys can browse the options.
  const [pendingFirst, setPendingFirst] = useState<number | null>(null);
  const [pendingNew, setPendingNew] = useState<number | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [flow.step]);

  const { index, total } = progress(flow);
  const stepLabel = fmt(j.stepOf, { n: index, total });
  const BackIcon = language === "ar" ? ArrowRight : ArrowLeft;
  const NextIcon = language === "ar" ? ArrowLeft : ArrowRight;

  const next = (
    <Button onClick={() => dispatch({ type: "next" })} className="mt-6">
      <span>{flow.step === "situation" ? j.start : j.next}</span>
      <NextIcon className="h-4 w-4" aria-hidden="true" />
    </Button>
  );

  function heading(label: string) {
    return (
      <h2 ref={headingRef} tabIndex={-1} className="text-h2 text-ink outline-none">
        {label}
      </h2>
    );
  }

  const firstChosen = flow.firstChoice !== null ? text.firstChoices[flow.firstChoice] : null;
  const newChosen = flow.newChoice !== null ? text.newChoices[flow.newChoice] : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-small font-semibold text-accent-ink">{copy.values[id]}</p>
      <h1 className="mt-1 text-h1 text-ink">{text.title}</h1>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => dispatch({ type: "back" })}
          disabled={flow.step === "situation"}
          className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-small font-semibold text-ink hover:bg-surface-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <BackIcon className="h-4 w-4" aria-hidden="true" />
          {j.back}
        </button>
        <span className="text-small text-ink-muted">{stepLabel}</span>
      </div>
      <div
        role="progressbar"
        aria-label={j.progress}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index}
        aria-valuetext={stepLabel}
        className="mt-2 h-2 w-full overflow-hidden rounded-pill bg-surface-200"
      >
        <div className="h-full rounded-pill bg-brand" style={{ width: `${(index / total) * 100}%` }} />
      </div>

      <section className="mt-8" aria-live="polite">
        {flow.step === "situation" && (
          <>
            {heading(j.situation)}
            <p className="mt-3 text-body text-ink">{text.situation}</p>
            {next}
          </>
        )}

        {flow.step === "first_choice" && (
          <>
            {heading(j.situation)}
            <p className="mt-3 mb-5 text-body text-ink">{text.situation}</p>
            <ChoiceGroup
              legend={j.chooseOne}
              name="first-choice"
              choices={text.firstChoices}
              selected={pendingFirst}
              onSelect={setPendingFirst}
              onConfirm={() => pendingFirst !== null && dispatch({ type: "pickFirst", index: pendingFirst })}
              confirmLabel={j.next}
            />
          </>
        )}

        {flow.step === "effect" && firstChosen && (
          <>
            {heading(j.effect)}
            <p className="mt-3 rounded-md border border-line bg-surface-card p-4 text-body text-ink">
              <span className="block text-small font-semibold text-ink-muted">{j.yourChoice}</span>
              {firstChosen.text}
            </p>
            <p className="mt-4 text-body text-ink">{firstChosen.feedback}</p>
            {next}
          </>
        )}

        {flow.step === "solution" && (
          <>
            {heading(j.solution)}
            <p className="mt-2 inline-block rounded-sm bg-brand-tint px-2 py-0.5 text-caption font-semibold text-ink">
              {text.activityLabel}
            </p>
            <ol className="mt-4 space-y-3">
              {text.solutionSteps.map((s, i) => (
                <li key={i} className="flex gap-3 rounded-md border border-line bg-surface-card p-4 text-body text-ink">
                  <span className="font-bold text-brand">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            {next}
          </>
        )}

        {flow.step === "trust" && (
          <>
            {heading(j.trustIntro)}
            <div className="mt-4">
              <TrustCard source={file.body.source} approval={file.approval} />
            </div>
            {next}
          </>
        )}

        {flow.step === "new_situation" && (
          <>
            {heading(j.newSituation)}
            <p className="mt-3 mb-5 text-body text-ink">{text.newSituation}</p>
            <ChoiceGroup
              legend={j.chooseOne}
              name="new-choice"
              choices={text.newChoices}
              selected={pendingNew}
              onSelect={setPendingNew}
              onConfirm={() => pendingNew !== null && dispatch({ type: "pickNew", index: pendingNew })}
              confirmLabel={j.next}
            />
          </>
        )}

        {flow.step === "new_feedback" && newChosen && (
          <>
            {heading(j.newFeedback)}
            <p className="mt-3 rounded-md border border-line bg-surface-card p-4 text-body text-ink">
              <span className="block text-small font-semibold text-ink-muted">{j.yourChoice}</span>
              {newChosen.text}
            </p>
            <p className="mt-4 text-body text-ink">{newChosen.feedback}</p>
            {next}
          </>
        )}

        {flow.step === "today" && (
          <>
            {heading(j.today)}
            <p className="mt-2 inline-block rounded-sm bg-brand-tint px-2 py-0.5 text-caption font-semibold text-ink">
              {text.activityLabel}
            </p>
            <p className="mt-4 rounded-lg border border-brand bg-surface-card p-5 text-body text-ink">
              {text.todayStep}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/" className={buttonClasses("primary")}>
                {j.tryAnother}
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
