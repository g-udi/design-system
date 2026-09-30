import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'button-group',
  import.meta.glob('../../../../.storybook/fixtures/patterns/button-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/button-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ButtonGroup', tags: ['autodocs'], ...catalogueMeta('button-group') };

export const ButtonGroupPattern22 = {
  name: 'Toolbars',
  ...pattern(22, 'Labelled, icon-only and badged actions at three sizes, with a disabled member, separators and an overflow menu.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Folder' })).toBeDisabled();
    await expect(canvas.getByRole('group', { name: 'Library' })).toHaveAttribute('data-slot', 'button-group');
  }
};
export const ButtonGroupPattern39 = { name: 'Split buttons', ...pattern(39, 'A primary action with its alternatives behind a chevron, in solid and outline treatments and next to a value.') };
export const ButtonGroupPattern34 = {
  name: 'Segmented choices',
  ...pattern(34, 'Single-choice groups with a pressed state: views, intervals, modes with a menu, badges, tooltips, a live status and a score scale.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('button', { name: 'Grid view' });
    await userEvent.click(grid);
    await expect(grid).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'List view' })).toHaveAttribute('aria-pressed', 'false');
  }
};
export const ButtonGroupPattern16 = { name: 'Inputs and selects', ...pattern(16, 'Menus, clear and submit buttons around inputs, nested groups, and selects joined to actions or to each other.') };
export const ButtonGroupPattern28 = {
  name: 'Steppers and pagination',
  ...pattern(28, 'Volume, zoom and stage steppers, and pagination with the current page.'),
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
export const ButtonGroupPattern8 = { name: 'Counts and labels', ...pattern(8, 'A count, badge or file size beside its action.') };
export const ButtonGroupPattern48 = { name: 'Collection toolbar', ...pattern(48, 'Sort, filter, a split export, a view toggle and a create menu above a list.') };
export const ButtonGroupPattern5 = { name: 'Editor header', ...pattern(5, 'A branch menu with its deploy status, live collaborators, and a split publish action.') };
export const ButtonGroupPattern49 = { name: 'Vertical groups', ...pattern(49, 'Stacked navigation with the current page, a stepper, and a nested tool palette.') };
