import { expect, userEvent, waitFor } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { focusPlot, readout } from '../story-helpers.jsx';

const pattern = patternStories(
  'sankey-chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/sankey-chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/sankey-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/SankeyChart', id: 'charts-sankeychart', tags: ['autodocs'], ...catalogueMeta('sankey-chart') };

export const SankeyChartPattern1 = {
  name: 'Where readers go',
  ...pattern(1, 'Arrivals by source flow into essays or notes and on to reading more, subscribing or leaving; each flow is a point for the arrow keys.'),
  play: async ({ canvasElement }) => {
    await focusPlot(canvasElement, 'Reader flow from source to post type to next action');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Search → Essays: Readers 4,820'));
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Search → Notes: Readers 1,310'));
  }
};
