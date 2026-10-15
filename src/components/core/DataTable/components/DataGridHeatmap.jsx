'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { getDataGridHeatmapColor, getDataGridColumnDomain } from '../dataGridColumnStats.js';
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
