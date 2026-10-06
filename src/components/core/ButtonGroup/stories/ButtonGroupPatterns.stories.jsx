import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

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
  }
};
export const SplitButtons = { name: 'Split buttons', ...pattern('split-buttons', 'A primary action with its alternatives behind a chevron, in solid and outline treatments and next to a value.') };
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
export const InputsSelects = { name: 'Inputs and selects', ...pattern('inputs-selects', 'Menus, clear and submit buttons around inputs, nested groups, and selects joined to actions or to each other.') };
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
export const CollectionToolbar = { name: 'Collection toolbar', ...pattern('collection-toolbar', 'Sort, filter, a split export, a view toggle and a create menu above a list.') };
export const EditorHeader = { name: 'Editor header', ...pattern('editor-header', 'A branch menu with its deploy status, live collaborators, and a split publish action.') };
export const Vertical = { name: 'Vertical groups', ...pattern('vertical', 'Stacked navigation with the current page, a stepper, and a nested tool palette.') };
