/**
 * Chart scale and data helpers
 *
 * @description Pure helpers shared by every chart type: readable axis ticks, locale-aware
 * number formatting, histogram bins, box-plot quartiles, grouping small slices into "Other",
 * and the value checks behind the empty and invalid states. No React, no Recharts.
 */

/** True for real, finite numbers; strings, NaN and Infinity are not chart values. */
export const isChartNumber = (value) => typeof value === 'number' && Number.isFinite(value);

const niceStep = (rough) => {
  const exponent = Math.floor(Math.log10(rough));
  const fraction = rough / 10 ** exponent;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;

  return nice * 10 ** exponent;
};

/**
 * Round tick values that cover [min, max] in about `count` steps (1, 2, 2.5 or 5 × 10ⁿ).
 *
 * @param {number} min - Smallest data value.
 * @param {number} max - Largest data value.
 * @param {number} [count=5] - Approximate number of intervals.
 * @returns {number[]} Ascending ticks; the first is ≤ min and the last ≥ max.
 */
export function niceTicks(min, max, count = 5) {
  if (!isChartNumber(min) || !isChartNumber(max)) return [];
  if (min === max) {
    if (min === 0) return [ 0, 1 ];
    const pad = Math.abs(min) * 0.1 || Number.MIN_VALUE;

    return niceTicks(Math.max(-Number.MAX_VALUE, min - pad), Math.min(Number.MAX_VALUE, max + pad), count);
  }
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  const step = niceStep((high - low) / Math.max(1, count));
  if (!isChartNumber(step) || step <= 0) return [ low, high ];
  const start = Math.floor(low / step) * step;
  const end = Math.ceil(high / step) * step;
  if (!isChartNumber(start) || !isChartNumber(end)) return [ low, high ];
  const ticks = [];
  // Rounding by the step's precision keeps 0.1 + 0.2 from printing as 0.30000000000000004.
  const precision = Math.max(0, -Math.floor(Math.log10(step)) + 1);

  // Adding a sub-ULP step to a large value may never advance it. Count the
  // intervals instead, retaining tiny values beyond toFixed's supported range.
  const intervals = Math.round((end - start) / step);
  if (!isChartNumber(intervals)) return [ low, high ];
  for (let index = 0; index <= intervals; index += 1) {
    const value = start + index * step;
    const tick = precision > 100 ? value : Number(value.toFixed(precision));
    if (tick !== ticks.at(-1)) ticks.push(tick);
  }

  return ticks;
}

/**
 * Linear map from a data domain to pixels.
 *
 * @param {[number, number]} domain - Data range.
 * @param {[number, number]} range - Pixel range (may be inverted, e.g. [height, 0]).
 * @returns {(value: number) => number}
 */
export function scaleLinear([ d0, d1 ], [ r0, r1 ]) {
  const span = d1 - d0 || 1;

  return (value) => r0 + ((value - d0) / span) * (r1 - r0);
}

/** [min, max] of the finite numbers in `values`, or null when there are none. */
export function extent(values) {
  const numbers = values.filter(isChartNumber);
  if (!numbers.length) return null;

  return [ Math.min(...numbers), Math.max(...numbers) ];
}

const formatterCache = new Map();

/**
 * A cached Intl.NumberFormat for the locale and options.
 *
 * @param {string} [locale] - BCP 47 locale; the runtime default when omitted.
 * @param {Intl.NumberFormatOptions} [options] - Number format options (style, currency, notation…).
 * @returns {(value: unknown) => string} Formats numbers; other values print as strings.
 */
export function createChartFormatter(locale, options) {
  const key = `${locale || ''}|${JSON.stringify(options || {})}`;
  let format = formatterCache.get(key);
  if (!format) {
    let intl;
    try {
      intl = new Intl.NumberFormat(locale, options);
    } catch {
      intl = new Intl.NumberFormat(undefined, options);
    }
    format = (value) => (isChartNumber(value) ? intl.format(value) : value == null ? '' : String(value));
    formatterCache.set(key, format);
  }

  return format;
}

/**
 * Resolve a `formatValue` prop: a function wins, an Intl options object builds a formatter,
 * otherwise the locale's default number format.
 */
export const resolveFormatter = (formatValue, locale) => (
  typeof formatValue === 'function' ? formatValue : createChartFormatter(locale, formatValue)
);

