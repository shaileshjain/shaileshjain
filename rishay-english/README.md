# Rishay's Daily English Paper

A Class 5 English practice paper that changes every day (40 marks, about 45 minutes):

- **Section A – Grammar (10):** 10 multiple-choice questions drawn from 14 topics (nouns, tenses, prepositions, punctuation, articles, vocabulary and more). Auto-marked, with an explanation for each wrong answer.
- **Section B – Reading (10):** a passage, poem or letter with 3 MCQs, 2 word-meaning questions (auto-marked) and 2 short answers (model answers shown after submitting).
- **Section C – Essay (10)** and **Section D – Story writing (10):** a topic or story prompt with planning hints and a live word count.

The same paper stays for the whole day, so Rishay can come back and finish it. Past papers can be opened from the two-week strip at the top.

## Files

- `paper.html` – the page source published as a claude.ai Artifact. There, progress is saved to the Claude account and an "Ask Claude to mark the writing" button marks the short answers, essay and story with rubric scores and corrections.
- `index.html` – the same page wrapped as a standalone HTML file. Open it in any browser; progress is saved in that browser, and a parent marks the writing using the mark boxes.

Rebuild `index.html` after editing `paper.html`:

```sh
(printf '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'; cat paper.html; printf '</body></html>') > index.html
```
