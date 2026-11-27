import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'button-group', import.meta.url,
  import.meta.glob('./fixtures/button-group/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/button-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ButtonGroup', id: 'core-buttongroup', tags: ['autodocs'], ...catalogueMeta('button-group') };

export const Toolbars = {
  name: 'Toolbars',
  ...pattern('toolbars', 'Labelled, icon-only and badged actions at three sizes, with a disabled member, separators and an overflow menu.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Folder' })).toBeDisabled();
    await expect(canvas.getByRole('group', { name: 'Library' })).toHaveAttribute('data-slot', 'button-group');
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Trash' }));
    await expect(canvas.getByRole('region', { name: 'Library report' })).toHaveTextContent('Old sketch');
    await userEvent.click(canvas.getByRole('button', { name: 'More options' }));
    const csv = await body.findByRole('menuitem', { name: 'Export CSV' });
    await expect(csv).toHaveAttribute('download', 'library.csv');
    await expect(decodeURIComponent(csv.getAttribute('href'))).toContain('Old sketch');
    await expect(decodeURIComponent(csv.getAttribute('href'))).not.toContain('Release notes');
    await userEvent.keyboard('{Escape}');
    await userEvent.click(canvas.getByRole('button', { name: 'Files' }));
    await userEvent.upload(canvas.getByLabelText('Choose library files'), new File(['New document'], 'outline.md', { type: 'text/markdown' }));
    await expect(canvas.getByRole('region', { name: 'Library report' })).toHaveTextContent('outline.md');
  }
};
export const SplitButtons = {
  name: 'Split buttons',
  ...pattern('split-buttons', 'A primary action with its alternatives behind a chevron, in solid and outline treatments and next to a value.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const title = canvas.getByRole('textbox', { name: 'Draft title' });
    await userEvent.clear(title);
    await userEvent.type(title, 'Editorial brief');
    await userEvent.click(canvas.getByRole('button', { name: 'More save options' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Save for review' }));
    await expect(canvas.getByText('Editorial brief · Awaiting review')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Hold', exact: true }));
    const plan = canvas.getByRole('link', { name: 'Export plan' });
    await expect(plan).toHaveAttribute('download', 'transfer-plan.txt');
    await expect(decodeURIComponent(plan.getAttribute('href'))).toContain('Status: On hold');
  }
};
export const Segmented = {
  name: 'Segmented choices',
  ...pattern('segmented', 'Single-choice groups with a pressed state: views, intervals, modes with a menu, badges, tooltips, a live status and a score scale.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('button', { name: 'Grid view' });
    await userEvent.click(grid);
    await expect(grid).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'List view' })).toHaveAttribute('aria-pressed', 'false');
    const hour = canvas.getByRole('button', { name: '1H' });
    const day = canvas.getByRole('button', { name: '1D' });
    await expect(hour).toHaveClass('tabular-nums', 'bg-surface-muted');
    await userEvent.click(day);
    await expect(day).toHaveAttribute('aria-pressed', 'true');
    await expect(day).toHaveClass('tabular-nums', 'bg-surface-muted');
    await expect(hour).not.toHaveClass('bg-surface-muted');
  }
};
export const InputsSelects = {
  name: 'Inputs and selects',
  ...pattern('inputs-selects', 'Menus, clear and submit buttons around inputs, nested groups, and selects joined to actions or to each other.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const filter = canvas.getByRole('textbox', { name: 'Filter records' });
    await userEvent.type(filter, 'Design systems');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filter' }));
    await expect(filter).toHaveValue('');
    await expect(filter).toHaveFocus();
    for (const [label, value] of [['Assignee', 'Anouk Varga'], ['Status', 'Pending'], ['Environment', 'Production'], ['Time range', 'Last 30 days']]) {
      const trigger = canvas.getByRole('combobox', { name: label });
      await userEvent.click(trigger);
      await userEvent.click(await body.findByRole('option', { name: new RegExp(value) }));
      await expect(trigger).toHaveTextContent(value);
      await waitFor(() => expect(trigger).toHaveFocus());
    }
    const menu = canvas.getByRole('button', { name: 'Record options' });
    menu.focus();
    await userEvent.keyboard('{Enter}');
    await expect(await body.findByRole('menuitem', { name: 'Archived' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(menu).toHaveFocus());
    await userEvent.type(canvas.getByRole('textbox', { name: 'File name...' }), 'Brief.md');
    await userEvent.click(canvas.getByRole('button', { name: 'Create' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'New file' }));
    await expect(canvas.getByRole('list', { name: 'Matching records' })).toHaveTextContent('Brief.md');
    await userEvent.upload(canvas.getByLabelText('Choose message attachment'), new File(['Outline'], 'outline.md', { type: 'text/markdown' }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Send a message' }), 'Ready for review');
    await userEvent.click(canvas.getByRole('button', { name: 'Send', exact: true }));
    await expect(canvas.getByRole('list', { name: 'Local conversation' })).toHaveTextContent('Ready for review');
    await expect(await canvas.findByRole('link', { name: 'outline.md' })).toHaveAttribute('download', 'outline.md');
    await expect(canvas.getByRole('button', { name: 'Send', exact: true })).toBeDisabled();
  },
};
export const SteppersPagination = {
  name: 'Steppers and pagination',
  ...pattern('steppers-pagination', 'Volume, zoom and stage steppers, and pagination with the current page.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Volume' }));
    await userEvent.click(canvas.getByRole('button', { name: '55%' }));
    await expect(canvas.getByRole('button', { name: 'Muted' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(canvas.getByText('Page 4 of 5')).toBeVisible();
    await expect(canvas.getByRole('button', { name: '4' })).toHaveAttribute('aria-current', 'page');
  }
};
export const CountsLabels = { name: 'Counts and labels', ...pattern('counts-labels', 'A count, badge or file size beside its action.') };
export const CollectionToolbar = {
  name: 'Collection toolbar',
  ...pattern('collection-toolbar', 'Sort, filter, a split export, a view toggle and a create menu above a list.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Sort: Newest' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Oldest' }));
    await expect(canvas.getByRole('button', { name: 'Sort: Oldest' })).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: 'List view' }));
    await expect(canvas.getByRole('button', { name: 'List view' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Grid view' })).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Domain' }));
    const items = within(canvas.getByRole('list', { name: 'Collection items' }));
    await expect(items.getAllByRole('listitem')).toHaveLength(1);
    await expect(items.getByText('read.gaudi.dev')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'More export options' }));
    const exported = await body.findByRole('menuitem', { name: 'Export JSON' });
    await expect(JSON.parse(decodeURIComponent(exported.getAttribute('href').split(',')[1]))).toEqual([{ name: 'read.gaudi.dev', type: 'Domain' }]);
    await userEvent.keyboard('{Escape}');
    for (const [label, option] of [['More export options', 'Print / save PDF'], ['Add new', 'Team']]) {
      const trigger = canvas.getByRole('button', { name: label });
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      await expect(await body.findByRole('menuitem', { name: option })).toBeVisible();
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(trigger).toHaveFocus());
    }
  },
};
export const EditorHeader = {
  name: 'Editor header',
  ...pattern('editor-header', 'A branch menu with local document previews, collaborators, and a split publish action.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const branch = canvas.getByRole('button', { name: 'main' });
    branch.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(await body.findByRole('menuitem', { name: 'develop' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Preview' }));
    await expect(canvas.getByRole('article')).toHaveTextContent('Editor shortcuts');
    const publish = canvas.getByRole('button', { name: 'Publish', exact: true });
    publish.focus();
    await userEvent.keyboard(' ');
    await expect(canvas.getByText('develop · Published')).toBeVisible();
    await expect(publish).toBeDisabled();
  }
};
export const Vertical = {
  name: 'Vertical groups',
  ...pattern('vertical', 'Stacked navigation with the current page, a stepper, and a nested tool palette.'),
  play: async ({ canvasElement }) => {
    const sections = within(within(canvasElement).getByRole('group', { name: 'Sections' }));
    await expect(sections.getByRole('button', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    const analytics = sections.getByRole('button', { name: 'Analytics' });
    analytics.focus();
    await userEvent.keyboard(' ');
    await expect(analytics).toHaveAttribute('aria-current', 'page');
    await expect(sections.getByRole('button', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
    await userEvent.click(sections.getByRole('button', { name: 'Settings' }));
    await expect(sections.getByRole('button', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
    await expect(analytics).not.toHaveAttribute('aria-current');
    const canvas = within(canvasElement);
    const section = canvas.getByRole('region', { name: 'Section preview' });
    await userEvent.click(canvas.getByRole('button', { name: 'Subtract' }));
    await expect(section).toHaveTextContent('1 entry per section');
    await userEvent.click(canvas.getByRole('button', { name: 'Search this section' }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Search entries' }), 'Workspace');
    await expect(section).toHaveTextContent('Workspace settings');
    await expect(section).not.toHaveTextContent('Email preferences');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove first entry' }));
    await expect(section).not.toHaveTextContent('Workspace settings');
  },
};
