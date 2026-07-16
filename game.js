const DEFAULT_TIME_LIMIT = 10; // seconds per answer
const BASE_POINTS = 100;
const MAX_BONUS = 100;
const HIGH_SCORE_KEY = "nameThemAll.highScores";
const MOST_ANSWERED_KEY = "nameThemAll.mostAnswered";
const CLEARED_KEY = "nameThemAll.cleared";
const MAX_MISSED_DISPLAY = 20;

/* ---------------- Records (high scores / most answered) ---------------- */
function loadRecords(storageKey) {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function getRecord(storageKey, name) {
  return loadRecords(storageKey)[name] || 0;
}

function saveRecordIfBetter(storageKey, name, value) {
  const records = loadRecords(storageKey);
  const prevBest = records[name] || 0;
  if (value > prevBest) {
    records[name] = value;
    try {
      localStorage.setItem(storageKey, JSON.stringify(records));
    } catch {
      // localStorage unavailable (e.g. private browsing) - ignore
    }
    return true;
  }
  return false;
}

function getHighScore(catName) {
  return getRecord(HIGH_SCORE_KEY, catName);
}

function saveHighScoreIfBetter(catName, score) {
  return saveRecordIfBetter(HIGH_SCORE_KEY, catName, score);
}

function getMostAnswered(catName) {
  return getRecord(MOST_ANSWERED_KEY, catName);
}

function saveMostAnsweredIfBetter(catName, count) {
  return saveRecordIfBetter(MOST_ANSWERED_KEY, catName, count);
}

// Permanent (never un-set) record of whether a category/language has ever
// been fully cleared - separate from the achievement badge on the results
// screen, which fires every time; this backs the menu's persistent marker.
function isCleared(catName) {
  return !!loadRecords(CLEARED_KEY)[catName];
}

function markCleared(catName) {
  const records = loadRecords(CLEARED_KEY);
  if (records[catName]) return;
  records[catName] = true;
  try {
    localStorage.setItem(CLEARED_KEY, JSON.stringify(records));
  } catch {
    // localStorage unavailable (e.g. private browsing) - ignore
  }
}

/* ---------------- State ---------------- */
let state = null;
let tickHandle = null;
let selectedMode = "solo";
let selectedTimeLimit = DEFAULT_TIME_LIMIT;
let selectedGroup = null;
let onlineSubMode = null; // null | "create" | "join"
let onlineRoomCode = null;
let onlineMyPlayer = null;
let onlineRoomUnsubscribe = null;
let rematchMode = false;
let rematchRoomCode = null;
let rematchMyPlayer = null;
let searchQuery = "";
let languageFilter = "any";
const GROUP_ORDER = ["Geography", "Science", "Sports", "Entertainment", "Culture"];
const PLAY_LABELS = { en: "Play in English", ja: "日本語でプレイ", zh: "用繁體中文玩" };

/* ---------------- Elements ---------------- */
const el = (id) => document.getElementById(id);
const screens = {
  menu: el("menu-screen"),
  game: el("game-screen"),
  results: el("results-screen"),
  online: el("online-screen"),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
  // Move focus into the new screen so keyboard/screen-reader focus never
  // stays stranded on a now-hidden element from the previous screen.
  const heading = screens[name].querySelector("h1");
  if (heading) heading.focus();
}

/* ---------------- Menu ---------------- */
function renderMenu() {
  selectedGroup = null;
  renderGroups();
  el("group-list").classList.remove("hidden");
  el("cat-list-wrap").classList.add("hidden");
}

function renderGroups() {
  const list = el("group-list");
  list.innerHTML = "";
  GROUP_ORDER.forEach(group => {
    const cats = CATEGORIES.filter(c => c.group === group);
    if (cats.length === 0) return;
    // Falls back to whichever language a category actually has (not every
    // languages-category includes "en" - e.g. Taipei MRT Stations is
    // zh-only for now) rather than assuming "en" always exists.
    const totalAnswers = cats.reduce((sum, c) => {
      const lang = c.languages ? (c.languages.en ? "en" : Object.keys(c.languages)[0]) : undefined;
      return sum + resolveCategorySource(c, lang).answers.length;
    }, 0);
    const btn = document.createElement("button");
    btn.className = "cat-btn";
    btn.innerHTML = `${group}<span class="count">${cats.length} categories &middot; ${totalAnswers} total answers</span>`;
    btn.addEventListener("click", () => openGroup(group));
    list.appendChild(btn);
  });
}

function openGroup(group) {
  selectedGroup = group;
  renderCategoryList();
  el("group-list").classList.add("hidden");
  el("cat-list-wrap").classList.remove("hidden");
}

// Builds a single category's button/card, shared by the group-scoped list
// and the flat cross-group search results (which additionally need a group
// label, since categories from different groups are mixed together there).
function buildCategoryElement(cat, idx, opts) {
  const showGroup = !!(opts && opts.showGroup);
  const groupLabel = showGroup ? `<span class="group-label">${cat.group}</span>` : "";

  if (cat.languages) {
    const card = document.createElement("div");
    card.className = "cat-btn lang-cat";
    // Each language can have its own answer count (e.g. Elements' Chinese
    // set is a smaller subset than its English one - see categories.js),
    // so build the summary per-language instead of assuming they match.
    const langs = Object.keys(cat.languages);
    const summarize = (getter) => langs.map(l => `${getter(l)} (${LANG_LABELS[l] || l})`).join(" / ");
    const countSummary = summarize(l => cat.languages[l].answers.length);
    const highSummary = summarize(l => getHighScore(highScoreKeyFor(cat, l)));
    const mostSummary = summarize(l => getMostAnswered(highScoreKeyFor(cat, l)));
    // Clearing is tracked per-language (same key scheme as high score), so
    // the checkmark goes on each language's own button rather than the
    // shared category name.
    const buttonsHtml = langs.map(l => {
      const label = PLAY_LABELS[l] || `Play in ${LANG_LABELS[l] || l}`;
      const clearedMark = isCleared(highScoreKeyFor(cat, l)) ? ' <span class="cleared-badge" title="Cleared before">&check;</span>' : "";
      return `<button type="button" class="lang-btn" data-lang="${l}">${label}${clearedMark}</button>`;
    }).join("");
    card.innerHTML = `
      ${groupLabel}
      <div class="lang-cat-name">${cat.name}</div>
      <span class="count">${countSummary} answers &middot; ${selectedTimeLimit}s per answer &middot; High Score: ${highSummary} &middot; Most Answered: ${mostSummary}</span>
      <div class="lang-buttons">${buttonsHtml}</div>
    `;
    card.querySelectorAll(".lang-btn").forEach(langBtn => {
      langBtn.addEventListener("click", () => {
        if (rematchMode) {
          offerRematchFlow(idx, langBtn.dataset.lang);
        } else if (selectedMode === "online") {
          createOnlineRoom(idx, langBtn.dataset.lang);
        } else {
          startGame(idx, selectedMode, langBtn.dataset.lang);
        }
      });
    });
    return card;
  }

  const btn = document.createElement("button");
  btn.className = "cat-btn";
  const clearedMark = isCleared(cat.name) ? '<span class="cleared-badge" title="Cleared before">&check; </span>' : "";
  btn.innerHTML = `${groupLabel}${clearedMark}${cat.name}<span class="count">${cat.answers.length} answers &middot; ${selectedTimeLimit}s per answer &middot; High Score: ${getHighScore(cat.name)} &middot; Most Answered: ${getMostAnswered(cat.name)}</span>`;
  btn.addEventListener("click", () => {
    if (rematchMode) {
      offerRematchFlow(idx, undefined);
    } else if (selectedMode === "online") {
      createOnlineRoom(idx, undefined);
    } else {
      startGame(idx, selectedMode);
    }
  });
  return btn;
}

function renderCategoryList() {
  const list = el("cat-list");
  list.innerHTML = "";
  CATEGORIES.forEach((cat, idx) => {
    if (cat.group !== selectedGroup) return;
    list.appendChild(buildCategoryElement(cat, idx, { showGroup: false }));
  });
}

// A category with no `languages` field is plain English text throughout
// (every ZH/JA-capable category in this project already uses `languages`,
// even when only one language is populated so far - see Taipei MRT
// Stations), so "en" is a safe implicit default for the language filter.
function categoryLanguages(cat) {
  return cat.languages ? Object.keys(cat.languages) : ["en"];
}

function matchesFilters(cat) {
  if (searchQuery && !cat.name.toLowerCase().includes(searchQuery)) return false;
  if (languageFilter !== "any" && !categoryLanguages(cat).includes(languageFilter)) return false;
  return true;
}

function isSearchActive() {
  return searchQuery !== "" || languageFilter !== "any";
}

// Flat, cross-group results for the search box / language filter - skips
// the usual group-first navigation entirely so a search can surface a
// match from any group at once.
function renderSearchResults() {
  const list = el("cat-list");
  list.innerHTML = "";
  const matches = [];
  CATEGORIES.forEach((cat, idx) => {
    if (matchesFilters(cat)) matches.push({ cat, idx });
  });
  if (matches.length === 0) {
    list.innerHTML = '<p class="subtitle">No categories match.</p>';
    return;
  }
  matches.forEach(({ cat, idx }) => list.appendChild(buildCategoryElement(cat, idx, { showGroup: true })));
}

// Single entry point for "what should the menu's category area show right
// now" - every place that used to call renderMenu() directly for this
// purpose should call this instead, so an active search/filter is
// respected no matter how the menu got re-rendered (mode switch, replay,
// back-to-menu, etc.).
function updateMenuView() {
  if (isSearchActive()) {
    el("group-list").classList.add("hidden");
    el("cat-list-wrap").classList.remove("hidden");
    renderSearchResults();
  } else {
    renderMenu();
  }
}

function populateLanguageFilter() {
  const select = el("language-filter");
  const options = ['<option value="any">Any Language</option>'];
  Object.keys(LANG_LABELS).forEach(code => {
    options.push(`<option value="${code}">${LANG_LABELS[code]}</option>`);
  });
  select.innerHTML = options.join("");
}

el("category-search").addEventListener("input", () => {
  searchQuery = el("category-search").value.trim().toLowerCase();
  updateMenuView();
});

el("language-filter").addEventListener("change", () => {
  languageFilter = el("language-filter").value;
  updateMenuView();
});

el("group-back-btn").addEventListener("click", () => {
  searchQuery = "";
  languageFilter = "any";
  el("category-search").value = "";
  el("language-filter").value = "any";
  updateMenuView();
});

// Shows/hides the online create-vs-join choice and the local category
// picker depending on the selected mode, reusing renderMenu()'s existing
// group/category rendering unchanged for both local modes and the online
// "create" sub-mode (the category picker is identical either way).
function renderModeArea() {
  const isOnline = selectedMode === "online";
  el("online-mode-choice").classList.toggle("hidden", !isOnline || onlineSubMode !== null);
  el("online-join-form").classList.toggle("hidden", !(isOnline && onlineSubMode === "join"));
  el("online-error").classList.add("hidden");

  const showCategoryPicker = !isOnline || onlineSubMode === "create";
  // Hidden (not just inert) while the picker isn't shown - typing into it
  // during the online "join by code" sub-view would otherwise force cat-
  // list-wrap open on top of the join form.
  el("search-bar").classList.toggle("hidden", !showCategoryPicker);
  if (showCategoryPicker) {
    updateMenuView();
  } else {
    el("group-list").classList.add("hidden");
    el("cat-list-wrap").classList.add("hidden");
  }
}

document.querySelectorAll("#mode-toggle .mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // window.Online only exists once online.js's ES module has finished
    // loading; check at click-time rather than page-load, since there's no
    // reliable way to know earlier whether it succeeded or failed (ad
    // blocker, offline, file://) without an artificial delay.
    if (btn.dataset.mode === "online" && !window.Online) {
      el("online-error").textContent = "Online play isn't available right now (check your connection, or try a different browser/network if an ad-blocker may be interfering).";
      el("online-error").classList.remove("hidden");
      return;
    }
    leaveOnlineRoom();
    selectedMode = btn.dataset.mode;
    onlineSubMode = null;
    document.querySelectorAll("#mode-toggle .mode-btn").forEach(b => b.classList.toggle("active", b === btn));
    renderModeArea();
  });
});

