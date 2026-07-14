const DEFAULT_TIME_LIMIT = 10; // seconds per answer
const BASE_POINTS = 100;
const MAX_BONUS = 100;
const HIGH_SCORE_KEY = "nameThemAll.highScores";
const MOST_ANSWERED_KEY = "nameThemAll.mostAnswered";
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

/* ---------------- State ---------------- */
let state = null;
let tickHandle = null;
let selectedMode = "solo";
let selectedTimeLimit = DEFAULT_TIME_LIMIT;
let selectedGroup = null;
const GROUP_ORDER = ["Geography", "Chemistry", "Sports", "Entertainment"];

/* ---------------- Elements ---------------- */
const el = (id) => document.getElementById(id);
const screens = {
  menu: el("menu-screen"),
  game: el("game-screen"),
  results: el("results-screen"),
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
    const totalAnswers = cats.reduce((sum, c) => sum + resolveCategorySource(c, "en").answers.length, 0);
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

function renderCategoryList() {
  const list = el("cat-list");
  list.innerHTML = "";
  CATEGORIES.forEach((cat, idx) => {
    if (cat.group !== selectedGroup) return;

    if (cat.languages) {
      const card = document.createElement("div");
      card.className = "cat-btn lang-cat";
      const count = cat.languages.en.answers.length;
      const enHigh = getHighScore(highScoreKeyFor(cat, "en"));
      const jaHigh = getHighScore(highScoreKeyFor(cat, "ja"));
      const enMost = getMostAnswered(highScoreKeyFor(cat, "en"));
      const jaMost = getMostAnswered(highScoreKeyFor(cat, "ja"));
      card.innerHTML = `
        <div class="lang-cat-name">${cat.name}</div>
        <span class="count">${count} answers &middot; ${selectedTimeLimit}s per answer &middot; High Score: ${enHigh} (English) / ${jaHigh} (日本語) &middot; Most Answered: ${enMost} (English) / ${jaMost} (日本語)</span>
        <div class="lang-buttons">
          <button type="button" class="lang-btn" data-lang="en">Play in English</button>
          <button type="button" class="lang-btn" data-lang="ja">日本語でプレイ</button>
        </div>
      `;
      card.querySelectorAll(".lang-btn").forEach(langBtn => {
        langBtn.addEventListener("click", () => startGame(idx, selectedMode, langBtn.dataset.lang));
      });
      list.appendChild(card);
      return;
    }

    const btn = document.createElement("button");
    btn.className = "cat-btn";
    btn.innerHTML = `${cat.name}<span class="count">${cat.answers.length} answers &middot; ${selectedTimeLimit}s per answer &middot; High Score: ${getHighScore(cat.name)} &middot; Most Answered: ${getMostAnswered(cat.name)}</span>`;
    btn.addEventListener("click", () => startGame(idx, selectedMode));
    list.appendChild(btn);
  });
}

el("group-back-btn").addEventListener("click", () => {
  renderMenu();
});

document.querySelectorAll("#mode-toggle .mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedMode = btn.dataset.mode;
    document.querySelectorAll("#mode-toggle .mode-btn").forEach(b => b.classList.toggle("active", b === btn));
  });
});

el("time-slider").addEventListener("input", () => {
  selectedTimeLimit = parseInt(el("time-slider").value, 10);
  el("time-value").textContent = selectedTimeLimit;
  if (selectedGroup) {
    renderCategoryList();
  } else {
    renderGroups();
  }
});

/* ---------------- Game logic ---------------- */
function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function resolveCategorySource(cat, lang) {
  return cat.languages ? cat.languages[lang] : cat;
}

function buildAnswerKey(cat, lang) {
  // maps normalized alias/name -> canonical answer string
  const source = resolveCategorySource(cat, lang);
  const map = new Map();
  source.answers.forEach(ans => {
    map.set(normalize(ans), ans);
  });
  if (source.aliases) {
    Object.entries(source.aliases).forEach(([canonical, aliasList]) => {
      aliasList.forEach(a => map.set(normalize(a), canonical));
    });
  }
  return map;
}

