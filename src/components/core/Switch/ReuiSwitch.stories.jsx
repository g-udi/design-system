// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = reuiPatterns(
  'switch',
  import.meta.glob('../../../../.storybook/fixtures/reui/switch/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/switch/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Switch', tags: ['autodocs'], ...catalogueMeta('switch') };

export const ReuiSwitch1 = { name: 'Basic switch', ...pattern(1) };
export const ReuiSwitch2 = { name: 'With description', ...pattern(2) };
export const ReuiSwitch3 = {
  name: 'Disabled',
  ...pattern(3),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checked = canvas.getByRole('switch', { name: 'Disabled (Checked)' });
    await expect(canvas.getByRole('switch', { name: 'Disabled (Unchecked)' })).toBeDisabled();
    await expect(checked).toBeDisabled();
    await userEvent.click(canvas.getByText('Disabled (Checked)'));
    await expect(checked).toHaveAttribute('aria-checked', 'true');
  }
};
export const ReuiSwitch4 = { name: 'Sizes', ...pattern(4) };
export const ReuiSwitch5 = { name: 'Switch group', ...pattern(5) };
export const ReuiSwitch6 = { name: 'Card list with separators', ...pattern(6) };
export const ReuiSwitch7 = { name: 'Card list with icons', ...pattern(7) };
export const ReuiSwitch8 = { name: 'Inside a frame', ...pattern(8) };
export const ReuiSwitch9 = { name: 'With tooltip info', ...pattern(9) };
export const ReuiSwitch10 = { name: 'With badges', ...pattern(10) };
export const ReuiSwitch11 = { name: 'Colored switches', ...pattern(11) };
export const ReuiSwitch12 = { name: 'Destructive with confirmation text', ...pattern(12) };
export const ReuiSwitch13 = { name: 'Compact settings table', ...pattern(13) };
export const ReuiSwitch14 = { name: 'Card grid with descriptions', ...pattern(14) };
