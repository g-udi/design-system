// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = reuiPatterns(
  'slider',
  import.meta.glob('../../../../.storybook/fixtures/reui/slider/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/slider/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Slider', tags: ['autodocs'], ...catalogueMeta('slider') };

export const ReuiSlider1 = { name: 'Basic', ...pattern(1) };
export const ReuiSlider2 = { name: 'Disabled', ...pattern(2) };
export const ReuiSlider3 = { name: 'Multiple values', ...pattern(3) };
export const ReuiSlider4 = { name: 'Vertical range', ...pattern(4) };
export const ReuiSlider5 = { name: 'Controlled value', ...pattern(5) };
export const ReuiSlider6 = {
  name: 'Range',
  ...pattern(6),
  play: async ({ canvasElement }) => {
    const [start, end] = within(canvasElement).getAllByRole('slider');
    start.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(start).toHaveAttribute('aria-valuenow', '30');
    end.focus();
    await userEvent.keyboard('{End}');
    await expect(end).toHaveAttribute('aria-valuenow', '100');
    await expect(start).toHaveAttribute('aria-valuenow', '30');
  }
};
export const ReuiSlider7 = { name: 'Synced with number input', ...pattern(7) };
export const ReuiSlider8 = { name: 'Color temperature', ...pattern(8) };
export const ReuiSlider9 = { name: 'Reference labels', ...pattern(9) };
export const ReuiSlider10 = { name: 'Tick marks', ...pattern(10) };
export const ReuiSlider11 = { name: 'Value tooltip', ...pattern(11) };
export const ReuiSlider12 = { name: 'Emoji rating', ...pattern(12) };
