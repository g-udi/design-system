'use client';
import { useState } from 'react';
import { useDataGrid } from './data-grid-extended.jsx';
import { downloadCsv, getTableExportRows, tableToCsv } from './table-export.js';
import { default as Button } from '../../Button/index.js';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

/**
 * A toolbar action that saves what the grid shows as CSV: visible columns in
 * display order, current filters and sort, and only the selected rows when a
 * selection exists (`scope='auto'`). Columns format their cell with
 * `meta.exportValue(value, record)` and opt out with `meta.export: false`.
 * Return `false` from `onExport(csv, rows)` to handle the file yourself.
 */
function DataGridExport({
  filename = 'table.csv',
  scope = 'auto',
  delimiter,
  label,
  onExport,
  children,
  ...props
}) {
  const { table, i18n } = useDataGrid();
  const [status, setStatus] = useState('');
  const exportRows = () => {
    const rows = getTableExportRows(table, scope);
    const csv = tableToCsv(table, { scope, delimiter });
    if (onExport?.(csv, rows.map((row) => row.original)) !== false) downloadCsv(csv, filename);
    setStatus(i18n.labels.exported(rows.length));
  };
  return (
    <>
      <Button variant='outline' tone='neutral' size='sm' onClick={exportRows} {...props}>
        <RegistryIcon lucide='Download' className='size-4' />
        {children ?? label ?? i18n.labels.exportCsv}
      </Button>
      <span role='status' className='sr-only'>
        {status}
      </span>
    </>
  );
}

export { DataGridExport };
