// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import * as React from 'react';
import { useCascaderActions } from './cascader-context-extended.jsx';
import {
  CASCADER_ACTION_CLASS,
  CascaderGroup,
  CascaderLabel
} from './cascader-item-extended.jsx';
import {
  CASCADER_LIST_PAD_CLASS,
  getCascaderFooterStops,
  isCascaderRtl
} from './cascader-lib-extended.jsx';
import { Popover as PopoverPrimitive } from '@base-ui/react';
import { useDirection } from '@base-ui/react/direction-provider';
import { cn } from '../../../../utilities/cn/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const FOOTER_SWALLOWED_KEYS = /* @__PURE__ */ new Set([
  'Enter',
  ' ',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'PageUp',
  'PageDown'
]);
function CascaderFooter({ className, children, onKeyDown, ...props }) {
  const { actions, labels } = useCascaderActions();
  const hasChildren = React.Children.count(children) > 0;
  const handleKeyDown = React.useCallback(
    (event) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (!FOOTER_SWALLOWED_KEYS.has(event.key)) return;
      event.stopPropagation();
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const footer = event.currentTarget;
      const stops = getCascaderFooterStops(footer);
      const active = document.activeElement;
      const index = active ? stops.indexOf(active) : -1;
      if (index === -1) return;
      event.preventDefault();
      const next =
        event.key === 'ArrowDown' ? stops[index + 1] : stops[index - 1];
      if (next) {
        next.focus();
        return;
      }
      if (event.key === 'ArrowUp' && index > 0) return;
      footer
        .closest('[data-slot="cascader-panel"]')
        ?.querySelector('[data-slot="cascader-input"]')
        ?.focus();
    },
    [onKeyDown]
  );
  if (!hasChildren && actions.length === 0) return null;
  return (
    <div
      data-slot='cascader-footer'
      role='group'
      aria-label={labels.actionsLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        'border-ui-border/60 flex shrink-0 flex-col gap-0.5 border-t',
        /* The LIST's padding, not a flat `p-1`: with a padding of its own the
         two columns of text were 2px out in luma and sera and 4px out in
         lyra. It also gives a separator in here a number to cancel. */
        CASCADER_LIST_PAD_CLASS,
        'p-(--cascader-list-pad,4px)',
        className
      )}
      {...props}
    >
      {hasChildren ? children : <CascaderFooterActions actions={actions} />}
    </div>
  );
}
function CascaderFooterActions({ actions }) {
  return (
    <>
      {actions.map((action, i) =>
        action.items?.length ? (
          <CascaderSubmenu key={actionKey(action, i)}>
            <CascaderSubmenuTrigger
              icon={action.icon}
              disabled={action.disabled}
            >
              {action.label}
            </CascaderSubmenuTrigger>
            <CascaderSubmenuContent>
              <CascaderActionList items={action.items} />
            </CascaderSubmenuContent>
          </CascaderSubmenu>
        ) : (
          <CascaderAction
            key={actionKey(action, i)}
            icon={action.icon}
            disabled={action.disabled}
            onSelect={action.onSelect}
          >
            {action.label}
          </CascaderAction>
        )
      )}
    </>
  );
}
function actionKey(action, index) {
  if (action.value != null) return action.value;
  if (typeof action.label === 'string') return action.label;
  return String(index);
}
function groupActionRuns(items) {
  const runs = [];
  for (const item of items) {
    const last = runs[runs.length - 1];
    if (last && last.group === item.group) last.items.push(item);
    else runs.push({ group: item.group, items: [item] });
  }
  return runs;
}
function CascaderActionList({ items }) {
  const { close } = useCascaderSubmenu();
  const runs = React.useMemo(() => groupActionRuns(items), [items]);
  const renderAction = (item, i) => (
    <CascaderAction
      key={actionKey(item, i)}
      icon={item.icon}
      disabled={item.disabled}
      onSelect={() => {
        item.onSelect?.();
        close();
      }}
    >
      {item.label}
    </CascaderAction>
  );
  return (
    <>
      {runs.map((run, runIndex) =>
        run.group ? (
          <CascaderGroup key={`${run.group}-${runIndex}`} className='gap-0.5'>
            <CascaderLabel>{run.group}</CascaderLabel>
            {run.items.map(renderAction)}
          </CascaderGroup>
        ) : (
          <React.Fragment key={`run-${runIndex}`}>
            {run.items.map(renderAction)}
          </React.Fragment>
        )
      )}
    </>
  );
}
const FLYOUT_SURFACE_CLASS =
  'bg-ui-popover text-ui-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-72 overflow-hidden ring-1 duration-100 ring-ui-foreground/10 shadow-md rounded-lg';
