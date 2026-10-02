'use client';
// Editing workflows on top of the grid's change pipeline (`onCellsChange`):
// undo and redo, pending changes with Save and Discard, per-cell validation,
// and per-row edit mode. The hooks own state in the host; the components read
// the hook result through DataGrid props (`gridProps`) or their own props.
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { default as Kbd } from '../../Kbd/index.js';
import { Checkbox } from '../../Checkbox/parts/checkbox.jsx';
import { Switch } from '../../Switch/parts/switch.jsx';
import { Spinner } from '../../Spinner/parts/spinner.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { getColumnHeaderLabel, useDataGrid } from './data-grid-extended.jsx';
import { invertDataGridCellsChange } from './data-grid-cell-selection-extended.jsx';
import { DataGridCellInlineEditor } from './data-grid-cell-editors-extended.jsx';
import {
  applyDataGridCellsChange,
  getDataGridDefValue,
  getDataGridEditableColumnDefs,
  isDataGridValueEqual,
  resolveDataGridCellEdit,
  setDataGridDefValue,
  validateDataGridCellValue
} from './data-grid-cell-edit.js';

// Copy for the editing parts. Override any key through DataGrid's
// `i18n.labels`, next to the grid's own labels.
const DATA_GRID_EDITING_LABELS = {
  undo: 'Undo',
  redo: 'Redo',
  undoAction: (source) => (source ? `Undo ${source}` : 'Undo'),
  redoAction: (source) => (source ? `Redo ${source}` : 'Redo'),
  unsavedChanges: (count) =>
    `${count} unsaved ${count === 1 ? 'change' : 'changes'}`,
  invalidCells: (count) =>
    `${count} ${count === 1 ? 'cell needs' : 'cells need'} attention`,
  showInvalidCell: 'Show',
  saveBlocked: 'Fix the highlighted cells to save',
  save: 'Save',
  saving: 'Saving',
  discard: 'Discard',
  editRow: (name) => (name ? `Edit ${name}` : 'Edit row'),
  saveRow: 'Save',
  cancelRowEdit: 'Cancel'
};
const DATA_GRID_HISTORY_SOURCES = {
  edit: 'edit',
  paste: 'paste',
  fill: 'fill',
  clear: 'clear',
  cut: 'cut',
  insert: 'add row',
  remove: 'delete',
  duplicate: 'duplicate'
};
function useDataGridEditingLabels() {
  const { i18n } = useDataGrid();
  return { ...DATA_GRID_EDITING_LABELS, ...i18n.labels };
}
const defaultGetRowId = (row) => row.id;
const dataGridCellKey = (rowId, columnId) => `${rowId}\u0000${columnId}`;
function defaultDataGridInvalidMessage(cellEdit) {
  if (cellEdit?.invalidMessage) return cellEdit.invalidMessage;
  if (cellEdit?.control === 'number') return 'Enter a number';
  if (cellEdit?.control === 'date') return 'Enter a date';
  if (cellEdit?.control === 'select' || cellEdit?.control === 'combobox') {
    return 'Choose one of the options';
  }
  return 'Enter a valid value';
}

/**
 * Undo and redo for grid edits. Every `onCellsChange` batch (an edit, a
 * paste, a fill, a clear or a cut) is one step: undo applies its inverse
 * through `onApply`, redo applies it again. `record({ undo, redo, source })`
 * adds a custom step such as a row insert.
 */
