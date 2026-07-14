// Firestore-backed online 2-player versus matches.
// Loaded as a CDN-hosted ES module; exposes a plain window.Online API so
// classic-script game.js can call it without any import wiring.
//
// Phase 1: stubs only - real implementations land in Phases 3-5.

async function createRoom(categoryIndex, lang, timeLimit) {
  throw new Error("Online.createRoom not implemented yet (Phase 3)");
}

async function joinRoom(roomCode) {
  throw new Error("Online.joinRoom not implemented yet (Phase 3)");
}

function subscribeToRoom(roomCode, onUpdate) {
  throw new Error("Online.subscribeToRoom not implemented yet (Phase 3)");
}

async function cancelRoom(roomCode) {
  throw new Error("Online.cancelRoom not implemented yet (Phase 5)");
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
