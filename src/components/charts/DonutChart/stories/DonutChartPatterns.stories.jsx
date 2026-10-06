import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { focusPlot, pick } from '../../stories/story-helpers.jsx';

const pattern = patternStories(
  'donut-chart', import.meta.url,
  import.meta.glob('./fixtures/donut-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/donut-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/DonutChart', id: 'charts-donutchart', tags: ['autodocs'], ...catalogueMeta('donut-chart') };

export const PatternedSlices = {
  name: 'Patterned slices',
  ...pattern('patterned-slices', 'Parts of a whole as a donut with a centre total or a full pie, with solid, gradient or patterned slices, a legend, and a hovered slice that grows.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Tasks')).toBeInTheDocument());
    await pick(canvasElement, 'Pie');
    await waitFor(() => expect(canvas.queryByText('Tasks')).not.toBeInTheDocument());
    await pick(canvasElement, 'Donut');
  }
};
export const TopicSelect = {
  name: 'Select a topic, small slices as Other',
  ...pattern('topic-select', 'A selectable donut: click or press Enter on a slice to pin it, the centre shows its share, and topics under 5% fold into Other.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await focusPlot(canvasElement, 'Essays by topic this year');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Engineering' })).toBeVisible());
    await expect(canvas.getByText('Notes on local-first software')).toBeVisible();
    await userEvent.keyboard('{End}{Enter}');
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Other' })).toBeVisible());
    await expect(canvas.getByText('Working from Lisbon')).toBeVisible();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'No topic selected' })).toBeVisible());
  }
};
