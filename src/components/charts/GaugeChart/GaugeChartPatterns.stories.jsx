import { expect, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { ready } from '../story-helpers.jsx';

const pattern = patternStories(
  'gauge-chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/gauge-chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/gauge-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/GaugeChart', id: 'charts-gaugechart', tags: ['autodocs'], ...catalogueMeta('gauge-chart') };

export const GaugeChartPattern1 = {
  name: 'Core Web Vitals',
  ...pattern(1, 'Three readings against their good, needs-work and poor thresholds, each with a target tick.'),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Largest contentful paint gauge');
    await ready(canvasElement, 'Interaction to next paint gauge');
    await expect(within(canvasElement).getAllByText('Needs work').length).toBeGreaterThan(0);
  }
};
