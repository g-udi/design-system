import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'stat-card', import.meta.url,
  import.meta.glob('./fixtures/stat-card/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/stat-card/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Stat Cards', id: 'blocks-stat-cards', tags: ['autodocs'], ...catalogueMeta('stat-card') };

export const KpiOverview = {
  name: 'KPI overview',
  ...pattern('kpi-overview', 'Four KPIs with icon tiles, change badges, a comparison line and a per-card menu, switched between separate cards, one divided panel and tinted colour blocks.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Panel' }));
    await expect(canvas.queryByRole('button', { name: 'Revenue actions' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: 'Cards' }));
    await expect(canvas.getByRole('button', { name: 'Revenue actions' })).toBeVisible();
  }
};
export const Revenue = { name: 'Revenue breakdown', ...pattern('revenue', 'A total with its change, an actions menu, the sources that make it up and a link to the full report.') };
export const Quota = { name: 'Quota and progress', ...pattern('quota', 'An API quota with its billed cost and renewal date, next to sprint progress with status badges and a predicted finish.') };
export const LeadRange = {
  name: 'Leads with a range',
  ...pattern('lead-range', 'A range switch swaps the dataset: the total, its change, progress to the goal and where the leads came from.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: '7d' }));
    await expect(canvas.getByText('312')).toBeVisible();
  }
};
export const Breakdowns = { name: 'Breakdowns', ...pattern('breakdowns', 'One segmented meter for three questions: plan mix with renewals due, compliance checks and feature adoption.') };
export const Balance = { name: 'Balance', ...pattern('balance', 'A dark balance card with a top-up action and its allocation across currencies.') };
export const TeamPerformance = {
  name: 'Team performance',
  ...pattern('team-performance', 'Progress to the quarter target, a KPI grid and the latest activity in one card.'),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="stat-card"]');
    const originalWidth = card.style.width;
    const originalScale = card.style.getPropertyValue('--ds-space-scale');
    card.style.width = '280px';
    card.style.setProperty('--ds-space-scale', '1.25');
    try {
      await waitFor(() => {
        const cardRight = card.getBoundingClientRect().right;
        for (const timestamp of ['12m', '1h', '3h']) {
          expect(within(card).getByText(timestamp).getBoundingClientRect().right).toBeLessThanOrEqual(cardRight);
        }
        for (const value of card.querySelectorAll('dd')) {
          expect(value.scrollWidth).toBeLessThanOrEqual(value.clientWidth + 1);
        }
      });
    } finally {
      card.style.width = originalWidth;
      if (originalScale) card.style.setProperty('--ds-space-scale', originalScale);
      else card.style.removeProperty('--ds-space-scale');
    }
  }
};
export const Support = { name: 'Support metrics', ...pattern('support', 'Icon tiles with a status badge per metric; response time and escalations read rising as bad.') };
export const Hero = { name: 'Hero metrics', ...pattern('hero', 'Large metrics with a one-line summary and a dark action bar.') };
