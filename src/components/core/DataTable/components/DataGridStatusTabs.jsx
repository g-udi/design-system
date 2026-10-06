'use client';
import { useControllableState } from '../../../../hooks/state/use-controllable-state.js';
import { useDataGrid } from '../DataGrid.jsx';
import { useDataGridViewLabels } from '../dataGridViewLabels.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import { Badge } from '../../Pill/Badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../Tabs/Tabs.jsx';
export const DATA_GRID_STATUS_ALL = 'all';
/**
 * Exact-match filter for a status column. `dataGridFeatures` registers no
 * filter-function names, so a column filtered by status tabs takes this
 * function as its `filterFn`; an empty filter value matches every row.
 */
export function dataGridEqualsFilter(row, columnId, filterValue) {
  if (filterValue === void 0 || filterValue === null || filterValue === '')
    return true;
  return row.getValue(columnId) === filterValue;
}
dataGridEqualsFilter.autoRemove = (value) =>
  value === void 0 || value === null || value === '';
/**
 * Per-status counts from the column's faceted values. Facets apply every
 * other filter but not the column's own, so each tab says how many rows
 * choosing it would show.
 */
export function getDataGridStatusCounts(column, options) {
  const facets = column.getFacetedUniqueValues();
  const counts = { [DATA_GRID_STATUS_ALL]: column.getFacetedRowModel().rows.length };
  for (const option of options) counts[option.value] = facets.get(option.value) ?? 0;
  return counts;
}
/**
 * Status tabs over a grid: an "All" tab plus one per status, each with a live
 * count. Given `columnId`, a tab filters that column and counts come from its
 * facets; otherwise pass `value`, `onValueChange` and `counts` and filter in
 * the host. The grid goes in `children`, which renders as the tab panel.
 */
function DataGridStatusTabs({
  columnId,
  options,
  value: valueProp,
  defaultValue = DATA_GRID_STATUS_ALL,
  onValueChange,
  counts: countsProp,
  showAll = true,
  variant = 'underline',
  labels,
  actions,
  className,
  listClassName,
  panelClassName,
  children
}) {
  const { table } = useDataGrid();
  const text = useDataGridViewLabels(labels);
  const column = columnId ? table.getColumn(columnId) : null;
  const filterValue = column?.getFilterValue();
  const [value, handleChange] = useControllableState({
    value: valueProp ?? (column ? (filterValue ?? DATA_GRID_STATUS_ALL) : undefined),
    defaultValue,
    onChange: (next) => {
      if (column) {
        column.setFilterValue(next === DATA_GRID_STATUS_ALL ? void 0 : next);
        table.setPageIndex?.(0);
      }
      onValueChange?.(next);
    }
  });
  const counts =
    countsProp ?? (column ? getDataGridStatusCounts(column, options) : {});
  const tabs = showAll
    ? [{ value: DATA_GRID_STATUS_ALL, label: text.statusAll }, ...options]
    : options;
  return (
    <Tabs
      value={value}
      onValueChange={handleChange}
      className={cn('gap-0', className)}
      data-slot='data-grid-status-tabs'
    >
      <div className='border-ui-border flex min-w-0 items-end justify-between gap-2 border-b'>
        <TabsList
          variant={variant}
          aria-label={text.statusTabs}
          className={cn(
            'min-w-0 max-w-full flex-nowrap justify-start overflow-x-auto',
            listClassName
          )}
        >
          {tabs.map((tab) => {
            const count = counts[tab.value];
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className='shrink-0 gap-1.5'
                aria-label={
                  count === undefined ? void 0 : text.statusCount(tab.label, count)
                }
              >
                {tab.icon}
                {tab.label}
                {count !== undefined ? (
                  <Badge
                    variant={tab.value === value ? 'primary-light' : 'secondary'}
                    size='sm'
                    className='tabular-nums'
                    aria-hidden='true'
                  >
                    {count}
                  </Badge>
                ) : null}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {actions ? (
          <div className='flex shrink-0 items-center gap-2 pb-1.5'>{actions}</div>
        ) : null}
      </div>
      {/* One panel that follows the active tab: the grid never remounts. */}
      <TabsContent value={value} className={cn('min-w-0', panelClassName)}>
        {children}
      </TabsContent>
    </Tabs>
  );
}
export { DataGridStatusTabs };
