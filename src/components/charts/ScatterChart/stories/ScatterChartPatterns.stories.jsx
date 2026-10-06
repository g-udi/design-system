import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { ready } from '../../stories/story-helpers.jsx';

const pattern = patternStories(
  'scatter-chart', import.meta.url,
  import.meta.glob('./fixtures/scatter-chart/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/scatter-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/ScatterChart', id: 'charts-scatterchart', tags: ['autodocs'], ...catalogueMeta('scatter-chart') };

export const LengthVsShares = {
  name: 'Length, read time and shares',
  ...pattern('length-vs-shares', 'Essays by length and minutes read, with shares as the bubble size and an average line.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Essay length against minutes read, sized by shares');
    await userEvent.click(canvas.getByRole('button', { name: 'Show data' }));
    await waitFor(() => expect(canvas.getByRole('rowheader', { name: 'Running a calm team' })).toBeVisible());
  }
};
