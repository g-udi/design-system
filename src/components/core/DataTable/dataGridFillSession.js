import { resolveDataGridCellEdit } from './cellEditing.js';
import {
  getDataGridDisplayOrderedColumns,
  getDataGridWritableCellEdit,
  getDataGridActiveBound,
  selectDataGridRegion
} from './dataGridSelectionModel.js';
const dataGridGestureOutlineClasses =
  'outline-ui-primary pointer-events-none absolute z-[35] outline-1 outline-dashed -outline-offset-1';
function startDataGridFillSession(options) {
  const { table, viewport, onCellsChange, pointerId } = options;
  const pointerSession = typeof pointerId === 'number';
  const moveEvent = pointerSession ? 'pointermove' : 'mousemove';
  const upEvent = pointerSession ? 'pointerup' : 'mouseup';
  const document = viewport.ownerDocument;
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
    if (pointerSession && event.pointerId !== pointerId) return;
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
  let finished = false;
  const finish = (commit) => {
    if (finished) return;
    finished = true;
    document.removeEventListener(moveEvent, handleMove);
    document.removeEventListener(upEvent, handleUp);
    document.removeEventListener('pointercancel', handleCancel);
    document.defaultView?.removeEventListener('blur', handleBlur);
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
  const handleUp = (event) => {
    if (pointerSession && event.pointerId !== pointerId) return;
    handleMove(event);
    finish(true);
  };
  const handleCancel = (event) => {
    if (event.pointerId === pointerId) finish(false);
  };
  const handleBlur = () => finish(false);
  const handleKey = (event) => {
    if (event.key !== 'Escape') return;
    event.stopPropagation();
    finish(false);
  };
  document.addEventListener(moveEvent, handleMove);
  document.addEventListener(upEvent, handleUp);
  if (pointerSession) document.addEventListener('pointercancel', handleCancel);
  document.defaultView?.addEventListener('blur', handleBlur);
  document.addEventListener('keydown', handleKey, true);
  return () => finish(false);
}
export { startDataGridFillSession };
