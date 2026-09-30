'use client';
import * as React from 'react';
import {
  useCascaderActions,
  useCascaderRender,
  useCascaderState
} from './cascader-context-extended.jsx';
import {
  getCascaderCount,
  getCascaderMoreParent,
  getCascaderPath,
  isCascaderMoreNode
} from './cascader-lib-extended.jsx';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '../../../../utilities/cn/index.js';
import { Spinner } from '../../Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const ROW_INSET_CLASS = '[--cascader-row-inset:6px]';
const ROW_FLUSH_CLASS =
  'ps-[var(--cascader-row-inset,8px)]! pe-[var(--cascader-row-inset,8px)]!';
const ROW_GUTTER_CLASS =
  'ps-[var(--cascader-row-inset,8px)]! pe-[calc(var(--cascader-row-inset,8px)*2_+_16px)]!';
const INDICATOR_CLASS =
  'pointer-events-none absolute flex items-center justify-center size-4 end-[var(--cascader-row-inset,8px)]! rtl:right-auto!';
const ROW_THEME_CLASS =
  "data-highlighted:bg-ui-accent data-highlighted:text-ui-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-ui-accent-foreground [&_svg:not([class*='size-'])]:size-4 min-h-8 rounded-md py-1.5";
const ROW_GAP_CLASS = 'gap-2';
const ROW_TEXT_CLASS = 'text-sm';
const ROW_SHELL_CLASS = `${ROW_THEME_CLASS} relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 ${ROW_INSET_CLASS}`;
const ROW_CLASS = `${ROW_SHELL_CLASS} ${ROW_GAP_CLASS} ${ROW_TEXT_CLASS}`;
const CASCADER_ACTION_INSET_CLASS = `${ROW_INSET_CLASS} ${ROW_FLUSH_CLASS}`;
export const CASCADER_ACTION_CLASS = `${ROW_SHELL_CLASS} ${ROW_TEXT_CLASS} ${ROW_FLUSH_CLASS} hover:bg-ui-accent hover:text-ui-accent-foreground focus-visible:bg-ui-accent focus-visible:text-ui-accent-foreground cursor-pointer gap-2 transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50`;
const AFFORDANCE_BOX_CLASS =
  'flex size-5 shrink-0 items-center justify-center rounded-sm';
const AFFORDANCE_HOVER_CLASS =
  'transition-[background-color,box-shadow,color] hover:bg-ui-background hover:text-ui-foreground! hover:**:text-ui-foreground! hover:shadow-xs';
const CHECKBOX_MARK_CLASS =
  'text-ui-primary-foreground! **:text-ui-primary-foreground!';
