const BASE_POINTS = 100;
const MAX_BONUS = 100;
const MAX_MISSED_DISPLAY = 20;
// Online matches enforce the deadline this much later than they visually
// display it - the displayed countdown (slotDeadline) still hits zero right
// on time for both players, but a timeout isn't actually written until this
// extra window also passes. This exists because slotStartedAt starts
// ticking the instant the server records it, not when each client's
// listener actually delivers the news - a player far from wherever Firestore
// is hosted can lose a meaningful chunk of their nominal answer window
// before their screen even shows it's their turn. A flat grace period on
// enforcement (not on what's displayed) gives that time back without
// changing the on-screen timer or the per-player CAS logic at all.
const ONLINE_TIMEOUT_GRACE_MS = 1500;

/* ---------------- State ---------------- */
let state = null;
let tickHandle = null;
let onlineRoomCode = null;
let onlineMyPlayer = null;
let onlineRoomUnsubscribe = null;
let rematchMode = false;
let rematchRoomCode = null;
let rematchMyPlayer = null;

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
    slotEnforceDeadline: null,
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
      state.slotEnforceDeadline = state.slotDeadline + ONLINE_TIMEOUT_GRACE_MS;
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

// Forces a direct one-time resync from the server, bypassing the realtime
// listener entirely. Used when a client suspects its own listener may have
// gone stale rather than waiting for it to eventually catch up on its own.
async function resyncOnlineRoom() {
  if (!state || !state.online || !state.roomCode) return;
  const roomCode = state.roomCode;
  try {
    const data = await Online.fetchRoom(roomCode);
    if (data) applyRoomSnapshot(roomCode, data);
  } catch (err) {
    console.error("resyncOnlineRoom failed", err);
  }
}

// A backgrounded tab (e.g. phone screen off, switched apps) can have its
// realtime listener silently throttled or dropped by the browser - nothing
// forces it to catch up again until the next Firestore update happens to
// arrive. Resyncing the moment the tab becomes visible again catches this
// immediately, rather than leaving the screen stuck until the timeout safety
// net (or the opponent's next move) eventually resolves it.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    resyncOnlineRoom();
  }
});

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

  if (state.online) {
    // The displayed bar above already hit 0%/red at slotDeadline, right on
    // schedule for both players. Actually enforcing the timeout waits until
    // the later, hidden slotEnforceDeadline - see ONLINE_TIMEOUT_GRACE_MS.
    const enforceRemainingMs = state.slotEnforceDeadline - now;
    if (enforceRemainingMs <= 0) {
      // Keep ticking - state._timeoutAttempted guards against spamming the
      // same timeout write every 50ms while waiting for either client's
      // write (or the opponent's answer) to land and push a new deadline.
      handleTimeoutOnline();
    }
  } else if (remainingMs <= 0) {
    clearInterval(tickHandle);
    tickHandle = null;
    handleTimeoutLocal();
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
//
// Resyncs directly from the server first, before trusting the local state
// enough to write a timeout against it: if this client's realtime listener
// silently missed an update (dropped connection, backgrounded tab), its own
// countdown reaching zero doesn't actually mean the opponent missed - it
// might just mean this client is stale. applyRoomSnapshot below picks up
// whatever the resync finds (including a slot that already moved on), so by
// the time writeTimeout is considered, expectedTurn/expectedSlotStart are
// only used if they still match reality.
async function handleTimeoutOnline() {
  if (state._timeoutAttempted) return;
  state._timeoutAttempted = true;
  const roomCode = state.roomCode;
  const expectedTurn = state.turn;
  const expectedSlotStart = state.slotStart;
  try {
    const data = await Online.fetchRoom(roomCode);
    if (data) applyRoomSnapshot(roomCode, data);
  } catch (err) {
    console.error("resync before timeout failed", err);
  }
  // The resync may have moved us on entirely (new slot, match finished, or
  // even a rematch already restarted this same room) - only proceed with
  // the timeout write if none of that happened.
  if (!state || !state.online || state.roomCode !== roomCode) return;
  if (state.turn !== expectedTurn || state.slotStart !== expectedSlotStart) return;
  // state.slotStart is the resolved server-timestamp ms value for the
  // current slot - the CAS check in online.js compares against this, not a
  // client-computed deadline, so the race is adjudicated independent of
  // either device's clock accuracy.
  Online.writeTimeout(roomCode, expectedTurn, expectedSlotStart).catch(err => {
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
