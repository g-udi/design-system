import { checkDraggableRows, checkTreeRows, checkSubTables, checkInfiniteScroll, checkCrudFrame, checkSpreadsheet } from '../../../../../tests/components/core/DataTable/checkDataGridWorkflows.js';
import { actInteraction } from '../../../../../tests/support/actInteraction.js';
import { checkDataGridRefs, checkDataGridLoading } from '../../../../../tests/components/core/DataTable/checkDataGridRefs.jsx';
import { act } from '../../../../../tests/support/reactAct.js';
import { createRoot } from 'react-dom/client';
import { Pattern as InventoryExample } from './fixtures/data-grid/data-grid-inventory.jsx';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { checkEditingRequests } from './dataGridEditingChecks.jsx';
import { checkColumnControls, checkLayoutDeletion } from './dataGridColumnChecks.js';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'data-grid', import.meta.url,
  import.meta.glob('./fixtures/data-grid/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/data-grid/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/DataTable', id: 'core-datatable', tags: ['autodocs'], ...catalogueMeta('data-grid') };

export const Layouts = { name: 'Layout options', ...pattern('layouts', 'Every tableLayout flag on one grid: density, cell and row borders, stripes, rounded rows, header fill, sticky header and auto width.'), play: async ({ canvasElement }) => { await checkDataGridRefs(canvasElement); await checkDataGridLoading(canvasElement); } };
export const ColumnControls = { name: 'Column controls', ...pattern('column-controls', 'Header menus sort, pin, move and hide columns; edges resize them; header icons label each field.'), play: checkColumnControls };
export const SelectionPinning = {
  name: 'Selection, expansion and pinned rows',
  ...pattern('selection-pinning', 'Select rows, expand a row for details, and pin rows above the page while sorting and paging.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const clipboard = navigator.clipboard;
    const original = Object.getOwnPropertyDescriptor(clipboard, 'writeText');
    const writeText = fn().mockResolvedValue(undefined);
    Object.defineProperty(clipboard, 'writeText', { configurable: true, value: writeText });
    try {
      const row = canvas.getByText('Anouk Varga').closest('tr');
      await userEvent.click(within(row).getByRole('button', { name: 'More actions' }));
      await userEvent.click(await page.findByRole('menuitem', { name: 'Copy ID' }));
      await expect(writeText).toHaveBeenCalledWith('1');
      await waitFor(() => expect(page.getByText('Employee ID copied')).toBeVisible());
    } finally {
      if (original) Object.defineProperty(clipboard, 'writeText', original);
      else delete clipboard.writeText;
    }
  }
};
export const Draggable = { name: 'Draggable rows and columns', ...pattern('draggable'), play: checkDraggableRows };
export const Grouping = {
  name: 'Grouping and aggregation',
  ...pattern('grouping', 'Group by category, status or author from the toggle or any column menu. Each group band collapses, counts its records and aggregates every column: sums, a mean, a unique count and a custom reads-per-thousand-words measure. The footer totals come from the same aggregation registry, and Export CSV writes the records behind the groups.'),
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
export const TreeRows = { name: 'Tree rows', ...pattern('tree-rows'), play: checkTreeRows };
const rowOf = (canvas, text) => canvas.getByText(text).closest('tr');
export const SharedDrive = {
  name: 'Shared drive tree',
  ...pattern('shared-drive', 'A file tree whose folders load their contents when opened: a skeleton row while the request is pending, an error row with Retry when it fails, and a cache so reopening is instant. Drag a file before, after or into a folder (hovering a closed folder opens it), or focus its grip and press Enter, the arrow keys and Enter to move it from the keyboard; a row never drops into itself. Checking a folder checks everything inside it and a partly checked folder reads as mixed, with the bulk bar counting every item. Size, cost and last-modified roll up through every level, the footer totals the whole drive, and Expand opens all, none, or the top levels.'),
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
export const EditorialDesk = {
  name: 'Editorial desk',
  ...pattern('editorial-desk', 'Stories banded by status, desk or editor. Each band is its own section with a tinted header, a count, select-all for that section, an Add action and a collapse toggle, and repeats the column headers; sorting, selection and the bulk bar are shared across every band, and empty bands stay visible. The row menu moves a story up, down, to the top or to the bottom of its band, and Reset order puts the plan back. Running order switches to one draggable list where Alt+Arrow and Alt+Home/End move the focused story, and a search that matches nothing shows an empty state.'),
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
export const SubTable = { name: 'Sub table', ...pattern('sub-table'), play: checkSubTables };
export const Spreadsheet = { name: 'Spreadsheet editing', ...pattern('spreadsheet'), play: checkSpreadsheet };
export const Inventory = {
  name: 'Inventory workspace',
  ...pattern('inventory', 'Spreadsheet editing with every built-in editor: text, select, combobox, number, date, checkbox and switch. Edits, pastes, fills and clears stay pending in `useDataGridEditing` until Save; Discard reverts them all. Each column validates with `required`, `min` and `validate(value, row)`, and an invalid cell shows its message inline and blocks Save. Undo and Redo (Mod+Z, Shift+Mod+Z, Ctrl+Y or the toolbar) step through edits and row changes. Select rows to duplicate or delete them; Add item appends a row and opens its first cell. Accessibility: the grid is one tab stop with aria-activedescendant; invalid cells set aria-invalid and point at their message with aria-describedby, the editor overlay inherits both, and the save bar announces its counts politely.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole('grid');
    const cell = (rowId, columnId) => grid.querySelector(`tr[data-row-id="${rowId}"] td[data-col-id="${columnId}"]`);
    await userEvent.click(cell('inv-1', 'stock'));
    await waitFor(() => expect(grid).toHaveAttribute('aria-activedescendant', cell('inv-1', 'stock').id));
    const focused = grid.getAttribute('aria-activedescendant');
    await fireEvent.keyDown(grid, { key: 'ArrowRight', isComposing: true });
    await expect(grid).toHaveAttribute('aria-activedescendant', focused);
    const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    let resolveCopy;
    const writeText = fn(() => new Promise(resolve => { resolveCopy = resolve; }));
    try {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
      await userEvent.keyboard('{Control>}x{/Control}');
      await waitFor(() => expect(writeText).toHaveBeenCalled());
      await userEvent.click(cell('inv-2', 'stock'));
      await act(async () => resolveCopy());
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await expect(canvas.queryByRole('region', { name: /unsaved/ })).not.toBeInTheDocument();
      await expect(cell('inv-1', 'stock')).toHaveTextContent('42');
    } finally {
      resolveCopy?.();
      if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
      else delete navigator.clipboard;
    }
    await userEvent.click(cell('inv-1', 'name'));
    await actInteraction(() => userEvent.keyboard('{Enter}'));
    const itemEditor = await canvas.findByRole('textbox', { name: 'Item' });
    await fireEvent.keyDown(itemEditor, { key: 'Enter', isComposing: true });
    await fireEvent.keyDown(itemEditor, { key: 'Escape', isComposing: true });
    await expect(itemEditor).toBeVisible();
    await actInteraction(() => userEvent.keyboard('{Escape}'));
    await userEvent.click(cell('inv-1', 'stock'));
    await userEvent.keyboard('-5');
    const stockEditor = await canvas.findByRole('textbox', { name: 'Stock' });
    await fireEvent.keyDown(stockEditor, { key: 'Enter', isComposing: true });
    await fireEvent.keyDown(stockEditor, { key: 'ArrowUp', isComposing: true });
    await expect(stockEditor).toHaveValue('-5');
    await actInteraction(() => userEvent.keyboard('{Enter}'));
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
    await actInteraction(() => userEvent.keyboard('12{Enter}'));
    await waitFor(() => expect(cell('inv-1', 'stock')).not.toHaveAttribute('aria-invalid'));
    await userEvent.click(within(grid.querySelector('tr[data-row-id="inv-6"]')).getByRole('checkbox', { name: 'Taxable' }));
    await expect(await canvas.findByRole('region', { name: '2 unsaved changes' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(canvas.queryByRole('region', { name: /unsaved/ })).not.toBeInTheDocument(), { timeout: 3000 });
    await expect(cell('inv-1', 'stock')).toHaveTextContent('12');
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).getByText('Saved 2 changes')).toBeVisible());
    const host = canvasElement.ownerDocument.createElement('div');
    canvasElement.append(host);
    const temporary = createRoot(host);
    let mounted = true;
    try {
      await act(async () => temporary.render(<InventoryExample />));
      const temporaryGrid = await within(host).findByRole('grid');
      await userEvent.click(temporaryGrid.querySelector('tr[data-row-id="inv-1"] td[data-col-id="stock"]'));
      await waitFor(() => expect(host.querySelector('[data-slot="data-grid-cell-fill-handle"]')).not.toBeNull());
      const handle = host.querySelector('[data-slot="data-grid-cell-fill-handle"]');
      const viewport = handle.closest('[data-slot="data-grid-table-viewport"]');
      await fireEvent.pointerDown(handle, { pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 1 });
      await expect(viewport).toHaveAttribute('data-cell-filling');
      await act(async () => temporary.unmount());
      mounted = false;
      await expect(viewport).not.toHaveAttribute('data-cell-filling');
      await expect(viewport.querySelector('[data-slot="data-grid-cell-fill-preview"]')).toBeNull();
      await fireEvent.pointerUp(canvasElement.ownerDocument, { pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 0 });
    } finally {
      if (mounted) await act(async () => temporary.unmount());
      host.remove();
    }
    await checkEditingRequests(canvasElement);
  }
};
export const PricingPlans = {
  name: 'Pricing plans',
  ...pattern('pricing-plans', 'Per-row edit mode with `useDataGridRowEditing`: Edit turns one row into a draft with an editor in each cell while the other rows stay read-only. Enter or Save keeps the draft, Escape or Cancel throws it away, and a field shows its message once touched or after a save attempt. Add plan starts a new row in edit mode; cancelling removes it. Accessibility: each editor is named by its column, invalid editors set aria-invalid and aria-describedby, the first editor takes focus when the row opens, and focus returns to the row\'s Edit button afterwards.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'Edit Team' }));
    const name = await canvas.findByRole('textbox', { name: 'Plan' });
    await waitFor(() => expect(name).toHaveFocus());
    await fireEvent.keyDown(name, { key: 'Escape', isComposing: true });
    await fireEvent.keyDown(name, { key: 'Enter', isComposing: true });
    await expect(name).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Edit Starter' })).toBeDisabled();
    await userEvent.clear(name);
    await waitFor(() => expect(name).toHaveAttribute('aria-invalid', 'true'));
    // An invalid draft does not save.
    await actInteraction(() => userEvent.keyboard('{Enter}'));
    await expect(canvas.getByRole('textbox', { name: 'Plan' })).toBeInTheDocument();
    await userEvent.type(name, 'Team Plus');
    await actInteraction(() => userEvent.keyboard('{Enter}'));
    await waitFor(() => expect(canvas.queryByRole('textbox', { name: 'Plan' })).not.toBeInTheDocument());
    await expect(canvas.getByText('Team Plus')).toBeVisible();
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).getByText('Team Plus saved')).toBeVisible());
    // Escape cancels a draft and returns focus to its Edit button.
    const editStarter = canvas.getByRole('button', { name: 'Edit Starter' });
    await userEvent.click(editStarter);
    const seats = await canvas.findByRole('textbox', { name: 'Seats' });
    await userEvent.clear(seats);
    await userEvent.type(seats, '3');
    await actInteraction(() => userEvent.keyboard('{Escape}'));
    await waitFor(() => expect(canvas.queryByRole('textbox', { name: 'Seats' })).not.toBeInTheDocument());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Edit Starter' })).toHaveFocus());
  }
};
export const CrudFrame = { name: 'CRUD in a frame', ...pattern('crud-frame'), play: checkCrudFrame };
export const ServerPagination = {
  name: 'Server-side pagination',
  ...pattern('server-pagination', 'Server-side pagination, sorting, search and a status filter, with a loading skeleton while each page arrives.'),
  play: async ({ canvasElement }) => {
    await within(canvasElement).findByText('Anouk Varga');
    if (!import.meta.env.VITE_GAUDI_AUDIT) return;
    const { page } = await import('vitest/browser');
    const previous = { width: innerWidth, height: innerHeight };
    const canvas = within(canvasElement);
    try {
      await page.viewport(320, 900);
      const status = await canvas.findByRole('button', { name: 'Page shortcuts: 1 of 98' });
      const next = canvas.getByRole('button', { name: 'Go to next page' });
      await waitFor(() => expect(Math.abs(status.getBoundingClientRect().top - next.getBoundingClientRect().top)).toBeLessThanOrEqual(1));
      await userEvent.click(status);
      await userEvent.click(await within(document.body).findByRole('button', { name: '2', exact: true }));
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Page shortcuts: 2 of 98' })).toBeVisible());
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Go to previous page' })).toBeEnabled());
      await userEvent.click(canvas.getByRole('button', { name: 'Go to previous page' }));
      await canvas.findByText('Anouk Varga');
    } finally {
      await page.viewport(previous.width, previous.height);
    }
  }
};
export const InfiniteScroll = { name: 'Infinite scroll', ...pattern('infinite-scroll', 'Rows load from a remote source as the list scrolls.'), play: checkInfiniteScroll };
export const ColumnVirtualization = {
  name: 'Column virtualization',
  ...pattern('column-virtualization'),
  play: async ({ canvasElement }) => {
    if (!import.meta.env.VITE_GAUDI_AUDIT) return;
    const { page } = await import('vitest/browser');
    const previous = { width: innerWidth, height: innerHeight };
    const viewport = canvasElement.querySelector('[data-slot=scroll-area-viewport]');
    const first = () => canvasElement.querySelector('th[data-col-id=id]');
    try {
      await page.viewport(320, 900);
      await waitFor(() => expect(getComputedStyle(first()).position).not.toBe('sticky'));
      viewport.scrollLeft = 400;
      await waitFor(() => {
        const bounds = viewport.getBoundingClientRect();
        const metric = [...canvasElement.querySelectorAll('th[data-col-id]')].find((cell) => {
          const box = cell.getBoundingClientRect();
          return cell.textContent.includes('Metric') && box.left >= bounds.left && box.right <= bounds.right;
        });
        expect(metric).toBeTruthy();
        const box = metric.getBoundingClientRect();
        expect(metric.contains(document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2))).toBe(true);
      });
      await page.viewport(1440, 900);
      await waitFor(() => expect(getComputedStyle(first()).position).toBe('sticky'));
    } finally {
      viewport.scrollLeft = 0;
      await page.viewport(previous.width, previous.height);
    }
  }
};
const exportPattern = pattern('csv-export', 'Export CSV writes what the grid shows: the visible columns in display order, the current search and sort, and only the selected rows when there is a selection. Dates keep an ISO value through `meta.exportValue`, notes with quotes are escaped, and formula-like text is neutralised. This example previews the file instead of saving it.');
export const CsvExport = {
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
export const Crm = {
  name: 'CRM workspace',
  ...pattern('crm', 'A pipeline workspace built from the view controls: status tabs with live counts, the Filters builder, a pinned row, the view settings popover (density, sticky header, striped rows, column visibility and order), a table or card view over the same sort, filter and selection, saved layouts with Reset layout (kept in localStorage), column stats in every header menu, columns added from a Cascader, heat cells and a lazily loaded revenue trend.'),
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
    await checkLayoutDeletion(canvasElement);
  }
};
export const ShipmentExceptions = {
  name: 'Shipment exceptions',
  ...pattern('shipment-exceptions', 'Five thousand exceptions behind infinite scroll: rows are virtualized and load in pages as the list scrolls. Facets and search narrow the query; selection, select-all and bulk assign or export work on loaded rows, and "Select all matching" extends a bulk action to rows that have not loaded yet. The view settings popover sets density and which columns show.'),
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
