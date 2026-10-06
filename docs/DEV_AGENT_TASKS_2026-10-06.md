# Website changes, round 2 (2026-10-06): instructions for the web developer agent

Source of these changes: the owner's change list «التعديل الثاني للمنصّة.docx», the updated deck «قيم_مضيئة_العرض_المحدث_وفق_المرجعية_العلمية.pptx», and the owner's answers recorded here. Where this file gives Arabic text, copy it **exactly**, including «» quotes, diacritics and ـ marks.

## 0. Read first

**Repository and branch.** The repository is `luminous-values-ai` (GitHub `SamiKAlzah/luminous-values-ai`), and you work on branch `submission/router`. Never commit to or merge into `main`.

**App layout.**
- The app lives in `frontend/`: Next.js 16 static export, React 19, Tailwind v4, TypeScript strict and vitest.
- `frontend/AGENTS.md` says this Next.js has breaking changes. Before writing any page, layout or route, read the matching guide in `frontend/node_modules/next/dist/docs/`. Pages use async `params`, and new routes must work with `output: "export"`.

**Where text lives.**
- All interface text is in `frontend/src/lib/copy.ts` (`UI_COPY.ar` and `UI_COPY.en`).
- `copy.test.ts` checks that both languages have the same keys and array lengths, that no string is empty, and that there are no accuracy claims ("100%", "zero hallucination", "صفر هلوسة") and no "localhost". Every new key needs both languages.

**Content files.**
- Journey and message text lives in `frontend/content/*.json`. These files are drafts pending the reviewer (Ahmed Shubayr), and their approval is bound to a hash of the text.
- Edit them only where this file says so, and only the field named. Do not run `scripts/approve.ts`; only the reviewer does that.

**Do not touch:**
- the router (`src/lib/router/*`) and the evaluation (`eval/`, `src/lib/eval/*`);
- the safety floor (`content/safety-floor.json`);
- `netlify/functions/`;
- `.env.local`. Never print, paste or commit `ANTHROPIC_API_KEY`.

**Privacy rule.** No analytics, tracking pixels or third-party embeds. Social links are plain `<a>` links.

**Before you start, ask the owner.**
- Commit `f82fdaf` ("A_10") added a brand banner (`BrandBanner.tsx`, `public/brand/qiyam-mudiaa-logo.jpg`, changes to `Ornament.tsx`, `page.tsx` and `AboutContent.tsx`).
- The working tree has **staged, uncommitted changes that exactly undo A_10**.
- Ask whether to keep the banner (unstage with `git restore --staged . && git checkout -- .`) or remove it (commit the staged revert). Do not guess.

**Baseline check before editing.** From `frontend/`, run:

```
npm test && npm run lint && npm run build
```

All of these must pass before you start. With content still in draft, `npm run build` only warns.

## 1. Site name and tagline (header, titles, footer)

Remove "AI" from the name and shorten the tagline, as in the owner's screenshot of the header.

| Key in `copy.ts` | ar | en |
|---|---|---|
| `siteName` | `قيم مضيئة` | `Luminous Values` |
| `tagline` | `تهدي الروح إلى هدوئها` | `Bringing the soul to its calm` |
| `metaTitle` | `قيم مضيئة \| من القيمة إلى السلوك` | `Luminous Values \| From value to behaviour` |
| `about.metaTitle` | `حول المنصة والتحقق \| قيم مضيئة` | `About and verification \| Luminous Values` |
| `footer.line` | `قيم مضيئة · تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي 2026م` | `Luminous Values · AI in the Service of Islamic Content Challenge 2026` |

Afterwards, grep `frontend/src` and the root `README.md` for `قيم مضيئة AI` and `Luminous Values AI`. Replace every remaining occurrence with the new name. The README title becomes `# «قيم مضيئة» · Luminous Values`. Leave the challenge's own name ("AI in the Service of Islamic Content") unchanged.

## 2. Journey order: solution before effect (text and the real screens)

The owner decided that the journey itself changes order, not only the wording. The new order is:

**situation → first choice → solution (3 steps) → effect of your choice → trust card (source) → new situation → feedback → today's step**

