import { expect, userEvent, waitFor } from 'storybook/test';
import { chartsMeta, forcedState, focusPlot, readout, ready, stateData } from '../story-helpers.jsx';
import { RangeChart } from './index.js';

// p50 response time inside its p10–p90 spread, per hour.
const latency = [ 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ].map((hour, index) => ({
  label: `${hour}:00`,
  low: [ 92, 96, 104, 118, 126, 121, 110, 102, 98, 94 ][index],
  value: [ 148, 154, 172, 196, 214, 205, 181, 166, 158, 151 ][index],
  high: [ 260, 278, 330, 410, 452, 431, 362, 318, 290, 270 ][index]
}));

export default {
  title: 'Charts/RangeChart',
  id: 'charts-rangechart',
  tags: ['autodocs'],
  ...chartsMeta('RangeChart', { component: RangeChart, controls: { showGrid: 'boolean', bandLabel: 'text', valueLabel: 'text' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Response time spread', description: 'Median response time inside the 10th–90th percentile band.', height: 300, showGrid: true, bandLabel: 'p10–p90', valueLabel: 'Median', showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'A band between a low and a high value per category with a line through it. The readout and table name the band and the line with `bandLabel` and `valueLabel`.' },
      source: {
        language: 'jsx',
        code: `import { RangeChart } from '@gaudi/design-system/charts';

<RangeChart
  title='Response time spread'
  ariaLabel='Median response time with its p10 to p90 band'
  data={latency}
  bandLabel='p10–p90'
  valueLabel='Median'
  formatValue={(value) => \`\${value} ms\`}
/>`
      }
    }
  },
  render: ({ state, ...args }) => <RangeChart {...args} ariaLabel='Median response time with its p10 to p90 band' data={stateData(state, latency)} formatValue={(value) => `${value} ms`} state={forcedState(state)} />,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await focusPlot(canvasElement, 'Median response time with its p10 to p90 band');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^9:00:/));
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^10:00:/));
  }
};

// Daily temperature for an event write-up: low, high and the average.
const lisbon = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' ].map((label, index) => ({ label, low: [ 14, 15, 13, 16, 17 ][index], high: [ 23, 25, 21, 26, 27 ][index], value: [ 18, 20, 17, 21, 22 ][index] }));

export const Temperature = {
  name: 'Daily highs and lows',
  parameters: { docs: { description: { story: 'Highs and lows around the daily average, formatted in degrees, for a conference write-up.' } } },
  render: () => (
    <RangeChart
      title='Lisbon during the conference'
      ariaLabel='Daily temperature range in Lisbon'
      data={lisbon}
      bandLabel='Low to high'
      valueLabel='Average'
      formatValue={(value) => `${value}°C`}
      height={240}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Daily temperature range in Lisbon')
};

// Forecast of weekly signups with a confidence band; actuals have no band.
const forecast = [
  { label: 'W1', value: 410 }, { label: 'W2', value: 455 }, { label: 'W3', value: 498 },
  { label: 'W4', value: 530, low: 530, high: 530 },
  { label: 'W5', low: 520, high: 610 }, { label: 'W6', low: 540, high: 670 }, { label: 'W7', low: 556, high: 732 }
];

export const Forecast = {
  name: 'Forecast with a widening band',
  parameters: { docs: { description: { story: 'Actual signups as a line, then a forecast band that widens with uncertainty. A reference line marks today, where the actuals end.' } } },
  render: () => (
    <RangeChart
      title='Signups forecast'
      ariaLabel='Weekly signups with the forecast range'
      data={forecast}
      bandLabel='Forecast'
      valueLabel='Actual'
      references={[{ x: 'W4', label: 'Today', tone: 'accent' }]}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Weekly signups with the forecast range')
};