el("online-create-btn").addEventListener("click", () => {
  onlineSubMode = "create";
  renderModeArea();
});

el("online-join-btn").addEventListener("click", () => {
  onlineSubMode = "join";
  renderModeArea();
});

el("join-code-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const code = el("join-code-input").value.trim().toUpperCase();
  if (!code) return;
  joinOnlineRoomFlow(code);
});

el("online-back-btn").addEventListener("click", () => {
  if (onlineRoomUnsubscribe) {
    onlineRoomUnsubscribe();
    onlineRoomUnsubscribe = null;
  }
  // Only reachable from the pre-match waiting lobby (once a match starts
  // we're on #game-screen with its own quit-btn/forfeit path instead), so
  // cancelling here always means "no opponent joined yet, back out."
  if (onlineRoomCode && window.Online) {
    Online.cancelRoom(onlineRoomCode).catch(err => console.error("cancelRoom failed", err));
  }
  onlineRoomCode = null;
  onlineMyPlayer = null;
  onlineSubMode = null;
  renderModeArea();
  showScreen("menu");
});

el("copy-code-btn").addEventListener("click", () => {
  if (!onlineRoomCode) return;
  navigator.clipboard?.writeText(onlineRoomCode).then(() => {
    const btn = el("copy-code-btn");
    const original = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => { btn.textContent = original; }, 1500);
  }).catch(() => {});
});

