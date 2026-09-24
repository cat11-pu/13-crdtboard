const assert = require("assert");
const App = require("../app.js");

const cases = [
  ["空状态合并", () => {
    const state = App.merge(App.empty(), App.empty());
    assert.deepStrictEqual(state.values, {});
  }],
  ["新值胜出", () => {
    let a = App.empty();
    let b = App.empty();
    a = App.apply(a, "k", "a1", 1);
    b = App.apply(b, "k", "b1", 2);
    assert.strictEqual(App.merge(a, b).values.k, "b1");
  }],
  ["删除清掉本地值", () => {
    let b = App.empty();
    b = App.apply(b, "k", "b1", 2);
    b = App.remove(b, "k", 3);
    assert.strictEqual(b.values.k, undefined);
  }],
  ["收敛判定可用", () => {
    assert.strictEqual(typeof App.converged([App.empty()]), "boolean");
  }],
  ["report 结构稳定", () => {
    const out = App.report({ replicas: [App.empty()] });
    assert.ok(Array.isArray(out.rows) && Array.isArray(out.columns));
  }],

];

let failed = 0;
for (const [name, fn] of cases) {
  try { fn(); console.log("ok   " + name); }
  catch (error) { failed += 1; console.log("FAIL " + name + " -> " + error.message); }
}
console.log(cases.length + " cases, " + failed + " failed");
process.exit(failed ? 1 : 0);
