'use client';
import { useIsomorphicLayoutEffect } from '../../../../hooks/state/use-isomorphic-layout-effect.js';
import * as React from 'react';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '../../NumberField/index.js';
import {
  Cascader,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus
} from '../../Cascader/Cascader.jsx';
import {
  useCascaderActions,
  useCascaderHighlight
} from '../../Cascader/CascaderContext.jsx';
import { CascaderFooter } from '../../Cascader/components/CascaderFooter.jsx';
import { CascaderItems } from '../../Cascader/components/CascaderItem.jsx';
import {
  CascaderInput,
  CascaderNav
} from '../../Cascader/components/CascaderNav.jsx';
import {
  FilterActionsContext,
  filterControlSizes
} from '../FiltersContext.jsx';
import {
  applyFilterExclusiveSelection,
  filterFilterOptions,
  joinFilterPath,
  normalizeFilterQuery,
  warnFilterOnce
} from '../filterModel.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { ButtonGroup } from '../../ButtonGroup/ButtonGroup.jsx';
import { FieldInput as Input } from '../../Field/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const IDLE = {
  items: [],
  loading: false,
  error: false,
  hasMore: false
};
const emptySubscribe = () => () => {};
const zeroVersion = () => 0;
function filterFieldKey(field, index) {
  if (!field) return null;
  if (index) {
    for (const entry of index.all) {
      if (entry.field === field) {
        return joinFilterPath(entry.path);
      }
    }
  }
  return `#${field.id}`;
}
export function useFilterOptions(field, enabled, debounceMs = 250) {
  const [query, setQueryState] = React.useState('');
  const [state, setState] = React.useState(IDLE);
  const cache = React.useRef(/* @__PURE__ */ new Map());
  const requestId = React.useRef(0);
  const abortRef = React.useRef(null);
  const actionsContext = React.useContext(FilterActionsContext);
  const shared = actionsContext?.resolution ?? null;
  const sharedKey = filterFieldKey(field, actionsContext?.index);
  React.useSyncExternalStore(
    shared ? shared.subscribe : emptySubscribe,
    shared ? shared.getVersion : zeroVersion,
    shared ? shared.getVersion : zeroVersion
  );
  const staticOptions = field?.options;
  const loadOptions = field?.loadOptions;
  const isAsync = Boolean(loadOptions);
  React.useEffect(() => {
    if (!staticOptions) return;
    for (const option of staticOptions) cache.current.set(option.value, option);
    if (shared && sharedKey) shared.set(sharedKey, staticOptions);
  }, [staticOptions, shared, sharedKey]);
  React.useEffect(() => {
    for (const option of state.items) cache.current.set(option.value, option);
    if (shared && sharedKey && state.items.length) {
      shared.set(sharedKey, state.items);
    }
  }, [state.items, shared, sharedKey]);
  const run = React.useCallback(
    async (nextQuery, cursor, append) => {
      if (!loadOptions) return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const id = ++requestId.current;
      setState((previous) => ({
        ...previous,
        loading: true,
        error: false,
        items: append ? previous.items : []
      }));
      try {
        const result = await loadOptions(nextQuery, {
          signal: controller.signal,
          cursor
        });
        if (controller.signal.aborted || id !== requestId.current) return;
        const normalized = Array.isArray(result) ? { items: result } : result;
        setState((previous) => ({
          items: append
            ? [...previous.items, ...normalized.items]
            : normalized.items,
          loading: false,
          error: false,
          hasMore: normalized.hasMore ?? Boolean(normalized.nextCursor),
          cursor: normalized.nextCursor
        }));
      } catch (error) {
        if (controller.signal.aborted || id !== requestId.current) return;
        if (error?.name === 'AbortError') return;
        setState((previous) => ({
          ...previous,
          loading: false,
          error: true,
          hasMore: false
        }));
      }
    },
    [loadOptions]
  );
  React.useEffect(() => {
    if (!enabled || !isAsync) return;
    const timer = setTimeout(() => void run(query, void 0, false), debounceMs);
    return () => {
      clearTimeout(timer);
      // Invalidate immediately, including while the next search is debouncing.
      requestId.current += 1;
      abortRef.current?.abort();
    };
  }, [enabled, isAsync, query, debounceMs, run]);
  React.useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);
  const normalizedQuery = normalizeFilterQuery(query);
  const items = React.useMemo(() => {
    if (isAsync) return state.items;
    return filterFilterOptions(staticOptions ?? [], normalizedQuery);
  }, [isAsync, state.items, staticOptions, normalizedQuery]);
  const setQuery = React.useCallback((next) => setQueryState(next), []);
  const loadMore = React.useCallback(() => {
    if (!state.hasMore || state.loading) return;
    void run(query, state.cursor, true);
  }, [state.hasMore, state.loading, state.cursor, query, run]);
  const retry = React.useCallback(() => {
    void run(query, void 0, false);
  }, [query, run]);
  const resolve = React.useCallback(
    (value) => {
      const declared = staticOptions?.find((option) => option.value === value);
      if (declared) return declared;
      const fromShared =
        shared && sharedKey ? shared.get(sharedKey, value) : void 0;
      if (fromShared) return fromShared;
      return cache.current.get(value);
    },
    [staticOptions, shared, sharedKey]
  );
  return {
    items,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    query,
    setQuery,
    loadMore,
    retry,
    resolve
  };
}
export function useFilterValueResolution(field, values) {
  const actionsContext = React.useContext(FilterActionsContext);
  const shared = actionsContext?.resolution ?? null;
  const sharedKey = filterFieldKey(field, actionsContext?.index);
  const resolveValues = field?.resolveValues;
  const staticOptions = field?.options;
  const valuesKey = values.map((entry) => String(entry)).join('\0');
  React.useEffect(() => {
    if (!resolveValues || !shared || !sharedKey || valuesKey === '') return;
    const missing = valuesKey.split('\0').filter((value) => {
      if (staticOptions?.some((option) => option.value === value)) return false;
      return shared.get(sharedKey, value) === void 0;
    });
    const wanted = shared.claim(sharedKey, missing);
    if (wanted.length === 0) return;
    void Promise.resolve(resolveValues(wanted)).then(
      (options) => shared.set(sharedKey, options),
      () => shared.release(sharedKey, wanted)
    );
  }, [resolveValues, shared, sharedKey, valuesKey, staticOptions]);
}
function EditorPanel({ children, className }) {
  return (
    <div
      data-slot='filter-editor'
      className={cn(
        'flex w-full flex-col gap-2 p-2',
        /* The list height cap as a VARIABLE, not the `maxHeight` prop, which
         becomes an inline style no consumer class can beat. 16rem is the
         256px the menu has always used. */
        '[--cascader-max-height:16rem]',
        className
      )}
    >
      {children}
    </div>
  );
}
function EditorFooter({ onCancel, onCommit, labels, host }) {
  const actions = React.useContext(FilterActionsContext);
  const sizes = filterControlSizes({ size: actions?.size ?? 'default' });
  if (host === 'create') return null;
  return (
    <div className='flex items-center justify-end gap-1.5 pt-1'>
      <Button variant='ghost' size={sizes.button} onClick={onCancel}>
        {labels.discard}
      </Button>
      <Button size={sizes.button} onClick={onCommit}>
        {labels.apply}
      </Button>
    </div>
  );
}
const EDITOR_FIELD_GROUP = 'w-full';
function EditorCommitButtons({ onCancel, onCommit, labels }) {
  return (
    <>
      <Button
        type='button'
        variant='outline'
        size='icon'
        aria-label={labels.apply}
        onClick={onCommit}
      >
        <RegistryIcon aria-hidden='true' lucide='CheckIcon' />
      </Button>
      <Button
        type='button'
        variant='outline'
        size='icon'
        aria-label={labels.discard}
        onClick={onCancel}
      >
        <RegistryIcon aria-hidden='true' lucide='XIcon' />
      </Button>
    </>
  );
}
function useCommitKeys(commit, cancel) {
  return React.useCallback(
    (event) => {
      if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
        event.preventDefault();
        commit();
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        cancel();
      }
    },
    [commit, cancel]
  );
}
export function FilterTextEditor({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  labels,
  host,
  field
}) {
  const onKeyDown = useCommitKeys(() => commit(), cancel);
  return (
    <EditorPanel
      className={cn('w-72 max-w-[calc(100vw-2rem)] min-w-0', field.className)}
    >
      <ButtonGroup className={EDITOR_FIELD_GROUP}>
        <Input
          {...autoFocusProps}
          value={value ?? ''}
          placeholder={field.placeholder ?? labels.valuePlaceholder}
          aria-label={field.label}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={onKeyDown}
        />
        {/*
        A lone input still belongs in the group: the per-style sheets re-round
        the LAST child, so a group with nothing fused draws the bare field.
      */}
        {host === 'create' ? null : (
          <EditorCommitButtons
            labels={labels}
            onCancel={cancel}
            onCommit={() => commit()}
          />
        )}
      </ButtonGroup>
    </EditorPanel>
  );
}
export function FilterNumberEditor({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  labels,
  host,
  field
}) {
  const onKeyDown = useCommitKeys(() => commit(), cancel);
  return (
    // Deliberately not the text editor's `w-72`: number values are short by
    // construction, and a wide box around "42" is the opposite defect.
    <EditorPanel className={cn('w-56 min-w-0', field.className)}>
      <ButtonGroup className={EDITOR_FIELD_GROUP}>
        <NumberField value={value ?? null} onValueChange={(next) => onValueChange(next ?? undefined)}>
          <NumberFieldGroup>
            <NumberFieldInput {...autoFocusProps} placeholder={field.placeholder} aria-label={field.label} onKeyDown={onKeyDown} />
          </NumberFieldGroup>
        </NumberField>
        {host === 'create' ? null : (
          <EditorCommitButtons
            labels={labels}
            onCancel={cancel}
            onCommit={() => commit()}
          />
        )}
      </ButtonGroup>
    </EditorPanel>
  );
}
export function FilterRangeEditor({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  labels,
  host,
  field
}) {
  const tuple = Array.isArray(value) ? value : [];
  const onKeyDown = useCommitKeys(() => commit(), cancel);
  const update = (index, value) => {
    const next = [tuple[0], tuple[1]];
    next[index] = value ?? undefined;
    onValueChange(next);
  };
  return (
    <EditorPanel>
      <div className='flex items-center gap-1.5'>
        <NumberField value={tuple[0] ?? null} onValueChange={(next) => update(0, next)}>
          <NumberFieldGroup>
            <NumberFieldInput {...autoFocusProps} aria-label={labels.rangeFrom(field.label)} onKeyDown={onKeyDown} />
          </NumberFieldGroup>
        </NumberField>
        <span className='text-ui-muted-foreground text-xs'>
          {labels.rangeSeparator}
        </span>
        <NumberField value={tuple[1] ?? null} onValueChange={(next) => update(1, next)}>
          <NumberFieldGroup>
            <NumberFieldInput aria-label={labels.rangeTo(field.label)} onKeyDown={onKeyDown} />
          </NumberFieldGroup>
        </NumberField>
      </div>
      <EditorFooter
        host={host}
        labels={labels}
        onCancel={cancel}
        onCommit={() => commit()}
      />
    </EditorPanel>
  );
}
const PIN_SEPARATOR = '\0';
const MAX_PIN_RESTORE_ATTEMPTS = 4;
function FilterMenuPinKeeper({ order, items }) {
  const { baseId } = useCascaderActions();
  const highlight = useCascaderHighlight();
  const previousRef = React.useRef(null);
  const pendingRef = React.useRef(null);
  const timerRef = React.useRef(null);
  const highlightedValue = highlight.value;
  const highlightedIndex = highlight.index;
  const stop = React.useCallback(() => {
    pendingRef.current = null;
    if (timerRef.current === null) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);
  const startRestore = React.useCallback(() => {
    const attempt = () => {
      timerRef.current = null;
      const pending = pendingRef.current;
      if (!pending) return;
      const target = pending.order.indexOf(pending.value);
      const rows = document
        .getElementById(`${baseId}-column-0`)
        ?.querySelectorAll('[data-slot="cascader-item"]');
      if (target < 0 || !rows || rows.length !== pending.order.length) {
        stop();
        return;
      }
      rows[target]?.dispatchEvent(
        new MouseEvent('mousemove', { bubbles: true })
      );
      pending.attempts += 1;
      if (pending.attempts >= MAX_PIN_RESTORE_ATTEMPTS) {
        stop();
        return;
      }
      timerRef.current = setTimeout(attempt, 0);
    };
    timerRef.current = setTimeout(attempt, 0);
  }, [baseId, stop]);
  useIsomorphicLayoutEffect(() => {
    const previous = previousRef.current;
    previousRef.current = { order, items };
    if (!previous || previous.order === order) return;
    if (previous.items !== items) return;
    if (!highlightedValue) return;
    if (isSameOrder(previous.order, order)) return;
    pendingRef.current = {
      value: highlightedValue,
      index: highlightedIndex,
      order,
      attempts: 0
    };
  });
  React.useEffect(() => {
    const pending = pendingRef.current;
    if (!pending) return;
    if (
      highlightedValue === pending.value ||
      highlightedIndex !== pending.index
    ) {
      stop();
      return;
    }
    if (pending.attempts > 0 || timerRef.current !== null) return;
    startRestore();
  }, [highlightedValue, highlightedIndex, startRestore, stop]);
  React.useEffect(() => stop, [stop]);
  return null;
}
function isSameOrder(a, b) {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return false;
  }
  return true;
}
export function FilterMenu({
  items,
  selected,
  multiple = false,
  onSelectionChange,
  labels,
  ariaLabel,
  searchPlaceholder,
  searchable = true,
  maxHeight,
  pinSelected = false,
  sortSelected = 'none',
  preFiltered = false,
  autoFocusProps,
  query,
  onQueryChange,
  state
}) {
  const liveKey = pinSelected ? selected.join(PIN_SEPARATOR) : '';
  const [snapshotKey] = React.useState(() => liveKey);
  const pinnedKey = !pinSelected
    ? ''
    : sortSelected === 'snapshot'
      ? snapshotKey
      : liveKey;
  const [ownQuery, setOwnQuery] = React.useState('');
  const currentQuery = query ?? ownQuery;
  const setQuery = onQueryChange ?? setOwnQuery;
  const partitioned = React.useMemo(() => {
    const pinned = new Set(pinnedKey ? pinnedKey.split(PIN_SEPARATOR) : []);
    const exclusive = items.filter((item) => item.exclusive);
    const values = exclusive.length
      ? items.filter((item) => !item.exclusive)
      : items;
    const chosen = pinned.size
      ? values.filter((item) => pinned.has(item.value))
      : [];
    const rest = pinned.size
      ? values.filter((item) => !pinned.has(item.value))
      : values;
    const ordered =
      sortSelected === 'label'
        ? [
            [...chosen].sort((a, b) => a.label.localeCompare(b.label)),
            [...rest].sort((a, b) => a.label.localeCompare(b.label)),
            [...exclusive].sort((a, b) => a.label.localeCompare(b.label))
          ]
        : [chosen, rest, exclusive];
    const rows = [...ordered[0], ...ordered[1], ...ordered[2]];
    return {
      chosenCount: chosen.length,
      /** Index of the first exclusive row, or -1 when the list has none. */
      exclusiveAt: exclusive.length ? rows.length - exclusive.length : -1,
      // The render order alone, so a REORDER is an identity compare.
      order: rows.map((item) => item.value),
      nodes: rows.map((item) => ({
        value: item.value,
        label: item.label,
        icon: item.icon,
        description: item.description,
        keywords: item.keywords,
        disabled: item.disabled,
        // Only exclusive rows carry `data`, so the ordinary 4,000 keep theirs.
        data: item.exclusive ? { exclusive: true } : void 0
      }))
    };
  }, [items, pinnedKey, sortSelected]);
  const dividerAt =
    partitioned.chosenCount && !currentQuery.trim()
      ? partitioned.chosenCount
      : -1;
  const exclusiveDividerAt = partitioned.exclusiveAt;
  const nodes = React.useMemo(() => {
    const total = partitioned.nodes.length;
    const marks = [dividerAt, exclusiveDividerAt].filter(
      (index) => index > 0 && index < total
    );
    if (marks.length === 0) return partitioned.nodes;
    const next = partitioned.nodes.slice();
    for (const index of marks) {
      next[index] = {
        ...next[index],
        data: { ...next[index].data, divider: true }
      };
    }
    return next;
  }, [partitioned, dividerAt, exclusiveDividerAt]);
  const renderItem = React.useCallback(
    (node, itemState) => (
      <>
        {node.data?.divider ? (
          <span
            data-slot='filter-menu-divider'
            aria-hidden='true'
            className='bg-ui-border absolute inset-x-[calc(var(--cascader-list-pad,4px)*-1)] -top-1 h-px'
          />
        ) : null}

        {node.icon ? (
          <span
            data-slot='filter-menu-icon'
            className='text-ui-muted-foreground flex shrink-0 items-center justify-center'
          >
            {node.icon}
          </span>
        ) : null}

        <span className='flex min-w-0 flex-1 flex-col items-start gap-0.5'>
          <span className='w-full truncate text-start'>{node.label}</span>
          {node.description ? (
            <span className='text-ui-muted-foreground w-full truncate text-start text-xs'>
              {node.description}
            </span>
          ) : null}
        </span>

        {/*
        What the aria-hidden rule says, for the people it does not reach.
        Inside the option element so it joins the row's accessible NAME, not
        an `aria-describedby`: a description is announced late or not at all,
        and this has to arrive before the press. The cascader's `srDetails`
        cannot either: `renderItem` replaces the row body. Empty copy renders
        nothing, so `labels.exclusiveHint` of "" silences it.
      */}
        {node.data?.exclusive && labels.exclusiveHint ? (
          <span data-slot='filter-menu-exclusive-hint' className='sr-only'>
            {`, ${labels.exclusiveHint}`}
          </span>
        ) : null}

        {/* A check mark in both modes, never the cascader's default box. */}
        {itemState.selected ? (
          <span
            data-slot='filter-menu-check'
            className='size-4 pointer-events-none absolute end-[var(--cascader-row-inset,8px)]! flex items-center justify-center rtl:right-auto!'
          >
            <RegistryIcon
              lucide='CheckIcon'
              className='text-ui-foreground! **:text-ui-foreground!'
            />
          </span>
        ) : null}
      </>
    ),
    [labels.exclusiveHint]
  );
  const cascaderLabels = React.useMemo(
    () => ({
      search: searchPlaceholder ?? labels.searchOptions,
      empty: labels.empty,
      loading: labels.loading,
      loadingMore: labels.loadingMore,
      loadMore: labels.loadMore,
      error: labels.error,
      retry: labels.retry,
      // Named after the field, not the cascader's own "Top level" wording.
      rootLevel: ariaLabel,
      panelLabel: ariaLabel,
      // Run FLAT, so the default hint would teach branch keys that do not exist.
      keyboardHint: () => '',
      // From `FilterLabels`, so the menu ships no English of its own.
      resultsAnnouncement: labels.resultsAnnouncement,
      actionsLabel: labels.actionsLabel
    }),
    [labels, ariaLabel, searchPlaceholder]
  );
  const actions = React.useMemo(() => {
    if (state?.error) {
      return [{ value: 'retry', label: labels.retry, onSelect: state.retry }];
    }
    if (state?.hasMore) {
      return [
        {
          value: 'load-more',
          label: state.loading ? labels.loadingMore : labels.loadMore,
          disabled: state.loading,
          onSelect: state.loadMore
        }
      ];
    }
    return [];
  }, [state, labels]);
  const shared = {
    // Inline and pinned open with a no-op handler, so the unconditional
    // `setOpen(false)` of a single-select commit cannot dismiss the popover.
    inline: true,
    open: true,
    onOpenChange: () => {},
    items: nodes,
    inputValue: currentQuery,
    onInputValueChange: setQuery,
    maxHeight,
    renderItem,
    labels: cascaderLabels,
    actions,
    // The option service is the ONE filter when it owns the query.
    ...(preFiltered ? { filter: () => true } : null)
  };
  const cascaderProps = multiple
    ? {
        ...shared,
        multiple: true,
        value: selected,
        onValueChange: (values) => onSelectionChange(values)
      }
    : {
        ...shared,
        value: selected[0] ?? '',
        onValueChange: (value) => onSelectionChange(value ? [value] : [])
      };
  return (
    <Cascader {...cascaderProps}>
      <CascaderPanel>
        {/*
      `searchable: false` hides the FIELD, never removes it: the input owns
      focus and `aria-activedescendant`, so a menu without one has no
      keyboard. The class goes on the nav so the strip's border goes too.
    */}
        <CascaderNav
          className={cn(
            /* The nav's divider is `border-ui-border/60` and the group separator
         is a full-opacity `bg-border`; two strengths read as a mistake. */
            'border-ui-border',
            !searchable && 'sr-only'
          )}
        >
          <CascaderInput
            {...(autoFocusProps ?? {})}
            placeholder={searchPlaceholder ?? labels.searchOptions}
            aria-label={ariaLabel}
          />
        </CascaderNav>
        <CascaderEmpty>
          {state?.error
            ? labels.error
            : state?.loading
              ? labels.loading
              : labels.empty}
        </CascaderEmpty>
        {/*
      Plain rows, DELIBERATELY not `CascaderVirtualItems`: windowing stands
      `FilterMenuPinKeeper` down. The long lists are async and PAGE 25.
    */}
        <CascaderList className='[&>[data-slot=cascader-item]:has([data-slot=filter-menu-divider])]:mt-2'>
          <CascaderItems />
        </CascaderList>
        <CascaderFooter />
        <CascaderStatus />
        {/*
      Last, so its layout effect reads the reordered DOM after every row has
      registered. Not mounted at all for a menu that cannot reorder.
    */}
        {pinSelected && sortSelected !== 'snapshot' ? (
          <FilterMenuPinKeeper order={partitioned.order} items={items} />
        ) : null}
      </CascaderPanel>
    </Cascader>
  );
}
function OptionEditor(props) {
  const {
    multiple,
    options,
    labels,
    autoFocusProps,
    commit,
    cancel,
    onValueChange,
    value,
    field
  } = props;
  const selected = React.useMemo(() => {
    if (value === void 0 || value === null) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);
  const announce = React.useContext(FilterActionsContext)?.announce;
  return (
    /*
      A DELIBERATELY narrow default: 12rem holds around 22 characters at every
      style's row size. `field.className` lands LAST, so a consumer's `w-*` wins.
    */
    <EditorPanel className={cn('w-48 min-w-0 gap-0 p-0', field.className)}>
      <FilterMenu
        items={options.items}
        selected={selected}
        multiple={multiple}
        onSelectionChange={(raw) => {
          const values = applyFilterExclusiveSelection(
            raw,
            selected,
            (value2) => Boolean(options.resolve(value2)?.exclusive)
          );
          if (values !== raw && announce) {
            const arrived = values.find((entry) => !selected.includes(entry));
            const cleared = raw.length - values.length;
            if (arrived !== void 0 && cleared > 0) {
              announce(
                labels.exclusiveAnnouncement(
                  options.resolve(arrived)?.label ?? arrived,
                  cleared
                )
              );
            }
          } else if (values === raw && raw.length > 1) {
            const hasNoneRow =
              options.items.some((item) => item.exclusive) ||
              Boolean(field.options?.some((option) => option.exclusive));
            const unresolved = hasNoneRow
              ? raw.find((entry) => options.resolve(entry) === void 0)
              : void 0;
            if (unresolved !== void 0) {
              warnFilterOnce(
                `exclusive-unresolved:${field.id}`,
                `field "${field.id}" has an exclusive option, but the value "${unresolved}" resolves to no option, so the None rule cannot tell whether it is the exclusive one and has left it in place. Declare the exclusive option in the field's \`options\` even when the rest of the list is async, or cover stored values with \`resolveValues\`.`
              );
            }
          }
          if (!multiple) {
            const next = values[0];
            if (next === void 0) {
              cancel();
              return;
            }
            onValueChange(next);
            commit(next);
            return;
          }
          onValueChange(values);
          commit(values, { close: false });
        }}
        labels={labels}
        ariaLabel={field.label}
        searchable={field.searchable ?? true}
        searchPlaceholder={field.placeholder}
        pinSelected={field.pinSelected ?? false}
        sortSelected={field.sortSelected}
        preFiltered
        query={options.query}
        onQueryChange={options.setQuery}
        state={options}
        autoFocusProps={autoFocusProps}
      />
    </EditorPanel>
  );
}
export function FilterSelectEditor(props) {
  return <OptionEditor {...props} multiple={false} />;
}
export function FilterMultiSelectEditor(props) {
  return <OptionEditor {...props} multiple />;
}
const BOOLEAN_ITEMS = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];
export function FilterBooleanEditor({
  value,
  onValueChange,
  commit,
  labels,
  autoFocusProps,
  field
}) {
  return (
    // Two words, and `field.className` lands last so a consumer's `w-*` wins.
    <EditorPanel className={cn('w-40 min-w-0 gap-0 p-0', field.className)}>
      <FilterMenu
        items={BOOLEAN_ITEMS}
        selected={value === true ? ['true'] : value === false ? ['false'] : []}
        onSelectionChange={(values) => {
          if (values.length === 0) return;
          const next = values[0] === 'true';
          onValueChange(next);
          commit(next);
        }}
        labels={labels}
        ariaLabel={field.label}
        searchable={false}
        autoFocusProps={autoFocusProps}
      />
    </EditorPanel>
  );
}
export const DEFAULT_FILTER_EDITORS = {
  text: FilterTextEditor,
  number: FilterNumberEditor,
  range: FilterRangeEditor,
  select: FilterSelectEditor,
  multiselect: FilterMultiSelectEditor,
  boolean: FilterBooleanEditor
};
export function resolveFilterEditor(field, operator, editors) {
  if (typeof field.editor === 'function') {
    return field.editor;
  }
  if (typeof field.editor === 'string') {
    const named = editors[field.editor];
    if (named) return named;
  }
  const arity = operator?.arity ?? 'one';
  if (arity === 'none') return void 0;
  if (arity === 'range') return editors.range;
  if (arity === 'many') {
    if (field.options || field.loadOptions) return editors.multiselect;
  }
  return editors[field.type ?? 'text'] ?? editors.text;
}
