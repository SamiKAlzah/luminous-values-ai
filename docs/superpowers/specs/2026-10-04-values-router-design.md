# «قيم تجمعنا» Semantic Journey Router: submission design

Status: **DRAFT for owner approval** · 2026-10-04 · Freeze: 2026-10-05 20:00 (Riyadh) · Official deadline: 2026-10-06 23:59
Track 03 (interactive experiences and learning journey), cross-cutting with Track 02 (localization).

## 1. Intent

A Saudi media platform that turns Islamic values into practised behaviour. The submission is the **learning platform** the media point to. A visitor types a real situation in their own words (Arabic or English); an AI router maps it to one of **3 reviewed journeys**, or to a safe referral. The journey walks them through situation, choice, effect, solution, verified Islamic source and a new situation that tests understanding.

Success is judged on: a working AI function with an honest measured comparison (25%), source reliability (15%), understanding and completion results from a real test (20%), plus UX, operations and verifiability.

Assumptions (correct me): audience is adults (citizens and residents), Muslim or not, and the app never asks or infers religion. Team is one developer and one content reviewer. Media production (videos, posts, audio) is the next phase and is **not** part of this submission.

## 2. Scope

**In:** 3 values × 1 journey each, in Arabic and English: citizenship «المرفق لنا جميعًا», tolerance «لهجته مختلفة… ومكانه بيننا», peace «قبل أن يتصاعد الخلاف». Free-text router with a manual picker as backup. "Trust card" per journey. Evaluation page with real results. Mobile-first, RTL/LTR.

**Out (deferred, stated as such in README and deck):** media sample; the 20 old cards (removed from the submission; sources unverified); French/Urdu; the FastAPI backend (removed from the submission branch, kept in git history); accounts, analytics, reminders, return-visit self-report.

## 3. User flow

Home: text box ("describe your situation") plus 3 journey cards → router result → journey screens, one task per screen, back button, progress indicator:
situation → first choice (3 options) → effect of the choice → solution (3 steps) → trust card (source) → **new situation** (3 options, no pre-marked answer; feedback after selection) → today's step. Direct entry to any journey is always possible.

## 4. Router (core AI function)

**Contract.** `POST /.netlify/functions/route` with `{text, lang?}`, `text` ≤ 500 chars. The model returns structured output:

```
route: citizenship_shared_facility | tolerance_accent | peace_before_escalation
       | out_of_scope | refer_fatwa | refer_safety
confidence: high | low
```

Nothing else comes back from the model. The function validates `route` against the closed list; anything else is treated as a failure.

**Behaviour.** A journey ID with `high` confidence opens the journey. `low` confidence or `out_of_scope` shows the 3-card picker with a short static message. `refer_fatwa` shows a static, reviewer-approved referral to official fatwa bodies. `refer_safety` (harassment, threats, abuse, self-harm) shows a static supportive message with verified Saudi resources and **no journey**; the user may start over.

**Safety properties (stated precisely, not "100% safe").**
- The model never receives or produces religious text or user-visible prose. Verses, hadiths, steps and all messages come from the reviewed library by ID.
- The model can only return an ID from a closed list; the server rejects anything else. Prompt injection can at worst cause a wrong route, which the evaluation measures.
- The raw text is not stored or logged. No accounts, no religion field.

**Failure.** Timeout (5 s), API error, invalid output or missing key: show the 3-card picker with a visible note that smart routing is unavailable. The same note appears in the evaluation page's status line.

**Model.** `claude-haiku-4-5-20251001` via the Anthropic API, `ANTHROPIC_API_KEY` as a Netlify env var, small `max_tokens`, temperature 0. The key holder sets a **monthly spend limit** on the key (abuse and cost control).

## 5. Content library

One source of truth: `content/journeys/<id>.json`, imported by the frontend (replaces `frontend/src/data/localDatasets.ts`). Per journey, `ar` and `en`: situation, 3 choices with feedback, 3 solution steps, new situation with 3 choices and feedback, today's step. Per source: `type` (quran|hadith), Arabic text exactly as in the reference, reference, grade (as stated by the cited encyclopedia, no absolute wording), `url`, `urlCheckedAt`, English *translation of the meaning* with translation name, and a short explanation kept visually separate from the text.

Each journey carries `status: draft|approved`, `reviewedBy`, `reviewedAt`, `version`. **Build fails** if a published journey is not `approved` or a source has no passing link check. Link check (`scripts/verify-sources`): fetch the URL, normalize Arabic, confirm the quoted text appears on the page.

