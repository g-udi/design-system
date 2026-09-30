import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'input-group',
  import.meta.glob('../../../../.storybook/fixtures/patterns/input-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/input-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Inputs/Input', id: 'core-input', tags: ['autodocs'], ...catalogueMeta('input-group') };

export const InputGroupPattern4 = {
  name: 'Addon placement',
  ...pattern(4, 'Icons and text before, after or on both sides of the input, divided addons, a header above an input, and a counter under a textarea.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Block-end footer' }), 'Hello');
    await expect(canvas.getByText('5/140 characters')).toBeVisible();
  }
};
export const InputGroupPattern25 = { name: 'Hints and states', ...pattern(25, 'Keyboard shortcuts, a result count, a valid check, a loading spinner, and the disabled and invalid states.') };
export const InputGroupPattern21 = {
  name: 'Inline actions',
  ...pattern(21, 'A text button, icon buttons, a visibility toggle, a tooltip, a popover, a menu, and a group inside a button group.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const password = canvas.getByLabelText('Visibility toggle');
    await expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
    await expect(password).toHaveAttribute('type', 'text');
    await expect(canvas.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');
  }
};
export const InputGroupPattern12 = { name: 'Dropdown selectors', ...pattern(12, 'A menu in a leading or trailing addon picks a country code, region, role, category, HTTP method or link visibility.') };
export const InputGroupPattern39 = {
  name: 'Search with filters',
  ...pattern(39, 'A clear button appears once there is a query, a status filter shows how many are selected, and a menu holds bulk actions.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('textbox', { name: 'Search contacts...' });
    await userEvent.type(search, 'ada');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(search).toHaveValue('');
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).toBeNull();
  }
};
export const InputGroupPattern33 = { name: 'Multi-field composer', ...pattern(33, 'A title input and a description textarea share one group, with a destination menu and actions in the footer.') };
export const InputGroupPattern19 = { name: 'AI prompt inputs', ...pattern(19, 'A single-line prompt bar with a tools menu and voice actions, and a multi-line composer with context chips, a search toggle, a model menu and send.') };
