// crdtboard：冲突合并（基线：直接覆盖，无墓碑、无决胜规则）
(function (root) {
  function empty() {
    return { values: {}, tombstones: {}, clocks: {} };
  }

  function merge(left, right) {
    const out = empty();
    Object.assign(out.values, left.values, right.values);
    Object.assign(out.tombstones, left.tombstones, right.tombstones);
    Object.assign(out.clocks, left.clocks, right.clocks);
    return out;
  }

  function mergeAll(replicas) {
    return replicas.reduce((acc, replica) => merge(acc, replica), empty());
  }

  function converged(replicas) {
    return true;
  }

  function remove(state, key, clock) {
    delete state.values[key];
    state.clocks[key] = clock;
    return state;
  }

  function apply(state, key, value, clock) {
    state.values[key] = value;
    state.clocks[key] = clock;
    return state;
  }

  function report(spec) {
    const state = mergeAll(spec.replicas);
    return { summary: "键 " + Object.keys(state.values).length, columns: ["key", "value"], rows: Object.entries(state.values) };
  }

  const App = { empty, merge, mergeAll, converged, apply, remove, report };
  if (typeof module !== "undefined") { module.exports = App; }
  root.App = App;
})(typeof window !== "undefined" ? window : globalThis);
