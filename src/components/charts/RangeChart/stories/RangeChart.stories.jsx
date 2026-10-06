import { PlaygroundExample, TemperatureExample, ForecastExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, userEvent, waitFor } from 'storybook/test';
import { chartsMeta, focusPlot, readout, ready } from '../../stories/story-helpers.jsx';
import { RangeChart } from '../index.js';

// p50 response time inside its p10–p90 spread, per hour.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/RangeChart',
  id: 'charts-rangechart',
  tags: ['autodocs'],
  ...chartsMeta('RangeChart', { component: RangeChart, controls: { showGrid: 'boolean', bandLabel: 'text', valueLabel: 'text' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Response time spread', description: 'Median response time inside the 10th–90th percentile band.', height: 300, showGrid: true, bandLabel: 'p10–p90', valueLabel: 'Median', showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'A band between a low and a high value per category with a line through it. The readout and table name the band and the line with `bandLabel` and `valueLabel`.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await focusPlot(canvasElement, 'Median response time with its p10 to p90 band');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^9:00:/));
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^10:00:/));
  }
};

// Daily temperature for an event write-up: low, high and the average.

export const Temperature = {
  name: 'Daily highs and lows',
  parameters: { docs: { description: { story: 'Highs and lows around the daily average, formatted in degrees, for a conference write-up.' } } },
  render: TemperatureExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Daily temperature range in Lisbon')
};

// Forecast of weekly signups with a confidence band; actuals have no band.

export const Forecast = {
  name: 'Forecast with a widening band',
  parameters: { docs: { description: { story: 'Actual signups as a line, then a forecast band that widens with uncertainty. A reference line marks today, where the actuals end.' } } },
  render: ForecastExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Weekly signups with the forecast range')
};