function highScoreKeyFor(cat, lang) {
  if (!cat.languages) return cat.name;
  return `${cat.name} (${lang === "ja" ? "日本語" : "English"})`;
}

function startGame(catIndex, mode, lang) {
  const cat = CATEGORIES[catIndex];
  const source = resolveCategorySource(cat, lang);
  state = {
    cat,
    lang,
    mode,
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
  if (state.mode === "versus") {
    el("p1-score").textContent = state.players[1].score;
    el("p2-score").textContent = state.players[2].score;
    el("p1-box").classList.toggle("active", state.turn === 1);
    el("p2-box").classList.toggle("active", state.turn === 2);
    el("turn-indicator").textContent = `Player ${state.turn}'s turn`;
    el("answer-input").placeholder = `Player ${state.turn}, your answer...`;
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
  const now = performance.now();
  const remainingMs = state.slotDeadline - now;
  const frac = Math.max(0, remainingMs / (state.timeLimit * 1000));
  const fill = el("timer-fill");
  fill.style.width = (frac * 100) + "%";
  fill.classList.toggle("warn", frac <= 0.5 && frac > 0.2);
  fill.classList.toggle("danger", frac <= 0.2);

  if (remainingMs <= 0) {
    clearInterval(tickHandle);
    handleTimeout();
  }
}

function handleTimeout() {
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

function submitAnswer(raw) {
  if (!state || state.remaining.size === 0) return;
  const norm = normalize(raw);
  if (!norm) return;

  const canonical = state.answerKey.get(norm);

  if (canonical && state.remaining.has(canonical)) {
    // correct
    clearInterval(tickHandle);
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

function flashShake() {
  const input = el("answer-input");
  input.classList.remove("shake");
  void input.offsetWidth; // restart animation
  input.classList.add("shake");
  input.value = "";
}

function endGame() {
  clearInterval(tickHandle);
  state.missed = [...state.remaining];
  showResults();
}

function showResults() {
  const soloResults = el("solo-results");
  const versusResults = el("versus-results");

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
    if (p1.score > p2.score) {
      banner.textContent = "Player 1 Wins!";
      p1Boxes.forEach(box => box.classList.add("winner"));
      p2Boxes.forEach(box => box.classList.add("loser"));
    } else if (p2.score > p1.score) {
      banner.textContent = "Player 2 Wins!";
      p2Boxes.forEach(box => box.classList.add("winner"));
      p1Boxes.forEach(box => box.classList.add("loser"));
    } else {
      banner.textContent = "It's a Tie!";
    }

    const bestOfMatch = Math.max(p1.score, p2.score);
    const isNewHigh = saveHighScoreIfBetter(state.highScoreKey, bestOfMatch);
    el("res-versus-highscore").textContent = getHighScore(state.highScoreKey);
    el("versus-new-high-badge").classList.toggle("hidden", !isNewHigh);

    const bestCorrectOfMatch = Math.max(p1.correct, p2.correct);
    const isNewMostAnswered = saveMostAnsweredIfBetter(state.highScoreKey, bestCorrectOfMatch);
    el("res-versus-most-answered").textContent = getMostAnswered(state.highScoreKey);
    el("versus-new-most-answered-badge").classList.toggle("hidden", !isNewMostAnswered);
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
  endGame();
});

el("replay-btn").addEventListener("click", () => {
  const idx = CATEGORIES.indexOf(state.cat);
  startGame(idx, state.mode, state.lang);
});

el("menu-btn").addEventListener("click", () => {
  clearInterval(tickHandle);
  renderMenu();
  showScreen("menu");
});

el("missed-toggle").addEventListener("click", () => {
  const missedReveal = el("missed-reveal");
  const nowHidden = missedReveal.classList.toggle("hidden");
  const label = nowHidden ? "Show" : "Hide";
  el("missed-toggle").textContent = `${label} Missed Answers (${state.missed.length})`;
});

/* ---------------- Init ---------------- */
renderMenu();
showScreen("menu");
