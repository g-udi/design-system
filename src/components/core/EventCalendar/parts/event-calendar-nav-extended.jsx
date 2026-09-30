// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  useEventCalendarNavigation,
  useEventCalendarSettings,
  useEventCalendarView,
  useEventCalendarViewConfig
} from './event-calendar-extended.jsx';
import { toZoned } from './event-calendar-lib-extended.jsx';
import { addDays, format } from 'date-fns';
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
function useNavButtonProps() {
  const viewConfig = useEventCalendarViewConfig();
  return {
    variant: viewConfig.navButtonVariant,
    size: viewConfig.navButtonSize,
    iconSize: viewConfig.navButtonSize === 'sm' ? 'icon-sm' : 'icon',
    className: viewConfig.classNames?.navButton
  };
}
function useNavTooltipConfig() {
  const viewConfig = useEventCalendarViewConfig();
  const config =
    viewConfig.navTooltips === false ? void 0 : viewConfig.navTooltips;
  return {
    disabled: viewConfig.navTooltips === false,
    // the nav sits at the top of the calendar, so tooltips open upward by
    // default (away from the grid); collision flipping still drops them below
    // when there is no room above
    side: config?.side ?? 'top',
    delay: config?.delay ?? 600,
    closeDelay: config?.closeDelay ?? 0,
    timeout: config?.timeout ?? 300,
    className: viewConfig.classNames?.navTooltip
  };
}
function NavTooltip({ content, children }) {
  const tooltips = useNavTooltipConfig();
  if (tooltips.disabled || content === null || content === void 0)
    return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={tooltips.side} className={tooltips.className}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
function EventCalendarNavToday({
  className,
  asChild = false,
  children,
  tooltip,
  ...props
}) {
  const { today, isToday } = useEventCalendarNavigation();
  const settings = useEventCalendarSettings();
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
        data-slot='event-calendar-nav-today'
        data-active={isToday || void 0}
        className={cn(nav.className, className)}
        onClick={today}
        asChild={asChild}
        {...props}
      >
        {children ?? settings.i18n.labels.today}
      </Button>
    </NavTooltip>
  );
}
function EventCalendarNavPrev({
  className,
  asChild = false,
  children,
  tooltip,
  ...props
}) {
  const { prev } = useEventCalendarNavigation();
  const settings = useEventCalendarSettings();
  const nav = useNavButtonProps();
  return (
    <NavTooltip
      content={tooltip === void 0 ? settings.i18n.labels.previous : tooltip}
    >
      <Button
        variant={nav.variant}
        size={nav.iconSize}
        data-slot='event-calendar-nav-prev'
        aria-label={settings.i18n.labels.previous}
        className={cn(nav.className, className)}
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
function EventCalendarNavNext({
  className,
  asChild = false,
  children,
  tooltip,
  ...props
}) {
  const { next } = useEventCalendarNavigation();
  const settings = useEventCalendarSettings();
  const nav = useNavButtonProps();
  return (
    <NavTooltip
      content={tooltip === void 0 ? settings.i18n.labels.next : tooltip}
    >
      <Button
        variant={nav.variant}
        size={nav.iconSize}
        data-slot='event-calendar-nav-next'
        aria-label={settings.i18n.labels.next}
        className={cn(nav.className, className)}
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
function EventCalendarTitle({
  className,
  asChild = false,
  format: formatTitle,
  children,
  ...props
}) {
  const { title } = useEventCalendarNavigation();
  const viewConfig = useEventCalendarViewConfig();
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='event-calendar-title'
      aria-live='polite'
      className={cn(
        'min-w-0 truncate text-sm font-semibold',
        viewConfig.classNames?.title,
        className
      )}
      {...props}
    >
      {children ?? formatTitle?.({ title }) ?? title}
    </Comp>
  );
}
function EventCalendarViewSwitcher({
  className,
  asChild = false,
  children,
  tooltip,
  ...props
}) {
  const { view, dayCount, availableViews, setView } = useEventCalendarView();
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const nav = useNavButtonProps();
  const tooltips = useNavTooltipConfig();
  const labels = settings.i18n.labels;
  const [open, setOpen] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const selectView = (v, opts) => {
    setOpen(false);
    setView(v, opts);
  };
  const viewLabel = (v) =>
    v === 'days'
      ? settings.i18n.viewNames.days(dayCount)
      : settings.i18n.viewNames[v];
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
       when focus returns on close. Inherits the nav TooltipProvider's
       delayDuration/skipDelayDuration. */}
      <Tooltip open={tipOpen && !open} onOpenChange={setTipOpen}>
        <DropdownMenuTrigger asChild {...props}>
          {/* opens are hover-only; the trigger-focus open that follows a
       menu close is ignored (prevented before Radix opens), closes
       always land */}
          <TooltipTrigger asChild onFocus={(event) => event.preventDefault()}>
            <Button
              variant={nav.variant}
              size={nav.size}
              data-slot='event-calendar-view-switcher'
              aria-label={labels.selectView}
              className={cn('gap-1', nav.className, className)}
              asChild={asChild}
            >
              {children ?? (
                <>
                  {viewLabel(view)}
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
        {tipOpen && !open && tooltip !== null && !tooltips.disabled && (
          <TooltipContent side={tooltips.side} className={tooltips.className}>
            {tooltip ?? labels.selectView}
          </TooltipContent>
        )}
      </Tooltip>
      <DropdownMenuContent
        align='start'
        className={cn('min-w-44', viewConfig.classNames?.viewSwitcherContent)}
      >
        {/* Keep the label inside the group so it stays associated with its items */}
        <DropdownMenuGroup>
          <DropdownMenuLabel
            className={cn(
              'text-ui-muted-foreground font-normal',
              viewConfig.classNames?.viewSwitcherLabel
            )}
          >
            {settings.i18n.labels.selectView}
          </DropdownMenuLabel>
          {availableViews.map((v) =>
            v === 'days' ? (
              viewConfig.dayCountPresets.map((count) => (
                <DropdownMenuItem
                  key={`days-${count}`}
                  data-active={
                    (view === 'days' && dayCount === count) || void 0
                  }
                  onClick={() => selectView('days', { dayCount: count })}
                >
                  {settings.i18n.viewNames.days(count)}
                  {/* hint derived from the preset itself, not i18n's default */}
                  {viewConfig.enableShortcuts && (
                    <EventCalendarViewShortcut>
                      {count}
                    </EventCalendarViewShortcut>
                  )}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem
                key={v}
                data-active={view === v || void 0}
                onClick={() => selectView(v)}
              >
                {viewLabel(v)}
                {viewConfig.enableShortcuts && (
                  <EventCalendarViewShortcut>
                    {labels.viewShortcuts[v]}
                  </EventCalendarViewShortcut>
                )}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function EventCalendarViewShortcut({ children }) {
  const viewConfig = useEventCalendarViewConfig();
  return (
    <kbd
      data-slot='event-calendar-view-shortcut'
      className={cn(
        'text-ui-muted-foreground ms-auto inline-flex size-5 shrink-0 items-center justify-center rounded-sm border font-sans text-xs',
        viewConfig.classNames?.viewShortcut
      )}
    >
      {children}
    </kbd>
  );
}
const RANGE_VIEWS = ['week', 'days', 'agenda'];
function EventCalendarDatePicker({
  className,
  asChild = false,
  children,
  tooltip = null,
  mode,
  ...props
}) {
  const { date, goTo, activeRange } = useEventCalendarNavigation();
  const { view } = useEventCalendarView();
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const nav = useNavButtonProps();
  const [open, setOpen] = useState(false);
  const zoned = toZoned(date, settings.timeZone);
  const configured = mode ?? 'auto';
  const resolved =
    configured === 'auto'
      ? RANGE_VIEWS.includes(view)
        ? 'range'
        : 'single'
      : configured;
  const pick = (next) => {
    if (!next) return;
    goTo(next);
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <NavTooltip content={tooltip}>
        <PopoverTrigger asChild {...props}>
          <Button
            variant={nav.variant}
            size={nav.iconSize}
            data-slot='event-calendar-date-picker'
            data-mode={resolved}
            aria-label={settings.i18n.labels.goToDate}
            className={cn(nav.className, className)}
            asChild={asChild}
          >
            {children ?? (
              <RegistryIcon
                lucide='CalendarIcon'
                className='size-4'
                aria-hidden='true'
              />
            )}
          </Button>
        </PopoverTrigger>
      </NavTooltip>
      <PopoverContent
        align='start'
        className={cn('w-auto p-0!', viewConfig.classNames?.datePickerContent)}
      >
        {resolved === 'range' ? (
          <Calendar
            mode='range'
            selected={{
              from: toZoned(activeRange.start, settings.timeZone),
              to: toZoned(addDays(activeRange.end, -1), settings.timeZone)
            }}
            defaultMonth={zoned}
            onDayClick={pick}
            locale={settings.locale}
            weekStartsOn={settings.weekStartsOn}
          />
        ) : (
          <Calendar
            mode='single'
            selected={zoned}
            defaultMonth={zoned}
            onSelect={pick}
            locale={settings.locale}
            weekStartsOn={settings.weekStartsOn}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
function EventCalendarToolbar({
  className,
  asChild = false,
  children,
  ...props
}) {
  const viewConfig = useEventCalendarViewConfig();
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='event-calendar-toolbar'
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
function EventCalendarNav({
  className,
  asChild = false,
  children,
  showViewSwitcher = true,
  ...props
}) {
  const viewConfig = useEventCalendarViewConfig();
  const tooltips = useNavTooltipConfig();
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='event-calendar-nav'
      className={cn(
        'flex min-w-0 flex-wrap items-center gap-1 px-2 py-2',
        viewConfig.stickyNav && 'bg-ui-background sticky top-0 z-30',
        viewConfig.classNames?.nav,
        className
      )}
      {...props}
    >
      {children ?? ( // Shared provider: first tooltip waits, moving between buttons is instant
        <TooltipProvider
          delayDuration={tooltips.delay}
          skipDelayDuration={tooltips.timeout}
        >
          <EventCalendarNavToday />
          {showViewSwitcher && <EventCalendarViewSwitcher />}
          <div className='flex items-center'>
            <EventCalendarNavPrev />
            <EventCalendarNavNext />
          </div>
          {/* ms-3 sets the title apart from the tight control cluster so the
       period reads as its own group, not another button */}
          <EventCalendarTitle className='ms-3' />
          <div className='grow' />
        </TooltipProvider>
      )}
    </Comp>
  );
}
export {
  EventCalendarDatePicker,
  EventCalendarNav,
  EventCalendarNavNext,
  EventCalendarNavPrev,
  EventCalendarNavToday,
  EventCalendarTitle,
  EventCalendarToolbar,
  EventCalendarViewSwitcher
};
