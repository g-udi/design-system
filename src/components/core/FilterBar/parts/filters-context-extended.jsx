// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import * as React from 'react';
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
const FilterActionsContext = React.createContext(null);
export function useFilterActions() {
  const context = React.useContext(FilterActionsContext);
  if (!context) {
    throw new Error('useFilterActions must be used inside <Filters>');
  }
  return context;
}
const FilterStateContext = React.createContext(null);
export function useFilterState() {
  const context = React.useContext(FilterStateContext);
  if (!context) {
    throw new Error('useFilterState must be used inside <Filters>');
  }
  return context;
}
const FilterRenderContext = React.createContext({});
export function useFilterRender() {
  return React.useContext(FilterRenderContext);
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
const FALLBACK_FOCUS_STORE = createFilterFocusStore();
const FilterFocusContext = React.createContext(FALLBACK_FOCUS_STORE);
const FilterReorderContext = React.createContext(false);
export const FilterReorderProvider = FilterReorderContext.Provider;
export function useFilterReorderable() {
  return React.useContext(FilterReorderContext);
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
const FALLBACK_ROW_STATE_STORE = createFilterRowStateStore();
const FilterRowStateContext = React.createContext(FALLBACK_ROW_STATE_STORE);
export const FilterRowStateProvider = FilterRowStateContext.Provider;
export function useFilterRowStateStore() {
  return React.useContext(FilterRowStateContext);
}
export function useFilterRowPending(id) {
  const store = React.useContext(FilterRowStateContext);
  return React.useSyncExternalStore(
    store.subscribe,
    () => store.isPending(id),
    () => false
  );
}
export function useFilterTouched(id) {
  const store = React.useContext(FilterRowStateContext);
  return React.useSyncExternalStore(
    store.subscribe,
    () => store.has(id),
    () => false
  );
}
export function useFilterFocus() {
  const store = React.useContext(FilterFocusContext);
  return React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );
}
export function useFilterFocusStore() {
  return React.useContext(FilterFocusContext);
}
export function useFilterChipAutoOpen(id) {
  const store = React.useContext(FilterFocusContext);
  return React.useSyncExternalStore(
    store.subscribe,
    () => {
      const snapshot = store.getSnapshot();
      return snapshot.autoOpen && snapshot.id === id ? snapshot.segment : null;
    },
    () => null
  );
}
export function useFilterFocusEmpty() {
  const store = React.useContext(FilterFocusContext);
  return React.useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().id === null,
    () => true
  );
}
export function useFilterChipFocused(id) {
  const store = React.useContext(FilterFocusContext);
  return React.useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().id === id,
    () => false
  );
}
export function useFilterSegmentFocus(id) {
  const store = React.useContext(FilterFocusContext);
  return React.useSyncExternalStore(
    store.subscribe,
    () => {
      const snapshot = store.getSnapshot();
      return snapshot.id === id ? snapshot.segment : null;
    },
    () => null
  );
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
export {
  FilterActionsContext,
  FilterFocusContext,
  FilterRenderContext,
  FilterStateContext
};
