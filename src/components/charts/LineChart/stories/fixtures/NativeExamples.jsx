import { LineChart } from '@gaudi/design-system/charts/LineChart';
import { stateData, forcedState } from '../../../stories/chartExamples.js';

const subscribers = [
  { label: 'Jan', subscribers: 1280 },
  { label: 'Feb', subscribers: 1410 },
  { label: 'Mar', subscribers: 1630 },
  { label: 'Apr', subscribers: 1720 },
  { label: 'May', subscribers: 1950 },
  { label: 'Jun', subscribers: 2210 },
  { label: 'Jul', projected: 2380 },
  { label: 'Aug', projected: 2560 },
  { label: 'Sep', projected: 2740 }
// The projection starts where the actuals end, so the two lines meet in June.
].map((item, index) => (index === 5 ? { ...item, projected: item.subscribers } : item));

const latency = [
  { label: 'Mon', p50: 182, p95: 640 },
  { label: 'Tue', p50: 176, p95: 610 },
  { label: 'Wed', p50: 214, p95: 890 },
  { label: 'Thu', p50: 198, p95: 720 },
  { label: 'Fri', p50: 171, p95: 590 },
  { label: 'Sat', p50: 158, p95: 520 },
  { label: 'Sun', p50: 162, p95: 540 }
];

const deploys = [ 3, 5, 4, 7, 6, 9, 8, 11, 10, 12, 14, 13 ].map((value, index) => ({ label: `W${index + 1}`, value }));

export const PlaygroundExample = ({ state, ...args }) => (
    <LineChart
      {...args}
      ariaLabel='Newsletter subscribers per month'
      data={stateData(state, subscribers)}
      series={[{ key: 'subscribers', label: 'Subscribers' }, { key: 'projected', label: 'Projected', dashed: true }]}
      references={[{ y: 2500, label: 'Goal', tone: 'success' }]}
      state={forcedState(state)}
    />
  );

export const ComparisonExample = () => (
    <LineChart
      title='Response time'
      description='Median and 95th percentile per day.'
      ariaLabel='Median and p95 response time per day'
      data={latency}
      series={[{ key: 'p50', label: 'Median' }, { key: 'p95', label: 'p95' }]}
      references={[{ y: 800, label: 'SLO', tone: 'danger' }]}
      annotations={[{ x: 'Wed', y: 890, label: 'Deploy 4.12', tone: 'warning' }]}
      formatValue={(value) => `${value} ms`}
      showLegend
    />
  );

export const SteppedExample = () => <LineChart title='Deploys per week' ariaLabel='Deploys per week' data={deploys} curve='step' showDots={false} height={240} />;

export const LocalisedExample = () => (
    <LineChart
      title='Umsatz pro Monat'
      ariaLabel='Monthly revenue in euros'
      data={[{ label: 'Jan', value: 18240.5 }, { label: 'Feb', value: 19810 }, { label: 'Mär', value: 21460.25 }, { label: 'Apr', value: 22975 }]}
      locale='de-DE'
      formatValue={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }}
      height={240}
      labels={{ showData: 'Daten anzeigen', hideData: 'Daten ausblenden' }}
      showData='toggle'
    />
  );
