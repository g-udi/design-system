import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { ready } from '../story-helpers.jsx';

const pattern = patternStories(
  'scatter-chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/scatter-chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/scatter-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/ScatterChart', id: 'charts-scatterchart', tags: ['autodocs'], ...catalogueMeta('scatter-chart') };

export const ScatterChartPattern1 = {
  name: 'Length, read time and shares',
  ...pattern(1, 'Essays by length and minutes read, with shares as the bubble size and an average line.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Essay length against minutes read, sized by shares');
    await userEvent.click(canvas.getByRole('button', { name: 'Show data' }));
    await waitFor(() => expect(canvas.getByRole('rowheader', { name: 'Running a calm team' })).toBeVisible());
  }
};
