import { resolveDataGridCellEdit } from './cellEditing.js';
import { tileDataGridClipboardBlock } from './dataGridClipboard.js';
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
export { getDataGridDisplayOrderedColumns, getDataGridWritableCellEdit, getDataGridVisibleSelectedCellCount, getDataGridActiveBound, getDataGridStepTarget, extendDataGridSelection, getDataGridActiveRegionGrid, buildDataGridClearDetails, buildDataGridPasteDetails, invertDataGridCellsChange, selectDataGridRegion };
