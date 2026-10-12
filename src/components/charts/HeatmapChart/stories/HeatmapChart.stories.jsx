import { PlaygroundExample, DivergingExample, CalendarExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, userEvent, waitFor } from 'storybook/test';
import { chartsMeta, focusPlot, readout, ready } from '../../stories/story-helpers.jsx';
import { HeatmapChart } from '../index.js';

// Readers by day of week and hour.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/HeatmapChart',
  id: 'charts-heatmapchart',
  tags: ['autodocs'],
  ...chartsMeta('HeatmapChart', { component: HeatmapChart, controls: { scale: [ 'sequential', 'diverging' ], showValues: 'boolean', midpoint: 'number' }, primary: () => Playground, wide: true , source: exampleSource })
};

export const Playground = {
  argTypes: { midpoint: { if: { arg: 'scale', eq: 'diverging' } } },
  args: { title: 'When people read', description: 'Readers per three-hour window, by day of week.', height: 300, scale: 'sequential', showValues: true, midpoint: 0, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Cells `{ x, y, value }` on the sequential ramp. The arrow keys move along a row and Up and Down change row; each cell names its row and column in the readout and table.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready' || args.scale !== 'sequential') return;
    await focusPlot(canvasElement, 'Readers by day and time');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Mon · 06:00: Readers 12/));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Tue · 06:00:/));
  }
};

export const Diverging = {
  name: 'Change on a diverging scale',
  parameters: { docs: { description: { story: 'Week-on-week change in signups per channel and day, centred on zero: gains and losses use the two sides of the diverging scale.' } } },
  render: DivergingExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Week-on-week change in signups by channel and day')
};

export const Calendar = {
  name: 'Calendar of publishing days',
  parameters: { docs: { description: { story: 'Posts published per day over four weeks, laid out as a calendar with explicit row and column order and values hidden in the cells.' } } },
  render: CalendarExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Posts published per day over four weeks')
};
