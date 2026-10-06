import { expect, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { pick, ready } from '../../stories/story-helpers.jsx';

const pattern = patternStories(
  'funnel-chart', import.meta.url,
  import.meta.glob('./fixtures/funnel-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/funnel-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/FunnelChart', id: 'charts-funnelchart', tags: ['autodocs'], ...catalogueMeta('funnel-chart') };

export const NewsletterSignups = {
  name: 'Newsletter signups',
  ...pattern('newsletter-signups', 'Five steps from reading a post to opening the first issue, with the conversion from each step to the next, as bars or a centred funnel.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Newsletter signup funnel');
    await expect(canvas.getByText('23.8% from previous')).toBeVisible();
    await pick(canvasElement, 'Quarter');
    await waitFor(() => expect(canvas.getAllByText('39,800').length).toBeGreaterThan(0));
    await pick(canvasElement, 'Funnel');
  }
};
