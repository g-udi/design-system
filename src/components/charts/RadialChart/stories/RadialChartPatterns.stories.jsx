import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'radial-chart', import.meta.url,
  import.meta.glob('./fixtures/radial-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/radial-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/RadialChart', id: 'charts-radialchart', tags: ['autodocs'], ...catalogueMeta('radial-chart') };

export const LabelledScores = { name: 'Labelled scores', ...pattern('labelled-scores', 'Lighthouse scores per platform as labelled radial bars.') };
