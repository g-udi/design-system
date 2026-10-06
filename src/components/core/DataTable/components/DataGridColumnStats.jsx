'use client';
import { writeToClipboard } from '../../../../hooks/interaction/use-copy-to-clipboard.js';
import { aggregationFns } from '@tanstack/react-table';
import { useDataGridViewLabels } from '../dataGridViewLabels.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { DropdownMenuItem } from '../../DropdownMenu/DropdownMenuPrimitives.jsx';
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
const STAT_LABEL_KEYS = {
  count: 'statCount',
  distinct: 'statDistinct',
  empty: 'statEmpty',
  min: 'statMin',
  max: 'statMax',
  avg: 'statAvg',
  sum: 'statSum'
};
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
/**
 * The stats as a definition list, sized for a header menu. `format(value, id)`
 * (or `meta.statsFormat`) prints value stats in the column's own notation.
 */
function DataGridColumnStats({ column, kinds, format, labels, className }) {
  const text = useDataGridViewLabels(labels);
  const stats = getDataGridColumnStats(column, { kinds });
  return (
    <dl
      data-slot='data-grid-column-stats'
      className={cn(
        'grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-xs font-normal',
        className
      )}
    >
      {stats.map((stat) => (
        <div key={stat.id} className='contents'>
          <dt className='text-ui-muted-foreground'>{text[STAT_LABEL_KEYS[stat.id]]}</dt>
          <dd className='text-ui-foreground text-end tabular-nums'>
            {formatDataGridColumnStat(stat, column, format)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
/**
 * The stats as menu items, for a header menu or a "Column stats" submenu: each
 * reads as "Sum, $1.7M" and copies its value when chosen.
 */
function DataGridColumnStatsMenuItems({ column, kinds, format, labels }) {
  const text = useDataGridViewLabels(labels);
  return getDataGridColumnStats(column, { kinds }).map((stat) => {
    const label = text[STAT_LABEL_KEYS[stat.id]];
    const value = formatDataGridColumnStat(stat, column, format);
    return (
      <DropdownMenuItem
        key={stat.id}
        title={text.copyStat(label)}
        onSelect={() => { void writeToClipboard(value); }}
        className='justify-between gap-6 text-xs'
      >
        <span className='text-ui-muted-foreground'>{label}</span>
        <span className='text-ui-foreground tabular-nums'>{value}</span>
      </DropdownMenuItem>
    );
  });
}
export { DataGridColumnStats, DataGridColumnStatsMenuItems };
