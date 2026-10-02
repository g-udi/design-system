import { expect, userEvent, waitFor } from 'storybook/test';
import { chartsMeta, forcedState, focusPlot, readout, ready } from '../story-helpers.jsx';
import { HeatmapChart } from './index.js';

// Readers by day of week and hour.
const days = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];
const hours = [ '06', '09', '12', '15', '18', '21' ];
const readers = days.flatMap((day, row) => hours.map((hour, column) => ({
  x: `${hour}:00`,
  y: day,
  value: Math.round((row < 5 ? [ 12, 48, 36, 30, 22, 40 ] : [ 6, 18, 34, 38, 30, 52 ])[column] * (1 + row * 0.05))
})));

export default {
  title: 'Charts/HeatmapChart',
  id: 'charts-heatmapchart',
  tags: ['autodocs'],
  ...chartsMeta('HeatmapChart', { component: HeatmapChart, controls: { scale: [ 'sequential', 'diverging' ], showValues: 'boolean', midpoint: 'number' }, primary: () => Playground, wide: true })
};

export const Playground = {
  args: { title: 'When people read', description: 'Readers per three-hour window, by day of week.', height: 300, scale: 'sequential', showValues: true, midpoint: 0, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Cells `{ x, y, value }` on the sequential ramp. The arrow keys move along a row and Up and Down change row; each cell names its row and column in the readout and table.' },
      source: {
        language: 'jsx',
        code: `import { HeatmapChart } from '@gaudi/design-system/charts';

<HeatmapChart
  title='When people read'
  ariaLabel='Readers by day and time'
  data={cells}
  valueLabel='Readers'
/>`
      }
    }
  },
  render: ({ state, ...args }) => <HeatmapChart {...args} ariaLabel='Readers by day and time' data={state === 'empty' ? [] : state === 'invalid' ? [{ x: '06:00', y: 'Mon', value: 'n/a' }] : readers} valueLabel='Readers' state={forcedState(state)} />,
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
  render: () => (
    <HeatmapChart
      title='Change in signups against last week'
      ariaLabel='Week-on-week change in signups by channel and day'
      data={[ 'Search', 'Newsletter', 'Social' ].flatMap((channel, row) => days.map((day, column) => ({ x: day, y: channel, value: [ [ 12, 8, -4, 6, 14, -10, -6 ], [ 22, 18, 9, 4, -2, -8, -12 ], [ -14, -6, 3, 8, 16, 24, 18 ] ][row][column] })))}
      scale='diverging'
      midpoint={0}
      valueLabel='Change'
      height={220}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Week-on-week change in signups by channel and day')
};

export const Calendar = {
  name: 'Calendar of publishing days',
  parameters: { docs: { description: { story: 'Posts published per day over four weeks, laid out as a calendar with explicit row and column order and values hidden in the cells.' } } },
  render: () => (
    <HeatmapChart
      title='Publishing streak'
      ariaLabel='Posts published per day over four weeks'
      data={[ 'Week 1', 'Week 2', 'Week 3', 'Week 4' ].flatMap((week, row) => days.map((day, column) => ({ x: day, y: week, value: (row * 7 + column) % 5 === 0 ? 0 : ((row + column) % 3) + 1 })))}
      xLabels={days}
      yLabels={[ 'Week 1', 'Week 2', 'Week 3', 'Week 4' ]}
      showValues={false}
      valueLabel='Posts'
      height={200}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Posts published per day over four weeks')
};
