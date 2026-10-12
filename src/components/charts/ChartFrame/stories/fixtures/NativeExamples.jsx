import { ChartFrame, useChartFrame, getChartColor, ChartContainer, ChartGrid, ChartXAxis, ChartYAxis, ChartReferenceLine, ChartDataTable, createChartFormatter } from '@gaudi/design-system/charts/ChartFrame';
import { BarChart as RechartsBarChart, Bar } from 'recharts';
import { useState } from 'react';
import { BarChart } from '@gaudi/design-system/charts/BarChart';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';

export const goals = [
  { label: 'Words', done: 18000, target: 24000 },
  { label: 'Notes', done: 41, target: 52 },
  { label: 'Talks', done: 3, target: 6 }
];

export const goalPoints = goals.map((goal) => ({ label: goal.label, values: [{ name: 'Done', value: goal.done }, { name: 'Target', value: goal.target }, { name: 'Progress', value: goal.done / goal.target, display: `${Math.round((goal.done / goal.target) * 100)}%` }] }));

export function GoalBars() {
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

const views = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' ].map((label, index) => ({ label, views: [ 820, 940, 1210, 1080, 760 ][index] }));

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

export const PlaygroundExample = ({ state, ...args }) => (
    <ChartFrame {...args} ariaLabel='Progress towards writing goals' points={state === 'empty' ? [] : goalPoints} status={state === 'ready' ? 'ready' : state}>
      <GoalBars />
    </ChartFrame>
  );

export const PrimitivesExample = () => (
    <ChartContainer config={{ views: { label: 'Views', color: 'var(--ds-color-chart-2)' } }} className='h-56 w-full'>
      <RechartsBarChart accessibilityLayer data={views} margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
        <ChartGrid />
        <ChartXAxis dataKey='label' />
        <ChartYAxis />
        <ChartReferenceLine y={1000} label='1k a day' tone='success' />
        <Bar dataKey='views' fill='var(--color-views)' radius={[ 4, 4, 0, 0 ]} />
      </RechartsBarChart>
    </ChartContainer>
  );

export const ToolbarExample = () => <PeriodChart />;

export const DataTableExample = () => <ChartDataTable caption='Writing goals' categoryLabel='Goal' points={goalPoints} format={createChartFormatter('en-US', { maximumFractionDigits: 0 })} />;
