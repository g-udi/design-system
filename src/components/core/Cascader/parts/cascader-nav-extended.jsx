// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import * as React from 'react';
import {
  useCascaderActions,
  useCascaderState
} from './cascader-context-extended.jsx';
import { resolveCascaderSearchLabel } from './cascader-i18n-extended.jsx';
import {
  collapseCascaderPath,
  getCascaderFooterStops,
  getCascaderPath,
  isCascaderRtl
} from './cascader-lib-extended.jsx';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { useDirection } from '@base-ui/react/direction-provider';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function PathChevron() {
  return (
    <RegistryIcon
      lucide='ChevronRightIcon'
      className='size-3 shrink-0 opacity-50 rtl:-scale-x-100'
    />
  );
}
function cascaderSlotChild(child, content) {
  if (!React.isValidElement(child)) return null;
  return React.cloneElement(child, void 0, content);
}
function CascaderNav({ className, asChild = false, children, ...props }) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='cascader-nav'
      className={cn(
        /* `py-1`, not `py-1.5`: the row inside sets its own per-style height,
         so even padding read too tall. 6px beside the field, 4px above and
         below. */
        'border-ui-border/60 flex shrink-0 flex-col gap-1 border-b px-1.5 py-1',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
function CascaderBack({ className, asChild = false, children, ...props }) {
  const { popLevel, labels, mode } = useCascaderActions();
  const { path } = useCascaderState();
  const hidden = mode !== 'drill' || path.length === 0;
  if (hidden) return null;
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      data-slot='cascader-back'
      type='button'
      aria-label={labels.back}
      onClick={() => popLevel()}
      className={cn(
        'text-ui-muted-foreground hover:bg-ui-accent hover:text-ui-accent-foreground focus-visible:ring-ui-ring/50 flex shrink-0 items-center justify-center rounded-md outline-hidden transition-colors focus-visible:ring-2',
        /* A notch under the row height: an affordance, not a second field. */
        'size-6',
        className
      )}
      {...props}
    >
      {children ?? (
        <RegistryIcon
          lucide='ChevronLeftIcon'
          className='size-4 rtl:-scale-x-100'
        />
      )}
    </Comp>
  );
}
function CascaderBreadcrumb({
  className,
  maxSegments = 3,
  collapse = 'middle',
  interactive = true,
  asChild = false,
  children,
  ...props
}) {
  const { goToDepth, mode, labels } = useCascaderActions();
  const { path, index } = useCascaderState();
  const nodes = path.map((value) => index.byValue.get(value)).filter(Boolean);
  const segments = collapseCascaderPath(nodes, { maxSegments, collapse });
  const currentValue = nodes.length ? nodes[nodes.length - 1].value : null;
  const hidden = mode !== 'drill' || nodes.length === 0;
  if (hidden) return null;
  const goTo = (node) => {
    const depth = path.indexOf(node.value);
    if (depth < 0) return;
    goToDepth(depth + 1);
  };
  const trail = segments.map((segment, i) => (
    <React.Fragment
      key={segment.type === 'node' ? segment.node.value : `gap-${i}`}
    >
      {i > 0 ? <PathChevron /> : null}
      {segment.type === 'ellipsis' ? (
        <span
          data-slot='cascader-breadcrumb-ellipsis'
          title={segment.hidden
            .map((n) => n.label)
            .join(` ${labels.pathSeparator} `)}
          className='shrink-0'
        >
          &hellip;
        </span>
      ) : interactive && segment.node.value !== currentValue ? (
        <button
          type='button'
          data-slot='cascader-breadcrumb-item'
          onClick={() => goTo(segment.node)}
          className='hover:text-ui-foreground focus-visible:ring-ui-ring/50 max-w-32 truncate rounded-sm outline-hidden transition-colors focus-visible:ring-2'
        >
          {segment.node.label}
        </button>
      ) : (
        <span
          data-slot='cascader-breadcrumb-item'
          {...(segment.node.value === currentValue
            ? { 'aria-current': 'page' }
            : null)}
          className={cn(
            'max-w-32 truncate',
            segment.node.value === currentValue &&
              'text-ui-foreground font-medium'
          )}
        >
          {segment.node.label}
        </span>
      )}
    </React.Fragment>
  ));
  const slotChild = asChild ? cascaderSlotChild(children, trail) : null;
  const shared = {
    'data-slot': 'cascader-breadcrumb',
    'aria-label': labels.breadcrumbLabel,
    className: cn(
      'text-ui-muted-foreground flex min-w-0 shrink-0 items-center gap-0.5 pt-1.5 pb-0.5 text-xs',
      // Lines up with the ROWS, not the header: each style's list padding plus
      // its row inset. vega/mira/rhea `p-1`+`pl-2`, nova `p-1`+`pl-1.5`, maia
      // `p-1`+`pl-3`, lyra `pl-2`, luma/sera `p-1.5`+`pl-3`, per style-*.css.
      'px-2.5',
      className
    ),
    ...props
  };
  return slotChild ? (
    <Slot.Root {...shared}>{slotChild}</Slot.Root>
  ) : (
    <nav {...shared}>{trail}</nav>
  );
}
function CascaderInput({
  className,
  showBack = true,
  placeholder,
  onKeyDown,
  'aria-describedby': ariaDescribedBy,
  ...props
}) {
  const {
    labels,
    popLevel,
    mode,
    getHighlighted,
    isBranch,
    navigate,
    index,
    toggleExpanded,
    inline,
    invalid,
    baseId
  } = useCascaderActions();
  const direction = useDirection();
  const { currentParent, query, path, renderedItems, treeRows } =
    useCascaderState();
  const resolvedPlaceholder =
    placeholder ?? resolveCascaderSearchLabel(labels, currentParent?.label);
  const backVisible = showBack && mode === 'drill' && path.length > 0;
  const hintId = `${baseId}-hint`;
  const listId = `${baseId}-column-${mode === 'columns' ? path.length : 0}`;
  const hintRef = React.useRef(null);
  const [hintDir, setHintDir] = React.useState('ltr');
  React.useLayoutEffect(() => {
    const hint = hintRef.current;
    if (!hint) return;
    setHintDir(isCascaderRtl(hint, direction) ? 'rtl' : 'ltr');
  }, [direction]);
  const moveHighlightTo = (field, targetIndex) => {
    const rowIndex = () => {
      const highlighted = getHighlighted();
      if (!highlighted) return -1;
      return treeRows.findIndex((row) => row.node.value === highlighted.value);
    };
    let current = rowIndex();
    for (let step = 0; step < treeRows.length; step += 1) {
      if (current === -1 || current === targetIndex) return;
      const key = current > targetIndex ? 'ArrowUp' : 'ArrowDown';
      field.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
      );
      const next = rowIndex();
      const progressed =
        key === 'ArrowUp'
          ? next < current && next >= targetIndex
          : next > current && next <= targetIndex;
      if (next === -1 || !progressed) return;
      current = next;
    }
  };
  const handleTreeKeyDown = (
    event,
    field,
    caretAtStart,
    caretAtEnd,
    forwardKey,
    backKey
  ) => {
    const forward = event.key === forwardKey;
    if (!forward && event.key !== backKey) return;
    if (forward ? !caretAtEnd : !caretAtStart) return;
    const highlighted = getHighlighted();
    if (!highlighted) return;
    const rowIndex = treeRows.findIndex(
      (row2) => row2.node.value === highlighted.value
    );
    if (rowIndex < 0) return;
    const row = treeRows[rowIndex];
    if (forward) {
      if (!row.branch) return;
      event.preventDefault();
      if (!row.expanded) {
        navigate(row.node);
        return;
      }
      const child = treeRows[rowIndex + 1];
      if (child && child.depth === row.depth + 1) {
        moveHighlightTo(field, rowIndex + 1);
      }
      return;
    }
    if (row.branch && row.expanded) {
      event.preventDefault();
      toggleExpanded(row.node.value);
      return;
    }
    const parentValue = index.parentOf.get(row.node.value);
    if (!parentValue) return;
    const parentIndex = treeRows.findIndex(
      (entry) => entry.node.value === parentValue
    );
    if (parentIndex < 0) return;
    event.preventDefault();
    moveHighlightTo(field, parentIndex);
  };
  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const field = event.currentTarget;
    const caretAtStart = field.selectionStart === 0 && field.selectionEnd === 0;
    const caretAtEnd =
      field.selectionStart === query.length &&
      field.selectionEnd === query.length;
    if (event.key === 'ArrowDown' && !event.altKey) {
      const rowCount = mode === 'tree' ? treeRows.length : renderedItems.length;
      const lastValue =
        mode === 'tree'
          ? treeRows[rowCount - 1]?.node.value
          : renderedItems[rowCount - 1]?.value;
      const highlighted = getHighlighted();
      const atEnd =
        rowCount === 0 ||
        (highlighted != null && highlighted.value === lastValue);
      if (atEnd) {
        const panel = field.closest('[data-slot="cascader-panel"]');
        const stop = panel ? getCascaderFooterStops(panel)[0] : void 0;
        if (stop) {
          event.preventDefault();
          stop.focus();
          return;
        }
      }
    }
    const rtl = isCascaderRtl(field, direction);
    const forwardKey = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backKey = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (mode === 'tree') {
      handleTreeKeyDown(
        event,
        field,
        caretAtStart,
        caretAtEnd,
        forwardKey,
        backKey
      );
      return;
    }
    if (event.key === forwardKey && caretAtEnd) {
      const highlighted = getHighlighted();
      if (highlighted && isBranch(highlighted)) {
        event.preventDefault();
        navigate(highlighted);
        return;
      }
    }
    if (
      (event.key === backKey && caretAtStart) ||
      (event.key === 'Backspace' && query.length === 0)
    ) {
      if (path.length > 0) {
        event.preventDefault();
        popLevel();
      }
    }
  };
  return (
    <div
      data-slot='cascader-input-row'
      className={cn(
        'flex shrink-0 items-center gap-1',
        /* Each style sizes a combobox search field only as a DIRECT child of
         the popup; this row is nested, so the ladder is mirrored here rather
         than hardcoding one height for all eight styles. */
        'h-8'
      )}
    >
      {showBack ? <CascaderBack /> : null}
      <ComboboxPrimitive.Input
        data-slot='cascader-input'
        placeholder={resolvedPlaceholder}
        onKeyDown={handleKeyDown}
        aria-describedby={[ariaDescribedBy, hintId].filter(Boolean).join(' ')}
        {...(mode === 'tree' ? { 'aria-haspopup': 'tree' } : null)}
        {...(inline
          ? { 'aria-expanded': true, 'aria-controls': listId }
          : null)}
        {...(invalid ? { 'aria-invalid': true, 'data-invalid': '' } : null)}
        className={cn(
          'placeholder:text-ui-muted-foreground h-full w-full min-w-0 flex-1 bg-transparent px-1.5 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          backVisible && 'ps-0',
          className
        )}
        {...props}
      />
      <span id={hintId} ref={hintRef} className='sr-only'>
        {/* `hintDir`, not `direction`: the context alone misses an RTL app that
       uses a `dir` attribute instead of `DirectionProvider`. */}
        {labels.keyboardHint(mode, hintDir)}
      </span>
    </div>
  );
}
function CascaderValue({
  className,
  display = 'path',
  maxSegments = 3,
  collapse = 'middle',
  separator,
  showIcon = true,
  placeholder,
  asChild = false,
  children,
  ...props
}) {
  const { labels, multiple, resolveNode } = useCascaderActions();
  const { index, selectedValues } = useCascaderState();
  const selected = selectedValues.map(resolveNode);
  const resolvedPath =
    selectedValues.length === 1
      ? getCascaderPath(index, selectedValues[0])
      : [];
  const path =
    resolvedPath.length > 0
      ? resolvedPath
      : selected.length === 1
        ? selected
        : [];
  const renderContent = typeof children === 'function' ? children : void 0;
  const slotElement = typeof children === 'function' ? void 0 : children;
  let content;
  if (renderContent) {
    content = renderContent(selected, path);
  } else if (selectedValues.length === 0) {
    content = (
      <span className='text-ui-muted-foreground truncate'>{placeholder}</span>
    );
  } else if (display === 'count' || (multiple && selectedValues.length > 1)) {
    content = labels.selectedCount(selectedValues.length);
  } else {
    const leaf = path[path.length - 1] ?? selected[0];
    const segments =
      display === 'leaf'
        ? [{ type: 'node', node: leaf }]
        : collapseCascaderPath(path, { maxSegments, collapse });
    content = (
      <>
        {showIcon && leaf?.icon ? (
          <span
            data-slot='cascader-value-icon'
            className='text-ui-muted-foreground flex shrink-0 items-center'
          >
            {leaf.icon}
          </span>
        ) : null}
        {segments.map((segment, i) => (
          <React.Fragment
            key={segment.type === 'node' ? segment.node.value : `gap-${i}`}
          >
            {i > 0 ? (separator ?? <PathChevron />) : null}
            {segment.type === 'ellipsis' ? (
              <span
                data-slot='cascader-value-ellipsis'
                title={segment.hidden
                  .map((n) => n.label)
                  .join(` ${labels.pathSeparator} `)}
                className='text-ui-muted-foreground shrink-0'
              >
                &hellip;
              </span>
            ) : (
              <span
                className={cn(
                  'truncate',
                  i < segments.length - 1 && 'text-ui-muted-foreground'
                )}
              >
                {segment.node?.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  }
  const slotChild = asChild ? cascaderSlotChild(slotElement, content) : null;
  const shared = {
    'data-slot': 'cascader-value',
    className: cn('flex min-w-0 items-center gap-1 truncate', className),
    ...props
  };
  return slotChild ? (
    <Slot.Root {...shared}>{slotChild}</Slot.Root>
  ) : (
    <span {...shared}>{content}</span>
  );
}
export {
  CascaderNav,
  CascaderBack,
  CascaderBreadcrumb,
  CascaderInput,
  CascaderValue
};
