/** Media query reads and subscriptions behind useMediaQuery. Both guard `window`, so this module is server-safe. */

/** Whether `query` matches now; false without `window.matchMedia` (server rendering, old engines). */
export function matchesMediaQuery(query) {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false;
}

/** Subscribe to `query` changes. Falls back to the legacy `addListener` API. Returns the unsubscribe. */
export function subscribeMediaQuery(query, notify) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const list = window.matchMedia(query);
  if (typeof list.addEventListener === 'function') {
    list.addEventListener('change', notify);
    return () => list.removeEventListener('change', notify);
  }
  list.addListener(notify);
  return () => list.removeListener(notify);
}
