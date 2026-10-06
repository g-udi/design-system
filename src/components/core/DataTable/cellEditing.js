// Cell edit configuration shared by the spreadsheet editor, paste, fill, the
// row editor and the editing hooks. A column opts in with
// `meta.cellEdit = { control, parse, format, validate, ... }`; the built-in
// controls (number, select, combobox, date, checkbox, switch) fill in a parse
// and format pair so clipboard text and typed text travel the same path.
import { format as formatDate, isValid, parse as parseDate, parseISO } from 'date-fns';

const DATA_GRID_TOGGLE_CONTROLS = new Set(['checkbox', 'switch']);
const DATA_GRID_OPTION_CONTROLS = new Set(['select', 'combobox']);
const TRUE_TEXT = /^(true|yes|y|1|x|on|checked|✓|✔)$/i;
const FALSE_TEXT = /^(false|no|n|0|off|unchecked|)$/i;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

export function isDataGridToggleControl(control) {
  return DATA_GRID_TOGGLE_CONTROLS.has(control);
}

/** Options as `{ value, label }`; plain strings are their own label. */
export function getDataGridCellEditOptions(cellEdit, row) {
  const options =
    typeof cellEdit?.options === 'function'
      ? cellEdit.options(row)
      : cellEdit?.options;
  return (options ?? []).map((option) =>
    typeof option === 'object' && option !== null
      ? { ...option, label: option.label ?? String(option.value) }
      : { value: option, label: String(option) }
  );
}

function isEmptyDataGridValue(value) {
  return (
    value === null ||
    value === void 0 ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)
  );
}

function toDataGridDay(value) {
  if (!value) return null;
  const date =
    value instanceof Date
      ? value
      : ISO_DAY.test(String(value))
        ? parseISO(String(value))
        : new Date(String(value));
  return isValid(date) ? date : null;
}

function builtInDataGridParse(cellEdit) {
  const { control } = cellEdit;
  if (control === 'number') {
    return (raw) => {
      const text = String(raw).trim().replace(/[\s,]/g, '');
      if (!text) return cellEdit.clearValue ?? null;
      // A leading currency symbol is fine; anything else that is not a number is rejected.
      const digits = text.replace(/^\p{Sc}(?=[\d.+-])/u, '');
      const value = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(digits)
        ? Number(digits)
        : Number.NaN;
      return Number.isFinite(value) ? value : void 0;
    };
  }
  if (DATA_GRID_OPTION_CONTROLS.has(control)) {
    return (raw, row) => {
      const text = String(raw).trim().toLowerCase();
      if (!text) return cellEdit.clearValue ?? null;
      return getDataGridCellEditOptions(cellEdit, row).find(
        (option) =>
          option.label.toLowerCase() === text ||
          String(option.value).toLowerCase() === text
      )?.value;
    };
  }
  if (control === 'date') {
    return (raw) => {
      const text = String(raw).trim();
      if (!text) return cellEdit.clearValue ?? '';
      const display = cellEdit.displayFormat ?? 'MMM d, yyyy';
      const parsed = parseDate(text, display, new Date());
      const date = isValid(parsed) ? parsed : toDataGridDay(text);
      return date ? formatDate(date, 'yyyy-MM-dd') : void 0;
    };
  }
  if (isDataGridToggleControl(control)) {
    return (raw) => {
      const text = String(raw).trim();
      if (TRUE_TEXT.test(text)) return true;
      if (FALSE_TEXT.test(text)) return false;
      return void 0;
    };
  }
  return null;
}

function builtInDataGridFormat(cellEdit) {
  const { control } = cellEdit;
  if (DATA_GRID_OPTION_CONTROLS.has(control)) {
    return (value, row) =>
      getDataGridCellEditOptions(cellEdit, row).find(
        (option) => option.value === value
      )?.label ?? String(value ?? '');
  }
  if (control === 'date') {
    return (value) => {
      const date = toDataGridDay(value);
      return date ? formatDate(date, cellEdit.displayFormat ?? 'MMM d, yyyy') : '';
    };
  }
  if (isDataGridToggleControl(control)) {
    return (value) => (value ? 'true' : 'false');
  }
  return null;
}

const resolvedDataGridCellEdits = new WeakMap();

