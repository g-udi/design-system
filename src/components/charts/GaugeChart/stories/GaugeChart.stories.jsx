import { PlaygroundExample, BudgetExample, RowExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, within } from 'storybook/test';
import { chartsMeta, ready } from '../../stories/story-helpers.jsx';
import { GaugeChart } from '../index.js';
import { createChartFormatter } from '../../ChartFrame/chartScale.js';

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/GaugeChart',
  id: 'charts-gaugechart',
  tags: ['autodocs'],
  ...chartsMeta('GaugeChart', { component: GaugeChart, controls: { value: 'number', target: 'number', min: 'number', max: 'number', label: 'text', unit: 'text' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Performance score', value: 84, target: 90, min: 0, max: 100, label: 'Lighthouse, mobile', unit: '', height: 220, showData: 'hidden', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'One reading against threshold bands, with a target tick. `bands` are ascending `{ to, tone }` stops; the value names its band in the readout and table.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state === 'ready') await ready(canvasElement, 'Mobile performance score');
  }
};

export const Budget = {
  name: 'Spend against a monthly budget',
  parameters: { docs: { description: { story: 'A non-percentage scale: cloud spend in dollars against a $2,000 budget, formatted as currency.' } } },
  render: BudgetExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Cloud spend against the monthly budget');
    const canvas = within(canvasElement);
    const format = createChartFormatter(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    await expect(canvas.getAllByText(format(1640)).length).toBeGreaterThan(0);
    await expect(canvas.getByRole('cell', { name: format(1800), exact: true })).toBeInTheDocument();
    await expect(canvas.getByRole('cell', { name: `${format(0)} – ${format(2000)}`, exact: true })).toBeInTheDocument();
  }
};

export const Row = {
  name: 'A row of readings',
  parameters: { docs: { description: { story: 'Three gauges side by side for a status page, each a separate named chart with its own unit.' } } },
  render: RowExample,
  play: async ({ canvasElement }) => {
    for (const name of [ 'Uptime this month', 'Error rate today', 'Publishing queue depth' ]) await ready(canvasElement, name);
  }
};