### 2a. The flow logic: `frontend/src/lib/journey/flow.ts`
- `STEPS` becomes `["situation","first_choice","solution","effect","trust","new_situation","new_feedback","today"]`.
- `pickFirst` moves to `"solution"` instead of `"effect"`, and still records `firstChoice`.
- `NEXT`: `solution → effect`, `effect → trust`, `trust → new_situation`. The other steps are unchanged.
- `back` from `solution` returns to `first_choice` and clears `firstChoice`. The existing rule ("going back to `first_choice` clears it") already does this once `STEPS` is reordered. Check it.
- Update `flow.test.ts` to the new order. Keep every existing kind of check: next is ignored on choice steps, out-of-range picks are ignored, back clears choices, and progress stays out of 8 with no language field.

### 2b. The player: `frontend/src/components/JourneyPlayer.tsx`
- No structural change is needed beyond following the new step order. The `effect` screen still shows "your choice" plus that choice's feedback, and the `solution` screen still shows the 3 steps with the activity label.
- Check that `firstChosen` is available on the `effect` screen after passing through `solution`.

### 2c. The home page lead (`home.lead`)
Replace the commas with arrows and put solution before effect.
- **ar:** `اكتب ما حدث بكلماتك، وسنقترح عليك الرحلة الأقرب إليه: موقف ← اختيار ← حل ← أثر ← نص موثَّق ← موقف جديد تختبر به ما تعلمته.`
- **en:** `Write what happened in your own words and we will suggest the closest journey: situation → choice → solution → effect → verified source → a new situation to test what you learned.`

Arabic uses `←`, which reads correctly right to left; English uses `→`.

### 2d. The About page, "How it works", step 4 (`about.howSteps[3]`)
Swap so that solution comes before effect. Commas stay here; arrows are only for the home page.
- **ar:** `تُعرض الرحلة من محتوى مراجَع ثابت: موقف، اختيار، حل، أثر، نص موثَّق، موقف جديد، خطوة اليوم.`
- **en:** `The journey is shown from fixed reviewed content: situation, choice, solution, effect, verified source, new situation, today's step.`

## 3. Journey card labels and the citizenship title

- `values.citizenship_shared_facility`: ar `المواطنة الصالحة`, en `Good citizenship`. Tolerance and peace are unchanged.
- In `frontend/content/journeys/citizenship_shared_facility.json`, change `body.ar.title` from `المرفق لنا جميعًا` to **`المرافق لنا جميعًا`**. Change only that one field; it matches the deck (slides 4 and 5). The file is a draft, so its approval is not broken. Then:
  - run `npx vitest run src/lib/content` (must pass);
  - grep `docs/` and `frontend/` for `المرفق لنا جميعًا` and update any other mention to `المرافق لنا جميعًا` (for example in the spec), but not in old eval result files.

## 4. Value icon colour: Saudi flag green

On the home journey cards (`frontend/src/components/JourneyCard.tsx`), both the icon and the value label (المواطنة الصالحة / التسامح / السلام) become **Saudi flag green `#006c35`**. Today the label uses the gold `text-accent-ink`.

- Add a theme token `--value-green` in `frontend/src/app/globals.css`, exposed as `--color-value-green` in the `@theme inline` block:
  - light: `#006c35` (the flag green, already `--flag-green-600`);
  - dark: `#7cc79c`;
  - emerald: `#aedcc0`.
  The lighter greens keep the text readable (contrast of at least 4.5:1) on the dark backgrounds.
- In `JourneyCard`, use `text-value-green` for the icon and the label. Keep the icon tile background `bg-brand-tint`.

## 5. About page: "How it works?"

`about.howTitle`: ar `كيف تعمل؟`, en `How does it work?`

## 6. About page: new text for the «قيم تجمعنا» program section

Replace `about.programBody`. The title (`programTitle`) stays.

- **ar (exact):**
  `«قيم تجمعنا» برنامج إعلامي يُنشر على منصات التواصل الاجتماعي ويتضمن: رسائل قصيرة (تويتر)، ومقاطع مرئية (يوتيوب) ونشرات توعويّة (إنستغرام) تصل إلى جمهور متنوّع وتحفزه لزيارة المنصّة، فيحظى بمعرفة وتجربة تفاعليّة فيها تعلّم وتطبيق ورحلة مصحوبة بنصّ موثّق.`
