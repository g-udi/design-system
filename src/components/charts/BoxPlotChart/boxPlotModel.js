import { boxStats, isChartNumber } from '../ChartFrame/chartScale.js';

const STAT_KEYS = [ 'min', 'q1', 'median', 'q3', 'max' ];

/** Each group's five-number summary, from raw `values` or precomputed fields. */
export function boxGroups(data, { labelKey = 'label', valuesKey = 'values' } = {}) {
  return data.map((item) => {
    if (!item || typeof item !== 'object') return { label: '', stats: null };
    const stats = Array.isArray(item[valuesKey])
      ? boxStats(item[valuesKey])
      : STAT_KEYS.every((key) => isChartNumber(item[key])) ? { 'count': item.count, 'outliers': item.outliers || [], ...Object.fromEntries(STAT_KEYS.map((key) => [ key, item[key] ])) } : null;

    return { 'label': String(item[labelKey]), stats };
  });
}
