import { checkPinnedRowOrder } from './dataGridRowOrderChecks.jsx';
import { useEffect } from 'react';
import { act } from '../../../../../tests/support/reactAct.js';
import { createRoot } from 'react-dom/client';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { useTable } from '@tanstack/react-table';
import { DataGrid, DataGridContainer, DataGridScrollArea, DataGridTable, DataGridTableRowSelect, dataGridFeatures, useDataGridEditing, useDataGridRowEditing } from '../index.js';
import Button from '../../Button/index.js';

const columns = [{ accessorKey: 'title', meta: { cellEdit: { control: 'text' } } }];
const controlRows = Array.from({ length: 20 }, (_, index) => ({ id: String(index), title: `Record ${index + 1}` }));
const controlColumns = [
  { id: 'selection', header: 'Select', cell: ({ row }) => <DataGridTableRowSelect row={row} /> },
  { accessorKey: 'title', header: 'Record' },
  { id: 'action', header: 'Action', cell: () => <Button size='sm'>Open details</Button> }
];

function GridControlsProbe({ onRowClick, cellSelection = false, grouped = false }) {
  const table = useTable({ data: controlRows, columns: grouped ? [{ id: 'group', header: 'Records', columns: controlColumns }] : controlColumns, features: dataGridFeatures, manualPagination: true, initialState: cellSelection ? { sorting: [{ id: 'title', desc: true }], columnPinning: { start: ['title'], end: [] } } : undefined, enableRowSelection: row => row.original.id !== '0' });
  return <DataGrid table={table} onRowClick={onRowClick} tableLayout={{ headerSticky: true, cellSelection, columnsPinnable: cellSelection }}><DataGridContainer><DataGridScrollArea className='h-32'><DataGridTable /></DataGridScrollArea></DataGridContainer></DataGrid>;
}

function EditingProbe({ data, onSave, onReady }) {
  const editing = useDataGridEditing({ data, columns, onSave });
  const rowEditing = useDataGridRowEditing({ columns, onSave });
  useEffect(() => { onReady({ editing, rowEditing }); });
  return null;
}

export async function checkEditingRequests(canvasElement) {
  await checkPinnedRowOrder(canvasElement);
  const host = canvasElement.ownerDocument.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  let api;
  let resolveSave;
  const onSave = fn(() => new Promise(resolve => { resolveSave = resolve; }));
  const onReady = value => { api = value; };
  const initial = [{ id: 'a', title: 'Original' }];
  const refreshed = [{ id: 'b', title: 'Refreshed' }];
  const render = data => act(async () => root.render(<EditingProbe data={data} onSave={onSave} onReady={onReady} />));
  try {
    await render(initial);
    await act(async () => api.editing.onCellsChange({ source: 'edit', changes: [{ rowId: 'a', columnId: 'title', previousValue: 'Original', value: 'Draft' }], rejected: [] }));
    let pending;
    let duplicate;
    await act(async () => { pending = api.editing.save(); duplicate = api.editing.save(); });
    await expect(onSave).toHaveBeenCalledTimes(1);
    await expect(await duplicate).toBe(false);
    await render(refreshed);
    await act(async () => { resolveSave(); await pending; });
    await expect(api.editing.rows).toEqual(refreshed);
    await expect(api.editing.savedRows).toEqual(refreshed);
    await expect(api.editing.isDirty).toBe(false);

    onSave.mockClear();
    await act(async () => api.rowEditing.start(initial[0]));
    await act(async () => api.rowEditing.setValue('title', 'Draft'));
    await act(async () => { pending = api.rowEditing.save(); duplicate = api.rowEditing.save(); });
    await expect(onSave).toHaveBeenCalledTimes(1);
    await expect(await duplicate).toBe(false);
    await act(async () => api.rowEditing.cancel());
    await act(async () => api.rowEditing.start(refreshed[0]));
    await act(async () => { resolveSave(); await pending; });
    await expect(api.rowEditing.rowId).toBe('b');
    await expect(api.rowEditing.draft).toEqual(refreshed[0]);
    await expect(api.rowEditing.saving).toBe(false);
    await act(async () => root.render(<GridControlsProbe key='cell-selection' cellSelection />));
    const firstRow = host.querySelector('tbody tr[data-row-id]');
    await expect(firstRow).toHaveTextContent('Record 20');
    await expect(firstRow).toHaveAttribute('aria-rowindex', '2');
    await expect(firstRow.querySelector('td')).toHaveAttribute('aria-colindex', '1');
    await expect(host.querySelector('thead th')).toHaveAttribute('aria-colindex', '1');
    await act(async () => root.render(<GridControlsProbe key='grouped' cellSelection grouped />));
    const grid = within(host).getByRole('grid');
    await expect(grid).toHaveAttribute('aria-rowcount', '22');
    await expect(grid.querySelectorAll('thead tr')[1]).toHaveAttribute('aria-rowindex', '2');
    await expect(grid.querySelector('tbody tr[data-row-id]')).toHaveAttribute('aria-rowindex', '3');
    for (const header of grid.querySelectorAll('thead th[aria-colindex]')) {
      await expect(Number(header.getAttribute('aria-colindex'))).toBeGreaterThan(0);
    }
    const onRowClick = fn();
    await act(async () => root.render(<GridControlsProbe key='row-activation' onRowClick={onRowClick} />));
    const checkboxes = await within(host).findAllByRole('checkbox', { name: 'Select row' });
    await expect(checkboxes[0]).toBeDisabled();
    await expect(checkboxes[1]).toBeEnabled();
    await userEvent.click(within(host).getAllByRole('button', { name: 'Open details' })[0]);
    await expect(onRowClick).not.toHaveBeenCalled();
    const row = within(host).getByText('Record 1').closest('tr');
    await userEvent.click(within(host).getByText('Record 1'));
    row.focus();
    await userEvent.keyboard('{Enter}');
    await fireEvent.keyDown(row, { key: 'Enter', isComposing: true });
    await expect(onRowClick).toHaveBeenCalledTimes(2);
    await expect(onRowClick).toHaveBeenLastCalledWith(controlRows[0]);
    await waitFor(() => expect(host.querySelector('[data-overflow-vertical="true"]')).not.toBeNull());
    const thumb = host.querySelector('.pointer-events-auto > div');
    await expect(thumb).not.toBeNull();
    const body = host.ownerDocument.body;
    const previous = { userSelect: body.style.userSelect, webkitUserSelect: body.style.webkitUserSelect };
    const setPointerCapture = thumb.setPointerCapture;
    try {
      body.style.userSelect = 'text';
      body.style.webkitUserSelect = 'text';
      // Synthetic events cannot capture a browser pointer, but exercise the real cleanup.
      thumb.setPointerCapture = () => {};
      await fireEvent.pointerDown(thumb, { button: 0, pointerId: 1, clientY: 20 });
      await expect(body.style.userSelect).toBe('none');
      await act(async () => root.render(null));
      await expect(body.style.userSelect).toBe('text');
      await expect(body.style.webkitUserSelect).toBe('text');
    } finally {
      thumb.setPointerCapture = setPointerCapture;
      body.style.userSelect = previous.userSelect;
      body.style.webkitUserSelect = previous.webkitUserSelect;
    }
  } finally {
    resolveSave?.();
    await act(async () => root.unmount());
    host.remove();
  }
}
