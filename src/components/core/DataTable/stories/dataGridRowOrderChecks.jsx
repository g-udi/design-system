import { useEffect } from 'react';
import { act } from '../../../../../tests/support/reactAct.js';
import { createRoot } from 'react-dom/client';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { useTable } from '@tanstack/react-table';
import { DataGrid, DataGridContainer, DataGridCellSelection, DataGridTable, DataGridTableVirtual, dataGridFeatures } from '../index.js';
import { getDataGridActiveRegionGrid } from '../dataGridSelectionModel.js';

const rows = Array.from({ length: 40 }, (_, index) => ({ id: `r${index}`, title: `Record ${index + 1}` }));
const columns = [{ accessorKey: 'title', header: 'Record' }];

export function PinnedRowOrderProbe({ virtual = false, onReady }) {
  const table = useTable({
    data: rows,
    columns,
    features: dataGridFeatures,
    getRowId: row => row.id,
    manualPagination: virtual,
    initialState: { rowPinning: { top: ['r39'], bottom: ['r0'] }, pagination: { pageIndex: 1, pageSize: 5 } }
  });
  useEffect(() => { onReady?.(table); });
  return <DataGrid table={table} tableLayout={{ cellSelection: true, rowsPinnable: true }}>
    <DataGridContainer>
      {virtual ? <DataGridTableVirtual height={220} overscan={1} /> : <DataGridTable />}
      <DataGridCellSelection />
    </DataGridContainer>
  </DataGrid>;
}

export async function checkPinnedRowOrder(canvasElement) {
  const host = canvasElement.ownerDocument.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  let table;
  try {
    for (const virtual of [false, true]) {
      await act(async () => root.render(<PinnedRowOrderProbe key={String(virtual)} virtual={virtual} onReady={value => { table = value; }} />));
      const grid = within(host).getByRole('grid');
      const row = id => host.querySelector(`tr[data-row-id="${id}"]`);
      await expect(row('r39')).toHaveAttribute('aria-rowindex', '2');
      await expect(row('r0')).toHaveAttribute('aria-rowindex', '41');
      await userEvent.click(row('r39').querySelector('td[data-col-id="title"]'));
      await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}');
      const nextId = virtual ? 'r1' : 'r5';
      await waitFor(() => expect(row(nextId).querySelector('td')).toHaveAttribute('data-cell-selected'));
      await expect(getDataGridActiveRegionGrid(table, host)).toEqual([['Record 40'], [virtual ? 'Record 2' : 'Record 6']]);
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => expect(row(nextId).querySelector('td')).toHaveAttribute('data-cell-focused'));
      await expect(grid).toHaveAttribute('aria-rowcount', '41');
      if (virtual) {
        const viewport = host.querySelector('[data-slot="data-grid-table-viewport"]');
        viewport.scrollTop = 700;
        viewport.dispatchEvent(new Event('scroll'));
        const centerRows = () => [...host.querySelectorAll('tbody tr[data-row-id]')].filter(element => !['r39', 'r0'].includes(element.dataset.rowId));
        await waitFor(() => expect(centerRows().some(element => Number(element.dataset.rowId.slice(1)) >= 10)).toBe(true));
        for (const element of centerRows()) await expect(element).toHaveAttribute('aria-rowindex', String(Number(element.dataset.rowId.slice(1)) + 2));
      }
    }
  } finally {
    await act(async () => root.unmount());
    host.remove();
  }
}