el("time-slider").addEventListener("input", () => {
  selectedTimeLimit = parseInt(el("time-slider").value, 10);
  el("time-value").textContent = selectedTimeLimit;
  if (isSearchActive()) {
    renderSearchResults();
  } else if (selectedGroup) {
    renderCategoryList();
  } else {
    renderGroups();
  }
});

/* ---------------- Game logic ---------------- */
// normalize/resolveCategorySource/buildAnswerKey/highScoreKeyFor/
// computeRemaining now live in logic.js (loaded before this file in
// index.html) so the test suite can exercise them without touching the DOM.

/* ---------------- Online versus ---------------- */
async function createOnlineRoom(catIndex, lang) {
  el("online-error").classList.add("hidden");
  if (!window.Online) {
    el("online-error").textContent = "Online play isn't available right now.";
    el("online-error").classList.remove("hidden");
    return;
  }
  try {
    const result = await Online.createRoom(catIndex, lang, selectedTimeLimit);
    onlineRoomCode = result.roomCode;
    onlineMyPlayer = 1;
    el("room-code-display").textContent = result.roomCode;
    showScreen("online");
    onlineRoomUnsubscribe = Online.subscribeToRoom(result.roomCode, handleLobbySnapshot);
  } catch (err) {
    el("online-error").textContent = err.message || "Could not create a match.";
    el("online-error").classList.remove("hidden");
  }
}

async function joinOnlineRoomFlow(code) {
  el("online-error").classList.add("hidden");
  if (!window.Online) {
    el("online-error").textContent = "Online play isn't available right now.";
    el("online-error").classList.remove("hidden");
    return;
  }
  try {
    const result = await Online.joinRoom(code);
    onlineRoomCode = result.roomCode;
    onlineMyPlayer = 2;
    startOnlineGame(result.roomData);
  } catch (err) {
    el("online-error").textContent = err.message || "Could not join that room.";
    el("online-error").classList.remove("hidden");
  }
}

