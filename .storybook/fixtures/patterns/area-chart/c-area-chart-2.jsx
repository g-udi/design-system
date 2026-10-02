'use client';
import { useState } from 'react';
import { AreaChart } from '../../../../src/components/charts/AreaChart/index.js';

// Unique readers and new subscribers per month, with the launch and the summer dip called out.
const months = [
  { label: 'Jan', readers: 2380, subscribers: 210 },
  { label: 'Feb', readers: 2610, subscribers: 240 },
  { label: 'Mar', readers: 3920, subscribers: 610 },
  { label: 'Apr', readers: 3340, subscribers: 380 },
  { label: 'May', readers: 3180, subscribers: 330 },
  { label: 'Jun', readers: 3050, subscribers: 300 },
  { label: 'Jul', readers: 2490, subscribers: 220 },
  { label: 'Aug', readers: 2260, subscribers: 190 },
  { label: 'Sep', readers: 3410, subscribers: 360 },
  { label: 'Oct', readers: 3720, subscribers: 420 },
  { label: 'Nov', readers: 4050, subscribers: 470 },
  { label: 'Dec', readers: 3880, subscribers: 410 }
];
const number = new Intl.NumberFormat('en-US');

export function Pattern() {
  const [pinned, setPinned] = useState(null);
  return (
    <div className='grid w-full max-w-3xl gap-3'>
      <AreaChart
        ariaLabel='Unique readers and new subscribers per month'
        title='Readers this year'
        description='Tab to the chart and use the arrow keys to read each month. Enter pins it below.'
        data={months}
        series={[{ key: 'readers', label: 'Readers' }, { key: 'subscribers', label: 'Subscribers' }]}
        showLegend
        showData='toggle'
        references={[{ y: 4000, label: 'Goal 4,000', tone: 'success' }]}
        annotations={[{ x: 'Mar', y: 3920, label: 'Launch' }, { x: 'Aug', y: 2260, label: 'Summer break', tone: 'warning' }]}
        onActivate={(point) => setPinned(point)}
        height={300}
        className='my-0'
      />
      <p aria-live='polite' className='text-sm text-text-muted' data-testid='pinned-month'>
        {pinned
          ? `${pinned.label}: ${pinned.values.map((item) => `${item.name} ${number.format(item.value)}`).join(', ')}`
          : 'No month pinned yet.'}
      </p>
    </div>
  );
}
