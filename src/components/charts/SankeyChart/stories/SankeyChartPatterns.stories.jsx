import { expect, userEvent, waitFor } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { focusPlot, readout } from '../../stories/story-helpers.jsx';

const pattern = patternStories(
  'sankey-chart', import.meta.url,
  import.meta.glob('./fixtures/sankey-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/sankey-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/SankeyChart', id: 'charts-sankeychart', tags: ['autodocs'], ...catalogueMeta('sankey-chart') };

export const ReaderPaths = {
  name: 'Where readers go',
  ...pattern('reader-paths', 'Arrivals by source flow into essays or notes and on to reading more, subscribing or leaving; each flow is a point for the arrow keys.'),
  play: async ({ canvasElement }) => {
    await focusPlot(canvasElement, 'Reader flow from source to post type to next action');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Search → Essays: Readers 4,820'));
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Search → Notes: Readers 1,310'));
  }
};
