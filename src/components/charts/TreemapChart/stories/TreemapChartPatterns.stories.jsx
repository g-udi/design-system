import { expect, waitFor } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { focusPlot, pick, readout, ready } from '../../stories/story-helpers.jsx';

const pattern = patternStories(
  'treemap-chart', import.meta.url,
  import.meta.glob('./fixtures/treemap-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/treemap-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/TreemapChart', id: 'charts-treemapchart', tags: ['autodocs'], ...catalogueMeta('treemap-chart') };

export const StorageFolders = {
  name: 'Storage by folder',
  ...pattern('storage-folders', 'Media storage by folder and file type, tinted by folder or shaded by size on the heat ramp.'),
  play: async ({ canvasElement }) => {
    await focusPlot(canvasElement, 'Media storage by folder and file type');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Images · Covers: Size 1\.8 GB/));
    await pick(canvasElement, 'Size');
    await ready(canvasElement, 'Media storage by folder and file type');
  }
};
