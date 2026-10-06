import { PlaygroundExample, BudgetExample, SubtotalsExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, within } from 'storybook/test';
import { chartsMeta, ready } from '../../stories/story-helpers.jsx';
import { WaterfallChart } from '../index.js';

// Subscribers from one month to the next.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/WaterfallChart',
  id: 'charts-waterfallchart',
  tags: ['autodocs'],
  ...chartsMeta('WaterfallChart', { component: WaterfallChart, controls: { showGrid: 'boolean', changeLabel: 'text', totalLabel: 'text' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Subscribers in October', description: 'How September’s list became October’s.', height: 300, showGrid: true, changeLabel: 'Change', totalLabel: 'Subscribers', showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Increases and decreases between two totals. A step with `total: true` draws the running total (or its own `value`); increases and decreases use the positive and negative chart tokens.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Change in subscribers from September to October');
    await expect(within(canvasElement).getAllByRole('cell', { name: '4,815' }).length).toBeGreaterThan(0);
  }
};

// Page weight budget: from the old page to the new one.

export const Budget = {
  name: 'Performance budget bridge',
  parameters: { docs: { description: { story: 'Kilobytes saved or added by each change between two versions of a page, formatted with a unit, for a performance write-up.' } } },
  render: BudgetExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Change in page weight by optimisation');
    await expect(within(canvasElement).getAllByRole('cell', { name: '775 KB' }).length).toBeGreaterThan(0);
  }
};

export const Subtotals = {
  name: 'Subtotals inside the bridge',
  parameters: { docs: { description: { story: 'A quarterly bridge with a subtotal after each month, so the reader sees where the quarter turned.' } } },
  render: SubtotalsExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Active workspaces with monthly subtotals')
};
