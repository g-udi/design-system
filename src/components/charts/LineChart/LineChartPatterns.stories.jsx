import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'line-chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/line-chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/line-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/LineChart', id: 'charts-linechart', tags: ['autodocs'], ...catalogueMeta('line-chart') };

export const LineChartPattern1 = { name: 'Forecast with a stripe zone', ...pattern(1, 'A projected series drawn as a line over a striped area.') };
