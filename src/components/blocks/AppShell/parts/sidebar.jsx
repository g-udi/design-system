'use client';
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
import { Slot } from 'radix-ui';
import { useIsMobile } from '../../../../hooks/use-mobile.js';
import { default as Button } from '../../../core/Button/index.js';
import { FieldInput as Input } from '../../../core/Field/index.js';
import { Separator } from '../../../core/Separator/parts/separator.jsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '../../../core/Sheet/parts/sheet.jsx';
import { Skeleton } from '../../../core/Skeleton/parts/skeleton.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../core/Tooltip/parts/tooltip.jsx';
import { Kbd, KbdGroup } from '../../../core/Kbd/parts/kbd.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
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
 */
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  storageKey,
  shortcut = SIDEBAR_KEYBOARD_SHORTCUT,
  labels: labelOverrides,
  className,
  style,
  children,
  ...props
}) {
  const labels = { ...DEFAULT_SIDEBAR_LABELS, ...labelOverrides };
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const [announcement, setAnnouncement] = React.useState('');
  // The phone sheet has no Radix trigger, so remember what opened it and give focus back on close.
  const returnFocusRef = React.useRef(null);
  const open = openProp ?? _open;
  React.useEffect(() => {
    if (!storageKey || openProp !== undefined) return;
    const stored = readStoredOpen(storageKey);
    if (stored !== null) _setOpen(stored);
  }, [storageKey, openProp]);
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, String(openState));
        } catch {
          // Storage can be unavailable (private mode); the state still applies for this visit.
        }
      }
    },
    [setOpenProp, open, storageKey]
  );
  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      if (!openMobile) returnFocusRef.current = document.activeElement;
      return setOpenMobile((open2) => !open2);
    }
    setAnnouncement(open ? labels.collapsed : labels.expanded);
    return setOpen((open2) => !open2);
  }, [isMobile, open, openMobile, setOpen, setOpenMobile, labels.collapsed, labels.expanded]);
  React.useEffect(() => {
    if (!shortcut) return undefined;
    const handleKeyDown = (event) => {
      if (
        event.key.toLowerCase() === shortcut &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, shortcut]);
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
      returnFocusRef
    }),
    // labels is rebuilt per render from stable inputs; its parts are the real dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, shortcut, labels.toggle, labels.expanded, labels.collapsed]
  );
  return (
    <SidebarContext.Provider value={contextValue}>
      {/* Rail tooltips and the trigger's shortcut hint work without a provider higher up. */}
      <TooltipProvider delayDuration={0}>
      <div
        data-slot='sidebar-wrapper'
        style={{
          '--sidebar-width': SIDEBAR_WIDTH,
          '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
          ...style
        }}
        className={cn(
          'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-ui-sidebar',
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
function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  dir,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile, returnFocusRef } = useSidebar();
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
          dir={dir}
          data-sidebar='sidebar'
          data-slot='sidebar'
          data-mobile='true'
          className='w-(--sidebar-width) bg-ui-sidebar p-0 text-ui-sidebar-foreground [&>button]:hidden'
          style={{
            '--sidebar-width': SIDEBAR_WIDTH_MOBILE
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
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className='flex h-full w-full flex-col'>{children}</div>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <div
      className='group peer hidden text-ui-sidebar-foreground md:block'
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
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
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
        toggleSidebar();
      }}
      {...props}
    >
      <RegistryIcon lucide='PanelLeftIcon' className='ds-part-rtl-flip' />
      <span className='sr-only'>{name}</span>
    </Button>
  );
  if (!tooltip || !shortcut) return trigger;
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
function SidebarRail({ className, ...props }) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
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
  const button = (
    <Comp
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
        side='right'
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
  const [width] = React.useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  });
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
          '--skeleton-width': width
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
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
};
