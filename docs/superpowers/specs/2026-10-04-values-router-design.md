# «قيم تجمعنا» Semantic Journey Router: submission design

Status: **DRAFT v3 for owner review** (design sections 1-3 approved in conversation; section 4, §8 and §10, presented with this draft and awaiting approval; written spec not yet approved) · 2026-10-04 · Freeze: 2026-10-05 20:00 (Riyadh) · Official deadline: 2026-10-06 23:59
Track 03 (interactive experiences and learning journey), cross-cutting with Track 02 (localization).
Checked on 2026-10-04 against the Participant Guide (`Rules/da2Orb…pdf`) and the Reference Package (`Rules/BI5Zrl…pdf`).

Changes from v2: provider confirmed (Claude Haiku 4.5); reviewer confirmed with full availability; added cost-abuse guard and deterministic safety floor (§4); approval is bound to a content hash and source verification is split from the offline build gate (§5); evaluation extended with floor metrics, confidence intervals and a run-once rule (§6); UI, repo and schedule detailed (§8, §10).

## 1. Intent

A Saudi media platform that turns Islamic values into practised behaviour. The submission is the **learning platform** the media point to. A visitor types a real situation in their own words (Arabic or English); an AI router maps it to one of **3 reviewed journeys**, or to a safe referral. The journey walks them through situation, choice, effect, solution, verified Islamic source and a new situation that tests understanding.

Draft success statement (registration format): *"Our project addresses the difficulty of moving from a general message about a value to the right behaviour in a daily situation, and its success is measured by the share of participants who reach a fitting journey, and who answer a new situation appropriately after completing it."* This matches the Track 03 criterion (improved understanding, suitability and sequencing of content, journey continuity, with no inference of religious or sensitive traits).

Judging (final stage, from the Guide): technical quality and AI use 25%, reliability and scientific safety 15%, innovation 15%, UX 10%, benefit per track 20%, operational realism 10%, presentation and verifiability 5%.

Confirmed in conversation: AI provider is **Claude Haiku 4.5**; the content reviewer is qualified and has full availability until the freeze.
Assumptions (correct me): audience is adults (citizens and residents), Muslim or not, and the app never asks or infers religion. Team is one developer and one content reviewer. Media production (videos, posts, audio) is the next phase and is **not** part of this submission. The newest request (3 values) replaces the earlier 20-journey scope.

## 2. Scope

**In:** 3 values × 1 journey each, in Arabic and English: citizenship «المرفق لنا جميعًا», tolerance «لهجته مختلفة… ومكانه بيننا», peace «قبل أن يتصاعد الخلاف». Free-text router with a manual picker as backup. "Trust card" per journey. Evaluation page with real results. Mobile-first, RTL/LTR.

**Out (deferred, stated as such in README and deck):** media sample; the editorial assistant for media drafts; the 20 old cards (removed from the submission; sources unverified); French/Urdu; the FastAPI backend (removed from the submission branch, kept in git history); accounts, analytics, reminders, return-visit self-report.

## 3. User flow

Home: text box ("describe your situation") plus 3 journey cards → router result → journey screens, one task per screen, back button, progress indicator:
situation → first choice (3 options) → effect of the choice → solution (3 steps) → trust card (source) → **new situation** (3 options, no pre-marked answer; feedback after selection) → today's step. Direct entry to any journey is always possible.

## 4. Router (core AI function)

**Contract.** `POST /.netlify/functions/route` with `{text, lang?}`, `text` ≤ 500 chars. The function calls `claude-haiku-4-5-20251001` with one forced tool whose `input_schema` restricts the output to:

```
route: citizenship_shared_facility | tolerance_accent | peace_before_escalation
       | out_of_scope | refer_specialist | refer_safety
confidence: high | low
```

Nothing else comes back from the model. The function re-validates `route` against the closed list server-side; anything else is treated as a failure.

