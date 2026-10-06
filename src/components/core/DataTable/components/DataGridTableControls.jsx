'use client';
import { useDataGrid } from '../DataGrid.jsx';
import { Subscribe } from '@tanstack/react-table';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Checkbox } from '../../Checkbox/CheckboxPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { getDataGridTreeIndentStyle } from '../dataGridTableModel.js';
function DataGridTableRowPin({ row }) {
  const { i18n } = useDataGrid();
  const isPinned = row.getIsPinned();
  return (
    <Button
      variant='ghost'
      tone='neutral'
      size='icon-sm'
      aria-label={isPinned ? i18n.labels.unpinRow : i18n.labels.pinRow}
      aria-pressed={Boolean(isPinned)}
      onClick={(event) => {
        event.stopPropagation();
        row.pin(isPinned ? false : 'top');
      }}
      className={cn('text-ui-muted-foreground hover:text-ui-foreground', isPinned && 'text-ui-primary hover:text-ui-primary')}
    >
      <RegistryIcon lucide='Pin' className={cn('size-4', isPinned && 'fill-current')} />
    </Button>
  );
}
function DataGridTableRowSelect({ row }) {
  const { i18n } = useDataGrid();
  return (
    <Subscribe source={row.table.atoms.rowSelection}>
      {() => (
        <>
          <Checkbox
            disabled={!row.getCanSelect()}
            checked={
              row.getIsSomeSelected() && !row.getIsSelected()
                ? 'indeterminate'
                : row.getIsSelected()
            }
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(event) => {
              event.stopPropagation();
            }}
            aria-label={i18n.labels.selectRow}
            className='align-[inherit]'
          />
        </>
      )}
    </Subscribe>
  );
}
function DataGridTableRowSelectAll() {
  const { i18n, table, recordCount, isLoading } = useDataGrid();
  return (
    <Subscribe source={table.atoms.rowSelection}>
      {() => {
        const isAllSelected = table.getIsAllPageRowsSelected();
        const isSomeSelected = table.getIsSomePageRowsSelected();
        return (
          <Checkbox
            checked={
              isSomeSelected && !isAllSelected ? 'indeterminate' : isAllSelected
            }
            disabled={isLoading || recordCount === 0}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label={i18n.labels.selectAll}
            className='align-[inherit]'
          />
        );
      }}
    </Subscribe>
  );
}
function DataGridTableRowExpand({ row, indent = 20, className, children }) {
  const { i18n, props } = useDataGrid();
  const isExpanded = row.getIsExpanded();
  return (
    <span
      data-slot='data-grid-table-row-expand'
      style={getDataGridTreeIndentStyle(row, indent)}
      className={cn(
        'inline-flex shrink-0 items-center ps-(--data-grid-tree-padding) align-middle',
        className
      )}
    >
      {row.getCanExpand() ? (
        <Button
          variant='ghost'
          tone='neutral'
          size={props.tableLayout?.dense ? 'icon-xs' : 'icon-sm'}
          aria-expanded={isExpanded}
          aria-label={
            isExpanded ? i18n.labels.collapseRow : i18n.labels.expandRow
          }
          onClick={(event) => {
            event.stopPropagation();
            row.toggleExpanded();
          }}
          className='text-ui-muted-foreground hover:text-ui-foreground'
        >
          {children ?? (
            <RegistryIcon
              lucide='ChevronDown'
              className='size-4 transition-transform duration-200 in-aria-[expanded=false]:-rotate-90 rtl:in-aria-[expanded=false]:rotate-90'
            />
          )}
        </Button>
      ) : (
        // Leaf spacer: compact by design so leaf content sits near the
        // parent label instead of a full toggle width deeper.
        <span aria-hidden='true' className='w-2 shrink-0' />
      )}
    </span>
  );
}
export { DataGridTableRowPin, DataGridTableRowSelect, DataGridTableRowSelectAll, DataGridTableRowExpand };
