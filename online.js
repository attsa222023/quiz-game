// Firestore-backed online 2-player versus matches.
// Loaded as a CDN-hosted ES module; exposes a plain window.Online API so
// classic-script game.js can call it without any import wiring.
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Excludes visually-ambiguous characters (0/O, 1/I) since codes get shared
// verbally/by text.
const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_CODE_LENGTH = 5;
const ROOM_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours; cleaned up via Firestore TTL policy (Phase 5)

function randomRoomCode() {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

function emptyRematch() {
  return { offeredBy: null, categoryIndex: null, lang: null, timeLimit: null, accepted: { 1: false, 2: false } };
}

async function createRoom(categoryIndex, lang, timeLimit) {
  const uid = await window.Firebase.authReady;
  const db = window.Firebase.db;

  let code, ref, existing;
  let attempts = 0;
  do {
    code = randomRoomCode();
    ref = doc(db, "rooms", code);
    existing = await getDoc(ref);
    attempts++;
  } while (existing.exists() && attempts < 5);

  if (existing.exists()) {
    throw new Error("Could not generate a unique room code, please try again.");
  }

  const now = Date.now();
  const roomData = {
    categoryIndex,
    lang: lang || null,
    timeLimit,
    status: "waiting",
    turn: 1,
    consecutiveMisses: 0,
    slotStartedAt: null,
    found: [],
    players: {
      1: { uid, score: 0, basePoints: 0, bonusPoints: 0, correct: 0 },
      2: null,
    },
    winner: null,
    rematch: emptyRematch(),
    createdAt: now,
    // Firestore's native TTL feature requires an actual Timestamp-typed
    // field - a plain number is silently ignored by it.
    expiresAt: Timestamp.fromMillis(now + ROOM_TTL_MS),
  };
  await setDoc(ref, roomData);
  return { roomCode: code, player: 1, roomData };
}

async function joinRoom(roomCode) {
  const uid = await window.Firebase.authReady;
  const db = window.Firebase.db;
  const ref = doc(db, "rooms", roomCode);

  const roomData = await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("No match found with that code.");
    const d = snap.data();
    if (d.status !== "waiting") throw new Error("That match has already started or ended.");
    if (d.players[1] && d.players[1].uid === uid) throw new Error("You can't join your own match.");

    const updatedPlayers = {
      ...d.players,
      2: { uid, score: 0, basePoints: 0, bonusPoints: 0, correct: 0 },
    };
    tx.update(ref, { status: "active", slotStartedAt: serverTimestamp(), players: updatedPlayers });

    // The real value of slotStartedAt isn't known until the server resolves
    // the serverTimestamp() sentinel - the caller's subscribeToRoom listener
    // receives it moments later, so this placeholder is intentionally null.
    return { ...d, status: "active", slotStartedAt: null, players: updatedPlayers };
  });

  return { roomCode, player: 2, roomData };
}

function subscribeToRoom(roomCode, onUpdate) {
  const db = window.Firebase.db;
  const ref = doc(db, "rooms", roomCode);
  return onSnapshot(ref, (snap) => {
    onUpdate(snap.exists() ? snap.data() : null);
  });
}

async function cancelRoom(roomCode) {
  const db = window.Firebase.db;
  const ref = doc(db, "rooms", roomCode);
  await updateDoc(ref, { status: "finished", winner: null });
}

function computeWinner(players) {
  const p1 = players["1"];
  const p2 = players["2"];
  if (p1.score > p2.score) return 1;
  if (p2.score > p1.score) return 2;
  return "tie";
}

// Compare-and-swap: reads the room, verifies it's still this player's turn
// and the answer hasn't already been credited (guards against a stale/late
// call racing a timeout that already resolved this slot), then commits.
// isLastAnswer is decided by the caller (which already knows the full
// category answer list locally) since Firestore never sees the answer key.
async function writeCorrectAnswer(roomCode, player, answerName, timeTaken, basePoints, bonus, isLastAnswer) {
  const db = window.Firebase.db;
  const ref = doc(db, "rooms", roomCode);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    const d = snap.data();
    if (d.status !== "active") return;
    if (d.turn !== player) return;
    if (d.found.some(f => f.name === answerName)) return;

    const newFound = [...d.found, { name: answerName, player, timeTaken }];
    const p = d.players[String(player)];
    const updatedPlayer = {
      ...p,
      basePoints: p.basePoints + basePoints,
      bonusPoints: p.bonusPoints + bonus,
      score: p.score + basePoints + bonus,
      correct: p.correct + 1,
    };
    const otherPlayer = player === 1 ? 2 : 1;

    if (isLastAnswer) {
      const playersAfter = { ...d.players, [player]: updatedPlayer };
      tx.update(ref, {
        found: newFound,
        [`players.${player}`]: updatedPlayer,
        status: "finished",
        winner: computeWinner(playersAfter),
        consecutiveMisses: 0,
      });
    } else {
      tx.update(ref, {
        found: newFound,
        [`players.${player}`]: updatedPlayer,
        turn: otherPlayer,
        consecutiveMisses: 0,
        slotStartedAt: serverTimestamp(),
      });
    }
  });
}

