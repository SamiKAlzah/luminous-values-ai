# Sources, tools and licences

Checked 2026-10-05. Licences are those stated by each project; confirm before redistributing outside this repository.

## Software

| Component | Use | Licence |
|---|---|---|
| Next.js 16 | Static-export web framework | MIT |
| React 19 | UI library | MIT |
| lucide-react | Icons | ISC |
| simple-icons (X, YouTube and Instagram glyph paths, inline SVG) | Social links; <https://github.com/simple-icons/simple-icons> | CC0 1.0 |
| Tailwind CSS 4 | Styling | MIT |
| TypeScript | Language | Apache-2.0 |
| vitest | Tests | MIT |
| tsx | Runs the evaluation and content scripts | MIT |
| ESLint | Linting | MIT |
| Netlify Functions and Netlify CLI | Hosting and the `route` function | Service terms / MIT (CLI) |

## Fonts

| Font | Use | Licence |
|---|---|---|
| Cairo | Interface text | SIL Open Font License 1.1 |
| Amiri | Qur'anic and hadith text | SIL Open Font License 1.1 |

## AI service

| Service | Use | Terms |
|---|---|---|
| Anthropic API, `claude-haiku-4-5-20251001` | Picks one journey ID from a closed list. It never receives or writes religious text. | Anthropic commercial terms. Data-retention terms to be re-read by the owner before the privacy notice is final. |

## Religious texts (content library)

| Journey | Text | Source shown to the user | Translation / explanation |
|---|---|---|---|
| `citizenship_shared_facility` | Hadith, Sahih Muslim 1914 (also al-Bukhari 652) | HadeethEnc.com page 6469 | HadeethEnc.com English translation and explanation |
| `tolerance_accent` | Qur'an 49:11 | Quranpedia, al-Hujurat 11 | Saheeh International (as published on Quranpedia); Arabic explanation quotes Ibn Kathir; English rendering of Ibn Kathir is the team's own and is labelled as such |
| `peace_before_escalation` | Qur'an 41:34 | Quranpedia, Fussilat 34 | Saheeh International (as published on Quranpedia); Arabic explanation quotes Ibn Kathir; English rendering is the team's own and labelled |

Each journey's Arabic text is checked against its page by `npx tsx scripts/verify-sources.ts`, which records the result in the content file. Final approval of text, grade and translation belongs to the content reviewer (see `docs/REVIEWER_CHECKLIST.md`).

Arabic terms in English (hadith, Qur'an, fatwa, Allah, Surah) follow the Al-Jamhara dictionary equivalents; quoted translations keep their publishers' wording.

## Own content

Situations, choices, feedback, solution steps and "today's step" are the project's own text, labelled "suggested educational activity" and never presented as a sharia ruling.
