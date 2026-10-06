import { PlaygroundExample, PrecomputedExample, RegionsExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, within } from 'storybook/test';
import { chartsMeta, ready } from '../../stories/story-helpers.jsx';
import { BoxPlotChart } from '../index.js';

// Page load time in milliseconds, sampled per template.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/BoxPlotChart',
  id: 'charts-boxplotchart',
  tags: ['autodocs'],
  ...chartsMeta('BoxPlotChart', { component: BoxPlotChart, controls: { unit: 'text' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Load time by template', description: 'Median, quartiles, whiskers at 1.5 × IQR and slow outliers.', height: 300, unit: 'ms', showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Distributions side by side. Pass raw `values` per group and the chart computes the five-number summary and outliers, or pass precomputed `min`, `q1`, `median`, `q3`, `max` and `outliers`.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Page load time distribution by template');
    await expect(within(canvasElement).getByRole('rowheader', { name: 'Search' })).toBeInTheDocument();
  }
};

export const Precomputed = {
  name: 'Precomputed summaries',
  parameters: { docs: { description: { story: 'Summaries already computed by the analytics backend: pass the five numbers and outliers directly instead of raw samples.' } } },
  render: PrecomputedExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Essay length distribution by section')
};

export const Regions = {
  name: 'Regions with a custom colour',
  parameters: { docs: { description: { story: 'Response time per region in one palette colour, with the median and quartiles read out by the arrow keys.' } } },
  render: RegionsExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'API response time distribution by region')
};
