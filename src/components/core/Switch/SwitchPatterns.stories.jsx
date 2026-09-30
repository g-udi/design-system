import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'switch',
  import.meta.glob('../../../../.storybook/fixtures/patterns/switch/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/switch/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Switch', tags: ['autodocs'], ...catalogueMeta('switch') };

export const SwitchPattern1 = { name: 'Basic switch', ...pattern(1) };
export const SwitchPattern2 = { name: 'With description', ...pattern(2) };
export const SwitchPattern3 = {
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
export const SwitchPattern4 = { name: 'Sizes', ...pattern(4) };
export const SwitchPattern5 = { name: 'Switch group', ...pattern(5) };
export const SwitchPattern6 = { name: 'Card list with separators', ...pattern(6) };
export const SwitchPattern7 = { name: 'Card list with icons', ...pattern(7) };
export const SwitchPattern8 = { name: 'Inside a frame', ...pattern(8) };
export const SwitchPattern9 = { name: 'With tooltip info', ...pattern(9) };
export const SwitchPattern10 = { name: 'With badges', ...pattern(10) };
export const SwitchPattern11 = { name: 'Colored switches', ...pattern(11) };
export const SwitchPattern12 = { name: 'Destructive with confirmation text', ...pattern(12) };
export const SwitchPattern13 = { name: 'Compact settings table', ...pattern(13) };
export const SwitchPattern14 = { name: 'Card grid with descriptions', ...pattern(14) };