- **en:**
  `«قيم تجمعنا» (Values That Bring Us Together) is a media program published on social platforms. It includes short messages (X / Twitter), video clips (YouTube) and awareness posts (Instagram) that reach a diverse audience and encourage them to visit the platform, where they gain knowledge and an interactive experience of learning, practice and a journey accompanied by a verified text.`

The English is a draft translation. List it in the handoff note for the owner to check.

## 7. New page: «من نحن» (About us)

Add a page at `/about-us`.

**Navigation.** Add a link in the header (`Header.tsx`, from `copy.nav`) between "الرحلة" and "حول المنصة والتحقق":
- ar: `من نحن`
- en: `About us`

**How to build it.** Follow the pattern of the About page:
- a server component `src/app/about-us/page.tsx` with `metadata` built from `UI_COPY.ar`;
- a client component (for example `src/components/AboutUsContent.tsx`) that reads `useLanguage()`;
- the `OrnamentBand` at the top, `text-h1` and `text-h2` headings, `max-w-4xl` and a mobile-first layout;
- new copy keys under `aboutUs` in both languages;
- page titles: ar `من نحن | قيم مضيئة`, en `About us | Luminous Values`.

**Content.** Copy the Arabic exactly. The English is a draft translation to flag for the owner.

1. **Intro** (no heading):
   - ar: `«قيم تجمعنا» برنامج إعلامي يُنشر على منصات التواصل الاجتماعي ويتضمن: رسائل قصيرة (تويتر)، ومقاطع مرئية (يوتيوب) ونشرات توعويّة (إنستغرام) تصل إلى جمهور متنوّع وتحفزه لزيارة المنصّة، فيحظى بمعرفة وتجربة تفاعليّة فيها تعلّم وتطبيق ورحلة مصحوبة بنصّ موثّق.`
   - en: same as the English in section 6.
2. **رؤيتنا / Our vision**
   - ar: `قيمنا الإسلاميّة تلهم الإنسانيّة.`
   - en: `Our Islamic values inspire humanity.`
3. **رسالتنا / Our mission**
   - ar: `برنامج إعلامي يُنشر على منصات التواصل الاجتماعي ويتضمن: رسائل قصيرة (تويتر)، ومقاطع مرئية (يوتيوب) ونشرات توعويّة (إنستغرام) تصل إلى جمهور متنوّع وتحفزه لزيارة المنصّة، فيحظى بمعرفة وتجربة تفاعليّة فيها تعلّم وتطبيق ورحلة موثّقة.`
   - en: `A media program published on social platforms, with short messages (X / Twitter), video clips (YouTube) and awareness posts (Instagram) that reach a diverse audience and encourage them to visit the platform, where they gain knowledge and an interactive experience of learning, practice and a documented journey.`
4. **أبرز أهدافنا / Our main goals** (a list):
   - ar:
     - `ترجمة أهداف رؤية المملكة 2030 إلى برامج عمليّة تعرّف بالإسلام.`
     - `تعزيز القيم الإسلامية لتكون محورًا ملهمًا للإنتاج الإعلامي المعاصر.`
     - `إنتاج مرئيات وتطبيقات تسمو بالمحتوى الإسلامي.`
   - en:
     - `Turning the goals of Saudi Vision 2030 into practical programs that introduce Islam.`
     - `Strengthening Islamic values as an inspiring focus for contemporary media production.`
     - `Producing visuals and applications that elevate Islamic content.`
5. At the bottom, the same social icon row as in section 8.

The source document has `( تويتر)` with a stray space inside the brackets. Write `(تويتر)`, as given above.

## 8. Social media icons: X, YouTube, Instagram

Placement, from the owner's screenshot: on the **home page, directly below the three journey cards**, a centred row of three round icon buttons, in this order (first one at the reading start, so on the right in Arabic):

1. X: `https://x.com/LuminousValues`
2. YouTube: `https://www.youtube.com/channel/UCca69WQD5QFMBbTbLaygCqQ`
3. Instagram: `https://www.instagram.com/luminous.values/`

**Where the links live.**
- Put the three entries in the existing `frontend/src/lib/social.ts` (`PROGRAM_SOCIAL_LINKS`), with labels `X`, `YouTube` and `Instagram`.
- Add an icon id per entry, for example `{ id: "x" | "youtube" | "instagram"; label; url }`.
- The footer (`SiteFooter.tsx`) already shows "تابع برنامج «قيم تجمعنا»" with links once this list is non-empty. Keep that working, ideally with the same icons.
- `social.test.ts` must still pass: every URL is https and every label is non-empty.

