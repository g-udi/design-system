import { PlaygroundExample, RollingAverageExample, StackedWithRateExample, AreaBandExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chartsMeta, focusPlot, readout, ready } from '../../stories/story-helpers.jsx';
import { ComposedChart } from '../index.js';

// Views per week with the average minutes read, on its own right-hand axis.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/ComposedChart',
  id: 'charts-composedchart',
  tags: ['autodocs'],
  ...chartsMeta('ComposedChart', { component: ComposedChart, controls: { showGrid: 'boolean', showLegend: 'boolean' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Views and time on page', description: 'Weekly views as bars; average minutes read as a line on the right-hand axis.', height: 300, showGrid: true, showLegend: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Two measures in different units on one category axis. Each series names its `type` (bar, line or area); `axis: "right"` gives a series its own scale, so minutes do not flatten against thousands of views.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await focusPlot(canvasElement, 'Weekly views and average minutes read');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('W1: Views 4,210, Minutes read 4.2'));
  }
};

// Signups per day with the 7-day rolling average and the campaign window.

export const RollingAverage = {
  name: 'Daily values with a rolling average',
  parameters: { docs: { description: { story: 'Daily signups as bars and their 7-day rolling average as a line on the same axis, so a noisy series still shows its trend. A reference line marks the campaign launch.' } } },
  render: RollingAverageExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Daily signups and 7-day average')
};

// Monthly recurring revenue by plan, stacked, with the churn rate on the right.

export const StackedWithRate = {
  name: 'Stacked bars with a rate line',
  parameters: { docs: { description: { story: 'Revenue by plan as stacked bars (series that share `stack`) and the churn rate as a dashed line on its own right-hand axis.' } } },
  render: StackedWithRateExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Monthly recurring revenue by plan and churn rate');
    await expect(within(canvasElement).getAllByRole('cell', { name: '3.4' }).length).toBeGreaterThan(0);
  }
};

export const AreaBand = {
  name: 'Area behind a line',
  parameters: { docs: { description: { story: 'Capacity as a faint area with the requests served as a line in front of it, so headroom is visible at a glance. Escape clears the active point after reading.' } } },
  render: AreaBandExample,
  play: async ({ canvasElement }) => {
    await focusPlot(canvasElement, 'Requests served against capacity per hour');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(canvasElement).getByRole('group', { name: 'Requests served against capacity per hour' })).toBeInTheDocument());
  }
};
