import { expect, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { pick, ready } from '../story-helpers.jsx';

const pattern = patternStories(
  'histogram-chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/histogram-chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/histogram-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/HistogramChart', id: 'charts-histogramchart', tags: ['autodocs'], ...catalogueMeta('histogram-chart') };

export const HistogramChartPattern1 = {
  name: 'Reading time with median and p90',
  ...pattern(1, 'Minutes spent on 60 essays in round bins, with labelled median and p90 markers; switch between coarse and fine bins.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Distribution of reading time across 60 essays');
    const rows = () => canvas.getAllByRole('rowheader').length;
    const fine = rows();
    await pick(canvasElement, 'Coarse');
    await waitFor(() => expect(rows()).toBeLessThan(fine));
  }
};