I (assistant) draft the 3 journeys and propose one candidate source each, with links I have opened and matched. Nothing is `approved` until the reviewer verifies text, grade and translation. Open technical point: confirm a working Quranpedia ayah URL pattern first (`/ayah/<s>/<a>` returned 404 on 2026-10-04).

## 6. Router evaluation

The **reviewer writes the 60-case test set before any prompt exists**, saved as `eval/cases.json` (`id, text, lang, expected | acceptable[], category`). Distribution: 30 in-scope (10 per journey: direct, paraphrased without obvious keywords, Saudi dialect, English), 10 ambiguous (with acceptable sets, e.g. a neighbour leaving trash by the door), 8 out-of-scope, 6 fatwa, 6 safety. Split 20 dev / 40 test, stratified; **the prompt is tuned on dev only**, results are reported on test.

Baseline: a bilingual keyword/overlap matcher built from the journey texts and a reviewer-agreed keyword list (built before looking at test results), the best simple alternative, not a strawman.

Metrics, both routers, same cases: top-1 accuracy on in-scope; acceptable-set hit rate on ambiguous; **referral recall** (fatwa and safety cases that reach a referral; a safety case routed to a journey is the worst error); false-referral rate on in-scope; latency p50/p95; fallback rate. `scripts/eval` writes a dated result file (model ID, prompt hash, git commit) that the About page renders as-is, including failures. Gate: any *dev* safety case routed to a journey blocks the prompt version.

## 7. User study (Google Forms, not instrumented in-app)

8 adults (4 Arabic, 4 English), mixed Muslim/non-Muslim without recording religion. Form: pre-question on a situation, task (use the app, time to reach a fitting journey), post-question on a new situation, ease rating, free comments. Target (not a promise): 7/8 reach a fitting journey within 3 minutes; understanding measured pre vs post. Publish actual numbers and sample size with the limits (no claim of behaviour change).

## 8. Architecture and repo changes

Next.js static export stays. New: `netlify/functions/route.ts` (the Netlify `functions` path must be checked against `base = "frontend"` in `netlify.toml`: a 30-minute spike done first), `content/`, `eval/`, `scripts/`. Pages: `/` (router + cards), `/journey/[id]`, `/about` (trust, AI role and limits, evaluation results). Remove: `localhost:8000` call, the 20 cards, hard-coded metrics and the keyword guardrail in `page.tsx`. Netlify deploys from `main`: merge at freeze.

## 9. Deliverables

Working link; public repo with an honest README (no "100%", no "zero hallucination"), run instructions, LICENSE file; sources/tools/licences register (Next, React, lucide, Cairo and Amiri fonts, Anthropic API, translation source); evaluation and study results; deck updates (slide 4 media becomes next phase, slide 6 describes the router, slide 9 shows results); ≤ 2-minute video; 5-minute talk plus 3 minutes of questions.

## 10. Schedule and cut order

| When (Riyadh) | Developer / assistant | Reviewer |
|---|---|---|
| Oct 4 now to 12:00 | Lock spec, branch, Netlify function spike | Start the 60-case set |
| Oct 4 12:00-20:00 | Library schema, router + baseline + eval script | Review drafted journeys, verify sources |
| Oct 4 night to Oct 5 12:00 | UI, bilingual, remove old parts, About page | Approve AR/EN, referral messages, resources |
| Oct 5 12:00-18:00 | Fix findings | Run the user study |
| Oct 5 18:00-20:00 | README, deck, video, tag `v1.0-submission` | Final content sign-off |
| Oct 6 | Review only, submit by 18:00 | |

Cut order if time runs out: video polish, then English tone polish, then the study to fewer participants. Never cut: router + evaluation, the 3 approved journeys, the build gate.

## 11. Acceptance

- Router returns a valid route or a visible fallback for any input, including empty, 5,000 characters, injection attempts and API outage (tested).
- All 3 journeys complete in AR and EN on a phone and keyboard; every shown source matches its link (script passes).
- Evaluation page shows real, dated router vs baseline results.
- No unapproved content ships; no `localhost` reference; no absolute accuracy claims anywhere.

## 12. Open items for the owner

1. Who recruits the 8 test participants, and by when?
2. Who holds the Anthropic key and sets its spend limit?
3. Reviewer's name for the approval record, and verified Saudi safety resources for `refer_safety`.
4. LICENSE holder name (README states MIT).
5. English translation of Quran meanings: which published translation, and its licence?
