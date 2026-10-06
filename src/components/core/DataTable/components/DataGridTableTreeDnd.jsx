'use client';
/* Tree drag and drop for the DataGrid: rows drop before or after another row,
 or into a row that can hold children, with the Tree's drop line marking the
 place. Dropping a row into itself or its own descendants is refused. The
 handle doubles as the keyboard alternative: Enter picks the row up, the
 arrow keys walk the drop places, Enter drops and Escape cancels.

 Moves are reported, never applied: `onRowMove({ id, parentId, index,
 targetId, position })` on the DataGrid (or this body) receives the new
 parent and the index among its children; `moveDataGridRow` applies it. */
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { useDataGrid } from '../DataGrid.jsx';
import {
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowExpandded,
  DataGridTableEmpty,
  DataGridTableFillBodyCell,
  DataGridTableFoot,
  DataGridTableHead,
  DataGridTableRowSpacer,
  DataGridTableViewport,
  renderDataGridCellContent
} from './DataGridTable.jsx';
import { DataGridTableHeadRows } from './DataGridTableSections.jsx';
import { handleDataGridRowMoveKey } from './DataGridRowMove.jsx';
import {
  DataGridTableLazyStatusRow,
  getDataGridRowLabel,
  useDataGridStructureLabels
} from './DataGridTreeRows.jsx';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

const TreeDndRowContext = createContext(null);

/* Is `row` the moving row or inside it? Those are never valid targets. */
function isWithin(row, ancestor) {
  for (let current = row; current; current = current.getParentRow?.()) {
    if (current.id === ancestor.id) return true;
  }
  return false;
}
function getRootRows(table) {
  return (table.getSortedRowModel?.() ?? table.getCoreRowModel()).rows;
}
/* Turns a drop place into the move report the host applies. */
function resolveTreeMove(table, active, target, position, literal = false) {
  if (position === 'inside') {
    const children = target.subRows.filter((row) => row.id !== active.id);
    return { id: active.id, parentId: target.id, index: children.length, targetId: target.id, position };
  }
  // Just below an open parent is its first child, which is where the line is.
  if (!literal && position === 'after' && target.getIsExpanded() && target.subRows.length) {
    const children = target.subRows.filter((row) => row.id !== active.id);
    return {
      id: active.id,
      parentId: target.id,
      index: 0,
      targetId: children[0]?.id ?? target.id,
      position: children[0] ? 'before' : 'inside'
    };
  }
  const parent = target.getParentRow?.();
  const siblings = (parent ? parent.subRows : getRootRows(table)).filter((row) => row.id !== active.id);
  const at = siblings.findIndex((row) => row.id === target.id);
  return {
    id: active.id,
    parentId: parent?.id ?? null,
    index: position === 'after' ? at + 1 : at,
    targetId: target.id,
    position
  };
}
/* The depth the drop line is drawn at. */
function getDropDepth(target, position, literal) {
  if (position === 'inside') return target.depth + 1;
  if (!literal && position === 'after' && target.getIsExpanded() && target.subRows.length) return target.depth + 1;
  return target.depth;
}
function describeDrop(labels, table, drop, getRowLabel) {
  const target = table.getRow(drop.targetId, true);
  const label = getDataGridRowLabel(target, getRowLabel);
  if (drop.position === 'inside') return labels.dropInside(label);
  return drop.position === 'after' ? labels.dropAfter(label) : labels.dropBefore(label);
}

/**
 * The grip for a tree row. Drag it with a pointer, or focus it and press
 * Enter or Space to move with the keyboard. Alt+Arrow keys and Alt+Home/End
 * move the row among its siblings without picking it up.
 */
export function DataGridTableTreeDndHandle({ className, disabled, label }) {
  const { i18n } = useDataGrid();
  const labels = useDataGridStructureLabels();
  const context = useContext(TreeDndRowContext);
  const unavailable = !context || disabled || context.disabled;
  return (
    <Button
      ref={unavailable ? undefined : context.setDragRef}
      variant='ghost'
      tone='neutral'
      size='icon-sm'
      data-slot='data-grid-tree-dnd-handle'
      aria-label={label ?? (unavailable ? context?.disabledLabel ?? i18n.labels.reorderingUnavailable : labels.dragToMoveRow)}
      aria-pressed={context?.isKeyboardMoving || undefined}
      title={unavailable ? context?.disabledLabel ?? i18n.labels.reorderingUnavailable : undefined}
      disabled={unavailable}
      className={cn(
        'text-ui-muted-foreground hover:text-ui-foreground size-7 cursor-grab touch-none active:cursor-grabbing aria-pressed:bg-ui-accent aria-pressed:text-ui-foreground',
        unavailable && 'cursor-not-allowed',
        className
      )}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={unavailable ? undefined : context.onKeyDown}
      {...(unavailable ? null : context.listeners)}
    >
      <RegistryIcon lucide='GripVertical' aria-hidden='true' />
    </Button>
  );
}

