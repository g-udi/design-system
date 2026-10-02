import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { focusPlot, pick } from '../story-helpers.jsx';

const pattern = patternStories(
  'donut-chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/donut-chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/donut-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/DonutChart', id: 'charts-donutchart', tags: ['autodocs'], ...catalogueMeta('donut-chart') };

export const DonutChartPattern1 = {
  name: 'Patterned slices',
  ...pattern(1, 'Parts of a whole as a donut with a centre total or a full pie, with solid, gradient or patterned slices, a legend, and a hovered slice that grows.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Tasks')).toBeInTheDocument());
    await pick(canvasElement, 'Pie');
    await waitFor(() => expect(canvas.queryByText('Tasks')).not.toBeInTheDocument());
    await pick(canvasElement, 'Donut');
  }
};
export const DonutChartPattern2 = {
  name: 'Select a topic, small slices as Other',
  ...pattern(2, 'A selectable donut: click or press Enter on a slice to pin it, the centre shows its share, and topics under 5% fold into Other.'),
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
