import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'line-chart', import.meta.url,
  import.meta.glob('./fixtures/line-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/line-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/LineChart', id: 'charts-linechart', tags: ['autodocs'], ...catalogueMeta('line-chart') };

export const ForecastZone = { name: 'Forecast with a stripe zone', ...pattern('forecast-zone', 'A projected series drawn as a line over a striped area.') };