**Pipeline order.** (1) input checks (empty, length) → (2) cost-abuse guard → (3) safety floor → (4) model call → (5) validation → response.

**Behaviour.**
- A journey ID with `high` confidence opens the journey.
- `low` confidence or `out_of_scope` shows the 3-card picker with a short static message that says plainly that the platform guides values and does not answer open questions (this includes requests to produce or verify a hadith or verse: no citation is invented; the message points to dorar.net).
- `refer_specialist` covers the Reference Package's levels ج and د (personal rulings on a specific case, family/legal/medical matters with a sharia effect, disputed or highly sensitive questions): a static, reviewer-approved message that gives no ruling and refers to a qualified body.
- `refer_safety` (harassment, threats, abuse, self-harm) shows a static supportive message with verified Saudi resources and **no journey**; the user may start over.

**Safety floor (deterministic pre-filter).** A short reviewer-approved list of explicit threat and self-harm phrases in Arabic and English, matched after Arabic normalisation. A match returns `refer_safety` immediately, without calling the model. It is deliberately high-recall and low-precision: a false referral costs one "start over" click, while a safety case routed to a journey is the worst error. It replaces the old broad keyword guardrail, which is removed. The floor's phrase list lives in `content/safety-floor.json` and is subject to the same reviewer approval and content-hash rules as journeys.

**Cost-abuse guard.** The function is public and calls a paid API. It applies a per-IP rate limit and a daily call cap (best-effort, using what the Netlify runtime offers; the mechanism is decided in the spike). Beyond either limit the response is the picker with a visible "smart routing unavailable" note, never an error status. The key holder's monthly spend limit is the final backstop.

**Safety properties (stated precisely, not "100% safe").**
- The model never receives or produces religious text or user-visible prose. Verses, hadiths, steps and all messages come from the reviewed library by ID.
- The model can only return an ID from a closed list; the server rejects anything else. Prompt injection can at worst cause a wrong route, which the evaluation measures.
- Under low confidence the system holds back (picker or referral) rather than guessing, as the Package requires.

**Transparency and privacy (Package p.5).** A visible line next to the box: this is an AI-supported tool, not a human specialist. A privacy notice under the box: the text is sent to an AI service only to pick a journey, is not stored by us, and should not contain names or personal details. No accounts, no religion field, no analytics, raw text never logged.

**Failure.** Timeout (5 s), API error, invalid output, missing key, or a guard limit: show the 3-card picker with a visible note that smart routing is unavailable. The same note appears in the evaluation page's status line.

**Model settings.** Temperature 0, small `max_tokens`. `ANTHROPIC_API_KEY` is a Netlify environment variable only (never in the client bundle or repo). The key holder sets a **monthly spend limit** with enough headroom to last through final judging (§9).

## 5. Content library

One source of truth: `content/journeys/<id>.json`, imported by the frontend (replaces `frontend/src/data/localDatasets.ts`). Per journey, `ar` and `en`: situation, 3 choices with feedback, effect, 3 solution steps, new situation with 3 choices and feedback, today's step. Per source: `type` (quran|hadith), Arabic text exactly as in the reference, reference, grade, `url`, `urlCheckedAt`, English *translation of the meaning* with translation name, and the explanation, kept visually separate from the text. Our own steps and situations are labelled "suggested educational activity", never as sharia ruling.

**Source rules from the Reference Package (pp.3-5):**
- Quran: King Fahd Complex text; English meaning from the King Fahd Complex translation or one published on quranpedia.net.
- Hadith: from the Sahihayn, or another Sunnah book only after its grade is checked on dorar.net/hadith or Shamela; the grade is shown; no hadith without a source and an approved grade.
- Explanation of a verse: from dorar.net/tafseer or an early-century source, with the mufassir's words distinguished from the Quran text. Disputed matters are never stated categorically, and no blanket "definitive" wording on grades.
- English Islamic terms (e.g. Hadith, Sunnah, Fatwa) take the Al-Jamhara dictionary equivalent, not machine translation.

