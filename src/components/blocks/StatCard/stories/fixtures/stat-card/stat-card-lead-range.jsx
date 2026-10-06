'use client';
import { useState } from 'react';
import { StatCard, StatMeter } from '@gaudi/design-system/blocks/StatCard';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import {
  ToggleGroupRoot as ToggleGroup,
  ToggleGroupItem
} from '@gaudi/design-system/core/ToggleGroup';

// Each range swaps the whole dataset; the card keeps its shape.
const ranges = {
  '7d': { leads: 312, delta: '4.6%', deltaDirection: 'up', deltaTone: 'success', goal: 400, returning: 118, organic: 141, paid: 53 },
  '30d': { leads: 1284, delta: '11.2%', deltaDirection: 'up', deltaTone: 'success', goal: 1500, returning: 452, organic: 590, paid: 242 },
  '90d': { leads: 3610, delta: '-2.3%', deltaDirection: 'down', deltaTone: 'danger', goal: 4500, returning: 1390, organic: 1520, paid: 700 }
};

export function Pattern() {
  const [range, setRange] = useState('30d');
  const data = ranges[range];
  return (
    <StatCard
      className='w-full max-w-sm'
      label='Leads'
      value={data.leads.toLocaleString('en-GB')}
      delta={data.delta} deltaDirection={data.deltaDirection} deltaTone={data.deltaTone}
      description={`${Math.round((data.leads / data.goal) * 100)}% of the ${data.goal.toLocaleString('en-GB')} goal`}
      action={
        <ToggleGroup aria-label='Range' type='single' variant='outline' size='xs' spacing={0} value={range} onValueChange={(next) => setRange(next || range)}>
          {Object.keys(ranges).map((key) => (
            <ToggleGroupItem key={key} value={key}>
              {key}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
    >
      <Progress value={(data.leads / data.goal) * 100} aria-label='Progress to lead goal' className='h-2' />
      <StatMeter
        className='mt-2'
        label='Where leads came from'
        formatValue={(value) => value.toLocaleString('en-GB')}
        segments={[
          { label: 'Returning', value: data.returning, tone: 'info' },
          { label: 'Organic', value: data.organic, tone: 'success' },
          { label: 'Paid', value: data.paid, tone: 'warning' }
        ]}
      />
    </StatCard>
  );
}
