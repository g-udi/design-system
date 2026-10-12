import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { actInteraction } from '../../../support/actInteraction.js';

const rowWith = (scope, text) => scope.getAllByText(text, { exact: true }).map(element => element.closest('tr')).find(Boolean);
const pageOf = (element) => within(element.ownerDocument.body);

export async function checkDraggableRows({ canvasElement }) {
  const canvas = within(canvasElement);
  const rows = () => [...canvasElement.querySelectorAll('tbody tr[data-row-id]')];
  const initial = rows().map(row => row.dataset.rowId);
  const handle = canvas.getAllByRole('button', { name: 'Drag to reorder row' })[0];
  await act(() => handle.focus());
  await userEvent.keyboard('[Space][ArrowDown][Space]');
  await waitFor(() => expect(rows().map(row => row.dataset.rowId)).toEqual([initial[1], initial[0], ...initial.slice(2)]));
  await expect(rows()[1]).toHaveTextContent('Anouk Varga');
  await expect(rows()[0]).toHaveTextContent('Sabine Okafor');
  const settled = rows().map(row => row.dataset.rowId);
  await act(() => handle.focus());
  await userEvent.keyboard('[Space][ArrowDown][Escape]');
  await waitFor(() => {
    expect(rows().map(row => row.dataset.rowId)).toEqual(settled);
    expect(handle).toHaveFocus();
    for (const row of rows()) expect(getComputedStyle(row).opacity).toBe('1');
  });
}

export async function checkTreeRows({ canvasElement }) {
  const canvas = within(canvasElement);
  const toggle = (name, label) => within(rowWith(canvas, name)).getByRole('button', { name: label });
  await expect(canvas.getByText('Anouk Varga')).toBeVisible();
  await userEvent.click(toggle('Engineering', 'Collapse row'));
  await waitFor(() => expect(canvas.queryByText('Platform')).not.toBeInTheDocument());
  await expect(canvas.queryByText('Anouk Varga')).not.toBeInTheDocument();
  await expect(canvas.getByText('Design', { exact: true })).toBeVisible();
  await userEvent.click(toggle('Engineering', 'Expand row'));
  await expect(await canvas.findByText('Anouk Varga')).toBeVisible();
  await userEvent.click(toggle('Platform', 'Collapse row'));
  await waitFor(() => expect(canvas.queryByText('Anouk Varga')).not.toBeInTheDocument());
  await expect(canvas.getByText('Mobile', { exact: true })).toBeVisible();
  await expect(toggle('Engineering', 'Collapse row')).toHaveAttribute('aria-expanded', 'true');
  await userEvent.click(toggle('Platform', 'Expand row'));
  await expect(await canvas.findByText('Anouk Varga')).toBeVisible();
}

export async function checkSubTables({ canvasElement }) {
  const canvas = within(canvasElement);
  const toggle = (number, label) => within(rowWith(canvas, number)).getByRole('button', { name: label });
  await userEvent.click(toggle('Anouk Varga', 'Expand order items'));
  await expect(await canvas.findByText('Desk Tidy')).toBeVisible();
  await userEvent.click(toggle('Sabine Okafor', 'Expand order items'));
  await expect(await canvas.findByText('Rubber Brayer')).toBeVisible();
  await userEvent.click(toggle('Anouk Varga', 'Collapse order items'));
  await waitFor(() => expect(canvas.queryByText('Desk Tidy')).not.toBeInTheDocument());
  await expect(canvas.getByText('Rubber Brayer')).toBeVisible();
  await expect(toggle('Sabine Okafor', 'Collapse order items')).toHaveAttribute('aria-expanded', 'true');
  await userEvent.click(toggle('Sabine Okafor', 'Collapse order items'));
  await waitFor(() => expect(canvas.queryByText('Rubber Brayer')).not.toBeInTheDocument());
}

