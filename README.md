# «قيم مضيئة AI» · Luminous Values AI

A bilingual (Arabic / English) learning platform that turns Islamic values into behaviour in everyday situations. A visitor describes a real situation in their own words; an AI router maps it to one of **three reviewed journeys**, or to a safe referral. Each journey walks through situation, choice, effect, solution, a verified Islamic source and a new situation that tests what was learned.

Challenge: *AI in the Service of Islamic Content* (Bathel Foundation, SDAIA, MCIT), Track 03, interactive experiences and learning journeys. Licence: MIT ([LICENSE](LICENSE)). Starting version: [STARTING_VERSION.md](STARTING_VERSION.md). Sources and tools: [docs/REGISTER.md](docs/REGISTER.md).

## How it works

```
text → empty check → safety floor → cost guard → length check → Claude Haiku 4.5 → validation → journey | picker | referral
```

- **The model only picks an ID.** It returns one route from a closed list (3 journeys, `out_of_scope`, `refer_specialist`, `refer_safety`) and a confidence level. It never receives or writes verses, hadiths, advice or any text shown to the user. The server rejects anything outside the list.
- **All user-visible text is reviewed content.** Journeys, messages and the safety phrase list live in `frontend/content/` as JSON. Each file carries a reviewer, a version and a hash of its text; editing an approved file un-approves it, and a production build fails until it is approved again.
- **Safety floor.** A reviewer-owned list of explicit danger phrases is checked first, with Arabic normalisation, without calling the model. A match shows a supportive message with Saudi emergency, family-safety and mental-health numbers, and no journey.
- **Holding back.** Low confidence, out-of-scope questions, personal rulings, an API failure, a rate limit or an over-long text all end in the three-journey picker or a referral, never an error page. The platform gives no fatwas and does not grade hadiths.
- **Privacy.** The text is sent to the AI service only to choose a journey and is not stored or logged by this project. No accounts, no religion field, no analytics.

The router can be wrong. [`frontend/eval`](frontend/eval) measures it against a keyword baseline on a 60-case set (each case run 3 times, results with Wilson confidence intervals and a list of known failures), and the About page publishes the latest test-split result as recorded.

## Run it

Requires Node 22.

```bash
cd frontend
npm install
npm test            # unit tests
npm run lint
npm run build       # static export to frontend/out; warns about unapproved content
```

To run the page together with the routing function, from the repository root:

```bash
npx netlify dev
```

Use the local URL it prints. The function needs `ANTHROPIC_API_KEY`, set as a Netlify environment variable for the deployed site and in the git-ignored `frontend/.env.local` for local work. Never commit it. Without a key the site still works: routing falls back to the picker with a visible note.

### Evaluation

```bash
cd frontend
npm run eval -- --split dev --routers baseline   # no API key needed
npm run eval -- --split dev                      # all routers, needs the key
npm run eval -- --split test                     # once per frozen prompt hash
```

Results are written to `frontend/eval/results/`. Tune the prompt on `dev` only.

### Content and approval

```bash
cd frontend
npx tsx scripts/verify-sources.ts                          # checks each quoted text against its source page
npx tsx scripts/approve.ts <fileId> --by "<reviewer name>"  # after reading the file
CONTENT_GATE=strict npx tsx scripts/check-content.ts       # must exit 0 before a production build
```

The reviewer's checklist is [docs/REVIEWER_CHECKLIST.md](docs/REVIEWER_CHECKLIST.md). A production build (`CONTEXT=production` or `CONTENT_GATE=strict`) fails unless every content file is approved, its hash matches and its source check passes.

## Layout

| Path | Contents |
|---|---|
| `frontend/src/app` | Pages: home, `journey/[id]`, `about` |
| `frontend/src/lib/router` | Pipeline, model adapter, safety floor, guard, keyword baseline |
| `frontend/src/lib/content`, `lib/eval`, `lib/journey` | Content schema and gate, evaluation metrics, journey flow |
| `frontend/content` | Reviewed journeys, messages, safety phrases (JSON) |
| `frontend/netlify/functions/route.ts` | The routing function |
| `frontend/eval`, `frontend/scripts` | Evaluation cases, keyword lists, results; approve, verify and eval scripts |
| `docs/superpowers` | Design spec and implementation plan |