/** The column's cell edit config with the built-in control's parse, format and clear value filled in. */
export function resolveDataGridCellEdit(cellEdit) {
  if (!cellEdit || typeof cellEdit !== 'object') return cellEdit ?? null;
  const cached = resolvedDataGridCellEdits.get(cellEdit);
  if (cached) return cached;
  const resolved = { ...cellEdit };
  resolved.parse ??= builtInDataGridParse(cellEdit) ?? void 0;
  resolved.format ??= builtInDataGridFormat(cellEdit) ?? void 0;
  if (resolved.clearValue === void 0 && isDataGridToggleControl(cellEdit.control)) {
    resolved.clearValue = false;
  }
  resolvedDataGridCellEdits.set(cellEdit, resolved);
  return resolved;
}

export function formatDataGridCellEditValue(cellEdit, value, row) {
  const resolved = resolveDataGridCellEdit(cellEdit);
  return resolved?.format ? resolved.format(value, row) : String(value ?? '');
}

/**
 * Validates one value against the column's rules: `required`, a number
 * column's `min` and `max`, then `validate(value, row)`. Returns the message
 * to show, or null when the value is acceptable. `validate` returns a message
 * string, `false` for a generic message, or nothing when valid.
 */
export function validateDataGridCellValue(cellEdit, value, row) {
  if (!cellEdit) return null;
  if (cellEdit.required && isEmptyDataGridValue(value)) {
    return typeof cellEdit.required === 'string' ? cellEdit.required : 'Required';
  }
  // A row draft keeps unparseable number text so it stays visible and flagged.
  if (cellEdit.control === 'number' && typeof value === 'string' && value.trim()) {
    return cellEdit.invalidMessage ?? 'Enter a number';
  }
  if (cellEdit.control === 'number' && typeof value === 'number') {
    if (!Number.isFinite(value)) return cellEdit.invalidMessage ?? 'Enter a number';
    if (typeof cellEdit.min === 'number' && value < cellEdit.min) {
      return `Must be ${cellEdit.min} or more`;
    }
    if (typeof cellEdit.max === 'number' && value > cellEdit.max) {
      return `Must be ${cellEdit.max} or less`;
    }
  }
  const result = cellEdit.validate?.(value, row);
  if (typeof result === 'string' && result) return result;
  if (result === false) return cellEdit.invalidMessage ?? 'Enter a valid value';
  return null;
}

export function getDataGridColumnDefId(def) {
  return (
    def.id ??
    (def.accessorKey === void 0
      ? void 0
      : String(def.accessorKey).replaceAll('.', '_'))
  );
}

/** Leaf column definitions with a cell edit config, keyed by column ID. */
export function getDataGridEditableColumnDefs(columns = []) {
  const map = new Map();
  const visit = (defs) => {
    for (const def of defs) {
      if (def.columns) visit(def.columns);
      const id = getDataGridColumnDefId(def);
      if (id !== void 0 && def.meta?.cellEdit) map.set(id, def);
    }
  };
  visit(columns);
  return map;
}

export function getDataGridDefValue(def, row) {
  if (def.accessorFn) return def.accessorFn(row);
  if (def.accessorKey === void 0) return void 0;
  return String(def.accessorKey)
    .split('.')
    .reduce((value, key) => (value == null ? value : value[key]), row);
}

function setDataGridPath(row, path, value) {
  const [key, ...rest] = path;
  return {
    ...row,
    [key]: rest.length ? setDataGridPath(row?.[key] ?? {}, rest, value) : value
  };
}

/** Writes one value into a copy of the row, through `cellEdit.setValue` when the column derives its value. */
export function setDataGridDefValue(def, row, value) {
  const cellEdit = def?.meta?.cellEdit;
  if (cellEdit?.setValue) return cellEdit.setValue(row, value);
  if (def?.accessorKey !== void 0) {
    return setDataGridPath(row, String(def.accessorKey).split('.'), value);
  }
  return row;
}

export function isDataGridValueEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) {
    return false;
  }
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

/**
 * Applies an `onCellsChange` batch to an array of records and returns the new
 * array; untouched records keep their identity. Columns resolve by ID from
 * `columns`, falling back to writing `record[columnId]`.
 */
export function applyDataGridCellsChange(rows, details, options = {}) {
  const { columns, getRowId = (row) => row.id } = options;
  if (!details?.changes?.length) return rows;
  const defs = getDataGridEditableColumnDefs(columns);
  const byRow = new Map();
  for (const change of details.changes) {
    const list = byRow.get(change.rowId) ?? [];
    list.push(change);
    byRow.set(change.rowId, list);
  }
  return rows.map((row, index) => {
    const changes = byRow.get(String(getRowId(row, index)));
    if (!changes) return row;
    return changes.reduce((next, change) => {
      const def = defs.get(change.columnId);
      return def
        ? setDataGridDefValue(def, next, change.value)
        : { ...next, [change.columnId]: change.value };
    }, row);
  });
}