export async function checkInfiniteScroll({ canvasElement }) {
  const canvas = within(canvasElement);
  const viewport = () => canvasElement.querySelector('[data-slot="scroll-area-viewport"]');
  const reachEnd = async () => {
    await act(() => { viewport().scrollTop = viewport().scrollHeight; });
    await fireEvent.scroll(viewport());
  };
  await expect(canvas.getByText('20 / 200')).toBeVisible();
  const createObjectURL = URL.createObjectURL;
  const anchorClick = HTMLAnchorElement.prototype.click;
  let exported;
  const save = fn(function () { expect(this.download).toBe('remote-data.csv'); });
  URL.createObjectURL = (blob) => { exported = blob; return createObjectURL(blob); };
  HTMLAnchorElement.prototype.click = save;
  try {
    await userEvent.click(canvas.getByRole('button', { name: 'Download snapshot' }));
    await expect(save).toHaveBeenCalledOnce();
    const csv = await exported.text();
    await expect(csv.trim().split(/\r?\n/)).toHaveLength(21);
    await expect(csv).toContain('Anouk Varga');
  } finally {
    URL.createObjectURL = createObjectURL;
    HTMLAnchorElement.prototype.click = anchorClick;
  }

  await reachEnd();
  await waitFor(() => expect(canvas.getByText('40 / 200')).toBeVisible());
  await expect(canvasElement.querySelectorAll('tbody tr[data-row-id]').length).toBeLessThan(40);
  await reachEnd();
  await expect(await canvas.findByText('Loading...')).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Start over' }));
  await expect(canvas.getByText('20 / 200')).toBeVisible();
  await expect(viewport().scrollTop).toBe(0);
  // The abandoned 800ms request must not append into the freshly reset list.
  await act(() => new Promise(resolve => setTimeout(resolve, 850)));
  await expect(canvas.getByText('20 / 200')).toBeVisible();
  await expect(canvas.queryByText('Loading...')).not.toBeInTheDocument();
}

export async function checkCrudFrame({ canvasElement }) {
  const canvas = within(canvasElement);
  const page = pageOf(canvasElement);
  const openMenu = async (name, action) => {
    const trigger = await within(rowWith(canvas, name)).findByRole('button', { name: `Actions for ${name}` });
    await actInteraction(() => userEvent.click(trigger));
    await userEvent.click(await page.findByRole('menuitem', { name: action, exact: true }));
  };
  await userEvent.click(canvas.getByRole('button', { name: 'Add new' }));
  let dialog = within(await page.findByRole('dialog', { name: 'Add member' }));
  await userEvent.click(dialog.getByRole('button', { name: 'Add member' }));
  await expect(dialog.getByText('Enter a name.')).toBeVisible();
  await expect(dialog.getByText('Enter an email address.')).toBeVisible();
  await expect(dialog.getByText('Enter a role.')).toBeVisible();
  await userEvent.type(dialog.getByRole('textbox', { name: 'Name', exact: true }), 'Morgan Reed');
  await userEvent.type(dialog.getByRole('textbox', { name: 'Email', exact: true }), 'morgan@example.com');
  await userEvent.type(dialog.getByRole('textbox', { name: 'Role', exact: true }), 'Designer');
  await actInteraction(() => userEvent.click(dialog.getByRole('button', { name: 'Add member' })));
  await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
  const id = rowWith(canvas, 'Morgan Reed').dataset.rowId;
  await openMenu('Morgan Reed', 'Edit');
  dialog = within(await page.findByRole('dialog', { name: 'Edit member' }));
  await userEvent.clear(dialog.getByRole('textbox', { name: 'Name', exact: true }));
  await userEvent.type(dialog.getByRole('textbox', { name: 'Name', exact: true }), 'Morgan Lee');
  await actInteraction(() => userEvent.click(dialog.getByRole('button', { name: 'Save changes' })));
  await waitFor(() => expect(rowWith(canvas, 'Morgan Lee')).toHaveAttribute('data-row-id', id));
  await openMenu('Morgan Lee', 'Edit');
  dialog = within(await page.findByRole('dialog', { name: 'Edit member' }));
  await userEvent.clear(dialog.getByRole('textbox', { name: 'Role', exact: true }));
  await userEvent.type(dialog.getByRole('textbox', { name: 'Role', exact: true }), 'Discard this');
  await actInteraction(() => userEvent.click(dialog.getByRole('button', { name: 'Cancel' })));
  await expect(rowWith(canvas, 'Morgan Lee')).toHaveTextContent('Designer');
  await openMenu('Morgan Lee', 'Delete');
  let confirmation = within(await page.findByRole('alertdialog', { name: 'Remove Morgan Lee?' }));
  await userEvent.click(confirmation.getByRole('button', { name: 'Cancel' }));
  await expect(rowWith(canvas, 'Morgan Lee')).toBeVisible();
  await openMenu('Morgan Lee', 'Delete');
  confirmation = within(await page.findByRole('alertdialog', { name: 'Remove Morgan Lee?' }));
  await userEvent.click(confirmation.getByRole('button', { name: 'Remove' }));
  await waitFor(() => expect(canvasElement.querySelector(`tr[data-row-id="${id}"]`)).toBeNull());
}

