// A tiny external store, so only the rows whose highlight changes re-render.
const NO_HIGHLIGHT = { index: -1, value: null };
export function createCascaderHighlightStore() {
  let snapshot = NO_HIGHLIGHT;
  const listeners = new Set();
  return {
    subscribe(onStoreChange) {
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    },
    // The SAME object until something changes; `useSyncExternalStore` needs it.
    getSnapshot() {
      return snapshot;
    },
    set(next) {
      if (next.index === snapshot.index && next.value === snapshot.value)
        return;
      snapshot = next;
      for (const listener of listeners) listener();
    }
  };
}
