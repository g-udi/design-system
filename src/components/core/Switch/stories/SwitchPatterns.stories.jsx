import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'switch', import.meta.url,
  import.meta.glob('./fixtures/switch/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/switch/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Switch', id: 'core-switch', tags: ['autodocs'], ...catalogueMeta('switch') };

export const LabelsStates = {
  name: 'Labels and states',
  ...pattern('labels-states', 'A plain label, a tooltip hint, New and Beta badges, and disabled switches, which ignore clicks on their label.'),
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
export const SettingsPanel = { name: 'Settings panel', ...pattern('settings-panel', 'A titled frame of settings, each row with an icon, a description and a small switch; the whole row toggles.') };
export const CardGrid = { name: 'Card grid with descriptions', ...pattern('card-grid') };
export const ColoursDestructive = { name: 'Colours and destructive settings', ...pattern('colours-destructive', 'Checked tracks in status colours, and a destructive setting that explains what it does.') };
