import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'stat-cards',
  import.meta.glob('../../../../.storybook/fixtures/patterns/stat-cards/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/stat-cards/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Stat Cards', id: 'blocks-stat-cards', tags: ['autodocs'], ...catalogueMeta('stat-cards') };

export const StatCardsPattern1 = {
  name: 'KPI overview',
  ...pattern(1, 'Four KPIs with icon tiles, change badges, a comparison line and a per-card menu, switched between separate cards, one divided panel and tinted colour blocks.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Panel' }));
    await expect(canvas.queryByRole('button', { name: 'Revenue actions' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: 'Cards' }));
    await expect(canvas.getByRole('button', { name: 'Revenue actions' })).toBeVisible();
  }
};
export const StatCardsPattern2 = { name: 'Revenue breakdown', ...pattern(2, 'A total with its change, an actions menu, the sources that make it up and a link to the full report.') };
export const StatCardsPattern3 = { name: 'Quota and progress', ...pattern(3, 'An API quota with its billed cost and renewal date, next to sprint progress with status badges and a predicted finish.') };
export const StatCardsPattern4 = {
  name: 'Leads with a range',
  ...pattern(4, 'A range switch swaps the dataset: the total, its change, progress to the goal and where the leads came from.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: '7d' }));
    await expect(canvas.getByText('312')).toBeVisible();
  }
};
export const StatCardsPattern5 = { name: 'Breakdowns', ...pattern(5, 'One segmented meter for three questions: plan mix with renewals due, compliance checks and feature adoption.') };
export const StatCardsPattern6 = { name: 'Balance', ...pattern(6, 'A dark balance card with a top-up action and its allocation across currencies.') };
export const StatCardsPattern7 = { name: 'Team performance', ...pattern(7, 'Progress to the quarter target, a KPI grid and the latest activity in one card.') };
export const StatCardsPattern8 = { name: 'Support metrics', ...pattern(8, 'Icon tiles with a status badge per metric; response time and escalations read rising as bad.') };
export const StatCardsPattern9 = { name: 'Hero metrics', ...pattern(9, 'Large metrics with a one-line summary and a dark action bar.') };
