import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { ready } from '../../stories/story-helpers.jsx';

const pattern = patternStories(
  'sparkline', import.meta.url,
  import.meta.glob('./fixtures/sparkline/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/sparkline/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/Sparkline', id: 'charts-sparkline', tags: ['autodocs'], ...catalogueMeta('sparkline') };

export const StatTrends = {
  name: 'Stat cards with trends',
  ...pattern('stat-trends', 'Three stat cards, each with a word-sized trend: an area, bars against a target and a line.'),
  play: async ({ canvasElement }) => {
    for (const name of [ 'Readers, last 14 days', 'Signups, last 14 days', 'Unsubscribes, last 14 days' ]) await ready(canvasElement, name);
  }
};
