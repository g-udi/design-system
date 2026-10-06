'use client';
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../utilities/cn/index.js';
import { Slot } from 'radix-ui';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { useHotkey } from '../../../hooks/interaction/use-hotkey.js';
import { useIsMobile } from '../../../hooks/environment/use-mobile.js';
import { default as Button } from '../../core/Button/index.js';
import { FieldInput as Input } from '../../core/Field/index.js';
import { Separator } from '../../core/Separator/Separator.jsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '../../core/Sheet/Sheet.jsx';
import { Skeleton } from '../../core/Skeleton/SkeletonPrimitives.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../core/Tooltip/TooltipPrimitives.jsx';
import { Kbd, KbdGroup } from '../../core/Kbd/KbdPrimitives.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { useAppShellFrame } from './AppShellFrame.jsx';
import { useResolvedDirection } from '../../core/Direction/useResolvedDirection.js';
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';
const DEFAULT_SIDEBAR_LABELS = {
  expanded: 'Sidebar expanded',
  collapsed: 'Sidebar collapsed',
  toggle: 'Toggle Sidebar'
};
const readStoredOpen = (key) => {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? null : value === 'true';
  } catch {
    return null;
  }
};
const SidebarContext = React.createContext(null);
// The side the rail docks to, so collapsed-row tooltips open away from it (toward the inline end).
const SidebarSideContext = React.createContext('left');
// Internal: menus and tooltips beside the rail open toward the side away from it.
const useSidebarSide = () => React.useContext(SidebarSideContext);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}
/**
 * Holds the sidebar's expanded state. `storageKey` restores and saves the desktop state in
 * localStorage (after mount, so server markup stays stable); `shortcut` is the ⌘/Ctrl key that toggles
 * it (`false` turns it off); changes made by the shortcut or a trigger are announced politely.
 * Inside an `AppShellFrame` it fills the frame and takes its phone layout from the frame's width.
 */
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  storageKey,
  shortcut = SIDEBAR_KEYBOARD_SHORTCUT,
  labels: labelOverrides,
  defaultWidth,
  onWidthChange,
  className,
  style,
  children,
  ...props
}) {
  const labels = { ...DEFAULT_SIDEBAR_LABELS, ...labelOverrides };
  // A resizable sidebar (see SidebarResizeHandle) keeps its width here; without `defaultWidth` it stays at 16rem.
  const [width, _setWidth] = React.useState(defaultWidth);
  const [resizing, setResizing] = React.useState(false);
  const setWidth = React.useCallback(
    (value) => {
      _setWidth(value);
      onWidthChange?.(value);
    },
    [onWidthChange]
  );
  const frame = useAppShellFrame();
  const viewportMobile = useIsMobile();
  const isMobile = frame?.compact ?? viewportMobile;
  const framed = Boolean(frame);
  const [openMobile, setOpenMobile] = React.useState(false);
  React.useEffect(() => { if (!isMobile) setOpenMobile(false); }, [isMobile]);
  const [open, setOpenState] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: setOpenProp });
  const [announcement, setAnnouncement] = React.useState('');
  // The phone sheet has no Radix trigger, so remember what opened it and give focus back on close.
  const returnFocusRef = React.useRef(null);
  React.useEffect(() => {
    if (!storageKey || openProp !== undefined) return;
    const stored = readStoredOpen(storageKey);
    if (stored !== null) setOpenState(stored);
  }, [storageKey, openProp, setOpenState]);
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === 'function' ? value(open) : value;
      setOpenState(openState);
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, String(openState));
        } catch {
          // Storage can be unavailable (private mode); the state still applies for this visit.
        }
      }
    },
    [setOpenState, open, storageKey]
  );
  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      if (!openMobile) returnFocusRef.current = document.activeElement;
      return setOpenMobile((open2) => !open2);
    }
    setAnnouncement(open ? labels.collapsed : labels.expanded);
    return setOpen((open2) => !open2);
  }, [isMobile, open, openMobile, setOpen, setOpenMobile, labels.collapsed, labels.expanded]);
  useHotkey(`mod+${shortcut || SIDEBAR_KEYBOARD_SHORTCUT}`, toggleSidebar, { enabled: Boolean(shortcut) });
  const state = open ? 'expanded' : 'collapsed';
  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      shortcut,
      labels,
      returnFocusRef,
      framed,
      portalContainer: frame?.container ?? undefined,
      width,
      setWidth,
      resizing,
      setResizing
    }),
    // labels is rebuilt per render from stable inputs; its parts are the real dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, shortcut, labels.toggle, labels.expanded, labels.collapsed, framed, frame?.container, width, setWidth, resizing]
  );
  return (
    <SidebarContext.Provider value={contextValue}>
      {/* Rail tooltips and the trigger's shortcut hint work without a provider higher up. */}
      <TooltipProvider delayDuration={0}>
      <div
        data-slot='sidebar-wrapper'
        data-resizing={resizing ? 'true' : undefined}
        style={{
          '--sidebar-width': width === undefined ? SIDEBAR_WIDTH : typeof width === 'number' ? `${width}px` : width,
          '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
          ...style
        }}
        className={cn(
          'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-ui-sidebar',
          framed && 'relative h-full min-h-0 has-data-[variant=inset]:bg-transparent',
          className
        )}
        {...props}
      >
        {children}
        <span role='status' aria-live='polite' className='sr-only'>{announcement}</span>
      </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}
