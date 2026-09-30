// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import * as React from 'react';
import {
  useCascaderActions,
  useCascaderState
} from './cascader-context-extended.jsx';
import {
  CascaderItem,
  getCascaderMoreProps
} from './cascader-item-extended.jsx';
import {
  CASCADER_LIST_HEIGHT_CLASS,
  CASCADER_LIST_PAD_CLASS,
  CASCADER_ROOT_KEY,
  CASCADER_ROWS_CLASS,
  CASCADER_SCROLL_CLASS,
  warnCascaderOnce
} from './cascader-lib-extended.jsx';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cn } from '../../../../utilities/cn/index.js';
import { ScrollArea } from '../../ScrollArea/parts/scroll-area.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function CascaderColumns({
  className,
  columnWidth = 220,
  maxHeight: maxHeightProp,
  children,
  ...props
}) {
  const { maxHeight, mode, labels } = useCascaderActions();
  const { columns } = useCascaderState();
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (mode === 'columns') return;
    warnCascaderOnce(
      `columns-outside-columns-mode:${mode}`,
      `\`CascaderColumns\` renders nothing in \`mode="${mode}"\`, so \`columnWidth\` and everything else on it does nothing. Set \`mode="columns"\` on the root, or render \`CascaderList\` instead.`
    );
  }, [mode]);
  if (mode !== 'columns') return null;
  const height = maxHeightProp ?? maxHeight;
  const toCss = (value) => (typeof value === 'number' ? `${value}px` : value);
  return (
    <div
      data-slot='cascader-columns'
      role='group'
      aria-label={labels.columnsLabel}
      style={{
        '--cascader-column-width': toCss(columnWidth),
        /* Set only from an EXPLICIT cap: unset means "24rem or what the
         viewport leaves", via the `min()` fallback on the panel. A `?? 280`
         default here ignored short viewports and wasted tall ones. */
        ...(height != null ? { '--cascader-max-height': toCss(height) } : null)
      }}
      className={cn(
        /* `max-h-full` with `min-h-0`: the trail is the panel's shrinking
         child, and the columns inside it size against this box. */
        'flex max-h-full min-h-0 items-stretch overflow-x-auto overscroll-x-contain',
        CASCADER_LIST_PAD_CLASS,
        className
      )}
      {...props}
    >
      {columns.map((column) =>
        children ? (
          <React.Fragment key={column.depth}>{children(column)}</React.Fragment>
        ) : (
          <CascaderColumnPanel key={column.depth} column={column} />
        )
      )}
    </div>
  );
}
const PANEL_CLASS = `flex w-(--cascader-column-width) shrink-0 flex-col overscroll-contain not-first:w-[calc(var(--cascader-column-width)_+_1px)] not-first:border-ui-border/60 not-first:border-s ${CASCADER_LIST_HEIGHT_CLASS}`;
function CascaderColumnPanel({ column, children, virtualized }) {
  const {
    labels,
    baseId,
    isBranch,
    isSelectable,
    isSelected,
    isIndeterminate,
    retryLevel
  } = useCascaderActions();
  const { loadStates } = useCascaderState();
  const columnKey = column.parent?.value ?? CASCADER_ROOT_KEY;
  const loadState = loadStates.get(columnKey);
  let emptyBody = labels.empty;
  if (loadState?.error) {
    emptyBody = (
      <>
        {labels.error}{' '}
        <button
          type='button'
          data-slot='cascader-retry'
          onClick={() => retryLevel(columnKey)}
          className='text-ui-foreground hover:bg-ui-accent focus-visible:ring-ui-ring/50 rounded-md px-1 font-medium outline-hidden transition-colors focus-visible:ring-2'
        >
          {labels.retry}
        </button>
      </>
    );
  } else if (loadState?.loading) {
    emptyBody = (
      <span className='flex items-center gap-1.5'>
        <RegistryIcon
          lucide='LoaderCircleIcon'
          className='size-3.5 animate-spin'
          aria-hidden
        />
        {labels.loading}
      </span>
    );
  }
  const rows =
    column.items.length === 0 ? (
      <p
        data-slot='cascader-column-empty'
        data-state={
          loadState?.error ? 'error' : loadState?.loading ? 'loading' : 'empty'
        }
        className='text-ui-muted-foreground px-2 py-1.5 text-sm'
      >
        {emptyBody}
      </p>
    ) : (
      (children ??
      column.items.map((node, i) => {
        const open = node.value === column.activeValue;
        return (
          <CascaderItem
            key={node.value}
            node={node}
            as={column.active ? 'option' : 'button'}
            depth={column.depth}
            branch={isBranch(node)}
            selectable={isSelectable(node)}
            selected={isSelected(node)}
            indeterminate={isIndeterminate(node)}
            {...getCascaderMoreProps(node, loadStates)}
            data-open={open || void 0}
            className={
              open ? 'bg-ui-accent/60 text-ui-accent-foreground' : void 0
            }
            {...(column.active
              ? {
                  'aria-setsize': column.items.length,
                  'aria-posinset': i + 1
                }
              : null)}
            {...(!column.active && open
              ? {
                  'aria-expanded': true,
                  'aria-controls': `${baseId}-column-${column.depth + 1}`
                }
              : null)}
          />
        );
      }))
    );
  const shared = {
    'data-slot': 'cascader-column',
    'data-active': column.active || void 0,
    'data-depth': column.depth,
    // Addressable so the opening trail row can point `aria-controls` here, and
    // named even at the root, which has no parent label to borrow.
    id: `${baseId}-column-${column.depth}`,
    'aria-label': column.parent?.label ?? labels.rootLevel,
    // Conditional spread, never an explicit `undefined`: the active column is a
    // Base UI element, and its `mergeProps` iterates own keys.
    ...(virtualized ? { 'data-virtualized': true } : null)
  };
  const rowsClass = cn(CASCADER_ROWS_CLASS, virtualized && 'relative');
  const body = column.active ? (
    <ComboboxPrimitive.List {...shared} className={rowsClass}>
      {rows}
    </ComboboxPrimitive.List>
  ) : (
    // A named `group`, not a second listbox competing with the active column.
    <div {...shared} role='group' className={rowsClass}>
      {rows}
    </div>
  );
  return (
    <div
      data-slot='cascader-column-bounds'
      data-active={column.active || void 0}
      data-depth={column.depth}
      className={PANEL_CLASS}
    >
      <ScrollArea className={CASCADER_SCROLL_CLASS}>{body}</ScrollArea>
    </div>
  );
}
export { CascaderColumnPanel, CascaderColumns };
