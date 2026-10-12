'use client';
import { writeToClipboard } from '../../../../hooks/interaction/use-copy-to-clipboard.js';
import { useEffect, useRef, useState } from 'react';
import { useDataGrid } from '../DataGrid.jsx';
import { isDataGridToggleControl, isDataGridValueEqual } from '../cellEditing.js';
import {
  serializeDataGridClipboardText,
  parseDataGridClipboardText,
  tileDataGridClipboardBlock,
  renderDataGridClipboardHtml
} from '../dataGridClipboard.js';
import {
  getDataGridDisplayOrderedColumns,
  getDataGridWritableCellEdit,
  getDataGridVisibleSelectedCellCount,
  getDataGridActiveBound,
  getDataGridStepTarget,
  extendDataGridSelection,
  getDataGridActiveRegionGrid,
  buildDataGridClearDetails,
  buildDataGridPasteDetails,
  invertDataGridCellsChange,
  selectDataGridRegion
} from '../dataGridSelectionModel.js';
import { startDataGridFillSession } from '../dataGridFillSession.js';
import { DataGridCellEditorOverlay } from './DataGridCellEditorOverlay.jsx';
import { DataGridSelectionBar } from './DataGridSelectionBar.jsx';
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
    let disposed = false;
    let cancelFill;
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
      if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
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
          const selectionKey = getSelectionKey();
          void writeSelectionToClipboard().then((written) => {
            if (!written || disposed || selectionKey !== getSelectionKey()) return;
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
      } catch {
        // Rich clipboard is optional; the shared writer handles text and selection fallbacks.
      }
      const copied = await writeToClipboard(text);
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
    };
    const handleFillPointerDown = (event) => {
      if (event.button !== 0 || !event.isPrimary) return;
      if (!event.target?.closest?.('[data-slot="data-grid-cell-fill-handle"]'))
        return;
      event.preventDefault();
      event.stopPropagation();
      cancelFill?.();
      cancelFill = startDataGridFillSession({
        table: getTable(),
        viewport,
        pointerId: event.pointerId,
        onCellsChange: (details) => getOnCellsChange()?.(details)
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
    viewport.addEventListener('pointerdown', handleFillPointerDown);
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
      disposed = true;
      cancelFill?.();
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
      viewport.removeEventListener('pointerdown', handleFillPointerDown);
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
    if (!session || !onCellsChange || latestContext.current.props.rowEditing?.rowId != null) return;
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
