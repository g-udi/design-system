import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { pick, ready } from '../story-helpers.jsx';

const pattern = patternStories(
  'waterfall-chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/waterfall-chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/waterfall-chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Charts/WaterfallChart', id: 'charts-waterfallchart', tags: ['autodocs'], ...catalogueMeta('waterfall-chart') };

export const WaterfallChartPattern1 = {
  name: 'Recurring revenue bridge',
  ...pattern(1, 'Recurring revenue from one month to the next through new plans, upgrades, downgrades and cancellations, in euros, with the number format switchable between English and German.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Recurring revenue bridge from September to October');
    await userEvent.click(canvas.getByRole('button', { name: 'Show data' }));
    await waitFor(() => expect(canvas.getByRole('cell', { name: '€48,200' })).toBeVisible());
    await pick(canvasElement, 'Deutsch');
    // German currency format puts a no-break space before the euro sign.
    await waitFor(() => expect(canvas.getByRole('cell', { name: /^48\.200\s€$/ })).toBeVisible());
  }
};
