import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'radial-chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/radial-chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/radial-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/RadialChart', id: 'charts-radialchart', tags: ['autodocs'], ...catalogueMeta('radial-chart') };

export const RadialChartPattern1 = { name: 'Labelled scores', ...pattern(1, 'Lighthouse scores per platform as labelled radial bars.') };
