/* Server-safe column statistics and the heat colour scale built on them. */
import { aggregationFns } from '@tanstack/react-table';
import { chartPalettes } from '../../../tokens/index.js';

// Each stat names the registered aggregation that computes it.
const DATA_GRID_STAT_AGGREGATIONS = {
  count: 'count',
  distinct: 'uniqueCount',
  min: 'min',
  max: 'max',
  avg: 'mean',
  sum: 'sum'
};
const NUMERIC_STATS = ['count', 'distinct', 'empty', 'min', 'max', 'avg', 'sum'];
const DATE_STATS = ['count', 'distinct', 'empty', 'min', 'max'];
const TEXT_STATS = ['count', 'distinct', 'empty'];
function isEmptyValue(value) {
  return (
    value === null ||
    value === void 0 ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  );
}
function getStatKind(rows, columnId) {
  for (const row of rows) {
    const value = row.getValue(columnId);
    if (isEmptyValue(value)) continue;
    if (typeof value === 'number') return 'number';
    if (value instanceof Date) return 'date';
    return 'text';
  }
  return 'text';
}
function getStatRows(column) {
  // What the person is looking at: filtered and sorted, but every page.
  return column.table.getFilteredRowModel().rows.filter(
    (row) => !row.getIsGrouped?.()
  );
}
/**
 * Count, distinct and empty values, plus min, max, average and sum for numbers
 * (min and max for dates), over the grid's filtered rows. The column's own
 * `getAggregationValue` runs first, so a column whose `aggregationFn` already
 * names a stat (or whose `getAggregationValue` asks a server) supplies it;
 * the rest come from the same registered aggregation functions.
 *
 * `kinds` (or `meta.stats` as an array) picks and orders the stats.
 */
export function getDataGridColumnStats(column, { rows, kinds } = {}) {
  const statRows = rows ?? getStatRows(column);
  const kind = getStatKind(statRows, column.id);
  const metaKinds = Array.isArray(column.columnDef.meta?.stats)
    ? column.columnDef.meta.stats
    : null;
  const wanted =
    kinds ??
    metaKinds ??
    (kind === 'number' ? NUMERIC_STATS : kind === 'date' ? DATE_STATS : TEXT_STATS);
  const nonEmptyRows = statRows.filter(
    (row) => !isEmptyValue(row.getValue(column.id))
  );
  // The column's configured aggregations, keyed by registry name.
  const provided = {};
  const configured = column.columnDef.aggregationFn;
  const value = column.getAggregationValue?.({ rows: nonEmptyRows });
  if (Array.isArray(configured) && value && typeof value === 'object') {
    Object.assign(provided, value);
  } else if (typeof configured === 'string' && configured !== 'auto') {
    provided[configured] = value;
  }
  const context = {
    column,
    columnId: column.id,
    getValue: (row) => row.getValue(column.id),
    maxDepth: 0,
    rows: nonEmptyRows,
    table: column.table
  };
  return wanted.map((id) => {
    let result;
    if (id === 'empty') result = statRows.length - nonEmptyRows.length;
    else {
      const name = DATA_GRID_STAT_AGGREGATIONS[id];
      result =
        name in provided
          ? provided[name]
          : nonEmptyRows.length || id === 'count' || id === 'distinct'
            ? aggregationFns[name]?.aggregate(context)
            : void 0;
    }
    return { id, value: result, kind: ['count', 'distinct', 'empty'].includes(id) ? 'number' : kind };
  });
}
const integerFormat = new Intl.NumberFormat(void 0, { maximumFractionDigits: 0 });
const decimalFormat = new Intl.NumberFormat(void 0, { maximumFractionDigits: 2 });
export function formatDataGridColumnStat(stat, column, format) {
  if (stat.value === void 0 || stat.value === null || Number.isNaN(stat.value))
    return '—';
  const custom = format ?? column.columnDef.meta?.statsFormat;
  if (custom && !['count', 'distinct', 'empty'].includes(stat.id))
    return custom(stat.value, stat.id);
  if (stat.value instanceof Date) return stat.value.toLocaleDateString();
  if (typeof stat.value === 'number')
    return (Number.isInteger(stat.value) ? integerFormat : decimalFormat).format(stat.value);
  return String(stat.value);
}

const toVar = (name) => `var(${name})`;
const HEAT_FILLS = chartPalettes.heatmap.map(toVar);
const HEAT_INKS = chartPalettes.heatmapInk.map(toVar);
const DIVERGING_FILLS = chartPalettes.diverging.map(toVar);
/**
 * The HeatmapChart colour scale for one table cell: a fill and a legible ink
 * from the chart tokens, so a heat column and a heatmap chart read the same
 * in light and dark themes. `heatmap` buckets the domain into five steps
 * (step 0 is "no value"); `diverging` splits around `midpoint`.
 */
export function getDataGridHeatmapColor(
  value,
  { domain = [0, 1], scale = 'heatmap', midpoint = 0 } = {}
) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return { step: 0, background: HEAT_FILLS[0], color: HEAT_INKS[0] };
  }
  const [min, max] = domain;
  if (scale === 'diverging') {
    const reach =
      Math.max(Math.abs(min - midpoint), Math.abs(max - midpoint)) || 1;
    const ratio = (value - midpoint) / reach;
    const step =
      ratio <= -0.6 ? 0 : ratio <= -0.2 ? 1 : ratio < 0.2 ? 2 : ratio < 0.6 ? 3 : 4;
    return {
      step,
      background: DIVERGING_FILLS[step],
      color:
        step === 0 || step === 4
          ? 'var(--ds-color-chart-div-ink)'
          : 'var(--ds-color-text)'
    };
  }
  const step =
    max === min
      ? 3
      : 1 + Math.max(0, Math.min(4, Math.floor(((value - min) / (max - min)) * 5)));
  return { step, background: HEAT_FILLS[step], color: HEAT_INKS[step] };
}
const domainCache = new WeakMap();
/**
 * The [min, max] of a numeric column over the grid's filtered rows, cached per
 * row model so every cell of a heat column shares one pass.
 */
export function getDataGridColumnDomain(column) {
  const model = column.table.getFilteredRowModel();
  let byColumn = domainCache.get(model);
  if (!byColumn) {
    byColumn = new Map();
    domainCache.set(model, byColumn);
  }
  if (!byColumn.has(column.id)) {
    const [min, max] = getDataGridColumnStats(column, {
      kinds: ['min', 'max']
    }).map((stat) => stat.value);
    byColumn.set(column.id, [min ?? 0, max ?? 0]);
  }
  return byColumn.get(column.id);
}
