'use client';
import { useIsClient } from '../../../../hooks/environment/use-is-client.js';
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import { useDataGrid } from '../DataGrid.jsx';
import { DataGridTableBodySkeleton } from './DataGridTableStructure.jsx';
import { useDataGridStructureLabels } from './DataGridTreeRows.jsx';
import {
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowExpandded,
  DataGridTableEmpty,
  DataGridTableFillBodyCell,
  DataGridTableFillHeadCell,
  DataGridTableFoot,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableRowSpacer,
  DataGridTableViewport
} from './DataGridTable.jsx';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { flexRender } from '@tanstack/react-table';
import { createPortal } from 'react-dom';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { getDataGridRowLabel, handleDataGridRowMoveKey } from '../dataGridStructureModel.js';
import { renderDataGridCellContent } from '../dataGridCellContent.js';
const SortableRowContext = createContext(null);
function DataGridTableDndRowHandle({ className, disabled, disabledLabel }) {
  const { i18n, props } = useDataGrid();
  const labels = useDataGridStructureLabels();
  const context = useContext(SortableRowContext);
  const resolvedDisabledLabel =
    disabledLabel ?? i18n.labels.reorderingUnavailable;
  if (!context || disabled) {
    return (
      <Button
        variant='ghost'
        size='icon-sm'
        className={cn(
          'size-7 cursor-grab opacity-70 hover:bg-transparent hover:opacity-100 active:cursor-grabbing',
          // The Button's own disabled treatment supplies the muting; only the
          // cursor needs saying, so the grip reads as unavailable rather than
          // merely unresponsive.
          disabled && 'cursor-not-allowed',
          className
        )}
        aria-label={
          disabled ? resolvedDisabledLabel : i18n.labels.dragToReorderRow
        }
        title={disabled ? resolvedDisabledLabel : void 0}
        disabled
      >
        <RegistryIcon lucide='GripHorizontalIcon' aria-hidden='true' />
      </Button>
    );
  }
  return (
    <Button
      variant='ghost'
      size='icon-sm'
      className={cn(
        'size-7 cursor-grab opacity-70 hover:bg-transparent hover:opacity-100 active:cursor-grabbing',
        className
      )}
      aria-label={i18n.labels.dragToReorderRow}
      {...context.attributes}
      {...context.listeners}
      // Alt+Arrow keys and Alt+Home/End move the row without picking it up,
      // through the DataGrid's onRowMove; everything else is the drag sensor's.
      onKeyDown={(event) => {
        const moved = handleDataGridRowMoveKey(event, context.row, props.onRowMove);
        if (!moved) {
          context.listeners?.onKeyDown?.(event);
          return;
        }
        if (moved === true) return;
        const viewport = event.currentTarget.closest('[data-slot="data-grid-table-viewport"]');
        const status = viewport?.querySelector('[data-slot="data-grid-row-move-status"]');
        if (status) status.textContent = labels.movedToPosition(getDataGridRowLabel(context.row), moved.index + 1, moved.count);
        // `CSS` in this file is dnd-kit's transform helper; escape with the global one.
        const id = globalThis.CSS.escape(String(context.row.id));
        requestAnimationFrame(() =>
          viewport?.querySelector(`tr[data-row-id="${id}"] [data-slot="button"]`)?.focus()
        );
      }}
    >
      <RegistryIcon lucide='GripHorizontalIcon' aria-hidden='true' />
    </Button>
  );
}
const holdRowsInPlaceStrategy = () => null;
function DataGridTableDndRow({
  row,
  renderRowDecoration,
  dropIndicator = true
}) {
  const rowData = {
    type: 'data-grid-row',
    depth: row.depth,
    index: row.index,
    parentId: row.getParentRow()?.id ?? null
  };
  const {
    transform,
    setNodeRef,
    isDragging,
    isOver,
    attributes,
    listeners,
    index,
    activeIndex,
    overIndex
  } = useSortable({
    id: row.id,
    data: rowData
  });
  const dropEdge =
    dropIndicator && activeIndex !== -1 && index === overIndex && !isDragging
      ? activeIndex < overIndex
        ? 'bottom'
        : 'top'
      : null;
  const style = {
    transform: CSS.Transform.toString(transform),
    // dnd-kit's transition is deliberately dropped. A transition on a transform
    // property of a `tr` does not merely fail to animate in Chrome, it stops the
    // transform applying at all: the element sits at the start value forever.
    // The drag source escapes it because dnd-kit disables its own transition
    // while it is being dragged, which is why the carried row used to be the
    // ONLY one that moved and every other row silently refused to open a gap.
    // Displacement therefore lands in one step, which is what a table wants.
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    cursor: isDragging ? 'grabbing' : void 0,
    // The row you are holding is drawn by the DragOverlay, so the one left
    // behind is not a second copy of it - it is the slot you came from, and it
    // stays exactly where it was. Fading alone read as "this row is busy";
    // the outline says "this is the space you are moving out of", which is the
    // thing you need if you change your mind mid-drag.
    ...(isDragging && {
      opacity: 0.4,
      // Inset so the dashes sit inside the row box and cannot be clipped by
      // the neighbouring row's border.
      outline: '1px dashed var(--border)',
      outlineOffset: '-1px'
    })
  };
  const decoration = renderRowDecoration?.({ row, isDragging, isOver });
  return (
    <SortableRowContext.Provider value={{ attributes, listeners, row }}>
      <DataGridTableBodyRow row={row} dndRef={setNodeRef} dndStyle={style}>
        {row.getVisibleCells().map((cell, index2, cells) => {
          return (
            <DataGridTableBodyRowCell cell={cell} key={cell.id}>
              {renderDataGridCellContent(cell)}
              {decoration && index2 === cells.length - 1 ? (
                // Rides inside the last cell rather than in a `td` of its own.
                // An absolutely positioned `td` is still a cell as far as table
                // layout is concerned, so it added a NINTH column with no width
                // of its own, and under `table-layout: fixed` that new column
                // swallowed the whole surplus the real columns had been sharing
                // — every column snapped back to its declared size and the row's
                // content visibly narrowed the moment a drag began. A plain
                // element adds no column. It still anchors to the ROW, because
                // the row is the nearest positioned ancestor, so the decoration
                // spans the full width and is not clipped by the cell.
                <div
                  aria-hidden='true'
                  data-slot='data-grid-table-row-decoration'
                  className='pointer-events-none absolute inset-0'
                >
                  {decoration}
                </div>
              ) : null}
              {dropEdge && index2 === cells.length - 1 ? (
                // Same anchoring trick as the decoration above: a plain
                // element inside the last cell, so it adds no column and
                // cannot disturb `table-layout: fixed`. It spans the row
                // because the row is the nearest positioned ancestor.
                <div
                  aria-hidden='true'
                  data-slot='data-grid-table-row-drop-indicator'
                  data-edge={dropEdge}
                  className='pointer-events-none absolute inset-0 z-20'
                >
                  {/* Two solid pixels down the leading edge, the same marker
                                the tree drag uses for its drop target. A wash across
                                the row has to stay faint enough not to read as a
                                selected row, and in the achromatic styles primary
                                carries no chroma at all, so faint plus colourless is
                                just grey. The bar reads at any weight and leaves the
                                row's own background to hover and selection.

                                The bar is the whole indicator: the gap the rows have
                                already opened says which side, so a rule across the
                                seam as well only competes with the row borders it sits
                                between. `data-edge` still carries the direction for
                                anyone styling their own. */}
                  <span className='bg-ui-primary absolute inset-y-0 start-0 w-0.5' />
                </div>
              ) : null}
            </DataGridTableBodyRowCell>
          );
        })}
        <DataGridTableFillBodyCell />
      </DataGridTableBodyRow>
      {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
    </SortableRowContext.Provider>
  );
}
function DataGridTableDndRowsBody({
  table,
  dataIds,
  renderRowDecoration,
  dropIndicator,
  sortingStrategy
}) {
  const { isLoading, props } = useDataGrid();
  const pagination = table.state.pagination;
  if (props.loadingMode === 'skeleton' && isLoading && pagination?.pageSize) {
    return <DataGridTableBodySkeleton />;
  }
  if (!table.getRowModel().rows.length) return <DataGridTableEmpty />;
  return (
    <SortableContext items={dataIds} strategy={sortingStrategy}>
      {table.getRowModel().rows.map((row) => {
        return (
          <DataGridTableDndRow
            row={row}
            renderRowDecoration={renderRowDecoration}
            dropIndicator={dropIndicator}
            key={row.id}
          />
        );
      })}
    </SortableContext>
  );
}
const MemoizedDataGridTableDndRowsBody = memo(
  DataGridTableDndRowsBody,
  (_prev, next) => !!next.table.state.columnResizing.isResizingColumn
);
function DataGridTableDndRows({
  handleDragEnd,
  dataIds,
  footerContent,
  collisionDetection = closestCenter,
  modifiers,
  sortingStrategy = holdRowsInPlaceStrategy,
  renderRowDecoration,
  dropIndicator = true,
  onDragStart,
  onDragMove,
  onDragOver,
  onDragCancel
}) {
  const { table, props } = useDataGrid();
  const tableContainerRef = useRef(null);
  const [isDraggingRow, setIsDraggingRow] = useState(false);
  const isClient = useIsClient();
  const [carried, setCarried] = useState(null);
  const pickUpRow = useCallback((id) => {
    const container = tableContainerRef.current;
    const head = container?.querySelector('thead tr');
    if (!container || !head) {
      setCarried(null);
      return;
    }
    const source = Array.from(
      container.querySelectorAll('tbody tr[data-row-id]')
    ).find((candidate) => candidate.dataset.rowId === String(id));
    const height = source?.getBoundingClientRect().height ?? 0;
    const columns = Array.from(head.children)
      .filter(
        (cell) =>
          cell.getAttribute('data-slot') !== 'data-grid-table-fill-head-cell'
      )
      .map((cell) => cell.getBoundingClientRect().width);
    setCarried({
      id,
      width: columns.reduce((total, width) => total + width, 0),
      height,
      columns
    });
  }, []);
  const carriedRow = carried
    ? table.getRowModel().rows.find((row) => row.id === carried.id)
    : void 0;
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    // Keyboard reordering moves one sortable position per keypress instead
    // of the sensor's raw 25px default.
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  useEffect(() => {
    if (!isDraggingRow) return;
    const { body, documentElement } = document;
    const previousBodyCursor = body.style.cursor;
    const previousDocumentCursor = documentElement.style.cursor;
    body.style.cursor = 'grabbing';
    documentElement.style.cursor = 'grabbing';
    return () => {
      body.style.cursor = previousBodyCursor;
      documentElement.style.cursor = previousDocumentCursor;
    };
  }, [isDraggingRow]);
  const resolvedModifiers = useMemo(() => {
    const restrictToTableContainer = ({ transform, draggingNodeRect }) => {
      if (!tableContainerRef.current || !draggingNodeRect) {
        return transform;
      }
      const containerRect = tableContainerRef.current.getBoundingClientRect();
      const { x, y } = transform;
      const minX = containerRect.left - draggingNodeRect.left;
      const maxX = containerRect.right - draggingNodeRect.right;
      const minY = containerRect.top - draggingNodeRect.top;
      const maxY = containerRect.bottom - draggingNodeRect.bottom;
      return {
        ...transform,
        // The horizontal rail only engages while the default axis restriction
        // is in force. A row is exactly as wide as the viewport, so minX and
        // maxX both collapse to 0 and clamping x erases it entirely: harmless
        // under restrictToVerticalAxis, which zeroes x anyway, but fatal for a
        // caller that replaced the restriction precisely to READ x, as a tree
        // does to resolve drop depth. Vertical is railed either way, which is
        // what actually keeps a dragged row inside the grid.
        x: modifiers ? x : Math.max(minX, Math.min(maxX, x)),
        y: Math.max(minY, Math.min(maxY, y))
      };
    };
    return [
      ...(modifiers ?? [restrictToVerticalAxis]),
      restrictToTableContainer
    ];
  }, [modifiers]);
  return (
    <DndContext
      id={useId()}
      collisionDetection={collisionDetection}
      modifiers={resolvedModifiers}
      onDragCancel={(event) => {
        setIsDraggingRow(false);
        setCarried(null);
        onDragCancel?.(event);
      }}
      onDragEnd={(event) => {
        setIsDraggingRow(false);
        setCarried(null);
        handleDragEnd(event);
      }}
      onDragMove={onDragMove}
      onDragOver={onDragOver}
      onDragStart={(event) => {
        setIsDraggingRow(true);
        pickUpRow(event.active.id);
        onDragStart?.(event);
      }}
      sensors={sensors}
    >
      <DataGridTableViewport
        viewportRef={tableContainerRef}
        className={
          isDraggingRow
            ? 'relative cursor-grabbing [&_*]:cursor-grabbing!'
            : 'relative'
        }
      >
        {/* Announces keyboard moves made with Alt+Arrow and Alt+Home/End. */}
        <span data-slot='data-grid-row-move-status' role='status' aria-live='polite' className='sr-only' />
        <DataGridTableBase>
          <DataGridTableHead>
            {table.getHeaderGroups().map((headerGroup, index) => {
              return (
                <DataGridTableHeadRow key={index} rowId={headerGroup.id}>
                  {headerGroup.headers.map((header, index2) => {
                    const { column } = header;
                    return (
                      <DataGridTableHeadRowCell header={header} key={index2}>
                        {header.isPlaceholder ? null : props.tableLayout
                            ?.columnsResizable && column.getCanResize() ? (
                          <>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                        {props.tableLayout?.columnsResizable &&
                          column.getCanResize() && (
                            <DataGridTableHeadRowCellResize header={header} />
                          )}
                      </DataGridTableHeadRowCell>
                    );
                  })}
                  <DataGridTableFillHeadCell />
                </DataGridTableHeadRow>
              );
            })}
          </DataGridTableHead>

          {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}

          <DataGridTableBody>
            <MemoizedDataGridTableDndRowsBody
              table={table}
              dataIds={dataIds}
              renderRowDecoration={renderRowDecoration}
              dropIndicator={dropIndicator}
              sortingStrategy={sortingStrategy}
            />
          </DataGridTableBody>

          {footerContent && (
            <DataGridTableFoot>{footerContent}</DataGridTableFoot>
          )}
        </DataGridTableBase>
      </DataGridTableViewport>

      {/* The row you are actually holding. It is a real clone rendered outside
              the table, which is the only way a dragged row can follow the pointer
              without disturbing the grid: it adds no cell, so it cannot alter the
              column widths, and it floats above the rows rather than through them.
              Its presence also tells dnd-kit to stop translating the source row, so
              the row left behind simply dims in place.

              Portalled to the body so the fixed positioning resolves against the
              viewport wherever the grid is mounted. React context crosses a portal,
              so DndContext still reaches it. */}
      {isClient
        ? createPortal(
            <DragOverlay dropAnimation={null}>
              {carried && carriedRow ? (
                <table
                  aria-hidden='true'
                  style={{ width: carried.width, tableLayout: 'fixed' }}
                  className='bg-ui-background border-ui-border pointer-events-none cursor-grabbing rounded-md border shadow-lg'
                >
                  <tbody>
                    {/* Padding rides on the inner element, not the cell. A `td` can
      never render narrower than its own horizontal padding, so a
      column resized below that would silently widen here and the
      clone would stop matching the row it came from. Height comes
      from the measured source row for the same reason the widths
      do: the clone has no row of its own to inherit it from. */}
                    <tr
                      style={{ height: carried.height || void 0 }}
                      className='[&>td]:p-0 [&>td]:align-middle'
                    >
                      {carriedRow.getVisibleCells().map((cell, index) => (
                        <td
                          key={cell.id}
                          style={{
                            width:
                              carried.columns[index] ?? cell.column.getSize()
                          }}
                        >
                          <div className='truncate px-3'>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              ) : null}
            </DragOverlay>,
            document.body
          )
        : null}
    </DndContext>
  );
}
export { DataGridTableDndRowHandle, DataGridTableDndRows };
