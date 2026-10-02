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
const rowOf = (canvas, text) => canvas.getByText(text).closest('tr');
export const DataGridPattern45 = {
  name: 'Shared drive tree',
  ...pattern(45, 'A file tree whose folders load their contents when opened: a skeleton row while the request is pending, an error row with Retry when it fails, and a cache so reopening is instant. Drag a file before, after or into a folder (hovering a closed folder opens it), or focus its grip and press Enter, the arrow keys and Enter to move it from the keyboard; a row never drops into itself. Checking a folder checks everything inside it and a partly checked folder reads as mixed, with the bulk bar counting every item. Size, cost and last-modified roll up through every level, the footer totals the whole drive, and Expand opens all, none, or the top levels.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    // A lazy folder shows a loading row, then its contents.
    await userEvent.click(within(rowOf(canvas, 'Design')).getByRole('button', { name: 'Expand row' }));
    await expect(await canvas.findByText('Loading Design')).toBeInTheDocument();
    await expect(await canvas.findByText('Brand guidelines.pdf')).toBeVisible();
    // A failed load offers Retry, which loads it.
    await userEvent.click(within(rowOf(canvas, 'Archive')).getByRole('button', { name: 'Expand row' }));
    await expect(await canvas.findByRole('alert')).toHaveTextContent("Couldn't load Archive");
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await expect(await canvas.findByText('2024 invoices.zip')).toBeVisible();
    // Checking a folder checks its contents; unchecking one leaves it mixed.
    await userEvent.click(within(rowOf(canvas, 'Design')).getByRole('checkbox', { name: 'Select row' }));
    await expect(within(rowOf(canvas, 'Brand guidelines.pdf')).getByRole('checkbox')).toBeChecked();
    await expect(await canvas.findByText('4 items selected')).toBeVisible();
    await userEvent.click(within(rowOf(canvas, 'Design tokens.json')).getByRole('checkbox'));
    await expect(within(rowOf(canvas, 'Design')).getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    // Keyboard move: pick up the roadmap, walk up to "Into Marketing", drop.
    const announcement = () => canvasElement.querySelector('[data-slot="data-grid-table-viewport"] > [role="status"]')?.textContent ?? '';
    within(rowOf(canvas, 'Roadmap 2027.pdf')).getByRole('button', { name: /Drag to move row/ }).focus();
    await userEvent.keyboard('{Enter}');
    for (let step = 0; step < 40 && !announcement().includes('Into Marketing'); step++) await userEvent.keyboard('{ArrowUp}');
    await expect(announcement()).toContain('Into Marketing');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(rowOf(canvas, 'Roadmap 2027.pdf')).toHaveAttribute('data-depth', '1'));
    await expect(announcement()).toContain('Moved Roadmap 2027.pdf');
    // The footer totals the drive; Collapse all folds every folder.
    await expect(canvas.getByText('All files')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Expand' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Collapse all' }));
    await waitFor(() => expect(canvas.queryByText('Brand guidelines.pdf')).not.toBeInTheDocument());
    await expect(within(rowOf(canvas, 'Design')).getByRole('button', { name: 'Expand row' })).toHaveAttribute('aria-expanded', 'false');
  }
};
export const DataGridPattern46 = {
  name: 'Editorial desk',
  ...pattern(46, 'Stories banded by status, desk or editor. Each band is its own section with a tinted header, a count, select-all for that section, an Add action and a collapse toggle, and repeats the column headers; sorting, selection and the bulk bar are shared across every band, and empty bands stay visible. The row menu moves a story up, down, to the top or to the bottom of its band, and Reset order puts the plan back. Running order switches to one draggable list where Alt+Arrow and Alt+Home/End move the focused story, and a search that matches nothing shows an empty state.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const section = (name) => canvas.getByRole('table', { name });
    const firstRow = (name) => within(section(name)).getAllByRole('row')[1];
    // One table per band, each with its own column headers.
    await expect(canvas.getAllByRole('table')).toHaveLength(4);
    await expect(canvas.getAllByRole('columnheader', { name: /Headline/ })).toHaveLength(4);
    // Select-all for one band feeds the shared bulk bar.
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all in Drafting' }));
    await expect(await canvas.findByText('3 stories selected')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    // An empty band stays visible and takes new rows.
    await expect(within(section('Ready')).getByText('Nothing in Ready yet.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Add to Ready' }));
    await expect(await within(section('Ready')).findByText('Untitled story')).toBeVisible();
    // Move to top within a band, then reset the order.
    await userEvent.click(within(section('Editing')).getByRole('button', { name: 'Actions for Ten albums recorded in this town' }));
    await userEvent.click(await body.findByRole('menuitem', { name: /Move to top/ }));
    await waitFor(() => expect(firstRow('Editing')).toHaveTextContent('Ten albums recorded in this town'));
    await userEvent.click(canvas.getByRole('button', { name: 'Reset order' }));
    await waitFor(() => expect(firstRow('Editing')).toHaveTextContent('City council approves the night bus plan'));
    await expect(canvas.getByRole('button', { name: 'Reset order' })).toBeDisabled();
    // Re-band by desk.
    await userEvent.click(canvas.getByRole('radio', { name: 'Desk' }));
    await expect(await canvas.findByRole('table', { name: 'Features' })).toBeVisible();
    // Running order: Alt+End sends the focused story to the bottom.
    await userEvent.click(canvas.getByRole('radio', { name: 'Running order' }));
    const handles = await canvas.findAllByRole('button', { name: 'Drag to reorder row' });
    handles[0].focus();
    await userEvent.keyboard('{Alt>}{End}{/Alt}');
    await waitFor(() => expect(canvas.getAllByRole('row').at(-1)).toHaveTextContent('City council approves the night bus plan'));
    // A search with no match shows the empty state.
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search stories' }), 'zzz');
    await expect(await canvas.findByText(/No stories match/)).toBeVisible();
    await userEvent.clear(canvas.getByRole('searchbox', { name: 'Search stories' }));
    await userEvent.click(canvas.getByRole('radio', { name: 'Status' }));
  }
};
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
export const DataGridPattern50 = {
  name: 'CRM workspace',
  ...pattern(50, 'A pipeline workspace built from the view controls: status tabs with live counts, the Filters builder, a pinned row, the view settings popover (density, sticky header, striped rows, column visibility and order), a table or card view over the same sort, filter and selection, saved layouts with Reset layout (kept in localStorage), column stats in every header menu, columns added from a Cascader, heat cells and a lazily loaded revenue trend.'),
  beforeEach: () => {
    window.localStorage.removeItem('gaudi-crm-workspace-layouts');
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    // Grid rows only: each revenue trend also carries its own small data table.
    const gridRows = () => canvasElement.querySelectorAll('tr[data-row-id]');
    const headers = () => [...canvasElement.querySelectorAll('thead th[data-pinned], thead th')].map((cell) => cell.textContent.trim());
    // Status tabs count each stage and filter the stage column.
    await waitFor(() => expect(gridRows()).toHaveLength(24));
    await userEvent.click(canvas.getByRole('tab', { name: 'Won, 5' }));
    await waitFor(() => expect(gridRows()).toHaveLength(5));
    await userEvent.click(canvas.getByRole('tab', { name: 'All, 24' }));
    await waitFor(() => expect(gridRows()).toHaveLength(24));
    // View settings: hide a column, reorder another, switch density.
    await userEvent.click(canvas.getByRole('button', { name: 'View', exact: true }));
    await userEvent.click(await page.findByRole('checkbox', { name: 'Health' }));
    await waitFor(() => expect(headers()).not.toContain('Health'));
    await userEvent.click(page.getByRole('button', { name: 'Move Owner down' }));
    await expect(await page.findByText('Owner moved to position 2 of 7')).toBeInTheDocument();
    await expect(page.getByRole('button', { name: 'Move Owner down' })).toHaveFocus();
    await userEvent.click(page.getByRole('radio', { name: 'Compact' }));
    await userEvent.keyboard('{Escape}');
    // The change reads as a custom layout; save it, then reset.
    const layoutsTrigger = canvas.getByRole('button', { name: /^Layouts:/ });
    await waitFor(() => expect(layoutsTrigger).toHaveAccessibleName('Layouts: Custom, Modified'));
    await userEvent.click(layoutsTrigger);
    await userEvent.type(await page.findByRole('textbox', { name: 'Layout name' }), 'Weekly review');
    await userEvent.click(page.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(layoutsTrigger).toHaveAccessibleName('Layouts: Weekly review'));
    await userEvent.click(page.getByRole('button', { name: 'Reset layout' }));
    await waitFor(() => expect(layoutsTrigger).toHaveAccessibleName('Layouts: Default'));
    await waitFor(() => expect(headers()).toContain('Health'));
    await userEvent.click(page.getByRole('button', { name: 'Apply Weekly review' }));
    await waitFor(() => expect(headers()).not.toContain('Health'));
    await userEvent.keyboard('{Escape}');
    // Header menus carry column stats.
    await userEvent.click(canvas.getByRole('button', { name: 'Amount' }));
    const stats = await page.findByRole('group', { name: 'Column stats' });
    await expect(within(stats).getByRole('menuitem', { name: /^Sum\s*\$1\.7M$/ })).toBeVisible();
    await expect(within(stats).getByRole('menuitem', { name: /^Average/ })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    // Add a column from the Cascader registry.
    await userEvent.click(canvas.getByRole('combobox', { name: 'Add column' }));
    await userEvent.click(await page.findByRole('option', { name: /Support/ }));
    await userEvent.click(await page.findByRole('option', { name: /CSAT/ }));
    await waitFor(() => expect(headers()).toContain('CSAT'));
    // Cards read the same rows and share the selection.
    await userEvent.click(canvas.getByRole('radio', { name: 'Cards' }));
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-slot=data-grid-card]')).toHaveLength(24));
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Adatum' }));
    await userEvent.click(canvas.getByRole('radio', { name: 'Table' }));
    await waitFor(() => expect(canvasElement.querySelector('tr[data-row-id="deal-4"]')).toHaveAttribute('data-state', 'selected'));
    await expect(canvas.getByText(/1 selected/)).toBeInTheDocument();
  }
};
export const DataGridPattern51 = {
  name: 'Shipment exceptions',
  ...pattern(51, 'Five thousand exceptions behind infinite scroll: rows are virtualized and load in pages as the list scrolls. Facets and search narrow the query; selection, select-all and bulk assign or export work on loaded rows, and "Select all matching" extends a bulk action to rows that have not loaded yet. The view settings popover sets density and which columns show.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    const bulk = () => canvas.getByRole('region', { name: 'Bulk actions' });
    const rowBoxes = await canvas.findAllByRole('checkbox', { name: 'Select row' });
    // Only the rows in view render, out of the loaded page.
    await expect(rowBoxes.length).toBeLessThan(100);
    await expect(canvas.getByText('100 / 5,000')).toBeInTheDocument();
    await userEvent.click(rowBoxes[0]);
    await userEvent.click(rowBoxes[2]);
    await expect(bulk()).toHaveTextContent('2 selected');
    await expect(canvasElement.querySelectorAll('tr[data-state=selected]')).toHaveLength(2);
    // Select all takes every loaded row, then offers every matching one.
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all' }));
    await expect(bulk()).toHaveTextContent('100 selected');
    await userEvent.click(canvas.getByRole('button', { name: 'Select all 5,000 matching' }));
    await expect(bulk()).toHaveTextContent('5,000 selected');
    await userEvent.click(canvas.getByRole('button', { name: 'Assign', exact: true }));
    await userEvent.click(await page.findByRole('menuitem', { name: 'Hana Kim' }));
    await expect(await canvas.findByText('Assigned 5,000 shipments to Hana Kim')).toBeInTheDocument();
    // Unticking one row leaves "all matching" for an explicit selection.
    await userEvent.click(canvas.getAllByRole('checkbox', { name: 'Select row' })[1]);
    await expect(bulk()).toHaveTextContent('99 selected');
    await expect(canvas.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute('data-state', 'indeterminate');
    // Scrolling to the end loads the next page into the same selection model.
    const viewport = canvasElement.querySelector('[data-slot=scroll-area-viewport]');
    viewport.scrollTop = viewport.scrollHeight;
    await waitFor(() => expect(canvas.getByText('200 / 5,000')).toBeInTheDocument(), { timeout: 4000 });
    await expect(bulk()).toHaveTextContent('99 selected');
    // A new query starts a new selection.
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search shipments' }), 'Rotterdam');
    await waitFor(() => expect(canvas.queryByRole('region', { name: 'Bulk actions' })).not.toBeInTheDocument());
    // Column visibility from the view settings.
    await userEvent.click(canvas.getByRole('button', { name: 'View', exact: true }));
    await userEvent.click(await page.findByRole('checkbox', { name: 'Carrier' }));
    await waitFor(() => expect(canvas.queryByRole('button', { name: 'Carrier' })).not.toBeInTheDocument());
    await userEvent.keyboard('{Escape}');
  }
};
