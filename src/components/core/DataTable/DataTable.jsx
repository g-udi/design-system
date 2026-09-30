'use client';

import { Fragment, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import Button from '../Button';
import Input from '../Input';
import Icon from '../Icon';
import Skeleton from '../Skeleton';
import Spinner from '../Spinner';
import EmptyState from '../EmptyState';
import DropdownMenu, { DropdownMenuCheckboxItem, DropdownMenuItem } from '../DropdownMenu';
import { cn } from '../../../utilities/cn';

/*
 * Anatomy: uppercase tracked headers on the surface,
 * hairline rows, a synced column + row hover, a tinted wash for selected rows,
 * declarative `align` / `width` / `sticky` columns, and host-owned filtering.
 */

function SelectionCheckbox({ mixed, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(mixed);
  }, [mixed]);
  return <input {...props} ref={ref} type='checkbox' className='ds-table-check' />;
}

const densities = {
  compact: { cell: 'px-3 py-1.5', head: 'h-9 px-3', skeleton: 3 },
  normal: { cell: 'px-4 py-2.5', head: 'h-10 px-4', skeleton: 4 },
  comfortable: { cell: 'px-5 py-3.5', head: 'h-11 px-5', skeleton: 4 }
};
const emptyRows = [];
const emptyColumns = [];
const defaultRowId = (row, index) => String(row.id ?? index);
const interactiveTarget = 'a,button,input,select,textarea,label,[role="menuitem"],[role="checkbox"]';
const sortState = { asc: 'ascending', desc: 'descending' };
const pagerButtons = [
  ['First page', 'ChevronsLeft', 'firstPage', 'getCanPreviousPage'],
  ['Previous', 'ChevronLeft', 'previousPage', 'getCanPreviousPage'],
  ['Next', 'ChevronRight', 'nextPage', 'getCanNextPage'],
  ['Last page', 'ChevronsRight', 'lastPage', 'getCanNextPage']
];