`backend/` and `data/` hold the first prototype (FastAPI service and the original 20 scenario cards). They are **not part of this submission** and are not used by the site.

## The «قيم تجمعنا» media program

«قيم تجمعنا» (Values That Bring Us Together) is a separate media program: short clips for YouTube Shorts and X, posts and an audio sample, published on social platforms, not on this website. Each clip or post links to its journey:

| Value | Journey link |
|---|---|
| Citizenship | `https://luminous-values-ai.netlify.app/journey/citizenship_shared_facility` |
| Tolerance | `https://luminous-values-ai.netlify.app/journey/tolerance_accent` |
| Peace | `https://luminous-values-ai.netlify.app/journey/peace_before_escalation` |

The website hosts no video or audio players. How many viewers move from a clip to the platform is measured with the social platforms' own click counts and the user study, so the website stays free of analytics. The program's social accounts go in `frontend/src/lib/social.ts`; the footer shows them once the list is filled.

## Not in this version

Languages other than Arabic and English; accounts, analytics and reminders.

---

## بالعربية

منصة تعليمية ثنائية اللغة تحوّل القيم الإسلامية إلى سلوك في مواقف الحياة اليومية. يكتب الزائر موقفًا بكلماته، فيوجّهه موجِّه ذكي إلى إحدى **ثلاث رحلات مراجَعة** أو إلى إحالة آمنة، ثم تمر الرحلة بالموقف والاختيار والأثر والحل ونص موثَّق وموقف جديد يختبر ما تعلّمه.

- **النموذج يختار رمزًا فقط** من قائمة مغلقة مع مستوى ثقة، ولا يرى ولا يكتب أي نص شرعي أو نصيحة. الآيات والأحاديث والخطوات والرسائل كلها من مكتبة محتوى يعتمدها المراجع العلمي.
- **الاعتماد مرتبط ببصمة النص:** أي تعديل بعد الاعتماد يُلغيه، ويفشل البناء الإنتاجي حتى يُعتمد الملف من جديد.
- **فحص الأمان:** قائمة عبارات خطر صريحة يملكها المراجع تُفحص أولًا دون استدعاء النموذج، وتُظهر أرقام الطوارئ وسلامة الأسرة والصحة النفسية.
- **الامتناع عند الشك:** عند ضعف الثقة أو السؤال المفتوح أو الحالة الشخصية أو تعطل الخدمة تظهر قائمة الرحلات الثلاث أو الإحالة. لا تصدر المنصة فتاوى ولا تحكم على الأحاديث.
- **الخصوصية:** يُرسَل النص إلى خدمة الذكاء الاصطناعي لاختيار الرحلة فقط، ولا يحفظه المشروع. لا حسابات ولا حقل للدين ولا تحليلات.

قد يخطئ التوجيه، ولذلك تُقاس دقته على 60 حالة مقابل خط أساس بالكلمات المفتاحية، وتنشر صفحة «حول المنصة» آخر نتيجة كما سُجّلت.

**برنامج «قيم تجمعنا»** برنامج إعلامي مستقل يُنشر على منصات التواصل الاجتماعي (مقاطع قصيرة ومنشورات وعينة صوتية)، ويقود كل مقطع إلى رحلته في المنصة عبر الروابط المذكورة أعلاه. لا تعرض المنصة مقاطع مرئية أو صوتية، ويُقاس الانتقال من المقطع إلى المنصة بإحصاءات منصات التواصل نفسها وبتجربة المستخدمين، دون أي تحليلات داخل الموقع.

ما لم يدخل هذا الإصدار: لغات أخرى غير العربية والإنجليزية، والحسابات والتحليلات والتذكيرات.
