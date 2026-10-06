import { GaugeChart } from '@gaudi/design-system/charts/GaugeChart';
import { forcedState } from '../../../stories/chartExamples.js';

const scoreBands = [{ to: 50, tone: 'danger' }, { to: 90, tone: 'warning' }, { to: 100, tone: 'success' }];

export const PlaygroundExample = ({ state, value, ...args }) => (
    <div className='w-full max-w-sm'>
      <GaugeChart {...args} ariaLabel='Mobile performance score' value={state === 'invalid' ? 'fast' : value} bands={scoreBands} state={state === 'empty' ? 'empty' : forcedState(state)} />
    </div>
  );

export const BudgetExample = () => (
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
  );

export const RowExample = () => (
    <div className='grid gap-4 sm:grid-cols-3'>
      <GaugeChart title='Uptime' ariaLabel='Uptime this month' value={99.95} min={99} max={100} unit='%' bands={[{ to: 99.5, tone: 'danger' }, { to: 99.9, tone: 'warning' }, { to: 100, tone: 'success' }]} height={160} />
      <GaugeChart title='Error rate' ariaLabel='Error rate today' value={0.4} max={2} unit='%' bands={[{ to: 0.5, tone: 'success' }, { to: 1, tone: 'warning' }, { to: 2, tone: 'danger' }]} height={160} />
      <GaugeChart title='Queue depth' ariaLabel='Publishing queue depth' value={12} max={50} bands={[{ to: 20, tone: 'success' }, { to: 35, tone: 'warning' }, { to: 50, tone: 'danger' }]} height={160} />
    </div>
  );
