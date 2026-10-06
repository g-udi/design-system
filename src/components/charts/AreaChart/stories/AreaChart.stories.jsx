import { PlaygroundExample, QuotaExample, LoadingExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, within } from 'storybook/test';
import { chartsMeta, ready } from '../../stories/story-helpers.jsx';
import { AreaChart } from '../index.js';

// Daily readers over two weeks, by device.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/AreaChart',
  id: 'charts-areachart',
  tags: ['autodocs'],
  ...chartsMeta('AreaChart', { component: AreaChart, controls: { stacked: 'boolean', curve: [ 'monotone', 'linear', 'step' ], showGrid: 'boolean', showLegend: 'boolean' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Readers by device', description: 'Daily readers over the last two weeks.', height: 300, stacked: true, curve: 'monotone', showGrid: true, showLegend: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Readers per day by device. `stacked` adds the areas into the daily total; off, each area starts from zero so the shapes compare. Weekends dip on desktop and rise on mobile.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state === 'ready') await ready(canvasElement, 'Daily readers by device');
  }
};

// Storage used against the plan quota, in gigabytes.

export const Quota = {
  name: 'Usage against a quota',
  parameters: { docs: { description: { story: 'One area of storage used, with the plan limit as a reference line that warns before the quota runs out.' } } },
  render: QuotaExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Media storage used per month');
    await expect(within(canvasElement).getAllByRole('cell', { name: '8.4 GB' }).length).toBeGreaterThan(0);
  }
};

export const Loading = {
  name: 'Loading and empty states',
  parameters: { docs: { description: { story: 'The frame keeps its height while the host fetches (`state="loading"` sets aria-busy and draws a skeleton), and empty data shows copy written for the dashboard rather than an empty plot.' } } },
  render: LoadingExample,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-state="loading"]')).toHaveAttribute('aria-busy', 'true');
    await expect(within(canvasElement).getByText('No readers yet. The new site goes live on Monday.')).toBeVisible();
  }
};
