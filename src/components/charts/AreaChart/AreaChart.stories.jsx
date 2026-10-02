import { expect, within } from 'storybook/test';
import { chartsMeta, forcedState, ready, stateData } from '../story-helpers.jsx';
import { AreaChart } from './index.js';

// Daily readers over two weeks, by device.
const days = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];
const devices = [ ...days, ...days ].map((day, index) => ({
  label: `${day} ${index < 7 ? 1 : 2}`,
  desktop: [ 820, 910, 980, 940, 870, 520, 480, 860, 950, 1040, 990, 910, 560, 510 ][index],
  mobile: [ 610, 640, 700, 690, 720, 830, 880, 650, 690, 740, 730, 760, 870, 940 ][index],
  tablet: [ 120, 110, 130, 140, 120, 160, 180, 130, 120, 140, 150, 130, 170, 190 ][index]
}));
const series = [
  { key: 'desktop', label: 'Desktop' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'tablet', label: 'Tablet' }
];

export default {
  title: 'Charts/AreaChart',
  id: 'charts-areachart',
  tags: ['autodocs'],
  ...chartsMeta('AreaChart', { component: AreaChart, controls: { stacked: 'boolean', curve: [ 'monotone', 'linear', 'step' ], showGrid: 'boolean', showLegend: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Readers by device', description: 'Daily readers over the last two weeks.', height: 300, stacked: true, curve: 'monotone', showGrid: true, showLegend: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Readers per day by device. `stacked` adds the areas into the daily total; off, each area starts from zero so the shapes compare. Weekends dip on desktop and rise on mobile.' },
      source: {
        language: 'jsx',
        code: `import { AreaChart } from '@gaudi/design-system/charts';

<AreaChart
  title='Readers by device'
  ariaLabel='Daily readers by device'
  data={days}
  series={[{ key: 'desktop', label: 'Desktop' }, { key: 'mobile', label: 'Mobile' }, { key: 'tablet', label: 'Tablet' }]}
  stacked
  showLegend
/>`
      }
    }
  },
  render: ({ state, ...args }) => <AreaChart {...args} ariaLabel='Daily readers by device' data={stateData(state, devices)} series={series} state={forcedState(state)} />,
  play: async ({ args, canvasElement }) => {
    if (args.state === 'ready') await ready(canvasElement, 'Daily readers by device');
  }
};

// Storage used against the plan quota, in gigabytes.
const storage = [ 4.1, 4.6, 5.2, 5.9, 6.3, 7.1, 7.8, 8.4 ].map((value, index) => ({ label: `M${index + 1}`, value }));

export const Quota = {
  name: 'Usage against a quota',
  parameters: { docs: { description: { story: 'One area of storage used, with the plan limit as a reference line that warns before the quota runs out.' } } },
  render: () => (
    <AreaChart
      title='Media storage'
      description='Gigabytes used at the end of each month on the 10 GB plan.'
      ariaLabel='Media storage used per month'
      data={storage}
      references={[{ y: 10, label: 'Plan limit', tone: 'danger' }, { y: 8, label: '80%', tone: 'warning' }]}
      formatValue={(value) => `${value} GB`}
      height={240}
    />
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Media storage used per month');
    await expect(within(canvasElement).getAllByRole('cell', { name: '8.4 GB' }).length).toBeGreaterThan(0);
  }
};

export const Loading = {
  name: 'Loading and empty states',
  parameters: { docs: { description: { story: 'The frame keeps its height while the host fetches (`state="loading"` sets aria-busy and draws a skeleton), and empty data shows copy written for the dashboard rather than an empty plot.' } } },
  render: () => (
    <div className='grid gap-4 sm:grid-cols-2'>
      <AreaChart title='Readers this week' ariaLabel='Readers this week' data={devices} yKey='desktop' state='loading' height={200} />
      <AreaChart title='Readers from the new site' ariaLabel='Readers from the new site' data={[]} height={200} labels={{ empty: 'No readers yet. The new site goes live on Monday.' }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-state="loading"]')).toHaveAttribute('aria-busy', 'true');
    await expect(within(canvasElement).getByText('No readers yet. The new site goes live on Monday.')).toBeVisible();
  }
};
