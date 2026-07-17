// Menu screen: group/category browsing, search, language filter, and the
// online create/join sub-choice UI. Depends on globals from categories.js,
// logic.js, records.js, and game.js (el/screens/showScreen, plus the
// game-starting functions startGame/createOnlineRoom/offerRematchFlow/
// joinOnlineRoomFlow/leaveOnlineRoom and shared session state like
// rematchMode/onlineRoomUnsubscribe) - loaded last among the classic
// scripts so all of that already exists by the time this file's own
// init call runs.
const DEFAULT_TIME_LIMIT = 10; // seconds per answer
let selectedMode = "solo";
let selectedTimeLimit = DEFAULT_TIME_LIMIT;
let selectedGroup = null;
let onlineSubMode = null; // null | "create" | "join"
let searchQuery = "";
let languageFilter = "any";
const GROUP_ORDER = ["Geography", "Science", "Sports", "Entertainment", "Culture"];
const PLAY_LABELS = { en: "Play in English", ja: "日本語でプレイ", zh: "用繁體中文玩" };

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

/* ---------------- Init ---------------- */
populateLanguageFilter();
updateMenuView();
showScreen("menu");
