import { useState } from 'react';
import { Bar, BarChart as RechartsBarChart } from 'recharts';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ToggleGroup, ToggleGroupItem } from '../../core/ToggleGroup/parts/toggle-group.jsx';
import { BarChart } from '../BarChart/index.js';
import { chartsMeta, focusPlot, readout, ready } from '../story-helpers.jsx';
import { ChartContainer, ChartDataTable, ChartFrame, ChartGrid, ChartReferenceLine, ChartXAxis, ChartYAxis, createChartFormatter, getChartColor, useChartFrame } from './index.js';

// Reading goals for the year: a custom visual that only needs the frame's points.
const goals = [
  { label: 'Essays', done: 18, target: 24 },
  { label: 'Notes', done: 41, target: 52 },
  { label: 'Talks', done: 3, target: 6 }
];
const goalPoints = goals.map((goal) => ({ label: goal.label, values: [{ name: 'Done', value: goal.done }, { name: 'Target', value: goal.target }, { name: 'Progress', value: goal.done / goal.target, display: `${Math.round((goal.done / goal.target) * 100)}%` }] }));

/** A bespoke SVG: each bar carries data-chart-index so the frame's pointer and keyboard model reach it. */
function GoalBars() {
  const frame = useChartFrame();

  return (
    <svg aria-hidden='true' className='h-full w-full' viewBox='0 0 300 120' preserveAspectRatio='none'>
      {goals.map((goal, index) => {
        const y = 12 + index * 36;
        const active = frame?.activeIndex === index;

        return (
          <g key={goal.label} data-chart-index={index}>
            <rect x='0' y={y} width='300' height='20' rx='4' fill='var(--ds-color-chart-track)' />
            <rect x='0' y={y} width={300 * (goal.done / goal.target)} height='20' rx='4' fill={getChartColor(undefined, index)} fillOpacity={frame?.activeIndex == null || active ? 1 : 0.45} />
          </g>
        );
      })}
    </svg>
  );
}

export default {
  title: 'Charts/ChartFrame',
  id: 'charts-chartframe',
  tags: ['autodocs'],
  ...chartsMeta('ChartFrame', { component: ChartFrame, controls: { framed: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Writing goals', description: 'Progress towards this year’s targets.', height: 140, framed: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'The frame every chart renders in, around a custom visual. It supplies the caption, one keyboard stop with a readout, the data table built from `points`, the loading, empty, invalid and error states, and locale formatting. Mark drawn elements with `data-chart-index` and read `useChartFrame().activeIndex` to highlight the active point.' },
      source: {
        language: 'jsx',
        code: `import { ChartFrame, useChartFrame } from '@gaudi/design-system/charts';

const points = goals.map((goal) => ({
  label: goal.label,
  values: [{ name: 'Done', value: goal.done }, { name: 'Target', value: goal.target }]
}));

<ChartFrame title='Writing goals' ariaLabel='Progress towards writing goals' points={points} showData='toggle' height={140}>
  <GoalBars />
</ChartFrame>`
      }
    }
  },
  render: ({ state, ...args }) => (
    <ChartFrame {...args} ariaLabel='Progress towards writing goals' points={state === 'empty' ? [] : goalPoints} status={state === 'ready' ? 'ready' : state}>
      <GoalBars />
    </ChartFrame>
  ),
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await focusPlot(canvasElement, 'Progress towards writing goals');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Essays: Done 18, Target 24, Progress 75%'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Notes:/));
  }
};

const views = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' ].map((label, index) => ({ label, views: [ 820, 940, 1210, 1080, 760 ][index] }));

export const Primitives = {
  name: 'Recharts with Gaudi primitives',
  parameters: { docs: { description: { story: 'A bespoke Recharts chart styled by Gaudi: ChartContainer maps a config to the palette, and ChartGrid, ChartXAxis, ChartYAxis and ChartReferenceLine draw with chart tokens. Wrap it in ChartFrame when it needs the keyboard model and the data table.' } } },
  render: () => (
    <ChartContainer config={{ views: { label: 'Views', color: 'var(--ds-color-chart-2)' } }} className='h-56 w-full'>
      <RechartsBarChart accessibilityLayer data={views} margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
        <ChartGrid />
        <ChartXAxis dataKey='label' />
        <ChartYAxis />
        <ChartReferenceLine y={1000} label='1k a day' tone='success' />
        <Bar dataKey='views' fill='var(--color-views)' radius={[ 4, 4, 0, 0 ]} />
      </RechartsBarChart>
    </ChartContainer>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelectorAll('.recharts-bar-rectangle').length).toBe(5));
  }
};

function PeriodChart() {
  const [ period, setPeriod ] = useState('week');
  const data = period === 'week' ? views : [ 'W1', 'W2', 'W3', 'W4' ].map((label, index) => ({ label, views: [ 4810, 5230, 6020, 5590 ][index] }));

  return (
    <BarChart
      title='Article views'
      ariaLabel={`Article views per ${period === 'week' ? 'day' : 'week'}`}
      data={data}
      yKey='views'
      height={240}
      toolbar={(
        <ToggleGroup type='single' size='sm' variant='outline' spacing={0} aria-label='Period' value={period} onValueChange={(next) => setPeriod(next || period)}>
          <ToggleGroupItem value='week'>This week</ToggleGroupItem>
          <ToggleGroupItem value='month'>This month</ToggleGroupItem>
        </ToggleGroup>
      )}
      showData='toggle'
    />
  );
}

export const Toolbar = {
  name: 'Controls in the caption',
  parameters: { docs: { description: { story: '`toolbar` places controls beside the caption, next to the Show data toggle; here a period switch that swaps the data.' } } },
  render: () => <PeriodChart />,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Article views per day');
    await userEvent.click(within(canvasElement).getByRole('radio', { name: 'This month' }));
    await ready(canvasElement, 'Article views per week');
  }
};

export const DataTable = {
  name: 'Data table on its own',
  parameters: { docs: { description: { story: 'ChartDataTable renders the same table a chart mirrors, for a print view or an appendix. `createChartFormatter` gives it the chart’s number format.' } } },
  render: () => <ChartDataTable caption='Writing goals' categoryLabel='Goal' points={goalPoints} format={createChartFormatter('en-US', { maximumFractionDigits: 0 })} />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('rowheader', { name: 'Talks' })).toBeVisible();
    await expect(within(canvasElement).getByRole('cell', { name: '50%' })).toBeVisible();
  }
};
