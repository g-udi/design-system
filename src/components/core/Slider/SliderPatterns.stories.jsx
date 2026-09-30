import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'slider',
  import.meta.glob('../../../../.storybook/fixtures/patterns/slider/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/slider/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Slider', tags: ['autodocs'], ...catalogueMeta('slider') };

export const SliderPattern1 = { name: 'Basic', ...pattern(1) };
export const SliderPattern2 = { name: 'Disabled', ...pattern(2) };
export const SliderPattern3 = { name: 'Multiple values', ...pattern(3) };
export const SliderPattern4 = { name: 'Vertical range', ...pattern(4) };
export const SliderPattern5 = { name: 'Controlled value', ...pattern(5) };
export const SliderPattern6 = {
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
export const SliderPattern7 = { name: 'Synced with number input', ...pattern(7) };
export const SliderPattern8 = { name: 'Color temperature', ...pattern(8) };
export const SliderPattern9 = { name: 'Reference labels', ...pattern(9) };
export const SliderPattern10 = { name: 'Tick marks', ...pattern(10) };
export const SliderPattern11 = { name: 'Value tooltip', ...pattern(11) };
export const SliderPattern12 = { name: 'Emoji rating', ...pattern(12) };
