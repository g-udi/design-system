import { expect, userEvent, waitFor } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { focusPlot, readout } from '../../stories/story-helpers.jsx';

const pattern = patternStories(
  'range-chart', import.meta.url,
  import.meta.glob('./fixtures/range-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/range-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/RangeChart', id: 'charts-rangechart', tags: ['autodocs'], ...catalogueMeta('range-chart') };

export const BurnDown = {
  name: 'Release burn-down forecast',
  ...pattern('burn-down', 'Open issues so far as a line, then the forecast range to launch as a band, with today and the launch-ready line marked.'),
  play: async ({ canvasElement }) => {
    await focusPlot(canvasElement, 'Open issues for the 2.0 release, with the forecast to launch');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Day 1: Open issues 64/));
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Day 14: Forecast low 0, Forecast high 21'));
  }
};
