'use client';
import * as React from 'react';
import {
  useCascaderLoader,
  useCascaderLoadState
} from './cascader-async-extended.jsx';
import {
  CascaderActionsContext,
  CascaderHighlightContext,
  CascaderRenderContext,
  CascaderStateContext,
  createCascaderHighlightStore,
  useCascaderActions,
  useCascaderHighlight,
  useCascaderRender,
  useCascaderState
} from './cascader-context-extended.jsx';
import { resolveCascaderLabels } from './cascader-i18n-extended.jsx';
import {
  applyCascadeSelection,
  buildCascaderIndex,
  CASCADER_LIST_HEIGHT_CLASS,
  CASCADER_LIST_PAD_CLASS,
  CASCADER_ROOT_KEY,
  CASCADER_ROWS_CLASS,
  CASCADER_SCROLL_CLASS,
  collapseCascaderPath,
  createCascaderMoreNode,
  filterCascaderLevel,
  findAmbiguousCascaderLabels,
  findCascaderDataIssues,
  flattenCascaderTree,
  getCascaderCheckedValues,
  getCascaderChildren,
  getCascaderCount,
  getCascaderIndeterminateFrom,
  getCascaderPath,
  getCascaderSelectedDescendants,
  getCascaderTabTarget,
  isCascaderBranch,
  isCascaderMoreNode,
  isCascaderSelectable,
  matchesCascaderQuery,
  mergeCascaderIndex,
  normalizeCascaderQuery,
  searchCascaderDeep,
  warnCascaderOnce
} from './cascader-lib-extended.jsx';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
import { ScrollArea } from '../../ScrollArea/parts/scroll-area.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const EMPTY = [];
const EMPTY_ACTIONS = [];
const ANNOUNCE_MARKER = '\u2060';
const ANNOUNCE_DEBOUNCE = 150;
function useControllable(controlled, defaultValue, onChange, devName) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = controlled !== void 0;
  const value = isControlled ? controlled : uncontrolled;
  const wasControlled = React.useRef(isControlled);
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (wasControlled.current === isControlled || !devName) return;
    const from = wasControlled.current ? 'controlled' : 'uncontrolled';
    const to = isControlled ? 'controlled' : 'uncontrolled';
    wasControlled.current = isControlled;
    warnCascaderOnce(
      `controlled-switch:${devName}`,
      `\`${devName}\` switched from ${from} to ${to}. Decide once: pass \`${devName}\` for the whole life of the component, or pass only the default and let the cascader own it.`
    );
  }, [isControlled, devName]);
  const latest = React.useRef({ value, isControlled, onChange });
  React.useEffect(() => {
    latest.current = { value, isControlled, onChange };
  });
  const lastProp = React.useRef(controlled);
  React.useEffect(() => {
    lastProp.current = controlled;
  });
  const set = React.useCallback((next) => {
    const current = latest.current.value;
    const resolved = typeof next === 'function' ? next(current) : next;
    if (Object.is(resolved, current)) {
      if (
        !latest.current.isControlled ||
        Object.is(resolved, lastProp.current)
      ) {
        return;
      }
    }
    latest.current = { ...latest.current, value: resolved };
    if (!latest.current.isControlled) setUncontrolled(resolved);
    latest.current.onChange?.(resolved);
  }, []);
  return [value, set];
}
function shallowEqualRecords(a, b) {
  const left = a;
  const right = b;
  const keys = Object.keys(left);
  if (keys.length !== Object.keys(right).length) return false;
  for (const key of keys) {
    if (!Object.is(left[key], right[key])) return false;
  }
  return true;
}
function shallowEqualItemLists(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i] && !shallowEqualRecords(a[i], b[i])) return false;
  }
  return true;
}
function useShallowStable(value, equal) {
  const [stable, setStable] = React.useState(value);
  if (Object.is(value, stable)) return stable;
  const comparable =
    typeof value === 'object' &&
    value !== null &&
    typeof stable === 'object' &&
    stable !== null;
  if (comparable && equal(value, stable)) {
    return stable;
  }
  setStable(value);
  return value;
}
export function useCascader() {
  const actions = useCascaderActions();
  const state = useCascaderState();
  return React.useMemo(() => ({ ...actions, ...state }), [actions, state]);
}
export function useCascaderSelection() {
  const { multiple, setSelection } = useCascaderActions();
  const { index, selectedValues } = useCascaderState();
  return React.useMemo(() => {
    const selected = selectedValues
      .map((value) => index.byValue.get(value))
      .filter(Boolean);
    const paths = selectedValues.map((value) => getCascaderPath(index, value));
    return {
      selected,
      paths,
      first: selected[0] ?? null,
      firstPath: paths[0] ?? [],
      count: selectedValues.length,
      isEmpty: selectedValues.length === 0,
      multiple,
      remove: (value) =>
        setSelection(selectedValues.filter((entry) => entry !== value)),
      // Explicit reason: emptying on purpose is not "deselect the last node".
      clear: () => setSelection([], 'clear')
    };
  }, [index, selectedValues, multiple, setSelection]);
}
function toArray(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value.filter((entry) => entry !== '');
  return value === '' ? [] : [value];
}
function useCascaderDevWarnings(options) {
  const {
    items,
    getParent,
    mode,
    multiple,
    cascade,
    indicator,
    selectable,
    searchScope,
    max,
    value,
    defaultValue,
    hasExpanded,
    hasPath,
    hasOnSearch
  } = options;
  const issues = React.useMemo(
    () =>
      process.env.NODE_ENV === 'production'
        ? null
        : findCascaderDataIssues(items, getParent),
    [items, getParent]
  );
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    for (const duplicate of issues?.duplicates ?? []) {
      warnCascaderOnce(
        `duplicate-value:${duplicate}`,
        `Duplicate node value ${JSON.stringify(duplicate)}. \`value\` is the selection key, so only the first occurrence is indexed and the rest never render.`
      );
    }
    for (const cycle of issues?.cycles ?? []) {
      warnCascaderOnce(
        `cycle:${cycle}`,
        `\`getParent\` puts ${JSON.stringify(cycle)} on a cycle. The depth walk is cycle-guarded so nothing hangs, but every depth on that chain is clamped rather than derived.`
      );
    }
  }, [issues]);
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    for (const [prop, current] of [
      ['value', value],
      ['defaultValue', defaultValue]
    ]) {
      if (current == null) continue;
      if (multiple && !Array.isArray(current)) {
        warnCascaderOnce(
          `value-shape:multiple:${prop}`,
          `\`multiple\` is set but \`${prop}\` is a string. Multi-select reads and writes a \`string[]\`; a string is treated as no selection at all.`
        );
      } else if (!multiple && Array.isArray(current)) {
        warnCascaderOnce(
          `value-shape:single:${prop}`,
          `\`${prop}\` is an array but \`multiple\` is not set. Single-select reads and writes a \`string\`; only the first entry would survive a commit.`
        );
      }
    }
    if (cascade && !multiple) {
      warnCascaderOnce(
        'cascade-without-multiple',
        '`cascade` does nothing without `multiple`: a single selection has no subtree to propagate over.'
      );
    }
    if (cascade && selectable === 'leaf') {
      warnCascaderOnce(
        'cascade-with-leaf-selectable',
        '`cascade` does nothing while `selectable="leaf"`: no branch can be committed, so no commit ever has a subtree under it. Pass `selectable="any"` or a predicate that accepts branches.'
      );
    }
    if (!indicator && multiple) {
      warnCascaderOnce(
        'indicator-false-with-multiple',
        '`indicator={false}` does nothing with `multiple`: the checkbox is the selection control rather than a decoration, so it and its gutter stay. Mark selection your own way from `data-selected` on the row, and drop the prop.'
      );
    }
    if (max != null && !multiple) {
      warnCascaderOnce(
        'max-without-multiple',
        '`max` does nothing without `multiple`: there is only ever one selection to cap.'
      );
    }
    if (hasExpanded && mode !== 'tree') {
      warnCascaderOnce(
        `expanded-outside-tree:${mode}`,
        `\`expanded\` only does something in \`mode="tree"\`, and this cascader is in \`mode="${mode}"\`. Drill and columns navigate with \`path\`.`
      );
    }
    if (hasPath && mode === 'tree') {
      warnCascaderOnce(
        'path-in-tree',
        '`path` does nothing in `mode="tree"`: branches expand in place rather than replacing the level. Use `expanded`.'
      );
    }
    if (searchScope === 'deep' && mode === 'tree') {
      warnCascaderOnce(
        'deep-search-in-tree',
        '`searchScope="deep"` does nothing in `mode="tree"`: a tree query already matches at any depth and auto-expands the ancestors of every hit.'
      );
    }
    if (hasOnSearch && mode === 'tree') {
      warnCascaderOnce(
        'onsearch-in-tree',
        '`onSearch` does nothing in `mode="tree"`: a tree query filters the loaded tree in place, and a server hit belongs to no visible branch, so its results would never render. The request is not fired. Filter the tree locally, or use drill or columns for server search.'
      );
    }
  }, [
    mode,
    multiple,
    cascade,
    indicator,
    selectable,
    searchScope,
    max,
    value,
    defaultValue,
    hasExpanded,
    hasPath,
    hasOnSearch
  ]);
}
function Cascader({
  items,
  getParent,
  getChildren,
  onSearch,
  searchDebounce,
  resolveValue,
  loadKey,
  prefetch,
  onLoadError,
  value: valueProp,
  defaultValue,
  onValueChange: onValueChangeProp,
  multiple = false,
  selectable = 'leaf',
  indicator = true,
  actions,
  cascade = false,
  max,
  mode = 'drill',
  expandTrigger,
  path: pathProp,
  defaultPath,
  onPathChange,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  closeOnSelect = true,
  inputValue: inputValueProp,
  defaultInputValue = '',
  onInputValueChange,
  searchScope = 'level',
  filter,
  revealSelected = true,
  maxHeight,
  virtualize,
  virtualizeThreshold = 100,
  estimateRowSize = 32,
  overscan = 8,
  labels: labelsProp,
  renderItem,
  renderLabel,
  disabled,
  name,
  form,
  id,
  required,
  readOnly,
  invalid,
  inputRef,
  inline,
  children
}) {
  const baseIndex = React.useMemo(
    () => buildCascaderIndex(items, getParent),
    // `getParent` is stable by design: an inline accessor must not rebuild a
    // 50k-node index.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  );
  const baseId = React.useId();
  const stableLabelsProp = useShallowStable(labelsProp, shallowEqualRecords);
  const labels = React.useMemo(
    () => resolveCascaderLabels(stableLabelsProp),
    [stableLabelsProp]
  );
  useCascaderDevWarnings({
    items,
    getParent,
    mode,
    multiple,
    cascade,
    indicator,
    selectable,
    searchScope,
    max,
    value: valueProp,
    defaultValue,
    hasExpanded:
      expandedProp !== void 0 ||
      defaultExpanded !== void 0 ||
      onExpandedChange !== void 0,
    hasPath:
      pathProp !== void 0 || defaultPath !== void 0 || onPathChange !== void 0,
    hasOnSearch: onSearch !== void 0
  });
  const onValueChange = onValueChangeProp;
  const [value, setValue] = useControllable(
    valueProp,
    defaultValue ?? (multiple ? [] : ''),
    void 0,
    'value'
  );
  const pathReasonRef = React.useRef('external');
  const openReasonRef = React.useRef('none');
  const [path, setPath] = useControllable(
    pathProp,
    defaultPath ?? [],
    (next) => onPathChange?.(next, { reason: pathReasonRef.current }),
    'path'
  );
  const [expandedList, setExpandedList] = useControllable(
    expandedProp,
    defaultExpanded ?? [],
    onExpandedChange,
    'expanded'
  );
  const [open, setOpen] = useControllable(
    openProp,
    defaultOpen,
    (next) => onOpenChange?.(next, { reason: openReasonRef.current }),
    'open'
  );
  const setPathWithReason = React.useCallback(
    (next, reason) => {
      pathReasonRef.current = reason;
      try {
        setPath(next);
      } finally {
        pathReasonRef.current = 'external';
      }
    },
    [setPath]
  );
  const [query, setQuery] = useControllable(
    inputValueProp,
    defaultInputValue,
    onInputValueChange,
    'inputValue'
  );
  const expanded = React.useMemo(() => new Set(expandedList), [expandedList]);
  const selectedValues = React.useMemo(() => toArray(value), [value]);
  const levels = React.useMemo(() => {
    if (mode === 'tree') return [CASCADER_ROOT_KEY, ...expandedList];
    if (mode === 'columns') return [CASCADER_ROOT_KEY, ...path];
    return [path.length ? path[path.length - 1] : CASCADER_ROOT_KEY];
  }, [mode, path, expandedList]);
  const loader = useCascaderLoader({
    base: baseIndex,
    getChildren,
    // Gated, not merely unrendered: a tree hit belongs to no visible branch.
    onSearch: mode === 'tree' ? void 0 : onSearch,
    resolveValue,
    searchDebounce,
    loadKey,
    prefetch,
    onLoadError,
    // An inline cascader is never "open", but its panel is live.
    enabled: open || !!inline,
    query,
    levels,
    path,
    values: selectedValues
  });
  const loadStates = loader.states;
  const { ensureLevel, retryLevel: retryLoaderLevel, invalidateLevel } = loader;
  const needsChildren = React.useCallback(
    (node) => {
      if (!loader.active) return false;
      const state = loadStates.get(node.value);
      if (state) return state.loading || state.error;
      return !baseIndex.childrenOf.has(node.value);
    },
    [loader.active, loadStates, baseIndex]
  );
  const index = React.useMemo(
    () =>
      mergeCascaderIndex(baseIndex, loader.store.pages, loader.store.detached),
    [baseIndex, loader.store.pages, loader.store.detached]
  );
  const needsMoreRow = React.useCallback(
    (key, childCount) => {
      const state = loadStates.get(key);
      if (!state) return false;
      if (childCount > 0) return state.hasMore || state.loading || state.error;
      return mode === 'tree' && (state.loading || state.error);
    },
    [loadStates, mode]
  );
  const labelCacheRef = React.useRef(/* @__PURE__ */ new Map());
  for (const selected of selectedValues) {
    const node = index.byValue.get(selected);
    if (node) labelCacheRef.current.set(selected, node);
  }
  const resolveNode = React.useCallback(
    (nodeValue) =>
      index.byValue.get(nodeValue) ??
      labelCacheRef.current.get(nodeValue) ?? {
        value: nodeValue,
        label: nodeValue
      },
    [index]
  );
  const currentParentValue = path.length ? path[path.length - 1] : null;
  const currentParent = currentParentValue
    ? (index.byValue.get(currentParentValue) ?? null)
    : null;
  const currentLevelKey = currentParentValue ?? CASCADER_ROOT_KEY;
  const isDeepSearching =
    searchScope === 'deep' && query.trim().length > 0 && mode !== 'tree';
  const localDeepResults = React.useMemo(() => {
    if (!isDeepSearching) return null;
    return searchCascaderDeep(index, query, {
      within: currentParentValue,
      matches: filter
    });
  }, [isDeepSearching, index, query, currentParentValue, filter]);
  const deepResults = loader.searchResults ?? localDeepResults;
  const levelItems = React.useMemo(() => {
    const level = getCascaderChildren(index, currentParentValue);
    return filterCascaderLevel(level, query, filter);
  }, [index, currentParentValue, query, filter]);
  const levelRendered = React.useMemo(() => {
    if (deepResults) return deepResults;
    if (!needsMoreRow(currentLevelKey, levelItems.length)) return levelItems;
    return [
      ...levelItems,
      createCascaderMoreNode(currentLevelKey, levelItems.length)
    ];
  }, [deepResults, levelItems, currentLevelKey, needsMoreRow]);
  const columns = React.useMemo(() => {
    if (mode !== 'columns') return [];
    const trail = [];
    for (let depth = 0; depth <= path.length; depth += 1) {
      const parentValue = depth === 0 ? null : path[depth - 1];
      const parent = parentValue
        ? (index.byValue.get(parentValue) ?? null)
        : null;
      const isActive = depth === path.length;
      let columnItems;
      if (isActive) {
        columnItems = levelRendered;
      } else {
        const key = parentValue ?? CASCADER_ROOT_KEY;
        const children2 = getCascaderChildren(index, parentValue);
        columnItems = needsMoreRow(key, children2.length)
          ? [...children2, createCascaderMoreNode(key, children2.length)]
          : children2;
      }
      trail.push({
        parent,
        depth,
        activeValue: path[depth] ?? null,
        active: isActive,
        // Only the active column is filtered: a query narrows what you type
        // into, never the trail behind it.
        items: columnItems
      });
    }
    return trail;
  }, [mode, path, index, levelRendered, needsMoreRow]);
  const treeSentinels = React.useMemo(() => {
    if (mode !== 'tree') return void 0;
    const keys = /* @__PURE__ */ new Set();
    const consider = (key) => {
      if (needsMoreRow(key, index.childrenOf.get(key)?.length ?? 0)) {
        keys.add(key);
      }
    };
    consider(CASCADER_ROOT_KEY);
    for (const value2 of expanded) consider(value2);
    return keys.size ? keys : void 0;
  }, [mode, index, expanded, needsMoreRow]);
  const treeRows = React.useMemo(() => {
    if (mode !== 'tree') return [];
    const rows = flattenCascaderTree(index, expanded, treeSentinels);
    const normalized = normalizeCascaderQuery(query);
    if (!normalized) return rows;
    const keep = /* @__PURE__ */ new Set();
    for (const node of index.all) {
      if (
        !(filter
          ? filter(node, normalized)
          : matchesCascaderQuery(node, normalized))
      ) {
        continue;
      }
      for (const ancestor of getCascaderPath(index, node.value)) {
        keep.add(ancestor.value);
      }
    }
    return flattenCascaderTree(
      index,
      /* @__PURE__ */ new Set([...expanded, ...keep])
    ).filter((row) => keep.has(row.node.value));
  }, [mode, index, expanded, treeSentinels, query, filter]);
  const renderedItems = React.useMemo(
    () => (mode === 'tree' ? treeRows.map((row) => row.node) : levelRendered),
    [mode, treeRows, levelRendered]
  );
  const levelKey = currentParentValue ?? '';
  const [swap, setSwap] = React.useState({ key: levelKey, active: false });
  if (swap.key !== levelKey) {
    setSwap({ key: levelKey, active: true });
  }
  const swapping = swap.active && swap.key === levelKey;
  React.useLayoutEffect(() => {
    if (swap.active) setSwap((prev) => ({ ...prev, active: false }));
  }, [swap.active]);
  const [virtualRenderers, setVirtualRenderers] = React.useState(0);
  const registerVirtualRenderer = React.useCallback(() => {
    setVirtualRenderers((count) => count + 1);
    return () => setVirtualRenderers((count) => Math.max(0, count - 1));
  }, []);
  const hasVirtualRenderer = virtualRenderers > 0;
  const wantsVirtual =
    virtualize ?? renderedItems.length >= virtualizeThreshold;
  const [virtualLatch, setVirtualLatch] = React.useState({
    key: levelKey,
    on: false
  });
  const virtualized =
    hasVirtualRenderer &&
    (virtualLatch.key === levelKey
      ? virtualLatch.on || wantsVirtual
      : wantsVirtual);
  if (!hasVirtualRenderer) {
    if (virtualLatch.on || virtualLatch.key !== levelKey) {
      setVirtualLatch({ key: levelKey, on: false });
    }
  } else if (virtualLatch.key !== levelKey) {
    setVirtualLatch({ key: levelKey, on: virtualized });
  } else if (virtualized && !virtualLatch.on) {
    setVirtualLatch({ key: levelKey, on: true });
  }
  const [virtualSyncs, setVirtualSyncs] = React.useState(0);
  React.useEffect(() => {
    if (!virtualized) return;
    setVirtualSyncs((count) => count + 1);
  }, [virtualized]);
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return void 0;
    if (virtualize !== true || hasVirtualRenderer) return void 0;
    const timeout = setTimeout(() => {
      console.error(
        '[Cascader] `virtualize` is true but no windowing renderer is mounted. Render <CascaderVirtualItems /> inside <CascaderList>, or <CascaderVirtualColumn /> through the <CascaderColumns> slot.'
      );
    }, 0);
    return () => clearTimeout(timeout);
  }, [virtualize, hasVirtualRenderer]);
  const [announceSignal, setAnnounceSignal] = React.useState({
    seq: 0,
    toggled: null,
    notice: null
  });
  const bumpAnnouncement = React.useCallback((toggled) => {
    setAnnounceSignal((prev) => ({ seq: prev.seq + 1, toggled, notice: null }));
  }, []);
  const announceNotice = React.useCallback((notice) => {
    setAnnounceSignal((prev) => ({ seq: prev.seq + 1, toggled: null, notice }));
  }, []);
  const [pendingNavigation, setPendingNavigation] = React.useState(null);
  const requestChildren = React.useCallback(
    (node, pending) => {
      setPendingNavigation(pending);
      retryLoaderLevel(node.value);
      ensureLevel(node.value, 'level');
      bumpAnnouncement(null);
    },
    [retryLoaderLevel, ensureLevel, bumpAnnouncement]
  );
  const pushLevel = React.useCallback(
    (nodeValue) => {
      setPathWithReason((prev) => [...prev, nodeValue], 'drill');
      setQuery('');
      bumpAnnouncement(null);
    },
    [setPathWithReason, setQuery, bumpAnnouncement]
  );
  const popLevel = React.useCallback(() => {
    setPathWithReason(
      (prev) => (prev.length ? prev.slice(0, -1) : prev),
      'back'
    );
    setQuery('');
    setPendingNavigation(null);
    bumpAnnouncement(null);
  }, [setPathWithReason, setQuery, bumpAnnouncement]);
  const goToDepth = React.useCallback(
    (depth) => {
      setPathWithReason(
        (prev) => prev.slice(0, Math.max(0, depth)),
        'breadcrumb'
      );
      setQuery('');
      setPendingNavigation(null);
      bumpAnnouncement(null);
    },
    [setPathWithReason, setQuery, bumpAnnouncement]
  );
  const toggleExpanded = React.useCallback(
    (nodeValue) => {
      setExpandedList((prev) =>
        prev.includes(nodeValue)
          ? prev.filter((v) => v !== nodeValue)
          : [...prev, nodeValue]
      );
      bumpAnnouncement(nodeValue);
    },
    [setExpandedList, bumpAnnouncement]
  );
  const isBranch = React.useCallback(
    (node) => isCascaderBranch(index, node),
    [index]
  );
  const isSelectable = React.useCallback(
    (node) => isCascaderSelectable(index, node, selectable),
    [index, selectable]
  );
  const branchesSelectable = selectable !== 'leaf';
  const openFlyoutsRef = React.useRef(/* @__PURE__ */ new Set());
  const setFlyoutOpen = React.useCallback((key, open2) => {
    if (open2) openFlyoutsRef.current.add(key);
    else openFlyoutsRef.current.delete(key);
  }, []);
  const hasOpenFlyout = React.useCallback(
    () => openFlyoutsRef.current.size > 0,
    []
  );
  const stableActions = useShallowStable(actions, shallowEqualItemLists);
  const resolvedActions = React.useMemo(
    () => stableActions ?? EMPTY_ACTIONS,
    [stableActions]
  );
  const selectedSet = React.useMemo(
    () => new Set(selectedValues),
    [selectedValues]
  );
  const isSelected = React.useCallback(
    (node) => selectedSet.has(node.value),
    [selectedSet]
  );
  const selectedDescendants = React.useMemo(
    () => getCascaderSelectedDescendants(index, selectedValues),
    [index, selectedValues]
  );
  const selectedDescendantCount = React.useCallback(
    (node) => selectedDescendants.get(node.value) ?? 0,
    [selectedDescendants]
  );
  const indeterminateSet = React.useMemo(() => {
    if (!cascade || !multiple) return null;
    return getCascaderIndeterminateFrom(selectedDescendants, selectedValues);
  }, [cascade, multiple, selectedDescendants, selectedValues]);
  const isIndeterminate = React.useCallback(
    (node) => indeterminateSet?.has(node.value) ?? false,
    [indeterminateSet]
  );
  const highlightedRef = React.useRef(null);
  const getHighlighted = React.useCallback(() => highlightedRef.current, []);
  const [highlightStore] = React.useState(createCascaderHighlightStore);
  const currentLoadState = React.useMemo(
    () => loadStates.get(currentLevelKey) ?? null,
    [loadStates, currentLevelKey]
  );
  const searchLoadState = loader.searchState;
  const announcedMatches = React.useMemo(() => {
    if (deepResults) return deepResults.length;
    const normalized = normalizeCascaderQuery(query);
    if (!normalized) return 0;
    const matches = filter ?? matchesCascaderQuery;
    return renderedItems.filter(
      (node) => !isCascaderMoreNode(node) && matches(node, normalized)
    ).length;
  }, [deepResults, renderedItems, query, filter]);
  const announcementTarget = React.useMemo(() => {
    if (!open && !inline) return { text: '', defer: false };
    const total = renderedItems.length;
    const marker = ANNOUNCE_MARKER.repeat(announceSignal.seq % 2);
    if (announceSignal.notice) {
      return { text: `${announceSignal.notice}${marker}`, defer: false };
    }
    const toggled =
      mode === 'tree' && announceSignal.toggled
        ? (index.byValue.get(announceSignal.toggled) ?? null)
        : null;
    const pendingState = pendingNavigation
      ? (loadStates.get(pendingNavigation.value) ?? null)
      : null;
    const levelState = query.trim() ? searchLoadState : currentLoadState;
    let text;
    let defer = false;
    if (pendingState?.error) {
      text = labels.error;
    } else if (pendingNavigation) {
      text = labels.loading;
    } else if (levelState?.error) {
      text = labels.error;
    } else if (levelState?.loading) {
      text = query.trim()
        ? labels.searchingAnnouncement
        : total > 0
          ? labels.loadingMore
          : labels.loading;
    } else if (query.trim()) {
      text =
        announcedMatches === 0
          ? labels.empty
          : labels.resultsAnnouncement(announcedMatches);
      defer = true;
    } else if (toggled) {
      text = expanded.has(toggled.value)
        ? labels.expandedAnnouncement(
            toggled.label,
            getCascaderCount(index, toggled)
          )
        : labels.collapsedAnnouncement(toggled.label);
    } else if (currentParent) {
      text = labels.levelAnnouncement(
        currentParent.label,
        path.length + 1,
        total
      );
    } else {
      text = labels.rootAnnouncement(total);
    }
    return { text: `${text}${marker}`, defer };
  }, [
    open,
    inline,
    mode,
    index,
    expanded,
    announceSignal,
    query,
    labels,
    renderedItems.length,
    announcedMatches,
    currentParent,
    path.length,
    currentLoadState,
    searchLoadState,
    pendingNavigation,
    loadStates
  ]);
  const [announced, setAnnounced] = React.useState(announcementTarget);
  if (!announcementTarget.defer && announced.text !== announcementTarget.text) {
    setAnnounced(announcementTarget);
  }
  React.useEffect(() => {
    if (!announcementTarget.defer) return void 0;
    const timer = setTimeout(
      () => setAnnounced(announcementTarget),
      ANNOUNCE_DEBOUNCE
    );
    return () => clearTimeout(timer);
  }, [announcementTarget]);
  const announcement = announced.text;
  const stateValue = React.useMemo(
    () => ({
      index,
      path,
      expanded,
      query,
      currentParent,
      levelItems,
      deepResults,
      renderedItems,
      columns,
      treeRows,
      selectedValues,
      selectedDescendants,
      loadStates,
      searchState: searchLoadState,
      announcement
    }),
    [
      index,
      path,
      expanded,
      query,
      currentParent,
      levelItems,
      deepResults,
      renderedItems,
      columns,
      treeRows,
      selectedValues,
      selectedDescendants,
      loadStates,
      searchLoadState,
      announcement
    ]
  );
  const latest = React.useRef({
    index,
    state: stateValue,
    mode,
    multiple,
    cascade,
    max,
    labels,
    closeOnSelect,
    selectedValues,
    deepResults,
    onValueChange,
    resolveNode,
    isSelectable,
    needsChildren,
    expanded
  });
  React.useEffect(() => {
    latest.current = {
      index,
      state: stateValue,
      mode,
      multiple,
      cascade,
      max,
      labels,
      closeOnSelect,
      selectedValues,
      deepResults,
      onValueChange,
      resolveNode,
      isSelectable,
      needsChildren,
      expanded
    };
  });
  const getIndex = React.useCallback(() => latest.current.index, []);
  const getState = React.useCallback(() => latest.current.state, []);
  const goToLevelAt = React.useCallback(
    (nodeValue, depth) => {
      setPathWithReason(
        (prev) => [...prev.slice(0, Math.max(0, depth)), nodeValue],
        'drill'
      );
      setQuery('');
      bumpAnnouncement(null);
    },
    [setPathWithReason, setQuery, bumpAnnouncement]
  );
  const navigateAt = React.useCallback(
    (node, depth) => {
      if (latest.current.mode === 'tree') {
        toggleExpanded(node.value);
        return;
      }
      if (latest.current.needsChildren(node)) {
        requestChildren(node, { value: node.value, kind: 'at', depth });
        return;
      }
      goToLevelAt(node.value, depth);
    },
    [toggleExpanded, goToLevelAt, requestChildren]
  );
  const navigate = React.useCallback(
    (node) => {
      const {
        mode: currentMode,
        deepResults: currentDeepResults,
        index: currentIndex,
        expanded: currentExpanded,
        needsChildren: pending
      } = latest.current;
      if (currentMode === 'tree') {
        if (!currentExpanded.has(node.value) && pending(node)) {
          requestChildren(node, {
            value: node.value,
            kind: 'expand',
            depth: 0
          });
          return;
        }
        toggleExpanded(node.value);
        return;
      }
      if (currentDeepResults) {
        if (pending(node)) {
          const ancestors2 = getCascaderPath(currentIndex, node.value);
          requestChildren(node, {
            value: node.value,
            kind: 'at',
            // The hit's own depth, so the settle rebuilds the same trail.
            depth: Math.max(0, ancestors2.length - 1)
          });
          return;
        }
        const ancestors = getCascaderPath(currentIndex, node.value);
        setPathWithReason(
          ancestors.map((entry) => entry.value),
          'drill'
        );
        setQuery('');
        bumpAnnouncement(null);
        return;
      }
      if (pending(node)) {
        requestChildren(node, { value: node.value, kind: 'push', depth: 0 });
        return;
      }
      pushLevel(node.value);
    },
    [
      toggleExpanded,
      setPathWithReason,
      setQuery,
      pushLevel,
      bumpAnnouncement,
      requestChildren
    ]
  );
  React.useEffect(() => {
    if (!pendingNavigation) return;
    const state = loadStates.get(pendingNavigation.value);
    if (!state || state.loading || state.error) return;
    setPendingNavigation(null);
    if (pendingNavigation.kind === 'expand') {
      toggleExpanded(pendingNavigation.value);
      return;
    }
    if (pendingNavigation.kind === 'at') {
      goToLevelAt(pendingNavigation.value, pendingNavigation.depth);
      return;
    }
    pushLevel(pendingNavigation.value);
  }, [pendingNavigation, loadStates, toggleExpanded, goToLevelAt, pushLevel]);
  React.useEffect(() => {
    if (!open && !inline) setPendingNavigation(null);
  }, [open, inline]);
  const emitSelection = React.useCallback(
    (nextValues, node, reason) => {
      const {
        selectedValues: current,
        multiple: currentMultiple,
        onValueChange: emit,
        index: currentIndex,
        resolveNode: resolve
      } = latest.current;
      const unchanged =
        nextValues.length === current.length &&
        nextValues.every((entry, i) => entry === current[i]);
      if (unchanged) return;
      const next = currentMultiple ? nextValues : (nextValues[0] ?? '');
      setValue(next);
      if (!emit) return;
      const chain = node ? getCascaderPath(currentIndex, node.value) : [];
      emit(next, {
        node,
        // A node absent from `items` has no chain, so fall back to the node
        // rather than report an empty path for a change that had one.
        path: node ? (chain.length ? chain : [node]) : [],
        // `resolveNode`, not `index.byValue`: a selected value missing from
        // `items` must still come back rather than be dropped.
        nodes: nextValues.map(resolve),
        reason
      });
    },
    [setValue]
  );
  const setSelection = React.useCallback(
    (values, reason) => {
      const { selectedValues: current, resolveNode: resolve } = latest.current;
      const before = new Set(current);
      const after = new Set(values);
      const added = values.find((entry) => !before.has(entry));
      const removed = current.find((entry) => !after.has(entry));
      if (reason === 'clear') {
        emitSelection(values, null, 'clear');
        return;
      }
      if (added) {
        emitSelection(values, resolve(added), reason ?? 'select');
        return;
      }
      if (removed) {
        emitSelection(values, resolve(removed), reason ?? 'deselect');
        return;
      }
      emitSelection(values, null, reason ?? 'select');
    },
    [emitSelection]
  );
  const commit = React.useCallback(
    (node) => {
      const {
        multiple: currentMultiple,
        cascade: currentCascade,
        selectedValues: current,
        max: currentMax,
        index: currentIndex,
        isSelectable: currentIsSelectable,
        labels: currentLabels,
        closeOnSelect: currentCloseOnSelect
      } = latest.current;
      if (!currentMultiple) {
        emitSelection([node.value], node, 'select');
        if (currentCloseOnSelect) {
          openReasonRef.current = 'item-press';
          setOpen(false);
        } else {
          setQuery('');
        }
        return;
      }
      if (currentCascade) {
        const selecting = !current.includes(node.value);
        const next = applyCascadeSelection(
          currentIndex,
          current,
          node.value,
          selecting,
          currentIsSelectable
        );
        if (
          selecting &&
          currentMax != null &&
          next.length > currentMax &&
          next.length > current.length
        ) {
          announceNotice(currentLabels.maxReachedAnnouncement(currentMax));
          return;
        }
        emitSelection(next, node, selecting ? 'select' : 'deselect');
        const before = new Set(current);
        const after = new Set(next);
        let swept = 0;
        for (const entry of selecting ? next : current) {
          if (entry === node.value) continue;
          if (selecting ? !before.has(entry) : !after.has(entry)) swept += 1;
        }
        if (swept > 0) {
          announceNotice(
            currentLabels.cascadeAnnouncement(
              node.label ?? node.value,
              swept,
              selecting
            )
          );
        }
        setQuery('');
        return;
      }
      if (current.includes(node.value)) {
        emitSelection(
          current.filter((v) => v !== node.value),
          node,
          'deselect'
        );
      } else if (currentMax == null || current.length < currentMax) {
        emitSelection([...current, node.value], node, 'select');
      } else {
        announceNotice(currentLabels.maxReachedAnnouncement(currentMax));
      }
      setQuery('');
    },
    [emitSelection, setOpen, setQuery, announceNotice]
  );
  const handleComboboxValueChange = React.useCallback(
    (next, details) => {
      if (!multiple) {
        const node = Array.isArray(next) ? (next[0] ?? null) : next;
        if (node && isCascaderMoreNode(node)) {
          details.cancel();
          return;
        }
        if (node && !isSelectable(node) && isBranch(node)) {
          details.cancel();
          navigate(node);
          return;
        }
        if (node) {
          if (!closeOnSelect) details.cancel();
          commit(node);
        }
        return;
      }
      const nextNodes = Array.isArray(next) ? next : [];
      const before = new Set(selectedValues);
      const added = nextNodes.find((node) => !before.has(node.value));
      if (added && isCascaderMoreNode(added)) {
        details.cancel();
        return;
      }
      if (added && !isSelectable(added) && isBranch(added)) {
        details.cancel();
        navigate(added);
        return;
      }
      if (cascade) {
        const nextValues = new Set(nextNodes.map((node) => node.value));
        const removed = selectedValues.find((entry) => !nextValues.has(entry));
        const toggled =
          added ?? (removed != null ? resolveNode(removed) : null);
        if (toggled) commit(toggled);
        return;
      }
      if (
        max != null &&
        nextNodes.length > selectedValues.length &&
        nextNodes.length > max
      ) {
        details.cancel();
        announceNotice(labels.maxReachedAnnouncement(max));
        return;
      }
      setSelection(nextNodes.map((node) => node.value));
      setQuery('');
    },
    [
      multiple,
      selectedValues,
      max,
      cascade,
      closeOnSelect,
      labels,
      announceNotice,
      isSelectable,
      isBranch,
      navigate,
      commit,
      resolveNode,
      setSelection,
      setQuery
    ]
  );
  const handleOpenChange = React.useCallback(
    (nextOpen, details) => {
      if (details.isCanceled) return;
      if (!nextOpen && details.reason === 'escape-key' && hasOpenFlyout()) {
        details.cancel();
        return;
      }
      openReasonRef.current = details.reason ?? 'none';
      setOpen(nextOpen);
      if (!nextOpen) {
        setQuery('');
        return;
      }
      if (revealSelected) {
        setQuery('');
        const first = toArray(value)[0];
        setPathWithReason(
          first
            ? getCascaderPath(index, first)
                .slice(0, -1)
                .map((node) => node.value)
            : [],
          'reveal'
        );
      }
    },
    [
      setOpen,
      setQuery,
      revealSelected,
      value,
      index,
      setPathWithReason,
      hasOpenFlyout
    ]
  );
  const renderContext = React.useMemo(
    () => ({ renderItem, renderLabel }),
    [renderItem, renderLabel]
  );
  const { active: hasLoader, loadMore, retryLevel, prefetchNode } = loader;
  const actionsValue = React.useMemo(
    () => ({
      index,
      mode,
      multiple,
      cascade,
      branchesSelectable,
      indicator,
      expandTrigger,
      actions: resolvedActions,
      searchScope,
      maxHeight,
      inline: !!inline,
      invalid: !!invalid,
      disabled: !!disabled,
      baseId,
      labels,
      virtualized,
      registerVirtualRenderer,
      virtualize,
      virtualizeThreshold,
      estimateRowSize,
      overscan,
      hasLoader,
      loadMore,
      retryLevel,
      invalidateLevel,
      getIndex,
      getState,
      getHighlighted,
      setPath,
      pushLevel,
      popLevel,
      goToDepth,
      toggleExpanded,
      setFlyoutOpen,
      hasOpenFlyout,
      setQuery,
      setSelection,
      commit,
      navigate,
      navigateAt,
      resolveNode,
      isBranch,
      isSelectable,
      isSelected,
      isIndeterminate,
      selectedDescendantCount
    }),
    [
      index,
      mode,
      multiple,
      cascade,
      branchesSelectable,
      indicator,
      expandTrigger,
      resolvedActions,
      searchScope,
      maxHeight,
      inline,
      invalid,
      disabled,
      baseId,
      labels,
      virtualized,
      registerVirtualRenderer,
      virtualize,
      virtualizeThreshold,
      estimateRowSize,
      overscan,
      hasLoader,
      loadMore,
      retryLevel,
      invalidateLevel,
      getIndex,
      getState,
      getHighlighted,
      setPath,
      pushLevel,
      popLevel,
      goToDepth,
      toggleExpanded,
      setFlyoutOpen,
      hasOpenFlyout,
      setQuery,
      setSelection,
      commit,
      navigate,
      navigateAt,
      resolveNode,
      isBranch,
      isSelectable,
      isSelected,
      isIndeterminate,
      selectedDescendantCount
    ]
  );
  const comboboxItems = React.useMemo(
    () => (virtualized ? renderedItems.slice() : renderedItems),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [renderedItems, virtualized, virtualSyncs]
  );
  const comboboxValue = React.useMemo(() => {
    if (multiple) return selectedValues.map(resolveNode);
    return selectedValues.length ? resolveNode(selectedValues[0]) : null;
  }, [multiple, selectedValues, resolveNode]);
  return (
    // Providers store values with the item generic erased; the hooks re-apply
    // the caller's own `T` on the way back out.
    <CascaderActionsContext.Provider value={actionsValue}>
      <CascaderStateContext.Provider value={stateValue}>
        <CascaderHighlightContext.Provider value={highlightStore}>
          <CascaderRenderContext.Provider value={renderContext}>
            <ComboboxPrimitive.Root
              items={renderedItems}
              filteredItems={swapping ? EMPTY : comboboxItems}
              filter={null}
              value={comboboxValue}
              onValueChange={handleComboboxValueChange}
              open={open}
              onOpenChange={handleOpenChange}
              inputValue={query}
              onInputValueChange={(next) => setQuery(next)}
              multiple={multiple}
              disabled={disabled}
              name={name}
              {...(form != null ? { form } : null)}
              {...(id != null ? { id } : null)}
              {...(required != null ? { required } : null)}
              {...(readOnly != null ? { readOnly } : null)}
              {...(inputRef ? { inputRef } : null)}
              inline={inline}
              virtualized={virtualized}
              itemToStringValue={(item) => item?.value ?? ''}
              itemToStringLabel={(item) => item?.label ?? ''}
              isItemEqualToValue={(a, b) => a?.value === b?.value}
              onItemHighlighted={(item, details) => {
                highlightedRef.current = item ?? null;
                highlightStore.set({
                  index: details.index,
                  value: item?.value ?? null
                });
                prefetchNode(item);
              }}
            >
              {children}
            </ComboboxPrimitive.Root>
          </CascaderRenderContext.Provider>
        </CascaderHighlightContext.Provider>
      </CascaderStateContext.Provider>
    </CascaderActionsContext.Provider>
  );
}
function CascaderTrigger({
  className,
  children,
  showIcon = true,
  ref,
  ...props
}) {
  const { invalid } = useCascaderActions();
  const triggerRef = React.useRef(null);
  const setTrigger = React.useCallback(
    (node) => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const element = triggerRef.current;
    if (!element) return;
    const named =
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby') ||
      element.closest('label') !== null ||
      (element.id !== '' &&
        element.ownerDocument.querySelector(
          `label[for="${CSS.escape(element.id)}"]`
        ) !== null);
    if (named) return;
    warnCascaderOnce(
      'trigger-unnamed',
      "`CascaderTrigger` has no accessible name. Its contents are the field's VALUE - they change with the selection - so a screen reader hears what is picked but never what the field is for. Pass `aria-label` or `aria-labelledby`, or reference the trigger's `id` from a `<label>`."
    );
  });
  return (
    <ComboboxPrimitive.Trigger
      ref={setTrigger}
      data-slot='cascader-trigger'
      {...(invalid ? { 'aria-invalid': true, 'data-invalid': '' } : null)}
      className={cn(TRIGGER_ICON_FALLBACK_CLASS, className)}
      {...props}
    >
      {children}
      {showIcon ? (
        <RegistryIcon
          lucide='ChevronDownIcon'
          className={`${TRIGGER_ICON_CLASS} pointer-events-none shrink-0`}
        />
      ) : null}
    </ComboboxPrimitive.Trigger>
  );
}
const TRIGGER_ICON_CLASS = 'text-ui-muted-foreground size-4';
const TRIGGER_ICON_FALLBACK_CLASS = "[&_svg:not([class*='size-'])]:size-4";
const CHIPS_CLASS =
  'flex flex-wrap items-center border bg-clip-padding dark:bg-ui-input/30 border-ui-input focus-within:border-ui-ring focus-within:ring-ui-ring/50 has-aria-invalid:ring-ui-destructive/20 dark:has-aria-invalid:ring-ui-destructive/40 has-aria-invalid:border-ui-destructive dark:has-aria-invalid:border-ui-destructive/50 bg-transparent px-2.5 text-sm focus-within:ring-3 has-aria-invalid:ring-3 min-h-8 gap-1 rounded-lg py-1 transition-colors has-data-[slot=combobox-chip]:px-1';
