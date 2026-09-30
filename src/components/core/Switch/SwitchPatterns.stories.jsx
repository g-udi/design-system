import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'switch',
  import.meta.glob('../../../../.storybook/fixtures/patterns/switch/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/switch/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Switch', id: 'core-switch', tags: ['autodocs'], ...catalogueMeta('switch') };

export const SwitchPattern1 = {
  name: 'Labels and states',
  ...pattern(1, 'A plain label, a tooltip hint, New and Beta badges, and disabled switches, which ignore clicks on their label.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const airplane = canvas.getByRole('switch', { name: 'Airplane mode' });
    await userEvent.click(canvas.getByText('Airplane mode'));
    await expect(airplane).toHaveAttribute('aria-checked', 'true');
    const checked = canvas.getByRole('switch', { name: 'Disabled (Checked)' });
    await expect(canvas.getByRole('switch', { name: 'Disabled (Unchecked)' })).toBeDisabled();
    await expect(checked).toBeDisabled();
    await userEvent.click(canvas.getByText('Disabled (Checked)'));
    await expect(checked).toHaveAttribute('aria-checked', 'true');
  }
};
export const SwitchPattern8 = { name: 'Settings panel', ...pattern(8, 'A titled frame of settings, each row with an icon, a description and a small switch; the whole row toggles.') };
export const SwitchPattern14 = { name: 'Card grid with descriptions', ...pattern(14) };
export const SwitchPattern12 = { name: 'Colours and destructive settings', ...pattern(12, 'Checked tracks in status colours, and a destructive setting that explains what it does.') };