// Watches a room while sitting in the "waiting for opponent" lobby; once
// player 2 joins (status flips to "active"), transitions into the game.
function handleLobbySnapshot(data) {
  if (data && data.status === "active") {
    if (onlineRoomUnsubscribe) {
      onlineRoomUnsubscribe();
      onlineRoomUnsubscribe = null;
    }
    startOnlineGame(data);
  }
}

function startOnlineGame(roomData) {
  const cat = CATEGORIES[roomData.categoryIndex];
  const lang = roomData.lang || undefined;
  const source = resolveCategorySource(cat, lang);
  state = {
    cat,
    lang,
    mode: "versus",
    online: true,
    myPlayer: onlineMyPlayer,
    roomCode: onlineRoomCode,
    timeLimit: roomData.timeLimit,
    highScoreKey: highScoreKeyFor(cat, lang),
    answers: source.answers,
    answerKey: buildAnswerKey(cat, lang),
    remaining: new Set(computeRemaining(source.answers, roomData.found || [])),
    found: roomData.found || [],
    missed: [],
    score: 0,
    basePoints: 0,
    bonusPoints: 0,
    // slotStart/slotDeadline/clockOffsetMs aren't known yet - roomData's
    // slotStartedAt may still be an unresolved serverTimestamp() sentinel
    // at this point (e.g. right after our own joinRoom transaction).
    // applyRoomSnapshot populates these as soon as a resolved value arrives
    // and starts the tick loop then, rather than here.
    slotStart: null,
    slotDeadline: null,
    clockOffsetMs: 0,
    turn: roomData.turn,
    consecutiveMisses: roomData.consecutiveMisses || 0,
    players: {
      1: { ...roomData.players[1] },
      2: { ...roomData.players[2] },
    },
    _timeoutAttempted: false,
    _finished: false,
  };
  el("game-cat-name").textContent = cat.name;
  el("total-count").textContent = source.answers.length;
  el("solo-score-inline").classList.add("hidden");
  el("versus-bar").classList.remove("hidden");
  updateGameStats();
  renderFoundChips();
  showScreen("game");
  setFeedback("Match started!", "neutral");

  // Only reachable once here per room in the normal flow (lobby handoff
  // unsubscribes before calling this), but a rematch restart re-enters this
  // function from inside the still-alive listener's own callback - guard so
  // that path doesn't stack a second subscription onto the same room.
  if (!onlineRoomUnsubscribe) {
    const boundRoomCode = onlineRoomCode;
    onlineRoomUnsubscribe = Online.subscribeToRoom(onlineRoomCode, (data) => applyRoomSnapshot(boundRoomCode, data));
  }
}

// Reconciles local state from a Firestore room snapshot - the single point
// every online state change flows through (answers, timeouts, forfeits all
// just write to Firestore and let this react), reusing the exact same
// render functions (updateGameStats/renderFoundChips) local mode uses.
function applyRoomSnapshot(roomCode, data) {
  if (!data || !state || !state.online || state.roomCode !== roomCode) return;

  // A rematch both players accepted flips this same room back to "active"
  // after it had finished - rebuild state for the new match, then
  // deliberately fall through (not return) so the slot-detection block
  // below (against this same `data`) starts the tick loop for the new slot;
  // startOnlineGame itself never touches slotStart/tickHandle.
  if (data.status === "active" && state._finished) {
    startOnlineGame(data);
  }

  state.found = data.found || [];
  state.remaining = new Set(computeRemaining(state.answers, state.found));
  state.players = {
    1: { ...data.players[1] },
    2: { ...data.players[2] },
  };
  state.turn = data.turn;
  state.consecutiveMisses = data.consecutiveMisses || 0;
  // Authoritative outcome from Firestore - needed because a forfeit can
  // decide a winner independent of score (e.g. quitting a 0-0 match), which
  // a client-side score comparison alone would get wrong.
  state.winner = data.winner;
  state.rematch = data.rematch;

  // slotStartedAt is a Firestore serverTimestamp() - the single source of
  // truth both devices' race-adjudication compares against, so neither
  // device's own (possibly skewed) clock can desync the match or steal a
  // turn. It resolves to null momentarily in the writing client's own
  // optimistic snapshot until the server confirms it; skip until then.
  if (data.slotStartedAt) {
    const resolvedMs = data.slotStartedAt.toMillis();
    if (resolvedMs !== state.slotStart) {
      state.slotStart = resolvedMs;
      state.slotDeadline = resolvedMs + state.timeLimit * 1000;
      // Per-slot recalibration of this device's own clock error against the
      // server's, so this device's *own* countdown rendering stays close to
      // true time too - not just cross-device race-safety, which the
      // serverTimestamp() value alone already guarantees regardless of this.
      state.clockOffsetMs = resolvedMs - Date.now();
      state._timeoutAttempted = false;
      // Unconditionally restart rather than gating on "if (!tickHandle)":
      // several places clear the interval without nulling the variable
      // (quit, back-to-menu, match-finished), which left a stale-but-truthy
      // tickHandle that fooled that check into skipping a fresh interval
      // for the next match in the same tab - freezing the timer bar while
      // turn/score/found-chips kept updating fine via this same listener,
      // since those never depended on tick() running at all.
      clearInterval(tickHandle);
      tickHandle = setInterval(tick, 50);
      tick();
    }
  }

  updateGameStats();
  renderFoundChips();

  if (data.status === "finished") {
    if (!state._finished) {
      state._finished = true;
      clearInterval(tickHandle);
      tickHandle = null;
      // Deliberately keep listening past match-finish (unlike the old
      // behavior of unsubscribing here) - this same subscription is how
      // rematch offers/accepts from either player get observed without
      // leaving the room.
      state.missed = [...state.remaining];
      showResults();
    } else {
      renderRematchUI(state.rematch, state.myPlayer);
    }
  }
}

