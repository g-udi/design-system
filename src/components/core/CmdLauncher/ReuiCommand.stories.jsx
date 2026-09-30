// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = reuiPatterns(
  'command',
  import.meta.glob('../../../../.storybook/fixtures/reui/command/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/command/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/CmdLauncher', tags: ['autodocs'], ...catalogueMeta('command') };

export const ReuiCommand1 = {
  name: 'Command: Basic command',
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
export const ReuiCommand2 = { name: 'Command: Command with shortcuts', ...pattern(2) };
export const ReuiCommand3 = { name: 'Command: Command with groups', ...pattern(3) };
export const ReuiCommand4 = { name: 'Command: Command with many groups', ...pattern(4) };
export const ReuiCommand5 = { name: 'Command: File search command palette', ...pattern(5) };
export const ReuiCommand6 = { name: 'Command: User search command with avatars', ...pattern(6) };
export const ReuiCommand7 = { name: 'Command: Action palette with keyboard shortcuts', ...pattern(7) };
export const ReuiCommand8 = { name: 'Command: Command with recent and favorites sections', ...pattern(8) };
