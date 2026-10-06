'use client';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';

import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react';
import { flexRender, useTable } from '@tanstack/react-table';
import { dataGridFeatures } from './dataGridFeatures.js';
import { canPinTableColumns } from './dataGridTableModel.js';
import { useVirtualizer } from '@tanstack/react-virtual';
import Button from '../Button';
import Input from '../Input';
import Icon from '../Icon';
import Skeleton from '../Skeleton';
import { TableHead } from '../../mdx/Table/TablePrimitives.jsx';
import Loader from '../Loader';
import EmptyState from '../EmptyState';
import DropdownMenu, { DropdownMenuCheckboxItem } from '../DropdownMenu';
import {
  DropdownMenu as MenuRoot,
  DropdownMenuContent as MenuContent,
  DropdownMenuItem as MenuItem,
  DropdownMenuSeparator as MenuSeparator,
  DropdownMenuTrigger as MenuTrigger
} from '../DropdownMenu/DropdownMenuPrimitives.jsx';
import { Checkbox as CheckboxRoot } from '../Checkbox/CheckboxPrimitives.jsx';
import { downloadCsv, getTableExportRows, tableToCsv } from './tableExport.js';
import { cn } from '../../../utilities/cn';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';

/*
 * Anatomy: shared table headers and density,
 * hairline rows, a synced column + row hover, a tinted wash for selected rows,
 * declarative `align` / `width` / `sticky` columns, and host-owned filtering.
 */

const SelectionCheckbox = ({ checked, mixed, onCheckedChange, ...props }) => (
  <CheckboxRoot
    {...props}
    checked={mixed && !checked ? 'indeterminate' : checked}
    onCheckedChange={(value) => onCheckedChange(value === true)}
  />
);
// Expand and row-action triggers: a quiet icon button that stays tinted while its panel or menu is open.
const iconButtonClass = 'text-text-muted aria-expanded:bg-surface-muted aria-expanded:text-text';

const densities = {
  compact: { skeleton: 3, estimate: 33 },
  normal: { skeleton: 4, estimate: 37 },
  comfortable: { skeleton: 4, estimate: 45 }
};
const emptyRows = [];
const emptyColumns = [];
const emptyIds = [];
const emptySorting = [];
const emptySelection = {};
const emptyPinning = { top: [], bottom: [] };
const defaultRowId = (row, index) => String(row.id ?? index);
const interactiveTarget = 'a,button,input,select,textarea,label,[role="menuitem"],[role="checkbox"]';
const sortState = { asc: 'ascending', desc: 'descending' };
const pagerButtons = [
  ['First page', 'ChevronsLeft', 'firstPage', 'getCanPreviousPage'],
  ['Previous', 'ChevronLeft', 'previousPage', 'getCanPreviousPage'],
  ['Next', 'ChevronRight', 'nextPage', 'getCanNextPage'],
  ['Last page', 'ChevronsRight', 'lastPage', 'getCanNextPage']
];
// Pinned bands give way when they would leave less than this share of the viewport for scrolling rows.
const PINNED_BAND_LIMIT = 0.6;

// Column `sticky` is logical: `start`/`end` (or the older `left`/`right`, read as start/end) follow the reading direction.
const stickySide = (value) => (value === 'start' || value === 'left' ? 'start' : value === 'end' || value === 'right' ? 'end' : undefined);

/** Controlled when `value` is defined; the host may refuse or replace any change it is offered. */
const useControllable = (value, defaultValue, onChange) => useControllableState({ value, defaultValue, onChange });

