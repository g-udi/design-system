import { PlaygroundExample, BudgetExample, OnboardingExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, userEvent, waitFor } from 'storybook/test';
import { chartsMeta, focusPlot, readout, ready } from '../../stories/story-helpers.jsx';
import { SankeyChart } from '../index.js';

// Support tickets from channel to queue to outcome.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/SankeyChart',
  id: 'charts-sankeychart',
  tags: ['autodocs'],
  ...chartsMeta('SankeyChart', { component: SankeyChart, controls: { nodeWidth: 'number' }, primary: () => Playground, wide: true , source: exampleSource })
};

export const Playground = {
  args: { title: 'Where support tickets go', description: 'Tickets this month from channel to queue to outcome.', height: 360, nodeWidth: 10, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Flows between stages with widths proportional to volume. Stages come from the links (or `nodes`); each flow is a point for the arrow keys and a row in the data table.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
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
  render: BudgetExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Monthly income by source flowing to spend')
};

export const Onboarding = {
  name: 'Drop-off between steps',
  parameters: { docs: { description: { story: 'Onboarding paths: each step flows on or out, so the widths show where new writers leave.' } } },
  render: OnboardingExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'New writers moving through onboarding')
};
