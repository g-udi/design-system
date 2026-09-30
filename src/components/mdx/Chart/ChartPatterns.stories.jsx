import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'MDX/Chart', tags: ['autodocs'], ...catalogueMeta('chart') };

const bars = (canvasElement) => canvasElement.querySelectorAll('.recharts-bar-rectangle');
const pick = (canvasElement, name) => userEvent.click(within(canvasElement).getByRole('radio', { name }));

export const ChartPattern1 = {
  name: 'Bar chart',
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
export const ChartPattern11 = { name: 'Hover to reveal values', ...pattern(11, 'Monochrome bars widen on hover and the header shows the hovered value.') };
export const ChartPattern13 = {
  name: 'Area chart',
  ...pattern(13, 'Gradient, stripe, dot and crosshatch fills on smooth or step curves; switches stack three dashed series and add glowing markers.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const areas = () => canvasElement.querySelectorAll('.recharts-area-area');
    await waitFor(() => expect(areas().length).toBe(1));
    await userEvent.click(canvas.getByRole('switch', { name: 'Stacked' }));
    await waitFor(() => expect(areas().length).toBe(3));
    await pick(canvasElement, 'Crosshatch');
    await waitFor(() => expect(areas()[0].getAttribute('fill')).toMatch(/Crosshatch/));
    await userEvent.click(canvas.getByRole('switch', { name: 'Stacked' }));
    await pick(canvasElement, 'Gradient');
  }
};
export const ChartPattern17 = { name: 'Forecast line with stripe zone', ...pattern(17, 'A projected series drawn as a line over a striped area.') };
export const ChartPattern19 = {
  name: 'Donut and pie',
  ...pattern(19, 'Parts of a whole as a donut with a centre total or a full pie, with solid, gradient or patterned slices, a legend, and a hovered slice that grows.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Tasks')).toBeInTheDocument());
    await pick(canvasElement, 'Pie');
    await waitFor(() => expect(canvas.queryByText('Tasks')).not.toBeInTheDocument());
    await pick(canvasElement, 'Donut');
  }
};
export const ChartPattern23 = {
  name: 'Radar chart',
  ...pattern(23, 'Scores across six areas on a fixed 0 to 100 scale; the switch overlays a dashed target with hollow markers.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radars = () => canvasElement.querySelectorAll('.recharts-radar');
    await waitFor(() => expect(radars().length).toBe(1));
    await userEvent.click(canvas.getByRole('switch', { name: 'Compare with target' }));
    await waitFor(() => expect(radars().length).toBe(2));
    await userEvent.click(canvas.getByRole('switch', { name: 'Compare with target' }));
  }
};
export const ChartPattern25 = { name: 'Radial scores with labels', ...pattern(25, 'Lighthouse scores per platform as labelled radial bars.') };
