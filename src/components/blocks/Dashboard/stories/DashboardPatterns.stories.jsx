import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'dashboard', import.meta.url,
  import.meta.glob('./fixtures/dashboard/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/dashboard/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Dashboard', id: 'blocks-dashboard', tags: ['autodocs'], ...catalogueMeta('dashboard') };

export const OperationsCapacity = {
  name: 'Operations · Capacity and exceptions',
  ...pattern('operations-capacity', 'KPI tiles with trend lines, capacity allocation by team, utilisation against target, and a work queue that switches between a filterable exceptions table with row actions and a searchable module health table.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Modules' }));
    await waitFor(() => expect(canvas.getByRole('table', { name: 'Modules' })).toBeVisible());
    await userEvent.click(canvas.getByRole('tab', { name: /Exceptions/ }));
    await waitFor(() => expect(canvas.getByRole('table', { name: 'Open exceptions' })).toBeVisible());
  }
};
export const DeliveryTimesheet = {
  name: 'Project · Delivery timesheet',
  ...pattern('delivery-timesheet', 'A project header with breadcrumbs, status, collaborators and tabs, over a weekly worklog by person and day with totals, capacity rings and week navigation.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Next week' }));
    await waitFor(() => expect(canvas.getByRole('table', { name: /Oct 5 – Oct 11, 2026/ })).toBeVisible());
  }
};
export const AgentAnalytics = {
  name: 'AI agents · Conversation analytics',
  ...pattern('agent-analytics', 'Six assistant metrics as tabs that switch the chart, this period against the last, agents ranked by conversations with resolution and model cost, and where conversations start.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: /Model cost/ }));
    await waitFor(() => expect(canvas.getByRole('tab', { name: /Model cost/ })).toHaveAttribute('aria-selected', 'true'));
    await waitFor(() => expect(canvasElement.querySelector('[aria-label^="Model cost, last 14 days"]')).not.toBeNull());
  }
};
export const EdgeSecurity = {
  name: 'Security · Edge telemetry',
  ...pattern('edge-security', 'Traffic tiles with trends, blocked requests by attack vector, request flow from regions through the edge, node load by region and active threats with their mitigation progress.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'APAC' }));
    await waitFor(() => expect(canvas.getByText('sin-1')).toBeVisible());
    const pause = canvas.getAllByRole('button', { name: 'Pause rule' })[0];
    await userEvent.click(pause);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Resume rule' })).toHaveAttribute('aria-pressed', 'true'));
  }
};
export const FieldCoverage = {
  name: 'Field teams · Coverage',
  ...pattern('field-coverage', 'Coverage tiles, crews with coverage bars, an action queue of gaps, approvals and risks to settle, and technicians on shift against the demand forecast.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Approve 14 h' }));
    await waitFor(() => expect(canvas.queryByRole('button', { name: 'Approve 14 h' })).not.toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText('Approve overtime for Valley handled.')).toBeInTheDocument());
  }
};
export const CommerceRevenue = {
  name: 'Commerce · Revenue',
  ...pattern('commerce-revenue', 'Revenue tiles with trends, revenue by product line stacked over time, the channel mix, and a sortable, exportable order queue with fulfilment progress. The period switch reloads every figure.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Last 12 months' }));
    await waitFor(() => expect(canvas.getByText('$1.93M')).toBeVisible());
    const body = within(canvasElement.ownerDocument.body);
    const actions = canvas.getAllByRole('button', { name: /^Actions for/ })[0];
    for (const action of ['Open order', 'Preview packing slip']) {
      await userEvent.click(actions);
      await userEvent.click(await body.findByRole('menuitem', { name: action }));
      const dialog = await body.findByRole('dialog');
      await waitFor(() => expect(within(dialog).getByText('Customer')).toBeVisible());
      await expect(dialog).toHaveAccessibleName(new RegExp(action === 'Open order' ? '^Order #' : '^Packing slip #'));
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
      await waitFor(() => expect(actions).toHaveFocus());
    }
  }
};
export const CreatorPayouts = {
  name: 'Creators · Payouts',
  ...pattern('creator-payouts', 'A claimable balance band with progress to the payout goal, receipts against the refund buffer, payout sweeps with automatic switches, and a searchable ledger with a running total.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /^Claim / }));
    await waitFor(() => expect(canvas.getByText(/on its way, arriving Monday/)).toBeVisible());
    await userEvent.click(canvas.getByRole('switch', { name: 'Automatic sweep to Debit card' }));
    await waitFor(() => expect(canvas.getByRole('switch', { name: 'Automatic sweep to Debit card' })).toBeChecked());
  }
};
export const NewsletterAnalytics = {
  name: 'Content · Newsletter analytics',
  ...pattern('newsletter-analytics', 'Subscriber tiles, free and paid growth, the last issue from inbox to upgrade, opens by weekday and hour, recent activity and every issue this month, under a period toolbar with a custom range and comparison.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: /Compare/ }));
    await waitFor(() => expect(canvas.getByText(/compared with/)).toBeInTheDocument());
  }
};