function DropIndicator({ drop, depth, indent, treeOffset }) {
  if (drop.position === 'inside') {
    return (
      <span className='border-ui-primary bg-ui-primary/5 rounded-sm absolute inset-0 border-2' />
    );
  }
  // The Tree's drag line: a two-pixel rule with a ring at its leading end,
  // starting at the depth the row will land on.
  return (
    <span
      style={{ insetInlineStart: treeOffset + depth * indent }}
      className={cn(
        'bg-ui-primary before:bg-ui-background before:border-ui-primary absolute end-0 z-30 h-0.5 before:absolute before:-top-[3px] before:start-0 before:size-2 before:rounded-full before:border-2',
        drop.position === 'after' ? '-bottom-px' : '-top-px'
      )}
    />
  );
}

function TreeDndRow({ row, drop, isActive, isKeyboardMoving, disabled, disabledLabel, onHandleKeyDown, indent, treeOffset }) {
  const { attributes: _attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: row.id,
    disabled
  });
  const { setNodeRef: setDropRef } = useDroppable({ id: row.id });
  const dropHere = drop && drop.targetId === row.id ? drop : null;
  const style = {
    position: 'relative',
    ...((isDragging || isActive) && {
      opacity: 0.45,
      outline: '1px dashed var(--border)',
      outlineOffset: '-1px'
    })
  };
  const cells = row.getVisibleCells();
  return (
    <TreeDndRowContext.Provider
      value={{
        row,
        listeners,
        setDragRef,
        disabled,
        disabledLabel,
        isKeyboardMoving,
        onKeyDown: (event) => onHandleKeyDown(event, row)
      }}
    >
      <DataGridTableBodyRow row={row} dndRef={setDropRef} dndStyle={style}>
        {cells.map((cell, index) => (
          <DataGridTableBodyRowCell cell={cell} key={cell.id}>
            {renderDataGridCellContent(cell)}
            {dropHere && index === cells.length - 1 ? (
              // Rides in the last cell so it adds no column; the positioned
              // row anchors it across the full width.
              <span
                aria-hidden='true'
                data-slot='data-grid-table-row-drop-indicator'
                data-position={dropHere.position}
                className='pointer-events-none absolute inset-0 z-20'
              >
                <DropIndicator
                  drop={dropHere}
                  depth={getDropDepth(row, dropHere.position, dropHere.literal)}
                  indent={indent}
                  treeOffset={treeOffset}
                />
              </span>
            ) : null}
          </DataGridTableBodyRowCell>
        ))}
        <DataGridTableFillBodyCell />
      </DataGridTableBodyRow>
      {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
      {row.getIsExpanded() && <DataGridTableLazyStatusRow row={row} indent={indent} />}
    </TreeDndRowContext.Provider>
  );
}

/**
 * A DataGrid body whose rows can be dragged before, after or into each other.
 *
 * - `onRowMove(move)` (or the DataGrid's `onRowMove`) receives
 *   `{ id, parentId, index, targetId, position }`.
 * - `canDropInside(row)` decides which rows accept children (default: rows
 *   that can expand). `canDrag(row)` leaves some rows fixed.
 * - Hovering a closed folder for `autoExpandDelay` ms opens it.
 * - Reordering pauses while the grid is sorted; the handles say why.
 */