// Toggles between the "Play Again" button and the two rematch sub-views
// based on the room's current rematch offer, if any.
function renderRematchUI(rematch, myPlayer) {
  const hasOffer = !!(rematch && rematch.offeredBy);
  el("replay-btn").classList.toggle("hidden", hasOffer);
  el("rematch-area").classList.toggle("hidden", !hasOffer);
  if (!hasOffer) return;
  const iOffered = rematch.offeredBy === myPlayer;
  el("rematch-waiting").classList.toggle("hidden", !iOffered);
  el("rematch-incoming").classList.toggle("hidden", iOffered);
  if (!iOffered) {
    el("rematch-incoming-text").textContent = `Player ${rematch.offeredBy} wants a rematch: ${CATEGORIES[rematch.categoryIndex].name}`;
  }
}

// Fired from renderCategoryList's click handlers when rematchMode is active
// (borrowed from the menu screen's normal category picker). Writes the
// offer and lets the still-alive room subscription's next snapshot (this
// client's own write echo included) render the "waiting for opponent" state.
async function offerRematchFlow(idx, lang) {
  rematchMode = false;
  try {
    await Online.offerRematch(rematchRoomCode, rematchMyPlayer, idx, lang, selectedTimeLimit);
  } catch (err) {
    console.error("offerRematch failed", err);
  }
  showScreen("results");
}

// Shared cleanup for every path that can abandon a live online room:
// back-to-menu, and switching modes mid-rematch-pick (the only other place
// a player can reach #menu-screen with a room still live).
function leaveOnlineRoom() {
  if (!onlineRoomCode) return;
  if (state && state.online) {
    // Hygiene for the opponent's UI so they aren't left waiting forever on a
    // rematch offer that's never coming; idempotent no-op if none is pending.
    Online.declineRematch(state.roomCode).catch(() => {});
  }
  if (onlineRoomUnsubscribe) {
    onlineRoomUnsubscribe();
    onlineRoomUnsubscribe = null;
  }
  onlineRoomCode = null;
  onlineMyPlayer = null;
  rematchMode = false;
  rematchRoomCode = null;
  rematchMyPlayer = null;
}

function startGame(catIndex, mode, lang) {
  const cat = CATEGORIES[catIndex];
  const source = resolveCategorySource(cat, lang);
  state = {
    cat,
    lang,
    mode,
    online: false,
    timeLimit: selectedTimeLimit,
    highScoreKey: highScoreKeyFor(cat, lang),
    answers: source.answers,
    answerKey: buildAnswerKey(cat, lang),
    remaining: new Set(source.answers),
    found: [],       // { name, timeTaken, player? }
    missed: [],      // names not found
    score: 0,
    basePoints: 0,
    bonusPoints: 0,
    slotStart: null,
    slotDeadline: null,
    turn: 1,
    consecutiveMisses: 0,
    players: {
      1: { score: 0, basePoints: 0, bonusPoints: 0, correct: 0 },
      2: { score: 0, basePoints: 0, bonusPoints: 0, correct: 0 },
    },
  };
  el("game-cat-name").textContent = cat.name;
  el("total-count").textContent = source.answers.length;
  el("solo-score-inline").classList.toggle("hidden", mode === "versus");
  el("versus-bar").classList.toggle("hidden", mode !== "versus");
  updateGameStats();
  renderFoundChips();
  showScreen("game");
  el("answer-input").value = "";
  setFeedback(mode === "versus" ? "Go! Player 1 starts." : "Go!", "neutral");
  nextSlot();
}

function switchTurn() {
  state.turn = state.turn === 1 ? 2 : 1;
  updateGameStats();
}

function updateGameStats() {
  el("found-count").textContent = state.found.length;
  el("answer-input").disabled = false; // only the online branch below re-disables it
  if (state.mode === "versus") {
    el("p1-score").textContent = state.players[1].score;
    el("p2-score").textContent = state.players[2].score;
    el("p1-box").classList.toggle("active", state.turn === 1);
    el("p2-box").classList.toggle("active", state.turn === 2);
    if (state.online) {
      const myTurn = state.turn === state.myPlayer;
      el("turn-indicator").textContent = myTurn ? "Your turn!" : `Waiting for Player ${state.turn}...`;
      el("answer-input").placeholder = myTurn ? "Your answer..." : "Waiting for opponent...";
      el("answer-input").disabled = !myTurn;
    } else {
      el("turn-indicator").textContent = `Player ${state.turn}'s turn`;
      el("answer-input").placeholder = `Player ${state.turn}, your answer...`;
    }
  } else {
    el("live-score").textContent = state.score;
    el("answer-input").placeholder = "Type an answer...";
  }
}

