import { isChartNumber } from '../ChartFrame/chartScale.js';

/**
 * Running totals for a waterfall: each change floats from the previous total; totals start at 0.
 *
 * @param {object[]} data - Steps `{ label, value, total? }`.
 * @returns {Array<{ label: string, change: number, start: number, end: number, isTotal: boolean }>}
 */
export function waterfallSteps(data, { labelKey = 'label', totalKey = 'total', valueKey = 'value' } = {}) {
  let running = 0;

  return data.map((item) => {
    if (item[totalKey]) {
      const end = isChartNumber(item[valueKey]) ? item[valueKey] : running;
      running = end;

      return { 'change': end, end, 'isTotal': true, 'label': String(item[labelKey]), 'range': [ 0, end ], 'start': 0 };
    }
    const start = running;
    const end = running + item[valueKey];
    running = end;

    return { 'change': item[valueKey], end, 'isTotal': false, 'label': String(item[labelKey]), 'range': [ Math.min(start, end), Math.max(start, end) ], start };
  });
}