const CHIP_CLASS =
  'text-ui-foreground flex w-fit items-center justify-center gap-1 font-medium whitespace-nowrap bg-ui-muted rounded-sm px-1.5 text-xs has-data-[slot=combobox-chip-remove]:pr-0 h-[calc(--spacing(5.25))]';
const CHIP_REMOVE_CLASS = 'opacity-50 hover:opacity-100 -ml-1';
const CONTENT_SURFACE_CLASS =
  'bg-ui-popover text-ui-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 overflow-hidden ring-1 duration-100 ring-ui-foreground/10 shadow-md rounded-lg data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2';
const EMPTY_CLASS =
  'text-ui-muted-foreground hidden w-full justify-center py-2 text-center group-data-empty/combobox-content:flex text-sm';
export function useCascaderAnchor() {
  return React.useRef(null);
}
function CascaderChips({
  className,
  children,
  placeholder,
  strategy = 'all',
  ...props
}) {
  const {
    labels,
    multiple,
    invalid,
    resolveNode,
    index,
    isSelectable,
    setSelection
  } = useCascaderActions();
  const { selectedValues } = useCascaderState();
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (multiple) return;
    warnCascaderOnce(
      'chips-without-multiple',
      '`CascaderChips` renders one chip per selection and there is only ever one without `multiple`. Use `CascaderValue` for a single-select trigger.'
    );
  }, [multiple]);
  const displayedValues =
    strategy === 'all'
      ? selectedValues
      : getCascaderCheckedValues(index, selectedValues, strategy);
  const nodes = displayedValues.map(resolveNode);
  const ambiguous = findAmbiguousCascaderLabels(nodes);
  const removeClosure = (node) => {
    setSelection(
      applyCascadeSelection(
        index,
        selectedValues,
        node.value,
        false,
        isSelectable
      ),
      'deselect'
    );
  };
  const content = typeof children === 'function' ? children(nodes) : children;
  return (
    <ComboboxPrimitive.Chips
      data-slot='cascader-chips'
      aria-label={labels.chipsLabel}
      {...(invalid ? { 'aria-invalid': true, 'data-invalid': '' } : null)}
      className={cn(CHIPS_CLASS, className)}
      {...props}
    >
      {content ??
        (nodes.length === 0 ? (
          <span
            data-slot='cascader-chips-placeholder'
            className='text-ui-muted-foreground truncate'
          >
            {placeholder}
          </span>
        ) : (
          nodes.map((node) => (
            <CascaderChip
              key={node.value}
              node={node}
              showPath={ambiguous.has(node.value)}
              {...(strategy !== 'all'
                ? { onRemove: () => removeClosure(node) }
                : null)}
            />
          ))
        ))}
    </ComboboxPrimitive.Chips>
  );
}
function CascaderChip({
  className,
  node,
  showPath = false,
  maxSegments = 2,
  showRemove = true,
  onRemove,
  children,
  ...props
}) {
  const { labels, index } = useCascaderActions();
  const chain = showPath ? getCascaderPath(index, node.value) : [];
  const segments = collapseCascaderPath(chain, {
    maxSegments,
    collapse: 'start'
  });
  const label = segments.length
    ? segments
        .map((segment) =>
          segment.type === 'node' ? segment.node.label : '\u2026'
        )
        .join(` ${labels.pathSeparator} `)
    : node.label;
  return (
    <ComboboxPrimitive.Chip
      data-slot='cascader-chip'
      {...(onRemove
        ? {
            onKeyDown: (event) => {
              if (event.key !== 'Backspace' && event.key !== 'Delete') return;
              event.preventBaseUIHandler();
              onRemove();
            }
          }
        : null)}
      className={cn(
        CHIP_CLASS,
        'has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children ?? <span className='truncate'>{label}</span>}
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          data-slot='cascader-chip-remove'
          aria-label={labels.removeChip(label)}
          {...(onRemove
            ? {
                onClick: (event) => {
                  event.preventBaseUIHandler();
                  onRemove();
                }
              }
            : null)}
          className={CHIP_REMOVE_CLASS}
        >
          <RegistryIcon lucide='XIcon' className='pointer-events-none' />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  );
}
function CascaderContent({
  className,
  side = 'bottom',
  sideOffset = 6,
  align = 'start',
  alignOffset = 0,
  anchor,
  collisionBoundary,
  collisionPadding,
  sticky,
  positionMethod,
  container,
  ref,
  ...props
}) {
  const { labels } = useCascaderActions();
  const popupRef = React.useRef(null);
  const setPopup = React.useCallback(
    (node) => {
      popupRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );
  const initialFocus = React.useCallback((openType) => {
    const popup = popupRef.current;
    if (!popup) return true;
    if (openType === 'touch') return popup;
    return popup.querySelector('[data-slot="cascader-input"]') ?? true;
  }, []);
  return (
    // Conditional spreads throughout: `mergeProps` iterates own keys, so an
    // explicit `undefined` reads as "deleted" rather than "not supplied".
    <ComboboxPrimitive.Portal
      {...(container !== void 0 ? { container } : null)}
    >
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        {...(collisionBoundary !== void 0 ? { collisionBoundary } : null)}
        {...(collisionPadding !== void 0 ? { collisionPadding } : null)}
        {...(sticky !== void 0 ? { sticky } : null)}
        {...(positionMethod !== void 0 ? { positionMethod } : null)}
        className='isolate z-50'
      >
        <ComboboxPrimitive.Popup
          ref={setPopup}
          data-slot='cascader-content'
          data-menu-target=''
          aria-label={labels.panelLabel}
          initialFocus={initialFocus}
          className={cn(
            CONTENT_SURFACE_CLASS,
            'group/combobox-content relative flex max-h-(--available-height) max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) flex-col',
            className
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}
function CascaderPanel({
  className,
  asChild = false,
  children,
  onKeyDown,
  ...props
}) {
  const { mode, disabled } = useCascaderActions();
  const Comp = asChild ? Slot.Root : 'div';
  const handleKeyDown = React.useCallback(
    (event) => {
      onKeyDown?.(event);
      if (event.key !== 'Tab' || event.defaultPrevented) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const panel = event.currentTarget;
      const target = event.target;
      if (!target || !panel.contains(target)) return;
      const next = getCascaderTabTarget(panel, target, event.shiftKey);
      if (!next) return;
      event.preventDefault();
      next.focus();
    },
    [onKeyDown]
  );
  return (
    <Comp
      data-slot='cascader-panel'
      data-mode={mode}
      {...(disabled ? { 'aria-disabled': true, 'data-disabled': '' } : null)}
      onKeyDown={handleKeyDown}
      className={cn(
        // Each part dims itself when disabled; the panel only blocks the pointer.
        'flex max-h-full min-h-0 w-full flex-col data-disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
function CascaderList({
  className,
  style,
  maxHeight: maxHeightProp,
  ...props
}) {
  const { maxHeight, mode, labels, baseId, virtualized } = useCascaderActions();
  const { currentParent } = useCascaderState();
  const resolved = maxHeightProp ?? maxHeight;
  return (
    <div
      data-slot='cascader-list-shell'
      style={
        resolved != null
          ? {
              ...style,
              '--cascader-max-height':
                typeof resolved === 'number' ? `${resolved}px` : resolved
            }
          : style
      }
      className={cn(
        'relative flex max-h-full min-h-0',
        CASCADER_LIST_PAD_CLASS
      )}
    >
      <div
        data-slot='cascader-list-bounds'
        className={cn(
          'flex w-full min-w-0 flex-col overscroll-contain',
          CASCADER_LIST_HEIGHT_CLASS
        )}
      >
        <ScrollArea className={CASCADER_SCROLL_CLASS}>
          <ComboboxPrimitive.List
            data-slot='cascader-list'
            aria-label={currentParent?.label ?? labels.rootLevel}
            id={`${baseId}-column-0`}
            {...(mode === 'tree' ? { role: 'tree' } : null)}
            {...(virtualized ? { 'data-virtualized': true } : null)}
            className={cn(
              CASCADER_ROWS_CLASS,
              /* A windowed row is absolutely positioned, so the ROWS' box is
         the containing block, not the scrollport: it carries the
         padding the geometry is measured against. */
              virtualized && 'relative',
              className
            )}
            {...props}
          />
        </ScrollArea>
      </div>
    </div>
  );
}
function CascaderEmpty({
  className,
  children,
  // Accepted and ignored; destructured so it is never spread onto the DOM.
  skeletonRows,
  ...props
}) {
  const { labels, retryLevel } = useCascaderActions();
  const { query, path, searchState } = useCascaderState();
  const levelKey = path.length ? path[path.length - 1] : CASCADER_ROOT_KEY;
  const loadState = useCascaderLoadState(levelKey);
  const state = query.trim() ? (searchState ?? loadState) : loadState;
  let body = children ?? labels.empty;
  if (state?.error) {
    body = (
      <span
        data-slot='cascader-error'
        className='flex flex-col items-center gap-1.5'
      >
        <span>{labels.error}</span>
        <button
          type='button'
          data-slot='cascader-retry'
          onClick={() => retryLevel(levelKey)}
          className='text-ui-foreground hover:bg-ui-accent focus-visible:ring-ui-ring/50 rounded-md px-2 py-0.5 font-medium outline-hidden transition-colors focus-visible:ring-2'
        >
          {labels.retry}
        </button>
      </span>
    );
  } else if (state?.loading) {
    body = (
      <span
        data-slot='cascader-loading'
        className='flex w-full items-center justify-center'
      >
        {labels.loading}
      </span>
    );
  }
  return (
    <ComboboxPrimitive.Empty
      data-slot='cascader-empty'
      data-state={state?.error ? 'error' : state?.loading ? 'loading' : 'empty'}
      className={cn(EMPTY_CLASS, className)}
      role={void 0}
      aria-live={void 0}
      aria-atomic={void 0}
      {...props}
    >
      {body}
    </ComboboxPrimitive.Empty>
  );
}
function CascaderStatus({ className, children, asChild = false, ...props }) {
  const { announcement } = useCascaderState();
  const asSlot = asChild && React.isValidElement(children);
  return (
    <ComboboxPrimitive.Status
      data-slot='cascader-status'
      className={cn('sr-only', className)}
      {...(asSlot ? { render: <Slot.Root /> } : null)}
      {...props}
    >
      {children ?? announcement}
    </ComboboxPrimitive.Status>
  );
}
export {
  Cascader,
  CascaderTrigger,
  CascaderChip,
  CascaderChips,
  CascaderContent,
  CascaderPanel,
  CascaderList,
  CascaderEmpty,
  CascaderStatus
};
export {
  createCascaderHighlightStore,
  useCascaderActions,
  useCascaderHighlight,
  useCascaderRender,
  useCascaderState
};
