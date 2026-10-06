import { PlaygroundExample, BimodalExample, FixedDomainExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, within } from 'storybook/test';
import { chartsMeta, ready } from '../../stories/story-helpers.jsx';
import { HistogramChart } from '../index.js';

// Page weight of 48 essays in kilobytes.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/HistogramChart',
  id: 'charts-histogramchart',
  tags: ['autodocs'],
  ...chartsMeta('HistogramChart', { component: HistogramChart, controls: { bins: 'number', unit: 'text' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Page weight across essays', description: 'Kilobytes per page for 48 essays, with the budget and the median.', height: 300, bins: 10, unit: '', showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Observations in round bins: `bins` is approximate because the edges snap to round numbers. `markers` add labelled guides such as the median or a budget.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state === 'ready') await ready(canvasElement, 'Distribution of page weight across essays');
  }
};

// Session length in minutes, bimodal: quick visits and deep reads.

export const Bimodal = {
  name: 'Two kinds of visit',
  parameters: { docs: { description: { story: 'A bimodal distribution where an average would mislead: quick visits and deep reads, marked separately.' } } },
  render: BimodalExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Distribution of session length in minutes')
};

export const FixedDomain = {
  name: 'Fixed domain and count label',
  parameters: { docs: { description: { story: '`domain` pins the axis from 0 to 100 so two score histograms compare; `countLabel` names the counts in the table.' } } },
  render: FixedDomainExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Distribution of accessibility scores across pages');
    await expect(within(canvasElement).getAllByRole('columnheader', { name: 'Pages' }).length).toBeGreaterThan(0);
  }
};
