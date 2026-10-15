/*
 * Server-safe filter state helpers: read-only/size derivations and the small external stores that let
 * rows and chips re-render independently. Kept out of the client context module so they stay callable
 * outside client components.
 */
export function isFilterLocked(state) {
  return state.disabled || state.readOnly;
}
export function filterReadOnlyProps(state) {
  if (state.disabled || !state.readOnly) return null;
  return { 'aria-disabled': true, 'data-readonly': '' };
}
const FILTER_CONTROL_SIZES = {
  sm: { button: 'sm', icon: 'icon-sm' },
  default: { button: 'default', icon: 'icon' }
};

export function filterControlSizes(state) {
  return FILTER_CONTROL_SIZES[state.size] ?? FILTER_CONTROL_SIZES.default;
}
const NO_FOCUS = { id: null, segment: null, autoOpen: false };

export function createFilterFocusStore() {
  let snapshot = NO_FOCUS;
  const listeners = /* @__PURE__ */ new Set();
  return {
    subscribe(onStoreChange) {
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    },
    // The SAME object until something actually changes, which is what
    // `useSyncExternalStore` requires to avoid an infinite render loop.
    getSnapshot() {
      return snapshot;
    },
    set(next) {
      if (
        next.id === snapshot.id &&
        next.segment === snapshot.segment &&
        next.autoOpen === snapshot.autoOpen
      ) {
        return;
      }
      snapshot = next;
      for (const listener of listeners) listener();
    }
  };
}
export function createFilterRowStateStore() {
  const touched = /* @__PURE__ */ new Set();
  const pending = /* @__PURE__ */ new Set();
  const listeners = /* @__PURE__ */ new Set();
  let version = 0;
  const notify = () => {
    version += 1;
    for (const listener of listeners) listener();
  };
  return {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    version: () => version,
    has: (id) => touched.has(id),
    mark: (id) => {
      if (touched.has(id)) return;
      touched.add(id);
      notify();
    },
    unmark: (id) => {
      if (!touched.delete(id)) return;
      notify();
    },
    isPending: (id) => pending.has(id),
    markPending: (id) => {
      if (pending.has(id)) return;
      pending.add(id);
      notify();
    },
    resolvePending: (id) => {
      if (!pending.delete(id)) return;
      notify();
    },
    reset: () => {
      if (touched.size === 0 && pending.size === 0) return;
      touched.clear();
      pending.clear();
      notify();
    }
  };
}
export function createFilterResolutionStore() {
  const resolved = /* @__PURE__ */ new Map();
  const claimed = /* @__PURE__ */ new Map();
  const listeners = /* @__PURE__ */ new Set();
  let version = 0;
  const bucket = (fieldKey) => {
    let map = resolved.get(fieldKey);
    if (!map) {
      map = /* @__PURE__ */ new Map();
      resolved.set(fieldKey, map);
    }
    return map;
  };
  return {
    subscribe(onStoreChange) {
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    },
    getVersion() {
      return version;
    },
    get(fieldKey, value) {
      return resolved.get(fieldKey)?.get(value);
    },
    set(fieldKey, options) {
      const map = bucket(fieldKey);
      let landed = false;
      for (const option of options) {
        if (!map.has(option.value)) landed = true;
        map.set(option.value, option);
      }
      if (!landed) return;
      version += 1;
      for (const listener of listeners) listener();
    },
    claim(fieldKey, values) {
      let set = claimed.get(fieldKey);
      if (!set) {
        set = /* @__PURE__ */ new Set();
        claimed.set(fieldKey, set);
      }
      const map = resolved.get(fieldKey);
      const fresh = [];
      for (const value of values) {
        if (set.has(value) || map?.has(value)) continue;
        set.add(value);
        fresh.push(value);
      }
      return fresh;
    },
    release(fieldKey, values) {
      const set = claimed.get(fieldKey);
      if (!set) return;
      for (const value of values) set.delete(value);
    }
  };
}
