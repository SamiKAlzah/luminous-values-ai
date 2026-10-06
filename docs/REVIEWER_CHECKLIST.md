# Reviewer checklist (Ahmed Shubayr)

Everything under `frontend/content/` is a **draft**. Nothing ships until you approve it. Approval is bound to a hash of the file's text: if any approved file is edited afterwards, even by one character, it goes back to unapproved and the production build fails until you approve it again.

## A. Decisions for you

- [ ] **Hadith link and source (citizenship).** The hadith is Sahih Muslim 1914 (also al-Bukhari 652). The verifying link is HadeethEnc: https://hadeethenc.com/en/browse/hadith/6469. That page has the Arabic text, the grade `[ صحيح ] - [متفق عليه]`, an English translation and an explanation. The same grade `[صحيح]` is shown on dorar.net (https://dorar.net/h/k1ofLVng, https://dorar.net/hadith/sharh/6975). dorar.net and sunnah.com return 403 to scripted fetches, so `verify-sources` can never pass with them as `source.url`. Options: keep HadeethEnc, or use Shamela if you can find a page that serves plain requests.
- [ ] **Hadith translation and commentary.** Both the English translation and the explanation (Arabic from `/ar/browse/hadith/6469`, English from `/en/...`) are HadeethEnc's own published text, quoted in « » / " ".
- [ ] **Verse script and translation (49:11, 41:34).** The Arabic is now the Uthmani script (Hafs), copied from the Quranpedia English-translations page of each verse (`https://quranpedia.net/tafsir/al-hujurat/11/en`, `https://quranpedia.net/tafsir/fussilat/34/en`). Please compare it with the King Fahd Complex mushaf. The English is Saheeh International as published on Quranpedia. Other translations listed on both `/en` pages (fetched 2026-10-04): an unlabelled "الترجمة الإنجليزية" block, Dr. Ghali, Muhsin Khan, Pickthall, Yusuf Ali, a second Sahih International block, Maududi, Abdul Haleem, Taqi Usmani, Mustafa Khattab, Rowwad Translation Center, English Al-Mukhtasar and Adel Salahi. None is labelled "King Fahd Complex".
- [ ] **Our English renderings of Ibn Kathir.** The Arabic explanations of both verses quote Ibn Kathir verbatim. The English explanations are the drafting team's own rendering, and they say so in the text. Correct them, or replace them with a published English tafsir (for example the English Al-Mukhtasar on the `/en` page).
- [ ] **49:11 vs 49:13 for a mixed audience.** 49:11 opens «يا أيها الذين آمنوا» and addresses mockery and nicknames directly. 49:13 opens «يا أيها الناس» and is about peoples and tribes knowing one another (https://quranpedia.net/tafsir/al-hujurat/13). Choose one.
- [ ] **Al-Jamhara terms** in our English: hadith, Qur'an / Qur'anic, fatwa, Allah, Surah. Quoted translations keep their publishers' wording.
- [ ] **Official fatwa body for `refer_specialist`.** It currently says «جهة الإفتاء الرسمية» / "the official fatwa authority" and names no body or link. Add the official name if you want one.
- [ ] **`refer_safety` numbers and descriptions.** 911 (Unified Operations) or 999 for emergency and police; 1919 (Ministry of Human Resources and Social Development) for family safety and domestic violence; 937 (Ministry of Health) for mental-health and crisis consultation. The owner supplied these, and nobody has verified them yet.

## B. What to read and approve

Read every string in both languages:

| File (fileId) | Path |
|---|---|
| `citizenship_shared_facility` | `frontend/content/journeys/citizenship_shared_facility.json` |
| `tolerance_accent` | `frontend/content/journeys/tolerance_accent.json` |
| `peace_before_escalation` | `frontend/content/journeys/peace_before_escalation.json` |
| `messages` | `frontend/content/messages.json` |
| `safety-floor` | `frontend/content/safety-floor.json` |

For each journey, check:
- the situation, the 3 first choices and their feedback (the feedback is the "effect" screen);
- the 3 solution steps;
- the new situation, its 3 choices and their feedback;
- today's step;
- the source: Arabic text, reference, grade, link, translation and explanation.

No choice is marked correct in the data. The best option sits at a different position in each journey.

After review, run from `frontend/`:

```
npx tsx scripts/approve.ts <fileId> --by "Ahmed Shubayr"     # once per file above
npx tsx scripts/verify-sources.ts                            # all 3 journeys must PASS
CONTENT_GATE=strict npx tsx scripts/check-content.ts         # must exit 0
```

If `verify-sources` changes a journey's `sourceCheck`, the approval is not affected, because `sourceCheck` sits outside the hashed body. If you edit the text, approve again.

## C. Your own files

- **`frontend/eval/cases.json`**: write this before any prompt tuning. It holds 60 cases:
  - by category: 30 `in_scope` (10 per journey), 10 `ambiguous`, 8 `out_of_scope`, 6 `specialist`, 6 `safety`;
  - by split: 20 `dev` and 40 `test`, with every category present in both splits.
  - Each case has `id`, `text`, `lang` (`ar` or `en`), `category`, `split`, and either `expected` or `acceptable` (a list).
  - Labels are the journey ids (`citizenship_shared_facility`, `tolerance_accent`, `peace_before_escalation`), `picker`, `refer_specialist` or `refer_safety`.
  - An `in_scope` case's `expected` must be a journey id.
  - `npm run eval -- --split dev --routers baseline` (from `frontend/`) validates the file first and then runs only the keyword baseline, so no API key is needed.
- **`frontend/eval/keywords.json`**: the baseline router's keyword lists, per journey and for specialist referral, in `ar` and `en`. Prefer single distinctive words. Specialist terms match as substrings after normalisation. The current lists are seeds for you to replace.
- **`frontend/content/safety-floor.json`**: explicit self-harm, threat and abuse phrases in `ar` and `en`. They are matched as substrings after Arabic normalisation, so a short phrase also matches inside longer text. Prefer phrases that cannot occur in ordinary text, and keep it high-recall. The current list is a seed for you to replace. This file needs your approval like the others.

## D. Round 2 changes to check (2026-10-06)

- The Arabic title of the citizenship journey changed from `المرفق لنا جميعًا` to `المرافق لنا جميعًا` (`body.ar.title`). The file is still a draft; approve it as usual.
- The journey order is now situation, choice, solution, effect, verified source, new situation, today's step.
- English drafts to check: the «من نحن» (About us) page, the «قيم تجمعنا» program text on the About page, the card label `Good citizenship` and the tagline `Bringing the soul to its calm`.