export function useDataGridHistory({ onApply, limit = 100 } = {}) {
  const stackRef = useRef({ past: [], future: [] });
  const [, setVersion] = useState(0);
  const onApplyRef = useRef(onApply);
  onApplyRef.current = onApply;
  const commit = useCallback((next) => {
    stackRef.current = next;
    setVersion((version) => version + 1);
  }, []);
  const run = useCallback((entry, direction) => {
    if (typeof entry[direction] === 'function') {
      entry[direction]();
      return;
    }
    onApplyRef.current?.(
      direction === 'undo'
        ? { ...invertDataGridCellsChange(entry), source: 'undo', origin: entry.source }
        : { ...entry, rejected: [], source: 'redo', origin: entry.source }
    );
  }, []);
  const record = useCallback(
    (entry) => {
      if (!entry) return;
      if (typeof entry.undo !== 'function' && !entry.changes?.length) return;
      commit({ past: [...stackRef.current.past, entry].slice(-limit), future: [] });
    },
    [commit, limit]
  );
  const onCellsChange = useCallback(
    (details) => {
      if (!details?.changes?.length) return;
      onApplyRef.current?.(details);
      record(details);
    },
    [record]
  );
  const undo = useCallback(() => {
    const { past, future } = stackRef.current;
    const entry = past[past.length - 1];
    if (!entry) return false;
    run(entry, 'undo');
    commit({ past: past.slice(0, -1), future: [...future, entry] });
    return true;
  }, [commit, run]);
  const redo = useCallback(() => {
    const { past, future } = stackRef.current;
    const entry = future[future.length - 1];
    if (!entry) return false;
    run(entry, 'redo');
    commit({ past: [...past, entry], future: future.slice(0, -1) });
    return true;
  }, [commit, run]);
  const clear = useCallback(() => commit({ past: [], future: [] }), [commit]);
  const { past, future } = stackRef.current;
  return {
    onCellsChange,
    record,
    undo,
    redo,
    clear,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    undoCount: past.length,
    redoCount: future.length,
    nextUndo: past[past.length - 1] ?? null,
    nextRedo: future[future.length - 1] ?? null,
    gridProps: { onCellsChange, onUndo: undo, onRedo: redo }
  };
}

/**
 * A working copy of `data` with pending edits, validation and history. Pass
 * `rows` to the table and spread `gridProps` onto DataGrid; `save()` hands the
 * pending changes to `onSave` and `discard()` reverts them all.
 */
