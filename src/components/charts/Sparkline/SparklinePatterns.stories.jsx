import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { ready } from '../story-helpers.jsx';

const pattern = patternStories(
  'sparkline',
  import.meta.glob('../../../../.storybook/fixtures/patterns/sparkline/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/sparkline/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/Sparkline', id: 'charts-sparkline', tags: ['autodocs'], ...catalogueMeta('sparkline') };

export const SparklinePattern1 = {
  name: 'Stat cards with trends',
  ...pattern(1, 'Three stat cards, each with a word-sized trend: an area, bars against a target and a line.'),
  play: async ({ canvasElement }) => {
    for (const name of [ 'Readers, last 14 days', 'Signups, last 14 days', 'Unsubscribes, last 14 days' ]) await ready(canvasElement, name);
  }
};
