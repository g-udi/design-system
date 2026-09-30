// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import * as React from 'react';
import { FiltersAdvanced } from './filters-advanced-extended.jsx';
import { FiltersBuilder } from './filters-builder-extended.jsx';
import { FilterChip } from './filters-chip-extended.jsx';
import {
  createFilterFocusStore,
  createFilterResolutionStore,
  createFilterRowStateStore,
  FilterActionsContext,
  filterControlSizes,
  FilterFocusContext,
  filterReadOnlyProps,
  FilterRenderContext,
  FilterRowStateProvider,
  FilterStateContext,
  isFilterLocked,
  useFilterActions,
  useFilterFocusStore,
  useFilterState
} from './filters-context-extended.jsx';
import {
  filterDraftReducer,
  isFilterDraftCommittable
} from './filters-draft-extended.jsx';
import {
  DEFAULT_FILTER_EDITORS,
  resolveFilterEditor
} from './filters-editors-extended.jsx';
import { resolveFilterLabels } from './filters-i18n-extended.jsx';
import {
  buildFilterIndex,
  computeFilterSchemaSignature,
  createFilterIdFactory,
  findFilterSchemaIssues,
  formatFilterPath,
  getFilterField,
  warnFilterOnce
} from './filters-lib-extended.jsx';
import {
  createFilterOperators,
  DEFAULT_FILTER_OPERATOR_LABELS,
  DEFAULT_FILTER_OPERATORS,
  getFilterOperator,
  negateFilterOperator,
  operatorTakesValue,
  resolveFilterOperators
} from './filters-operators-extended.jsx';
import {
  clearFilterQuery,
  copyFilterNodeTo,
  countFilterRules,
  createFilterGroup,
  createFilterQuery,
  createFilterRule,
  duplicateFilterNode,
  findFilterNode,
  findFilterRule,
  flattenFilterRules,
  insertFilterNode,
  isFilterRule,
  moveFilterNode,
  moveFilterNodeTo,
  removeFilterNode,
  setFilterCombinator,
  toggleFilterCombinator,
  unwrapFilterGroup,
  updateFilterRule,
  wrapFilterNodeInGroup
} from './filters-query-extended.jsx';
import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
const filtersBarVariants = cva(
  'flex min-w-0 max-w-full flex-wrap items-center',
  {
    variants: {
      // The rungs `FILTER_CONTROL_SIZES` holds, fed the RESOLVED rung at both
      // call sites, which is what keeps the two ladders in step: a cva default
      // only applies to a value nobody passed, so a raw `"lg"` reaching here
      // would leave the bar with no gap at all.
      size: {
        sm: 'gap-1.5',
        default: 'gap-2'
      }
    },
    defaultVariants: { size: 'default' }
  }
);
function useControllableQuery(controlled, uncontrolledDefault, onChange) {
  const isControlled = controlled !== void 0;
  const [internal, setInternal] = React.useState(
    () => uncontrolledDefault ?? createFilterQuery()
  );
  const query = isControlled ? controlled : internal;
  const queryRef = React.useRef(query);
  React.useEffect(() => {
    queryRef.current = query;
  });
  const setQuery = React.useCallback(
    (next, details) => {
      if (next === queryRef.current) return;
      queryRef.current = next;
      if (!isControlled) setInternal(next);
      onChange?.(next, details);
    },
    [isControlled, onChange]
  );
  return { query, queryRef, setQuery };
}
export function Filters({
  fields,
  query: controlledQuery,
  defaultQuery,
  onQueryChange,
  labels: labelsProp,
  operatorLabels: operatorLabelsProp,
  editors: editorsProp,
  variant = 'basic',
  advancedMode = 'popover',
  advancedAlign = 'start',
  reorderable = false,
  size = 'default',
  disabled = false,
  readOnly = false,
  onBeforeQueryChange,
  onConvertToAdvanced,
  menuClassName,
  fieldPickerClassName,
  pathCollapse = 'none',
  maxPathSegments = 3,
  trigger,
  showClear = false,
  renderValue,
  renderChip,
  renderEmpty,
  className,
  children
}) {
  const { query, queryRef, setQuery } = useControllableQuery(
    controlledQuery,
    defaultQuery,
    onQueryChange
  );
  const [draft, dispatchDraftRaw] = React.useReducer(filterDraftReducer, null);
  const [announced, setAnnounced] = React.useState({ seq: 0, text: '' });
  const announcement = announced.text;
  const setAnnouncement = React.useCallback((text) => {
    setAnnounced((prev) => ({ seq: prev.seq + 1, text }));
  }, []);
  const idSeed = React.useId();
  const nextId = React.useMemo(
    () => createFilterIdFactory(`${idSeed}f`),
    [idSeed]
  );
  const focusStore = React.useMemo(() => createFilterFocusStore(), []);
  const rowStateStore = React.useMemo(() => createFilterRowStateStore(), []);
  const resolutionStore = React.useMemo(
    () => createFilterResolutionStore(),
    []
  );
  const signature = computeFilterSchemaSignature(fields);
  const index = React.useMemo(
    () => buildFilterIndex(fields, null, signature),
    // Not `fields`: its identity changes every render at every real call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signature]
  );
  const labels = React.useMemo(
    () => resolveFilterLabels(labelsProp),
    [labelsProp]
  );
  const operatorCatalog = React.useMemo(() => {
    if (!operatorLabelsProp) return DEFAULT_FILTER_OPERATORS;
    return createFilterOperators({
      ...DEFAULT_FILTER_OPERATOR_LABELS,
      ...operatorLabelsProp
    });
  }, [operatorLabelsProp]);
  const editors = React.useMemo(
    () => ({ ...DEFAULT_FILTER_EDITORS, ...editorsProp }),
    [editorsProp]
  );
  const resolveOperators = React.useCallback(
    (field) => resolveFilterOperators(field, operatorCatalog),
    [operatorCatalog]
  );
  const ruleCount = React.useMemo(() => countFilterRules(query), [query]);
  const latest = React.useRef({
    index,
    labels,
    operatorCatalog,
    resolveOperators,
    draft,
    nextId,
    setQuery,
    queryRef,
    disabled,
    readOnly,
    onBeforeQueryChange
  });
  React.useEffect(() => {
    latest.current = {
      index,
      labels,
      operatorCatalog,
      resolveOperators,
      draft,
      nextId,
      setQuery,
      queryRef,
      disabled,
      readOnly,
      onBeforeQueryChange
    };
  });
  const locked = React.useCallback(
    () => disabled || readOnly || isFilterLocked(latest.current),
    [disabled, readOnly]
  );
  const emit = React.useCallback(
    (next, reason, rule) => {
      if (locked()) return false;
      const field = rule
        ? (getFilterField(latest.current.index, rule.path) ?? null)
        : null;
      const details = { reason, rule, field };
      if (latest.current.onBeforeQueryChange?.(next, details) === false) {
        return false;
      }
      latest.current.setQuery(next, details);
      return true;
    },
    [locked]
  );
  React.useEffect(() => {
    const { id } = focusStore.getSnapshot();
    if (!id || findFilterNode(query, id)) return;
    focusStore.set({ id: null, segment: null, autoOpen: false });
  }, [query, focusStore]);
  const addRule = React.useCallback(
    (rule, parentId) => {
      if (locked()) return;
      const next = insertFilterNode(
        latest.current.queryRef.current,
        rule,
        parentId
      );
      if (!emit(next, 'add', rule)) return;
      setAnnouncement(
        latest.current.labels.countAnnouncement(countFilterRules(next))
      );
    },
    [emit, locked, setAnnouncement]
  );
  const addGroup = React.useCallback(
    (parentId, combinator = 'or') => {
      if (locked()) return '';
      const id = latest.current.nextId();
      const next = insertFilterNode(
        latest.current.queryRef.current,
        createFilterGroup({ id, combinator }),
        parentId
      );
      if (!emit(next, 'add', null)) return '';
      setAnnouncement(latest.current.labels.groupAnnouncement(true));
      return id;
    },
    [emit, locked, setAnnouncement]
  );
  const updateRule = React.useCallback(
    (id, updates) => {
      if (locked()) return;
      const current = latest.current.queryRef.current;
      const next = updateFilterRule(current, id, updates);
      if (next === current) return;
      if ('path' in updates) rowStateStore.unmark(id);
      else if ('value' in updates) rowStateStore.mark(id);
      emit(next, 'update', findFilterRule(next, id));
    },
    [emit, locked, rowStateStore]
  );
  const removeNode = React.useCallback(
    (id) => {
      if (locked()) return;
      const current = latest.current.queryRef.current;
      const removed = findFilterRule(current, id);
      const next = removeFilterNode(current, id);
      if (next === current) return;
      if (!emit(next, 'remove', removed)) return;
      setAnnouncement(
        removed
          ? latest.current.labels.countAnnouncement(countFilterRules(next))
          : latest.current.labels.groupAnnouncement(false)
      );
    },
    [emit, locked, setAnnouncement]
  );
  const duplicateNode = React.useCallback(
    (id) => {
      if (locked()) return;
      const current = latest.current.queryRef.current;
      const next = duplicateFilterNode(current, id, latest.current.nextId);
      if (next === current) return;
      if (!emit(next, 'duplicate', findFilterRule(current, id))) return;
      setAnnouncement(
        latest.current.labels.countAnnouncement(countFilterRules(next))
      );
    },
    [emit, locked, setAnnouncement]
  );
  const negateRule = React.useCallback(
    (id) => {
      if (locked()) return;
      const current = latest.current.queryRef.current;
      const rule = findFilterRule(current, id);
      if (!rule) return;
      const field = getFilterField(latest.current.index, rule.path);
      if (!field) return;
      const operators = latest.current.resolveOperators(field);
      const flipped = negateFilterOperator(
        getFilterOperator(operators, rule.operator),
        operators,
        rule.negated
      );
      const next = updateFilterRule(current, id, {
        operator: flipped.operator ?? rule.operator,
        negated: flipped.negated || void 0
      });
      emit(next, 'negate', findFilterRule(next, id));
    },
    [emit, locked]
  );
  const announceReorder = React.useCallback(
    (next, id, fromParentId) => {
      const found = findFilterNode(next, id);
      if (!found || !found.parent) return;
      const label = isFilterRule(found.node)
        ? formatFilterPath(
            latest.current.index,
            found.node.path,
            latest.current.labels.pathSeparator
          )
        : found.node.combinator === 'and'
          ? latest.current.labels.groupAll
          : latest.current.labels.groupAny;
      const position = found.index + 1;
      const total = found.parent.rules.length;
      if (fromParentId && fromParentId !== found.parent.id) {
        const destination =
          found.parent.id === next.id
            ? latest.current.labels.filtersLabel
            : found.parent.combinator === 'and'
              ? latest.current.labels.groupAll
              : latest.current.labels.groupAny;
        setAnnouncement(
          latest.current.labels.moveAnnouncement(
            label,
            destination,
            position,
            total
          )
        );
        return;
      }
      setAnnouncement(
        latest.current.labels.reorderAnnouncement(label, position, total)
      );
    },
    [setAnnouncement]
  );
  const moveNode = React.useCallback(
    (id, delta) => {
      if (locked()) return;
      const current = latest.current.queryRef.current;
      const next = moveFilterNode(current, id, delta);
      if (next === current) return;
      if (!emit(next, 'reorder', findFilterRule(next, id))) return;
      announceReorder(next, id, null);
    },
    [emit, announceReorder, locked]
  );
  const moveNodeTo = React.useCallback(
    (id, parentId, index2) => {
      if (locked()) return;
      const current = latest.current.queryRef.current;
      const fromParentId = findFilterNode(current, id)?.parent?.id ?? null;
      const next = moveFilterNodeTo(current, id, parentId, index2);
      if (next === current) return;
      if (!emit(next, 'reorder', findFilterRule(next, id))) return;
      announceReorder(next, id, fromParentId);
    },
    [emit, announceReorder, locked]
  );
  const copyNodeTo = React.useCallback(
    (id, parentId, index2) => {
      if (locked()) return;
      const current = latest.current.queryRef.current;
      const next = copyFilterNodeTo(
        current,
        id,
        parentId,
        index2,
        latest.current.nextId
      );
      if (next === current) return;
      if (!emit(next, 'duplicate', findFilterRule(current, id))) return;
      setAnnouncement(
        latest.current.labels.countAnnouncement(countFilterRules(next))
      );
    },
    [emit, locked, setAnnouncement]
  );
  const wrapNodeInGroup = React.useCallback(
    (id, combinator = 'or') => {
      if (locked()) return;
      const current = latest.current.queryRef.current;
      const next = wrapFilterNodeInGroup(
        current,
        id,
        latest.current.nextId(),
        combinator
      );
      if (next === current) return;
      if (!emit(next, 'add', findFilterRule(next, id))) return;
      setAnnouncement(latest.current.labels.groupAnnouncement(true));
    },
    [emit, locked, setAnnouncement]
  );
  const unwrapGroup = React.useCallback(
    (groupId) => {
      if (locked()) return;
      const current = latest.current.queryRef.current;
      const next = unwrapFilterGroup(current, groupId);
      if (next === current) return;
      if (!emit(next, 'remove', null)) return;
      setAnnouncement(latest.current.labels.groupAnnouncement(false));
    },
    [emit, locked, setAnnouncement]
  );
  const announceCombinator = React.useCallback(
    (combinator) => {
      setAnnouncement(
        combinator === 'and'
          ? latest.current.labels.groupAll
          : latest.current.labels.groupAny
      );
    },
    [setAnnouncement]
  );
  const setCombinatorAction = React.useCallback(
    (groupId, combinator) => {
      if (locked()) return;
      const current = latest.current.queryRef.current;
      const next = setFilterCombinator(current, groupId, combinator);
      if (next === current) return;
      if (!emit(next, 'combinator', null)) return;
      announceCombinator(combinator);
    },
    [emit, locked, announceCombinator]
  );
  const toggleCombinatorAction = React.useCallback(
    (groupId) => {
      if (locked()) return;
      const current = latest.current.queryRef.current;
      const next = toggleFilterCombinator(current, groupId);
      if (next === current) return;
      if (!emit(next, 'combinator', null)) return;
      const group = findFilterNode(next, groupId)?.node;
      if (group && !isFilterRule(group)) announceCombinator(group.combinator);
    },
    [emit, locked, announceCombinator]
  );
  const clearQueryAction = React.useCallback(() => {
    if (locked()) return;
    const current = latest.current.queryRef.current;
    const next = clearFilterQuery(current);
    if (next === current) return;
    if (!emit(next, 'clear', null)) return;
    setAnnouncement(latest.current.labels.countAnnouncement(0));
  }, [emit, locked, setAnnouncement]);
  const announce = React.useCallback(
    (message) => {
      if (!message) return;
      setAnnouncement(message);
    },
    [setAnnouncement]
  );
  const dispatchDraft = React.useCallback(
    (action) => {
      if (action.type !== 'close' && locked()) return;
      dispatchDraftRaw(action);
    },
    [locked]
  );
  const openCreate = React.useCallback(() => {
    if (locked()) return;
    dispatchDraftRaw({ type: 'openCreate' });
  }, [locked]);
  const openAmend = React.useCallback(
    (id, step) => {
      if (locked()) return;
      const rule = findFilterRule(latest.current.queryRef.current, id);
      if (!rule) return;
      dispatchDraftRaw({
        type: 'openAmend',
        ruleId: id,
        step,
        path: rule.path,
        operator: rule.operator,
        value: rule.value
      });
    },
    [locked]
  );
  const closeDraft = React.useCallback(
    () => dispatchDraftRaw({ type: 'close' }),
    []
  );
  const getQuery = React.useCallback(() => latest.current.queryRef.current, []);
  const getDraft = React.useCallback(() => latest.current.draft, []);
  React.useEffect(() => {
    if (!draft || draft.status !== 'ready') return;
    if (!isFilterDraftCommittable(draft)) return;
    if (draft.ruleId) {
      updateRule(draft.ruleId, {
        path: draft.path,
        operator: draft.operator ?? '',
        value: draft.value
      });
    } else if (!locked()) {
      const id = nextId();
      addRule(
        createFilterRule({
          id,
          path: draft.path,
          // Empty on purpose: the chip renders "Select condition" and opens.
          operator: '',
          value: void 0
        })
      );
      focusStore.set({ id, segment: 'operator', autoOpen: true });
    }
    dispatchDraftRaw({ type: 'close' });
  }, [draft, addRule, updateRule, nextId, focusStore, locked]);
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const issues = findFilterSchemaIssues(fields, (field) =>
      resolveFilterOperators(field, operatorCatalog)
    );
    if (issues.duplicatePaths.length) {
      warnFilterOnce(
        `dup:${issues.duplicatePaths.join(',')}`,
        `duplicate sibling field ids are ignored after the first: ${issues.duplicatePaths.join(', ')}`
      );
    }
    if (issues.emptyIds.length) {
      warnFilterOnce('empty-id', 'every field needs a non-empty id');
    }
    if (issues.unknownDefaultOperators.length) {
      warnFilterOnce(
        `op:${issues.unknownDefaultOperators.join(',')}`,
        `defaultOperator names an operator the field does not offer: ${issues.unknownDefaultOperators.join(', ')}`
      );
    }
  }, [fields, operatorCatalog]);
  const actions = React.useMemo(
    () => ({
      index,
      labels,
      operatorCatalog,
      editors,
      size,
      disabled,
      readOnly,
      variant,
      menuClassName,
      fieldPickerClassName,
      convertToAdvanced: onConvertToAdvanced,
      pathCollapse,
      maxPathSegments,
      resolveOperators,
      // The same lookup the chrome uses, so a headless consumer can ask it too.
      resolveEditor: (field, operator) =>
        resolveFilterEditor(field, operator, editors),
      resolution: resolutionStore,
      addRule,
      addGroup,
      updateRule,
      removeNode,
      duplicateNode,
      negateRule,
      moveNode,
      moveNodeTo,
      copyNodeTo,
      wrapNodeInGroup,
      unwrapGroup,
      setCombinator: setCombinatorAction,
      toggleCombinator: toggleCombinatorAction,
      clearQuery: clearQueryAction,
      openCreate,
      openAmend,
      closeDraft,
      dispatchDraft,
      announce,
      getQuery,
      getDraft,
      nextId
    }),
    // Every input is memoized and every action `[]`-stable, so this
    // republishes on a real schema or config change, never on a keystroke.
    [
      index,
      labels,
      operatorCatalog,
      editors,
      size,
      disabled,
      readOnly,
      variant,
      menuClassName,
      fieldPickerClassName,
      onConvertToAdvanced,
      pathCollapse,
      maxPathSegments,
      resolveOperators,
      resolutionStore,
      addRule,
      addGroup,
      updateRule,
      removeNode,
      duplicateNode,
      negateRule,
      moveNode,
      moveNodeTo,
      copyNodeTo,
      wrapNodeInGroup,
      unwrapGroup,
      setCombinatorAction,
      toggleCombinatorAction,
      clearQueryAction,
      openCreate,
      openAmend,
      closeDraft,
      dispatchDraft,
      announce,
      getQuery,
      getDraft,
      nextId
    ]
  );
  const state = React.useMemo(
    () => ({
      query,
      draft,
      ruleCount,
      announcement,
      announcementSeq: announced.seq
    }),
    [query, draft, ruleCount, announcement, announced.seq]
  );
  const renderContext = React.useMemo(
    () => ({ renderValue, renderChip, renderEmpty }),
    [renderValue, renderChip, renderEmpty]
  );
  return (
    <FilterActionsContext.Provider value={actions}>
      <FilterStateContext.Provider value={state}>
        <FilterRenderContext.Provider value={renderContext}>
          <FilterRowStateProvider value={rowStateStore}>
            <FilterFocusContext.Provider value={focusStore}>
              {children ??
                (variant === 'advanced' ? (
                  <FiltersAdvanced
                    mode={advancedMode}
                    align={advancedAlign}
                    trigger={trigger}
                    reorderable={reorderable}
                    className={className}
                  />
                ) : (
                  <FiltersRow
                    trigger={trigger}
                    showClear={showClear}
                    className={className}
                  />
                ))}
            </FilterFocusContext.Provider>
          </FilterRowStateProvider>
        </FilterRenderContext.Provider>
      </FilterStateContext.Provider>
    </FilterActionsContext.Provider>
  );
}
export function FiltersRow({ trigger, showClear, className }) {
  const actions = useFilterActions();
  const sizes = filterControlSizes(actions);
  const { query, ruleCount, announcement, announcementSeq } = useFilterState();
  const focusStore = useFilterFocusStore();
  const rootRef = React.useRef(null);
  const locked = isFilterLocked(actions);
  const rules = React.useMemo(() => flattenFilterRules(query), [query]);
  const chips = () =>
    Array.from(
      rootRef.current?.querySelectorAll('[data-slot="filter-chip"]') ?? []
    );
  const onKeyDown = (event) => {
    const target = event.target.closest('[data-slot="filter-chip"]');
    if (!target) return;
    if (event.target !== target) return;
    const all = chips();
    const current = all.indexOf(target);
    if (current === -1) return;
    const rtl = getComputedStyle(target).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    const focusAt = (index) => {
      const next = all[Math.max(0, Math.min(index, all.length - 1))];
      if (!next) return;
      event.preventDefault();
      next.focus();
    };
    const ruleId = target.dataset.ruleId;
    if (!ruleId) return;
    if (event.altKey && (event.key === forward || event.key === backward)) {
      if (locked) return;
      event.preventDefault();
      actions.moveNode(ruleId, event.key === forward ? 1 : -1);
      return;
    }
    if (event.key === forward) return focusAt(current + 1);
    if (event.key === backward) return focusAt(current - 1);
    if (event.key === 'Home') return focusAt(0);
    if (event.key === 'End') return focusAt(all.length - 1);
    if (event.key === 'Backspace' || event.key === 'Delete') {
      if (locked) return;
      event.preventDefault();
      actions.removeNode(ruleId);
      requestAnimationFrame(() => {
        const remaining = chips();
        remaining[Math.min(current, remaining.length - 1)]?.focus();
      });
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      if (locked) return;
      event.preventDefault();
      const rule = findFilterRule(actions.getQuery(), ruleId);
      if (!rule) return;
      const field = getFilterField(actions.index, rule.path);
      if (!field) return;
      const operator = getFilterOperator(
        actions.resolveOperators(field),
        rule.operator
      );
      const segment =
        rule.operator && operatorTakesValue(operator) ? 'value' : 'operator';
      focusStore.set({ id: ruleId, segment, autoOpen: true });
    }
  };
  return (
    <div
      ref={rootRef}
      data-slot='filters'
      data-empty={rules.length === 0 || void 0}
      data-readonly={actions.readOnly || void 0}
      className={cn(
        /* `sizes.button` and not `actions.size`: the gap ladder and the control
         ladder must answer for the same rung, normalized in one place. */
        filtersBarVariants({ size: sizes.button }),
        /* An empty toolbar is still a flex child, so it took a gap with no
         width. The gap goes, not the toolbar, which owns the row's name. */
        rules.length === 0 && 'gap-0',
        className
      )}
    >
      <div
        role='toolbar'
        aria-label={actions.labels.filtersLabel}
        aria-orientation='horizontal'
        {...(actions.readOnly
          ? { 'aria-description': actions.labels.readOnly }
          : null)}
        className={cn(filtersBarVariants({ size: sizes.button }))}
        onKeyDown={onKeyDown}
      >
        {rules.map((rule, index) => (
          <FilterChip key={rule.id} rule={rule} index={index} />
        ))}
      </div>

      <FiltersBuilder trigger={trigger} />

      {showClear && ruleCount > 0 ? (
        // `ms-auto` and not `ml-auto`, so Clear stays on the trailing edge
        // under RTL, where the whole bar mirrors.
        <Button
          variant='outline'
          size={sizes.button}
          className='ms-auto'
          disabled={actions.disabled}
          {...filterReadOnlyProps(actions)}
          onClick={() => actions.clearQuery()}
        >
          {actions.labels.clear}
        </Button>
      ) : null}

      {/* Keyed on the sequence, so the same sentence twice is two
       announcements (see `announced` for the measurement). A replaced live
       element stops being watched. */}
      <div aria-live='polite' role='status' className='sr-only'>
        <span key={announcementSeq}>{announcement}</span>
      </div>
    </div>
  );
}
export {
  collectFilterIssues,
  copyFilterNodeTo,
  createFilterGroup,
  createFilterQuery,
  createFilterRule,
  countFilterRules,
  flattenFilterConditions,
  flattenFilterRules,
  isFilterQueryEmpty,
  isFilterRuleComplete,
  moveFilterNodeTo,
  pruneFilterQuery,
  unwrapFilterGroup,
  wrapFilterNodeInGroup
} from './filters-query-extended.jsx';
export {
  filterReadOnlyProps,
  isFilterLocked,
  useFilterActions,
  useFilterState,
  useFilterFocus,
  useFilterChipAutoOpen,
  useFilterChipFocused,
  useFilterFocusEmpty,
  useFilterFocusStore,
  useFilterRender,
  useFilterSegmentFocus
} from './filters-context-extended.jsx';
export {
  FilterChip,
  FilterOperatorPopover,
  FilterRuleMenuItems,
  FilterValuePopover,
  useFilterRuleDisplay
} from './filters-chip-extended.jsx';
export {
  FiltersAdvanced,
  FiltersAdvancedPanel,
  FilterAdvancedRow
} from './filters-advanced-extended.jsx';
export {
  FiltersBuilder,
  FilterFieldPicker
} from './filters-builder-extended.jsx';
export { DEFAULT_FILTER_LABELS } from './filters-i18n-extended.jsx';
export {
  DEFAULT_FILTER_OPERATORS,
  DEFAULT_FILTER_OPERATOR_LABELS
} from './filters-operators-extended.jsx';
export {
  DEFAULT_FILTER_EDITORS,
  useFilterOptions,
  useFilterValueResolution
} from './filters-editors-extended.jsx';
