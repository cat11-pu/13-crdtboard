const App = require("./app.js");
const spec = require("./sample/edits.json");

const replicas = spec.replicas.map((edits) => {
  let state = App.empty();
  for (const edit of edits) {
    state = edit.op === "remove" ? App.remove(state, edit.key, edit.clock) : App.apply(state, edit.key, edit.value, edit.clock);
  }
  return state;
});
const merged = App.mergeAll(replicas);
console.log("合并后的键值 =", JSON.stringify(Object.entries(merged.values).sort()));
console.log("墓碑键 =", JSON.stringify(Object.keys(merged.tombstones).sort()));
console.log("收敛 =", App.converged(replicas));
console.log("三副本两两合并一致 =", App.converged([App.merge(replicas[0], replicas[1]), App.merge(replicas[1], replicas[2]), App.merge(replicas[0], replicas[2])]));
console.log("时钟相同的决胜 =", merged.values[spec.tie_key]);
console.log("删除幂等 =", Object.keys(App.merge(merged, replicas[2]).tombstones).length);
console.log("副本数 =", replicas.length);
