'use client';

import { useId, useState } from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { format } from 'date-fns';
import { default as Button } from '../../core/Button/index.js';
import { Calendar } from '../../core/Calendar/Calendar.jsx';
import { CardRoot, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../core/Card/index.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../core/Popover/PopoverPrimitives.jsx';
import { Switch } from '../../core/Switch/SwitchPrimitives.jsx';
import { ToggleGroup, ToggleGroupItem } from '../../core/ToggleGroup/ToggleGroupPrimitives.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { cn } from '../../../utilities/cn/index.js';
import { DEFAULT_DASHBOARD_LABELS, DEFAULT_DASHBOARD_PERIODS, dashboardSpan, resolveDashboardPeriod } from './dashboardModel.js';

/*
 * Dashboard layout and period controls. The grid reflows by its own width (a container query), not the
 * viewport, so the same dashboard fits a full page, a split view or a sidebar: one column when narrow,
 * six columns from 42rem and twelve from 64rem. Panels set how many of the twelve columns they take.
 */

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

const formatRange = (range, pattern) => (range?.from ? `${format(range.from, pattern)} – ${format(range.to || range.from, pattern)}` : '');

/**
 * Period presets, a custom date range and a compare switch for the top of a dashboard. Each value is
 * controlled or uncontrolled; `onChange` receives the resolved `{ period, from, to, days, previous, compare }`.
 * The active range is announced politely when it changes.
 */
export function DashboardToolbar({
  periods = DEFAULT_DASHBOARD_PERIODS,
  period: periodProp,
  defaultPeriod = periods[1]?.value ?? periods[0]?.value ?? 'custom',
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
  const [period, setPeriod] = useControllableState({ value: periodProp, defaultValue: defaultPeriod, onChange: onPeriodChange });
  const [range, setRange] = useControllableState({ value: rangeProp, defaultValue: defaultRange, onChange: onRangeChange });
  const [compare, setCompare] = useControllableState({ value: compareProp, defaultValue: defaultCompare, onChange: onCompareChange });
  const [open, setOpen] = useState(false);
  const resolved = resolveDashboardPeriod(period, { today, range, periods });

  const emit = (next) => onChange?.({ ...resolveDashboardPeriod(next.period, { today, range: next.range, periods }), period: next.period, compare: next.compare });
  const choosePeriod = (next) => {
    if (!next || next === period) return;
    if (next === 'custom' && !range?.from) {
      setOpen(true);
      return;
    }
    setPeriod(next);
    emit({ period: next, range, compare });
  };
  const chooseRange = (next) => {
    setRange(next);
    if (next?.from && next?.to) {
      setPeriod('custom');
      emit({ period: 'custom', range: next, compare });
    }
  };
  const toggleCompare = (next) => {
    setCompare(next);
    emit({ period, range, compare: next });
  };

  const summary = `${labels.showing} ${formatRange(resolved, dateFormat)}${compare ? `, ${labels.comparedWith} ${formatRange(resolved.previous, dateFormat)}` : ''}`;
  return (
    <div data-slot='dashboard-toolbar' className={cn('flex flex-wrap items-center gap-2', className)}>
      {periods.length ? <ToggleGroup type='single' variant='outline' size='sm' spacing={0} aria-label={labels.period} value={period} onValueChange={choosePeriod}>
        {periods.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value} aria-label={item.description}>{item.label}</ToggleGroupItem>
        ))}
      </ToggleGroup> : null}
      {allowCustom ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant={period === 'custom' ? 'soft' : 'outline'} tone='neutral' size='sm' aria-label={`${labels.pickRange}${period === 'custom' ? `, ${formatRange(range, dateFormat)}` : ''}`}>
              <RegistryIcon lucide='CalendarIcon' aria-hidden='true' />
              <span className='max-w-56 truncate'>{period === 'custom' && range?.from ? formatRange(range, dateFormat) : labels.custom}</span>
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
