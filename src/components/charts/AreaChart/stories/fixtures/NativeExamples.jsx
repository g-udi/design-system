import { AreaChart } from '@gaudi/design-system/charts/AreaChart';
import { stateData, forcedState } from '../../../stories/chartExamples.js';

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

const storage = [ 4.1, 4.6, 5.2, 5.9, 6.3, 7.1, 7.8, 8.4 ].map((value, index) => ({ label: `M${index + 1}`, value }));

export const PlaygroundExample = ({ state, ...args }) => <AreaChart {...args} ariaLabel='Daily readers by device' data={stateData(state, devices)} series={series} state={forcedState(state)} />;

export const QuotaExample = () => (
    <AreaChart
      title='Media storage'
      description='Gigabytes used at the end of each month on the 10 GB plan.'
      ariaLabel='Media storage used per month'
      data={storage}
      references={[{ y: 10, label: 'Plan limit', tone: 'danger' }, { y: 8, label: '80%', tone: 'warning' }]}
      formatValue={(value) => `${value} GB`}
      height={240}
    />
  );

export const LoadingExample = () => (
    <div className='grid gap-4 sm:grid-cols-2'>
      <AreaChart title='Readers this week' ariaLabel='Readers this week' data={devices} yKey='desktop' state='loading' height={200} />
      <AreaChart title='Readers from the new site' ariaLabel='Readers from the new site' data={[]} height={200} labels={{ empty: 'No readers yet. The new site goes live on Monday.' }} />
    </div>
  );