function renderFoundChips() {
  const wrap = el("found-chips");
  wrap.innerHTML = "";
  state.found.forEach(f => {
    const chip = document.createElement("span");
    chip.className = "chip" + (f.player ? " p" + f.player : "");
    chip.textContent = f.player ? `${f.name} (P${f.player})` : f.name;
    wrap.appendChild(chip);
  });
}

function setFeedback(msg, kind) {
  const f = el("feedback");
  f.textContent = msg;
  f.className = "feedback " + kind;
}

function nextSlot() {
  if (state.remaining.size === 0) {
    endGame();
    return;
  }
  state.slotStart = performance.now();
  state.slotDeadline = state.slotStart + state.timeLimit * 1000;
  el("answer-input").value = "";
  el("answer-input").focus();
  clearInterval(tickHandle);
  tickHandle = setInterval(tick, 50);
  tick();
}

function tick() {
  // Online matches share a deadline across two machines, so it has to be
  // measured against a clock both agree on (epoch ms); performance.now()
  // is only meaningful within a single page's lifetime. clockOffsetMs
  // corrects for this device's own clock error vs. the server's, estimated
  // in applyRoomSnapshot each time a new slot starts - the deadline itself
  // (slotDeadline, from a Firestore serverTimestamp()) is already immune to
  // clock skew for race-adjudication purposes; this only makes the local
  // countdown rendering track true time more closely too.
  if (state.online && state.slotDeadline == null) return; // no resolved slot yet
  const now = state.online ? Date.now() + state.clockOffsetMs : performance.now();
  const remainingMs = state.slotDeadline - now;
  const frac = Math.max(0, remainingMs / (state.timeLimit * 1000));
  const fill = el("timer-fill");
  fill.style.width = (frac * 100) + "%";
  fill.classList.toggle("warn", frac <= 0.5 && frac > 0.2);
  fill.classList.toggle("danger", frac <= 0.2);

  if (remainingMs <= 0) {
    if (state.online) {
      // Keep ticking - state._timeoutAttempted guards against spamming the
      // same timeout write every 50ms while waiting for either client's
      // write (or the opponent's answer) to land and push a new deadline.
      handleTimeoutOnline();
    } else {
      clearInterval(tickHandle);
      tickHandle = null;
      handleTimeoutLocal();
    }
  }
}

function handleTimeoutLocal() {
  if (state.mode === "versus") {
    const missedPlayer = state.turn;
    state.consecutiveMisses += 1;
    if (state.consecutiveMisses >= 2) {
      setFeedback(`Time's up for Player ${missedPlayer}! Neither player could answer — game over.`, "bad");
      setTimeout(() => {
        endGame();
      }, 700);
      return;
    }
    setFeedback(`Time's up for Player ${missedPlayer}!`, "bad");
    setTimeout(() => {
      switchTurn();
      nextSlot();
    }, 700);
  } else {
    setFeedback("Time's up! Game over.", "bad");
    setTimeout(() => {
      endGame();
    }, 700);
  }
}

// Any client whose local clock thinks the deadline passed calls this - not
// just whoever's turn it is - so a backgrounded/throttled tab can't stall
// the match. Firestore's transaction (not this client) adjudicates who
// actually resolves it; see online.js writeTimeout.
function handleTimeoutOnline() {
  if (state._timeoutAttempted) return;
  state._timeoutAttempted = true;
  // state.slotStart is the resolved server-timestamp ms value for the
  // current slot - the CAS check in online.js compares against this, not a
  // client-computed deadline, so the race is adjudicated independent of
  // either device's clock accuracy.
  Online.writeTimeout(state.roomCode, state.turn, state.slotStart).catch(err => {
    console.error("writeTimeout failed", err);
  });
}

function submitAnswer(raw) {
  if (!state) return;
  state.online ? submitAnswerOnline(raw) : submitAnswerLocal(raw);
}

function submitAnswerLocal(raw) {
  if (!state || state.remaining.size === 0) return;
  const norm = normalize(raw);
  if (!norm) return;

  const canonical = state.answerKey.get(norm);

  if (canonical && state.remaining.has(canonical)) {
    // correct
    clearInterval(tickHandle);
    tickHandle = null;
    const elapsed = (performance.now() - state.slotStart) / 1000;
    const timeTaken = Math.min(elapsed, state.timeLimit);
    const bonus = Math.round(MAX_BONUS * (1 - timeTaken / state.timeLimit));
    state.remaining.delete(canonical);

    if (state.mode === "versus") {
      const player = state.turn;
      state.consecutiveMisses = 0;
      state.found.push({ name: canonical, timeTaken, player });
      const p = state.players[player];
      p.basePoints += BASE_POINTS;
      p.bonusPoints += bonus;
      p.score += BASE_POINTS + bonus;
      p.correct += 1;
      setFeedback(`Player ${player} correct! +${BASE_POINTS + bonus} (${bonus} speed bonus)`, "good");
    } else {
      state.found.push({ name: canonical, timeTaken });
      state.basePoints += BASE_POINTS;
      state.bonusPoints += bonus;
      state.score += BASE_POINTS + bonus;
      setFeedback(`Correct! +${BASE_POINTS + bonus} (${bonus} speed bonus)`, "good");
    }

    updateGameStats();
    renderFoundChips();
    setTimeout(() => {
      if (state.remaining.size === 0) { endGame(); return; }
      if (state.mode === "versus") switchTurn();
      nextSlot();
    }, 500);
  } else if (canonical && !state.remaining.has(canonical)) {
    setFeedback("Already found that one.", "neutral");
    flashShake();
  } else {
    setFeedback("Not a match, try again.", "bad");
    flashShake();
  }
}

