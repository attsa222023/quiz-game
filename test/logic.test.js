/* Tests for logic.js. Uses only inline fixture categories (not the real
   CATEGORIES data) so these don't break whenever categories.js changes. */

test("normalize lowercases and trims", () => {
  assertEqual(normalize("  USA  "), "usa");
});

test("normalize strips accents", () => {
  assertEqual(normalize("Curaçao"), "curacao");
});

test("normalize strips spaces and punctuation", () => {
  assertEqual(normalize("São Paulo"), "saopaulo");
});

test("normalize leaves Japanese text as-is aside from case folding", () => {
  assertEqual(normalize("東京都"), "東京都");
});

test("resolveCategorySource returns the category itself when there's no languages field", () => {
  const cat = { name: "Foo", answers: ["a", "b"] };
  assertEqual(resolveCategorySource(cat, undefined), cat);
});

test("resolveCategorySource returns the language-specific source when languages is present", () => {
  const en = { answers: ["Tokyo"] };
  const ja = { answers: ["東京都"] };
  const cat = { name: "Foo", languages: { en, ja } };
  assertEqual(resolveCategorySource(cat, "ja"), ja);
});

test("buildAnswerKey maps a normalized canonical answer to itself", () => {
  const cat = { answers: ["United States"] };
  const key = buildAnswerKey(cat);
  assertEqual(key.get(normalize("United States")), "United States");
});

test("buildAnswerKey maps aliases to their canonical answer", () => {
  const cat = { answers: ["United States"], aliases: { "United States": ["USA", "US"] } };
  const key = buildAnswerKey(cat);
  assertEqual(key.get(normalize("USA")), "United States");
  assertEqual(key.get(normalize("US")), "United States");
});

test("buildAnswerKey alias lookup is accent/case-insensitive", () => {
  const cat = { answers: ["Curaçao"], aliases: { "Curaçao": ["Curacao"] } };
  const key = buildAnswerKey(cat);
  assertEqual(key.get(normalize("CURACAO")), "Curaçao");
  assertEqual(key.get(normalize("curaçao")), "Curaçao");
});

test("buildAnswerKey respects the selected language on a languages-category", () => {
  const cat = { languages: { en: { answers: ["Tokyo"] }, ja: { answers: ["東京都"] } } };
  const enKey = buildAnswerKey(cat, "en");
  const jaKey = buildAnswerKey(cat, "ja");
  assertTrue(enKey.has(normalize("Tokyo")));
  assertTrue(jaKey.has(normalize("東京都")));
  assertTrue(!enKey.has(normalize("東京都")));
});

test("highScoreKeyFor returns the category name unchanged when there's no languages field", () => {
  assertEqual(highScoreKeyFor({ name: "Foo" }), "Foo");
});

test("highScoreKeyFor suffixes with (English) for en", () => {
  assertEqual(highScoreKeyFor({ name: "Foo", languages: {} }, "en"), "Foo (English)");
});

test("highScoreKeyFor suffixes with (日本語) for ja", () => {
  assertEqual(highScoreKeyFor({ name: "Foo", languages: {} }, "ja"), "Foo (日本語)");
});

test("computeRemaining returns everything when nothing is found", () => {
  assertEqual(computeRemaining(["a", "b", "c"], []), ["a", "b", "c"]);
});

test("computeRemaining removes found names from the list", () => {
  assertEqual(computeRemaining(["a", "b", "c"], [{ name: "b" }]), ["a", "c"]);
});

test("computeRemaining returns an empty array once everything is found", () => {
  assertEqual(computeRemaining(["a", "b"], [{ name: "a" }, { name: "b" }]), []);
});

renderResults();
