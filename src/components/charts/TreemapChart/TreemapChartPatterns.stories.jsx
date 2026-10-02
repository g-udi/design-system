import { expect, waitFor } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { focusPlot, pick, readout, ready } from '../story-helpers.jsx';

const pattern = patternStories(
  'treemap-chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/treemap-chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/treemap-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/TreemapChart', id: 'charts-treemapchart', tags: ['autodocs'], ...catalogueMeta('treemap-chart') };

export const TreemapChartPattern1 = {
  name: 'Storage by folder',
  ...pattern(1, 'Media storage by folder and file type, tinted by folder or shaded by size on the heat ramp.'),
  play: async ({ canvasElement }) => {
    await focusPlot(canvasElement, 'Media storage by folder and file type');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Images · Covers: Size 1\.8 GB/));
    await pick(canvasElement, 'Size');
    await ready(canvasElement, 'Media storage by folder and file type');
  }
};
