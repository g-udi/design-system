'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
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
import EmptyState from '../EmptyState';
import DropdownMenu, { DropdownMenuCheckboxItem } from '../DropdownMenu';
import { cn } from '../../../utilities/cn';

function SelectionCheckbox({ mixed, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(mixed);
  }, [mixed]);
  return (
    <input {...props} ref={ref} type='checkbox' className='ds-table-check' />
  );
}

const emptyRows = [];
const emptyColumns = [];
const defaultRowId = (row, index) => String(row.id ?? index);

/** Small and medium client collections. Keep remote fetching/pagination in the host. */
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
  getRowId = defaultRowId,
  selection,
  onSelectionChange,
  renderSelectionActions,
  loading = false,
  error,
  onRetry,
  emptyTitle = 'No records',
  emptyDescription = 'Records will appear here when they are available.',
  labels = {}
}) => {
  const descriptionId = useId();
  const scrollRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const [query, setQuery] = useState('');
  const [sorting, setSorting] = useState([]);
  const [internalSelection, setInternalSelection] = useState({});
  const [visibility, setVisibility] = useState({});
  const size =
    Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 10;
  const [page, setPage] = useState({ pageIndex: 0, pageSize: size });
  const selected = selection ?? internalSelection;
  const definitions = useMemo(
    () =>
      columns.map((column) => ({
        id: column.key,
        accessorFn: column.accessor || ((row) => row[column.key]),
        header: column.header,
        cell: (context) =>
          column.render
            ? column.render(context.row.original)
            : context.getValue(),
        enableSorting: sortable && column.sortable !== false,
        enableGlobalFilter: column.searchable !== false,
        enableHiding: column.hideable !== false,
        sortingFn: column.sortingFn || 'auto'
      })),
    [columns, sortable]
  );
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
      setPage((current) => ({ ...current, pageIndex: 0 }));
    },
    onGlobalFilterChange: (updater) => {
      setQuery(updater);
      setPage((current) => ({ ...current, pageIndex: 0 }));
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
  useEffect(() => {
    if (pagination && page.pageIndex >= pageCount)
      setPage((current) => ({
        ...current,
        pageIndex: Math.max(0, pageCount - 1)
      }));
  }, [pagination, page.pageIndex, pageCount]);
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return undefined;
    const update = () => {
      const next = {
        left: element.scrollLeft > 1,
        right:
          Math.ceil(element.scrollLeft + element.clientWidth) <
          element.scrollWidth - 1
      };
      setEdges((current) =>
        current.left === next.left && current.right === next.right
          ? current
          : next
      );
    };
    update();
    element.addEventListener('scroll', update);
    const observer = new ResizeObserver(update);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => {
      element.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [rows, visibility, columns]);
  const count = table.getVisibleLeafColumns().length + (selectable ? 1 : 0);
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  return (
    <div
      className={cn(
        'relative isolate min-w-0 max-w-full rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950',
        className
      )}
      aria-busy={loading}
    >
      {(searchable || columnVisibility || selectedRows.length > 0) && (
        <div className='ds-table-tools'>
          {searchable && (
            <Input
              aria-label={searchLabel}
              type='search'
              value={query}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              placeholder={labels.searchPlaceholder || 'Search records…'}
              prefix={<Icon name='Search' decorative size='sm' />}
            />
          )}
          {columnVisibility && (
            <DropdownMenu
              trigger={
                <Button variant='outline' tone='neutral' size='sm'>
                  {labels.columns || 'Columns'}
                  <Icon name='ChevronDown' decorative size='xs' />
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
                    disabled={
                      column.getIsVisible() &&
                      table.getVisibleLeafColumns().length === 1
                    }
                    onCheckedChange={(value) =>
                      column.toggleVisibility(Boolean(value))
                    }
                    onSelect={(event) => event.preventDefault()}
                  >
                    {column.columnDef.header}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenu>
          )}
          {selectedRows.length > 0 && (
            <div className='ds-actions'>
              <span role='status' className='ds-description'>
                {selectedRows.length} {labels.selected || 'selected'}
              </span>
              {renderSelectionActions?.(
                selectedRows.map((row) => row.original)
              )}
            </div>
          )}
        </div>
      )}
      <div className='relative min-w-0 overflow-hidden rounded-lg'>
        <div
          ref={scrollRef}
          role='region'
          tabIndex={0}
          aria-label={caption ? `${caption} scrollable table` : overflowLabel}
          aria-describedby={descriptionId}
          className='overflow-x-auto rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
        >
          <table className='w-full min-w-[560px] border-collapse bg-white text-left text-sm dark:bg-gray-950'>
            {caption && (
              <caption className='bg-white px-3 py-2 text-left text-sm font-medium text-gray-600 dark:bg-gray-950 dark:text-gray-300'>
                {caption}
              </caption>
            )}
            <thead className='bg-gray-50 dark:bg-gray-900'>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {selectable && (
                    <th
                      scope='col'
                      className='h-10 border-b border-gray-200 px-3 py-0 dark:border-gray-800'
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
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      scope='col'
                      aria-sort={
                        header.column.getCanSort()
                          ? header.column.getIsSorted() === 'asc'
                            ? 'ascending'
                            : header.column.getIsSorted() === 'desc'
                              ? 'descending'
                              : 'none'
                          : undefined
                      }
                      className='h-10 border-b border-gray-200 px-3 py-0 text-xs font-semibold uppercase text-gray-600 dark:border-gray-800 dark:text-gray-300'
                    >
                      {header.column.getCanSort() ? (
                        <button
                          type='button'
                          className='ds-table-sort'
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <Icon
                            name={
                              header.column.getIsSorted() === 'asc'
                                ? 'ArrowUp'
                                : header.column.getIsSorted() === 'desc'
                                  ? 'ArrowDown'
                                  : 'ArrowUpDown'
                            }
                            decorative
                            size='xs'
                          />
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className='bg-white dark:bg-gray-950'>
              {loading || error || !table.getRowModel().rows.length ? (
                <tr>
                  <td colSpan={Math.max(1, count)} className='ds-table-empty'>
                    {loading ? (
                      <span role='status'>
                        {labels.loading || 'Loading records…'}
                      </span>
                    ) : error ? (
                      <div role='alert'>
                        <EmptyState
                          compact
                          title={labels.errorTitle || 'Unable to load records'}
                          description={error}
                          actions={
                            onRetry && (
                              <Button size='sm' onClick={onRetry}>
                                {labels.retry || 'Try again'}
                              </Button>
                            )
                          }
                        />
                      </div>
                    ) : (
                      <EmptyState
                        compact
                        title={
                          query
                            ? labels.noResults || 'No matching records'
                            : emptyTitle
                        }
                        description={
                          query
                            ? labels.noResultsDescription ||
                              'Try a different search or clear the query.'
                            : emptyDescription
                        }
                        actions={
                          query && (
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => table.setGlobalFilter('')}
                            >
                              {labels.clear || 'Clear search'}
                            </Button>
                          )
                        }
                      />
                    )}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-selected={row.getIsSelected() || undefined}
                    className='border-b border-gray-100 bg-white last:border-b-0 data-[selected]:bg-blue-50 dark:border-gray-800 dark:bg-gray-950 dark:data-[selected]:bg-blue-950'
                  >
                    {selectable && (
                      <td className='px-3 py-2'>
                        <SelectionCheckbox
                          aria-label={`${labels.selectRow || 'Select row'} ${row.id}`}
                          checked={row.getIsSelected()}
                          onChange={row.getToggleSelectedHandler()}
                        />
                      </td>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className='px-3 py-2 text-gray-700 dark:text-gray-300'
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <span
          aria-hidden='true'
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-gray-950/10 to-transparent',
            !edges.left && 'opacity-0'
          )}
        />
        <span
          aria-hidden='true'
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-gray-950/10 to-transparent',
            !edges.right && 'opacity-0'
          )}
        />
      </div>
      <span id={descriptionId} className='sr-only'>
        Scroll horizontally to see all columns.
      </span>
      {pagination && (
        <div className='ds-table-footer'>
          <span role='status' className='ds-description'>
            {labels.page || 'Page'}{' '}
            {Math.min(page.pageIndex + 1, Math.max(1, pageCount))} /{' '}
            {Math.max(1, pageCount)} · {table.getFilteredRowModel().rows.length}{' '}
            {labels.records || 'records'}
          </span>
          <div className='ds-actions'>
            <Button
              size='sm'
              variant='outline'
              tone='neutral'
              disabled={!table.getCanPreviousPage() || loading}
              onClick={() => table.previousPage()}
            >
              {labels.previous || 'Previous'}
            </Button>
            <Button
              size='sm'
              variant='outline'
              tone='neutral'
              disabled={!table.getCanNextPage() || loading}
              onClick={() => table.nextPage()}
            >
              {labels.next || 'Next'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DataTable;
