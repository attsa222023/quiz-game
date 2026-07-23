# Name Them All!

A quick, timed naming quiz game that runs entirely in the browser — no build step, no bundler.

**Play it live: https://attsa222023.github.io/quiz-game/**

## How it works

Pick a category, then name as many answers as you can. Each answer gets its own countdown timer — answer correctly for points plus a speed bonus, or run out of time and the round ends. Categories are organized into groups so the list stays browsable as more get added.

## Features

- **Solo mode** — race the clock and your own best score
- **2-Player Versus mode** — hot-seat play where turns alternate after every answer; the match ends if both players miss in a row
- **Online Versus mode** — play against someone on a different device: create a match to get a short room code, share it, and play in real time once they join (see [Online play](#online-play) below)
- **Adjustable time limit** — 3–30 seconds per answer, set before you start
- **High Score and Most Answered records** — tracked separately per category (and per language, where applicable), saved locally in your browser
- **Language choice** — Japan Prefectures, Naturally Occurring Elements, 88 IAU Constellations, MLB Teams, and NBA Teams support both English and Traditional Chinese; First Generation Pokémon supports English, Japanese, and Traditional Chinese
- **Alias-aware answer matching** — accepts common abbreviations, nicknames, and accented/unaccented spellings (e.g. "USA" for United States, "Curacao" for Curaçao, "Doncic" for Dončić)
- **Category search and language filter** — search across every group at once by name, and/or filter down to only categories available in a specific language

## Categories

**Geography**
- Countries in the European Union
- G20 Member Countries
- US States Bordering the Pacific Ocean or Canada
- All 50 US States
- Japan Prefectures (English / 日本語)
- Taipei MRT Stations (繁體中文 only for now)

**Science**
- Naturally Occurring Elements (Periodic Table) — the 94 naturally occurring elements, Hydrogen through Plutonium (English / 繁體中文 — accepts chemical symbols too, e.g. "Fe" for Iron)
- 88 IAU Constellations (English / 繁體中文 — accepts official 3-letter IAU abbreviations too, e.g. "UMa" for Ursa Major)

**Sports**
- Countries that have Qualified for the FIFA World Cup
- MLB Teams (English / 繁體中文)
- NBA Teams (English / 繁體中文)
- Active NBA All-Stars (2025-26)
- Summer Olympic Sports

**Entertainment**
- Pixar Feature Films
- Marvel Cinematic Universe Films
- First Generation Pokémon (151) (English / 日本語 / 繁體中文)
- Best Picture Oscar Winners (1927-2025)

**Culture**
- Taiwanese Surnames (Top 150) (繁體中文 only for now)
- Japanese Surnames (Top 100) (日本語 only for now)
- Interbrand Best Global Brands (2025)

## Files

- `index.html` — markup
- `style.css` — all styling
- `categories.js` — the category/answer data
- `logic.js` — pure answer-matching/scoring-key helpers (no DOM/Firebase), shared by `game.js` and the test suite
- `records.js` — localStorage-backed high score / most-answered / cleared-before persistence
- `menu.js` — menu screen: group/category browsing, search, language filter, online create/join sub-UI
- `game.js` — gameplay state and logic (solo, local versus, and online versus) plus online session management
- `firebase-init.js` / `online.js` — Firebase Firestore wiring for Online Versus mode (see below)
- `firestore.rules` — Firestore security rules (deployed via the Firebase console, not part of the app bundle)
- `test.html` / `test/` — unit tests for `logic.js` (see below)

## Tests

`logic.js` (answer normalization/alias matching, category-source resolution, score-record keys, remaining-answers computation) has unit tests in `test/logic.test.js`, run by a tiny zero-dependency harness (`test/test-runner.js`) — no Node/npm required, matching this project's no-build-step approach. Open `test.html` in a browser (or via a static file server, or directly over `file://`) to run them; results render on the page and the tab title shows a live `N/M passing` count.

Everything else (DOM rendering, Firestore sync) is intentionally left to manual verification rather than automated tests — the real bugs this project has hit so far have been cross-device timing/state-sync issues that only show up when actually driving the app, not something a unit test would catch.

## Online play

Online Versus is backed by [Firebase Firestore](https://firebase.google.com/) on the free **Spark plan** — no server to run or maintain, and comfortably sustainable at hobby-project scale (a full match costs roughly 100–150 Firestore reads and 30–50 writes; the free tier is 50k reads / 20k writes per day).

**Anti-cheat scope**: answer-checking happens client-side, the same trust model as local versus. This is a deliberate choice to avoid needing Cloud Functions (which requires the paid Blaze plan). A technically sophisticated player could inspect network traffic to see the answer key for the category being played, or in principle call the Firestore write functions directly to act on the other player's behalf — both are accepted, out-of-scope risks for a casual game between people who mostly know each other, not architected further here.

**`file://` caveat**: `categories.js`/`game.js` are classic scripts and work fine if you just open `index.html` directly from disk — solo and local-versus modes work identically either way. `firebase-init.js`/`online.js` are ES modules (required by Firebase's SDK), which browsers block from loading over `file://`. Online Versus requires being served over `http(s)` — any static file server works, e.g. `npx serve .`.

### Setting up your own Firebase project (for forks)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com), enable **Firestore Database** (production mode) and the **Anonymous** sign-in provider under Authentication.
2. Replace the `firebaseConfig` object in `firebase-init.js` with your own project's config (Project Settings → your web app). These values aren't secret — Firebase's security model is enforced by Firestore rules, not by hiding this config.
3. Paste the contents of `firestore.rules` into the Firestore **Rules** tab in the console and publish.
4. **Room cleanup**: configure a Firestore [TTL policy](https://firebase.google.com/docs/firestore/ttl) on the `expiresAt` field of the `rooms` collection group (Firestore console → TTL tab, or `gcloud firestore fields ttls update expiresAt --collection-group=rooms --enable-ttl`). Rooms set `expiresAt` to 6 hours after creation; without a TTL policy configured, finished/abandoned rooms will just accumulate in Firestore indefinitely (harmless at hobby scale, but untidy).

## Running it locally

No dependencies or build step — just serve the directory with any static file server and open `index.html` in a browser. For example, from this directory:

```
npx serve .
```

Solo and local-versus modes also work by opening `index.html` directly via `file://`; Online Versus needs `http(s)` (see above).
