"use client";

import type { Approval } from "../lib/content/schema";
import type { EvalResultFile, MetricCount } from "../lib/eval/metrics";
import BrandBanner from "./BrandBanner";
import { useLanguage } from "./LanguageProvider";
import { OrnamentBand, OrnamentDivider } from "./Ornament";
import SmartRoutingStatus from "./SmartRoutingStatus";

export interface ApprovalRow {
  id: string;
  label: { ar: string; en: string };
  approval: Approval;
}

const METRIC_KEYS = [
  "inScopeTop1",
  "ambiguousHit",
  "outOfScopeHandled",
  "specialistRecall",
  "safetyRecall",
  "falseReferral",
  "consistency",
] as const;

const ROUTER_COLUMNS = [
  { key: "baseline", label: "keywordBaseline" },
  { key: "model", label: "haikuWithFloor" },
  { key: "modelNoFloor", label: "haikuNoFloor" },
] as const;

function pct(x: number): string {
  return `${Math.round(x * 100)}`;
}

function cell(m: MetricCount | undefined): string {
  if (!m) return "—";
  return `${m.k}/${m.n} (${pct(m.lo)}–${pct(m.hi)}%)`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-h2 text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default function AboutContent({
  approvals,
  result,
}: {
  approvals: ApprovalRow[];
  result: EvalResultFile | null;
}) {
  const { language, copy } = useLanguage();
  const a = copy.about;

  return (
    <>
      <OrnamentBand />
      <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <BrandBanner />
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

        <OrnamentDivider />

        <Section title={a.approvalsTitle}>
          <p className="text-body text-ink-muted">{a.approvalsLead}</p>
          <div className="overflow-x-auto rounded-lg border border-line bg-surface-card">
            <table className="w-full text-start text-small">
              <thead className="bg-surface-200 text-ink">
                <tr>
                  <th className="p-3 text-start">&nbsp;</th>
                  <th className="p-3 text-start">{a.status}</th>
                  <th className="p-3 text-start">{a.by}</th>
                  <th className="p-3 text-start">{a.on}</th>
                  <th className="p-3 text-start">{a.version}</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((row) => {
                  const ok = row.approval.status === "approved";
                  return (
                    <tr key={row.id} className="border-t border-line">
                      <th scope="row" className="p-3 text-start font-semibold text-ink">
                        {row.label[language]}
                      </th>
                      <td className={`p-3 ${ok ? "text-success" : "text-ink-muted"}`}>
                        {ok ? a.approved : a.draft}
                      </td>
                      <td className="p-3 text-ink">{ok ? row.approval.reviewedBy : "—"}</td>
                      <td className="p-3 text-ink">{ok ? row.approval.reviewedAt : "—"}</td>
                      <td className="p-3 text-ink">{ok ? row.approval.version : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        <OrnamentDivider />

        <Section title={a.evalTitle}>
          {result === null ? (
            <p className="rounded-md border border-line bg-surface-card p-4 text-body text-ink">
              {a.evalNone}
            </p>
          ) : (
            <div className="space-y-5">
              <p className="text-body text-ink-muted">{a.evalLead}</p>
              <p className="text-small text-ink-muted">{a.evalProvisional}</p>

              <dl className="grid gap-x-6 gap-y-2 text-small sm:grid-cols-2">
                {(
                  [
                    [a.model, result.modelId],
                    [a.promptHash, result.promptHash.slice(0, 12)],
                    [a.commit, result.gitCommit.slice(0, 10)],
                    [a.runAt, result.runAt],
                    [a.runs, String(result.runsPerCase)],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex flex-wrap gap-2">
                    <dt className="font-semibold text-ink">{k}:</dt>
                    <dd className="break-all text-ink-muted" dir="ltr">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="overflow-x-auto rounded-lg border border-line bg-surface-card">
                <table className="w-full text-small">
                  <thead className="bg-surface-200 text-ink">
                    <tr>
                      <th className="p-3 text-start">{a.metric}</th>
                      {ROUTER_COLUMNS.map((c) => (
                        <th key={c.key} className="p-3 text-start">
                          {a[c.label]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {METRIC_KEYS.map((m) => (
                      <tr key={m} className="border-t border-line">
                        <th scope="row" className="p-3 text-start font-semibold text-ink">
                          {a.metrics[m]}
                        </th>
                        {ROUTER_COLUMNS.map((c) => (
                          <td key={c.key} className="p-3 text-ink" dir="ltr">
                            {cell(result.routers[c.key]?.[m])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1 text-small text-ink">
                <p className="font-semibold">{a.floorTitle}</p>
                <p>
                  {a.floorSafety}: <span dir="ltr">{cell(result.floor.safetyCaught)}</span>
                </p>
                <p>
                  {a.floorWrong}: <span dir="ltr">{cell(result.floor.inScopeWronglyCaught)}</span>
                </p>
                <p>
                  {a.latency}:{" "}
                  <span dir="ltr">
                    {Math.round(result.latencyMs.p50)} / {Math.round(result.latencyMs.p95)} ms
                  </span>
                </p>
                <p>
                  {a.tokens}:{" "}
                  <span dir="ltr">
                    {Math.round(result.meanTokens.input)} / {Math.round(result.meanTokens.output)}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="text-h3 text-ink">{a.failuresTitle}</h3>
                {result.knownFailures.length === 0 ? (
                  <p className="mt-1 text-small text-ink-muted">{a.failuresNone}</p>
                ) : (
                  <ul className="mt-2 space-y-1 text-small text-ink" dir="ltr">
                    {result.knownFailures.map((f, i) => (
                      <li key={`${f.router}-${f.caseId}-${i}`}>
                        <code>{f.router}</code> · {f.caseId}: expected <code>{f.expected}</code>, got{" "}
                        <code>{f.got}</code>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          <SmartRoutingStatus />
        </Section>

        <Section title={a.deferredTitle}>
          <ul className="list-disc space-y-2 ps-6 text-body text-ink">
            {a.deferred.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}
