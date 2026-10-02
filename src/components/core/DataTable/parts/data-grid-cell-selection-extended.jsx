'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDataGrid } from './data-grid-extended.jsx';
import { Subscribe } from '@tanstack/react-table-v9';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import {
  DATA_GRID_BUILT_IN_OVERLAY_CONTROLS,
  DataGridCellEditorControl
} from './data-grid-cell-editors-extended.jsx';
import {
  isDataGridToggleControl,
  isDataGridValueEqual,
  resolveDataGridCellEdit
} from './data-grid-cell-edit.js';
function serializeDataGridClipboardField(field) {
  return /[\t\n\r"]/.test(field)
    ? '"' + field.replaceAll('"', '""') + '"'
    : field;
}
function serializeDataGridClipboardText(grid) {
  return grid
    .map((line) => line.map(serializeDataGridClipboardField).join('	'))
    .join('\r\n');
}
function parseDataGridClipboardText(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        quoted = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }
    if (ch === '"' && field === '') {
      quoted = true;
      i += 1;
      continue;
    }
    if (ch === '	') {
      row.push(field);
      field = '';
      i += 1;
      continue;
    }
    if (ch === '\r' || ch === '\n') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }
  row.push(field);
  rows.push(row);
  const last = rows[rows.length - 1];
  if (rows.length > 1 && last?.length === 1 && last[0] === '') rows.pop();
  return rows;
}
function tileDataGridClipboardBlock(block, rowCount, columnCount) {
  const tiled = [];
  for (let r = 0; r < rowCount; r++) {
    const source = block[r % block.length] ?? [];
    const line = [];
    for (let c = 0; c < columnCount; c++) {
      line.push(source[c % (source.length || 1)] ?? '');
    }
    tiled.push(line);
  }
  return tiled;
}
function escapeDataGridClipboardHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
function renderDataGridClipboardHtml(grid) {
  const body = grid
    .map(
      (line) =>
        '<tr>' +
        line
          .map(
            (field) =>
              '<td>' +
              escapeDataGridClipboardHtml(field).replace(
                /\r\n|\r|\n/g,
                '<br>'
              ) +
              '</td>'
          )
          .join('') +
        '</tr>'
    )
    .join('');
  return '<table><tbody>' + body + '</tbody></table>';
}
function getDataGridDisplayOrderedColumns(table) {
  return [
    ...table.getStartVisibleLeafColumns(),
    ...table.getCenterVisibleLeafColumns(),
    ...table.getEndVisibleLeafColumns()
  ];
}
function getDataGridWritableCellEdit(column, row) {
  const cellEdit = column.columnDef.meta?.cellEdit;
  if (!cellEdit || cellEdit.editable === false) return null;
  if (
    typeof cellEdit.editable === 'function' &&
    row !== void 0 &&
    !cellEdit.editable(row)
  ) {
    return null;
  }
  // Built-in controls bring their own parse and format, so paste, fill and
  // the editors read typed values the same way.
  return resolveDataGridCellEdit(cellEdit);
}
function getDataGridRenderedRowIds(table, viewport) {
  if (!viewport) return null;
  if (
    table.getRowModel().rows.length === table.getRowsInDisplayOrder().length
  ) {
    return null;
  }
  const rendered = new Set(table.getRowModel().rows.map((row) => row.id));
  for (const rowEl of Array.from(
    viewport.querySelectorAll('tbody tr[data-row-id]')
  )) {
    const id = rowEl.getAttribute('data-row-id');
    if (id) rendered.add(id);
  }
  return rendered;
}
function getDataGridVisibleSelectedCellCount(table, viewport) {
  const bounds = table.getCellSelectionBounds();
  if (!bounds.length) return 0;
  const rows = table.getRowsInDisplayOrder();
  const columns = getDataGridDisplayOrderedColumns(table);
  const rendered = getDataGridRenderedRowIds(table, viewport);
  let count = 0;
  for (const bound of bounds) {
    let rowCount = 0;
    for (let r = bound.minRowIndex; r <= bound.maxRowIndex; r++) {
      const row = rows[r];
      if (row && (!rendered || rendered.has(row.id))) rowCount += 1;
    }
    let columnCount = 0;
    for (let c = bound.minColumnIndex; c <= bound.maxColumnIndex; c++) {
      const column = columns[c];
      if (column && column.columnDef.enableCellSelection !== false) {
        columnCount += 1;
      }
    }
    count += rowCount * columnCount;
  }
  return count;
}
function getDataGridActiveBound(table) {
  const bounds = table.getCellSelectionBounds();
  if (!bounds.length) return null;
  const focused = table.getFocusedCell();
  if (focused) {
    const rowIndex = focused.row.getDisplayIndex();
    const columnIndex = getDataGridDisplayOrderedColumns(table).findIndex(
      (column) => column.id === focused.column.id
    );
    const containing = bounds.find(
      (bound) =>
        rowIndex >= bound.minRowIndex &&
        rowIndex <= bound.maxRowIndex &&
        columnIndex >= bound.minColumnIndex &&
        columnIndex <= bound.maxColumnIndex
    );
    if (containing) return containing;
  }
  return bounds[bounds.length - 1] ?? null;
}
function getDataGridStepTarget(table, viewport, from, direction) {
  if (direction === 'left' || direction === 'right') {
    const selectable = getDataGridDisplayOrderedColumns(table).filter(
      (column) => column.columnDef.enableCellSelection !== false
    );
    const index2 = selectable.findIndex(
      (column) => column.id === from.columnId
    );
    if (index2 === -1) return null;
    const next = selectable[index2 + (direction === 'right' ? 1 : -1)];
    return next ? { rowId: from.rowId, columnId: next.id } : 'edge';
  }
  const renderedIds = Array.from(
    viewport.querySelectorAll('tbody tr[data-row-id]')
  ).map((row) => row.getAttribute('data-row-id'));
  const index = renderedIds.indexOf(from.rowId);
  if (index === -1) return null;
  const nextId = renderedIds[index + (direction === 'down' ? 1 : -1)];
  return nextId ? { rowId: nextId, columnId: from.columnId } : 'edge';
}
function extendDataGridSelection(table, viewport, direction) {
  const activeCorner = () => {
    const focused2 = table.getFocusedCell();
    if (!focused2) return null;
    const bound = getDataGridActiveBound(table);
    if (!bound) return null;
    const rows = table.getRowsInDisplayOrder();
    const allColumns = getDataGridDisplayOrderedColumns(table);
    const rowIndex = focused2.row.getDisplayIndex();
    const columnIndex = allColumns.findIndex(
      (column) => column.id === focused2.column.id
    );
    return {
      rowId:
        rows[
          rowIndex === bound.minRowIndex ? bound.maxRowIndex : bound.minRowIndex
        ]?.id ?? focused2.row.id,
      columnId:
        allColumns[
          columnIndex === bound.minColumnIndex
            ? bound.maxColumnIndex
            : bound.minColumnIndex
        ]?.id ?? focused2.column.id
    };
  };
  const boundKey = () => {
    const bounds = table.getCellSelectionBounds();
    const bound = bounds[bounds.length - 1];
    return bound
      ? `${bounds.length}:${bound.minRowIndex}-${bound.maxRowIndex}:${bound.minColumnIndex}-${bound.maxColumnIndex}`
      : 'none';
  };
  const before = boundKey();
  table.extendCellSelection(direction);
  if (boundKey() !== before) return activeCorner();
  const focused = table.getFocusedCell();
  if (!focused) return null;
  const active = activeCorner() ?? {
    rowId: focused.row.id,
    columnId: focused.column.id
  };
  const target = getDataGridStepTarget(table, viewport, active, direction);
  if (!target || target === 'edge') return null;
  table.selectCellRange(
    {
      anchorRowId: focused.row.id,
      anchorColumnId: focused.column.id,
      focusRowId: target.rowId,
      focusColumnId: target.columnId
    },
    { mode: 'replace' }
  );
  return target;
}
function getDataGridActiveRegionGrid(table, viewport) {
  const bound = getDataGridActiveBound(table);
  if (!bound) return null;
  const rows = table.getRowsInDisplayOrder();
  const columns = getDataGridDisplayOrderedColumns(table);
  const rendered = getDataGridRenderedRowIds(table, viewport);
  const grid = [];
  for (let r = bound.minRowIndex; r <= bound.maxRowIndex; r++) {
    const row = rows[r];
    if (!row || (rendered && !rendered.has(row.id))) continue;
    const cells = row.getAllCellsByColumnId();
    const line = [];
    for (let c = bound.minColumnIndex; c <= bound.maxColumnIndex; c++) {
      const column = columns[c];
      if (!column || column.columnDef.enableCellSelection === false) continue;
      const value = cells[column.id]?.getValue();
      const format = resolveDataGridCellEdit(
        column.columnDef.meta?.cellEdit
      )?.format;
      line.push(format ? format(value, row.original) : String(value ?? ''));
    }
    grid.push(line);
  }
  return grid.length ? grid : null;
}
function buildDataGridClearDetails(table, source, activeRegionOnly, viewport) {
  const allBounds = table.getCellSelectionBounds();
  const activeBound = getDataGridActiveBound(table);
  const bounds = activeRegionOnly
    ? activeBound
      ? [activeBound]
      : []
    : allBounds;
  if (!bounds.length) return null;
  const rows = table.getRowsInDisplayOrder();
  const columns = getDataGridDisplayOrderedColumns(table);
  const rendered = getDataGridRenderedRowIds(table, viewport);
  const changes = [];
  for (const bound of bounds) {
    for (let r = bound.minRowIndex; r <= bound.maxRowIndex; r++) {
      const row = rows[r];
      if (!row || (rendered && !rendered.has(row.id))) continue;
      const cells = row.getAllCellsByColumnId();
      for (let c = bound.minColumnIndex; c <= bound.maxColumnIndex; c++) {
        const column = columns[c];
        if (!column || column.columnDef.enableCellSelection === false) continue;
        const cellEdit = getDataGridWritableCellEdit(column, row.original);
        if (!cellEdit) continue;
        changes.push({
          rowId: row.id,
          columnId: column.id,
          row: row.original,
          previousValue: cells[column.id]?.getValue(),
          value: cellEdit.clearValue ?? null
        });
      }
    }
  }
  return changes.length ? { source, changes, rejected: [] } : null;
}
function buildDataGridPasteDetails(table, block, viewport) {
  if (!block.length) return null;
  const bound = getDataGridActiveBound(table);
  if (!bound) return null;
  const rows = table.getRowsInDisplayOrder();
  const columns = getDataGridDisplayOrderedColumns(table);
  const rendered = getDataGridRenderedRowIds(table, viewport);
  const targetColumns = [];
  let regionColumns = 0;
  for (let c = bound.minColumnIndex; c < columns.length; c++) {
    const column = columns[c];
    if (!column || column.columnDef.enableCellSelection === false) continue;
    targetColumns.push({ column, displayIndex: c });
    if (c <= bound.maxColumnIndex) regionColumns += 1;
  }
  if (!regionColumns) return null;
  const blockRows = block.length;
  const blockColumns = block.reduce(
    (max, line) => Math.max(max, line.length),
    1
  );
  const regionRows = bound.maxRowIndex - bound.minRowIndex + 1;
  let rowCount;
  let columnCount;
  if (blockRows === 1 && blockColumns === 1) {
    rowCount = regionRows;
    columnCount = regionColumns;
  } else if (
    regionRows % blockRows === 0 &&
    regionColumns % blockColumns === 0
  ) {
    rowCount = regionRows;
    columnCount = regionColumns;
  } else {
    rowCount = blockRows;
    columnCount = blockColumns;
  }
  const tiled = tileDataGridClipboardBlock(block, rowCount, columnCount);
  const startRowIndex = bound.minRowIndex;
  const targetRows = [];
  for (let r = startRowIndex; r < rows.length; r++) {
    if (targetRows.length === rowCount) break;
    const row = rows[r];
    if (!row || (rendered && !rendered.has(row.id))) continue;
    targetRows.push({ row, displayIndex: r });
  }
  const changes = [];
  const rejected = [];
  for (let r = 0; r < targetRows.length; r++) {
    const row = targetRows[r].row;
    const cells = row.getAllCellsByColumnId();
    for (let c = 0; c < columnCount; c++) {
      const column = targetColumns[c]?.column;
      if (!column) continue;
      const raw = tiled[r]?.[c] ?? '';
      const cellEdit = getDataGridWritableCellEdit(column, row.original);
      if (!cellEdit) {
        rejected.push({
          rowId: row.id,
          columnId: column.id,
          raw,
          reason: 'readonly'
        });
        continue;
      }
      const value = cellEdit.parse ? cellEdit.parse(raw, row.original) : raw;
      if (value === void 0) {
        rejected.push({
          rowId: row.id,
          columnId: column.id,
          raw,
          reason: 'invalid'
        });
        continue;
      }
      changes.push({
        rowId: row.id,
        columnId: column.id,
        row: row.original,
        previousValue: cells[column.id]?.getValue(),
        value
      });
    }
  }
  if (!changes.length && !rejected.length) return null;
  const lastTarget =
    targetColumns[Math.min(columnCount, targetColumns.length) - 1];
  return {
    details: { source: 'paste', changes, rejected },
    target: {
      startRowIndex,
      endRowIndex:
        targetRows[targetRows.length - 1]?.displayIndex ?? startRowIndex,
      rowCount: targetRows.length,
      startColumnIndex: targetColumns[0].displayIndex,
      endColumnIndex: lastTarget.displayIndex
    }
  };
}
function invertDataGridCellsChange(details) {
  return {
    source: details.source,
    changes: details.changes.map((change) => ({
      ...change,
      value: change.previousValue,
      previousValue: change.value
    })),
    rejected: []
  };
}
function selectDataGridRegion(table, target) {
  const rows = table.getRowsInDisplayOrder();
  const columns = getDataGridDisplayOrderedColumns(table);
  const anchorRow = rows[target.startRowIndex];
  const anchorColumn = columns[target.startColumnIndex];
  const focusRow = rows[Math.min(target.endRowIndex, rows.length - 1)];
  const focusColumn = columns[target.endColumnIndex];
  if (!anchorRow || !anchorColumn || !focusRow || !focusColumn) return;
  table.selectCellRange(
    {
      anchorRowId: anchorRow.id,
      anchorColumnId: anchorColumn.id,
      focusRowId: focusRow.id,
      focusColumnId: focusColumn.id
    },
    { mode: 'replace' }
  );
}
const dataGridGestureOutlineClasses =
  'outline-ui-primary pointer-events-none absolute z-[35] outline-1 outline-dashed -outline-offset-1';