/**
 * Split numbers into equal-width bins for a histogram.
 *
 * @param {number[]} values - Raw observations; non-numbers are ignored.
 * @param {{ bins?: number, domain?: [number, number] }} [options] - Bin count (default: Sturges'
 *   rule) and an explicit domain.
 * @returns {Array<{ start: number, end: number, count: number }>} Contiguous bins; the last bin
 *   includes its upper edge.
 */
export function binValues(values, { bins, domain } = {}) {
  const numbers = values.filter(isChartNumber);
  if (!numbers.length) return [];
  const [ low, high ] = domain || extent(numbers);
  const count = Math.max(1, Math.round(bins || Math.ceil(Math.log2(numbers.length) + 1)));
  const width = high === low ? 1 : (high - low) / count;
  const result = Array.from({ length: count }, (_, index) => ({ 'count': 0, 'end': low + width * (index + 1), 'start': low + width * index }));

  for (const value of numbers) {
    if (value < low || value > high) continue;
    const index = Math.min(count - 1, Math.floor((value - low) / width));
    result[index].count += 1;
  }

  return result;
}

const quantile = (sorted, p) => {
  const position = (sorted.length - 1) * p;
  const base = Math.floor(position);
  const rest = position - base;

  return sorted[base + 1] === undefined ? sorted[base] : sorted[base] + rest * (sorted[base + 1] - sorted[base]);
};

/**
 * Five-number summary with Tukey whiskers (1.5 × IQR) and the outliers beyond them.
 *
 * @param {number[]} values - Observations for one group.
 * @returns {{ min: number, q1: number, median: number, q3: number, max: number, outliers: number[], count: number } | null}
 */
export function boxStats(values) {
  const sorted = values.filter(isChartNumber).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const q1 = quantile(sorted, 0.25);
  const median = quantile(sorted, 0.5);
  const q3 = quantile(sorted, 0.75);
  const fence = 1.5 * (q3 - q1);
  const inside = sorted.filter((value) => value >= q1 - fence && value <= q3 + fence);

  return {
    'count': sorted.length,
    'max': inside.at(-1),
    median,
    'min': inside[0],
    'outliers': sorted.filter((value) => value < q1 - fence || value > q3 + fence),
    q1,
    q3
  };
}

/**
 * Fold slices that are too small to read into one "Other" slice.
 *
 * @param {object[]} data - Slices.
 * @param {{ nameKey: string, valueKey: string, threshold?: number, maxSlices?: number, otherLabel?: string }} options
 *   - `threshold` is a share of the total (0.04 = 4%); `maxSlices` keeps the largest N.
 * @returns {object[]} The kept slices in their original order, then "Other" (flagged `isOther`
 *   and listing what it holds in `members`).
 */
export function groupSmallSlices(data, { nameKey, valueKey, threshold = 0, maxSlices, otherLabel = 'Other' }) {
  const total = data.reduce((sum, item) => sum + (isChartNumber(item[valueKey]) ? item[valueKey] : 0), 0);
  if (!total || (!threshold && !maxSlices)) return data;
  const ranked = [ ...data ].sort((a, b) => b[valueKey] - a[valueKey]);
  const keep = new Set(ranked.filter((item, index) => (
    item[valueKey] / total >= threshold && (!maxSlices || index < maxSlices - 1 || ranked.length <= maxSlices)
  )));
  const folded = data.filter((item) => !keep.has(item));
  if (folded.length < 2) return data;

  return [
    ...data.filter((item) => keep.has(item)),
    {
      'isOther': true,
      'members': folded.map((item) => item[nameKey]),
      [nameKey]: otherLabel,
      [valueKey]: folded.reduce((sum, item) => sum + item[valueKey], 0)
    }
  ];
}

/**
 * Classify chart data for the frame's states.
 *
 * @param {unknown[]} data - Records (or raw numbers).
 * @param {string[]} keys - Fields that must hold numbers in every record.
 * @returns {'empty' | 'invalid' | 'ready'}
 */
export function dataStatus(data, keys) {
  if (!Array.isArray(data) || data.length === 0) return 'empty';
  const valid = data.every((item) => (
    typeof item === 'number'
      ? isChartNumber(item)
      : item && typeof item === 'object' && keys.every((key) => item[key] == null || isChartNumber(item[key]))
  ));
  if (!valid) return 'invalid';
  const hasValue = data.some((item) => (typeof item === 'number' ? true : keys.some((key) => isChartNumber(item[key]))));

  return hasValue ? 'ready' : 'empty';
}
