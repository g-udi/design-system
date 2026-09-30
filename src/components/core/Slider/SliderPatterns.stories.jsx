import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'slider',
  import.meta.glob('../../../../.storybook/fixtures/patterns/slider/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/slider/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Inputs/Slider', id: 'core-slider', tags: ['autodocs'], ...catalogueMeta('slider') };

export const SliderPattern6 = {
  name: 'Thumbs and states',
  ...pattern(6, 'One, two and three thumbs on the same scale, and the disabled state.'),
  play: async ({ canvasElement }) => {
    const [start, end] = within(canvasElement).getAllByRole('slider', { name: /^Range/ });
    start.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(start).toHaveAttribute('aria-valuenow', '30');
    end.focus();
    await userEvent.keyboard('{End}');
    await expect(end).toHaveAttribute('aria-valuenow', '100');
    await expect(start).toHaveAttribute('aria-valuenow', '30');
    await expect(within(canvasElement).getAllByRole('slider', { name: /^Three thumbs/ })).toHaveLength(3);
  }
};
export const SliderPattern7 = { name: 'Synced with number input', ...pattern(7) };
export const SliderPattern10 = { name: 'Scale labels and ticks', ...pattern(10, 'Reference labels at the ends and midpoint, or a tick for every step.') };
export const SliderPattern8 = { name: 'Custom readouts', ...pattern(8, 'A value tooltip above the thumb, a gradient scale with a named value, and an emoji scale.') };
