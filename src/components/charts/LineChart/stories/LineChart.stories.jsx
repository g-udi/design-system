import { PlaygroundExample, ComparisonExample, SteppedExample, LocalisedExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chartsMeta, focusPlot, readout, ready } from '../../stories/story-helpers.jsx';
import { LineChart } from '../index.js';

// Newsletter subscribers per month, with the projection to year end.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/LineChart',
  id: 'charts-linechart',
  tags: ['autodocs'],
  ...chartsMeta('LineChart', { component: LineChart, controls: { curve: [ 'monotone', 'linear', 'step' ], showDots: 'boolean', showGrid: 'boolean', showLegend: 'boolean' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Newsletter subscribers', description: 'Actuals to June, then the projection at the current growth rate.', height: 300, curve: 'monotone', showDots: true, showGrid: true, showLegend: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Actual subscribers and a dashed projection that starts where the actuals end. `curve` picks smooth, straight or stepped lines and `showDots` the point markers. Use the arrow keys on the plot to read each month.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await focusPlot(canvasElement, 'Newsletter subscribers per month');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Jan: Subscribers 1,280/));
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Sep:.*Projected 2,740/));
  }
};

// p50 and p95 page response time per day, in milliseconds.

export const Comparison = {
  name: 'Compare percentiles with an annotation',
  parameters: { docs: { description: { story: 'Two series on one scale with a service-level objective line and a note on the Wednesday deploy that slowed the tail. `formatValue` adds the unit everywhere: axis, tooltip, readout and table.' } } },
  render: ComparisonExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Median and p95 response time per day');
    await expect(within(canvasElement).getAllByRole('cell', { name: '890 ms' }).length).toBeGreaterThan(0);
  }
};

export const Stepped = {
  name: 'Stepped line without markers',
  parameters: { docs: { description: { story: 'Deploys per week as a stepped line, which reads counts that change between periods more honestly than a smooth curve. `showDots={false}` keeps a dense series calm.' } } },
  render: SteppedExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Deploys per week')
};

export const Localised = {
  name: 'Locale formatting',
  parameters: { docs: { description: { story: 'The same series in German: `locale` and `formatValue` reformat ticks, tooltip, readout and table together, so a dashboard follows its reader.' } } },
  render: LocalisedExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Monthly revenue in euros');
    await expect(within(canvasElement).getByRole('cell', { name: /^18\.241\s€$/ })).toBeInTheDocument();
  }
};
