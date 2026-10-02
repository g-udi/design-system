import { expect, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { pick, ready } from '../story-helpers.jsx';

const pattern = patternStories(
  'funnel-chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/funnel-chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/funnel-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/FunnelChart', id: 'charts-funnelchart', tags: ['autodocs'], ...catalogueMeta('funnel-chart') };

export const FunnelChartPattern1 = {
  name: 'Newsletter signups',
  ...pattern(1, 'Five steps from reading a post to opening the first issue, with the conversion from each step to the next, as bars or a centred funnel.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Newsletter signup funnel');
    await expect(canvas.getByText('23.8% from previous')).toBeVisible();
    await pick(canvasElement, 'Quarter');
    await waitFor(() => expect(canvas.getAllByText('39,800').length).toBeGreaterThan(0));
    await pick(canvasElement, 'Funnel');
  }
};
