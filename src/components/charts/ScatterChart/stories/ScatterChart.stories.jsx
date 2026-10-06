import { PlaygroundExample, WithReferencesExample, BubblesExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chartsMeta, focusPlot, readout, ready } from '../../stories/story-helpers.jsx';
import { ScatterChart } from '../index.js';

// Essays by length and average minutes read.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/ScatterChart',
  id: 'charts-scatterchart',
  tags: ['autodocs'],
  ...chartsMeta('ScatterChart', { component: ScatterChart, controls: { showGrid: 'boolean' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Length and reading time', description: 'Each essay by word count and the minutes readers spend on it.', height: 300, showGrid: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Correlation between two numbers. Points may carry a `label`, which names them in the readout, tooltip and table. The arrow keys move from point to point.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await focusPlot(canvasElement, 'Essay length against minutes read');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Notes on local-first software: Words 3,400/));
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Small tools, long lifetimes/));
  }
};

export const WithReferences = {
  name: 'Quadrants with reference lines',
  parameters: { docs: { description: { story: 'Average lines on both axes split the essays into quadrants: long and well read, long and skimmed, and so on.' } } },
  render: WithReferencesExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Essay length against minutes read, with averages')
};

// Pages by load time, conversion and traffic (bubble size).

export const Bubbles = {
  name: 'Bubbles sized by traffic',
  parameters: { docs: { description: { story: 'BubbleChart: load time against conversion, with sessions as the bubble area. Slow, busy pages stand out as large bubbles to the right.' } } },
  render: BubblesExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Load time against conversion, sized by sessions');
    await expect(within(canvasElement).getByRole('rowheader', { name: 'Changelog' })).toBeInTheDocument();
  }
};
