import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chartsMeta, forcedState, focusPlot, readout, ready, stateData } from '../story-helpers.jsx';
import { LineChart } from './index.js';

// Newsletter subscribers per month, with the projection to year end.
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

export default {
  title: 'Charts/LineChart',
  id: 'charts-linechart',
  tags: ['autodocs'],
  ...chartsMeta('LineChart', { component: LineChart, controls: { curve: [ 'monotone', 'linear', 'step' ], showDots: 'boolean', showGrid: 'boolean', showLegend: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Newsletter subscribers', description: 'Actuals to June, then the projection at the current growth rate.', height: 300, curve: 'monotone', showDots: true, showGrid: true, showLegend: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Actual subscribers and a dashed projection that starts where the actuals end. `curve` picks smooth, straight or stepped lines and `showDots` the point markers. Use the arrow keys on the plot to read each month.' },
      source: {
        language: 'jsx',
        code: `import { LineChart } from '@gaudi/design-system/charts';

<LineChart
  title='Newsletter subscribers'
  ariaLabel='Newsletter subscribers per month'
  data={subscribers}
  series={[{ key: 'subscribers', label: 'Subscribers' }, { key: 'projected', label: 'Projected', dashed: true }]}
  references={[{ y: 2500, label: 'Goal', tone: 'success' }]}
  showLegend
/>`
      }
    }
  },
  render: ({ state, ...args }) => (
    <LineChart
      {...args}
      ariaLabel='Newsletter subscribers per month'
      data={stateData(state, subscribers)}
      series={[{ key: 'subscribers', label: 'Subscribers' }, { key: 'projected', label: 'Projected', dashed: true }]}
      references={[{ y: 2500, label: 'Goal', tone: 'success' }]}
      state={forcedState(state)}
    />
  ),
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await focusPlot(canvasElement, 'Newsletter subscribers per month');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Jan: Subscribers 1,280/));
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Sep:.*Projected 2,740/));
  }
};

// p50 and p95 page response time per day, in milliseconds.
const latency = [
  { label: 'Mon', p50: 182, p95: 640 },
  { label: 'Tue', p50: 176, p95: 610 },
  { label: 'Wed', p50: 214, p95: 890 },
  { label: 'Thu', p50: 198, p95: 720 },
  { label: 'Fri', p50: 171, p95: 590 },
  { label: 'Sat', p50: 158, p95: 520 },
  { label: 'Sun', p50: 162, p95: 540 }
];

export const Comparison = {
  name: 'Compare percentiles with an annotation',
  parameters: { docs: { description: { story: 'Two series on one scale with a service-level objective line and a note on the Wednesday deploy that slowed the tail. `formatValue` adds the unit everywhere: axis, tooltip, readout and table.' } } },
  render: () => (
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
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Median and p95 response time per day');
    await expect(within(canvasElement).getAllByRole('cell', { name: '890 ms' }).length).toBeGreaterThan(0);
  }
};

const deploys = [ 3, 5, 4, 7, 6, 9, 8, 11, 10, 12, 14, 13 ].map((value, index) => ({ label: `W${index + 1}`, value }));

export const Stepped = {
  name: 'Stepped line without markers',
  parameters: { docs: { description: { story: 'Deploys per week as a stepped line, which reads counts that change between periods more honestly than a smooth curve. `showDots={false}` keeps a dense series calm.' } } },
  render: () => <LineChart title='Deploys per week' ariaLabel='Deploys per week' data={deploys} curve='step' showDots={false} height={240} />,
  play: async ({ canvasElement }) => ready(canvasElement, 'Deploys per week')
};

export const Localised = {
  name: 'Locale formatting',
  parameters: { docs: { description: { story: 'The same series in German: `locale` and `formatValue` reformat ticks, tooltip, readout and table together, so a dashboard follows its reader.' } } },
  render: () => (
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
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Monthly revenue in euros');
    await expect(within(canvasElement).getByRole('cell', { name: /^18\.241\s€$/ })).toBeInTheDocument();
  }
};
