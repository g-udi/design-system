import { addDays, differenceInCalendarDays, startOfDay, subDays, subMonths } from 'date-fns';
import { cn } from '../../../utilities/cn/index.js';

// Server-safe Dashboard placement and period helpers.

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
    const preset = periods.find((item) => item.value === period) || periods[0] || {};
    from = preset.months ? addDays(subMonths(end, preset.months), 1) : subDays(end, (preset.days || 1) - 1);
  }
  if (from > to) [from, to] = [to, from];
  const days = differenceInCalendarDays(to, from) + 1;
  const previousTo = subDays(from, 1);
  return { from, to, days, previous: { from: subDays(previousTo, days - 1), to: previousTo } };
}
