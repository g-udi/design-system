import { expect, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { focusPlot, pick, readout } from '../story-helpers.jsx';

const pattern = patternStories(
  'box-plot-chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/box-plot-chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/box-plot-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/BoxPlotChart', id: 'charts-boxplotchart', tags: ['autodocs'], ...catalogueMeta('box-plot-chart') };

export const BoxPlotChartPattern1 = {
  name: 'Response time by route',
  ...pattern(1, 'Median, quartiles, whiskers and slow outliers per route, switchable between regions.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await focusPlot(canvasElement, 'Response time distribution by route');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Home: Min 92/));
    await pick(canvasElement, 'Americas');
    await waitFor(() => expect(canvas.getAllByRole('cell', { name: '128' }).length).toBeGreaterThan(0));
  }
};
