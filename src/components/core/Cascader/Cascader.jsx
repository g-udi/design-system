'use client';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import * as React from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { useCascaderLoader } from './hooks/useCascaderAsync.jsx';
import {
  CascaderActionsContext,
  CascaderHighlightContext,
  CascaderRenderContext,
  CascaderStateContext,
  useCascaderActions,
  useCascaderHighlight,
  useCascaderRender,
  useCascaderState
} from './CascaderContext.jsx';
import { createCascaderHighlightStore } from './cascaderHighlightStore.js';
import { resolveCascaderLabels } from './cascaderLabels.jsx';
import {
  buildCascaderIndex,
  CASCADER_ROOT_KEY,
  getCascaderIndeterminateFrom,
  getCascaderSelectedDescendants,
  isCascaderBranch,
  isCascaderSelectable,
  mergeCascaderIndex,
  warnCascaderOnce
} from './cascaderModel.jsx';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { shallowEqualRecords, shallowEqualItemLists, toArray } from './cascaderSelectionModel.js';
import { useCascaderDevWarnings } from './hooks/useCascaderWarnings.js';
import { CascaderTrigger, CascaderChips, CascaderChip } from './components/CascaderTrigger.jsx';
import {
  CascaderContent,
  CascaderPanel,
  CascaderList,
  CascaderEmpty,
  CascaderStatus
} from './components/CascaderPanel.jsx';
import { useCascaderCombobox } from './hooks/useCascaderCombobox.js';
import { useCascaderNavigation } from './hooks/useCascaderNavigation.js';
import { useCascaderAnnouncement } from './hooks/useCascaderAnnouncement.js';
import { useCascaderRows } from './hooks/useCascaderRows.js';
const EMPTY = [];
const EMPTY_ACTIONS = [];
function useControllable(controlled, defaultValue, onChange, devName) {
  const state = useControllableState({ value: controlled, defaultValue, onChange });
  const isControlled = controlled !== void 0;
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
  return state;
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
  const {
    resolveNode,
    currentParent,
    currentLevelKey,
    deepResults,
    levelItems,
    columns,
    treeRows,
    renderedItems,
    levelKey
  } = useCascaderRows({
    selectedValues,
    index,
    path,
    searchScope,
    query,
    mode,
    filter,
    loader,
    needsMoreRow,
    expanded
  });
  const [swap, setSwap] = React.useState({ key: levelKey, active: false });
  if (swap.key !== levelKey) {
    setSwap({ key: levelKey, active: true });
  }
  const swapping = swap.active && swap.key === levelKey;
  useIsomorphicLayoutEffect(() => {
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
  const openFlyoutsRef = React.useRef(new Set());
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
  const {
    announcement
  } = useCascaderAnnouncement({
    deepResults,
    query,
    filter,
    renderedItems,
    open,
    inline,
    announceSignal,
    mode,
    index,
    pendingNavigation,
    loadStates,
    searchLoadState,
    currentLoadState,
    labels,
    expanded,
    currentParent,
    path
  });
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
    disabled,
    readOnly,
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
      disabled,
      readOnly,
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
  const {
    navigateAt,
    navigate
  } = useCascaderNavigation({
    setPathWithReason,
    setQuery,
    bumpAnnouncement,
    latest,
    toggleExpanded,
    requestChildren,
    pushLevel,
    pendingNavigation,
    loadStates,
    setPendingNavigation,
    open,
    inline
  });
  const {
    setSelection,
    commit,
    handleComboboxValueChange,
    handleOpenChange
  } = useCascaderCombobox({
    latest,
    setValue,
    openReasonRef,
    setOpen,
    setQuery,
    announceNotice,
    multiple,
    isSelectable,
    isBranch,
    navigate,
    closeOnSelect,
    selectedValues,
    cascade,
    resolveNode,
    max,
    labels,
    hasOpenFlyout,
    revealSelected,
    value,
    setPathWithReason,
    index
  });
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
  useCascaderActions,
  useCascaderHighlight,
  useCascaderRender,
  useCascaderState
};
export { useCascader } from './hooks/useCascaderSelection.js';
export { useCascaderSelection } from './hooks/useCascaderSelection.js';
export { useCascaderAnchor } from './components/CascaderTrigger.jsx';
