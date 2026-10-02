import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { ready } from '../story-helpers.jsx';

const pattern = patternStories(
  'stacked-bar-list',
  import.meta.glob('../../../../.storybook/fixtures/patterns/stacked-bar-list/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/stacked-bar-list/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/StackedBarList', id: 'charts-stackedbarlist', tags: ['autodocs'], ...catalogueMeta('stacked-bar-list') };

export const StackedBarListPattern1 = {
  name: 'Top posts by source',
  ...pattern(1, 'Ranked posts as stacked bars of search, newsletter, social and direct readers; the switch draws each post as 100% to compare the mix.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Readers per post by traffic source');
    await expect(canvas.getByRole('cell', { name: '5,570' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('switch', { name: 'Compare mix' }));
    await waitFor(() => expect(canvas.getByText('Each post as 100%, to compare where its readers came from.')).toBeVisible());
    await expect(canvas.getAllByRole('cell', { name: '56%' }).length).toBeGreaterThan(0);
  }
};
