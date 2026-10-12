# Rishay's Learning Hub

A Grade 5 (IB PYP) practice and assessment platform covering **Maths**, **English** and **Unit of Inquiry**, with skill-by-skill mastery tracking.

- **Maths:** 28 skills across number sense, operations, fractions/decimals/percentages, measurement, shape and space, data handling, and pattern and function. Questions are generated fresh each time at 3 difficulty levels; the level rises as a skill becomes secure. Every answer shows the worked method.
- **English:** 17 skills: 14 grammar topics, spelling, figurative language and idioms, and reading comprehension (passages shared with `../rishay-english`).
- **Unit of Inquiry:** the six Cambridge Primary Science Stage 5 units (Life cycles of flowering plants, Sound, States and properties of matter, The digestive system, Forces and magnetism, Seasons and adaptations), following the unit list of Cambridge University Press's Learner's Book 5 (2nd ed., 2021, framework 0097). Questions live in `src/units-cambridge5.js`. Parents can add the school's real units; on claude.ai, Claude writes a question bank for them. Written answers are marked by Claude, or self-checked against a model answer.
- **Tracking:** mastery per skill (recent answers weigh more), statuses from "Needs work" to "Mastered", Today's mix (picks the weakest and least-recent skills), full check-ups, strand tests, unit tests, and a parent dashboard with mistakes log.

## Files
- `src/hub.src.html`: the source. Run `python3 build.py` after editing.
- `hub.html`: the built page published as a claude.ai Artifact (saves to the Claude account, uses Claude for marking and question writing).
- `index.html`: standalone copy for any browser or static host such as Vercel (saves in the browser; no Claude features).