const INDICATOR_MARK_CLASS = 'text-ui-foreground! **:text-ui-foreground!';
const CASCADER_HOVER_EXPAND_DELAY = 150;
const CascaderItem = React.memo(function CascaderItem2({
  node,
  index,
  depth,
  showPath = false,
  as = 'option',
  expanded,
  indent = 16,
  branch: branchProp,
  selectable: selectableProp,
  selected: selectedProp,
  indeterminate: indeterminateProp,
  selectedCount: selectedCountProp,
  loading,
  error,
  childrenLoading = false,
  childrenError = false,
  className,
  children,
  onClick,
  onMouseUp,
  style,
  ...props
}) {
  const {
    index: treeIndex,
    mode,
    labels,
    isBranch,
    isSelectable,
    isSelected,
    isIndeterminate,
    selectedDescendantCount,
    multiple,
    branchesSelectable,
    indicator: indicatorEnabled,
    expandTrigger = 'click',
    navigate,
    navigateAt,
    toggleExpanded,
    commit,
    virtualized,
    loadMore,
    retryLevel,
    disabled: rootDisabled
  } = useCascaderActions();
  const { renderItem, renderLabel } = useCascaderRender();
  // A disabled Cascader disables every option, not just the search input.
  const disabled = rootDisabled || !!node.disabled;
  const branch = branchProp ?? isBranch(node);
  const selectable = selectableProp ?? isSelectable(node);
  const selected = selectedProp ?? isSelected(node);
  const indeterminate =
    !selected && (indeterminateProp ?? isIndeterminate(node));
  const count = branch ? getCascaderCount(treeIndex, node) : 0;
  const nodeDepth = depth ?? treeIndex.depthOf.get(node.value) ?? 0;
  const selectedDescendants = branch
    ? (selectedCountProp ?? selectedDescendantCount(node))
    : 0;
  const showsSelectedCount = multiple && selectedDescendants > 0;
  const trailingCount = showsSelectedCount ? selectedDescendants : count;
  const showCount = trailingCount > 0;
  const leadingCheckbox = mode === 'tree' && multiple;
  const showsIndicator = indicatorEnabled || multiple;
  const veto = React.useCallback((event) => {
    event.preventBaseUIHandler?.();
  }, []);
  const handleClick = React.useCallback(
    (event) => {
      onClick?.(event);
      if (disabled) return;
      if (branch && !selectable) {
        veto(event);
        navigate(node);
      }
    },
    [onClick, node, disabled, branch, selectable, veto, navigate]
  );
  const handleMouseUp = React.useCallback(
    (event) => {
      onMouseUp?.(event);
      if (disabled) return;
      if (branch && !selectable) veto(event);
    },
    [onMouseUp, disabled, branch, selectable, veto]
  );
  const handleExpanderClick = React.useCallback(
    (event) => {
      event.stopPropagation();
      veto(event);
      if (disabled) return;
      if (expanded) toggleExpanded(node.value);
      else navigate(node);
    },
    [veto, node, disabled, expanded, toggleExpanded, navigate]
  );
  const handleExpanderMouseUp = React.useCallback(
    (event) => {
      event.stopPropagation();
      veto(event);
    },
    [veto]
  );
  const handleChevronClick = React.useCallback(
    (event) => {
      event.stopPropagation();
      veto(event);
      if (disabled) return;
      if (as === 'button') navigateAt(node, depth ?? 0);
      else navigate(node);
    },
    [veto, node, disabled, as, navigateAt, depth, navigate]
  );
  const handleChevronMouseUp = React.useCallback(
    (event) => veto(event),
    [veto]
  );
  const handleButtonMouseDown = React.useCallback((event) => {
    event.preventDefault();
  }, []);
  const handleButtonClick = React.useCallback(
    (event) => {
      onClick?.(event);
      if (disabled) return;
      if (branch && !selectable) {
        navigateAt(node, depth ?? 0);
        return;
      }
      if (selectable) commit(node);
    },
    [onClick, node, disabled, branch, selectable, navigateAt, depth, commit]
  );
  const handleMoreClick = React.useCallback(
    (event) => {
      onClick?.(event);
      veto(event);
      const parent = getCascaderMoreParent(node);
      if (parent == null) return;
      if (error) retryLevel(parent);
      else if (!loading) loadMore(parent);
    },
    [onClick, veto, node, error, loading, retryLevel, loadMore]
  );
  const hoverNavigates =
    expandTrigger === 'hover' &&
    mode === 'columns' &&
    as === 'option' &&
    branch &&
    !disabled;
  const hoverTimerRef = React.useRef(null);
  const cancelHoverNavigate = React.useCallback(() => {
    if (hoverTimerRef.current == null) return;
    window.clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = null;
  }, []);
  const handleHoverPointerEnter = React.useCallback(() => {
    cancelHoverNavigate();
    hoverTimerRef.current = window.setTimeout(() => {
      hoverTimerRef.current = null;
      navigate(node);
    }, CASCADER_HOVER_EXPAND_DELAY);
  }, [cancelHoverNavigate, navigate, node]);
  React.useEffect(() => {
    if (!hoverNavigates) cancelHoverNavigate();
  }, [hoverNavigates, cancelHoverNavigate]);
  React.useEffect(() => cancelHoverNavigate, [cancelHoverNavigate]);
  if (isCascaderMoreNode(node)) {
    const text = error
      ? labels.error
      : loading
        ? node.count
          ? labels.loadingMore
          : labels.loading
        : labels.loadMore;
    const moreStyle =
      mode === 'tree' && nodeDepth > 0
        ? {
            ...style,
            '--cascader-indent': `${nodeDepth * indent}px`
          }
        : style;
    const moreShared = {
      'data-slot': 'cascader-item',
      'data-more': '',
      'data-state': error ? 'error' : loading ? 'loading' : 'idle',
      'data-depth': nodeDepth,
      style: moreStyle,
      className: cn(
        ROW_SHELL_CLASS,
        ROW_FLUSH_CLASS,
        'text-ui-muted-foreground justify-center gap-1.5 text-xs',
        !error && !loading && 'hover:text-ui-foreground',
        mode === 'tree' &&
          'ps-[calc(var(--cascader-row-inset,8px)_+_var(--cascader-indent,0px))]!',
        className
      )
    };
    const moreBody = children ?? (
      <>
        {loading ? (
          <RegistryIcon
            lucide='LoaderCircleIcon'
            className='size-3.5 animate-spin'
            aria-hidden
          />
        ) : null}
        <span>{text}</span>
        {/* TEXT, not a button: a focusable element inside a `role="option"`
         row is a `nested-interactive` violation. */}
        {error ? (
          <span className='text-ui-foreground font-medium'>{labels.retry}</span>
        ) : null}
      </>
    );
    if (as === 'button') {
      const buttonProps = { ...props };
      delete buttonProps['aria-setsize'];
      delete buttonProps['aria-posinset'];
      delete buttonProps['aria-level'];
      return (
        <button
          type='button'
          {...moreShared}
          tabIndex={-1}
          onClick={handleMoreClick}
          {...buttonProps}
        >
          {moreBody}
        </button>
      );
    }
    return (
      <ComboboxPrimitive.Item
        {...moreShared}
        value={node}
        {...(virtualized && index != null ? { index } : null)}
        {...(mode === 'tree'
          ? { role: 'treeitem', 'aria-level': nodeDepth + 1 }
          : null)}
        onClick={handleMoreClick}
        onMouseUp={veto}
        {...props}
      >
        {moreBody}
      </ComboboxPrimitive.Item>
    );
  }
  const itemState = {
    branch,
    selected,
    disabled,
    depth: nodeDepth,
    count,
    path: showPath ? getCascaderPath(treeIndex, node.value).slice(0, -1) : []
  };
  const custom = renderItem?.(node, itemState);
  const customLabel = renderLabel?.(node, itemState);
  const srDetails = [
    branch ? labels.itemCount(count) : null,
    showsSelectedCount ? labels.selectedCount(selectedDescendants) : null,
    branch && mode !== 'tree' ? labels.branchAffordance : null,
    as === 'button' && selected ? labels.selectedState : null,
    // Option rows say this with `aria-checked="mixed"`; `role="button"` allows
    // neither that nor `aria-selected`, so a trail row says it in words.
    as === 'button' && indeterminate ? labels.partiallySelectedState : null
  ]
    .filter(Boolean)
    .map((detail) => `, ${detail}`)
    .join('');
  const checkbox = (
    <span
      data-slot='cascader-item-checkbox'
      className='border-ui-input in-data-[selected]:bg-ui-primary in-data-[selected]:border-ui-primary in-data-[selected]:text-ui-primary-foreground in-data-[indeterminate]:bg-ui-primary in-data-[indeterminate]:border-ui-primary in-data-[indeterminate]:text-ui-primary-foreground flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors'
    >
      {/* Colour declared ON THE ICON with `!`; see `CHECKBOX_MARK_CLASS`. */}
      {indeterminate ? (
        <RegistryIcon
          lucide='MinusIcon'
          data-slot='cascader-item-dash'
          className={cn(CHECKBOX_MARK_CLASS, 'size-3')}
        />
      ) : (
        <RegistryIcon
          lucide='CheckIcon'
          data-slot='cascader-item-tick'
          className={cn(
            CHECKBOX_MARK_CLASS,
            'size-3 opacity-0 in-data-[selected]:opacity-100'
          )}
        />
      )}
    </span>
  );
  const indicator = (
    <>
      {multiple ? (
        checkbox
      ) : (
        <RegistryIcon
          lucide='CheckIcon'
          data-slot='cascader-item-check'
          className={cn('pointer-events-none', INDICATOR_MARK_CLASS)}
        />
      )}
    </>
  );
  const body = custom ?? children ?? (
    <>
      {/* Tree mode expands in place, so the branch marker leads the row. */}
      {mode === 'tree' && branch ? (
        <span
          data-slot='cascader-item-expander'
          aria-hidden='true'
          data-state={
            childrenError ? 'error' : childrenLoading ? 'loading' : 'idle'
          }
          onClick={handleExpanderClick}
          onMouseUp={handleExpanderMouseUp}
          className={cn(
            '-ms-0.5',
            childrenError ? 'text-ui-destructive' : 'text-ui-muted-foreground',
            AFFORDANCE_BOX_CLASS,
            AFFORDANCE_HOVER_CLASS,
            childrenLoading && 'pointer-events-none'
          )}
        >
          {childrenLoading ? (
            <Spinner aria-hidden='true' className='size-4' />
          ) : childrenError ? (
            <RegistryIcon lucide='RotateCwIcon' className='size-4' />
          ) : (
            <RegistryIcon
              lucide='ChevronRightIcon'
              className={cn(
                'size-4 transition-transform',
                /* Collapsed it points INTO the level, so it mirrors; expanded
         it points DOWN, the same in both writing modes, so the mirror
         has to come off or `scaleX(-1)` composed with `rotate(90deg)`
         lands it pointing up. `rtl:rotate-90` beside `rotate-90` was
         a no-op that only looked like it handled this. */
                expanded ? 'rotate-90' : 'rtl:-scale-x-100'
              )}
            />
          )}
        </span>
      ) : mode === 'tree' ? (
        // A LEAF's expander slot, reserved and empty: without it a leaf's label
        // started 28px off its sibling branches' and read as one level up.
        <span
          data-slot='cascader-item-expander-spacer'
          aria-hidden='true'
          className={cn('-ms-0.5', AFFORDANCE_BOX_CLASS)}
        />
      ) : null}

      {/* Tree + multi-select: the box leads the row, and an unselectable row
       still reserves its width. */}
      {leadingCheckbox ? (
        selectable ? (
          checkbox
        ) : (
          <span
            data-slot='cascader-item-checkbox-spacer'
            aria-hidden='true'
            className='size-4 shrink-0'
          />
        )
      ) : null}

      {node.icon ? (
        <span
          data-slot='cascader-item-icon'
          className='text-ui-muted-foreground flex shrink-0 items-center justify-center'
        >
          {node.icon}
        </span>
      ) : null}

      {/* The row box is sized for pieces side by side; this one stacks, so it
       restates the gap: 8px reads as a paragraph break, not a subtitle. */}
      <span className='flex min-w-0 flex-1 flex-col items-start gap-0.5'>
        {customLabel ?? (
          <>
            <span className='w-full truncate text-start'>{node.label}</span>
            {node.description ? (
              <span
                data-slot='cascader-item-description'
                className='text-ui-muted-foreground w-full truncate text-start text-xs'
              >
                {node.description}
              </span>
            ) : null}
          </>
        )}
        {showPath ? <CascaderItemPath node={node} /> : null}
      </span>

      {/* The count is a bare number, and nothing else says a branch opens. */}
      {srDetails ? (
        <span data-slot='cascader-item-details' className='sr-only'>
          {srDetails}
        </span>
      ) : null}

      {/* Tree mode expands in place, so it has no drill-in chevron. */}
      {branch && mode !== 'tree' ? (
        <span
          data-slot='cascader-item-trailing'
          aria-hidden='true'
          className='text-ui-muted-foreground ms-auto flex shrink-0 items-center gap-1 text-xs tabular-nums'
        >
          {showCount ? (
            <span
              data-slot='cascader-item-count'
              {...(showsSelectedCount ? { 'data-selected-count': '' } : null)}
              className={cn(showsSelectedCount && 'text-ui-primary!')}
            >
              {trailingCount}
            </span>
          ) : null}
          {/* ONLY the chevron is the drill target: sharing a hit area with
       the count made a number pressable. */}
          <span
            data-slot='cascader-item-chevron'
            data-state={
              childrenError ? 'error' : childrenLoading ? 'loading' : 'idle'
            }
            onClick={selectable ? handleChevronClick : void 0}
            onMouseUp={selectable ? handleChevronMouseUp : void 0}
            onMouseDown={as === 'button' ? handleButtonMouseDown : void 0}
            className={cn(
              /* Cancels the box's outer slack, so the icon keeps its column. */
              '-me-0.5',
              AFFORDANCE_BOX_CLASS,
              selectable && AFFORDANCE_HOVER_CLASS,
              childrenError && 'text-ui-destructive',
              childrenLoading && 'pointer-events-none'
            )}
          >
            {childrenLoading ? (
              <Spinner aria-hidden='true' className='size-4' />
            ) : childrenError ? (
              <RegistryIcon lucide='RotateCwIcon' className='size-4' />
            ) : (
              <RegistryIcon
                lucide='ChevronRightIcon'
                className='size-4 rtl:-scale-x-100'
              />
            )}
          </span>
        </span>
      ) : null}

      {branch && mode === 'tree' && showCount ? (
        <span
          data-slot='cascader-item-count'
          {...(showsSelectedCount ? { 'data-selected-count': '' } : null)}
          aria-hidden='true'
          className={cn(
            'text-ui-muted-foreground ms-auto shrink-0 text-xs tabular-nums',
            showsSelectedCount && 'text-ui-primary!'
          )}
        >
          {trailingCount}
        </span>
      ) : null}

      {/* No trailing indicator when a tree's box led the row, or when
       `indicator={false}` opted out. See `showsIndicator`. */}
      {selectable && !leadingCheckbox && showsIndicator ? (
        as === 'button' ? (
          // No ItemIndicator outside Base UI: `data-selected` drives it.
          (multiple || selected) && (
            <span
              data-slot='cascader-item-indicator'
              className={INDICATOR_CLASS}
            >
              {indicator}
            </span>
          )
        ) : (
          <ComboboxPrimitive.ItemIndicator
            keepMounted={multiple || indeterminate}
            render={
              <span
                data-slot='cascader-item-indicator'
                className={INDICATOR_CLASS}
              />
            }
          >
            {indicator}
          </ComboboxPrimitive.ItemIndicator>
        )
      ) : null}
    </>
  );
  const rowStyle =
    mode === 'tree' && nodeDepth > 0
      ? {
          ...style,
          '--cascader-indent': `${nodeDepth * indent}px`
        }
      : style;
  const shared = {
    'data-slot': 'cascader-item',
    'data-branch': branch || void 0,
    'data-selected': selected || void 0,
    'data-indeterminate': indeterminate || void 0,
    'data-depth': nodeDepth,
    'data-expanded': expanded || void 0,
    // No `aria-level`: `role="option"` allows only `aria-selected`,
    // `aria-checked`, `aria-posinset` and `aria-setsize`, and a `role="button"`
    // trail row allows none of the four. Only tree mode has a role that takes a
    // level, and it adds one below.
    style: rowStyle,
    className: cn(
      ROW_CLASS,
      /* Three separate reasons to hand the check gutter back. A multi-select
         tree's box leads the row, so the gutter would be 24px of dead space;
         `indicator={false}` drops the check, and keeping the gutter would park
         the count and the chevron one gutter in from an edge nothing sits on;
         and for branches the question is per-LIST, not per-row, because the old
         `branch && !selectable` put neighbouring chevrons on 24px and 6px in
         nova. One `pe-*` is emitted either way, so nothing here depends on
         class-merge order. */
      leadingCheckbox || !showsIndicator || (branch && !branchesSelectable)
        ? ROW_FLUSH_CLASS
        : ROW_GUTTER_CLASS,
      /* ADDED to the style's own inset, never substituted: replacing it put
         depth 0 at 12px and depth 1 at 16px in maia, luma and sera, a 4px step.
         `_+_` because Tailwind's parser splits on whitespace. */
      mode === 'tree' &&
        'ps-[calc(var(--cascader-row-inset,8px)_+_var(--cascader-indent,0px))]!',
      className
    )
  };
  if (as === 'button') {
    const buttonProps = { ...props };
    delete buttonProps['aria-setsize'];
    delete buttonProps['aria-posinset'];
    delete buttonProps['aria-level'];
    return (
      <button
        type='button'
        {...shared}
        tabIndex={-1}
        disabled={disabled}
        aria-disabled={disabled || void 0}
        onClick={handleButtonClick}
        onMouseDown={handleButtonMouseDown}
        {...buttonProps}
      >
        {body}
      </button>
    );
  }
  return (
    <ComboboxPrimitive.Item
      {...shared}
      value={node}
      {...(virtualized && index != null ? { index } : null)}
      disabled={disabled}
      {...(mode === 'tree'
        ? {
            role: 'treeitem',
            'aria-level': nodeDepth + 1,
            ...(branch ? { 'aria-expanded': !!expanded } : null)
          }
        : branch
          ? { 'aria-haspopup': 'listbox' }
          : null)}
      {...(indeterminate ? { 'aria-checked': 'mixed' } : null)}
      {...(hoverNavigates
        ? {
            onPointerEnter: handleHoverPointerEnter,
            onPointerLeave: cancelHoverNavigate
          }
        : null)}
      onClick={handleClick}
      onMouseUp={handleMouseUp}
      {...props}
    >
      {body}
    </ComboboxPrimitive.Item>
  );
});
function CascaderItemPath({ node }) {
  const { index, labels } = useCascaderActions();
  const ancestors = getCascaderPath(index, node.value).slice(0, -1);
  if (!ancestors.length) return null;
  return (
    <span
      data-slot='cascader-item-path'
      className='text-ui-muted-foreground flex w-full items-center gap-0.5 truncate text-start text-xs'
    >
      {ancestors.map((ancestor, i) => (
        <React.Fragment key={ancestor.value}>
          {i > 0 ? (
            <span aria-hidden='true'>{labels.pathSeparator}</span>
          ) : null}
          <span className='truncate'>{ancestor.label}</span>
        </React.Fragment>
      ))}
    </span>
  );
}
export function getCascaderMoreProps(node, loadStates) {
  const parent = getCascaderMoreParent(node);
  if (parent == null) {
    const own = loadStates.get(node.value);
    return {
      loading: false,
      error: false,
      childrenLoading: !!own?.loading,
      childrenError: !!own?.error
    };
  }
  const state = loadStates.get(parent);
  return {
    loading: !!state?.loading,
    error: !!state?.error,
    childrenLoading: false,
    childrenError: false
  };
}
function CascaderItems({ children }) {
  const { mode, isBranch, isSelectable, isSelected, isIndeterminate } =
    useCascaderActions();
  const { renderedItems, deepResults, treeRows, loadStates } =
    useCascaderState();
  const showPath = deepResults !== null;
  if (mode === 'tree') {
    return (
      <>
        {treeRows.map((row, i) =>
          children ? (
            <React.Fragment key={row.node.value}>
              {children(row.node, i)}
            </React.Fragment>
          ) : (
            <CascaderItem
              key={row.node.value}
              node={row.node}
              depth={row.depth}
              expanded={row.expanded}
              branch={row.branch}
              selectable={isSelectable(row.node)}
              selected={isSelected(row.node)}
              indeterminate={isIndeterminate(row.node)}
              {...getCascaderMoreProps(row.node, loadStates)}
              aria-setsize={row.setSize}
              aria-posinset={row.posInSet}
            />
          )
        )}
      </>
    );
  }
  return (
    <>
      {renderedItems.map((node, i) =>
        children ? (
          <React.Fragment key={node.value}>{children(node, i)}</React.Fragment>
        ) : (
          <CascaderItem
            key={node.value}
            node={node}
            showPath={showPath}
            branch={isBranch(node)}
            selectable={isSelectable(node)}
            selected={isSelected(node)}
            indeterminate={isIndeterminate(node)}
            {...getCascaderMoreProps(node, loadStates)}
            aria-setsize={renderedItems.length}
            aria-posinset={i + 1}
          />
        )
      )}
    </>
  );
}
const CascaderGroupContext = React.createContext(false);
const CASCADER_LABEL_CLASS = `text-ui-muted-foreground text-xs py-1.5 ${CASCADER_ACTION_INSET_CLASS} block truncate`;
const CASCADER_SEPARATOR_CLASS =
  'h-px bg-ui-border my-1 mx-[calc(var(--cascader-list-pad,4px)*-1)]! shrink-0';
