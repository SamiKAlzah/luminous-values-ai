# Starting version / النسخة المبدئية

**Baseline commit:** `379db8c` (2026-10-04 09:38, "Create launch.json"), the last commit before the submission design documents.

Everything before it is part of the starting version, not new work:

- the first release of «قيم مضيئة AI» (2026-09-29, commits `e28ee79` to `8233172`): a Next.js front end with five values, about 20 scenario cards and a FastAPI backend;
- the 2026-10-03 interface refactor (`43355d3` to `60250fa`): design tokens, three themes, header, selectors, scripture block and the five-step home page.

**New work after `379db8c`** (2026-10-04 onwards):

- the Semantic Journey Router: closed-list Claude Haiku 4.5 classifier, deterministic safety floor, cost guard, Netlify function;
- the reviewed content library (3 journeys, messages, safety phrase list), hash-bound approval and the offline build gate;
- the evaluation harness and keyword baseline, the 60-case evaluation set and its results;
- the bilingual home page and router box, the journey player and trust card, the About page;
- the README, licence, register and this note.

**Rights and licences of reused components.** The prototype's interface components, design tokens and ornaments were written by the same team under the project's MIT licence. Third-party libraries, fonts and text sources are listed with their licences in [`docs/REGISTER.md`](docs/REGISTER.md).

---

**الإصدار المرجعي:** الالتزام `379db8c` (2026-10-04 09:38)، وهو آخر التزام قبل وثائق تصميم المشروع المقدَّم. ما قبله جزء من النسخة المبدئية: الإصدار الأول (2026-09-29) وإعادة تصميم الواجهة (2026-10-03). أما العمل الجديد بعده فهو الموجِّه الدلالي للرحلات، ومكتبة المحتوى المراجَع وبوابة البناء، وأداة التقييم، والصفحة الرئيسية وصفحة الرحلة وصفحة «حول المنصة». مصادر المكتبات والخطوط والنصوص ورخصها في [`docs/REGISTER.md`](docs/REGISTER.md).
