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
    slotDeadline: null,
    found: [],
    players: {
      1: { uid, score: 0, basePoints: 0, bonusPoints: 0, correct: 0 },
      2: null,
    },
    winner: null,
    createdAt: now,
    expiresAt: now + ROOM_TTL_MS,
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
    const slotDeadline = Date.now() + d.timeLimit * 1000;
    tx.update(ref, { status: "active", slotDeadline, players: updatedPlayers });

    return { ...d, status: "active", slotDeadline, players: updatedPlayers };
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

async function writeCorrectAnswer(roomCode, player, answerName, timeTaken, basePoints, bonus) {
  throw new Error("Online.writeCorrectAnswer not implemented yet (Phase 4)");
}

async function writeTimeout(roomCode, expectedTurn, expectedDeadline, timeLimit) {
  throw new Error("Online.writeTimeout not implemented yet (Phase 4)");
}

async function forfeitMatch(roomCode, forfeitingPlayer) {
  throw new Error("Online.forfeitMatch not implemented yet (Phase 5)");
}

window.Online = {
  createRoom,
  joinRoom,
  subscribeToRoom,
  cancelRoom,
  writeCorrectAnswer,
  writeTimeout,
  forfeitMatch,
};