function CascaderGroup({ className, ...props }) {
  return (
    <CascaderGroupContext.Provider value={true}>
      <ComboboxPrimitive.Group
        data-slot='cascader-group'
        className={cn('flex flex-col', className)}
        {...props}
      />
    </CascaderGroupContext.Provider>
  );
}
function CascaderGroupLabel({ className, ...props }) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot='cascader-label'
      className={cn(CASCADER_LABEL_CLASS, className)}
      {...props}
    />
  );
}
function CascaderPlainLabel({ className, ...props }) {
  const defaultProps = {
    'data-slot': 'cascader-label',
    className: cn(CASCADER_LABEL_CLASS, className)
  };
  return useRender({
    defaultTagName: 'div',
    render: props.render,
    props: mergeProps(defaultProps, props)
  });
}
function CascaderLabel(props) {
  const grouped = React.useContext(CascaderGroupContext);
  return grouped ? (
    <CascaderGroupLabel {...props} />
  ) : (
    <CascaderPlainLabel {...props} />
  );
}
function CascaderSeparator({ className, ...props }) {
  return (
    <ComboboxPrimitive.Separator
      data-slot='cascader-separator'
      role='presentation'
      aria-hidden='true'
      className={cn(CASCADER_SEPARATOR_CLASS, className)}
      {...props}
    />
  );
}
export {
  CascaderGroup,
  CascaderItem,
  CascaderItems,
  CascaderLabel,
  CascaderSeparator
};