function startDataGridFillSession(options) {
  const { table, viewport, onCellsChange } = options;
  if (table.getCellSelectionBounds().length > 1) return;
  const bound = getDataGridActiveBound(table);
  if (!bound) return;
  const rows = table.getRowsInDisplayOrder();
  const columns = getDataGridDisplayOrderedColumns(table);
  const domRowIds = /* @__PURE__ */ new Set();
  for (const rowEl of Array.from(
    viewport.querySelectorAll('tbody tr[data-row-id]')
  )) {
    const id = rowEl.getAttribute('data-row-id');
    if (id) domRowIds.add(id);
  }
  const visibleRows = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (domRowIds.has(row.id)) {
      visibleRows.push({ row, displayIndex: i });
    }
  }
  const visibleIndexById = new Map(
    visibleRows.map((entry, index) => [entry.row.id, index])
  );
  const sourceRows = visibleRows.filter(
    ({ displayIndex }) =>
      displayIndex >= bound.minRowIndex && displayIndex <= bound.maxRowIndex
  );
  const sourceEndVisibleIndex = sourceRows.length
    ? visibleIndexById.get(sourceRows[sourceRows.length - 1].row.id)
    : -1;
  if (sourceEndVisibleIndex === -1) return;
  const columnIndexById = new Map(
    columns.map((column, index) => [column.id, index])
  );
  const isFillableColumn = (column) =>
    column.columnDef.enableCellSelection !== false &&
    !!getDataGridWritableCellEdit(column);
  let extension = null;
  let previewCells = [];
  const previewOutline = viewport.ownerDocument.createElement('div');
  previewOutline.setAttribute('data-slot', 'data-grid-cell-fill-preview');
  previewOutline.className = dataGridGestureOutlineClasses;
  previewOutline.style.display = 'none';
  viewport.appendChild(previewOutline);
  viewport.setAttribute('data-cell-filling', '');
  const sourceCorner = (rowId, columnId) =>
    columnId
      ? viewport.querySelector(
          `tr[data-row-id="${CSS.escape(rowId)}"] td[data-col-id="${CSS.escape(columnId)}"]`
        )
      : null;
  const positionPreviewOutline = () => {
    const first = sourceRows.length
      ? sourceCorner(sourceRows[0].row.id, columns[bound.minColumnIndex]?.id)
      : null;
    const lastSource = sourceRows.length
      ? sourceCorner(
          sourceRows[sourceRows.length - 1].row.id,
          columns[bound.maxColumnIndex]?.id
        )
      : null;
    const far = previewCells.length
      ? previewCells[previewCells.length - 1]
      : lastSource;
    if (!first || !far) {
      previewOutline.style.display = 'none';
      return;
    }
    const firstRect = first.getBoundingClientRect();
    const farRect = far.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const left = Math.min(firstRect.left, farRect.left);
    const top = Math.min(firstRect.top, farRect.top);
    previewOutline.style.display = 'block';
    previewOutline.style.left = `${left - viewportRect.left + viewport.scrollLeft}px`;
    previewOutline.style.top = `${top - viewportRect.top + viewport.scrollTop}px`;
    previewOutline.style.width = `${Math.max(firstRect.right, farRect.right) - left}px`;
    previewOutline.style.height = `${Math.max(firstRect.bottom, farRect.bottom) - top}px`;
  };
  const clearPreview = () => {
    for (const cell of previewCells)
      cell.removeAttribute('data-cell-fill-target');
    previewCells = [];
    positionPreviewOutline();
  };
  const getExtensionTargets = () => {
    if (!extension) return null;
    const columnEntries = columns.map((column, displayIndex) => ({
      column,
      displayIndex
    }));
    return extension.axis === 'row'
      ? {
          rowEntries: visibleRows.slice(
            sourceEndVisibleIndex + 1,
            sourceEndVisibleIndex + 1 + extension.count
          ),
          columnEntries: columnEntries
            .slice(bound.minColumnIndex, bound.maxColumnIndex + 1)
            .filter(({ column }) => isFillableColumn(column))
        }
      : {
          rowEntries: sourceRows,
          columnEntries: columnEntries
            .slice(
              bound.maxColumnIndex + 1,
              bound.maxColumnIndex + 1 + extension.count
            )
            .filter(({ column }) => isFillableColumn(column))
        };
  };
  const applyPreview = () => {
    clearPreview();
    const targets = getExtensionTargets();
    if (!targets) return;
    for (const { row } of targets.rowEntries) {
      const rowElement = viewport.querySelector(
        `tr[data-row-id="${CSS.escape(row.id)}"]`
      );
      if (!rowElement) continue;
      for (const { column } of targets.columnEntries) {
        if (!getDataGridWritableCellEdit(column, row.original)) continue;
        const cellElement = rowElement.querySelector(
          `td[data-col-id="${CSS.escape(column.id)}"]`
        );
        if (!cellElement) continue;
        cellElement.setAttribute('data-cell-fill-target', 'true');
        previewCells.push(cellElement);
      }
    }
    positionPreviewOutline();
  };
  const handleMove = (event) => {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const cellElement = element?.closest?.('td[data-col-id]');
    const rowElement = cellElement?.closest?.('tr[data-row-id]');
    if (!cellElement || !rowElement || !viewport.contains(cellElement)) return;
    const rowVisibleIndex = visibleIndexById.get(
      rowElement.getAttribute('data-row-id') ?? ''
    );
    const columnIndex = columnIndexById.get(
      cellElement.getAttribute('data-col-id') ?? ''
    );
    if (rowVisibleIndex === void 0 || columnIndex === void 0) return;
    const rowsDelta = Math.max(0, rowVisibleIndex - sourceEndVisibleIndex);
    const columnsDelta = Math.max(0, columnIndex - bound.maxColumnIndex);
    const next =
      rowsDelta === 0 && columnsDelta === 0
        ? null
        : rowsDelta >= columnsDelta
          ? { axis: 'row', count: rowsDelta }
          : { axis: 'column', count: columnsDelta };
    if (next?.axis === extension?.axis && next?.count === extension?.count) {
      return;
    }
    extension = next;
    applyPreview();
  };
  const finish = (commit) => {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleUp);
    document.removeEventListener('keydown', handleKey, true);
    clearPreview();
    previewOutline.remove();
    viewport.removeAttribute('data-cell-filling');
    if (!commit || !extension || !onCellsChange) return;
    const targets = getExtensionTargets();
    if (!targets || !targets.rowEntries.length) return;
    const changes = [];
    const rejected = [];
    if (extension.axis === 'row') {
      for (let offset = 0; offset < targets.rowEntries.length; offset++) {
        const targetRow = targets.rowEntries[offset].row;
        const sourceRow = sourceRows[offset % sourceRows.length].row;
        const targetCells = targetRow.getAllCellsByColumnId();
        const sourceCells = sourceRow.getAllCellsByColumnId();
        for (const { column } of targets.columnEntries) {
          if (!getDataGridWritableCellEdit(column, targetRow.original)) {
            continue;
          }
          changes.push({
            rowId: targetRow.id,
            columnId: column.id,
            row: targetRow.original,
            previousValue: targetCells[column.id]?.getValue(),
            value: sourceCells[column.id]?.getValue()
          });
        }
      }
    } else {
      const regionColumns = bound.maxColumnIndex - bound.minColumnIndex + 1;
      for (const { row } of targets.rowEntries) {
        const cells = row.getAllCellsByColumnId();
        for (const {
          column: targetColumn,
          displayIndex
        } of targets.columnEntries) {
          const offset = displayIndex - (bound.maxColumnIndex + 1);
          const sourceColumn =
            columns[bound.minColumnIndex + (offset % regionColumns)];
          if (!sourceColumn) continue;
          const targetEdit = getDataGridWritableCellEdit(
            targetColumn,
            row.original
          );
          if (!targetEdit) continue;
          const sourceValue = cells[sourceColumn.id]?.getValue();
          let value = sourceValue;
          if (targetColumn.id !== sourceColumn.id && targetEdit.parse) {
            const sourceFormat = resolveDataGridCellEdit(
              sourceColumn.columnDef.meta?.cellEdit
            )?.format;
            const raw = sourceFormat
              ? sourceFormat(sourceValue, row.original)
              : String(sourceValue ?? '');
            const parsed = targetEdit.parse(raw, row.original);
            if (parsed === void 0) {
              rejected.push({
                rowId: row.id,
                columnId: targetColumn.id,
                raw,
                reason: 'invalid'
              });
              continue;
            }
            value = parsed;
          }
          changes.push({
            rowId: row.id,
            columnId: targetColumn.id,
            row: row.original,
            previousValue: cells[targetColumn.id]?.getValue(),
            value
          });
        }
      }
    }
    if (changes.length || rejected.length) {
      onCellsChange({ source: 'fill', changes, rejected });
    }
    selectDataGridRegion(table, {
      startRowIndex: bound.minRowIndex,
      endRowIndex:
        extension.axis === 'row'
          ? targets.rowEntries[targets.rowEntries.length - 1].displayIndex
          : bound.maxRowIndex,
      startColumnIndex: bound.minColumnIndex,
      endColumnIndex:
        bound.maxColumnIndex +
        (extension.axis === 'column' ? extension.count : 0)
    });
  };
  const handleUp = () => finish(true);
  const handleKey = (event) => {
    if (event.key !== 'Escape') return;
    event.stopPropagation();
    finish(false);
  };
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleUp);
  document.addEventListener('keydown', handleKey, true);
}
function isDataGridEditableTarget(target) {
  return (
    target instanceof Element &&
    target.closest(
      'input, textarea, select, [contenteditable], [data-cell-interactive]'
    ) != null
  );
}
function isDataGridInteractiveKeyTarget(target) {
  return (
    isDataGridEditableTarget(target) ||
    (target instanceof Element &&
      target.closest('button, a, [role="checkbox"]') != null)
  );
}
function DataGridCellSelection({ apiRef, clipboard = true, keyboard = true }) {
  const context = useDataGrid();
  const latestContext = useRef(context);
  latestContext.current = context;
  const anchorRef = useRef(null);
  const [viewportEl, setViewportEl] = useState(null);
  const [editorSession, setEditorSession] = useState(null);
  const { table } = context;
  const enabled =
    !!latestContext.current.props.tableLayout?.cellSelection &&
    table.atoms.cellSelection != null;
  useEffect(() => {
    if (!enabled) return;
    const anchor = anchorRef.current;
    if (!anchor) return;
    const root =
      anchor.closest('[data-slot="data-grid"]') ?? anchor.parentElement;
    if (!root) return;
    const viewports = Array.from(
      root.querySelectorAll('[data-slot="data-grid-table-viewport"]')
    );
    const viewport =
      viewports.find((node) =>
        node.querySelector('[data-slot="data-grid-table-body"]')
      ) ?? viewports[0];
    if (!viewport) return;
    const getTable = () => latestContext.current.table;
    // While a row is in per-row edit mode the rest of the grid is read-only:
    // no spreadsheet edits, pastes, fills or clears reach the host.
    const isRowEditLocked = () =>
      latestContext.current.props.rowEditing?.rowId != null;
    const getOnCellsChange = () =>
      isRowEditLocked()
        ? null
        : (latestContext.current.props.onCellsChange ?? null);
    const isRangeSelectionEnabled = () =>
      latestContext.current.props.tableLayout?.cellSelectionMode !== 'single';
    const focusTarget =
      viewport.querySelector('table[data-slot="data-grid-table"]') ?? viewport;
    const scrollTdIntoView = (cell) =>
      // Optional call: jsdom and some embedded contexts ship elements
      // without scrollIntoView.
      cell?.scrollIntoView?.({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'instant'
      });
    const syncActiveDescendant = () => {
      const cell = viewport.querySelector('td[data-cell-focused]');
      if (cell?.id) focusTarget.setAttribute('aria-activedescendant', cell.id);
      else focusTarget.removeAttribute('aria-activedescendant');
    };
    const scrollFocusedIntoView = (targetRowIndex, rowCount, explicitCell) => {
      const queryScrollCell = () =>
        explicitCell
          ? viewport.querySelector(
              `tr[data-row-id="${CSS.escape(explicitCell.rowId)}"] td[data-col-id="${CSS.escape(explicitCell.columnId)}"]`
            )
          : viewport.querySelector('td[data-cell-focused]');
      requestAnimationFrame(() => {
        const cell = queryScrollCell();
        syncActiveDescendant();
        if (cell || targetRowIndex == null || !rowCount) {
          scrollTdIntoView(cell);
          return;
        }
        let scroller = viewport;
        while (scroller && scroller.scrollHeight <= scroller.clientHeight) {
          scroller = scroller.parentElement;
        }
        if (!scroller) return;
        scroller.scrollTop =
          ((targetRowIndex + 0.5) / rowCount) * scroller.scrollHeight -
          scroller.clientHeight / 2;
        requestAnimationFrame(() => {
          scrollTdIntoView(queryScrollCell());
          syncActiveDescendant();
        });
      });
    };
    const requestCellEdit = (initialText) => {
      if (isRowEditLocked()) return false;
      const table2 = getTable();
      const cell = table2.getFocusedCell();
      if (!cell) return false;
      const cellEdit = getDataGridWritableCellEdit(
        cell.column,
        cell.row.original
      );
      // Checkbox and switch cells flip in place: Enter, F2, Space or a
      // double-click toggles the value without opening an editor.
      if (cellEdit && isDataGridToggleControl(cellEdit.control)) {
        if (initialText !== void 0 && initialText !== ' ') return false;
        const onCellsChange = getOnCellsChange();
        if (!onCellsChange) return false;
        const previousValue = cell.getValue();
        onCellsChange({
          source: 'edit',
          changes: [
            {
              rowId: cell.row.id,
              columnId: cell.column.id,
              row: cell.row.original,
              previousValue,
              value: !previousValue
            }
          ],
          rejected: []
        });
        return true;
      }
      if (cellEdit?.control) {
        const baseline = cellEdit.format
          ? cellEdit.format(cell.getValue(), cell.row.original)
          : String(cell.getValue() ?? '');
        const headerTitle = cell.column.columnDef.meta?.headerTitle;
        const header = cell.column.columnDef.header;
        const cellElement = viewport.querySelector('td[data-cell-focused]');
        const error =
          latestContext.current.props.getCellError?.(
            cell.row.original,
            cell.column.id
          ) ?? null;
        setEditorSession({
          rowId: cell.row.id,
          columnId: cell.column.id,
          control: cellEdit.control,
          cellEdit,
          row: cell.row.original,
          value: cell.getValue(),
          error,
          errorId: cellElement?.getAttribute('aria-describedby') ?? void 0,
          initialValue: initialText ?? baseline,
          baseline,
          label:
            typeof headerTitle === 'string'
              ? headerTitle
              : typeof header === 'string'
                ? header
                : cell.column.id
        });
        return true;
      }
      const onCellEditRequest = latestContext.current.props.onCellEditRequest;
      if (cellEdit && onCellEditRequest) {
        onCellEditRequest({
          rowId: cell.row.id,
          columnId: cell.column.id,
          row: cell.row.original,
          previousValue: cell.getValue(),
          initialText
        });
        return true;
      }
      if (initialText !== void 0) return false;
      const focusedCell = viewport.querySelector('td[data-cell-focused]');
      const control = focusedCell
        ? [
            '[role="combobox"]',
            'select',
            'input, textarea',
            'button, a, [role="checkbox"], [tabindex]:not([tabindex="-1"])'
          ]
            .map((candidate) => focusedCell.querySelector(candidate))
            .find(Boolean)
        : null;
      if (!control) return false;
      control.focus();
      control.click();
      return true;
    };
    let focusRetryTimer;
    const focusCell = (rowId, columnId, options) => {
      clearTimeout(focusRetryTimer);
      let attempts = 12;
      const attempt = () => {
        if (!viewport.isConnected) return;
        const cell = viewport.querySelector(
          `tr[data-row-id="${CSS.escape(rowId)}"] td[data-col-id="${CSS.escape(columnId)}"]`
        );
        if (!cell) {
          if (attempts-- > 0) focusRetryTimer = setTimeout(attempt, 32);
          return;
        }
        getTable().setFocusedCell(rowId, columnId);
        focusTarget.focus();
        if (cell.id) focusTarget.setAttribute('aria-activedescendant', cell.id);
        scrollTdIntoView(cell);
        if (!options?.edit) return;
        let editAttempts = 12;
        const attemptEdit = () => {
          if (!cell.isConnected) return;
          if (cell.hasAttribute('data-cell-focused')) requestCellEdit();
          else if (editAttempts-- > 0) {
            focusRetryTimer = setTimeout(attemptEdit, 32);
          }
        };
        attemptEdit();
      };
      attempt();
    };
    const clearSelection = () => {
      getTable().resetCellSelection(true);
      requestAnimationFrame(syncActiveDescendant);
    };
    const scrollToCell = (rowId, columnId) => {
      scrollTdIntoView(
        viewport.querySelector(
          `tr[data-row-id="${CSS.escape(rowId)}"] td[data-col-id="${CSS.escape(columnId)}"]`
        )
      );
    };
    if (apiRef) apiRef.current = { focusCell, clearSelection, scrollToCell };
    const jumpFocus = (rowTarget, columnTarget, extend) => {
      const table2 = getTable();
      const focused = table2.getFocusedCell();
      if (!focused) return false;
      const rows = table2.getRowsInDisplayOrder();
      const allColumns = getDataGridDisplayOrderedColumns(table2);
      const selectable = allColumns.filter(
        (column) => column.columnDef.enableCellSelection !== false
      );
      if (!rows.length || !selectable.length) return false;
      const rowIndex = focused.row.getDisplayIndex();
      const targetRowIndex =
        rowTarget === 'first'
          ? 0
          : rowTarget === 'last'
            ? rows.length - 1
            : rowTarget === 'same'
              ? rowIndex
              : Math.min(
                  rows.length - 1,
                  Math.max(0, rowIndex + rowTarget.delta)
                );
      let clampedRowIndex = targetRowIndex;
      if (table2.getRowModel().rows.length !== rows.length) {
        const rendered = new Set(
          table2.getRowModel().rows.map((row) => row.id)
        );
        for (const rowEl of Array.from(
          viewport.querySelectorAll('tbody tr[data-row-id]')
        )) {
          rendered.add(rowEl.getAttribute('data-row-id'));
        }
        const step = clampedRowIndex >= rowIndex ? -1 : 1;
        while (
          clampedRowIndex !== rowIndex &&
          rows[clampedRowIndex] &&
          !rendered.has(rows[clampedRowIndex].id)
        ) {
          clampedRowIndex += step;
        }
      }
      const targetRow = rows[clampedRowIndex];
      const targetColumn =
        columnTarget === 'first'
          ? selectable[0]
          : columnTarget === 'last'
            ? selectable[selectable.length - 1]
            : focused.column;
      if (!targetRow || !targetColumn) return false;
      if (extend) {
        const bound = getDataGridActiveBound(table2);
        const columnIndex = allColumns.findIndex(
          (column) => column.id === focused.column.id
        );
        let anchorRowId = focused.row.id;
        let anchorColumnId = focused.column.id;
        if (bound) {
          anchorRowId =
            rows[
              rowIndex === bound.minRowIndex
                ? bound.maxRowIndex
                : bound.minRowIndex
            ]?.id ?? anchorRowId;
          anchorColumnId =
            allColumns[
              columnIndex === bound.minColumnIndex
                ? bound.maxColumnIndex
                : bound.minColumnIndex
            ]?.id ?? anchorColumnId;
        }
        table2.selectCellRange(
          {
            anchorRowId,
            anchorColumnId,
            focusRowId: targetRow.id,
            focusColumnId: targetColumn.id
          },
          { mode: 'replace' }
        );
      } else {
        table2.setFocusedCell(targetRow.id, targetColumn.id);
      }
      scrollFocusedIntoView(
        clampedRowIndex,
        rows.length,
        // The extend keeps focus on the anchor; follow the jump target.
        extend ? { rowId: targetRow.id, columnId: targetColumn.id } : void 0
      );
      return true;
    };
    const moveFocusVisual = (direction) => {
      const table2 = getTable();
      const focused = table2.getFocusedCell();
      const target = focused
        ? getDataGridStepTarget(
            table2,
            viewport,
            { rowId: focused.row.id, columnId: focused.column.id },
            direction
          )
        : null;
      if (target === 'edge') return;
      if (target) {
        table2.setFocusedCell(target.rowId, target.columnId);
        return;
      }
      table2.moveCellSelection(direction);
    };
    const getPageJumpSize = () => {
      const row = viewport.querySelector('tbody tr[data-row-id]');
      let scroller = viewport;
      while (scroller && scroller.scrollHeight <= scroller.clientHeight) {
        scroller = scroller.parentElement;
      }
      const rowHeight = row?.getBoundingClientRect().height || 0;
      const viewHeight = scroller?.clientHeight || viewport.clientHeight;
      if (!rowHeight || !viewHeight) return 10;
      return Math.max(1, Math.floor(viewHeight / rowHeight) - 1);
    };
    const getAppendedRows = () => {
      const body = viewport.querySelector('tbody');
      const appended = [];
      let rowEl = body?.lastElementChild;
      while (rowEl && !rowEl.hasAttribute('data-row-id')) {
        if (
          rowEl instanceof HTMLElement &&
          !rowEl.hasAttribute('aria-hidden')
        ) {
          appended.unshift(rowEl);
        }
        rowEl = rowEl.previousElementSibling;
      }
      return appended;
    };
    const focusFirstIn = (row) => {
      const focusable = row?.querySelector(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable) return false;
      focusable.focus();
      return row.ownerDocument.activeElement === focusable;
    };
    const handleKeyDown = (event) => {
      if (event.defaultPrevented) return;
      const appendedRow =
        event.target instanceof Element
          ? event.target.closest('tbody > tr:not([data-row-id])')
          : null;
      if (appendedRow && viewport.contains(appendedRow)) {
        const appended = getAppendedRows();
        const index = appended.indexOf(appendedRow);
        if (index === -1) return;
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        if (event.key === 'ArrowDown') {
          if (focusFirstIn(appended[index + 1])) event.preventDefault();
          return;
        }
        if (index > 0 && focusFirstIn(appended[index - 1])) {
          event.preventDefault();
          return;
        }
        focusTarget.focus();
        syncActiveDescendant();
        event.preventDefault();
        return;
      }
      if (isDataGridInteractiveKeyTarget(event.target)) {
        if (event.key === 'Escape') {
          const cell = event.target.closest?.('td[data-col-id]');
          if (cell && viewport.contains(cell)) {
            event.preventDefault();
            event.stopPropagation();
            focusTarget.focus();
            syncActiveDescendant();
          }
        }
        return;
      }
      const table2 = getTable();
      const rtl = getComputedStyle(viewport).direction === 'rtl';
      const horizontal = (direction) =>
        rtl ? (direction === 'left' ? 'right' : 'left') : direction;
      if (
        (event.key === 'a' || event.key === 'A' || event.code === 'KeyA') &&
        (event.metaKey || event.ctrlKey) && // AltGr arrives as Ctrl+Alt; that chord types a character on
        // central-European layouts and is not a select-all.
        !event.altKey
      ) {
        if (isRangeSelectionEnabled()) {
          table2.selectAllCells();
          requestAnimationFrame(syncActiveDescendant);
        }
        event.preventDefault();
        return;
      }
      if ((event.metaKey || event.ctrlKey) && !event.altKey) {
        // Undo and redo go to the host's history (useDataGridHistory or
        // useDataGridEditing): Mod+Z, Shift+Mod+Z and Ctrl+Y.
        const { onUndo, onRedo } = latestContext.current.props;
        const key = /^[a-z]$/i.test(event.key)
          ? event.key.toLowerCase()
          : event.code.replace(/^Key/, '').toLowerCase();
        const undo = key === 'z' && !event.shiftKey;
        const redo = (key === 'z' && event.shiftKey) || (key === 'y' && !event.shiftKey);
        if ((undo && onUndo) || (redo && onRedo)) {
          event.preventDefault();
          if (undo) onUndo();
          else onRedo();
          return;
        }
      }
      if ((event.metaKey || event.ctrlKey) && !event.altKey && clipboard) {
        const isCopy =
          event.key === 'c' || event.key === 'C' || event.code === 'KeyC';
        const isCut =
          event.key === 'x' || event.key === 'X' || event.code === 'KeyX';
        if (isCopy || isCut) {
          event.preventDefault();
          void writeSelectionToClipboard().then((written) => {
            if (!written) return;
            latestContext.current.props.onCellsCopy?.({
              ...written,
              cut: isCut
            });
            if (!isCut) return;
            const onCellsChange = getOnCellsChange();
            if (!onCellsChange) return;
            const details = buildDataGridClearDetails(
              getTable(),
              'cut',
              true,
              viewport
            );
            if (details) onCellsChange(details);
          });
          return;
        }
      }
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight': {
          const direction =
            event.key === 'ArrowUp'
              ? 'up'
              : event.key === 'ArrowDown'
                ? 'down'
                : horizontal(event.key === 'ArrowLeft' ? 'left' : 'right');
          if (event.metaKey || event.ctrlKey) {
            const jumped =
              direction === 'up'
                ? jumpFocus(
                    'first',
                    'same',
                    event.shiftKey && isRangeSelectionEnabled()
                  )
                : direction === 'down'
                  ? jumpFocus(
                      'last',
                      'same',
                      event.shiftKey && isRangeSelectionEnabled()
                    )
                  : jumpFocus(
                      'same',
                      direction === 'left' ? 'first' : 'last',
                      event.shiftKey && isRangeSelectionEnabled()
                    );
            if (jumped) event.preventDefault();
            return;
          }
          if (direction === 'down' && !event.shiftKey) {
            const focused2 = table2.getFocusedCell();
            const renderedRows = viewport.querySelectorAll(
              'tbody tr[data-row-id]'
            );
            const lastRenderedId =
              renderedRows[renderedRows.length - 1]?.getAttribute(
                'data-row-id'
              );
            if (
              focused2 &&
              lastRenderedId &&
              focused2.row.id === lastRenderedId &&
              focusFirstIn(getAppendedRows()[0])
            ) {
              event.preventDefault();
              return;
            }
          }
          if (event.shiftKey && isRangeSelectionEnabled()) {
            const corner = extendDataGridSelection(table2, viewport, direction);
            event.preventDefault();
            scrollFocusedIntoView(void 0, void 0, corner ?? void 0);
            return;
          }
          const focused = table2.getFocusedCell();
          const target = focused
            ? getDataGridStepTarget(
                table2,
                viewport,
                { rowId: focused.row.id, columnId: focused.column.id },
                direction
              )
            : null;
          if (target === 'edge') {
            event.preventDefault();
            return;
          }
          if (target) {
            table2.setFocusedCell(target.rowId, target.columnId);
            event.preventDefault();
            scrollFocusedIntoView();
            return;
          }
          table2.moveCellSelection(direction);
          event.preventDefault();
          scrollFocusedIntoView();
          return;
        }
        case 'Home':
        case 'End': {
          const edge = event.key === 'Home' ? 'first' : 'last';
          const jumped =
            event.metaKey || event.ctrlKey
              ? jumpFocus(
                  edge,
                  edge,
                  event.shiftKey && isRangeSelectionEnabled()
                )
              : jumpFocus(
                  'same',
                  edge,
                  event.shiftKey && isRangeSelectionEnabled()
                );
          if (jumped) event.preventDefault();
          return;
        }
        case 'PageUp':
        case 'PageDown': {
          const delta = (event.key === 'PageUp' ? -1 : 1) * getPageJumpSize();
          if (
            jumpFocus(
              { delta },
              'same',
              event.shiftKey && isRangeSelectionEnabled()
            )
          ) {
            event.preventDefault();
          }
          return;
        }
        case 'Enter': {
          if (!event.shiftKey && requestCellEdit()) {
            event.preventDefault();
            return;
          }
          moveFocusVisual(event.shiftKey ? 'up' : 'down');
          event.preventDefault();
          scrollFocusedIntoView();
          return;
        }
        case 'F2': {
          if (requestCellEdit()) event.preventDefault();
          return;
        }
        case 'Tab': {
          const before = table2.getFocusedCell();
          moveFocusVisual(event.shiftKey ? 'left' : 'right');
          const after = table2.getFocusedCell();
          if (after && after.id !== before?.id) {
            event.preventDefault();
            scrollFocusedIntoView();
          }
          return;
        }
        case 'Delete':
        case 'Backspace': {
          const onCellsChange = getOnCellsChange();
          if (!onCellsChange) return;
          const details = buildDataGridClearDetails(
            table2,
            'clear',
            false,
            viewport
          );
          if (details) onCellsChange(details);
          event.preventDefault();
          return;
        }
        case 'Escape': {
          if (table2.getCellSelectionBounds().length) {
            table2.resetCellSelection(true);
            requestAnimationFrame(syncActiveDescendant);
            event.preventDefault();
            event.stopPropagation();
          }
          return;
        }
      }
      if (event.key === ' ') {
        const checkbox = viewport
          .querySelector('td[data-cell-focused]')
          ?.querySelector('[role="checkbox"], input[type="checkbox"]');
        if (checkbox) {
          checkbox.click();
          event.preventDefault();
          return;
        }
      }
      if (
        event.key.length === 1 &&
        !event.metaKey &&
        !(event.ctrlKey && !event.altKey) &&
        requestCellEdit(event.key)
      ) {
        event.preventDefault();
        return;
      }
      if (event.key === ' ' && table2.getFocusedCell()) {
        event.preventDefault();
      }
    };
    const writeSelectionToClipboard = async () => {
      const grid = getDataGridActiveRegionGrid(getTable(), viewport);
      if (!grid) return null;
      const text = serializeDataGridClipboardText(grid);
      try {
        if (
          typeof ClipboardItem !== 'undefined' &&
          navigator.clipboard?.write
        ) {
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/plain': new Blob([text], { type: 'text/plain' }),
              'text/html': new Blob([renderDataGridClipboardHtml(grid)], {
                type: 'text/html'
              })
            })
          ]);
          return { text, grid };
        }
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          return { text, grid };
        }
      } catch {
        // Unsupported browser operation: retain the fallback below.
      }
      const doc = viewport.ownerDocument;
      const scratch = doc.createElement('textarea');
      scratch.value = text;
      scratch.style.position = 'fixed';
      scratch.style.opacity = '0';
      doc.body.appendChild(scratch);
      scratch.select();
      let copied;
      try {
        copied = doc.execCommand('copy');
      } catch {
        copied = false;
      }
      scratch.remove();
      focusTarget.focus();
      return copied ? { text, grid } : null;
    };
    const copySelection = (event, cut) => {
      const grid = getDataGridActiveRegionGrid(getTable(), viewport);
      if (!grid || !event.clipboardData) return false;
      event.preventDefault();
      const text = serializeDataGridClipboardText(grid);
      event.clipboardData.setData('text/plain', text);
      event.clipboardData.setData(
        'text/html',
        renderDataGridClipboardHtml(grid)
      );
      latestContext.current.props.onCellsCopy?.({ text, grid, cut });
      return true;
    };
    const handleCopy = (event) => {
      if (isDataGridEditableTarget(event.target)) return;
      copySelection(event, false);
    };
    const handleCut = (event) => {
      if (isDataGridEditableTarget(event.target)) return;
      if (!copySelection(event, true)) return;
      const onCellsChange = getOnCellsChange();
      if (!onCellsChange) return;
      const details = buildDataGridClearDetails(
        getTable(),
        'cut',
        true,
        viewport
      );
      if (details) onCellsChange(details);
    };
    const handlePaste = (event) => {
      if (isDataGridEditableTarget(event.target)) return;
      const onCellsChange = getOnCellsChange();
      if (!onCellsChange) return;
      const text = event.clipboardData?.getData('text/plain');
      if (!text) return;
      event.preventDefault();
      const table2 = getTable();
      const result = buildDataGridPasteDetails(
        table2,
        parseDataGridClipboardText(text),
        viewport
      );
      if (!result) return;
      onCellsChange(result.details);
      if (isRangeSelectionEnabled()) {
        selectDataGridRegion(table2, result.target);
      }
    };
    let pressedUnfocusedControl = false;
    const getTwoStepControl = (target) => {
      if (!(target instanceof Element)) return null;
      if (target.closest('[data-cell-interactive]')) return null;
      if (
        target.closest('[role="checkbox"], [role="switch"], input[type="checkbox"]')
      ) {
        return null;
      }
      const marked = target.closest('[data-cell-control]');
      if (marked) return marked;
      return target.closest(
        'button, a, select, input, textarea, [contenteditable], [role="combobox"]'
      );
    };
    const handleControlPointerDown = (event) => {
      pressedUnfocusedControl = false;
      if (event.button !== 0) return;
      if (event.shiftKey || event.ctrlKey || event.metaKey) return;
      if (latestContext.current.props.tableLayout?.cellEditMode === 'click')
        return;
      const control = getTwoStepControl(event.target);
      const cell = control?.closest('td[data-col-id]');
      if (!control || !cell || !viewport.contains(cell)) return;
      if (cell.hasAttribute('data-cell-focused')) return;
      const column = getTable().getColumn(
        cell.getAttribute('data-col-id') ?? ''
      );
      if (!column || column.columnDef.enableCellSelection === false) return;
      pressedUnfocusedControl = true;
      event.stopPropagation();
    };
    const handleControlClick = (event) => {
      if (!pressedUnfocusedControl) return;
      pressedUnfocusedControl = false;
      event.preventDefault();
      event.stopPropagation();
    };
    const handleControlMouseDown = (event) => {
      if (!pressedUnfocusedControl) return;
      event.stopPropagation();
      event.preventDefault();
      const cell = event.target?.closest?.('td[data-col-id]');
      const rowId = cell
        ?.closest('tr[data-row-id]')
        ?.getAttribute('data-row-id');
      const columnId = cell?.getAttribute('data-col-id');
      if (!rowId || !columnId) return;
      const tableNow = getTable();
      const cellApi = tableNow
        .getRowsInDisplayOrder()
        .find((row) => row.id === rowId)
        ?.getAllCellsByColumnId()[columnId];
      if (!cellApi) return;
      if (isRangeSelectionEnabled()) {
        cellApi.getSelectionStartHandler()(event);
      } else {
        tableNow.setFocusedCell(rowId, columnId);
      }
      focusTarget.focus();
      requestAnimationFrame(syncActiveDescendant);
    };
    let dragStartedOnCell = false;
    let dragStartSelectionKey = '';
    const getSelectionKey = () => {
      const table2 = getTable();
      const bounds = table2.getCellSelectionBounds();
      const bound = bounds[bounds.length - 1];
      return `${table2.getSelectedCellCount()}:${bounds.length}:${bound ? `${bound.minRowIndex},${bound.minColumnIndex},${bound.maxRowIndex},${bound.maxColumnIndex}` : ''}`;
    };
    const handleDragMouseUp = () => {
      const wasDrag =
        dragStartedOnCell &&
        getTable().getSelectedCellCount() > 1 &&
        getSelectionKey() !== dragStartSelectionKey;
      dragStartedOnCell = false;
      viewport.removeAttribute('data-cell-selecting');
      if (!wasDrag) return;
      const squelch = (clickEvent) => {
        clickEvent.stopPropagation();
        clickEvent.preventDefault();
      };
      viewport.addEventListener('click', squelch, { capture: true });
      setTimeout(() => viewport.removeEventListener('click', squelch, true), 0);
    };
    const handleMouseDown = (event) => {
      if (event.button !== 0) return;
      requestAnimationFrame(syncActiveDescendant);
      const target = event.target;
      if (
        (event.shiftKey || event.metaKey || event.ctrlKey) &&
        isRangeSelectionEnabled() &&
        target?.closest?.('td[data-col-id]')
      ) {
        setTimeout(() => focusTarget.focus(), 0);
      }
      dragStartedOnCell = !!target?.closest?.('td');
      if (dragStartedOnCell) {
        dragStartSelectionKey = getSelectionKey();
        viewport.setAttribute('data-cell-selecting', '');
      }
      if (!target?.closest?.('[data-slot="data-grid-cell-fill-handle"]'))
        return;
      event.preventDefault();
      event.stopPropagation();
      startDataGridFillSession({
        table: getTable(),
        viewport,
        onCellsChange: getOnCellsChange()
      });
    };
    const handleClickToEdit = (event) => {
      if (latestContext.current.props.tableLayout?.cellEditMode !== 'click')
        return;
      if (event.shiftKey || event.ctrlKey || event.metaKey) return;
      if (isDataGridInteractiveKeyTarget(event.target)) return;
      const cell = event.target?.closest?.('td');
      if (!cell?.hasAttribute('data-cell-focused')) return;
      requestCellEdit();
    };
    const handleDoubleClick = (event) => {
      if (isDataGridInteractiveKeyTarget(event.target)) return;
      const target = event.target;
      const cell = target?.closest?.('td');
      if (!cell?.hasAttribute('data-cell-focused')) return;
      requestCellEdit();
    };
    const previousTabIndex = focusTarget.getAttribute('tabindex');
    const previousOutline = focusTarget.style.outline;
    if (keyboard) {
      focusTarget.tabIndex = 0;
      focusTarget.style.outline = 'none';
      viewport.addEventListener('keydown', handleKeyDown);
    }
    if (clipboard) {
      viewport.addEventListener('copy', handleCopy);
      viewport.addEventListener('cut', handleCut);
      viewport.addEventListener('paste', handlePaste);
    }
    viewport.addEventListener('pointerdown', handleControlPointerDown);
    viewport.addEventListener('mousedown', handleControlMouseDown);
    viewport.addEventListener('click', handleControlClick);
    viewport.addEventListener('mousedown', handleMouseDown);
    viewport.addEventListener('click', handleClickToEdit);
    viewport.addEventListener('dblclick', handleDoubleClick);
    viewport.ownerDocument.addEventListener('mouseup', handleDragMouseUp);
    const toBound = (bound) => ({
      minRowIndex: bound.minRowIndex,
      maxRowIndex: bound.maxRowIndex,
      minColumnIndex: bound.minColumnIndex,
      maxColumnIndex: bound.maxColumnIndex
    });
    const selectionSubscription = table.atoms.cellSelection?.subscribe(() => {
      const onCellSelectionChange =
        latestContext.current.props.onCellSelectionChange;
      if (!onCellSelectionChange) return;
      const tableNow = getTable();
      const focusedCell = tableNow.getFocusedCell();
      const activeBound = getDataGridActiveBound(tableNow);
      onCellSelectionChange({
        focused: focusedCell
          ? { rowId: focusedCell.row.id, columnId: focusedCell.column.id }
          : null,
        bounds: tableNow.getCellSelectionBounds().map(toBound),
        activeBound: activeBound ? toBound(activeBound) : null,
        visibleCellCount: getDataGridVisibleSelectedCellCount(
          tableNow,
          viewport
        )
      });
    });
    setViewportEl(viewport);
    return () => {
      if (keyboard) {
        if (previousTabIndex === null) focusTarget.removeAttribute('tabindex');
        else focusTarget.setAttribute('tabindex', previousTabIndex);
        focusTarget.style.outline = previousOutline;
        focusTarget.removeAttribute('aria-activedescendant');
        viewport.removeEventListener('keydown', handleKeyDown);
      }
      if (clipboard) {
        viewport.removeEventListener('copy', handleCopy);
        viewport.removeEventListener('cut', handleCut);
        viewport.removeEventListener('paste', handlePaste);
      }
      viewport.removeEventListener('pointerdown', handleControlPointerDown);
      viewport.removeEventListener('mousedown', handleControlMouseDown);
      viewport.removeEventListener('click', handleControlClick);
      viewport.removeEventListener('mousedown', handleMouseDown);
      viewport.removeEventListener('click', handleClickToEdit);
      viewport.removeEventListener('dblclick', handleDoubleClick);
      viewport.ownerDocument.removeEventListener('mouseup', handleDragMouseUp);
      viewport.removeAttribute('data-cell-selecting');
      selectionSubscription?.unsubscribe();
      clearTimeout(focusRetryTimer);
      if (apiRef) apiRef.current = null;
      setViewportEl(null);
      setEditorSession(null);
    };
  }, [
    enabled,
    keyboard,
    clipboard,
    table.store,
    table.atoms.cellSelection,
    apiRef
  ]);
  useEffect(() => {
    if (!viewportEl || !editorSession) return;
    viewportEl.setAttribute('data-cell-editing', '');
    return () => viewportEl.removeAttribute('data-cell-editing');
  }, [viewportEl, editorSession]);
  const closeEditorSession = (advance, refocus = true) => {
    setEditorSession(null);
    if (advance) {
      const tableNow = latestContext.current.table;
      const focused = tableNow.getFocusedCell();
      const target =
        focused && viewportEl
          ? getDataGridStepTarget(
              tableNow,
              viewportEl,
              { rowId: focused.row.id, columnId: focused.column.id },
              advance
            )
          : null;
      if (target && target !== 'edge') {
        tableNow.setFocusedCell(target.rowId, target.columnId);
      } else if (!target) {
        tableNow.moveCellSelection(advance);
      }
    }
    if (!refocus) return;
    requestAnimationFrame(() => {
      const focusEl =
        viewportEl?.querySelector('table[data-slot="data-grid-table"]') ??
        viewportEl;
      focusEl?.focus();
      const cell = viewportEl?.querySelector('td[data-cell-focused]');
      if (cell?.id) focusEl?.setAttribute('aria-activedescendant', cell.id);
      cell?.scrollIntoView?.({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'instant'
      });
    });
  };
  // `typed` carries a `{ value }` from the select, combobox and date editors,
  // which produce a value directly instead of text to parse.
  const commitEditorSession = (raw, advance, refocus = true, typed) => {
    const session = editorSession;
    closeEditorSession(advance, refocus);
    const onCellsChange = latestContext.current.props.onCellsChange;
    if (!session || !onCellsChange) return;
    if (!typed && raw === session.baseline) return;
    const tableNow = latestContext.current.table;
    const row = tableNow
      .getRowsInDisplayOrder()
      .find((candidate) => candidate.id === session.rowId);
    const column = tableNow.getColumn(session.columnId);
    const cellEdit =
      column && row ? getDataGridWritableCellEdit(column, row.original) : null;
    if (!row || !column || !cellEdit) return;
    const previousValue = row.getAllCellsByColumnId()[column.id]?.getValue();
    let value = raw;
    if (typed) {
      if (isDataGridValueEqual(typed.value, previousValue)) return;
      value = typed.value;
    } else if (cellEdit.parse) {
      const parsed = cellEdit.parse(raw, row.original);
      if (parsed === void 0) {
        onCellsChange({
          source: 'edit',
          changes: [],
          rejected: [
            {
              rowId: session.rowId,
              columnId: session.columnId,
              raw,
              reason: 'invalid'
            }
          ]
        });
        return;
      }
      value = parsed;
    }
    onCellsChange({
      source: 'edit',
      changes: [
        {
          rowId: session.rowId,
          columnId: session.columnId,
          row: row.original,
          previousValue,
          value
        }
      ],
      rejected: []
    });
  };
  return (
    <>
      <span ref={anchorRef} hidden data-slot='data-grid-cell-selection' />
      {enabled && viewportEl && editorSession ? (
        <DataGridCellEditorOverlay
          key={`${editorSession.rowId}:${editorSession.columnId}`}
          viewport={viewportEl}
          session={editorSession}
          enterAdvance={
            latestContext.current.props.tableLayout?.cellEditEnterAdvance ===
            true
          }
          onCommit={commitEditorSession}
          onCancel={() => closeEditorSession(null)}
        />
      ) : null}
    </>
  );
}
function measureDataGridCellEditorStyle(viewport) {
  const cell = viewport.querySelector('td[data-cell-focused]');
  if (!cell) return null;
  const cellRect = cell.getBoundingClientRect();
  const viewportRect = viewport.getBoundingClientRect();
  const cellStyle = getComputedStyle(cell);
  const lineHeight =
    Number.parseFloat(cellStyle.lineHeight) ||
    Number.parseFloat(cellStyle.fontSize) * 1.5 ||
    20;
  const centeredBlockPadding = Math.max(
    Number.parseFloat(cellStyle.paddingTop) || 0,
    (cellRect.height - lineHeight) / 2
  );
  return {
    // Rect deltas are visual; when the viewport itself is the scroll
    // container (the standalone virtual layout), absolute children live in
    // content coordinates, so the scroll offset must be added back. The box
    // matches the cell exactly - editing must not change the cell's
    // geometry - and the cell's own overlay chrome hides for the session
    // (data-cell-editing), so the editor's outline is the ONE border.
    left: cellRect.left - viewportRect.left + viewport.scrollLeft,
    top: cellRect.top - viewportRect.top + viewport.scrollTop,
    width: cellRect.width,
    minHeight: cellRect.height,
    // The font shorthand can serialize empty (Firefox); the longhands after
    // it win where set and cover that case.
    font: cellStyle.font || void 0,
    fontFamily: cellStyle.fontFamily,
    fontSize: cellStyle.fontSize,
    fontWeight: cellStyle.fontWeight,
    fontStyle: cellStyle.fontStyle,
    lineHeight: cellStyle.lineHeight,
    letterSpacing: cellStyle.letterSpacing,
    textAlign: cellStyle.textAlign,
    paddingLeft: cellStyle.paddingLeft,
    paddingRight: cellStyle.paddingRight,
    paddingTop: centeredBlockPadding,
    paddingBottom: centeredBlockPadding
  };
}
function DataGridCellEditorOverlay({
  viewport,
  session,
  enterAdvance,
  onCommit,
  onCancel
}) {
  const [style] = useState(() => measureDataGridCellEditorStyle(viewport));
  const finishedRef = useRef(false);
  const placeCaretAtEnd = (element) => {
    if (!element) return;
    const end = element.value.length;
    element.setSelectionRange?.(end, end);
  };
  useEffect(() => {
    if (!style) onCancel();
  }, [style, onCancel]);
  useEffect(() => {
    const body = viewport.querySelector('tbody');
    if (!body) return;
    const observer = new MutationObserver(() => {
      if (!finishedRef.current) onCancel();
    });
    observer.observe(body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [viewport, onCancel]);
  if (!style) return null;
  const finish = (element, commit, advance = null, refocus = true) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (commit) onCommit(element.value, advance, refocus);
    else onCancel();
  };
  const handleKeyDown = (event) => {
    const element = event.currentTarget;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      finish(element, false);
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      finish(element, true, event.shiftKey ? 'left' : 'right');
      return;
    }
    if (event.key !== 'Enter') return;
    if (session.control === 'textarea' && (event.shiftKey || event.altKey)) {
      return;
    }
    event.preventDefault();
    finish(
      element,
      true,
      enterAdvance ? (event.shiftKey ? 'up' : 'down') : null
    );
  };
  if (DATA_GRID_BUILT_IN_OVERLAY_CONTROLS.has(session.control)) {
    return createPortal(
      <DataGridCellEditorControl
        session={session}
        style={style}
        enterAdvance={enterAdvance}
        onCommit={(raw, advance, refocus, typed) => {
          if (finishedRef.current) return;
          finishedRef.current = true;
          onCommit(raw, advance, refocus, typed);
        }}
        onCancel={() => {
          if (finishedRef.current) return;
          finishedRef.current = true;
          onCancel();
        }}
      />,
      viewport
    );
  }
  const sharedClassName =
    'text-ui-foreground bg-ui-background absolute z-[35] box-border resize-none shadow-[inset_0_0_0_1px_var(--primary)] aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)]';
  const errorProps = session.error
    ? { 'aria-invalid': true, 'aria-describedby': session.errorId }
    : null;
  return createPortal(
    session.control === 'textarea' ? (
      <textarea
        data-slot='data-grid-cell-editor'
        ref={placeCaretAtEnd}
        autoFocus
        {...errorProps}
        aria-label={session.label}
        defaultValue={session.initialValue}
        rows={1}
        style={style}
        className={cn(sharedClassName, 'field-sizing-content overflow-hidden')}
        onKeyDown={handleKeyDown}
        onBlur={(event) => finish(event.currentTarget, true, null, false)}
      />
    ) : (
      <input
        data-slot='data-grid-cell-editor'
        ref={placeCaretAtEnd}
        autoFocus
        {...errorProps}
        aria-label={session.label}
        defaultValue={session.initialValue}
        style={style}
        className={sharedClassName}
        onKeyDown={handleKeyDown}
        onBlur={(event) => finish(event.currentTarget, true, null, false)}
      />
    ),
    viewport
  );
}
function DataGridSelectionBar({
  children,
  className,
  label,
  clearLabel = 'Clear',
  onClear
}) {
  const context = useDataGrid();
  const latestContext = useRef(context);
  latestContext.current = context;
  const rowSelectionAtom = latestContext.current.table.atoms.rowSelection;
  if (rowSelectionAtom == null) return null;
  return (
    <Subscribe source={rowSelectionAtom}>
      {() => {
        const table = latestContext.current.table;
        const count = table.getSelectedRowModel().rows.length;
        if (count === 0) return null;
        return (
          <div
            data-slot='data-grid-selection-bar'
            className={cn(
              'bg-ui-background rounded-card sticky inset-x-0 bottom-4 z-40 mx-auto flex w-fit max-w-[calc(100%-2rem)] flex-wrap items-center gap-3 border px-4 py-2.5 shadow-lg',
              className
            )}
          >
            <span className='text-ui-foreground text-sm font-medium'>
              {label ? label(count) : `${count} selected`}
            </span>
            <div className='flex flex-1 flex-wrap items-center justify-end gap-2.5'>
              {children}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  latestContext.current.table.resetRowSelection();
                  onClear?.();
                }}
              >
                {clearLabel}
              </Button>
            </div>
          </div>
        );
      }}
    </Subscribe>
  );
}
export {
  DataGridCellSelection,
  DataGridSelectionBar,
  buildDataGridClearDetails,
  buildDataGridPasteDetails,
  getDataGridActiveRegionGrid,
  getDataGridVisibleSelectedCellCount,
  invertDataGridCellsChange,
  parseDataGridClipboardText,
  serializeDataGridClipboardText,
  tileDataGridClipboardBlock
};
