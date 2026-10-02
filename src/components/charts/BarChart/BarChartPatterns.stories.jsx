import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { bars, pick } from '../story-helpers.jsx';

const pattern = patternStories(
  'bar-chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/bar-chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/bar-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/BarChart', id: 'charts-barchart', tags: ['autodocs'], ...catalogueMeta('bar-chart') };

export const BarChartPattern1 = {
  name: 'Fills, comparison and layout',
  ...pattern(1, 'One bar chart with every fill: solid, gradient, stripes, dots, duotone and 3D. Switches add a second series with a legend and lay the bars out horizontally.'),
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
export const BarChartPattern2 = { name: 'Hover to reveal values', ...pattern(2, 'Monochrome bars widen on hover and the header shows the hovered value.') };
