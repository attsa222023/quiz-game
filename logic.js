// Pure quiz-logic helpers with no DOM/Firebase dependency, split out of
// game.js so they can be loaded standalone by test.html without pulling in
// anything that touches the page or a network connection.
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

// Derives the not-yet-found answers from the full answer list and a found[]
// array, rather than storing "remaining" as its own piece of state. For
// online mode this lets Firestore carry only the append-only found[] list
// instead of duplicating/re-syncing a shrinking remaining set too.
function computeRemaining(answers, found) {
  const foundNames = new Set(found.map(f => f.name));
  return answers.filter(a => !foundNames.has(a));
}
