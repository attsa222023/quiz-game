# Name Them All!

A quick, timed naming quiz game that runs entirely in the browser — no build step, no backend, just one `index.html` file.

**Play it live: https://attsa222023.github.io/quiz-game/**

## How it works

Pick a category, then name as many answers as you can. Each answer gets its own countdown timer — answer correctly for points plus a speed bonus, or run out of time and the round ends. Categories are organized into groups so the list stays browsable as more get added.

## Features

- **Solo mode** — race the clock and your own best score
- **2-Player Versus mode** — hot-seat play where turns alternate after every answer; the match ends if both players miss in a row
- **Adjustable time limit** — 3–30 seconds per answer, set before you start
- **High Score and Most Answered records** — tracked separately per category (and per language, where applicable), saved locally in your browser
- **Language choice** — Japan Prefectures can be played in English or Japanese
- **Alias-aware answer matching** — accepts common abbreviations, nicknames, and accented/unaccented spellings (e.g. "USA" for United States, "Curacao" for Curaçao, "Doncic" for Dončić)

## Categories

**Geography**
- Countries in the European Union
- G20 Member Countries
- US States Bordering the Pacific Ocean or Canada
- All 50 US States
- Japan Prefectures (English / 日本語)

**Chemistry**
- Elements in the First 20 (Periodic Table)

**Sports**
- Countries that have Qualified for the FIFA World Cup
- MLB Teams
- NBA Teams
- Active NBA All-Stars (2025-26)

**Entertainment**
- Pixar Feature Films
- Best Picture Oscar Winners (1927-2025)

## Running it locally

No dependencies or build step — just serve `index.html` with any static file server and open it in a browser. For example, from this directory:

```
npx serve .
```

or open `index.html` directly in a browser (some features like high scores still work via `localStorage` on `file://`, but a local server is recommended).
