import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { focusPlot, pick, readout } from '../../stories/story-helpers.jsx';

const pattern = patternStories(
  'area-chart', import.meta.url,
  import.meta.glob('./fixtures/area-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/area-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/AreaChart', id: 'charts-areachart', tags: ['autodocs'], ...catalogueMeta('area-chart') };

export const FillsStacking = {
  name: 'Fills, curves and stacking',
  ...pattern('fills-stacking', 'Gradient, stripe, dot and crosshatch fills on smooth or step curves; switches stack three dashed series and add glowing markers.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const areas = () => canvasElement.querySelectorAll('.recharts-area-area');
    await waitFor(() => expect(areas().length).toBe(1));
    await userEvent.click(canvas.getByRole('switch', { name: 'Stacked' }));
    await waitFor(() => expect(areas().length).toBe(3));
    await pick(canvasElement, 'Crosshatch');
    await waitFor(() => expect(areas()[0].getAttribute('fill')).toMatch(/Crosshatch/));
    await userEvent.click(canvas.getByRole('switch', { name: 'Stacked' }));
    await pick(canvasElement, 'Gradient');
  }
};
export const AnnotatedTraffic = {
  name: 'Annotated traffic with keyboard reading',
  ...pattern('annotated-traffic', 'Twelve months of readers and subscribers with a goal line and annotated launch and summer dip. Tab to the plot, read each month with the arrow keys, press Enter to pin it, and open the data table.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await focusPlot(canvasElement, 'Unique readers and new subscribers per month');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Jan: Readers 2,380, Subscribers 210'));
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Mar: Readers 3,920/));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByTestId('pinned-month')).toHaveTextContent('Mar: Readers 3,920, Subscribers 610'));
    await userEvent.click(canvas.getByRole('button', { name: 'Show data' }));
    await waitFor(() => expect(canvas.getByRole('rowheader', { name: 'Aug' })).toBeVisible());
  }
};