export async function checkSpreadsheet({ canvasElement }) {
  const canvas = within(canvasElement);
  const page = pageOf(canvasElement);
  const grid = await canvas.findByRole('grid');
  const cell = (id) => grid.querySelector(`tr[data-row-id="${id}"] td[data-col-id="name"]`);
  const firstId = grid.querySelector('tbody tr[data-row-id]').dataset.rowId;
  await userEvent.click(cell(firstId));
  await actInteraction(() => userEvent.keyboard('{Enter}'));
  let editor = await canvas.findByRole('textbox', { name: 'Product' });
  await userEvent.clear(editor);
  await userEvent.type(editor, 'Studio notebook');
  await actInteraction(() => userEvent.keyboard('{Enter}'));
  await waitFor(() => expect(cell(firstId)).toHaveTextContent('Studio notebook'));
  await expect(cell(firstId)).toHaveAttribute('data-cell-status', 'dirty');
  await actInteraction(() => userEvent.keyboard('{Enter}'));
  editor = await canvas.findByRole('textbox', { name: 'Product' });
  await userEvent.clear(editor);
  await userEvent.type(editor, 'Discard this');
  await actInteraction(() => userEvent.keyboard('{Escape}'));
  await expect(cell(firstId)).toHaveTextContent('Studio notebook');
  const context = async (target, action) => {
    await fireEvent.contextMenu(target);
    await userEvent.click(await page.findByRole('menuitem', { name: action, exact: true }));
  };
  await context(cell(firstId), 'Duplicate');
  const duplicate = await canvas.findByText('Studio notebook copy');
  const duplicateId = duplicate.closest('tr').dataset.rowId;
  await expect(duplicateId).not.toBe(firstId);
  await expect(duplicate.closest('tr')).toHaveAttribute('data-row-status', 'new');
  await context(cell(duplicateId), 'Delete row');
  let confirmation = within(await page.findByRole('alertdialog', { name: 'Delete this row?' }));
  await userEvent.click(confirmation.getByRole('button', { name: 'Cancel' }));
  await expect(cell(duplicateId)).toBeInTheDocument();
  await waitFor(() => expect(page.queryByRole('alertdialog')).not.toBeInTheDocument());
  await context(cell(duplicateId), 'Delete row');
  confirmation = within(await page.findByRole('alertdialog', { name: 'Delete this row?' }));
  await userEvent.click(confirmation.getByRole('button', { name: 'Delete', exact: true }));
  await waitFor(() => expect(cell(duplicateId)).toBeNull());
  await expect(cell(firstId)).toHaveTextContent('Studio notebook');
  await userEvent.click(await canvas.findByRole('button', { name: 'Add row' }));
  await waitFor(() => {
    const active = canvasElement.ownerDocument.getElementById(grid.getAttribute('aria-activedescendant'));
    expect(active).toHaveAttribute('data-col-id', 'name');
    expect(active.closest('tr')).toHaveAttribute('data-row-status', 'new');
  });
}
