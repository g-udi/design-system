import { expect, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { focusPlot, pick, readout } from '../../stories/story-helpers.jsx';

const pattern = patternStories(
  'box-plot-chart', import.meta.url,
  import.meta.glob('./fixtures/box-plot-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/box-plot-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/BoxPlotChart', id: 'charts-boxplotchart', tags: ['autodocs'], ...catalogueMeta('box-plot-chart') };

export const ResponseTimes = {
  name: 'Response time by route',
  ...pattern('response-times', 'Median, quartiles, whiskers and slow outliers per route, switchable between regions.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await focusPlot(canvasElement, 'Response time distribution by route');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Home: Min 92/));
    await pick(canvasElement, 'Americas');
    await waitFor(() => expect(canvas.getAllByRole('cell', { name: '128' }).length).toBeGreaterThan(0));
  }
};