/** Client collections up to a few thousand rows. Remote fetching, filter predicates, and persistence stay in the host. */
export const DataTable = ({
  caption,
  className,
  columns = emptyColumns,
  overflowLabel = 'Scrollable data table',
  rows = emptyRows,
  searchable = false,
  searchLabel = 'Search table',
  sortable = false,
  multiSort = false,
  sorting: sortingProp,
  defaultSorting = emptySorting,
  onSortingChange,
  selectable = false,
  columnVisibility = false,
  pagination = false,
  pageSize = 10,
  density = 'normal',
  headerVariant = 'muted',
  striped = false,
  footer = false,
  toolbar,
  getRowId = defaultRowId,
  getRowLabel,
  selection,
  defaultSelection = emptySelection,
  onSelectionChange,
  renderSelectionActions,
  renderExpanded,
  canExpand,
  expandMode = 'single',
  expanded: expandedProp,
  defaultExpanded = emptyIds,
  onExpandedChange,
  getRowActions,
  pinnableRows = false,
  rowPinning: rowPinningProp,
  defaultRowPinning = emptyPinning,
  onRowPinningChange,
  onRowClick,
  canActivateRow,
  groupBy,
  stickyHeader,
  stickyOffset = '0px',
  maxHeight,
  virtualize = 'auto',
  virtualThreshold = 100,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  loadMoreOnScroll = false,
  exportable = false,
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
  const tableRef = useRef(null);
  const headerRefs = useRef({});
  const returnFocusRef = useRef(null);
  const sentinelRef = useRef(null);
  const loadRequested = useRef(false);
  const [edges, setEdges] = useState({ left: false, right: false });
  const [pins, setPins] = useState({});
  const [rowOffsets, setRowOffsets] = useState({ head: 0, rows: {} });
  const [query, setQuery] = useState('');
  const [menuRowId, setMenuRowId] = useState(null);
  const [status, setStatus] = useState('');
  const [pageOverflow, setPageOverflow] = useState(false);
  const [sorting, setSorting] = useControllable(sortingProp, defaultSorting, onSortingChange);
  const [selected, setSelected] = useControllable(selection, defaultSelection, onSelectionChange);
  const [expandedIds, setExpandedIds] = useControllable(expandedProp, defaultExpanded, onExpandedChange);
  const [rowPinning, setRowPinning] = useControllable(rowPinningProp, defaultRowPinning, onRowPinningChange);
  const [visibility, setVisibility] = useState({});
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [hoverColumn, setHoverColumn] = useState(null);
  const size = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 10;
  const [page, setPage] = useState({ pageIndex: 0, pageSize: size });
  const spacing = densities[density] || densities.normal;
  const expandable = typeof renderExpanded === 'function';
  const pinningOn = pinnableRows || rowPinningProp !== undefined || defaultRowPinning !== emptyPinning;
  const withActions = typeof getRowActions === 'function' || pinnableRows;
  const expanded = useMemo(() => new Set(expandedIds), [expandedIds]);
  const exportOptions = exportable === true ? {} : exportable || null;

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
        sortFn: column.sortingFn || 'auto',
        meta: column
      })),
    [columns, sortable]
  );
  const resetPage = () => setPage((current) => ({ ...current, pageIndex: 0 }));
  const table = useTable({
    features: dataGridFeatures,
    data: rows,
    columns: definitions,
    getRowId,
    state: {
      sorting,
      globalFilter: query,
      rowSelection: selected,
      columnVisibility: visibility,
      rowPinning: pinningOn ? { top: rowPinning?.top || [], bottom: rowPinning?.bottom || [] } : emptyPinning,
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
    onRowSelectionChange: setSelected,
    onRowPinningChange: setRowPinning,
    onPaginationChange: setPage,
    enableRowSelection: selectable,
    enableRowPinning: pinningOn,
    // Pinned rows stay in view across sorting, searching and pages.
    keepPinnedRows: true,
    enableMultiSort: multiSort,
    globalFilterFn: 'includesString',
    manualPagination: !pagination
  });
  const pageCount = table.getPageCount();
  const filteredRows = table.getFilteredRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const topRows = pinningOn ? table.getTopRows() : emptyRows;
  const bottomRows = pinningOn ? table.getBottomRows() : emptyRows;
  const centerRows = pinningOn ? table.getCenterRows() : table.getRowModel().rows;
  const shownRows = topRows.length + centerRows.length + bottomRows.length;
  const count = visibleColumns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (withActions ? 1 : 0);

  const groups = useMemo(() => {
    if (typeof groupBy !== 'function') return null;
    const buckets = new Map();
    for (const row of centerRows) {
      const group = groupBy(row.original);
      const key = String(group?.key ?? group ?? '');
      if (!buckets.has(key)) buckets.set(key, { key, label: group?.label ?? key, rows: [] });
      buckets.get(key).rows.push(row);
    }
    return [...buckets.values()];
  }, [groupBy, centerRows]);

  // Long flat lists render only the rows in view; grouped and paged tables are already bounded.
  const virtualOn = !pagination && !groups && !loading && (virtualize === true || (virtualize === 'auto' && centerRows.length > virtualThreshold));
  const resolvedMaxHeight = maxHeight ?? (virtualOn ? '32rem' : undefined);
  const requestedSticky = stickyHeader === true ? 'container' : stickyHeader || (resolvedMaxHeight ? 'container' : false);
  // Page mode needs the table to fit its container; a table too wide for it scrolls sideways in place instead.
  const stickyMode = requestedSticky === 'page' && pageOverflow ? false : requestedSticky;
  const virtualizer = useVirtualizer({
    count: virtualOn ? centerRows.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => spacing.estimate,
    getItemKey: (index) => centerRows[index]?.id ?? index,
    overscan: 8,
    scrollMargin: rowOffsets.head,
    // A row and its open detail panel move as one item.
    measureElement: (element) => {
      const next = element.nextElementSibling;
      const detail = next?.dataset.expandedFor === element.dataset.rowId ? next.getBoundingClientRect().height : 0;
      return element.getBoundingClientRect().height + detail;
    }
  });

  useEffect(() => {
    if (pagination && page.pageIndex >= pageCount)
      setPage((current) => ({ ...current, pageIndex: Math.max(0, pageCount - 1) }));
  }, [pagination, page.pageIndex, pageCount]);

  // Scroll edges drive the chevron affordances; measured header widths drive sticky offsets.
  // Pinning releases when pinned columns would cover most of the viewport, so every column stays reachable.
  useIsomorphicLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return undefined;
    const update = () => {
      const viewport = element.getBoundingClientRect();
      element.style.setProperty('--ds-table-viewport-width', `${element.clientWidth}px`);
      const content = tableRef.current?.getBoundingClientRect();
      const viewportLeft = viewport.left + element.clientLeft;
      const viewportRight = viewportLeft + element.clientWidth;
      const next = {
        left: stickyMode !== 'page' && !!content && content.left < viewportLeft - 1,
        right: stickyMode !== 'page' && !!content && content.right > viewportRight + 1
      };
      setEdges((current) => (current.left === next.left && current.right === next.right ? current : next));
      const leaves = table.getVisibleLeafColumns();
      const order = [...(selectable ? ['__select'] : []), ...(expandable ? ['__expand'] : []), ...leaves.map((column) => column.id)];
      const sticky = (id) => stickySide(leaves.find((column) => column.id === id)?.columnDef.meta?.sticky);
      const startIds = order.slice(0, order.findLastIndex((id) => sticky(id) === 'start') + 1);
      const endIds = order.filter((id) => sticky(id) === 'end');
      const width = (id) => headerRefs.current[id]?.getBoundingClientRect().width || 0;
      const pinnedWidth = [...startIds, ...endIds].reduce((sum, id) => sum + width(id), 0);
      const nextPins = {};
      if (canPinTableColumns(pinnedWidth, element.clientWidth)) {
        let offset = 0;
        for (const id of startIds) {
          nextPins[id] = { side: 'start', offset, edge: id === startIds.at(-1) };
          offset += width(id);
        }
        offset = 0;
        for (const id of [...endIds].reverse()) {
          nextPins[id] = { side: 'end', offset, edge: id === endIds[0] };
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
    // `table` is a stable instance; the listed inputs are what change its column layout.
  }, [rows, visibility, columns, selectable, expandable, stickyMode]);

  useIsomorphicLayoutEffect(() => {
    const element = scrollRef.current;
    const tableElement = tableRef.current;
    if (requestedSticky !== 'page' || !element || !tableElement) return undefined;
    const measure = () => setPageOverflow(tableElement.scrollWidth > element.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(tableElement);
    return () => observer.disconnect();
  }, [requestedSticky, columns, visibility]);

  // Pinned rows stack under the header from measured heights, so rich rows never overlap.
  const pinnedKey = `${topRows.map((row) => row.id)}|${bottomRows.map((row) => row.id)}`;
  useIsomorphicLayoutEffect(() => {
    const element = scrollRef.current;
    const tableElement = tableRef.current;
    if (!element || !tableElement) return undefined;
    const view = element.ownerDocument.defaultView;
    const measure = () => {
      const head = tableElement.tHead;
      const headHeight = head?.getBoundingClientRect().height || 0;
      const footHeight = tableElement.tFoot?.getBoundingClientRect().height || 0;
      const pinnedRows = [...tableElement.querySelectorAll(':scope > tbody > tr[data-row-pinned]')];
      const offsets = {};
      let top = stickyMode ? headHeight : 0;
      let bottom = footHeight;
      for (const row of pinnedRows.filter((node) => node.dataset.rowPinned === 'top')) {
        offsets[row.dataset.rowId] = { side: 'top', offset: top };
        top += row.getBoundingClientRect().height;
      }
      for (const row of pinnedRows.filter((node) => node.dataset.rowPinned === 'bottom').reverse()) {
        offsets[row.dataset.rowId] = { side: 'bottom', offset: bottom };
        bottom += row.getBoundingClientRect().height;
      }
      const headerTop = stickyMode === 'page' && head?.rows[0]?.cells[0] ? Number.parseFloat(view.getComputedStyle(head.rows[0].cells[0]).top) || 0 : 0;
      const viewport = stickyMode === 'page' ? view.innerHeight : resolvedMaxHeight ? element.clientHeight : 0;
      // Bands that would crowd out the scrolling rows stop sticking and sit in place instead.
      const crowded = viewport > 0 && top + bottom + headerTop > viewport * PINNED_BAND_LIMIT;
      const next = { head: headHeight, rows: crowded ? {} : offsets };
      setRowOffsets((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (tableElement.tHead) observer.observe(tableElement.tHead);
    tableElement.querySelectorAll(':scope > tbody > tr[data-row-pinned]').forEach((node) => observer.observe(node));
    view.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      view.removeEventListener('resize', measure);
    };
  }, [pinnedKey, stickyMode, resolvedMaxHeight, density, footer, loading]);

  // Scroll-triggered loading: a sentinel after the last row asks for the next batch.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!loadMoreOnScroll || !hasMore || loadingMore || !sentinel || typeof onLoadMore !== 'function') return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loadRequested.current = true;
        onLoadMore();
      },
      { root: resolvedMaxHeight ? scrollRef.current : null, rootMargin: '0px 0px 160px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMoreOnScroll, hasMore, loadingMore, onLoadMore, resolvedMaxHeight, rows.length]);
  useEffect(() => {
    if (loadingMore || !loadRequested.current) return;
    loadRequested.current = false;
    setStatus(hasMore ? `${rows.length} ${labels.loaded || 'records loaded'}` : labels.allLoaded || 'All records loaded');
  }, [loadingMore, hasMore, rows.length, labels.loaded, labels.allLoaded]);

  // Logical insets: start-pinned columns stick to the left in LTR and to the right in RTL.
  const pinStyle = (id) => (pins[id] ? { position: 'sticky', [pins[id].side === 'start' ? 'insetInlineStart' : 'insetInlineEnd']: pins[id].offset } : undefined);
  const pinClass = (id) => pins[id] && cn('ds-table-pinned', pins[id].edge && (pins[id].side === 'start' ? 'ds-table-pin-start' : 'ds-table-pin-end'));
  const rowName = (row) => (getRowLabel ? getRowLabel(row.original) : row.id);
  const align = (column) => ({ left: 'text-left', right: 'text-right', center: 'text-center' })[column.columnDef.meta?.align] || 'text-start';
  const numeric = (column) => column.columnDef.meta?.align === 'right' && 'tabular-nums';
  const toggleExpanded = (id) =>
    setExpandedIds((current = emptyIds) => {
      const open = current.includes(id);
      if (expandMode === 'single') return open ? [] : [id];
      return open ? current.filter((value) => value !== id) : [...current, id];
    });
  const toggleGroup = (key) =>
    setCollapsed((current) => {
      const next = new Set(current);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  const openMenu = (id, fromKeyboardOrPointer) => {
    const active = scrollRef.current?.ownerDocument.activeElement;
    // Menus opened from the row (right-click, Shift+F10) hand focus back to where it was.
    returnFocusRef.current = fromKeyboardOrPointer && active && scrollRef.current?.contains(active) ? active : null;
    setMenuRowId(id);
  };
  const exportCsv = () => {
    const scope = exportOptions?.scope || 'auto';
    const exportRows = getTableExportRows(table, scope);
    const csv = tableToCsv(table, { scope, delimiter: exportOptions?.delimiter });
    if (exportOptions?.onExport?.(csv, exportRows.map((row) => row.original)) !== false) downloadCsv(csv, exportOptions?.filename || 'table.csv');
    setStatus(`${labels.exported || 'Exported'} ${exportRows.length} ${labels.records || 'records'}`);
  };

  const renderRow = (row, index, { pinned, measureIndex } = {}) => {
    const isExpanded = expandable && expanded.has(row.id);
    const expandAllowed = expandable && (canExpand ? canExpand(row.original) : true);
    const hostActions = typeof getRowActions === 'function' ? getRowActions(row.original) || [] : [];
    const pinSide = row.getIsPinned?.();
    const pinActions = pinnableRows
      ? pinSide
        ? [{ label: labels.unpin || 'Unpin row', icon: 'PinOff', onSelect: () => row.pin(false) }]
        : [
            { label: labels.pinTop || 'Pin to top', icon: 'ArrowUp', onSelect: () => row.pin('top') },
            { label: labels.pinBottom || 'Pin to bottom', icon: 'ArrowDown', onSelect: () => row.pin('bottom') }
          ]
      : [];
    const hasMenu = hostActions.length + pinActions.length > 0;
    const activate = onRowClick && (!canActivateRow || canActivateRow(row.original) !== false) && (() => onRowClick(row.original));
    const stuck = pinned && rowOffsets.rows[row.id];
    const edgeRow = pinned === 'top' ? row.id === topRows.at(-1)?.id && centerRows.length > 0 : pinned === 'bottom' ? row.id === bottomRows[0]?.id : false;
    return (
      <Fragment key={row.id}>
        <tr
          ref={measureIndex !== undefined ? virtualizer.measureElement : undefined}
          data-index={measureIndex}
          data-row-id={row.id}
          aria-rowindex={virtualOn ? index + 2 : undefined}
          data-selected={row.getIsSelected() || undefined}
          data-striped={(striped && index % 2 === 1) || undefined}
          data-expanded={isExpanded || undefined}
          data-interactive={activate ? true : undefined}
          data-row-pinned={pinned || undefined}
          data-row-stuck={stuck ? stuck.side : undefined}
          data-pin-edge={edgeRow ? pinned : undefined}
          style={stuck ? { [`--ds-table-row-${stuck.side}`]: stickyMode === 'page' && stuck.side === 'top' ? `calc(${stickyOffset} + ${stuck.offset}px)` : `${stuck.offset}px` } : undefined}
          tabIndex={activate ? 0 : undefined}
          onClick={activate && ((event) => !event.target.closest(interactiveTarget) && activate())}
          onContextMenu={
            hasMenu
              ? (event) => {
                  if (event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
                  event.preventDefault();
                  openMenu(row.id, true);
                }
              : undefined
          }
          onKeyDown={(event) => {
            if (hasMenu && (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10'))) {
              event.preventDefault();
              openMenu(row.id, true);
              return;
            }
            if (!activate || event.target !== event.currentTarget || !['Enter', ' '].includes(event.key)) return;
            event.preventDefault();
            activate();
          }}
          className='ds-table-row'
        >
          {selectable && (
            <td style={pinStyle('__select')} className={cn('ds-table-cell ds-table-cell-spacing w-10', expandable && 'pe-1', pinClass('__select'))}>
              <SelectionCheckbox
                aria-label={`${labels.selectRow || 'Select row'} ${rowName(row)}`}
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onCheckedChange={(value) => row.toggleSelected(value)}
              />
            </td>
          )}
          {expandable && (
            <td style={pinStyle('__expand')} className={cn('ds-table-cell w-9 px-0', pinClass('__expand'))}>
              {expandAllowed && (
                <Button
                  variant='ghost'
                  tone='neutral'
                  size='icon-sm'
                  aria-expanded={isExpanded}
                  aria-label={`${labels.expand || 'Details for'} ${rowName(row)}`}
                  onClick={() => toggleExpanded(row.id)}
                  className={iconButtonClass}
                >
                  <Icon name='ChevronDown' decorative size='sm' className={cn('ds-motion-icon', !isExpanded && '-rotate-90')} />
                </Button>
              )}
            </td>
          )}
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              style={{ ...pinStyle(cell.column.id), width: cell.column.columnDef.meta?.width }}
              data-column-hover={hoverColumn === cell.column.id || undefined}
              onMouseEnter={() => setHoverColumn(cell.column.id)}
              className={cn('ds-table-cell ds-table-cell-spacing', align(cell.column), numeric(cell.column), cell.column.columnDef.meta?.className, pinClass(cell.column.id))}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
          {withActions && (
            <td className='ds-table-cell w-10 px-1 text-right'>
              {hasMenu && (
                <MenuRoot open={menuRowId === row.id} onOpenChange={(open) => (open ? openMenu(row.id, false) : setMenuRowId(null))}>
                  <MenuTrigger asChild>
                    <Button variant='ghost' tone='neutral' size='icon-sm' aria-label={`${labels.rowActions || 'Actions for'} ${rowName(row)}`} className={iconButtonClass}>
                      <Icon name={pinSide ? 'Pin' : 'MoreHorizontal'} decorative size='sm' />
                    </Button>
                  </MenuTrigger>
                  <MenuContent
                    align='end'
                    sideOffset={6}
                    collisionPadding={12}
                    className='z-[calc(var(--ds-z-overlay)+10)] w-max max-w-[calc(100vw-1.5rem)] min-w-48'
                    onCloseAutoFocus={(event) => {
                      const target = returnFocusRef.current;
                      returnFocusRef.current = null;
                      if (target?.isConnected) {
                        event.preventDefault();
                        target.focus();
                      }
                    }}
                  >
                    {hostActions.map((action) => (
                      <MenuItem
                        key={action.label}
                        variant={action.tone === 'danger' ? 'destructive' : undefined}
                        disabled={action.disabled}
                        onSelect={() => action.onSelect?.(row.original)}
                      >
                        {action.icon && <Icon name={action.icon} decorative size='sm' />}
                        {action.label}
                      </MenuItem>
                    ))}
                    {hostActions.length > 0 && pinActions.length > 0 && <MenuSeparator />}
                    {pinActions.map((action) => (
                      <MenuItem key={action.label} onSelect={action.onSelect}>
                        <Icon name={action.icon} decorative size='sm' />
                        {action.label}
                      </MenuItem>
                    ))}
                  </MenuContent>
                </MenuRoot>
              )}
            </td>
          )}
        </tr>
        {isExpanded && (
          <tr className='ds-table-expanded' data-expanded-for={row.id}>
            <td colSpan={count} className='ds-table-cell ds-table-cell-spacing'>
              {renderExpanded(row.original)}
            </td>
          </tr>
        )}
      </Fragment>
    );
  };

  const spacer = (key, height) =>
    height > 0 && (
      <tr key={key} aria-hidden='true' data-slot='table-virtual-spacer'>
        <td colSpan={Math.max(1, count)} style={{ height, padding: 0, border: 0 }} />
      </tr>
    );
  const emptyBody = (
    <tr>
      <td colSpan={Math.max(1, count)} className='ds-table-empty'>
        {error ? (
          <EmptyState
            role='alert'
            compact
            title={labels.errorTitle || 'Unable to load records'}
            description={error}
            actions={onRetry && <Button size='sm' onClick={onRetry}>{labels.retry || 'Try again'}</Button>}
          />
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
        <td key={cell} className='ds-table-cell ds-table-cell-spacing'>
          {index === 0 && cell === 0 && <span role='status' className='sr-only'>{labels.loading || 'Loading records…'}</span>}
          <Skeleton className={cn('h-4', cell === 0 && (selectable || expandable) ? 'w-4' : index % 2 ? 'w-3/5' : 'w-4/5')} />
        </td>
      ))}
    </tr>
  ));
  const centerBody = () => {
    if (groups)
      return groups.map((group) => {
        const open = !collapsed.has(group.key);
        return (
          <Fragment key={group.key}>
            <tr className='ds-table-group'>
              <th scope='rowgroup' colSpan={count} className='p-0'>
                <button type='button' aria-expanded={open} onClick={() => toggleGroup(group.key)} className='ds-table-group-toggle ds-table-header-spacing'>
                  <Icon name='ChevronDown' decorative size='xs' className={cn('ds-motion-icon', !open && '-rotate-90')} />
                  {group.label}
                  <span className='ds-count'>{group.rows.length}</span>
                </button>
              </th>
            </tr>
            {open && group.rows.map((row, index) => renderRow(row, index))}
          </Fragment>
        );
      });
    if (!virtualOn) return centerRows.map((row, index) => renderRow(row, topRows.length + index));
    const items = virtualizer.getVirtualItems();
    const before = items.length ? items[0].start - rowOffsets.head : 0;
    const after = items.length ? virtualizer.getTotalSize() - (items.at(-1).end - rowOffsets.head) : 0;
    return [
      spacer('spacer-start', before),
      ...items.map((item) => centerRows[item.index] && renderRow(centerRows[item.index], topRows.length + item.index, { measureIndex: item.index })),
      spacer('spacer-end', after)
    ];
  };
  const body = loading
    ? skeletonBody
    : error || !shownRows
      ? emptyBody
      : [
          ...topRows.map((row, index) => renderRow(row, index, { pinned: 'top' })),
          ...[centerBody()].flat(),
          ...bottomRows.map((row, index) => renderRow(row, topRows.length + centerRows.length + index, { pinned: 'bottom' }))
        ];
  const exportButton = exportOptions && (
    <Button size='sm' variant='outline' tone='neutral' onClick={exportCsv} disabled={loading || !filteredRows.length}>
      <Icon name='Download' decorative size='sm' />
      {exportOptions.label || labels.exportCsv || 'Export CSV'}
    </Button>
  );
  const hasTools = searchable || columnVisibility || toolbar || exportOptions || selectedRows.length > 0;
  const firstIndex = page.pageIndex * size;
  const sortCount = sorting?.length || 0;

  return (
    <div className={cn('ds-table-frame', className)} data-sticky={stickyMode || undefined} aria-busy={loading || refreshing || loadingMore}>
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
              <div className='ds-actions ms-auto'>
                {renderSelectionActions?.(selectedRows.map((row) => row.original))}
                {exportButton}
              </div>
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
                    <span className='ds-count' aria-hidden='true'>
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
              {exportButton}
            </>
          )}
        </div>
      )}
      <div className='relative min-w-0' onMouseLeave={() => setHoverColumn(null)}>
        <div
          ref={scrollRef}
          role='region'
          tabIndex={0}
          aria-label={caption ? (labels.scrollRegion ? labels.scrollRegion(caption) : `${caption} scrollable table`) : overflowLabel}
          aria-describedby={descriptionId}
          data-sticky={stickyMode || undefined}
          style={resolvedMaxHeight && stickyMode !== 'page' ? { maxHeight: resolvedMaxHeight } : undefined}
          onKeyDown={(event) => {
            if (stickyMode === 'page' || event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
            event.preventDefault();
            event.currentTarget.scrollBy({ left: event.key === 'ArrowLeft' ? -80 : 80 });
          }}
          className='ds-table-scroll'
        >
          <table
            ref={tableRef}
            className='ds-part-table ds-table'
            data-density={density}
            data-sticky={stickyMode || undefined}
            aria-rowcount={virtualOn ? shownRows + 1 : undefined}
            style={stickyMode === 'page' ? { '--ds-table-sticky-top': stickyOffset } : undefined}
          >
            {caption && <caption className='sr-only'>{caption}</caption>}
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id} aria-rowindex={virtualOn ? 1 : undefined}>
                  {selectable && (
                    <TableHead
                      variant={headerVariant}
                      scope='col'
                      ref={(node) => (headerRefs.current.__select = node)}
                      style={pinStyle('__select')}
                      className={cn('ds-table-head w-10', expandable && 'pe-1', pinClass('__select'))}
                    >
                      <SelectionCheckbox
                        aria-label={labels.selectPage || 'Select this page'}
                        checked={table.getIsAllPageRowsSelected()}
                        mixed={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
                        disabled={!rows.length || loading}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
                      />
                    </TableHead>
                  )}
                  {expandable && (
                    <TableHead
                      variant={headerVariant}
                      scope='col'
                      ref={(node) => (headerRefs.current.__expand = node)}
                      style={pinStyle('__expand')}
                      className={cn('ds-table-head w-9 px-0', pinClass('__expand'))}
                    >
                      <span className='sr-only'>{labels.details || 'Details'}</span>
                    </TableHead>
                  )}
                  {group.headers.map((header) => {
                    const direction = header.column.getIsSorted();
                    const label = flexRender(header.column.columnDef.header, header.getContext());
                    const order = sortCount > 1 && direction ? header.column.getSortIndex() + 1 : null;
                    return (
                      <TableHead
                        variant={headerVariant}
                        key={header.id}
                        scope='col'
                        ref={(node) => (headerRefs.current[header.column.id] = node)}
                        style={{ ...pinStyle(header.column.id), width: header.column.columnDef.meta?.width }}
                        aria-sort={header.column.getCanSort() ? sortState[direction] || 'none' : undefined}
                        data-column-hover={hoverColumn === header.column.id || undefined}
                        onMouseEnter={() => setHoverColumn(header.column.id)}
                        className={cn('ds-table-head', align(header.column), header.column.columnDef.meta?.className, pinClass(header.column.id))}
                      >
                        {header.column.getCanSort() ? (
                          <button
                            type='button'
                            data-sorted={direction || undefined}
                            title={multiSort ? labels.multiSortHint || 'Shift-click to sort by more than one column' : undefined}
                            className={cn('ds-table-sort', header.column.columnDef.meta?.align === 'right' && 'flex-row-reverse')}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {label}
                            <Icon name={direction === 'asc' ? 'ChevronUp' : direction === 'desc' ? 'ChevronDown' : 'ChevronsUpDown'} decorative size='xs' />
                            {order && (
                              <span className='ds-table-sort-order'>
                                <span className='sr-only'>{labels.sortOrder || 'sort order'} </span>
                                {order}
                              </span>
                            )}
                          </button>
                        ) : (
                          label
                        )}
                      </TableHead>
                    );
                  })}
                  {withActions && (
                    <TableHead variant={headerVariant} scope='col' className='ds-table-head w-10 px-1'>
                      <span className='sr-only'>{labels.actions || 'Actions'}</span>
                    </TableHead>
                  )}
                </tr>
              ))}
            </thead>
            <tbody>
              {body}
              {loadMoreOnScroll && hasMore && !loading && (
                <tr ref={sentinelRef} aria-hidden='true' data-slot='table-load-sentinel'>
                  <td colSpan={Math.max(1, count)} className='p-0' />
                </tr>
              )}
            </tbody>
            {footer && !loading && !error && shownRows > 0 && (
              <tfoot>
                <tr>
                  {selectable && <td className='ds-table-foot ds-table-cell-spacing' />}
                  {expandable && <td className='ds-table-foot' />}
                  {visibleColumns.map((column, index) => {
                    const total = column.columnDef.meta?.footer;
                    return (
                      <td key={column.id} style={pinStyle(column.id)} className={cn('ds-table-foot ds-table-cell-spacing', align(column), numeric(column), pinClass(column.id))}>
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
        {/* Edges are measured and scrolled physically, so these chevrons stay correct in RTL without flipping. */}
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
            <Loader size='xs' label='' />
            {labels.refreshing || 'Updating…'}
          </span>
        )}
      </div>
      <span id={descriptionId} className='sr-only'>
        {stickyMode === 'page' ? labels.pageScrollHint || 'The header stays in view while the page scrolls.' : labels.scrollHint || 'Scroll horizontally to see all columns.'}
      </span>
      {/* Only tables that export or load more have something to announce. */}
      {(exportOptions || typeof onLoadMore === 'function') && (
        <span role='status' className='sr-only'>
          {status}
        </span>
      )}
      {typeof onLoadMore === 'function' && !pagination && (hasMore || loadingMore) && !loading && (
        <div className='ds-table-footer justify-center'>
          <Button
            size='sm'
            variant='outline'
            tone='neutral'
            disabled={loadingMore}
            onClick={() => {
              loadRequested.current = true;
              onLoadMore();
            }}
          >
            {loadingMore ? <Loader size='xs' label='' /> : <Icon name='ChevronDown' decorative size='sm' />}
            {loadingMore ? labels.loadingMore || 'Loading more…' : labels.loadMore || 'Load more'}
          </Button>
        </div>
      )}
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
