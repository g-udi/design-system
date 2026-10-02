import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chartsMeta, forcedState, focusPlot, readout, ready, stateData } from '../story-helpers.jsx';
import { ComposedChart } from './index.js';

// Views per week with the average minutes read, on its own right-hand axis.
const weeks = [
  { label: 'W1', views: 4210, readTime: 4.2 },
  { label: 'W2', views: 4680, readTime: 4.6 },
  { label: 'W3', views: 6120, readTime: 3.8 },
  { label: 'W4', views: 5340, readTime: 5.1 },
  { label: 'W5', views: 5890, readTime: 5.4 },
  { label: 'W6', views: 7020, readTime: 5.9 }
];

export default {
  title: 'Charts/ComposedChart',
  id: 'charts-composedchart',
  tags: ['autodocs'],
  ...chartsMeta('ComposedChart', { component: ComposedChart, controls: { showGrid: 'boolean', showLegend: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Views and time on page', description: 'Weekly views as bars; average minutes read as a line on the right-hand axis.', height: 300, showGrid: true, showLegend: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Two measures in different units on one category axis. Each series names its `type` (bar, line or area); `axis: "right"` gives a series its own scale, so minutes do not flatten against thousands of views.' },
      source: {
        language: 'jsx',
        code: `import { ComposedChart } from '@gaudi/design-system/charts';

<ComposedChart
  title='Views and time on page'
  ariaLabel='Weekly views and average minutes read'
  data={weeks}
  series={[
    { key: 'views', label: 'Views', type: 'bar' },
    { key: 'readTime', label: 'Minutes read', type: 'line', axis: 'right' }
  ]}
/>`
      }
    }
  },
  render: ({ state, ...args }) => (
    <ComposedChart
      {...args}
      ariaLabel='Weekly views and average minutes read'
      data={stateData(state, weeks)}
      series={[{ key: 'views', label: 'Views', type: 'bar' }, { key: 'readTime', label: 'Minutes read', type: 'line', axis: 'right' }]}
      state={forcedState(state)}
    />
  ),
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await focusPlot(canvasElement, 'Weekly views and average minutes read');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('W1: Views 4,210, Minutes read 4.2'));
  }
};

// Signups per day with the 7-day rolling average and the campaign window.
const signups = [ 42, 38, 51, 47, 63, 58, 44, 71, 96, 88, 74, 69, 61, 57 ].map((value, index, all) => {
  const window = all.slice(Math.max(0, index - 6), index + 1);

  return { label: `Oct ${index + 1}`, signups: value, average: Math.round(window.reduce((sum, item) => sum + item, 0) / window.length) };
});

export const RollingAverage = {
  name: 'Daily values with a rolling average',
  parameters: { docs: { description: { story: 'Daily signups as bars and their 7-day rolling average as a line on the same axis, so a noisy series still shows its trend. A reference line marks the campaign launch.' } } },
  render: () => (
    <ComposedChart
      title='Newsletter signups'
      ariaLabel='Daily signups and 7-day average'
      data={signups}
      series={[{ key: 'signups', label: 'Signups', type: 'bar' }, { key: 'average', label: '7-day average', type: 'line' }]}
      references={[{ x: 'Oct 8', label: 'Campaign', tone: 'accent' }]}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Daily signups and 7-day average')
};

// Monthly recurring revenue by plan, stacked, with the churn rate on the right.
const revenue = [
  { label: 'Jan', team: 18200, pro: 9600, churn: 3.1 },
  { label: 'Feb', team: 19100, pro: 10400, churn: 2.8 },
  { label: 'Mar', team: 20400, pro: 11800, churn: 2.6 },
  { label: 'Apr', team: 21300, pro: 12100, churn: 3.4 },
  { label: 'May', team: 22900, pro: 13300, churn: 2.2 }
];

export const StackedWithRate = {
  name: 'Stacked bars with a rate line',
  parameters: { docs: { description: { story: 'Revenue by plan as stacked bars (series that share `stack`) and the churn rate as a dashed line on its own right-hand axis.' } } },
  render: () => (
    <ComposedChart
      title='Recurring revenue and churn'
      ariaLabel='Monthly recurring revenue by plan and churn rate'
      data={revenue}
      series={[
        { key: 'team', label: 'Team', type: 'bar', stack: 'plan' },
        { key: 'pro', label: 'Pro', type: 'bar', stack: 'plan' },
        { key: 'churn', label: 'Churn %', type: 'line', axis: 'right', dashed: true }
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Monthly recurring revenue by plan and churn rate');
    await expect(within(canvasElement).getAllByRole('cell', { name: '3.4' }).length).toBeGreaterThan(0);
  }
};

export const AreaBand = {
  name: 'Area behind a line',
  parameters: { docs: { description: { story: 'Capacity as a faint area with the requests served as a line in front of it, so headroom is visible at a glance. Escape clears the active point after reading.' } } },
  render: () => (
    <ComposedChart
      title='Requests against capacity'
      ariaLabel='Requests served against capacity per hour'
      data={[ 9, 10, 11, 12, 13, 14, 15, 16 ].map((hour, index) => ({ label: `${hour}:00`, capacity: 1200, served: [ 420, 610, 880, 1040, 990, 1110, 930, 760 ][index] }))}
      series={[{ key: 'capacity', label: 'Capacity', type: 'area' }, { key: 'served', label: 'Served', type: 'line' }]}
      height={260}
    />
  ),
  play: async ({ canvasElement }) => {
    await focusPlot(canvasElement, 'Requests served against capacity per hour');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(canvasElement).getByRole('group', { name: 'Requests served against capacity per hour' })).toBeInTheDocument());
  }
};