export function useDataGridEditing({
  data,
  columns,
  getRowId = defaultGetRowId,
  onSave,
  onReject,
  historyLimit = 100
}) {
  const [baseline, setBaseline] = useState({ data, saved: data });
  const [rows, setRows] = useState(data);
  const [notices, setNotices] = useState(() => new Map());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  // New host data (a refetch) becomes the saved baseline.
  if (baseline.data !== data) {
    setBaseline({ data, saved: data });
    setRows(data);
  }
  const saved = baseline.saved;
  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  const getRowIdRef = useRef(getRowId);
  getRowIdRef.current = getRowId;
  const idOf = useCallback(
    (row, index) => String(getRowIdRef.current(row, index)),
    []
  );
  const defs = useMemo(() => getDataGridEditableColumnDefs(columns), [columns]);
  const apply = useCallback(
    (details) =>
      setRows((previous) =>
        applyDataGridCellsChange(previous, details, {
          columns,
          getRowId: getRowIdRef.current
        })
      ),
    [columns]
  );
  const history = useDataGridHistory({ onApply: apply, limit: historyLimit });
  const clearHistory = history.clear;
  useEffect(() => {
    clearHistory();
    setNotices(new Map());
  }, [data, clearHistory]);
  const summary = useMemo(() => {
    const savedById = new Map(saved.map((row, index) => [idOf(row, index), row]));
    const currentIds = new Set();
    const updated = [];
    const added = [];
    const errors = new Map();
    const cellStatus = new Map();
    const rowStatus = new Map();
    rows.forEach((row, index) => {
      const rowId = idOf(row, index);
      currentIds.add(rowId);
      const before = savedById.get(rowId);
      if (before === row) return;
      if (!before) {
        added.push(row);
        rowStatus.set(rowId, 'new');
      }
      for (const [columnId, def] of defs) {
        const value = getDataGridDefValue(def, row);
        if (before) {
          const previousValue = getDataGridDefValue(def, before);
          if (isDataGridValueEqual(value, previousValue)) continue;
          updated.push({ rowId, columnId, row, previousValue, value });
          cellStatus.set(dataGridCellKey(rowId, columnId), 'dirty');
          rowStatus.set(rowId, 'dirty');
        }
        const message = validateDataGridCellValue(def.meta.cellEdit, value, row);
        if (message) errors.set(dataGridCellKey(rowId, columnId), message);
      }
    });
    const removed = saved.filter((row, index) => !currentIds.has(idOf(row, index)));
    return { updated, added, removed, errors, cellStatus, rowStatus };
  }, [rows, saved, defs, idOf]);
  const pendingCount =
    summary.updated.length + summary.added.length + summary.removed.length;
  const errorCount = summary.errors.size;
  const recordNotices = useCallback(
    (details) => {
      const invalid = (details.rejected ?? []).filter((entry) => entry.reason === 'invalid');
      if (!invalid.length && !details.changes?.length) return;
      setNotices((previous) => {
        const next = new Map(previous);
        for (const change of details.changes ?? []) {
          next.delete(dataGridCellKey(change.rowId, change.columnId));
        }
        for (const entry of invalid) {
          next.set(
            dataGridCellKey(entry.rowId, entry.columnId),
            defaultDataGridInvalidMessage(defs.get(entry.columnId)?.meta?.cellEdit)
          );
        }
        return next.size || previous.size ? next : previous;
      });
    },
    [defs]
  );
  const historyCellsChange = history.onCellsChange;
  const onCellsChange = useCallback(
    (details) => {
      recordNotices(details);
      if (details.rejected?.length) onReject?.(details.rejected, details);
      historyCellsChange(details);
    },
    [historyCellsChange, onReject, recordNotices]
  );
  const record = history.record;
  const runRowOperation = useCallback(
    (entry) => {
      entry.redo();
      record(entry);
    },
    [record]
  );
  const insertRow = useCallback(
    (row, { index, afterRowId, source = 'insert' } = {}) => {
      const current = rowsRef.current;
      const after = afterRowId === void 0
        ? -1
        : current.findIndex((candidate, i) => idOf(candidate, i) === String(afterRowId));
      const at = index ?? (after === -1 ? current.length : after + 1);
      const rowId = idOf(row, at);
      runRowOperation({
        source,
        redo: () =>
          setRows((previous) => [...previous.slice(0, at), row, ...previous.slice(at)]),
        undo: () =>
          setRows((previous) => previous.filter((candidate, i) => idOf(candidate, i) !== rowId))
      });
    },
    [idOf, runRowOperation]
  );
  const duplicateRow = useCallback(
    (rowId, createCopy) => {
      const source = rowsRef.current.find((row, i) => idOf(row, i) === String(rowId));
      if (!source) return;
      insertRow(createCopy(source), { afterRowId: rowId, source: 'duplicate' });
    },
    [idOf, insertRow]
  );
  const removeRows = useCallback(
    (rowIds) => {
      const ids = new Set([...rowIds].map(String));
      const taken = rowsRef.current
        .map((row, index) => ({ row, index }))
        .filter(({ row, index }) => ids.has(idOf(row, index)));
      if (!taken.length) return;
      runRowOperation({
        source: 'remove',
        redo: () =>
          setRows((previous) => previous.filter((row, i) => !ids.has(idOf(row, i)))),
        undo: () =>
          setRows((previous) => {
            const next = [...previous];
            for (const { row, index } of taken) next.splice(index, 0, row);
            return next;
          })
      });
    },
    [idOf, runRowOperation]
  );
  const discard = useCallback(() => {
    setRows(baseline.saved);
    clearHistory();
    setNotices(new Map());
    setSaveError(null);
  }, [baseline.saved, clearHistory]);
  const save = useCallback(async () => {
    if (saving || summary.errors.size) return false;
    const snapshot = rowsRef.current;
    if (!pendingCount) return true;
    setSaving(true);
    setSaveError(null);
    try {
      const result = await onSave?.({
        rows: snapshot,
        updated: summary.updated,
        added: summary.added,
        removed: summary.removed
      });
      if (result === false) return false;
      setBaseline((previous) => ({ ...previous, saved: snapshot }));
      clearHistory();
      setNotices(new Map());
      return true;
    } catch (error) {
      setSaveError(error);
      return false;
    } finally {
      setSaving(false);
    }
  }, [clearHistory, onSave, pendingCount, saving, summary]);
  const getCellError = useCallback(
    (row, columnId) => {
      const key = dataGridCellKey(idOf(row), columnId);
      return summary.errors.get(key) ?? notices.get(key) ?? null;
    },
    [idOf, notices, summary.errors]
  );
  const getCellStatus = useCallback(
    (row, columnId) => {
      const key = dataGridCellKey(idOf(row), columnId);
      if (summary.errors.has(key) || notices.has(key)) return 'invalid';
      return summary.cellStatus.get(key);
    },
    [idOf, notices, summary]
  );
  const getRowStatus = useCallback(
    (row) => summary.rowStatus.get(idOf(row)),
    [idOf, summary.rowStatus]
  );
  const firstError = useMemo(() => {
    for (const [key, message] of summary.errors) {
      const [rowId, columnId] = key.split('\u0000');
      return { rowId, columnId, message };
    }
    return null;
  }, [summary.errors]);
  return {
    rows,
    savedRows: saved,
    pending: { updated: summary.updated, added: summary.added, removed: summary.removed },
    pendingCount,
    isDirty: pendingCount > 0,
    errors: summary.errors,
    errorCount,
    firstError,
    saving,
    saveError,
    save,
    discard,
    insertRow,
    duplicateRow,
    removeRows,
    onCellsChange,
    history,
    undo: history.undo,
    redo: history.redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    getCellError,
    getCellStatus,
    getRowStatus,
    gridProps: {
      onCellsChange,
      onUndo: history.undo,
      onRedo: history.redo,
      getCellError,
      getCellStatus,
      getRowStatus
    }
  };
}

