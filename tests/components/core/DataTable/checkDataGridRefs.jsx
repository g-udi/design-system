import { createRoot } from 'react-dom/client';
import { expect } from 'storybook/test';
import { useTable } from '@tanstack/react-table';
import { act } from '../../../support/reactAct.js';
import { DataGrid, DataGridTable, DataGridTableDnd, DataGridTableDndRows, dataGridFeatures } from '../../../../src/components/core/DataTable/index.js';
import { DataGridTableViewport } from '../../../../src/components/core/DataTable/components/DataGridTableFrame.jsx';
import { DataGridTableBodyRow } from '../../../../src/components/core/DataTable/components/DataGridTableRows.jsx';

const data = [{ id: 'first', label: 'First row' }];
const columns = [{ accessorKey: 'label', header: 'Label' }];
function Grid({ rowRef, dndRef, viewportRef, label, resizable }) {
  const table = useTable({ features: dataGridFeatures, data, columns, getRowId: row => row.id });
  const row = table.getRowModel().rows[0];
  return <DataGrid table={table} tableLayout={{ columnsResizable: resizable }}>
    <DataGridTableViewport viewportRef={viewportRef}>
      <table><tbody><DataGridTableBodyRow row={row} rowRef={rowRef} dndRef={dndRef}><td>{label}</td></DataGridTableBodyRow></tbody></table>
    </DataGridTableViewport>
  </DataGrid>;
}

export async function checkDataGridRefs(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  try {
    for (const resizable of [false, true]) {
      const calls = { rowRef: [], viewportRef: [] };
      const dndRef = { current: null };
      const refs = Object.fromEntries(Object.keys(calls).map(key => [key, node => {
        calls[key].push(node ? 'attach' : 'null');
        return () => calls[key].push('cleanup');
      }]));
      const render = label => act(() => root.render(<Grid {...refs} dndRef={dndRef} label={label} resizable={resizable} />));
      await render('First render');
      const row = dndRef.current;
      expect(row?.tagName).toBe('TR');
      await render('Updated render');
      expect(dndRef.current).toBe(row);
      expect(calls.rowRef).toEqual(['attach']);
      // A table snapshot can rebind its measuring ref; every attach still owns one cleanup.
      expect(calls.viewportRef).not.toContain('null');
      await act(() => root.render(null));
      expect(dndRef.current).toBeNull();
      expect(calls.rowRef).toEqual(['attach', 'cleanup']);
      expect(calls.viewportRef.filter(call => call === 'attach').length).toBe(calls.viewportRef.filter(call => call === 'cleanup').length);
    }
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
}

const loadingColumns = [
  { accessorKey: 'end', header: 'End', meta: { skeleton: 'End placeholder' } },
  { accessorKey: 'start', header: 'Start', meta: { skeleton: 'Start placeholder' } }
];
const loadingState = { pagination: { pageSize: 2, pageIndex: 0 }, columnPinning: { start: [], end: ['end'] } };
function LoadingGrid({ mode }) {
  const table = useTable({ features: dataGridFeatures, data: [], columns: loadingColumns, state: loadingState });
  const Table = [DataGridTable, DataGridTableDnd, DataGridTableDndRows][mode];
  return <DataGrid table={table} isLoading loadingMode='skeleton' tableLayout={{ columnsResizable: true, columnsPinnable: true }}>
    <Table dataIds={[]} />
  </DataGrid>;
}

export async function checkDataGridLoading(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  try {
    for (const mode of [0, 1, 2]) {
      await act(() => root.render(<LoadingGrid mode={mode} />));
      const rows = [...host.querySelectorAll('tbody tr')];
      expect(rows.length).toBe(2);
      for (const row of rows) {
        expect([...row.children].map(cell => cell.textContent)).toEqual(['Start placeholder', '', 'End placeholder']);
        expect(row.children[1]).toHaveAttribute('data-slot', 'data-grid-table-fill-body-cell');
      }
    }
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
}
