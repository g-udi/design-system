'use client';
import { writeToClipboard } from '../../../../hooks/interaction/clipboard-model.js';
import { useDataGridViewLabels } from '../dataGridViewLabels.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { DropdownMenuItem } from '../../DropdownMenu/DropdownMenuPrimitives.jsx';
import { getDataGridColumnStats, formatDataGridColumnStat } from '../dataGridColumnStats.js';
const STAT_LABEL_KEYS = {
  count: 'statCount',
  distinct: 'statDistinct',
  empty: 'statEmpty',
  min: 'statMin',
  max: 'statMax',
  avg: 'statAvg',
  sum: 'statSum'
};
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
