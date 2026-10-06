import { HeatmapChart } from '@gaudi/design-system/charts/HeatmapChart';
import { forcedState } from '../../../stories/chartExamples.js';

const days = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];

const hours = [ '06', '09', '12', '15', '18', '21' ];

const readers = days.flatMap((day, row) => hours.map((hour, column) => ({
  x: `${hour}:00`,
  y: day,
  value: Math.round((row < 5 ? [ 12, 48, 36, 30, 22, 40 ] : [ 6, 18, 34, 38, 30, 52 ])[column] * (1 + row * 0.05))
})));

export const PlaygroundExample = ({ state, ...args }) => <HeatmapChart {...args} ariaLabel='Readers by day and time' data={state === 'empty' ? [] : state === 'invalid' ? [{ x: '06:00', y: 'Mon', value: 'n/a' }] : readers} valueLabel='Readers' state={forcedState(state)} />;

export const DivergingExample = () => (
    <HeatmapChart
      title='Change in signups against last week'
      ariaLabel='Week-on-week change in signups by channel and day'
      data={[ 'Search', 'Newsletter', 'Social' ].flatMap((channel, row) => days.map((day, column) => ({ x: day, y: channel, value: [ [ 12, 8, -4, 6, 14, -10, -6 ], [ 22, 18, 9, 4, -2, -8, -12 ], [ -14, -6, 3, 8, 16, 24, 18 ] ][row][column] })))}
      scale='diverging'
      midpoint={0}
      valueLabel='Change'
      height={220}
    />
  );

export const CalendarExample = () => (
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
  );