// Both clients' tick() loops call this unconditionally once their local
// clock thinks the deadline has passed - not just whoever's turn it is.
// The transaction is what actually adjudicates: it only commits if the
// room's turn/current slot still match what this client last saw, so
// whichever call reaches Firestore first wins and the other silently
// no-ops. This also covers a backgrounded/throttled tab - the *other*
// client's tick eventually resolves it.
//
// expectedSlotStartedAtMs is the resolved (server) millisecond value of
// slotStartedAt this client last saw, NOT a client-computed deadline - see
// the clock-skew note on slotStartedAt below.
async function writeTimeout(roomCode, expectedTurn, expectedSlotStartedAtMs) {
  const db = window.Firebase.db;
  const ref = doc(db, "rooms", roomCode);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    const d = snap.data();
    const currentStartedAtMs = d.slotStartedAt ? d.slotStartedAt.toMillis() : null;
    if (d.status !== "active" || d.turn !== expectedTurn || currentStartedAtMs !== expectedSlotStartedAtMs) {
      return; // already resolved by the other client (or a real answer landed first)
    }
    const misses = d.consecutiveMisses + 1;
    if (misses >= 2) {
      tx.update(ref, {
        status: "finished",
        consecutiveMisses: misses,
        winner: computeWinner(d.players),
      });
    } else {
      tx.update(ref, {
        turn: expectedTurn === 1 ? 2 : 1,
        consecutiveMisses: misses,
        slotStartedAt: serverTimestamp(),
      });
    }
  });
}

// Unilateral - no CAS needed, whoever quits simply forfeits.
async function forfeitMatch(roomCode, forfeitingPlayer) {
  const db = window.Firebase.db;
  const ref = doc(db, "rooms", roomCode);
  const winner = forfeitingPlayer === 1 ? 2 : 1;
  await updateDoc(ref, { status: "finished", winner });
}

// Plain write, not a transaction: Firestore replaces the whole `rematch`
// map atomically on a non-dotted-path write, so a simultaneous double-offer
// from both players just has one clean last-write-win with no torn state -
// acceptable given this project's existing client-trust risk tolerance
// (same as the rest of online play).
async function offerRematch(roomCode, byPlayer, categoryIndex, lang, timeLimit) {
  const db = window.Firebase.db;
  const ref = doc(db, "rooms", roomCode);
  const otherPlayer = byPlayer === 1 ? 2 : 1;
  await updateDoc(ref, {
    rematch: {
      offeredBy: byPlayer,
      categoryIndex,
      lang: lang || null,
      timeLimit,
      accepted: { [byPlayer]: true, [otherPlayer]: false },
    },
  });
}

// Transaction: must atomically decide "are both players now accepted" and
// reset the match in the same write. No-ops if there's no active offer -
// this also makes a double-click on Accept safe (the second call reads the
// already-reset doc and finds nothing to do).
async function acceptRematch(roomCode, myPlayer) {
  const db = window.Firebase.db;
  const ref = doc(db, "rooms", roomCode);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    const d = snap.data();
    if (!d.rematch || !d.rematch.offeredBy) return;

    const updatedAccepted = { ...d.rematch.accepted, [myPlayer]: true };
    if (updatedAccepted[1] && updatedAccepted[2]) {
      tx.update(ref, {
        categoryIndex: d.rematch.categoryIndex,
        lang: d.rematch.lang,
        timeLimit: d.rematch.timeLimit,
        status: "active",
        turn: 1,
        consecutiveMisses: 0,
        slotStartedAt: serverTimestamp(),
        found: [],
        players: {
          1: { uid: d.players["1"].uid, score: 0, basePoints: 0, bonusPoints: 0, correct: 0 },
          2: { uid: d.players["2"].uid, score: 0, basePoints: 0, bonusPoints: 0, correct: 0 },
        },
        winner: null,
        rematch: emptyRematch(),
        // Fresh TTL window for the continuing session, mirroring
        // createRoom's own precedent of setting expiresAt exactly when a
        // room becomes newly live.
        expiresAt: Timestamp.fromMillis(Date.now() + ROOM_TTL_MS),
      });
    } else {
      tx.update(ref, { [`rematch.accepted.${myPlayer}`]: true });
    }
  });
}

// Resets rematch back to empty - used both to decline an incoming offer and
// to withdraw one's own (e.g. via the leaveOnlineRoom cleanup in game.js).
async function declineRematch(roomCode) {
  const db = window.Firebase.db;
  const ref = doc(db, "rooms", roomCode);
  await updateDoc(ref, { rematch: emptyRematch() });
}

window.Online = {
  createRoom,
  joinRoom,
  subscribeToRoom,
  cancelRoom,
  writeCorrectAnswer,
  writeTimeout,
  forfeitMatch,
  offerRematch,
  acceptRematch,
  declineRematch,
};
