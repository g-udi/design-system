import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'radar-chart', import.meta.url,
  import.meta.glob('./fixtures/radar-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/radar-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/RadarChart', id: 'charts-radarchart', tags: ['autodocs'], ...catalogueMeta('radar-chart') };

export const TargetScores = {
  name: 'Scores against a target',
  ...pattern('target-scores', 'Scores across six areas on a fixed 0 to 100 scale; the switch overlays a dashed target with hollow markers.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radars = () => canvasElement.querySelectorAll('.recharts-radar');
    await waitFor(() => expect(radars().length).toBe(1));
    await userEvent.click(canvas.getByRole('switch', { name: 'Compare with target' }));
    await waitFor(() => expect(radars().length).toBe(2));
    await userEvent.click(canvas.getByRole('switch', { name: 'Compare with target' }));
  }
};