/**
 * The sidebar: docked beside the page, or a sheet on phones. `mobileWidth`, `mobileClassName`,
 * `mobileTitle` and `mobileDescription` size and name that sheet (for example a wider sheet that holds
 * a rail and a panel). `side` defaults to the inline start: left in left-to-right text, right in
 * right-to-left text (from `dir`, the document/ancestor `dir`, or DirectionProvider).
 */
function Sidebar(props) {
  const resolvedDir = useResolvedDirection(props.dir);
  const side = props.side ?? (resolvedDir === 'rtl' ? 'right' : 'left');
  return (
    <SidebarSideContext.Provider value={side}>
      <SidebarPanel {...props} side={side} />
    </SidebarSideContext.Provider>
  );
}
function SidebarPanel({
  side,
  variant = 'sidebar',
  collapsible = 'offcanvas',
  mobileWidth = SIDEBAR_WIDTH_MOBILE,
  mobileTitle = 'Sidebar',
  mobileDescription = 'Displays the mobile sidebar.',
  mobileClassName,
  className,
  children,
  dir,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile, returnFocusRef, framed, portalContainer } = useSidebar();
  if (collapsible === 'none') {
    return (
      <div
        data-slot='sidebar'
        className={cn(
          'flex h-full w-(--sidebar-width) flex-col bg-ui-sidebar text-ui-sidebar-foreground',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          container={portalContainer}
          dir={dir}
          data-sidebar='sidebar'
          data-slot='sidebar'
          data-mobile='true'
          className={cn('w-(--sidebar-width) max-w-[85%] bg-ui-sidebar p-0 text-ui-sidebar-foreground [&>button]:hidden', mobileClassName)}
          style={{
            '--sidebar-width': mobileWidth
          }}
          side={side}
          onCloseAutoFocus={(event) => {
            const target = returnFocusRef.current;
            returnFocusRef.current = null;
            if (target?.isConnected) {
              event.preventDefault();
              target.focus();
            }
          }}
        >
          <SheetHeader className='sr-only'>
            <SheetTitle>{mobileTitle}</SheetTitle>
            <SheetDescription>{mobileDescription}</SheetDescription>
          </SheetHeader>
          <div className='flex h-full w-full flex-col'>{children}</div>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <div
      className={cn('group peer hidden text-ui-sidebar-foreground md:block', framed && 'block')}
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot='sidebar'
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot='sidebar-gap'
        className={cn(
          'ds-part-sidebar-gap relative w-(--sidebar-width) bg-transparent',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
        )}
      />
      <div
        data-slot='sidebar-container'
        data-side={side}
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : cn(
                'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
                // In a frame the panel draws the seam, so a docked rail needs no border of its own.
                !framed && 'group-data-[side=left]:border-r group-data-[side=right]:border-l'
              ),
          // In a frame the rail is positioned against the window instead of the viewport.
          framed && 'absolute flex h-full',
          className
        )}
        {...props}
      >
        <div
          data-sidebar='sidebar'
          data-slot='sidebar-inner'
          className='ds-part-sidebar-inner flex size-full flex-col'
        >
          {children}
        </div>
      </div>
    </div>
  );
}
/**
 * Toggles the sidebar. It reports `aria-expanded` and its keyboard shortcut, and `tooltip` shows the
 * label with the shortcut keys (on by default when a shortcut is set).
 */
function SidebarTrigger({ className, onClick, label, tooltip = true, ...props }) {
  const { toggleSidebar, isMobile, open, openMobile, shortcut, labels } = useSidebar();
  const name = label || labels.toggle;
  const trigger = (
    <Button
      data-sidebar='trigger'
      data-slot='sidebar-trigger'
      variant='ghost'
      size='icon-sm'
      aria-expanded={isMobile ? openMobile : open}
      aria-keyshortcuts={shortcut ? `Meta+${shortcut.toUpperCase()} Control+${shortcut.toUpperCase()}` : undefined}
      className={cn('ds-part-sidebar-trigger', className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggleSidebar();
      }}
      {...props}
    >
      <RegistryIcon lucide='PanelLeftIcon' className='ds-part-rtl-flip' />
      <span className='sr-only'>{name}</span>
    </Button>
  );
  // Phones have no shortcut to teach, and the sheet focuses the trigger as it opens.
  if (!tooltip || !shortcut || isMobile) return trigger;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side='bottom' className='flex items-center gap-2'>
        {name}
        <KbdGroup aria-hidden='true'>
          <Kbd>⌘</Kbd>
          <Kbd>{shortcut.toUpperCase()}</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
}
/** Optional pointer-only strip on the sidebar edge; pair it with a header SidebarTrigger. */
function SidebarRail({ className, ...props }) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type='button'
      data-sidebar='rail'
      data-slot='sidebar-rail'
      aria-label='Toggle Sidebar'
      tabIndex={-1}
      onClick={toggleSidebar}
      title='Toggle Sidebar'
      className={cn(
        'ds-part-sidebar-rail absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-ui-sidebar',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className
      )}
      {...props}
    />
  );
}
/**
 * A drag handle on the sidebar edge that resizes it (the provider needs a `defaultWidth`). It is a
 * focusable vertical separator: drag it, or use the arrow keys (Home and End jump to `min` and `max`),
 * all in pixels. Double-click resets to `defaultWidth`. It hides on the collapsed rail and the phone sheet.
 */
