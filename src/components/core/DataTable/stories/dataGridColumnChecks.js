import { expect, userEvent, waitFor, within } from 'storybook/test';

export async function checkColumnControls({ canvasElement }) {
  const canvas = within(canvasElement);
  const page = within(canvasElement.ownerDocument.body);
  const headerIds = () => [...canvasElement.querySelectorAll('thead th[data-col-id]')].map((cell) => cell.dataset.colId);
  await expect(headerIds()).toEqual(['name', 'location', 'status']);
  // The host deliberately supplies a partial order; unlisted leaves still move normally.
  await userEvent.click(canvas.getByRole('button', { name: 'Location', exact: true }));
  await userEvent.click(await page.findByRole('menuitem', { name: 'Move to right' }));
  await waitFor(() => expect(headerIds()).toEqual(['name', 'status', 'location']));
  await userEvent.click(canvas.getByRole('button', { name: 'Location', exact: true }));
  await userEvent.click(await page.findByRole('menuitem', { name: 'Move to left' }));
  await waitFor(() => expect(headerIds()).toEqual(['name', 'location', 'status']));
  await userEvent.click(canvas.getByRole('button', { name: 'Status filter', exact: true }));
  const search = await page.findByRole('combobox', { name: 'Status filter' });
  await userEvent.type(search, 'Pending');
  await expect(page.queryByRole('option', { name: /Approved/ })).not.toBeInTheDocument();
  await userEvent.keyboard('{ArrowDown}{Enter}');
  await waitFor(() => expect(page.getByRole('option', { name: /Pending/ })).toHaveAttribute('aria-checked', 'true'));
  await waitFor(() => {
    const rows = [...canvasElement.querySelectorAll('tbody tr[data-row-id]')];
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) expect(within(row).getByText('Pending')).toBeVisible();
  });
  await userEvent.click(page.getByRole('button', { name: 'Clear filters' }));
  await waitFor(() => expect(page.getByRole('option', { name: /Pending/ })).toHaveAttribute('aria-checked', 'false'));
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(canvas.getByRole('button', { name: 'Status filter', exact: true })).toHaveFocus());
}

export async function checkLayoutDeletion(canvasElement) {
  const canvas = within(canvasElement);
  const page = within(canvasElement.ownerDocument.body);
  await userEvent.click(canvas.getByRole('button', { name: /^Layouts:/ }));
  await userEvent.click(await page.findByRole('button', { name: 'Delete Weekly review' }));
  await waitFor(() => expect(page.queryByRole('button', { name: 'Delete Weekly review' })).not.toBeInTheDocument());
  const remaining = page.getAllByRole('button', { name: /^Delete / });
  await expect(remaining[remaining.length - 1]).toHaveFocus();
  await userEvent.click(remaining[remaining.length - 1]);
  await waitFor(() => expect(page.getByRole('textbox', { name: 'Layout name' })).toHaveFocus());
  await userEvent.keyboard('{Escape}');
}
