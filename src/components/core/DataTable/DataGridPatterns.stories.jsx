import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'data-grid',
  import.meta.glob('../../../../.storybook/fixtures/patterns/data-grid/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/data-grid/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/DataTable', id: 'core-datatable', tags: ['autodocs'], ...catalogueMeta('data-grid') };

export const DataGridPattern1 = { name: 'Layout options', ...pattern(1, 'Every tableLayout flag on one grid: density, cell and row borders, stripes, rounded rows, header fill, sticky header and auto width.') };
export const DataGridPattern19 = { name: 'Column controls', ...pattern(19, 'Header menus sort, pin, move and hide columns; edges resize them; header icons label each field.') };
export const DataGridPattern29 = { name: 'Selection, expansion and pinned rows', ...pattern(29, 'Select rows, expand a row for details, and pin rows above the page while sorting and paging.') };
export const DataGridPattern14 = { name: 'Draggable rows and columns', ...pattern(14) };
export const DataGridPattern26 = {
  name: 'Grouping and aggregation',
  ...pattern(26, 'Group by category, status or author from the toggle or any column menu. Each group band collapses, counts its records and aggregates every column: sums, a mean, a unique count and a custom reads-per-thousand-words measure. The footer totals come from the same aggregation registry, and Export CSV writes the records behind the groups.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const collapse = await canvas.findByRole('button', { name: 'Collapse Engineering' });
    await expect(canvas.getByText('Notes on local-first software')).toBeVisible();
    await userEvent.click(collapse);
    await waitFor(() => expect(canvas.queryByText('Notes on local-first software')).not.toBeInTheDocument());
    await expect(canvas.getByRole('button', { name: 'Expand Engineering' })).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(canvas.getByRole('radio', { name: 'Status' }));
    await expect(await canvas.findByRole('button', { name: 'Collapse Published' })).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'No grouping' }));
    await waitFor(() => expect(canvas.queryByRole('button', { name: /^Collapse / })).not.toBeInTheDocument());
    // Back to the opening view: grouped by category.
    await userEvent.click(canvas.getByRole('radio', { name: 'Category' }));
    await expect(await canvas.findByRole('button', { name: 'Collapse Engineering' })).toBeVisible();
  }
};
export const DataGridPattern30 = { name: 'Tree rows', ...pattern(30) };
export const DataGridPattern9 = { name: 'Sub table', ...pattern(9) };
export const DataGridPattern31 = { name: 'Spreadsheet editing', ...pattern(31) };
export const DataGridPattern40 = {
  name: 'Inventory workspace',
  ...pattern(40, 'Spreadsheet editing with every built-in editor: text, select, combobox, number, date, checkbox and switch. Edits, pastes, fills and clears stay pending in `useDataGridEditing` until Save; Discard reverts them all. Each column validates with `required`, `min` and `validate(value, row)`, and an invalid cell shows its message inline and blocks Save. Undo and Redo (Mod+Z, Shift+Mod+Z, Ctrl+Y or the toolbar) step through edits and row changes. Select rows to duplicate or delete them; Add item appends a row and opens its first cell. Accessibility: the grid is one tab stop with aria-activedescendant; invalid cells set aria-invalid and point at their message with aria-describedby, the editor overlay inherits both, and the save bar announces its counts politely.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole('grid');
    const cell = (rowId, columnId) => grid.querySelector(`tr[data-row-id="${rowId}"] td[data-col-id="${columnId}"]`);
    await userEvent.click(cell('inv-1', 'stock'));
    await userEvent.keyboard('-5{Enter}');
    await waitFor(() => expect(cell('inv-1', 'stock')).toHaveAttribute('aria-invalid', 'true'));
    await expect(cell('inv-1', 'stock')).toHaveTextContent('-5');
    const bar = await canvas.findByRole('region', { name: '1 unsaved change' });
    await expect(within(bar).getByText('1 cell needs attention')).toBeVisible();
    await expect(within(bar).getByRole('button', { name: 'Save' })).toHaveAttribute('aria-disabled', 'true');
    // Undo restores the saved value and clears the pending change.
    await userEvent.keyboard('{Control>}z{/Control}');
    await waitFor(() => expect(cell('inv-1', 'stock')).toHaveTextContent('42'));
    await waitFor(() => expect(canvas.queryByRole('region', { name: /unsaved/ })).not.toBeInTheDocument());
    await userEvent.keyboard('{Control>}{Shift>}z{/Shift}{/Control}');
    await waitFor(() => expect(cell('inv-1', 'stock')).toHaveTextContent('-5'));
    // A valid value clears the error; a checkbox flip is a second change.
    await userEvent.keyboard('12{Enter}');
    await waitFor(() => expect(cell('inv-1', 'stock')).not.toHaveAttribute('aria-invalid'));
    await userEvent.click(within(grid.querySelector('tr[data-row-id="inv-6"]')).getByRole('checkbox', { name: 'Taxable' }));
    await expect(await canvas.findByRole('region', { name: '2 unsaved changes' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(canvas.queryByRole('region', { name: /unsaved/ })).not.toBeInTheDocument(), { timeout: 3000 });
    await expect(cell('inv-1', 'stock')).toHaveTextContent('12');
  }
};
export const DataGridPattern41 = {
  name: 'Pricing plans',
  ...pattern(41, 'Per-row edit mode with `useDataGridRowEditing`: Edit turns one row into a draft with an editor in each cell while the other rows stay read-only. Enter or Save keeps the draft, Escape or Cancel throws it away, and a field shows its message once touched or after a save attempt. Add plan starts a new row in edit mode; cancelling removes it. Accessibility: each editor is named by its column, invalid editors set aria-invalid and aria-describedby, the first editor takes focus when the row opens, and focus returns to the row\'s Edit button afterwards.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'Edit Team' }));
    const name = await canvas.findByRole('textbox', { name: 'Plan' });
    await waitFor(() => expect(name).toHaveFocus());
    await expect(canvas.getByRole('button', { name: 'Edit Starter' })).toBeDisabled();
    await userEvent.clear(name);
    await waitFor(() => expect(name).toHaveAttribute('aria-invalid', 'true'));
    // An invalid draft does not save.
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('textbox', { name: 'Plan' })).toBeInTheDocument();
    await userEvent.type(name, 'Team Plus');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.queryByRole('textbox', { name: 'Plan' })).not.toBeInTheDocument());
    await expect(canvas.getByText('Team Plus')).toBeVisible();
    // Escape cancels a draft and returns focus to its Edit button.
    const editStarter = canvas.getByRole('button', { name: 'Edit Starter' });
    await userEvent.click(editStarter);
    const seats = await canvas.findByRole('textbox', { name: 'Seats' });
    await userEvent.clear(seats);
    await userEvent.type(seats, '3');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('textbox', { name: 'Seats' })).not.toBeInTheDocument());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Edit Starter' })).toHaveFocus());
  }
};
export const DataGridPattern23 = { name: 'CRUD in a frame', ...pattern(23) };
export const DataGridPattern34 = { name: 'Server-side pagination', ...pattern(34, 'Server-side pagination, sorting, search and a status filter, with a loading skeleton while each page arrives.') };
export const DataGridPattern28 = { name: 'Infinite scroll', ...pattern(28, 'Rows load from a remote source as the list scrolls.') };
export const DataGridPattern32 = { name: 'Column virtualization', ...pattern(32) };
const exportPattern = pattern(35, 'Export CSV writes what the grid shows: the visible columns in display order, the current search and sort, and only the selected rows when there is a selection. Dates keep an ISO value through `meta.exportValue`, notes with quotes are escaped, and formula-like text is neutralised. This example previews the file instead of saving it.');
export const DataGridPattern35 = {
  name: 'Export to CSV',
  ...exportPattern,
  parameters: { ...exportPattern.parameters, visualAudit: { wide: 'The CSV preview spans the grid it was exported from.' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'Export CSV' }));
    const preview = await canvas.findByText(/Subscriber,Email,Plan,Joined,Opens,Note/);
    await expect(preview.closest('pre') || preview).toHaveTextContent('"Asked for ""longer"" essays, please"');
    await expect(preview.closest('pre') || preview).toHaveTextContent("'=Founding member");
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search subscribers' }), 'paid');
    await userEvent.click(canvas.getAllByRole('checkbox', { name: 'Select row' })[0]);
    await userEvent.click(canvas.getByRole('button', { name: 'Export 1 selected' }));
    // Searched, sorted by opens and narrowed to the selection: one record, Ana Ruiz.
    await waitFor(() => expect(canvas.getByText(/Subscriber,Email/).closest('figure, pre, div')).not.toHaveTextContent('Jo Morgan'));
    await expect(canvas.getByText(/Subscriber,Email/).closest('figure, pre, div')).toHaveTextContent('Ana Ruiz');
  }
};
