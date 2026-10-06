import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { bars, pick } from '../../stories/story-helpers.jsx';

const pattern = patternStories(
  'bar-chart', import.meta.url,
  import.meta.glob('./fixtures/bar-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/bar-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/BarChart', id: 'charts-barchart', tags: ['autodocs'], ...catalogueMeta('bar-chart') };

export const FillsLayout = {
  name: 'Fills, comparison and layout',
  ...pattern('fills-layout', 'One bar chart with every fill: solid, gradient, stripes, dots, duotone and 3D. Switches add a second series with a legend and lay the bars out horizontally.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(bars(canvasElement).length).toBe(8));
    await pick(canvasElement, 'Stripes');
    await waitFor(() => expect(canvasElement.querySelector('.recharts-bar-rectangle path, .recharts-bar-rectangle rect')?.getAttribute('fill')).toMatch(/stripes/));
    await userEvent.click(canvas.getByRole('switch', { name: 'Compare' }));
    await waitFor(() => expect(bars(canvasElement).length).toBe(16));
    await pick(canvasElement, '3D');
    await expect(canvas.getByRole('switch', { name: 'Horizontal' })).toBeDisabled();
    await pick(canvasElement, 'Solid');
    await userEvent.click(canvas.getByRole('switch', { name: 'Compare' }));
  }
};
export const HoverValues = { name: 'Hover to reveal values', ...pattern('hover-values', 'Monochrome bars widen on hover and the header shows the hovered value.') };
