// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = reuiPatterns(
  'command',
  import.meta.glob('../../../../.storybook/fixtures/reui/command/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/command/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Commander', tags: ['autodocs'], ...catalogueMeta('command') };

export const ReuiCommand1 = {
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
export const ReuiCommand2 = { name: 'With shortcuts', ...pattern(2) };
export const ReuiCommand3 = { name: 'With groups', ...pattern(3) };
export const ReuiCommand4 = { name: 'With many groups', ...pattern(4) };
export const ReuiCommand5 = { name: 'File search', ...pattern(5) };
export const ReuiCommand6 = { name: 'User search with avatars', ...pattern(6) };
export const ReuiCommand7 = { name: 'Action palette with shortcuts', ...pattern(7) };
export const ReuiCommand8 = { name: 'Recent and favorites', ...pattern(8) };
