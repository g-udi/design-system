/*
 * CSV export shared by DataTable and the DataGrid parts.
 *
 * `toCsv` is the pure core: records plus field definitions in, CSV text out.
 * `tableToCsv` adapts a TanStack table (v8 or v9) so an export matches what the
 * reader sees: visible columns in display order, the current filters and sort,
 * and only the selected rows when a selection exists.
 */

const FORMULA_START = /^[=+\-@\t\r]/;

/** Quote one value. Formula-like text is prefixed so spreadsheets show it as text instead of running it. */
export function csvEscape(value, { delimiter = ',', sanitize = true } = {}) {
  if (value === null || value === undefined) return '';
  let text = value instanceof Date ? value.toISOString() : Array.isArray(value) ? value.join('; ') : String(value);
  if (sanitize && typeof value === 'string' && FORMULA_START.test(text)) text = `'${text}`;
  return /["\r\n]/.test(text) || text.includes(delimiter) || /^\s|\s$/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * @param {object[]} records Rows to write, in order.
 * @param {{ header: string, value: (record: object, index: number) => unknown }[]} fields Columns to write, in order.
 * @param {{ delimiter?: string, eol?: string, header?: boolean, sanitize?: boolean }} [options]
 */
export function toCsv(records, fields, { delimiter = ',', eol = '\r\n', header = true, sanitize = true } = {}) {
  const escape = (value) => csvEscape(value, { delimiter, sanitize });
  const lines = header ? [fields.map((field) => escape(field.header)).join(delimiter)] : [];
  records.forEach((record, index) => lines.push(fields.map((field) => escape(field.value(record, index))).join(delimiter)));
  return lines.join(eol);
}

const leafRows = (rows) => rows.flatMap((row) => (row.getIsGrouped?.() ? leafRows(row.subRows) : [row]));
const headerText = (column) => {
  const meta = column.columnDef.meta || {};
  if (typeof meta.exportHeader === 'string') return meta.exportHeader;
  if (typeof meta.headerTitle === 'string') return meta.headerTitle;
  if (typeof meta.header === 'string') return meta.header;
  return typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;
};

/**
 * Rows a table export should contain.
 * `scope`: 'auto' (selected rows when any are selected, otherwise every filtered row), 'selected', 'filtered' or 'page'.
 */
export function getTableExportRows(table, scope = 'auto') {
  const selected = (table.getFilteredSelectedRowModel?.() || table.getSelectedRowModel?.())?.rows || [];
  if (scope === 'selected' || (scope === 'auto' && selected.length)) {
    const ids = new Set(selected.map((row) => row.id));
    const ordered = leafRows((table.getPrePaginatedRowModel?.() || table.getPrePaginationRowModel()).rows).filter((row) => ids.has(row.id));
    return ordered.length ? ordered : selected;
  }
  if (scope === 'page') return leafRows(table.getRowModel().rows);
  return leafRows((table.getPrePaginatedRowModel?.() || table.getPrePaginationRowModel()).rows);
}

/**
 * Columns a table export should contain: visible data columns in display order.
 * Columns opt out with `meta.export: false`; display columns without an accessor are skipped.
 * `meta.exportValue(value, record)` formats a cell for the file (dates, currencies, labels).
 */
export function getTableExportFields(table) {
  return table
    .getVisibleLeafColumns()
    .filter((column) => column.columnDef.meta?.export !== false && (column.accessorFn || column.columnDef.accessorKey || column.columnDef.meta?.exportValue))
    .map((column) => {
      const format = column.columnDef.meta?.exportValue;
      return {
        header: headerText(column),
        value: (row) => {
          const value = column.accessorFn || column.columnDef.accessorKey ? row.getValue(column.id) : undefined;
          return format ? format(value, row.original) : value;
        }
      };
    });
}

/** CSV for what the table currently shows. */
export function tableToCsv(table, { scope = 'auto', ...options } = {}) {
  return toCsv(getTableExportRows(table, scope), getTableExportFields(table), options);
}

/** Save CSV text as a file. Browser only; a UTF-8 byte-order mark keeps accents intact in spreadsheet apps. */
export function downloadCsv(csv, filename = 'table.csv', { bom = true } = {}) {
  if (typeof document === 'undefined') return;
  const blob = new Blob([bom ? '﻿' : '', csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: filename.endsWith('.csv') ? filename : `${filename}.csv` });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