function CascaderAction({
  className,
  icon,
  children,
  onSelect,
  onClick,
  onKeyDown,
  disabled: disabledProp,
  ...props
}) {
  const inMenu = React.useContext(CascaderMenuContext);
  const disabled = useCascaderActions().disabled || disabledProp;
  const handleClick = React.useCallback(
    (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
      if (event.defaultPrevented) return;
      onSelect?.();
    },
    [disabled, onClick, onSelect]
  );
  const handleKeyDown = React.useCallback(
    (event) => {
      if (disabled) {
        if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
        return;
      }
      onKeyDown?.(event);
    },
    [disabled, onKeyDown]
  );
  return (
    <button
      type='button'
      data-slot='cascader-action'
      {...(disabled ? { 'aria-disabled': true, 'data-disabled': '' } : null)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...(inMenu ? { role: 'menuitem', tabIndex: -1 } : null)}
      className={cn(CASCADER_ACTION_CLASS, className)}
      {...props}
    >
      {icon ? (
        <span
          data-slot='cascader-action-icon'
          className='text-ui-muted-foreground flex shrink-0 items-center justify-center'
        >
          {icon}
        </span>
      ) : null}
      <span className='min-w-0 flex-1 truncate text-start'>{children}</span>
    </button>
  );
}
const CascaderMenuContext = React.createContext(false);
function menuItems(popup) {
  if (!popup) return [];
  return Array.from(
    popup.querySelectorAll('[role="menuitem"]:not([disabled])')
  );
}
const CascaderSubmenuContext = React.createContext(void 0);
export function useCascaderSubmenu() {
  const context = React.useContext(CascaderSubmenuContext);
  if (!context) {
    throw new Error('useCascaderSubmenu must be used within a CascaderSubmenu');
  }
  return context;
}
function CascaderSubmenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children
}) {
  const { setFlyoutOpen } = useCascaderActions();
  const key = React.useId();
  const triggerId = React.useId();
  const rowRef = React.useRef(null);
  const keyboardRef = React.useRef(false);
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const setOpen = React.useCallback(
    (next) => {
      if (openProp == null) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );
  const close = React.useCallback(() => setOpen(false), [setOpen]);
  React.useEffect(() => {
    setFlyoutOpen(key, open);
    return () => setFlyoutOpen(key, false);
  }, [setFlyoutOpen, key, open]);
  const context = React.useMemo(
    () => ({ rowRef, open, setOpen, close, triggerId, keyboardRef }),
    [open, setOpen, close, triggerId]
  );
  return (
    <CascaderSubmenuContext.Provider value={context}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen} modal={false}>
        {children}
      </PopoverPrimitive.Root>
    </CascaderSubmenuContext.Provider>
  );
}
function CascaderSubmenuTrigger({
  className,
  icon,
  children,
  onKeyDown,
  onClick,
  disabled: disabledProp,
  ...props
}) {
  const { labels, disabled: rootDisabled } = useCascaderActions();
  const disabled = rootDisabled || disabledProp;
  const { rowRef, setOpen, triggerId, keyboardRef } = useCascaderSubmenu();
  const direction = useDirection();
  const handleClick = React.useCallback(
    (event) => {
      if (disabled) {
        event.preventDefault();
        event.preventBaseUIHandler();
        return;
      }
      onClick?.(event);
    },
    [disabled, onClick]
  );
  const handleKeyDown = React.useCallback(
    (event) => {
      if (disabled) {
        if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
        return;
      }
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const openKey = isCascaderRtl(event.currentTarget, direction)
        ? 'ArrowLeft'
        : 'ArrowRight';
      if (event.key === 'Enter' || event.key === ' ') {
        keyboardRef.current = true;
        return;
      }
      if (event.key !== openKey) return;
      event.preventDefault();
      keyboardRef.current = true;
      setOpen(true);
    },
    [disabled, onKeyDown, direction, setOpen, keyboardRef]
  );
  return (
    <PopoverPrimitive.Trigger
      ref={rowRef}
      id={triggerId}
      data-slot='cascader-submenu-trigger'
      aria-haspopup='menu'
      {...(disabled ? { 'aria-disabled': true, 'data-disabled': '' } : null)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        CASCADER_ACTION_CLASS,
        /* Painted while the flyout is open, as shadcn paints a SubTrigger.
         Keyed off `aria-expanded`, not shadcn's `data-[state=open]`: the
         popover trigger carries `aria-expanded` in both states. */
        'aria-expanded:bg-ui-accent aria-expanded:text-ui-accent-foreground',
        className
      )}
      {...props}
    >
      {icon ? (
        <span
          data-slot='cascader-action-icon'
          className='text-ui-muted-foreground flex shrink-0 items-center justify-center'
        >
          {icon}
        </span>
      ) : null}
      <span className='min-w-0 flex-1 truncate text-start'>{children}</span>
      {/* Nothing else says the row opens a MENU, not another tree level. */}
      <span className='sr-only'>, {labels.submenuAffordance}</span>
      <RegistryIcon
        lucide='ChevronRightIcon'
        aria-hidden='true'
        className='text-ui-muted-foreground -me-0.5 size-4 shrink-0 rtl:-scale-x-100'
      />
    </PopoverPrimitive.Trigger>
  );
}
function CascaderSubmenuContent({
  className,
  children,
  onKeyDown,
  side = 'inline-end',
  align = 'end',
  sideOffset = 8,
  alignOffset = 0,
  ...props
}) {
  const { rowRef, close, triggerId, keyboardRef } = useCascaderSubmenu();
  const direction = useDirection();
  const popupRef = React.useRef(null);
  const typeaheadRef = React.useRef({ buffer: '', at: 0 });
  const initialFocus = React.useCallback(() => {
    const byKeyboard = keyboardRef.current;
    keyboardRef.current = false;
    if (!byKeyboard) return true;
    return menuItems(popupRef.current)[0] ?? true;
  }, [keyboardRef]);
  const closeAndReturn = React.useCallback(() => {
    close();
    rowRef.current?.focus();
  }, [close, rowRef]);
  const handleKeyDown = React.useCallback(
    (event) => {
      onKeyDown?.(event);
      event.stopPropagation();
      if (event.defaultPrevented) return;
      const popup = popupRef.current;
      const items = menuItems(popup);
      if (items.length === 0) return;
      const active = document.activeElement;
      const index = active ? items.indexOf(active) : -1;
      const move = (next) => {
        event.preventDefault();
        items[(next + items.length) % items.length]?.focus();
      };
      const closeKey = isCascaderRtl(event.currentTarget, direction)
        ? 'ArrowRight'
        : 'ArrowLeft';
      switch (event.key) {
        case 'ArrowDown':
          return move(index + 1);
        case 'ArrowUp':
          return move(index === -1 ? items.length - 1 : index - 1);
        case 'Home':
          return move(0);
        case 'End':
          return move(items.length - 1);
        case closeKey:
          event.preventDefault();
          return closeAndReturn();
        case 'Tab':
          close();
          rowRef.current?.focus();
          return;
        default:
          break;
      }
      if (
        event.key.length !== 1 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      )
        return;
      const now = event.timeStamp;
      const state = typeaheadRef.current;
      state.buffer =
        now - state.at > 500 ? event.key : state.buffer + event.key;
      state.at = now;
      const prefix = state.buffer.toLowerCase();
      const from = index === -1 ? 0 : index;
      const ordered = [
        ...items.slice(state.buffer.length > 1 ? from : from + 1),
        ...items.slice(0, state.buffer.length > 1 ? from : from + 1)
      ];
      const hit = ordered.find((item) =>
        (item.textContent ?? '').trim().toLowerCase().startsWith(prefix)
      );
      if (hit) {
        event.preventDefault();
        hit.focus();
      }
    },
    [onKeyDown, direction, close, closeAndReturn, rowRef]
  );
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        anchor={rowRef}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className='isolate z-50'
      >
        <PopoverPrimitive.Popup
          ref={popupRef}
          initialFocus={initialFocus}
          data-slot='cascader-submenu-content'
          role='menu'
          aria-orientation='vertical'
          aria-labelledby={triggerId}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          data-menu-target=''
          className={cn(
            FLYOUT_SURFACE_CLASS,
            'flex max-w-(--available-width) min-w-48 flex-col gap-0.5 outline-hidden',
            CASCADER_LIST_PAD_CLASS,
            'p-(--cascader-list-pad,4px)',
            className
          )}
          {...props}
        >
          <CascaderMenuContext.Provider value={true}>
            {children}
          </CascaderMenuContext.Provider>
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}
export function useCascaderHasActions() {
  const { actions } = useCascaderActions();
  return actions.length > 0;
}
export {
  CascaderAction,
  CascaderFooter,
  CascaderSubmenu,
  CascaderSubmenuContent,
  CascaderSubmenuTrigger
};
