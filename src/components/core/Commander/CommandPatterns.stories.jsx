import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'command',
  import.meta.glob('../../../../.storybook/fixtures/patterns/command/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/command/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Commander', tags: ['autodocs'], ...catalogueMeta('command') };

export const CommandPattern1 = {
  name: 'Basic command',
  ...pattern(1),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('combobox');
    await expect(canvasElement.querySelector('[aria-selected="true"]')).toBeNull();
    await userEvent.click(search);
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('option', { name: 'Calendar' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.type(search, 'Billing');
    await expect(canvas.getByRole('option', { name: /Billing/ })).toBeVisible();
    await userEvent.clear(search);
  }
};
export const CommandPattern2 = { name: 'With shortcuts', ...pattern(2) };
export const CommandPattern3 = { name: 'With groups', ...pattern(3) };
export const CommandPattern4 = { name: 'With many groups', ...pattern(4) };
export const CommandPattern5 = { name: 'File search', ...pattern(5) };
export const CommandPattern6 = { name: 'User search with avatars', ...pattern(6) };
export const CommandPattern7 = { name: 'Action palette with shortcuts', ...pattern(7) };
export const CommandPattern8 = { name: 'Recent and favorites', ...pattern(8) };