/**
 * Per-row edit mode: one row at a time becomes a draft with an editor in each
 * editable cell. Spread `gridProps` onto DataGrid and render
 * DataGridRowEditActions in an actions column. `onSave(draft, context)` may
 * return a promise, or false to keep editing.
 */
export function useDataGridRowEditing({
  columns,
  getRowId = defaultGetRowId,
  onSave,
  onCancel
}) {
  const [session, setSession] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const defs = useMemo(() => getDataGridEditableColumnDefs(columns), [columns]);
  const errors = useMemo(() => {
    const map = new Map();
    if (!session) return map;
    for (const [columnId, def] of defs) {
      const cellEdit = def.meta.cellEdit;
      if (typeof cellEdit.editable === 'function' && !cellEdit.editable(session.original)) continue;
      if (cellEdit.editable === false) continue;
      const message = validateDataGridCellValue(
        cellEdit,
        getDataGridDefValue(def, session.draft),
        session.draft
      );
      if (message) map.set(columnId, message);
    }
    return map;
  }, [defs, session]);
  const start = useCallback(
    (row, { isNew = false } = {}) => {
      const rowId = String(getRowId(row));
      if (session && session.rowId !== rowId) return false;
      setSaveError(null);
      setSession({ rowId, original: row, draft: row, isNew, touched: new Set(), submitted: false });
      return true;
    },
    [getRowId, session]
  );
  const setValue = useCallback(
    (columnId, value) =>
      setSession((current) => {
        if (!current) return current;
        const def = defs.get(columnId);
        return {
          ...current,
          draft: def
            ? setDataGridDefValue(def, current.draft, value)
            : { ...current.draft, [columnId]: value },
          touched: new Set(current.touched).add(columnId)
        };
      }),
    [defs]
  );
  const cancel = useCallback(() => {
    if (!session) return;
    onCancel?.({ rowId: session.rowId, row: session.original, isNew: session.isNew });
    setSession(null);
  }, [onCancel, session]);
  const save = useCallback(async () => {
    if (!session || saving) return false;
    if (errors.size) {
      setSession((current) => current && { ...current, submitted: true });
      return false;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const result = await onSave?.(session.draft, {
        rowId: session.rowId,
        original: session.original,
        isNew: session.isNew
      });
      if (result === false) return false;
      setSession(null);
      return true;
    } catch (error) {
      setSaveError(error);
      return false;
    } finally {
      setSaving(false);
    }
  }, [errors, onSave, saving, session]);
  const getValue = useCallback(
    (columnId) => {
      if (!session) return void 0;
      const def = defs.get(columnId);
      return def ? getDataGridDefValue(def, session.draft) : session.draft[columnId];
    },
    [defs, session]
  );
  // Messages appear once a field is touched, or for all fields after a save attempt.
  const getError = useCallback(
    (columnId) =>
      session && (session.submitted || session.touched.has(columnId))
        ? (errors.get(columnId) ?? null)
        : null,
    [errors, session]
  );
  const api = useMemo(
    () => ({
      rowId: session?.rowId ?? null,
      draft: session?.draft ?? null,
      isNew: session?.isNew ?? false,
      firstColumnId: [...defs.keys()][0] ?? null,
      saving,
      saveError,
      errors,
      isEditing: (rowId) => session?.rowId === String(rowId),
      start,
      cancel,
      save,
      setValue,
      getValue,
      getError
    }),
    [cancel, defs, errors, getError, getValue, save, saveError, saving, session, setValue, start]
  );
  return { ...api, gridProps: { rowEditing: api } };
}

