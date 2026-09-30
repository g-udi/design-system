// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  useGanttNavigation,
  useGanttScale,
  useGanttSettings,
  useGanttViewConfig
} from './gantt-extended.jsx';
import { toZoned } from './gantt-lib-extended.jsx';
import { format } from 'date-fns';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Calendar } from '../../Calendar/parts/calendar.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../DropdownMenu/parts/dropdown-menu.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../Popover/parts/popover.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const GANTT_SCALES = ['day', 'week', 'month', 'quarter', 'year'];
function useNavButtonProps() {
  const viewConfig = useGanttViewConfig();
  return {
    variant: viewConfig.navButtonVariant,
    size: viewConfig.navButtonSize,
    iconSize: viewConfig.navButtonSize === 'sm' ? 'icon-sm' : 'icon'
  };
}
function NavTooltip({ content, children }) {
  if (content === null || content === void 0) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side='bottom'>{content}</TooltipContent>
    </Tooltip>
  );
}
function GanttNavToday({
  className,
  asChild = false,
  children,
  tooltip,
  ...props
}) {
  const { today, isToday } = useGanttNavigation();
  const settings = useGanttSettings();
  const nav = useNavButtonProps();
  const defaultTooltip = format(
    toZoned(/* @__PURE__ */ new Date(), settings.timeZone),
    settings.i18n.formats.dayTitle,
    { locale: settings.locale }
  );
  return (
    <NavTooltip content={tooltip === void 0 ? defaultTooltip : tooltip}>
      <Button
        variant={nav.variant}
        size={nav.size}
        data-slot='gantt-nav-today'
        data-active={isToday || void 0}
        className={cn(className)}
        onClick={today}
        asChild={asChild}
        {...props}
      >
        {children ?? settings.i18n.labels.today}
      </Button>
    </NavTooltip>
  );
}
function GanttNavPrev({
  className,
  asChild = false,
  children,
  tooltip,
  ...props
}) {
  const { prev } = useGanttNavigation();
  const settings = useGanttSettings();
  const nav = useNavButtonProps();
  return (
    <NavTooltip
      content={tooltip === void 0 ? settings.i18n.labels.previous : tooltip}
    >
      <Button
        variant={nav.variant}
        size={nav.iconSize}
        data-slot='gantt-nav-prev'
        aria-label={settings.i18n.labels.previous}
        className={cn(className)}
        onClick={prev}
        asChild={asChild}
        {...props}
      >
        {children ?? (
          <RegistryIcon
            lucide='ChevronLeftIcon'
            className='size-4'
            aria-hidden='true'
          />
        )}
      </Button>
    </NavTooltip>
  );
}
function GanttNavNext({
  className,
  asChild = false,
  children,
  tooltip,
  ...props
}) {
  const { next } = useGanttNavigation();
  const settings = useGanttSettings();
  const nav = useNavButtonProps();
  return (
    <NavTooltip
      content={tooltip === void 0 ? settings.i18n.labels.next : tooltip}
    >
      <Button
        variant={nav.variant}
        size={nav.iconSize}
        data-slot='gantt-nav-next'
        aria-label={settings.i18n.labels.next}
        className={cn(className)}
        onClick={next}
        asChild={asChild}
        {...props}
      >
        {children ?? (
          <RegistryIcon
            lucide='ChevronRightIcon'
            className='size-4'
            aria-hidden='true'
          />
        )}
      </Button>
    </NavTooltip>
  );
}
function GanttTitle({
  className,
  asChild = false,
  children,
  format: formatTitle,
  ...props
}) {
  const { title } = useGanttNavigation();
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='gantt-title'
      aria-live='polite'
      className={cn('min-w-0 truncate text-sm font-semibold', className)}
      {...props}
    >
      {children ?? formatTitle?.({ title }) ?? title}
    </Comp>
  );
}
function GanttScaleSwitcher({
  className,
  asChild,
  children,
  tooltip,
  scales = GANTT_SCALES,
  ...props
}) {
  const { scale, setScale } = useGanttScale();
  const settings = useGanttSettings();
  const nav = useNavButtonProps();
  const labels = settings.i18n.labels;
  const [open, setOpen] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const selectScale = (next) => {
    setOpen(false);
    setScale(next);
  };
  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setTipOpen(false);
      }}
    >
      {/* Tooltip on an overlay-opener: hover-only (focus opens ignored) and
       force-closed while the menu is up, so it never lingers or flashes
       when focus returns on close. */}
      <Tooltip
        open={tipOpen && !open}
        onOpenChange={(next) => setTipOpen(next)}
      >
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
            <Button
              variant={nav.variant}
              size={nav.size}
              data-slot='gantt-scale-switcher'
              aria-label={labels.selectView}
              className={cn('gap-1', className)}
              {...props}
            >
              {children ?? (
                <>
                  {labels.scales[scale]}
                  <RegistryIcon
                    lucide='ChevronDownIcon'
                    className='size-4 opacity-60'
                    aria-hidden='true'
                  />
                </>
              )}
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        {tipOpen && !open && tooltip !== null && (
          <TooltipContent side='bottom'>
            {tooltip ?? labels.selectView}
          </TooltipContent>
        )}
      </Tooltip>
      <DropdownMenuContent align='start' className='min-w-36'>
        {/* Keep the label inside the group so it stays associated with its items */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className='text-ui-muted-foreground font-normal'>
            {labels.selectView}
          </DropdownMenuLabel>
          {scales.map((value) => (
            <DropdownMenuItem
              key={value}
              data-active={scale === value || void 0}
              onClick={() => selectScale(value)}
            >
              {labels.scales[value]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function GanttDatePicker({ className }) {
  const { date, goTo } = useGanttNavigation();
  const settings = useGanttSettings();
  const nav = useNavButtonProps();
  const [open, setOpen] = useState(false);
  const zoned = toZoned(date, settings.timeZone);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={nav.variant}
          size={nav.iconSize}
          data-slot='gantt-date-picker'
          aria-label={settings.i18n.labels.goToDate}
          className={cn(className)}
        >
          <RegistryIcon
            lucide='CalendarIcon'
            className='size-4'
            aria-hidden='true'
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-auto p-0!'>
        <Calendar
          mode='single'
          selected={zoned}
          defaultMonth={zoned}
          locale={settings.locale}
          weekStartsOn={settings.weekStartsOn}
          onSelect={(next) => {
            if (next) {
              goTo(next);
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
function GanttToolbar({ className, asChild = false, children, ...props }) {
  const viewConfig = useGanttViewConfig();
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='gantt-toolbar'
      className={cn(
        'flex items-center gap-2',
        viewConfig.classNames?.toolbar,
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
function GanttNav({ className, asChild = false, children, ...props }) {
  const viewConfig = useGanttViewConfig();
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='gantt-nav'
      className={cn(
        // px so the toolbar controls do not hug the container edge; border-b
        // separates the toolbar from the column header below it
        'flex min-w-0 flex-wrap items-center gap-2 border-b px-3 py-2',
        viewConfig.stickyNav && 'bg-ui-background sticky top-0 z-30',
        viewConfig.classNames?.nav,
        className
      )}
      {...props}
    >
      {children ?? ( // Shared provider: first tooltip waits, moving between buttons is instant
        <TooltipProvider delayDuration={600} skipDelayDuration={300}>
          <GanttNavToday />
          <GanttScaleSwitcher />
          <div className='flex items-center'>
            <GanttNavPrev />
            <GanttNavNext />
          </div>
          <GanttTitle />
          <div className='grow' />
        </TooltipProvider>
      )}
    </Comp>
  );
}
export {
  GANTT_SCALES,
  GanttDatePicker,
  GanttNav,
  GanttNavNext,
  GanttNavPrev,
  GanttNavToday,
  GanttScaleSwitcher,
  GanttTitle,
  GanttToolbar
};