/** Client collections up to a few hundred rows. Remote fetching, filter predicates, and persistence stay in the host. */
export const DataTable = ({
  caption,
  className,
  columns = emptyColumns,
  overflowLabel = 'Scrollable data table',
  rows = emptyRows,
  searchable = false,
  searchLabel = 'Search table',
  sortable = false,
  selectable = false,
  columnVisibility = false,
  pagination = false,
  pageSize = 10,
  density = 'normal',
  striped = false,
  footer = false,
  toolbar,
  getRowId = defaultRowId,
  selection,
  onSelectionChange,
  renderSelectionActions,
  renderExpanded,
  canExpand,
  expandMode = 'single',
  getRowActions,
  onRowClick,
  groupBy,
  loading = false,
  refreshing = false,
  error,
  onRetry,
  emptyTitle = 'No records',
  emptyDescription = 'Records will appear here when they are available.',
  labels = {}
}) => {
  const descriptionId = useId();
  const scrollRef = useRef(null);
  const headerRefs = useRef({});
  const [edges, setEdges] = useState({ left: false, right: false });
  const [pins, setPins] = useState({});
  const [query, setQuery] = useState('');
  const [sorting, setSorting] = useState([]);
  const [internalSelection, setInternalSelection] = useState({});
  const [visibility, setVisibility] = useState({});
  const [expanded, setExpanded] = useState(() => new Set());
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [hoverColumn, setHoverColumn] = useState(null);
  const size = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 10;
  const [page, setPage] = useState({ pageIndex: 0, pageSize: size });
  const selected = selection ?? internalSelection;
  const spacing = densities[density] || densities.normal;
  const expandable = typeof renderExpanded === 'function';
  const withActions = typeof getRowActions === 'function';

  const definitions = useMemo(
    () =>
      columns.map((column) => ({
        id: column.key,
        accessorFn: column.accessor || ((row) => row[column.key]),
        header: column.header,
        cell: (context) => (column.render ? column.render(context.row.original) : context.getValue()),
        enableSorting: sortable && column.sortable !== false,
        enableGlobalFilter: column.searchable !== false,
        enableHiding: column.hideable !== false,
        sortingFn: column.sortingFn || 'auto',
        meta: column
      })),
    [columns, sortable]
  );
  const resetPage = () => setPage((current) => ({ ...current, pageIndex: 0 }));
  const table = useReactTable({
    data: rows,
    columns: definitions,
    getRowId,
    state: {
      sorting,
      globalFilter: query,
      rowSelection: selected,
      columnVisibility: visibility,
      pagination: { ...page, pageSize: size }
    },
    onSortingChange: (updater) => {
      setSorting(updater);
      resetPage();
    },
    onGlobalFilterChange: (updater) => {
      setQuery(updater);
      resetPage();
    },
    onColumnVisibilityChange: setVisibility,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(selected) : updater;
      if (selection === undefined) setInternalSelection(next);
      onSelectionChange?.(next);
    },
    onPaginationChange: setPage,
    enableRowSelection: selectable,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined
  });
  const pageCount = table.getPageCount();
  const filteredRows = table.getFilteredRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const pageRows = table.getRowModel().rows;
  const count = visibleColumns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (withActions ? 1 : 0);

  useEffect(() => {
    if (pagination && page.pageIndex >= pageCount)
      setPage((current) => ({ ...current, pageIndex: Math.max(0, pageCount - 1) }));
  }, [pagination, page.pageIndex, pageCount]);

  // Scroll edges drive the chevron affordances; measured header widths drive sticky offsets.
  // Pinning releases when pinned columns would cover most of the viewport, so every column stays reachable.
  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return undefined;
    const update = () => {
      const next = {
        left: element.scrollLeft > 1,
        right: Math.ceil(element.scrollLeft + element.clientWidth) < element.scrollWidth - 1
      };
      setEdges((current) => (current.left === next.left && current.right === next.right ? current : next));
      const leaves = table.getVisibleLeafColumns();
      const order = [...(selectable ? ['__select'] : []), ...(expandable ? ['__expand'] : []), ...leaves.map((column) => column.id)];
      const sticky = (id) => leaves.find((column) => column.id === id)?.columnDef.meta?.sticky;
      const leftIds = order.slice(0, order.findLastIndex((id) => sticky(id) === 'left') + 1);
      const rightIds = order.filter((id) => sticky(id) === 'right');
      const width = (id) => headerRefs.current[id]?.getBoundingClientRect().width || 0;
      const pinnedWidth = [...leftIds, ...rightIds].reduce((sum, id) => sum + width(id), 0);
      const nextPins = {};
      if (pinnedWidth && pinnedWidth < element.clientWidth * 0.75) {
        let offset = 0;
        for (const id of leftIds) {
          nextPins[id] = { side: 'left', offset, edge: id === leftIds.at(-1) };
          offset += width(id);
        }
        offset = 0;
        for (const id of [...rightIds].reverse()) {
          nextPins[id] = { side: 'right', offset, edge: id === rightIds[0] };
          offset += width(id);
        }
      }
      setPins((current) => (JSON.stringify(current) === JSON.stringify(nextPins) ? current : nextPins));
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => {
      element.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [rows, visibility, columns, selectable, expandable]);

  const pinStyle = (id) => (pins[id] ? { position: 'sticky', [pins[id].side]: pins[id].offset } : undefined);
  const pinClass = (id, header) =>
    pins[id] && cn('ds-table-pinned', header ? 'z-20' : 'z-10', pins[id].edge && (pins[id].side === 'left' ? 'ds-table-pin-left' : 'ds-table-pin-right'));
  const align = (column) => ({ right: 'text-right', center: 'text-center' })[column.columnDef.meta?.align] || 'text-left';
  const numeric = (column) => column.columnDef.meta?.align === 'right' && 'tabular-nums';
  const toggleIn = (setter, key, single) =>
    setter((current) => {
      const next = new Set(single && !current.has(key) ? [] : current);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const groups = useMemo(() => {
    if (typeof groupBy !== 'function') return null;
    const buckets = new Map();
    for (const row of pageRows) {
      const group = groupBy(row.original);
      const key = String(group?.key ?? group ?? '');
      if (!buckets.has(key)) buckets.set(key, { key, label: group?.label ?? key, rows: [] });
      buckets.get(key).rows.push(row);
    }
    return [...buckets.values()];
  }, [groupBy, pageRows]);

  const renderRow = (row, index) => {
    const isExpanded = expandable && expanded.has(row.id);
    const expandAllowed = expandable && (canExpand ? canExpand(row.original) : true);
    const actions = withActions ? getRowActions(row.original) || [] : [];
    const activate = onRowClick && (() => onRowClick(row.original));
    return (
      <Fragment key={row.id}>
        <tr
          data-selected={row.getIsSelected() || undefined}
          data-striped={(striped && index % 2 === 1) || undefined}
          data-expanded={isExpanded || undefined}
          data-interactive={activate ? true : undefined}
          tabIndex={activate ? 0 : undefined}
          onClick={activate && ((event) => !event.target.closest(interactiveTarget) && activate())}
          onKeyDown={
            activate &&
            ((event) => {
              if (event.target !== event.currentTarget || !['Enter', ' '].includes(event.key)) return;
              event.preventDefault();
              activate();
            })
          }
          className='ds-table-row'
        >
          {selectable && (
            <td style={pinStyle('__select')} className={cn('ds-table-cell w-10', spacing.cell, expandable && 'pe-1', pinClass('__select'))}>
              <SelectionCheckbox
                aria-label={`${labels.selectRow || 'Select row'} ${row.id}`}
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onChange={row.getToggleSelectedHandler()}
              />
            </td>
          )}
          {expandable && (
            <td style={pinStyle('__expand')} className={cn('ds-table-cell w-9 px-0', pinClass('__expand'))}>
              {expandAllowed && (
                <button
                  type='button'
                  aria-expanded={isExpanded}
                  aria-label={`${labels.expand || 'Details for'} ${row.id}`}
                  onClick={() => toggleIn(setExpanded, row.id, expandMode === 'single')}
                  className='ds-table-icon-button'
                >
                  <Icon name='ChevronDown' decorative size='sm' className={cn('ds-motion-icon', !isExpanded && '-rotate-90')} />
                </button>
              )}
            </td>
          )}
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              style={{ ...pinStyle(cell.column.id), width: cell.column.columnDef.meta?.width }}
              data-column-hover={hoverColumn === cell.column.id || undefined}
              onMouseEnter={() => setHoverColumn(cell.column.id)}
              className={cn('ds-table-cell', spacing.cell, align(cell.column), numeric(cell.column), cell.column.columnDef.meta?.className, pinClass(cell.column.id))}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
          {withActions && (
            <td className='ds-table-cell w-10 px-1 text-right'>
              {actions.length > 0 && (
                <DropdownMenu
                  trigger={
                    <button type='button' aria-label={`${labels.rowActions || 'Actions for'} ${row.id}`} className='ds-table-icon-button'>
                      <Icon name='MoreHorizontal' decorative size='sm' />
                    </button>
                  }
                >
                  {actions.map((action) => (
                    <DropdownMenuItem
                      key={action.label}
                      destructive={action.tone === 'danger'}
                      disabled={action.disabled}
                      onSelect={() => action.onSelect?.(row.original)}
                    >
                      {action.icon && <Icon name={action.icon} decorative size='sm' />}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenu>
              )}
            </td>
          )}
        </tr>
        {isExpanded && (
          <tr className='ds-table-expanded'>
            <td colSpan={count} className={cn('ds-table-cell', spacing.cell)}>
              {renderExpanded(row.original)}
            </td>
          </tr>
        )}
      </Fragment>
    );
  };

  const emptyBody = (
    <tr>
      <td colSpan={Math.max(1, count)} className='ds-table-empty'>
        {error ? (
          <div role='alert'>
            <EmptyState
              compact
              title={labels.errorTitle || 'Unable to load records'}
              description={error}
              actions={onRetry && <Button size='sm' onClick={onRetry}>{labels.retry || 'Try again'}</Button>}
            />
          </div>
        ) : (
          <EmptyState
            compact
            title={query ? labels.noResults || 'No matching records' : emptyTitle}
            description={query ? labels.noResultsDescription || 'Try a different search or clear the query.' : emptyDescription}
            actions={
              query && (
                <Button size='sm' variant='outline' tone='neutral' onClick={() => table.setGlobalFilter('')}>
                  {labels.clear || 'Clear search'}
                </Button>
              )
            }
          />
        )}
      </td>
    </tr>
  );
  const skeletonBody = Array.from({ length: Math.min(size, spacing.skeleton) }, (_, index) => (
    <tr key={index} className='ds-table-row'>
      {Array.from({ length: Math.max(1, count) }, (__, cell) => (
        <td key={cell} className={cn('ds-table-cell', spacing.cell)}>
          {index === 0 && cell === 0 && <span role='status' className='sr-only'>{labels.loading || 'Loading records…'}</span>}
          <Skeleton className={cn('h-4', cell === 0 && (selectable || expandable) ? 'w-4' : index % 2 ? 'w-3/5' : 'w-4/5')} />
        </td>
      ))}
    </tr>
  ));
  const body = loading
    ? skeletonBody
    : error || !pageRows.length
      ? emptyBody
      : groups
        ? groups.map((group) => {
            const open = !collapsed.has(group.key);
            return (
              <Fragment key={group.key}>
                <tr className='ds-table-group'>
                  <th scope='rowgroup' colSpan={count} className='p-0'>
                    <button type='button' aria-expanded={open} onClick={() => toggleIn(setCollapsed, group.key)} className={cn('ds-table-group-toggle', spacing.head)}>
                      <Icon name='ChevronDown' decorative size='xs' className={cn('ds-motion-icon', !open && '-rotate-90')} />
                      {group.label}
                      <span className='ds-table-count'>{group.rows.length}</span>
                    </button>
                  </th>
                </tr>
                {open && group.rows.map(renderRow)}
              </Fragment>
            );
          })
        : pageRows.map(renderRow);
  const hasTools = searchable || columnVisibility || toolbar || selectedRows.length > 0;
  const firstIndex = page.pageIndex * size;

  return (
    <div className={cn('ds-table-frame', className)} aria-busy={loading || refreshing}>
      {hasTools && (
        <div className='ds-table-tools'>
          {selectedRows.length > 0 ? (
            <>
              <span role='status' className='text-sm font-medium text-text'>
                {selectedRows.length} {labels.selected || 'selected'}
              </span>
              <Button size='sm' variant='ghost' tone='neutral' onClick={() => table.resetRowSelection()}>
                {labels.clearSelection || 'Clear'}
              </Button>
              <div className='ds-actions ms-auto'>{renderSelectionActions?.(selectedRows.map((row) => row.original))}</div>
            </>
          ) : (
            <>
              {searchable && (
                <Input
                  aria-label={searchLabel}
                  type='search'
                  value={query}
                  onChange={(event) => table.setGlobalFilter(event.target.value)}
                  placeholder={labels.searchPlaceholder || 'Search records…'}
                  prefix={<Icon name='Search' decorative size='sm' />}
                  suffix={
                    <span className='ds-table-count' aria-hidden='true'>
                      {filteredRows.length} / {rows.length}
                    </span>
                  }
                />
              )}
              {toolbar}
              {columnVisibility && (
                <DropdownMenu
                  trigger={
                    <Button variant='outline' tone='neutral' size='sm'>
                      <Icon name='Columns3' decorative size='sm' />
                      {labels.columns || 'Columns'}
                    </Button>
                  }
                >
                  {table
                    .getAllLeafColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        disabled={column.getIsVisible() && visibleColumns.length === 1}
                        onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                        onSelect={(event) => event.preventDefault()}
                      >
                        {column.columnDef.header}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenu>
              )}
            </>
          )}
        </div>
      )}
      <div className='relative min-w-0' onMouseLeave={() => setHoverColumn(null)}>
        <div
          ref={scrollRef}
          role='region'
          tabIndex={0}
          aria-label={caption ? `${caption} scrollable table` : overflowLabel}
          aria-describedby={descriptionId}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
            event.preventDefault();
            event.currentTarget.scrollBy({ left: event.key === 'ArrowLeft' ? -80 : 80 });
          }}
          className='ds-table-scroll'
        >
          <table className='ds-table'>
            {caption && <caption className='sr-only'>{caption}</caption>}
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {selectable && (
                    <th
                      scope='col'
                      ref={(node) => (headerRefs.current.__select = node)}
                      style={pinStyle('__select')}
                      className={cn('ds-table-head w-10', spacing.head, expandable && 'pe-1', pinClass('__select', true))}
                    >
                      <SelectionCheckbox
                        aria-label={labels.selectPage || 'Select this page'}
                        checked={table.getIsAllPageRowsSelected()}
                        mixed={table.getIsSomePageRowsSelected()}
                        disabled={!rows.length || loading}
                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                      />
                    </th>
                  )}
                  {expandable && (
                    <th
                      scope='col'
                      ref={(node) => (headerRefs.current.__expand = node)}
                      style={pinStyle('__expand')}
                      className={cn('ds-table-head w-9 px-0', pinClass('__expand', true))}
                    >
                      <span className='sr-only'>{labels.details || 'Details'}</span>
                    </th>
                  )}
                  {group.headers.map((header) => {
                    const direction = header.column.getIsSorted();
                    const label = flexRender(header.column.columnDef.header, header.getContext());
                    return (
                      <th
                        key={header.id}
                        scope='col'
                        ref={(node) => (headerRefs.current[header.column.id] = node)}
                        style={{ ...pinStyle(header.column.id), width: header.column.columnDef.meta?.width }}
                        aria-sort={header.column.getCanSort() ? sortState[direction] || 'none' : undefined}
                        data-column-hover={hoverColumn === header.column.id || undefined}
                        onMouseEnter={() => setHoverColumn(header.column.id)}
                        className={cn('ds-table-head', spacing.head, align(header.column), pinClass(header.column.id, true))}
                      >
                        {header.column.getCanSort() ? (
                          <button
                            type='button'
                            data-sorted={direction || undefined}
                            className={cn('ds-table-sort', header.column.columnDef.meta?.align === 'right' && 'flex-row-reverse')}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {label}
                            <Icon name={direction === 'asc' ? 'ChevronUp' : direction === 'desc' ? 'ChevronDown' : 'ChevronsUpDown'} decorative size='xs' />
                          </button>
                        ) : (
                          label
                        )}
                      </th>
                    );
                  })}
                  {withActions && (
                    <th scope='col' className='ds-table-head w-10 px-1'>
                      <span className='sr-only'>{labels.actions || 'Actions'}</span>
                    </th>
                  )}
                </tr>
              ))}
            </thead>
            <tbody>{body}</tbody>
            {footer && !loading && !error && pageRows.length > 0 && (
              <tfoot>
                <tr>
                  {selectable && <td className={cn('ds-table-foot', spacing.cell)} />}
                  {expandable && <td className='ds-table-foot' />}
                  {visibleColumns.map((column, index) => {
                    const total = column.columnDef.meta?.footer;
                    return (
                      <td key={column.id} style={pinStyle(column.id)} className={cn('ds-table-foot', spacing.cell, align(column), numeric(column), pinClass(column.id))}>
                        {typeof total === 'function'
                          ? total(filteredRows.map((row) => row.original))
                          : index === 0 && `${filteredRows.length} ${labels.records || 'records'}`}
                      </td>
                    );
                  })}
                  {withActions && <td className='ds-table-foot' />}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        {['left', 'right'].map((side) => (
          <button
            key={side}
            type='button'
            tabIndex={-1}
            aria-hidden='true'
            onClick={() => scrollRef.current?.scrollBy({ left: side === 'left' ? -240 : 240, behavior: 'smooth' })}
            data-visible={edges[side] || undefined}
            className={cn('ds-table-edge', side === 'left' ? 'left-2' : 'right-2')}
          >
            <Icon name={side === 'left' ? 'ChevronLeft' : 'ChevronRight'} decorative size='xs' />
          </button>
        ))}
        {refreshing && !loading && (
          <span role='status' className='ds-table-pending'>
            <Spinner size='xs' label='' />
            {labels.refreshing || 'Updating…'}
          </span>
        )}
      </div>
      <span id={descriptionId} className='sr-only'>
        {labels.scrollHint || 'Scroll horizontally to see all columns.'}
      </span>
      {pagination && (
        <div className='ds-table-footer'>
          <span role='status' className='text-xs text-text-muted'>
            {filteredRows.length
              ? `${labels.showing || 'Showing'} ${firstIndex + 1}–${Math.min(firstIndex + size, filteredRows.length)} ${labels.of || 'of'} ${filteredRows.length}`
              : `0 ${labels.records || 'records'}`}
          </span>
          <div className='flex items-center gap-1'>
            <span className='me-2 text-xs text-text-muted'>
              {labels.page || 'Page'} {Math.min(page.pageIndex + 1, Math.max(1, pageCount))} {labels.of || 'of'} {Math.max(1, pageCount)}
            </span>
            {pagerButtons.map(([name, icon, action, can]) => (
              <Button
                key={name}
                size='sm'
                variant='outline'
                tone='neutral'
                aria-label={labels[name] || name}
                disabled={!table[can]() || loading}
                onClick={() => table[action]()}
                className={cn('size-7 min-h-7 p-0', name.endsWith('page') && 'max-sm:hidden')}
              >
                <Icon name={icon} decorative size='sm' />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default DataTable;
