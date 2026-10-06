import { DonutChart, PieChart } from '@gaudi/design-system/charts/DonutChart';
import { stateData, forcedState } from '../../../stories/chartExamples.js';
import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';

const traffic = [
  { label: 'Search', value: 4820 },
  { label: 'Newsletter', value: 2410 },
  { label: 'Social', value: 1360 },
  { label: 'Direct', value: 980 },
  { label: 'Referral', value: 140 },
  { label: 'Podcast', value: 90 }
];

export const plans = [
  { label: 'Free', value: 6200 },
  { label: 'Team', value: 1180 },
  { label: 'Pro', value: 420 }
];

function ControlledDonut() {
  const [ index, setIndex ] = useState(null);
  const slice = index == null ? null : plans[index];

  return (
    <div className='grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_14rem]'>
      <DonutChart title='Workspaces by plan' ariaLabel='Workspaces by plan, selectable' data={plans} selectedIndex={index} onSelect={(_, next) => setIndex(next)} centerLabel='Workspaces' height={260} />
      <div className='grid gap-1 text-sm' data-testid='plan-detail'>
        <h3 className='font-semibold'>{slice ? `${slice.label} plan` : 'All plans'}</h3>
        <p className='text-text-muted'>{slice ? `${slice.value.toLocaleString('en-US')} workspaces.` : 'Select a slice to see one plan.'}</p>
        <Button variant='ghost' tone='neutral' size='sm' className='justify-self-start' onClick={() => setIndex(null)}>Clear selection</Button>
      </div>
    </div>
  );
}

export const PlaygroundExample = ({ state, ...args }) => <DonutChart {...args} ariaLabel='Sessions by source this month' data={stateData(state, traffic)} state={forcedState(state)} />;

export const PieExample = () => <PieChart title='Workspaces by plan' ariaLabel='Workspaces by plan' data={plans} height={280} />;

export const ControlledExample = () => <ControlledDonut />;
