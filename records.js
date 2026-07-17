// Local-storage-backed persistence: high scores, most-answered counts, and
// the permanent "cleared before" marker. No dependency on anything else in
// the app (no DOM, no CATEGORIES, no game state) - loaded early so both
// menu.js and game.js can call into it.
const HIGH_SCORE_KEY = "nameThemAll.highScores";
const MOST_ANSWERED_KEY = "nameThemAll.mostAnswered";
const CLEARED_KEY = "nameThemAll.cleared";

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
