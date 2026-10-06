import { auditOverlayState } from '../../Popover/stories/auditOverlayState.js';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'slider', import.meta.url,
  import.meta.glob('./fixtures/slider/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/slider/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Slider', id: 'core-slider', tags: ['autodocs'], ...catalogueMeta('slider') };

export const ThumbsStates = {
  name: 'Thumbs and states',
  ...pattern('thumbs-states', 'One, two and three thumbs on the same scale, and the disabled state.'),
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
export const NumberSync = { name: 'Paired with a number field', ...pattern('number-sync'), play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const input = canvas.getByRole('textbox', { name: 'Opacity' });
  await userEvent.clear(input);
  await userEvent.type(input, '75');
  const slider = canvas.getByRole('slider', { name: 'Opacity' });
  await expect(slider).toHaveAttribute('aria-valuenow', '75');
  slider.focus();
  await userEvent.keyboard('{ArrowRight}');
  await expect(input).toHaveValue('76');
} };
export const ScaleTicks = { name: 'Scale labels and ticks', ...pattern('scale-ticks', 'Reference labels at the ends and midpoint, or a tick for every step.') };
export const Readouts = { name: 'Custom readouts', ...pattern('readouts', 'A percentage readout, a gradient scale with a named value, and an emoji scale.'), play: async (context) => {
  const canvas = within(context.canvasElement);
  const slider = canvas.getByRole('slider', { name: 'Volume' });
  slider.focus();
  await userEvent.keyboard('{Home}');
  await expect(canvas.getByLabelText('Volume percentage')).toHaveTextContent('0%');
  await auditOverlayState(context, 'minimum');
  slider.focus();
  await userEvent.keyboard('{End}');
  await expect(canvas.getByLabelText('Volume percentage')).toHaveTextContent('100%');
  await auditOverlayState(context, 'maximum');
} };
