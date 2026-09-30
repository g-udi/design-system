// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import * as React from 'react';
import { useCascaderState } from './cascader-context-extended.jsx';
import {
  CASCADER_ROOT_KEY,
  isCascaderMoreNode
} from './cascader-lib-extended.jsx';
const PREFETCH_DELAY = 150;
const SEARCH_KEY = '\0search';
const RESOLVE_PREFIX = '\0resolve:';
const NO_STATE = {
  loading: false,
  error: false,
  hasMore: false
};
const NO_RESULTS = [];
function createStore() {
  return {
    pages: /* @__PURE__ */ new Map(),
    states: /* @__PURE__ */ new Map(),
    detached: /* @__PURE__ */ new Map()
  };
}
function sameLoadState(a, b) {
  return (
    a.loading === b.loading &&
    a.error === b.error &&
    a.hasMore === b.hasMore &&
    a.cursor === b.cursor
  );
}
function withLoadState(store, key, update) {
  const current = store.states.get(key) ?? NO_STATE;
  const next = update(current);
  if (store.states.has(key) && sameLoadState(current, next)) return store;
  const states = new Map(store.states);
  states.set(key, next);
  return { pages: store.pages, states, detached: store.detached };
}
function withPage(store, key, items, options) {
  const previous = options.append ? (store.pages.get(key) ?? []) : [];
  const seen = new Set(previous.map((node) => node.value));
  const merged = previous.slice();
  for (const item of items) {
    if (seen.has(item.value)) continue;
    seen.add(item.value);
    merged.push(item);
  }
  const pages = new Map(store.pages);
  pages.set(key, merged);
  const states = new Map(store.states);
  states.set(key, {
    loading: false,
    error: false,
    hasMore: options.hasMore,
    cursor: options.cursor
  });
  return { pages, states, detached: store.detached };
}
function withDetached(store, items) {
  let detached = null;
  for (const item of items) {
    if (store.detached.get(item.value) === item) continue;
    detached = detached ?? new Map(store.detached);
    detached.set(item.value, item);
  }
  if (!detached) return store;
  return { pages: store.pages, states: store.states, detached };
}
function withChain(store, chain) {
  if (chain.length === 0) return store;
  const pages = new Map(store.pages);
  const detached = new Map(store.detached);
  let parentKey = CASCADER_ROOT_KEY;
  for (const node of chain) {
    const bucket = pages.get(parentKey);
    if (!bucket) {
      pages.set(parentKey, [node]);
    } else if (!bucket.some((entry) => entry.value === node.value)) {
      pages.set(parentKey, [...bucket, node]);
    }
    detached.set(node.value, node);
    parentKey = node.value;
  }
  return { pages, states: store.states, detached };
}
export function useCascaderLoader({
  base,
  getChildren,
  onSearch,
  resolveValue,
  searchDebounce = 250,
  loadKey,
  prefetch = false,
  onLoadError,
  enabled,
  query,
  levels,
  path,
  values
}) {
  const [store, setStore] = React.useState(createStore);
  const [search, setSearch] = React.useState(null);
  const latest = React.useRef({
    base,
    store,
    getChildren,
    onSearch,
    resolveValue,
    onLoadError,
    prefetch,
    path
  });
  React.useEffect(() => {
    latest.current = {
      base,
      store,
      getChildren,
      onSearch,
      resolveValue,
      onLoadError,
      prefetch,
      path
    };
  });
  const controllers = React.useRef(/* @__PURE__ */ new Map());
  const requestIds = React.useRef(/* @__PURE__ */ new Map());
  const inflight = React.useRef(/* @__PURE__ */ new Map());
  const moreLatch = React.useRef(/* @__PURE__ */ new Map());
  const attempted = React.useRef(/* @__PURE__ */ new Set());
  const known = React.useRef(/* @__PURE__ */ new Map());
  const timers = React.useRef({ prefetch: null });
  const epoch = React.useRef(0);
  const remember = React.useCallback((nodes) => {
    const map = known.current;
    const walk = (list) => {
      for (const node of list) {
        map.set(node.value, node);
        if (node.children?.length) walk(node.children);
      }
    };
    walk(nodes);
  }, []);
  const abortKey = React.useCallback((key) => {
    const controller = controllers.current.get(key);
    if (!controller) return;
    controllers.current.delete(key);
    inflight.current.delete(key);
    controller.abort();
  }, []);
  const runLoad = React.useCallback(
    (key, reason, cursor, append) => {
      const { getChildren: loader, base: currentBase } = latest.current;
      if (!loader) return;
      const signature = `${append ? '1' : '0'}:${cursor ?? ''}`;
      if (inflight.current.get(key) === signature) return;
      abortKey(key);
      const controller = new AbortController();
      controllers.current.set(key, controller);
      inflight.current.set(key, signature);
      const requestId = (requestIds.current.get(key) ?? 0) + 1;
      requestIds.current.set(key, requestId);
      const startEpoch = epoch.current;
      const node =
        key === CASCADER_ROOT_KEY
          ? null
          : (currentBase.byValue.get(key) ?? known.current.get(key) ?? null);
      setStore((prev) =>
        withLoadState(prev, key, (state) => ({
          ...state,
          loading: true,
          error: false
        }))
      );
      const settle = () => {
        if (inflight.current.get(key) === signature)
          inflight.current.delete(key);
        if (controllers.current.get(key) === controller) {
          controllers.current.delete(key);
        }
      };
      const stale = () =>
        controller.signal.aborted ||
        startEpoch !== epoch.current ||
        requestId !== requestIds.current.get(key);
      Promise.resolve()
        .then(() => loader(node, { signal: controller.signal, cursor, reason }))
        .then((result) => {
          settle();
          if (stale()) return;
          const items = Array.isArray(result) ? result : result.items;
          const nextCursor = Array.isArray(result) ? void 0 : result.nextCursor;
          const hasMore = Array.isArray(result)
            ? false
            : (result.hasMore ?? nextCursor != null);
          if (!append) moreLatch.current.delete(key);
          remember(items);
          setStore((prev) =>
            withPage(prev, key, items, { append, hasMore, cursor: nextCursor })
          );
        })
        .catch((error) => {
          settle();
          if (stale()) return;
          setStore((prev) =>
            withLoadState(prev, key, (state) => ({
              ...state,
              loading: false,
              error: true
            }))
          );
          latest.current.onLoadError?.(error, {
            parent: key === CASCADER_ROOT_KEY ? null : key,
            reason
          });
        });
    },
    [abortKey, remember]
  );
  const ensureLevel = React.useCallback(
    (key, reason) => {
      const {
        getChildren: loader,
        store: current,
        base: index
      } = latest.current;
      if (!loader) return;
      if (current.states.has(key)) return;
      if (index.childrenOf.has(key)) return;
      runLoad(key, reason, void 0, false);
    },
    [runLoad]
  );
  const loadMore = React.useCallback(
    (key) => {
      const { getChildren: loader, store: current } = latest.current;
      if (!loader) return;
      const state = current.states.get(key);
      if (!state || state.loading || !state.hasMore) return;
      const loaded = current.pages.get(key)?.length ?? 0;
      const signature = `${loaded}:${state.cursor ?? ''}`;
      if (moreLatch.current.get(key) === signature) return;
      moreLatch.current.set(key, signature);
      runLoad(key, 'more', state.cursor, true);
    },
    [runLoad]
  );
  const retryLevel = React.useCallback(
    (key) => {
      const { getChildren: loader, store: current } = latest.current;
      if (!loader) return;
      const state = current.states.get(key);
      if (!state?.error) return;
      const loaded = current.pages.get(key)?.length ?? 0;
      moreLatch.current.delete(key);
      runLoad(key, 'retry', loaded > 0 ? state.cursor : void 0, loaded > 0);
    },
    [runLoad]
  );
  const invalidateLevel = React.useCallback(
    (value) => {
      const key = value ?? CASCADER_ROOT_KEY;
      abortKey(key);
      requestIds.current.set(key, (requestIds.current.get(key) ?? 0) + 1);
      moreLatch.current.delete(key);
      setStore((prev) => {
        if (!prev.states.has(key) && !prev.pages.has(key)) return prev;
        const states = new Map(prev.states);
        states.delete(key);
        const pages = new Map(prev.pages);
        pages.delete(key);
        return { pages, states, detached: prev.detached };
      });
    },
    [abortKey]
  );
  const prefetchNode = React.useCallback(
    (node) => {
      const {
        prefetch: on,
        getChildren: loader,
        store: current
      } = latest.current;
      if (!on || !loader || !node) return;
      if (isCascaderMoreNode(node)) return;
      if (!node.hasChildren) return;
      if (current.states.has(node.value)) return;
      const holder = timers.current;
      if (holder.prefetch) clearTimeout(holder.prefetch);
      holder.prefetch = setTimeout(() => {
        holder.prefetch = null;
        ensureLevel(node.value, 'prefetch');
      }, PREFETCH_DELAY);
    },
    [ensureLevel]
  );
  const runSearch = React.useCallback(
    (text) => {
      const { onSearch: searcher, path: currentPath } = latest.current;
      if (!searcher) return;
      abortKey(SEARCH_KEY);
      const controller = new AbortController();
      controllers.current.set(SEARCH_KEY, controller);
      const requestId = (requestIds.current.get(SEARCH_KEY) ?? 0) + 1;
      requestIds.current.set(SEARCH_KEY, requestId);
      const startEpoch = epoch.current;
      setSearch((prev) => ({
        query: text,
        results: prev?.results ?? [],
        loading: true,
        error: false
      }));
      const settle = () => {
        if (controllers.current.get(SEARCH_KEY) === controller) {
          controllers.current.delete(SEARCH_KEY);
        }
      };
      const stale = () =>
        controller.signal.aborted ||
        startEpoch !== epoch.current ||
        requestId !== requestIds.current.get(SEARCH_KEY);
      Promise.resolve()
        .then(() =>
          searcher(text, { signal: controller.signal, path: currentPath })
        )
        .then((result) => {
          settle();
          if (stale()) return;
          const items = Array.isArray(result) ? result : result.items;
          remember(items);
          setStore((prev) => withDetached(prev, items));
          setSearch({
            query: text,
            results: items,
            loading: false,
            error: false
          });
        })
        .catch((error) => {
          settle();
          if (stale()) return;
          setSearch((prev) => ({
            query: text,
            results: prev?.results ?? [],
            loading: false,
            error: true
          }));
          latest.current.onLoadError?.(error, {
            parent: null,
            reason: 'search'
          });
        });
    },
    [abortKey, remember]
  );
  const runResolve = React.useCallback(
    (value) => {
      const { resolveValue: resolver } = latest.current;
      if (!resolver) return;
      const key = `${RESOLVE_PREFIX}${value}`;
      abortKey(key);
      const controller = new AbortController();
      controllers.current.set(key, controller);
      const startEpoch = epoch.current;
      const settle = () => {
        if (controllers.current.get(key) === controller) {
          controllers.current.delete(key);
        }
      };
      Promise.resolve()
        .then(() =>
          resolver(value, { signal: controller.signal, reason: 'resolve' })
        )
        .then((chain) => {
          settle();
          if (controller.signal.aborted || startEpoch !== epoch.current) return;
          if (!chain?.length) return;
          remember(chain);
          setStore((prev) => withChain(prev, chain));
        })
        .catch((error) => {
          settle();
          attempted.current.delete(value);
          if (controller.signal.aborted || startEpoch !== epoch.current) return;
          latest.current.onLoadError?.(error, {
            parent: null,
            reason: 'resolve'
          });
        });
    },
    [abortKey, remember]
  );
  const cancelAll = React.useCallback(() => {
    const keys = Array.from(controllers.current.keys());
    for (const controller of controllers.current.values()) controller.abort();
    controllers.current.clear();
    inflight.current.clear();
    const holder = timers.current;
    if (holder.prefetch) {
      clearTimeout(holder.prefetch);
      holder.prefetch = null;
    }
    if (keys.length === 0) return;
    setStore((prev) => {
      let states = null;
      for (const key of keys) {
        const state = prev.states.get(key);
        if (!state?.loading) continue;
        states = states ?? new Map(prev.states);
        if ((prev.pages.get(key)?.length ?? 0) > 0) {
          states.set(key, { ...state, loading: false });
        } else {
          states.delete(key);
        }
      }
      return states ? { ...prev, states } : prev;
    });
    setSearch((prev) => (prev?.loading ? { ...prev, loading: false } : prev));
  }, []);
  const loadKeyRef = React.useRef(null);
  React.useEffect(() => {
    const previous = loadKeyRef.current;
    loadKeyRef.current = { key: loadKey };
    if (!previous || Object.is(previous.key, loadKey)) return;
    epoch.current += 1;
    for (const controller of controllers.current.values()) controller.abort();
    controllers.current.clear();
    inflight.current.clear();
    moreLatch.current.clear();
    attempted.current.clear();
    known.current.clear();
    const holder = timers.current;
    if (holder.prefetch) {
      clearTimeout(holder.prefetch);
      holder.prefetch = null;
    }
    setStore(createStore);
    setSearch(null);
  }, [loadKey]);
  React.useEffect(() => {
    if (enabled) return;
    if (controllers.current.size === 0) return;
    cancelAll();
  }, [enabled, cancelAll]);
  React.useEffect(() => {
    const active = controllers.current;
    const holder = timers.current;
    const pending = inflight.current;
    const ids = requestIds.current;
    return () => {
      for (const controller of active.values()) controller.abort();
      active.clear();
      pending.clear();
      ids.clear();
      if (holder.prefetch) clearTimeout(holder.prefetch);
    };
  }, []);
  const hasLoader = typeof getChildren === 'function';
  const hasSearch = typeof onSearch === 'function';
  const hasResolve = typeof resolveValue === 'function';
  const trimmed = query.trim();
  const levelsKey = JSON.stringify(levels);
  const valuesKey = JSON.stringify(values);
  React.useEffect(() => {
    if (!enabled || !hasLoader) return;
    for (const key of JSON.parse(levelsKey)) ensureLevel(key, 'level');
  }, [enabled, hasLoader, levelsKey, store, ensureLevel]);
  React.useEffect(() => {
    if (!hasSearch) return void 0;
    if (!enabled || !trimmed) {
      abortKey(SEARCH_KEY);
      setSearch((prev) => (prev === null ? prev : null));
      return void 0;
    }
    const timer = setTimeout(() => runSearch(trimmed), searchDebounce);
    return () => {
      clearTimeout(timer);
      abortKey(SEARCH_KEY);
    };
  }, [hasSearch, enabled, trimmed, searchDebounce, abortKey, runSearch]);
  React.useEffect(() => {
    if (!enabled || !hasResolve) return;
    for (const value of JSON.parse(valuesKey)) {
      if (!value) continue;
      if (attempted.current.has(value)) continue;
      if (base.byValue.has(value) || known.current.has(value)) continue;
      attempted.current.add(value);
      runResolve(value);
    }
  }, [enabled, hasResolve, valuesKey, base, runResolve]);
  const searchResults = React.useMemo(() => {
    if (!hasSearch || !trimmed) return null;
    if (!search || search.query !== trimmed) {
      return NO_RESULTS;
    }
    return search.results;
  }, [hasSearch, trimmed, search]);
  const searchState = React.useMemo(() => {
    if (!hasSearch || !trimmed) return null;
    const settled = search?.query === trimmed;
    return {
      loading: !settled || !!search?.loading,
      error: settled && !!search?.error,
      hasMore: false
    };
  }, [hasSearch, trimmed, search]);
  return React.useMemo(
    () => ({
      active: hasLoader,
      store,
      states: store.states,
      searchResults,
      searchState,
      ensureLevel,
      loadMore,
      retryLevel,
      invalidateLevel,
      prefetchNode
    }),
    [
      hasLoader,
      store,
      searchResults,
      searchState,
      ensureLevel,
      loadMore,
      retryLevel,
      invalidateLevel,
      prefetchNode
    ]
  );
}
export function useCascaderLoadState(parent) {
  const { loadStates } = useCascaderState();
  return loadStates.get(parent ?? CASCADER_ROOT_KEY) ?? null;
}