/** Undo and Redo buttons with their shortcuts, for a toolbar above the grid. */
export function DataGridHistoryControls({ history, className, size = 'icon-sm' }) {
  const labels = useDataGridEditingLabels();
  const [modifier, setModifier] = useState('ctrl');
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setModifier('cmd');
  }, []);
  if (!history) return null;
  const items = [
    {
      key: 'undo',
      label: labels.undoAction(DATA_GRID_HISTORY_SOURCES[history.nextUndo?.source]),
      name: labels.undo,
      icon: 'Undo',
      keys: `${modifier},z`,
      enabled: history.canUndo,
      run: history.undo
    },
    {
      key: 'redo',
      label: labels.redoAction(DATA_GRID_HISTORY_SOURCES[history.nextRedo?.source]),
      name: labels.redo,
      icon: 'Redo',
      keys: `shift,${modifier},z`,
      enabled: history.canRedo,
      run: history.redo
    }
  ];
  return (
    <TooltipProvider delayDuration={300}>
      <div data-slot='data-grid-history' role='group' aria-label={`${labels.undo} / ${labels.redo}`} className={cn('flex items-center gap-1', className)}>
        {items.map((item) => (
          <Tooltip key={item.key}>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                tone='neutral'
                size={size}
                aria-label={item.name}
                aria-keyshortcuts={item.key === 'undo' ? 'Control+Z Meta+Z' : 'Control+Shift+Z Meta+Shift+Z Control+Y'}
                // aria-disabled keeps the button focusable and its tooltip reachable.
                aria-disabled={!item.enabled || void 0}
                className='aria-disabled:opacity-50'
                onClick={() => item.enabled && item.run()}
              >
                <RegistryIcon lucide={item.icon} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom' sideOffset={6} className='flex items-center gap-2'>
              {item.label}
              <Kbd keys={item.keys} size='xs' variant='flat' />
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

const dataGridFloatingBarClasses =
  'bg-ui-background rounded-card sticky inset-x-0 bottom-4 z-40 mx-auto flex w-fit max-w-[calc(100%-2rem)] flex-wrap items-center gap-3 border px-4 py-2.5 shadow-lg';

/**
 * The pending changes bar: a count of unsaved edits, the cells that need
 * attention, and Discard and Save. It sits with DataGridSelectionBar at the
 * bottom of the grid and hides while there is nothing to save.
 */
export function DataGridSaveBar({ editing, apiRef, label, className, children }) {
  const labels = useDataGridEditingLabels();
  const anchorRef = useRef(null);
  const id = useId();
  if (!editing || (!editing.pendingCount && !editing.errorCount)) return null;
  const blockedId = editing.errorCount ? `${id}-blocked` : void 0;
  const showFirstError = () => {
    const target = editing.firstError;
    if (!target) return;
    if (apiRef?.current) {
      apiRef.current.focusCell(target.rowId, target.columnId);
      return;
    }
    const root = anchorRef.current?.closest('[data-slot="data-grid"]') ?? document;
    root
      .querySelector(`tr[data-row-id="${CSS.escape(target.rowId)}"] td[data-col-id="${CSS.escape(target.columnId)}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };
  return (
    <div
      ref={anchorRef}
      data-slot='data-grid-save-bar'
      role='region'
      aria-label={labels.unsavedChanges(editing.pendingCount)}
      className={cn(dataGridFloatingBarClasses, className)}
    >
      <span aria-live='polite' className='text-ui-foreground flex items-center gap-2 text-sm font-medium'>
        <span aria-hidden='true' className='bg-warning size-2 shrink-0 rounded-full' />
        {label ? label(editing.pendingCount) : labels.unsavedChanges(editing.pendingCount)}
      </span>
      {editing.errorCount ? (
        <span className='text-ui-destructive flex flex-wrap items-center gap-1.5 text-sm whitespace-nowrap'>
          <RegistryIcon lucide='CircleAlert' className='size-4 shrink-0' />
          <span id={blockedId} aria-live='polite'>
            {labels.invalidCells(editing.errorCount)}
            <span className='sr-only'>. {labels.saveBlocked}</span>
          </span>
          <Button variant='subtle' size='xs' tone='danger' onClick={showFirstError}>
            {labels.showInvalidCell}
          </Button>
        </span>
      ) : null}
      <div className='flex flex-1 flex-wrap items-center justify-end gap-2.5'>
        {children}
        <Button variant='ghost' size='sm' disabled={editing.saving} onClick={editing.discard}>
          {labels.discard}
        </Button>
        <Button
          size='sm'
          aria-describedby={blockedId}
          aria-disabled={editing.errorCount > 0 || editing.saving || void 0}
          className='aria-disabled:opacity-50'
          onClick={() => {
            if (editing.errorCount) {
              showFirstError();
              return;
            }
            void editing.save();
          }}
        >
          {editing.saving ? <Spinner aria-hidden='true' role={void 0} /> : null}
          {editing.saving ? labels.saving : labels.save}
        </Button>
      </div>
    </div>
  );
}

/**
 * A checkbox or switch bound to the grid: it shows the cell's value and writes
 * the flip through `onCellsChange`, so undo, dirty tracking and validation
 * see it like any other edit. Use it as the column's `cell`.
 */
export function DataGridCellToggle({ cell, control, label }) {
  const { props } = useDataGrid();
  const cellEdit = resolveDataGridCellEdit(cell.column.columnDef.meta?.cellEdit);
  const kind = control ?? cellEdit?.control ?? 'checkbox';
  const value = !!cell.getValue();
  const locked = props.rowEditing?.rowId != null;
  const writable =
    !!cellEdit &&
    cellEdit.editable !== false &&
    !(typeof cellEdit.editable === 'function' && !cellEdit.editable(cell.row.original));
  const Control = kind === 'switch' ? Switch : Checkbox;
  return (
    <Control
      size={kind === 'switch' ? 'sm' : void 0}
      checked={value}
      disabled={!writable || locked || !props.onCellsChange}
      tabIndex={props.tableLayout?.cellSelection ? -1 : void 0}
      aria-label={label ?? getColumnHeaderLabel(cell.column)}
      onCheckedChange={(checked) =>
        props.onCellsChange?.({
          source: 'edit',
          changes: [
            {
              rowId: cell.row.id,
              columnId: cell.column.id,
              row: cell.row.original,
              previousValue: cell.getValue(),
              value: checked === true
            }
          ],
          rejected: []
        })
      }
    />
  );
}

/**
 * The inline error state of one cell: a description for assistive technology
 * (the cell points at it with aria-describedby) and a tooltip that opens while
 * the cell is hovered, holds focus, or is the grid's focused cell.
 */
export function DataGridCellErrorIndicator({ id, message, focused }) {
  const anchorRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [gridFocused, setGridFocused] = useState(false);
  useEffect(() => {
    const cell = anchorRef.current?.closest('td');
    const grid = cell?.closest('[data-slot="data-grid"]');
    if (!cell) return;
    const doc = cell.ownerDocument;
    const sync = () => {
      setFocusWithin(cell.contains(doc.activeElement));
      setGridFocused(!!grid?.contains(doc.activeElement));
    };
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    const blur = () => setTimeout(sync, 0);
    sync();
    cell.addEventListener('pointerenter', enter);
    cell.addEventListener('pointerleave', leave);
    (grid ?? cell).addEventListener('focusin', sync);
    (grid ?? cell).addEventListener('focusout', blur);
    return () => {
      cell.removeEventListener('pointerenter', enter);
      cell.removeEventListener('pointerleave', leave);
      (grid ?? cell).removeEventListener('focusin', sync);
      (grid ?? cell).removeEventListener('focusout', blur);
    };
  }, []);
  return (
    <>
      {/* Hidden, yet still the description of whatever points at it, so
       the message is not read twice as cell content. */}
      <span id={id} hidden>
        {message}
      </span>
      <TooltipProvider delayDuration={0}>
        <Tooltip open={hovered || focusWithin || (focused && gridFocused)}>
          <TooltipTrigger asChild>
            <span
              ref={anchorRef}
              aria-hidden='true'
              data-slot='data-grid-cell-error'
              className='pointer-events-none absolute inset-0'
            />
          </TooltipTrigger>
          <TooltipContent
            side='top'
            sideOffset={4}
            hideWhenDetached
            aria-hidden='true'
            className='bg-ui-destructive text-ui-background z-[calc(var(--ds-z-overlay)+20)] max-w-[min(20rem,calc(100vw-1.5rem))] wrap-anywhere [&_svg]:bg-ui-destructive! [&_svg]:fill-ui-destructive!'
          >
            {message}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

/** The editor of one cell while its row is in per-row edit mode. */
export function DataGridRowEditCell({ cell, errorId }) {
  const { props } = useDataGrid();
  const rowEditing = props.rowEditing;
  const cellEdit = cell.column.columnDef.meta?.cellEdit;
  const error = rowEditing.getError(cell.column.id);
  return (
    <div
      data-slot='data-grid-row-editor'
      className='flex min-w-0 items-center'
      onKeyDown={(event) => {
        // Keys from portalled popups (a select list, a calendar) stay theirs.
        if (!event.currentTarget.contains(event.target)) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          rowEditing.cancel();
          return;
        }
        if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
        const target = event.target;
        const toggle = target.closest?.('[role="checkbox"], [role="switch"]');
        if (!toggle && (event.defaultPrevented || target.closest?.('button, textarea'))) return;
        event.preventDefault();
        void rowEditing.save();
      }}
    >
      <DataGridCellInlineEditor
        cellEdit={cellEdit}
        value={rowEditing.getValue(cell.column.id)}
        row={rowEditing.draft}
        label={getColumnHeaderLabel(cell.column)}
        invalid={!!error}
        describedBy={error ? errorId : void 0}
        autoFocus={rowEditing.firstColumnId === cell.column.id}
        dense={!!props.tableLayout?.dense}
        onChange={(value) => rowEditing.setValue(cell.column.id, value)}
      />
    </div>
  );
}

/**
 * Row actions for per-row edit mode: Edit while the row is read-only, Save and
 * Cancel while it is the draft. Other rows' Edit buttons are disabled until
 * the draft is saved or cancelled. `children` render beside Edit.
 */
export function DataGridRowEditActions({ row, label, className, children }) {
  const { props } = useDataGrid();
  const labels = useDataGridEditingLabels();
  const rowEditing = props.rowEditing;
  const editButtonRef = useRef(null);
  const editing = !!rowEditing?.isEditing(row.id);
  const wasEditing = useRef(editing);
  useEffect(() => {
    if (wasEditing.current && !editing) {
      const active = document.activeElement;
      const rowElement = editButtonRef.current?.closest('tr');
      if (!active || active === document.body || rowElement?.contains(active)) {
        editButtonRef.current?.focus();
      }
    }
    wasEditing.current = editing;
  }, [editing]);
  if (!rowEditing) return null;
  if (editing) {
    return (
      <div data-slot='data-grid-row-edit-actions' className={cn('flex items-center justify-end gap-1', className)}>
        <Button size='xs' disabled={rowEditing.saving} onClick={() => void rowEditing.save()}>
          {rowEditing.saving ? <Spinner aria-hidden='true' role={void 0} className='size-3' /> : <RegistryIcon lucide='Check' />}
          {labels.saveRow}
        </Button>
        <Button variant='ghost' tone='neutral' size='xs' disabled={rowEditing.saving} onClick={rowEditing.cancel}>
          {labels.cancelRowEdit}
        </Button>
      </div>
    );
  }
  return (
    <div data-slot='data-grid-row-edit-actions' className={cn('flex items-center justify-end gap-1', className)}>
      {children}
      <Button
        ref={editButtonRef}
        variant='ghost'
        tone='neutral'
        size='icon-sm'
        aria-label={labels.editRow(label)}
        disabled={rowEditing.rowId != null}
        onClick={() => rowEditing.start(row.original)}
      >
        <RegistryIcon lucide='Pencil' />
      </Button>
    </div>
  );
}
