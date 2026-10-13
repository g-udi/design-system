'use client';
import * as React from 'react';
import { useMergedRefs } from '../../../../hooks/state/use-merged-refs.js';
import { useCascaderLoadState } from '../hooks/useCascaderAsync.jsx';
import { useCascaderActions, useCascaderState } from '../CascaderContext.jsx';
import {
  CASCADER_LIST_HEIGHT_CLASS,
  CASCADER_LIST_PAD_CLASS,
  CASCADER_ROWS_CLASS,
  CASCADER_SCROLL_CLASS
} from '../cascaderStyles.js';
import { CASCADER_ROOT_KEY } from '../cascaderModel.jsx';
import { getCascaderTabTarget } from '../cascaderFocus.js';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { ScrollArea } from '../../ScrollArea/ScrollArea.jsx';
// Popover's surface without its inset and gap: the panel's parts own their spacing.
const CONTENT_SURFACE_CLASS =
  'ds-part-popover-content gap-0 overflow-hidden p-0 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2';
const EMPTY_CLASS =
  'text-ui-muted-foreground hidden w-full justify-center py-2 text-center group-data-empty/combobox-content:flex text-sm';
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
  const setPopup = useMergedRefs(popupRef, ref);
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
            'group/combobox-content relative flex transition-none max-h-(--available-height) max-w-(--available-width) min-w-[min(var(--anchor-width),var(--available-width))] origin-(--transform-origin) flex-col',
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
        <Button
          variant='ghost'
          tone='neutral'
          size='xs'
          data-slot='cascader-retry'
          onClick={() => retryLevel(levelKey)}
        >
          {labels.retry}
        </Button>
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
export { CascaderContent, CascaderPanel, CascaderList, CascaderEmpty, CascaderStatus };