**Approval record bound to content.** Each journey carries `status: draft|approved`, `reviewedBy`, `reviewedAt`, `version`, and `contentHash` (hash over all user-visible text and sources). Any edit after approval changes the hash and un-approves the journey.

**Two separate checks.**
1. `scripts/verify-sources` (manual, needs network): fetch each URL, normalise Arabic, confirm the quoted text appears on the page, then write `urlCheckedAt` and a pass/fail result into the JSON, which is committed.
2. **Build gate** (offline, part of `npm run build`): in production builds, fail unless every published journey is `approved`, its stored `contentHash` matches, and its recorded link check is a pass. Preview and local builds warn only. This keeps a flaky external site from blocking the deploy at freeze.

I (assistant) draft the 3 journeys and propose one candidate source each, with links I have opened and matched. Nothing is `approved` until the reviewer verifies text, grade and translation. Open technical point: confirm a working Quranpedia ayah URL pattern first (`/ayah/<s>/<a>` returned 404 on 2026-10-04); fall back to a King Fahd Complex page if none works, with the reviewer approving whichever link is used.

## 6. Router evaluation

The **reviewer writes the 60-case test set before any prompt exists**, saved as `eval/cases.json` (`id, text, lang, expected | acceptable[], category`). Distribution: 30 in-scope (10 per journey: direct, paraphrased without obvious keywords, Saudi dialect, English), 10 ambiguous (with acceptable sets, e.g. a neighbour leaving trash by the door), 8 out-of-scope (including 3 requests to produce or verify a hadith or a misquoted verse), 6 referral to a specialist (levels ج/د), 6 safety. Split 20 dev / 40 test, stratified by category; **the prompt is tuned on dev only**. The test set is run once per frozen prompt hash; every run is listed on the results page.

**What is measured.** The full pipeline (safety floor, then model, then validator), importing the same `route` module the Netlify function uses, so the evaluation measures what ships.

**Baseline.** A bilingual keyword/overlap matcher built from the journey texts and a reviewer-agreed keyword list (agreed before anyone sees test results): the best simple alternative, not a strawman.

**Metrics**, both routers, same cases, **each case run 3 times**: top-1 accuracy on in-scope; acceptable-set hit rate on ambiguous; **referral recall** (specialist and safety cases that reach a referral; a safety case routed to a journey is the worst error); false-referral rate on in-scope; run-to-run consistency; latency p50/p95; fallback rate. Additionally: the safety floor alone (safety cases caught; in-scope cases wrongly caught) and the model with versus without the floor. Every score is reported as a count with a Wilson confidence interval (e.g. 27 of 30); no claim that one router beats the other unless the intervals separate.

**Output.** `scripts/eval` writes `eval/results/<date>.json` (model ID, prompt hash, git commit, per-category counts and intervals, known failures, measured token counts that feed the cost estimate). The About page renders that file as-is, with a **known failures** list and a live status line for smart-routing availability.

**Gate.** Any *dev* safety case routed to a journey blocks the prompt version. A test-set safety miss goes on the known-failures list; fixing it means a new prompt hash, a new labelled run and an honest note.

## 7. User study (Google Forms, not instrumented in-app)

8 adults (4 Arabic, 4 English), mixed Muslim/non-Muslim without recording religion. A one-line consent statement opens the form (anonymous, no names, no religion, used for evaluation only; responses stay out of the repo, only aggregates are published). Each participant gets two situations, one reached through the router and one through the manual picker (order alternated), giving a reference comparison on time to a fitting journey. Pre-question and post-question on a new situation measure understanding; ease rating and free comments. Target (not a promise): 7/8 reach a fitting journey within 3 minutes. Publish actual numbers, sample size and limits (no claim of behaviour change).

## 8. Architecture and repo changes

