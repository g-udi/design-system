import { expect, within } from 'storybook/test';
import { chartsMeta, forcedState, ready } from '../story-helpers.jsx';
import { GaugeChart } from './index.js';

const scoreBands = [{ to: 50, tone: 'danger' }, { to: 90, tone: 'warning' }, { to: 100, tone: 'success' }];

export default {
  title: 'Charts/GaugeChart',
  id: 'charts-gaugechart',
  tags: ['autodocs'],
  ...chartsMeta('GaugeChart', { component: GaugeChart, controls: { value: 'number', target: 'number', min: 'number', max: 'number', label: 'text', unit: 'text' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Performance score', value: 84, target: 90, min: 0, max: 100, label: 'Lighthouse, mobile', unit: '', height: 220, showData: 'hidden', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'One reading against threshold bands, with a target tick. `bands` are ascending `{ to, tone }` stops; the value names its band in the readout and table.' },
      source: {
        language: 'jsx',
        code: `import { GaugeChart } from '@gaudi/design-system/charts';

<GaugeChart
  title='Performance score'
  ariaLabel='Mobile performance score'
  value={84}
  target={90}
  label='Lighthouse, mobile'
  bands={[{ to: 50, tone: 'danger' }, { to: 90, tone: 'warning' }, { to: 100, tone: 'success' }]}
/>`
      }
    }
  },
  render: ({ state, value, ...args }) => (
    <div className='w-full max-w-sm'>
      <GaugeChart {...args} ariaLabel='Mobile performance score' value={state === 'invalid' ? 'fast' : value} bands={scoreBands} state={state === 'empty' ? 'empty' : forcedState(state)} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    if (args.state === 'ready') await ready(canvasElement, 'Mobile performance score');
  }
};

export const Budget = {
  name: 'Spend against a monthly budget',
  parameters: { docs: { description: { story: 'A non-percentage scale: cloud spend in dollars against a $2,000 budget, formatted as currency.' } } },
  render: () => (
    <div className='w-full max-w-sm'>
      <GaugeChart
        title='Cloud spend this month'
        ariaLabel='Cloud spend against the monthly budget'
        value={1640}
        max={2000}
        target={1800}
        label='Budget $2,000'
        bands={[{ to: 1500, tone: 'success' }, { to: 1800, tone: 'warning' }, { to: 2000, tone: 'danger' }]}
        formatValue={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
        height={200}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Cloud spend against the monthly budget');
    await expect(within(canvasElement).getAllByText('$1,640').length).toBeGreaterThan(0);
  }
};

export const Row = {
  name: 'A row of readings',
  parameters: { docs: { description: { story: 'Three gauges side by side for a status page, each a separate named chart with its own unit.' } } },
  render: () => (
    <div className='grid gap-4 sm:grid-cols-3'>
      <GaugeChart title='Uptime' ariaLabel='Uptime this month' value={99.95} min={99} max={100} unit='%' bands={[{ to: 99.5, tone: 'danger' }, { to: 99.9, tone: 'warning' }, { to: 100, tone: 'success' }]} height={160} />
      <GaugeChart title='Error rate' ariaLabel='Error rate today' value={0.4} max={2} unit='%' bands={[{ to: 0.5, tone: 'success' }, { to: 1, tone: 'warning' }, { to: 2, tone: 'danger' }]} height={160} />
      <GaugeChart title='Queue depth' ariaLabel='Publishing queue depth' value={12} max={50} bands={[{ to: 20, tone: 'success' }, { to: 35, tone: 'warning' }, { to: 50, tone: 'danger' }]} height={160} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const name of [ 'Uptime this month', 'Error rate today', 'Publishing queue depth' ]) await ready(canvasElement, name);
  }
};
