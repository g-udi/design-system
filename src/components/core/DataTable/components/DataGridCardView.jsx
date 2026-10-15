'use client';
import { useDataGrid } from '../DataGrid.jsx';
import { useDataGridViewLabels } from '../dataGridViewLabels.jsx';
import { flexRender, Subscribe } from '@tanstack/react-table';
import { cn } from '../../../../utilities/cn/index.js';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader
} from '../../Card/CardPrimitives.jsx';
import { Checkbox } from '../../Checkbox/CheckboxPrimitives.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../ToggleGroup/ToggleGroupPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { getColumnHeaderLabel } from '../dataGridModel.js';
import { getDataGridCardSlots } from '../dataGridViewModel.js';
import { getDataGridTableRowSections } from '../dataGridTableModel.js';
function renderCell(cell) {
  return flexRender(cell.column.columnDef.cell, cell.getContext());
}
function getRowTitleText(row, slots) {
  const value = slots.title ? row.getValue(slots.title.column.id) : row.id;
  return value == null ? String(row.id) : String(value);
}
function DataGridCardSelect({ row, title }) {
  const text = useDataGridViewLabels();
  return (
    <Subscribe source={row.table.atoms.rowSelection}>
      {() => (
        <Checkbox
          checked={
            row.getIsSomeSelected() && !row.getIsSelected()
              ? 'indeterminate'
              : row.getIsSelected()
          }
          disabled={!row.getCanSelect()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={text.selectCard(title)}
          className='mt-0.5'
        />
      )}
    </Subscribe>
  );
}
/** The default card: title, subtitle and media up top, badges and actions beside them, then a field list. */
function DataGridCard({ row, className }) {
  const { table } = useDataGrid();
  const text = useDataGridViewLabels();
  const slots = getDataGridCardSlots(row);
  const title = getRowTitleText(row, slots);
  const selectable = !!table.options.enableRowSelection;
  const isPinned = row.getIsPinned?.();
  return (
    <Card
      size='sm'
      data-slot='data-grid-card'
      data-state={selectable && row.getIsSelected() ? 'selected' : void 0}
      data-row-pinned={isPinned || void 0}
      className={cn(
        'h-full transition-shadow data-[state=selected]:ring-ui-primary data-[state=selected]:ring-2',
        className
      )}
    >
      <CardHeader className='grid-cols-[minmax(0,1fr)_auto] gap-x-2'>
        <div className='flex min-w-0 items-start gap-2.5'>
          {selectable ? <DataGridCardSelect row={row} title={title} /> : null}
          {slots.media ? (
            <div className='shrink-0'>{renderCell(slots.media)}</div>
          ) : null}
          <div className='flex min-w-0 flex-col gap-0.5'>
            <div className='text-ui-foreground min-w-0 text-sm font-medium [&_*]:max-w-full'>
              {slots.title ? renderCell(slots.title) : title}
            </div>
            {slots.subtitle ? (
              <div className='text-ui-muted-foreground min-w-0 truncate text-xs'>
                {renderCell(slots.subtitle)}
              </div>
            ) : null}
          </div>
        </div>
        {slots.badges.length || slots.actions.length || isPinned ? (
          <CardAction className='flex items-center gap-1.5'>
            {isPinned ? (
              <span className='text-ui-muted-foreground inline-flex items-center gap-1 text-xs'>
                <RegistryIcon lucide='PinIcon' className='size-3' />
                <span className='sr-only'>{text.pinnedCard}</span>
              </span>
            ) : null}
            {slots.badges.map((cell) => (
              <span key={cell.id}>{renderCell(cell)}</span>
            ))}
            {slots.actions.map((cell) => (
              <span key={cell.id}>{renderCell(cell)}</span>
            ))}
          </CardAction>
        ) : null}
      </CardHeader>
      {slots.fields.length ? (
        <CardContent>
          <dl className='grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 text-sm'>
            {slots.fields.map((cell) => (
              <div key={cell.id} className='contents'>
                <dt className='text-ui-muted-foreground truncate text-xs'>
                  {cell.column.columnDef.meta?.cardLabel ??
                    getColumnHeaderLabel(cell.column)}
                </dt>
                <dd className='min-w-0 truncate'>{renderCell(cell)}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      ) : null}
    </Card>
  );
}
/**
 * The grid's rows as responsive cards. It reads the same row model as the
 * table (sorting, filters, pagination and pinned rows), and selection stays
 * shared, so switching views keeps every choice. `renderCard` replaces the
 * default card; `minCardWidth` sets the column track.
 */
function DataGridCardView({
  renderCard,
  minCardWidth = '16rem',
  className,
  'aria-label': ariaLabel
}) {
  const { table, props, i18n, isLoading } = useDataGrid();
  const { topRows, centerRows, bottomRows } = getDataGridTableRowSections(
    table,
    props.tableLayout?.rowsPinnable
  );
  const rows = [...topRows, ...centerRows, ...bottomRows];
  if (!rows.length) {
    return (
      <div
        data-slot='data-grid-card-view-empty'
        className='text-ui-muted-foreground py-10 text-center text-sm'
      >
        {isLoading
          ? props.loadingMessage || i18n.labels.loading
          : props.emptyMessage || i18n.labels.empty}
      </div>
    );
  }
  return (
    <ul
      data-slot='data-grid-card-view'
      aria-label={ariaLabel}
      aria-busy={isLoading || void 0}
      style={{ '--data-grid-card-min': minCardWidth }}
      className={cn(
        'grid grid-cols-[repeat(auto-fill,minmax(min(100%,var(--data-grid-card-min)),1fr))] gap-3',
        className
      )}
    >
      {rows.map((row) => (
        <li key={row.id} data-row-id={row.id} className='min-w-0'>
          {renderCard ? (
            renderCard({
              row,
              table,
              slots: getDataGridCardSlots(row),
              isSelected: row.getIsSelected()
            })
          ) : (
            <DataGridCard row={row} />
          )}
        </li>
      ))}
    </ul>
  );
}
/** Table or cards: a two-option toggle whose labels fold into icons on narrow screens. */
function DataGridViewToggle({ value, onValueChange, labels, className }) {
  const text = useDataGridViewLabels(labels);
  return (
    <ToggleGroup
      type='single'
      variant='outline'
      size='sm'
      spacing={0}
      value={value}
      onValueChange={(next) => next && onValueChange?.(next)}
      aria-label={text.viewMode}
      className={className}
    >
      <ToggleGroupItem value='table' aria-label={text.tableView}>
        <RegistryIcon lucide='TableIcon' />
        <span className='max-md:sr-only'>{text.tableView}</span>
      </ToggleGroupItem>
      <ToggleGroupItem value='cards' aria-label={text.cardView}>
        <RegistryIcon lucide='LayoutGridIcon' />
        <span className='max-md:sr-only'>{text.cardView}</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
export { DataGridCard, DataGridCardView, DataGridViewToggle };
