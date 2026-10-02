'use client';

import { useId, useState } from 'react';
import { addDays, differenceInCalendarDays, format, startOfDay, subDays, subMonths } from 'date-fns';
import { default as Button } from '../../core/Button/index.js';
import { Calendar } from '../../core/Calendar/parts/calendar.jsx';
import { CardRoot, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../core/Card/index.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../core/Popover/parts/popover.jsx';
import { Switch } from '../../core/Switch/parts/switch.jsx';
import { ToggleGroup, ToggleGroupItem } from '../../core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { cn } from '../../../utilities/cn/index.js';

/*
 * Dashboard layout and period controls. The grid reflows by its own width (a container query), not the
 * viewport, so the same dashboard fits a full page, a split view or a sidebar: one column when narrow,
 * six columns from 42rem and twelve from 64rem. Panels set how many of the twelve columns they take.
 */

// Literal class names so Tailwind can see every span.
const wideSpans = {
  2: '@5xl/dashboard:col-span-2',
  3: '@5xl/dashboard:col-span-3',
  4: '@5xl/dashboard:col-span-4',
  5: '@5xl/dashboard:col-span-5',
  6: '@5xl/dashboard:col-span-6',
  7: '@5xl/dashboard:col-span-7',
  8: '@5xl/dashboard:col-span-8',
  9: '@5xl/dashboard:col-span-9',
  12: '@5xl/dashboard:col-span-12'
};
const mediumSpans = {
  2: '@2xl/dashboard:col-span-2',
  3: '@2xl/dashboard:col-span-3',
  4: '@2xl/dashboard:col-span-4',
  6: '@2xl/dashboard:col-span-6'
};
const wideRows = { 2: '@5xl/dashboard:row-span-2', 3: '@5xl/dashboard:row-span-3' };

/**
 * Class names that place any child of a DashboardGrid: `span` of twelve columns on wide containers, and
 * `spanMd` of six on medium ones (by default half for spans up to three, such as KPI tiles, otherwise the full row).
 */
export function dashboardSpan(span = 12, spanMd, rowSpan) {
  const medium = spanMd ?? (span <= 3 ? 3 : 6);
  return cn('col-span-1', mediumSpans[medium] || mediumSpans[6], wideSpans[span] || wideSpans[12], wideRows[rowSpan]);
}

export function DashboardGrid({ children, label, className, ...props }) {
  return (
    <div data-slot='dashboard' className='@container/dashboard w-full min-w-0'>
      <div
        data-slot='dashboard-grid'
        role={label ? 'region' : undefined}
        aria-label={label}
        className={cn('grid grid-cols-1 gap-4 @2xl/dashboard:grid-cols-6 @5xl/dashboard:grid-cols-12', className)}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * A titled dashboard panel on the Core Card. `scroll` (`x`, `y` or `both`) turns the body into a
 * labelled, keyboard-focusable region so wide tables and long lists scroll in place, never the page.
 */
export function DashboardPanel({ title, description, action, toolbar, footer, span = 12, spanMd, rowSpan, scroll, scrollLabel, maxHeight, children, className, contentClassName }) {
  const titleId = useId();
  const scrollable = Boolean(scroll);
  return (
    <CardRoot
      data-slot='dashboard-panel'
      role='region'
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : scrollLabel}
      className={cn('min-w-0 gap-3', dashboardSpan(span, spanMd, rowSpan), className)}
    >
      {title || action ? (
        <CardHeader>
          {title ? <CardTitle as='h3' id={titleId} className='text-sm font-semibold'>{title}</CardTitle> : null}
          {description ? <CardDescription className='text-text-muted text-xs'>{description}</CardDescription> : null}
          {action ? <CardAction>{action}</CardAction> : null}
        </CardHeader>
      ) : null}
      {toolbar ? <div data-slot='dashboard-panel-toolbar' className='flex flex-wrap items-center gap-2 px-3'>{toolbar}</div> : null}
      <CardContent
        data-slot='dashboard-panel-content'
        tabIndex={scrollable ? 0 : undefined}
        role={scrollable ? 'group' : undefined}
        aria-label={scrollable ? scrollLabel || (typeof title === 'string' ? title : undefined) : undefined}
        style={maxHeight ? { maxHeight } : undefined}
        className={cn(
          'min-w-0 flex-1',
          scroll === 'x' && 'overflow-x-auto',
          scroll === 'y' && 'overflow-y-auto',
          scroll === 'both' && 'overflow-auto',
          scrollable && 'focus-visible:ring-ring/50 rounded-(--ds-radius-control) outline-none focus-visible:ring-3',
          contentClassName
        )}
      >
        {children}
      </CardContent>
      {footer ? <CardFooter className='text-text-muted border-t px-3 py-2 text-xs'>{footer}</CardFooter> : null}
    </CardRoot>
  );
}

export const DEFAULT_DASHBOARD_PERIODS = [
  { value: '7d', label: '7d', days: 7, description: 'Last 7 days' },
  { value: '30d', label: '30d', days: 30, description: 'Last 30 days' },
  { value: '90d', label: '90d', days: 90, description: 'Last 90 days' },
  { value: '12m', label: '12m', months: 12, description: 'Last 12 months' }
];

export const DEFAULT_DASHBOARD_LABELS = {
  period: 'Period',
  custom: 'Custom',
  pickRange: 'Pick a date range',
  compare: 'Compare',
  compareDescription: 'Compare with the previous period',
  showing: 'Showing',
  comparedWith: 'compared with'
};

/**
 * The dates a period covers, ending on `today`, and the equally long period before it. A `custom`
 * period uses `range`. Returns `{ from, to, days, previous: { from, to } }` with start-of-day dates.
 */
export function resolveDashboardPeriod(period, { today = new Date(), range, periods = DEFAULT_DASHBOARD_PERIODS } = {}) {
  const end = startOfDay(today);
  let from;
  let to = end;
  if (period === 'custom' && range?.from) {
    from = startOfDay(range.from);
    to = startOfDay(range.to || range.from);
  } else {
    const preset = periods.find((item) => item.value === period) || periods[0];
    from = preset.months ? addDays(subMonths(end, preset.months), 1) : subDays(end, (preset.days || 1) - 1);
  }
  if (from > to) [from, to] = [to, from];
  const days = differenceInCalendarDays(to, from) + 1;
  const previousTo = subDays(from, 1);
  return { from, to, days, previous: { from: subDays(previousTo, days - 1), to: previousTo } };
}

const formatRange = (range, pattern) => (range?.from ? `${format(range.from, pattern)} – ${format(range.to || range.from, pattern)}` : '');

/**
 * Period presets, a custom date range and a compare switch for the top of a dashboard. Each value is
 * controlled or uncontrolled; `onChange` receives the resolved `{ period, from, to, days, previous, compare }`.
 * The active range is announced politely when it changes.
 */
export function DashboardToolbar({
  periods = DEFAULT_DASHBOARD_PERIODS,
  period: periodProp,
  defaultPeriod = periods[1]?.value || periods[0].value,
  onPeriodChange,
  range: rangeProp,
  defaultRange,
  onRangeChange,
  compare: compareProp,
  defaultCompare = false,
  onCompareChange,
  onChange,
  allowCustom = true,
  showCompare = true,
  today,
  dateFormat = 'MMM d, y',
  labels: labelOverrides,
  children,
  className
}) {
  const labels = { ...DEFAULT_DASHBOARD_LABELS, ...labelOverrides };
  const compareId = useId();
  const [periodState, setPeriodState] = useState(defaultPeriod);
  const [rangeState, setRangeState] = useState(defaultRange);
  const [compareState, setCompareState] = useState(defaultCompare);
  const [open, setOpen] = useState(false);
  const period = periodProp ?? periodState;
  const range = rangeProp ?? rangeState;
  const compare = compareProp ?? compareState;
  const resolved = resolveDashboardPeriod(period, { today, range, periods });

  const emit = (next) => onChange?.({ ...resolveDashboardPeriod(next.period, { today, range: next.range, periods }), period: next.period, compare: next.compare });
  const choosePeriod = (next) => {
    if (!next || next === period) return;
    if (next === 'custom' && !range?.from) {
      setOpen(true);
      return;
    }
    setPeriodState(next);
    onPeriodChange?.(next);
    emit({ period: next, range, compare });
  };
  const chooseRange = (next) => {
    setRangeState(next);
    onRangeChange?.(next);
    if (next?.from && next?.to) {
      setPeriodState('custom');
      onPeriodChange?.('custom');
      emit({ period: 'custom', range: next, compare });
    }
  };
  const toggleCompare = (next) => {
    setCompareState(next);
    onCompareChange?.(next);
    emit({ period, range, compare: next });
  };

  const summary = `${labels.showing} ${formatRange(resolved, dateFormat)}${compare ? `, ${labels.comparedWith} ${formatRange(resolved.previous, dateFormat)}` : ''}`;
  return (
    <div data-slot='dashboard-toolbar' className={cn('flex flex-wrap items-center gap-2', className)}>
      <ToggleGroup type='single' variant='outline' size='sm' spacing={0} aria-label={labels.period} value={period} onValueChange={choosePeriod}>
        {periods.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value} aria-label={item.description}>{item.label}</ToggleGroupItem>
        ))}
      </ToggleGroup>
      {allowCustom ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant={period === 'custom' ? 'soft' : 'outline'} tone='neutral' size='sm' aria-label={`${labels.pickRange}${period === 'custom' ? `, ${formatRange(range, dateFormat)}` : ''}`}>
              <RegistryIcon lucide='CalendarIcon' aria-hidden='true' />
              <span className='max-w-56 truncate'>{period === 'custom' ? formatRange(range, dateFormat) : labels.custom}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align='start' className='w-auto p-0'>
            <Calendar mode='range' numberOfMonths={1} defaultMonth={range?.from || resolved.from} selected={range} onSelect={chooseRange} disabled={today ? { after: today } : undefined} />
          </PopoverContent>
        </Popover>
      ) : null}
      {showCompare ? (
        <label htmlFor={compareId} className='text-text-muted flex items-center gap-2 text-sm'>
          <Switch id={compareId} size='sm' checked={compare} onCheckedChange={toggleCompare} aria-describedby={`${compareId}-hint`} />
          {labels.compare}
          <span id={`${compareId}-hint`} className='sr-only'>{labels.compareDescription}</span>
        </label>
      ) : null}
      {children ? <div className='ms-auto flex flex-wrap items-center gap-2'>{children}</div> : null}
      <p data-slot='dashboard-toolbar-summary' aria-live='polite' className='text-text-muted w-full text-xs'>{summary}</p>
    </div>
  );
}
