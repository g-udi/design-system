/* The grouping-aware cell renderer shared by every body row variant. Server-safe,
 so public entries expose a callable function rather than a client reference. */
import { flexRender } from '@tanstack/react-table';
import { findDataGridColumnDef, formatDataGridAggregate } from './dataGridTableModel.js';
import { getDataGridCellIsRollup, renderDataGridRollupCell } from './dataGridStructureModel.js';
import { DataGridTableGroupedCell } from './components/DataGridTableCells.jsx';

/* One renderer for the three grouping cell modes: the grouped column's band
 cell, aggregated values (a column's `aggregatedCell`, or its formatted
 aggregate), and empty placeholders for leaf values under a group. */
export function renderDataGridCellContent(cell) {
  if (cell.getIsGrouped?.()) return <DataGridTableGroupedCell cell={cell} />;
  if (cell.getIsAggregated?.()) {
    // The table's built-in aggregatedCell only stringifies the value; columns
    // that do not render their own get grouping separators instead.
    if (!findDataGridColumnDef(cell.row.table?.options.columns, cell.column.id)?.aggregatedCell) {
      return (
        <span className='font-medium tabular-nums'>
          {formatDataGridAggregate(cell.getValue())}
        </span>
      );
    }
    return flexRender(cell.column.columnDef.aggregatedCell, cell.getContext());
  }
  // A group band has no record of its own: columns without an aggregate stay
  // empty there rather than echoing the first record in the group.
  if (cell.getIsPlaceholder?.() || cell.row.getIsGrouped?.()) return null;
  // Tree parents in `meta.rollup` columns show their descendants' aggregate.
  if (getDataGridCellIsRollup(cell)) return renderDataGridRollupCell(cell);
  return flexRender(cell.column.columnDef.cell, cell.getContext());
}