// Does NOT mutate state directly - writes to Firestore and waits for the
// snapshot round-trip (applyRoomSnapshot) to reflect the result, the same
// single reconciliation point every other online state change goes through.
function submitAnswerOnline(raw) {
  if (!state || state.remaining.size === 0) return;
  if (state.turn !== state.myPlayer) {
    setFeedback("Wait for your turn!", "neutral");
    flashShake();
    return;
  }
  const norm = normalize(raw);
  if (!norm) return;

  const canonical = state.answerKey.get(norm);

  if (canonical && state.remaining.has(canonical)) {
    const elapsed = (Date.now() + state.clockOffsetMs - state.slotStart) / 1000;
    const timeTaken = Math.min(elapsed, state.timeLimit);
    const bonus = Math.round(MAX_BONUS * (1 - timeTaken / state.timeLimit));
    const isLastAnswer = state.remaining.size === 1;
    el("answer-input").value = "";
    Online.writeCorrectAnswer(state.roomCode, state.myPlayer, canonical, timeTaken, BASE_POINTS, bonus, isLastAnswer)
      .catch(err => console.error("writeCorrectAnswer failed", err));
  } else if (canonical && !state.remaining.has(canonical)) {
    setFeedback("Already found that one.", "neutral");
    flashShake();
  } else {
    setFeedback("Not a match, try again.", "bad");
    flashShake();
  }
}

function flashShake() {
  const input = el("answer-input");
  input.classList.remove("shake");
  void input.offsetWidth; // restart animation
  input.classList.add("shake");
  input.value = "";
}

function endGame() {
  clearInterval(tickHandle);
  tickHandle = null;
  state.missed = [...state.remaining];
  showResults();
}

function showResults() {
  const soloResults = el("solo-results");
  const versusResults = el("versus-results");
  // Every answer in the category was found before the round ended - shown
  // every time it happens (unlike High Score/Most Answered, which only fire
  // when you beat a previous best) since it's a threshold you either hit or
  // don't each round, not a record to improve on.
  const isFullClear = state.found.length === state.answers.length;
  if (isFullClear) markCleared(state.highScoreKey);

  if (state.mode === "versus") {
    soloResults.classList.add("hidden");
    versusResults.classList.remove("hidden");

    const p1 = state.players[1];
    const p2 = state.players[2];
    el("res-p1-score").textContent = p1.score;
    el("res-p2-score").textContent = p2.score;
    el("res-p1-correct").textContent = p1.correct;
    el("res-p2-correct").textContent = p2.correct;

    const p1Boxes = [el("res-p1-score-box"), el("res-p1-correct-box")];
    const p2Boxes = [el("res-p2-score-box"), el("res-p2-correct-box")];
    [...p1Boxes, ...p2Boxes].forEach(box => box.classList.remove("winner", "loser"));

    const banner = el("winner-banner");
    // Online matches use Firestore's authoritative winner (set by the CAS
    // transactions or a forfeit) rather than recomputing from score, since a
    // forfeit can decide a winner independent of score (e.g. quitting a 0-0
    // match) - a score comparison alone would get that case wrong. Local
    // hot-seat versus has no such concept, so it keeps comparing scores.
    const winner = state.online ? state.winner : (p1.score > p2.score ? 1 : p2.score > p1.score ? 2 : "tie");
    if (winner === 1) {
      banner.textContent = "Player 1 Wins!";
      p1Boxes.forEach(box => box.classList.add("winner"));
      p2Boxes.forEach(box => box.classList.add("loser"));
    } else if (winner === 2) {
      banner.textContent = "Player 2 Wins!";
      p2Boxes.forEach(box => box.classList.add("winner"));
      p1Boxes.forEach(box => box.classList.add("loser"));
    } else {
      banner.textContent = "It's a Tie!";
    }

    // Online: each device only credits its own player's result - Math.max
    // would otherwise silently credit this device with the opponent's score
    // if they won (local hot-seat is fine with Math.max since both
    // "players" share one device/localStorage).
    const myScore = state.online ? state.players[state.myPlayer].score : Math.max(p1.score, p2.score);
    const isNewHigh = saveHighScoreIfBetter(state.highScoreKey, myScore);
    el("res-versus-highscore").textContent = getHighScore(state.highScoreKey);
    el("versus-new-high-badge").classList.toggle("hidden", !isNewHigh);

    const myCorrect = state.online ? state.players[state.myPlayer].correct : Math.max(p1.correct, p2.correct);
    const isNewMostAnswered = saveMostAnsweredIfBetter(state.highScoreKey, myCorrect);
    el("res-versus-most-answered").textContent = getMostAnswered(state.highScoreKey);
    el("versus-new-most-answered-badge").classList.toggle("hidden", !isNewMostAnswered);
    el("versus-new-clear-badge").classList.toggle("hidden", !isFullClear);

    if (state.online) {
      renderRematchUI(state.rematch, state.myPlayer);
    } else {
      el("replay-btn").classList.remove("hidden");
      el("rematch-area").classList.add("hidden");
    }
  } else {
    versusResults.classList.add("hidden");
    soloResults.classList.remove("hidden");

    el("final-score").textContent = state.score;
    el("res-correct").textContent = `${state.found.length} / ${state.answers.length}`;
    const avg = state.found.length
      ? (state.found.reduce((s, f) => s + f.timeTaken, 0) / state.found.length)
      : 0;
    el("res-avg-time").textContent = avg.toFixed(1) + "s";
    el("res-bonus").textContent = state.bonusPoints;
    el("res-base").textContent = state.basePoints;

    const isNewHigh = saveHighScoreIfBetter(state.highScoreKey, state.score);
    el("res-highscore").textContent = getHighScore(state.highScoreKey);
    el("new-high-badge").classList.toggle("hidden", !isNewHigh);

    const isNewMostAnswered = saveMostAnsweredIfBetter(state.highScoreKey, state.found.length);
    el("res-most-answered").textContent = getMostAnswered(state.highScoreKey);
    el("new-most-answered-badge").classList.toggle("hidden", !isNewMostAnswered);
    el("new-clear-badge").classList.toggle("hidden", !isFullClear);

    el("replay-btn").classList.remove("hidden");
  }

  const missedWrap = el("missed-wrap");
  const missedList = el("missed-list");
  const missedReveal = el("missed-reveal");
  const missedToggle = el("missed-toggle");
  if (state.missed.length) {
    missedWrap.classList.remove("hidden");
    const shown = state.missed.slice(0, MAX_MISSED_DISPLAY);
    const hiddenCount = state.missed.length - shown.length;
    missedList.textContent = shown.join(", ") + (hiddenCount > 0 ? `, and ${hiddenCount} more...` : "");
    missedReveal.classList.add("hidden");
    missedToggle.textContent = `Show Missed Answers (${state.missed.length})`;
  } else {
    missedWrap.classList.add("hidden");
  }

  showScreen("results");
}

