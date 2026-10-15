/**
 * Web Storage stores behind the storage hooks. Storage is read only when a store is used, so this
 * module is server-safe; every client caller shares the same store instances.
 */

/**
 * A key-value store over Web Storage that notifies subscribers in this tab (other tabs hear the
 * native `storage` event). Reads and writes fall back to memory when storage is blocked (private
 * modes, sandboxed frames, quota errors), so state still works for the session.
 *
 * @param {() => Storage | null | undefined} getStorage
 */
export function createStorageStore(getStorage) {
  const memory = new Map();
  // Keys whose last write storage refused: memory holds their current value.
  const memoryOnly = new Set();
  const listeners = new Map();
  const storage = () => {
    try {
      return getStorage() || null;
    } catch {
      return null;
    }
  };
  const notify = (key) => {
    listeners.get(key)?.forEach((listener) => listener());
    if (key === null) listeners.forEach((set) => set.forEach((listener) => listener()));
  };

  return {
    storage,
    get(key) {
      if (memoryOnly.has(key)) return memory.get(key);
      try {
        const area = storage();
        if (area) return area.getItem(key);
      } catch {
        // Fall through to memory.
      }
      return memory.has(key) ? memory.get(key) : null;
    },
    set(key, raw) {
      memory.set(key, raw);
      try {
        const area = storage();
        if (!area) throw new Error('Storage unavailable');
        area.setItem(key, raw);
        memoryOnly.delete(key);
      } catch {
        // Keep the in-memory value when storage refuses the write.
        memoryOnly.add(key);
      }
      notify(key);
    },
    remove(key) {
      // Keep a tombstone when storage refuses removal, just as refused writes
      // keep their new value in memory. Otherwise the old preference reappears.
      memory.set(key, null);
      memoryOnly.add(key);
      try {
        const area = storage();
        if (area) {
          area.removeItem(key);
          memory.delete(key);
          memoryOnly.delete(key);
        }
      } catch {
        // The session still observes the removal.
      }
      notify(key);
    },
    subscribe(key, listener) {
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(listener);
      return () => {
        listeners.get(key)?.delete(listener);
        if (!listeners.get(key)?.size) listeners.delete(key);
      };
    },
    notify
  };
}

export const localStorageStore = createStorageStore(() => (typeof window === 'undefined' ? null : window.localStorage));

export const sessionStorageStore = createStorageStore(() => (typeof window === 'undefined' ? null : window.sessionStorage));
