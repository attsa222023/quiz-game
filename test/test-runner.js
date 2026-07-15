// Minimal, zero-dependency test harness. Runs entirely in the browser (or
// even file://) so it needs nothing installed, matching this project's
// no-build-step approach - no npm/test-library dependency.
const results = [];

function test(name, fn) {
  try {
    fn();
    results.push({ name, pass: true });
  } catch (err) {
    results.push({ name, pass: false, error: err.message });
  }
}

function assertEqual(actual, expected, msg) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(`${msg || "assertEqual failed"}: expected ${e}, got ${a}`);
  }
}

function assertTrue(value, msg) {
  if (!value) throw new Error(msg || "expected a truthy value");
}

function renderResults() {
  const passCount = results.filter(r => r.pass).length;
  const failCount = results.length - passCount;
  const out = document.getElementById("test-output");
  out.innerHTML = results.map(r =>
    `<div style="color:${r.pass ? "#3ddc84" : "#ff5d5d"}">${r.pass ? "✓" : "✗"} ${r.name}${r.error ? ` &mdash; ${r.error}` : ""}</div>`
  ).join("");
  const summary = document.getElementById("test-summary");
  summary.textContent = `${passCount}/${results.length} passing`;
  summary.style.color = failCount ? "#ff5d5d" : "#3ddc84";
  document.title = `${passCount}/${results.length} passing` + (failCount ? " - FAILURES" : "");
}