/* ---------------- Events ---------------- */
el("answer-form").addEventListener("submit", (e) => {
  e.preventDefault();
  submitAnswer(el("answer-input").value);
});

el("quit-btn").addEventListener("click", () => {
  if (state.online && state.roomCode) {
    // Don't call endGame() directly here - forfeiting writes status:
    // "finished" to Firestore, and the resulting snapshot flows through
    // applyRoomSnapshot for both players (the single reconciliation point
    // every online state change goes through), rather than ending the
    // match locally with stale state before the write lands.
    clearInterval(tickHandle);
    tickHandle = null;
    Online.forfeitMatch(state.roomCode, state.myPlayer).catch(err => {
      console.error("forfeitMatch failed", err);
    });
  } else {
    endGame();
  }
});

el("replay-btn").addEventListener("click", () => {
  if (state.online) {
    // Stays in the same room, just borrowing the menu screen's category
    // picker - deliberately doesn't touch onlineRoomCode/onlineMyPlayer or
    // unsubscribe, since the still-alive room listener is what lets the
    // opponent's accept/decline reach us on the results screen.
    rematchMode = true;
    rematchRoomCode = state.roomCode;
    rematchMyPlayer = state.myPlayer;
    el("online-mode-choice").classList.add("hidden");
    el("online-join-form").classList.add("hidden");
    el("online-error").classList.add("hidden");
    el("search-bar").classList.remove("hidden");
    updateMenuView();
    showScreen("menu");
  } else {
    const idx = CATEGORIES.indexOf(state.cat);
    startGame(idx, state.mode, state.lang);
  }
});

el("menu-btn").addEventListener("click", () => {
  leaveOnlineRoom();
  clearInterval(tickHandle);
  tickHandle = null;
  el("search-bar").classList.remove("hidden");
  updateMenuView();
  showScreen("menu");
});

el("rematch-accept-btn").addEventListener("click", () => {
  Online.acceptRematch(state.roomCode, state.myPlayer).catch(err => console.error("acceptRematch failed", err));
});

el("rematch-decline-btn").addEventListener("click", () => {
  Online.declineRematch(state.roomCode).catch(err => console.error("declineRematch failed", err));
});

el("missed-toggle").addEventListener("click", () => {
  const missedReveal = el("missed-reveal");
  const nowHidden = missedReveal.classList.toggle("hidden");
  const label = nowHidden ? "Show" : "Hide";
  el("missed-toggle").textContent = `${label} Missed Answers (${state.missed.length})`;
});

/* ---------------- Init ---------------- */
populateLanguageFilter();
updateMenuView();
showScreen("menu");
