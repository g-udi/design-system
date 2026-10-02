import { expect, userEvent, waitFor } from 'storybook/test';
import { chartsMeta, forcedState, focusPlot, readout, ready } from '../story-helpers.jsx';
import { SankeyChart } from './index.js';

// Support tickets from channel to queue to outcome.
const tickets = [
  { source: 'Email', target: 'Billing', value: 420 },
  { source: 'Email', target: 'Technical', value: 610 },
  { source: 'Chat', target: 'Technical', value: 880 },
  { source: 'Chat', target: 'Account', value: 290 },
  { source: 'Forum', target: 'Technical', value: 340 },
  { source: 'Billing', target: 'Solved', value: 390 },
  { source: 'Billing', target: 'Escalated', value: 30 },
  { source: 'Technical', target: 'Solved', value: 1520 },
  { source: 'Technical', target: 'Escalated', value: 310 },
  { source: 'Account', target: 'Solved', value: 270 },
  { source: 'Account', target: 'Escalated', value: 20 }
];

export default {
  title: 'Charts/SankeyChart',
  id: 'charts-sankeychart',
  tags: ['autodocs'],
  ...chartsMeta('SankeyChart', { component: SankeyChart, controls: { nodeWidth: 'number' }, primary: () => Playground, wide: true })
};

export const Playground = {
  args: { title: 'Where support tickets go', description: 'Tickets this month from channel to queue to outcome.', height: 360, nodeWidth: 10, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Flows between stages with widths proportional to volume. Stages come from the links (or `nodes`); each flow is a point for the arrow keys and a row in the data table.' },
      source: {
        language: 'jsx',
        code: `import { SankeyChart } from '@gaudi/design-system/charts';

<SankeyChart
  title='Where support tickets go'
  ariaLabel='Support tickets from channel to queue to outcome'
  links={[
    { source: 'Email', target: 'Billing', value: 420 },
    { source: 'Billing', target: 'Solved', value: 390 }
    // …one link per flow
  ]}
/>`
      }
    }
  },
  render: ({ state, ...args }) => <SankeyChart {...args} ariaLabel='Support tickets from channel to queue to outcome' links={state === 'empty' ? [] : tickets} state={forcedState(state) || (state === 'invalid' ? 'invalid' : undefined)} />,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await focusPlot(canvasElement, 'Support tickets from channel to queue to outcome');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Email → Billing/));
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Email → Technical/));
  }
};

export const Budget = {
  name: 'Budget from income to spend',
  parameters: { docs: { description: { story: 'A two-stage flow: where a small studio’s monthly income goes, formatted as currency. Explicit `nodes` fix the order of the stages.' } } },
  render: () => (
    <SankeyChart
      title='Studio budget'
      ariaLabel='Monthly income by source flowing to spend'
      nodes={[ 'Client work', 'Sponsorships', 'Newsletter', 'Salaries', 'Tools', 'Savings' ]}
      links={[
        { source: 'Client work', target: 'Salaries', value: 14000 },
        { source: 'Client work', target: 'Savings', value: 2400 },
        { source: 'Sponsorships', target: 'Salaries', value: 2000 },
        { source: 'Sponsorships', target: 'Tools', value: 900 },
        { source: 'Newsletter', target: 'Tools', value: 600 },
        { source: 'Newsletter', target: 'Savings', value: 1100 }
      ]}
      formatValue={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
      height={300}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Monthly income by source flowing to spend')
};

export const Onboarding = {
  name: 'Drop-off between steps',
  parameters: { docs: { description: { story: 'Onboarding paths: each step flows on or out, so the widths show where new writers leave.' } } },
  render: () => (
    <SankeyChart
      title='First week of new writers'
      ariaLabel='New writers moving through onboarding'
      links={[
        { source: 'Signed up', target: 'Wrote a draft', value: 820 },
        { source: 'Signed up', target: 'Left', value: 380 },
        { source: 'Wrote a draft', target: 'Published', value: 510 },
        { source: 'Wrote a draft', target: 'Left', value: 310 }
      ]}
      height={260}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'New writers moving through onboarding')
};