function SidebarResizeHandle({ min = 224, max = 384, step = 16, label = 'Resize sidebar', className, ...props }) {
  const { width, setWidth, setResizing, state, isMobile } = useSidebar();
  const ref = React.useRef(null);
  const stopDrag = React.useRef(null);
  const initial = React.useRef(width);
  const [current, setCurrent] = React.useState(null);
  const hidden = isMobile || state === 'collapsed';
  React.useEffect(() => {
    if (hidden) stopDrag.current?.();
    return () => stopDrag.current?.();
  }, [hidden]);
  const measure = () => ref.current?.closest('[data-slot="sidebar-container"]')?.getBoundingClientRect();
  const direction = () => {
    const right = ref.current?.closest('[data-slot="sidebar-container"]')?.dataset.side === 'right';
    const rtl = ref.current && getComputedStyle(ref.current).direction === 'rtl';
    return right !== Boolean(rtl) ? -1 : 1;
  };
  // A focusable separator reports its value, so read the rendered width once it is on screen.
  React.useEffect(() => {
    if (hidden || current !== null) return;
    const box = measure();
    if (box?.width) setCurrent(Math.round(box.width));
  }, [hidden, current]);
  if (hidden) return null;
  const clamp = (value) => Math.round(Math.min(max, Math.max(min, value)));
  const now = () => current ?? Math.round(measure()?.width ?? min);
  const apply = (value) => {
    const next = clamp(value);
    setCurrent(next);
    setWidth(next);
  };
  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const box = measure();
    if (!box) return;
    stopDrag.current?.();
    const factor = direction();
    const startX = event.clientX;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setResizing(true);
    const move = (moveEvent) => {
      if (moveEvent.pointerId === pointerId) apply(box.width + factor * (moveEvent.clientX - startX));
    };
    const finish = (endEvent) => {
      if (endEvent?.pointerId !== undefined && endEvent.pointerId !== pointerId) return;
      setResizing(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      window.removeEventListener('blur', finish);
      stopDrag.current = null;
    };
    stopDrag.current = finish;
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    window.addEventListener('blur', finish);
  };
  const onKeyDown = (event) => {
    const keys = { ArrowLeft: -step * direction(), ArrowRight: step * direction(), Home: -Infinity, End: Infinity };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const delta = keys[event.key];
    apply(Number.isFinite(delta) ? now() + delta : delta > 0 ? max : min);
  };
  return (
    <div
      ref={ref}
      role='separator'
      tabIndex={0}
      aria-label={label}
      aria-orientation='vertical'
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={current ?? undefined}
      data-slot='sidebar-resize-handle'
      className={cn('ds-part-sidebar-resize-handle', className)}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      onDoubleClick={() => {
        setWidth(initial.current);
        setCurrent(typeof initial.current === 'number' ? initial.current : null);
      }}
      {...props}
    >
      <span aria-hidden='true' className='ds-part-sidebar-resize-grip' />
    </div>
  );
}
function SidebarInset({ className, ...props }) {
  return (
    <main
      data-slot='sidebar-inset'
      className={cn(
        'ds-part-sidebar-inset relative flex w-full flex-1 flex-col',
        className
      )}
      {...props}
    />
  );
}
function SidebarInput({ className, ...props }) {
  return (
    <Input
      data-slot='sidebar-input'
      data-sidebar='input'
      className={cn('ds-part-sidebar-input', className)}
      {...props}
    />
  );
}
function SidebarHeader({ className, ...props }) {
  return (
    <div
      data-slot='sidebar-header'
      data-sidebar='header'
      className={cn('ds-part-sidebar-header flex flex-col', className)}
      {...props}
    />
  );
}
function SidebarFooter({ className, ...props }) {
  return (
    <div
      data-slot='sidebar-footer'
      data-sidebar='footer'
      className={cn('ds-part-sidebar-footer flex flex-col', className)}
      {...props}
    />
  );
}
function SidebarSeparator({ className, ...props }) {
  return (
    <Separator
      data-slot='sidebar-separator'
      data-sidebar='separator'
      className={cn('ds-part-sidebar-separator w-auto', className)}
      {...props}
    />
  );
}
function SidebarContent({ className, ...props }) {
  return (
    <div
      data-slot='sidebar-content'
      data-sidebar='content'
      className={cn(
        'ds-part-sidebar-content flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className
      )}
      {...props}
    />
  );
}
function SidebarGroup({ className, ...props }) {
  return (
    <div
      data-slot='sidebar-group'
      data-sidebar='group'
      className={cn(
        'ds-part-sidebar-group relative flex w-full min-w-0 flex-col',
        className
      )}
      {...props}
    />
  );
}
function SidebarGroupLabel({ className, asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='sidebar-group-label'
      data-sidebar='group-label'
      className={cn(
        'ds-part-sidebar-group-label flex shrink-0 items-center outline-hidden [&>svg]:shrink-0',
        className
      )}
      {...props}
    />
  );
}
function SidebarGroupAction({ className, asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      type={asChild ? undefined : 'button'}
      data-slot='sidebar-group-action'
      data-sidebar='group-action'
      className={cn(
        'ds-part-sidebar-group-action flex aspect-square items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0',
        className
      )}
      {...props}
    />
  );
}
function SidebarGroupContent({ className, ...props }) {
  return (
    <div
      data-slot='sidebar-group-content'
      data-sidebar='group-content'
      className={cn('ds-part-sidebar-group-content w-full', className)}
      {...props}
    />
  );
}
function SidebarMenu({ className, ...props }) {
  return (
    <ul
      data-slot='sidebar-menu'
      data-sidebar='menu'
      className={cn(
        'ds-part-sidebar-menu flex w-full min-w-0 flex-col',
        className
      )}
      {...props}
    />
  );
}
function SidebarMenuItem({ className, ...props }) {
  return (
    <li
      data-slot='sidebar-menu-item'
      data-sidebar='menu-item'
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  );
}
const sidebarMenuButtonVariants = cva(
  'ds-part-sidebar-menu-button peer/menu-button group/menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate',
  {
    variants: {
      variant: {
        default: 'ds-part-sidebar-menu-button-variant-default',
        outline: 'ds-part-sidebar-menu-button-variant-outline'
      },
      size: {
        default: 'ds-part-sidebar-menu-button-size-default',
        sm: 'ds-part-sidebar-menu-button-size-sm',
        lg: 'ds-part-sidebar-menu-button-size-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}) {
  const Comp = asChild ? Slot.Root : 'button';
  const { isMobile, state } = useSidebar();
  const sidebarSide = useSidebarSide();
  const button = (
    <Comp
      type={asChild ? undefined : 'button'}
      data-slot='sidebar-menu-button'
      data-sidebar='menu-button'
      data-size={size}
      data-active={isActive || undefined}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
  // In the phone sheet labels are always visible; a hidden tooltip would still swallow the first Escape.
  if (!tooltip || isMobile) {
    return button;
  }
  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip
    };
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side={sidebarSide === 'right' ? 'left' : 'right'}
        align='center'
        hidden={state !== 'collapsed' || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}
function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      type={asChild ? undefined : 'button'}
      data-slot='sidebar-menu-action'
      data-sidebar='menu-action'
      className={cn(
        'ds-part-sidebar-menu-action flex items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0',
        showOnHover &&
          'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-ui-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0',
        className
      )}
      {...props}
    />
  );
}
function SidebarMenuBadge({ className, ...props }) {
  return (
    <div
      data-slot='sidebar-menu-badge'
      data-sidebar='menu-badge'
      className={cn(
        'ds-part-sidebar-menu-badge flex items-center justify-center tabular-nums select-none group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  );
}
function SidebarMenuSkeleton({ className, showIcon = false, ...props }) {
  return (
    <div
      data-slot='sidebar-menu-skeleton'
      data-sidebar='menu-skeleton'
      className={cn(
        'ds-part-sidebar-menu-skeleton flex items-center',
        className
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className='ds-part-sidebar-menu-skeleton-icon'
          data-sidebar='menu-skeleton-icon'
        />
      )}
      <Skeleton
        className='ds-part-sidebar-menu-skeleton-text max-w-(--skeleton-width) flex-1'
        data-sidebar='menu-skeleton-text'
        style={{
          '--skeleton-width': '70%'
        }}
      />
    </div>
  );
}
function SidebarMenuSub({ className, ...props }) {
  return (
    <ul
      data-slot='sidebar-menu-sub'
      data-sidebar='menu-sub'
      className={cn(
        'ds-part-sidebar-menu-sub flex min-w-0 flex-col',
        className
      )}
      {...props}
    />
  );
}
function SidebarMenuSubItem({ className, ...props }) {
  return (
    <li
      data-slot='sidebar-menu-sub-item'
      data-sidebar='menu-sub-item'
      className={cn('group/menu-sub-item relative', className)}
      {...props}
    />
  );
}
function SidebarMenuSubButton({
  asChild = false,
  size = 'md',
  isActive = false,
  className,
  ...props
}) {
  const Comp = asChild ? Slot.Root : 'a';
  return (
    <Comp
      data-slot='sidebar-menu-sub-button'
      data-sidebar='menu-sub-button'
      data-size={size}
      data-active={isActive || undefined}
      className={cn(
        'ds-part-sidebar-menu-sub-button flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0',
        className
      )}
      {...props}
    />
  );
}
export {
  useSidebarSide,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarResizeHandle,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
};
