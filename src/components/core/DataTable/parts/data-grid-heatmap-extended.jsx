'use client';
import { chartPalettes } from '../../../../tokens/index.js';
import { getDataGridColumnStats } from './data-grid-column-stats-extended.jsx';
import { cn } from '../../../../utilities/cn/index.js';
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
/**
 * A heat chip for a numeric cell. Pass the TanStack `cell` to colour it against
 * its column's visible range, or `value` and `domain` directly. `children`
 * replaces the printed value (for a formatted number).
 */
function DataGridHeatmapCell({
  cell,
  value: valueProp,
  domain,
  scale = 'heatmap',
  midpoint,
  className,
  children
}) {
  const value = valueProp ?? cell?.getValue();
  const resolvedDomain =
    domain ?? (cell ? getDataGridColumnDomain(cell.column) : [0, 1]);
  const { step, background, color } = getDataGridHeatmapColor(value, {
    domain: resolvedDomain,
    scale,
    midpoint
  });
  return (
    <span
      data-slot='data-grid-heatmap-cell'
      data-heat-step={step}
      style={{ backgroundColor: background, color }}
      className={cn(
        'inline-flex min-w-12 items-center justify-end rounded-sm px-1.5 py-0.5 text-xs font-medium tabular-nums',
        className
      )}
    >
      {children ?? (value == null ? '—' : String(value))}
    </span>
  );
}
export { DataGridHeatmapCell };