Next.js static export stays. Pages: `/` (router + cards), `/journey/[id]` (3 static params), `/about` (trust, AI role and limits, evaluation results, privacy). Language and theme state reuse the existing `LanguageProvider` and theme hook; the existing design tokens and three themes stay. After the logic works, a **time-boxed visual pass on the journey screens only** (typography, states, mobile layout), with no framework change.

New: `netlify/functions/route.ts` (the Netlify `functions` path must be checked against `base = "frontend"` and the static export in `netlify.toml`: a 30-minute spike done first), `content/`, `eval/`, `scripts/`. `frontend/AGENTS.md` warns that this Next.js version has breaking changes: read the bundled docs in `node_modules/next/dist/docs/` before writing route code.

Remove: the `localhost:8000` call, the 20 cards, hard-coded metrics, "100%" claims and the keyword guardrail in `page.tsx`; the `backend/` directory from the submission branch (kept in git history). Netlify deploys from `main`: merge at freeze, tag `v1.0-submission`.

## 9. Deliverables

Working link; public repo with an honest README (no "100%", no "zero hallucination"), run instructions, LICENSE file, **starting-version note** (baseline commit and the rights/licences of reused components; only work done Oct 4-6 is evaluated); sources/tools/licences register (Next, React, lucide, Cairo and Amiri fonts, Anthropic API, translation source); no secrets or participant data in the repo; evaluation and study results; **cost estimate** per request from measured tokens, with the picker as the fallback for the critical AI dependency; maintenance and content-review plan with named responsibilities; deck updates (slide 4 media becomes next phase, slide 6 describes the router, slide 9 shows results, slide 11 costs); ≤ 2-minute video; 5-minute talk plus 3 minutes of questions; save the platform's submission confirmation.

After Oct 6 the deployed version stays frozen and the API budget stays alive through final judging (Oct 19-22) and the ceremony (Oct 26).

## 10. Schedule and cut order

| When (Riyadh) | Developer / assistant | Reviewer |
|---|---|---|
| Oct 4 now to 12:00 | Lock spec, branch, Netlify function spike | Start the 60-case set; agree keyword list |
| Oct 4 12:00-20:00 | Library schema, router + baseline + eval script, `verify-sources` | Review drafted journeys, verify sources |
| Oct 4 night to Oct 5 12:00 | UI in both languages, remove old parts, About page, build gate | Approve AR/EN, referral messages, safety resources and floor phrases |
| Oct 5 12:00-18:00 | Fix findings, final eval run | Run the user study |
| Oct 5 18:00-20:00 | README, deck, video, tag `v1.0-submission` | Final content sign-off |
| Oct 6 | Review only, submit by 18:00 | |

Cut order if time runs out: video polish, then English tone polish, then the study to fewer participants. Never cut: router + evaluation, the 3 approved journeys, the build gate.

## 11. Acceptance

- Router returns a valid route or a visible fallback for any input, including empty, 5,000 characters, injection attempts, rate-limit/cap exhaustion and API outage (tested).
- The safety floor catches all reviewer-listed explicit cases without a model call (tested).
- All 3 journeys complete in AR and EN on a phone and keyboard; every shown source matches its link (`verify-sources` passes); the production build fails on an unapproved or edited journey (tested).
- Evaluation page shows real, dated router vs baseline results, repeated runs, confidence intervals and known failures.
- No unapproved content ships; no `localhost` reference; no absolute accuracy claims anywhere; AI disclosure and privacy notice visible.

## 12. Open items for the owner

1. Who recruits the 8 test participants, and by when?
2. Who holds the Anthropic key and sets its spend limit?
3. Reviewer's name for the approval record, and verified Saudi safety resources for `refer_safety`; the reviewer also owns the safety-floor phrase list.
4. LICENSE holder name (README states MIT).
5. Which track was chosen at registration? The Guide requires keeping to it (we assume Track 03).
6. Check Anthropic's current data-retention terms before the privacy notice is final.
7. Confirm the starting-version baseline commit for the note (v2 cited `379db8c`; the current branch also contains later commits, e.g. `60250fa`).
