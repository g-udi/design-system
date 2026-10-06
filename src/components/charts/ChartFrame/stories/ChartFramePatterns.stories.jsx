import { expect, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { pick, ready } from '../../stories/story-helpers.jsx';

const pattern = patternStories(
  'chart-frame', import.meta.url,
  import.meta.glob('./fixtures/chart-frame/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/chart-frame/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/ChartFrame', id: 'charts-chartframe', tags: ['autodocs'], ...catalogueMeta('chart-frame') };

export const StatesLocale = {
  name: 'Loading, empty, invalid, error and locale',
  ...pattern('states-locale', 'One chart through every state, with copy written for its dashboard, and numbers reformatted for each locale.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Weekly views');
    await expect(canvas.getByRole('cell', { name: '12.8K' })).toBeInTheDocument();
    await pick(canvasElement, 'de-DE');
    await waitFor(() => expect(canvas.getByRole('cell', { name: '12.840' })).toBeInTheDocument());
    await pick(canvasElement, 'empty');
    await waitFor(() => expect(canvas.getByText('No views yet. Publish a post to start the count.')).toBeVisible());
    await pick(canvasElement, 'invalid');
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('still being counted'));
    await pick(canvasElement, 'loading');
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="chart"]')).toHaveAttribute('aria-busy', 'true'));
    await pick(canvasElement, 'error');
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('Views could not load.'));
    await pick(canvasElement, 'ready');
    await pick(canvasElement, 'en-US');
  }
};