**Icons.**
- `lucide-react` 1.48 has **no brand icons** (no `youtube.js`, `instagram.js` or `twitter.js`).
- Create `frontend/src/components/SocialIcons.tsx` with inline SVG paths, using the simple-icons paths (CC0) for X, YouTube and Instagram.
- Do not add a new npm package, a font or any external script.
- Add the simple-icons source and its CC0 licence to `docs/REGISTER.md` under Software.

**Behaviour and style.**
- Each icon is an `<a href target="_blank" rel="noopener noreferrer">` with an `aria-label`:
  - ar: `قيم تجمعنا على X`, `قيم تجمعنا على يوتيوب`, `قيم تجمعنا على إنستغرام`;
  - en: `قيم تجمعنا on X`, `on YouTube`, `on Instagram`.
  Put these labels in `copy.ts`.
- Show a small caption above the row: the existing `footer.followProgram` text, "تابع برنامج «قيم تجمعنا»".
- Each button is round, at least 44×44 px, with a `border-line` outline and `bg-surface-card`.
- The icon uses `--value-green` from section 4 and turns `text-brand` on hover. The focus ring stays visible (the global `:focus-visible` style).
- Use one colour across the row, not the brands' own colours, to match the site's palette.
- No embeds, players, follower counts or tracking. This is only a row of links.

## 9. README and docs

- `README.md`:
  - new name (section 1);
  - the journey order (section 2);
  - the social accounts listed in the «قيم تجمعنا» section;
  - mention of the «من نحن» page.
- `docs/REVIEWER_CHECKLIST.md`: add a line that the citizenship Arabic title was changed to `المرافق لنا جميعًا` and that the English drafts for the About-us page and the program text need checking.

## 10. Verify

From `frontend/`:

```
npx tsc --noEmit
npm run lint
npm test
npm run build
```

All must pass. The build output must contain `out/about-us.html` (or `out/about-us/index.html`) and still exactly 3 journey pages.

Then run `npx netlify dev` from the repository root and check in a browser, in **Arabic and English**, at **desktop and 390 px width**:
- The header reads `قيم مضيئة` / `تهدي الروح إلى هدوئها` with no "AI", and the tab titles match.
- The home lead shows arrows and puts solution before effect. The citizenship card reads `المواطنة الصالحة` and `المرافق لنا جميعًا`. The icons and labels are flag green in the light theme and readable in the Night and Emerald themes.
- The social row under the cards has 3 icons that open the right URLs in a new tab. Each icon is reachable with Tab and has a visible focus ring.
- A full journey runs: situation → choice → **solution → effect** → source → new situation → feedback → today. Back works on every screen, and switching language mid-journey keeps the step and the chosen option.
- About shows "كيف تعمل؟", the new step 4 order and the new program text.
- `/about-us` shows the intro, رؤيتنا, رسالتنا, أبرز أهدافنا and the social row. The header link to it works.
- There is no horizontal scrolling at 390 px.

## 11. Commit, push, deploy

- Commit on `submission/router` with clear messages, then push to `origin submission/router`. Do not merge into `main`.
- **Deploy only when the owner says so.** The live site `luminous-values-ai.netlify.app` belongs to the Netlify team "Co-Founders" (account `ismsomyhi@gmail.com`). The last deploy was a direct CLI deploy from the repository root:
  ```
  npm --prefix frontend run build
  npx netlify deploy --prod --no-build --dir frontend/out --functions frontend/netlify/functions --message "<what changed>"
  ```
  This bypasses the content gate. The owner chose to publish draft content for now.
- **Known issue, not yours to fix:** on Netlify the routing function reports a key is configured, but every model call fails in about 300 ms, so visitors always get the three-card picker. The owner must replace `ANTHROPIC_API_KEY` in Netlify (Project configuration → Environment variables, with the Functions scope) and then redeploy.

## 12. Handoff note to the owner

When done, report:
- the commits and what each changed;
- the test, lint and build results;
- screenshots (Arabic and English) of the home page with the social row, a journey's solution and effect screens, About and About-us;
- the list of English draft translations for the owner to check (sections 6 and 7, `Good citizenship`, the tagline);
- anything you could not do, and why.
