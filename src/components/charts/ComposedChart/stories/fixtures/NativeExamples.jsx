import { ComposedChart } from '@gaudi/design-system/charts/ComposedChart';
import { stateData, forcedState } from '../../../stories/chartExamples.js';

const weeks = [
  { label: 'W1', views: 4210, readTime: 4.2 },
  { label: 'W2', views: 4680, readTime: 4.6 },
  { label: 'W3', views: 6120, readTime: 3.8 },
  { label: 'W4', views: 5340, readTime: 5.1 },
  { label: 'W5', views: 5890, readTime: 5.4 },
  { label: 'W6', views: 7020, readTime: 5.9 }
];

const signups = [ 42, 38, 51, 47, 63, 58, 44, 71, 96, 88, 74, 69, 61, 57 ].map((value, index, all) => {
  const window = all.slice(Math.max(0, index - 6), index + 1);

  return { label: `Oct ${index + 1}`, signups: value, average: Math.round(window.reduce((sum, item) => sum + item, 0) / window.length) };
});

const revenue = [
  { label: 'Jan', team: 18200, pro: 9600, churn: 3.1 },
  { label: 'Feb', team: 19100, pro: 10400, churn: 2.8 },
  { label: 'Mar', team: 20400, pro: 11800, churn: 2.6 },
  { label: 'Apr', team: 21300, pro: 12100, churn: 3.4 },
  { label: 'May', team: 22900, pro: 13300, churn: 2.2 }
];

export const PlaygroundExample = ({ state, ...args }) => (
    <ComposedChart
      {...args}
      ariaLabel='Weekly views and average minutes read'
      data={stateData(state, weeks)}
      series={[{ key: 'views', label: 'Views', type: 'bar' }, { key: 'readTime', label: 'Minutes read', type: 'line', axis: 'right' }]}
      state={forcedState(state)}
    />
  );

export const RollingAverageExample = () => (
    <ComposedChart
      title='Newsletter signups'
      ariaLabel='Daily signups and 7-day average'
      data={signups}
      series={[{ key: 'signups', label: 'Signups', type: 'bar' }, { key: 'average', label: '7-day average', type: 'line' }]}
      references={[{ x: 'Oct 8', label: 'Campaign', tone: 'accent' }]}
    />
  );

export const StackedWithRateExample = () => (
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
  );

export const AreaBandExample = () => (
    <ComposedChart
      title='Requests against capacity'
      ariaLabel='Requests served against capacity per hour'
      data={[ 9, 10, 11, 12, 13, 14, 15, 16 ].map((hour, index) => ({ label: `${hour}:00`, capacity: 1200, served: [ 420, 610, 880, 1040, 990, 1110, 930, 760 ][index] }))}
      series={[{ key: 'capacity', label: 'Capacity', type: 'area' }, { key: 'served', label: 'Served', type: 'line' }]}
      height={260}
    />
  );
