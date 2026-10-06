import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { focusPlot, pick, readout } from '../../stories/story-helpers.jsx';

const pattern = patternStories(
  'heatmap-chart', import.meta.url,
  import.meta.glob('./fixtures/heatmap-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/heatmap-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/HeatmapChart', id: 'charts-heatmapchart', tags: ['autodocs'], ...catalogueMeta('heatmap-chart') };

export const ErrorsByHour = {
  name: 'Errors by service and hour',
  ...pattern('errors-by-hour', 'Errors per service in three-hour windows on a sequential ramp, or the change against last week on a diverging scale. Arrow keys move along a row; Up and Down change service.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await focusPlot(canvasElement, 'Errors by service and time of day');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Web · 00:00: Errors 2'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('API · 00:00: Errors 5'));
    await pick(canvasElement, 'Change');
    await waitFor(() => expect(canvas.getByRole('group', { name: 'Change in errors against last week' })).toBeInTheDocument());
  }
};