export function DataGridTableTreeDnd({
  onRowMove,
  canDropInside = (row) => row.getCanExpand(),
  canDrag,
  getRowLabel,
  footerContent,
  indent = 20,
  autoExpandDelay = 700,
  renderDragPreview
}) {
  const { table, props } = useDataGrid();
  const labels = useDataGridStructureLabels();
  const viewportRef = useRef(null);
  const [active, setActive] = useState(null);
  const [drop, setDrop] = useState(null);
  const [keyboard, setKeyboard] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const [treeOffset, setTreeOffset] = useState(0);
  const [portalTarget, setPortalTarget] = useState(null);
  const refocusId = useRef(null);
  useEffect(() => setPortalTarget(document.body), []);
  const report = onRowMove ?? props.onRowMove;
  const sorted = (table.state.sorting?.length ?? 0) > 0;
  const rows = table.getRowModel().rows;
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } })
  );
  // Where the tree column starts inside a row, so drop lines begin at the
  // indent the row will land on.
  const measureTreeOffset = useCallback(() => {
    const viewport = viewportRef.current;
    const columns = table.getVisibleLeafColumns();
    const treeIndex = Math.max(0, columns.findIndex((column) => column.columnDef.meta?.treeColumn));
    const rowElement = viewport?.querySelector('tbody tr[data-row-id]');
    const cell = rowElement?.children[treeIndex];
    if (!rowElement || !cell) return;
    const rowRect = rowElement.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    const rtl = getComputedStyle(rowElement).direction === 'rtl';
    setTreeOffset(Math.max(0, rtl ? rowRect.right - cellRect.right : cellRect.left - rowRect.left));
  }, [table]);
  const isValidTarget = useCallback(
    (activeRow, target, position) => {
      if (!activeRow || !target || isWithin(target, activeRow)) return false;
      if (position === 'inside') return canDropInside(target);
      return true;
    },
    [canDropInside]
  );
  const commit = useCallback(
    (activeRow, place) => {
      const target = table.getRow(place.targetId, true);
      if (!activeRow || !target || !isValidTarget(activeRow, target, place.position)) return false;
      const move = resolveTreeMove(table, activeRow, target, place.position, place.literal);
      report?.(move);
      setAnnouncement(
        labels.movedRow(getDataGridRowLabel(activeRow, getRowLabel), describeDrop(labels, table, place, getRowLabel))
      );
      refocusId.current = activeRow.id;
      return true;
    },
    [table, isValidTarget, report, labels, getRowLabel]
  );
  // The moved row's handle keeps focus after the rows re-render.
  useEffect(() => {
    const id = refocusId.current;
    if (!id || keyboard) return;
    refocusId.current = null;
    viewportRef.current
      ?.querySelector(`tr[data-row-id="${CSS.escape(String(id))}"] [data-slot="data-grid-tree-dnd-handle"]`)
      ?.focus();
  });
  // Hovering a closed folder opens it after a moment.
  useEffect(() => {
    if (!drop || drop.position !== 'inside' || !autoExpandDelay) return;
    const target = table.getRow(drop.targetId, true);
    if (!target || target.getIsExpanded()) return;
    const timer = setTimeout(() => target.toggleExpanded(true), autoExpandDelay);
    return () => clearTimeout(timer);
  }, [drop, autoExpandDelay, table]);

  /* --- Keyboard moves ---------------------------------------------------- */
  const buildSlots = (activeRow) => {
    const candidates = rows.filter((row) => !isWithin(row, activeRow));
    const slots = [];
    for (const row of candidates) {
      slots.push({ targetId: row.id, position: 'before' });
      if (canDropInside(row)) slots.push({ targetId: row.id, position: 'inside' });
    }
    const last = candidates[candidates.length - 1];
    if (last) slots.push({ targetId: last.id, position: 'after', literal: true });
    // The very end of the top level, when the last row is nested.
    const lastRoot = candidates.filter((row) => row.depth === 0).pop();
    if (lastRoot && lastRoot !== last) slots.push({ targetId: lastRoot.id, position: 'after', literal: true });
    return slots;
  };
  const announceSlot = (slot) => setAnnouncement(describeDrop(labels, table, slot, getRowLabel));
  const handleKeyDown = (event, row) => {
    const moving = keyboard && keyboard.id === row.id ? keyboard : null;
    if (moving) {
      const { slots, index } = moving;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const nextIndex = Math.max(0, Math.min(slots.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)));
        setKeyboard({ ...moving, index: nextIndex });
        setDrop(slots[nextIndex]);
        announceSlot(slots[nextIndex]);
        // Expand nothing automatically from the keyboard; "Into" is enough.
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const slot = slots[index];
        setKeyboard(null);
        setDrop(null);
        if (slot) commit(row, slot);
        return;
      }
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') event.preventDefault();
        setKeyboard(null);
        setDrop(null);
        setAnnouncement(labels.moveCancelled(getDataGridRowLabel(row, getRowLabel)));
      }
      return;
    }
    const moved = handleDataGridRowMoveKey(event, row, report);
    if (moved) {
      if (moved === true) return;
      setAnnouncement(labels.movedToPosition(getDataGridRowLabel(row, getRowLabel), moved.index + 1, moved.count));
      refocusId.current = row.id;
      return;
    }
    if ((event.key === 'Enter' || event.key === ' ') && !event.altKey && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      measureTreeOffset();
      const slots = buildSlots(row);
      if (!slots.length) return;
      // Start where the row already is: just before the row that follows it.
      const after = rows.slice(rows.indexOf(row) + 1).find((candidate) => !isWithin(candidate, row));
      let index = after ? slots.findIndex((slot) => slot.targetId === after.id && slot.position === 'before') : slots.length - 1;
      if (index < 0) index = 0;
      setKeyboard({ id: row.id, slots, index });
      setDrop(slots[index]);
      setAnnouncement(`${labels.movingRow(getDataGridRowLabel(row, getRowLabel))} ${describeDrop(labels, table, slots[index], getRowLabel)}`);
    }
  };

  /* --- Pointer moves ----------------------------------------------------- */
  const pointerY = (event) => {
    const start = event.activatorEvent;
    const y = start?.touches?.[0]?.clientY ?? start?.clientY ?? 0;
    return y + event.delta.y;
  };
  const updatePointerDrop = (event) => {
    const activeRow = active ? table.getRow(active, true) : null;
    const over = event.over;
    if (!activeRow || !over) {
      setDrop(null);
      return;
    }
    const target = table.getRow(over.id, true);
    if (!target) return setDrop(null);
    const ratio = (pointerY(event) - over.rect.top) / Math.max(1, over.rect.height);
    const inside = canDropInside(target);
    const position = inside ? (ratio < 0.25 ? 'before' : ratio > 0.75 ? 'after' : 'inside') : ratio < 0.5 ? 'before' : 'after';
    const next = isValidTarget(activeRow, target, position) ? { targetId: target.id, position } : null;
    setDrop((old) => (old?.targetId === next?.targetId && old?.position === next?.position ? old : next));
  };
  const collisionDetection = useCallback((args) => {
    const hits = pointerWithin(args);
    return hits.length ? hits : closestCenter(args);
  }, []);
  const activeRow = active ? table.getRow(active, true) : null;
  const descendantCount = activeRow ? Math.max(0, activeRow.getLeafRows?.().length ?? 0) : 0;
  const disabledLabel = sorted ? labels.reorderingWhileSorted : undefined;

  return (
    <DndContext
      id={useId()}
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{
        announcements: {
          onDragStart: ({ active: item }) => labels.movingRow(getDataGridRowLabel(table.getRow(item.id, true), getRowLabel)),
          onDragOver: () => undefined,
          onDragMove: () => undefined,
          onDragEnd: () => undefined,
          onDragCancel: ({ active: item }) => labels.moveCancelled(getDataGridRowLabel(table.getRow(item.id, true), getRowLabel))
        }
      }}
      onDragStart={(event) => {
        setKeyboard(null);
        measureTreeOffset();
        setActive(event.active.id);
      }}
      onDragMove={updatePointerDrop}
      onDragOver={updatePointerDrop}
      onDragCancel={() => {
        setActive(null);
        setDrop(null);
      }}
      onDragEnd={() => {
        const moving = active ? table.getRow(active, true) : null;
        if (moving && drop) commit(moving, drop);
        setActive(null);
        setDrop(null);
      }}
    >
      <DataGridTableViewport
        viewportRef={viewportRef}
        className={active ? 'relative cursor-grabbing [&_*]:cursor-grabbing!' : 'relative'}
      >
        <span role='status' aria-live='polite' className='sr-only'>
          {announcement}
        </span>
        <DataGridTableBase>
          <DataGridTableHead>
            <DataGridTableHeadRows />
          </DataGridTableHead>
          {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && <DataGridTableRowSpacer />}
          <DataGridTableBody>
            {rows.length ? (
              rows.map((row) => (
                <TreeDndRow
                  key={row.id}
                  row={row}
                  drop={drop}
                  isActive={keyboard?.id === row.id}
                  isKeyboardMoving={keyboard?.id === row.id}
                  disabled={sorted || (canDrag ? !canDrag(row) : false)}
                  disabledLabel={disabledLabel}
                  onHandleKeyDown={handleKeyDown}
                  indent={indent}
                  treeOffset={treeOffset}
                />
              ))
            ) : (
              <DataGridTableEmpty />
            )}
          </DataGridTableBody>
          {footerContent ? <DataGridTableFoot>{footerContent}</DataGridTableFoot> : null}
        </DataGridTableBase>
      </DataGridTableViewport>
      {portalTarget
        ? createPortal(
            <DragOverlay dropAnimation={null}>
              {activeRow ? (
                renderDragPreview ? (
                  renderDragPreview(activeRow)
                ) : (
                  <div className='bg-ui-background text-ui-foreground rounded-md pointer-events-none flex w-max max-w-72 items-center gap-2 border px-3 py-1.5 text-sm font-medium shadow-lg'>
                    <RegistryIcon lucide='GripVertical' className='text-ui-muted-foreground size-3.5' aria-hidden='true' />
                    <span className='truncate'>{getDataGridRowLabel(activeRow, getRowLabel)}</span>
                    {descendantCount ? (
                      <span className='text-ui-muted-foreground bg-ui-muted rounded-pill px-1.5 text-xs leading-5 tabular-nums'>
                        +{descendantCount}
                      </span>
                    ) : null}
                  </div>
                )
              ) : null}
            </DragOverlay>,
            portalTarget
          )
        : null}
    </DndContext>
  );
}
