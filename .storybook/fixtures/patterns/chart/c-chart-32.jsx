'use client';
import { useState } from 'react';
import { FunnelChart } from '../../../../src/components/mdx/Chart/index.js';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';

const periods = {
  month: [
    { label: 'Read a post', value: 14200 },
    { label: 'Saw the signup form', value: 6900 },
    { label: 'Entered an email', value: 1640 },
    { label: 'Confirmed', value: 1210 },
    { label: 'Opened the first issue', value: 980 }
  ],
  quarter: [
    { label: 'Read a post', value: 39800 },
    { label: 'Saw the signup form', value: 17600 },
    { label: 'Entered an email', value: 3920 },
    { label: 'Confirmed', value: 2870 },
    { label: 'Opened the first issue', value: 2210 }
  ]
};

export function Pattern() {
  const [period, setPeriod] = useState('month');
  const [shape, setShape] = useState('start');
  return (
    <FunnelChart
      ariaLabel='Newsletter signup funnel'
      title='Newsletter signups'
      description='From reading a post to opening the first issue.'
      toolbar={
        <>
          <ToggleGroup aria-label='Period' type='single' variant='outline' size='sm' spacing={0} value={period} onValueChange={(next) => next && setPeriod(next)}>
            <ToggleGroupItem value='month'>30 days</ToggleGroupItem>
            <ToggleGroupItem value='quarter'>Quarter</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup aria-label='Layout' type='single' variant='outline' size='sm' spacing={0} value={shape} onValueChange={(next) => next && setShape(next)}>
            <ToggleGroupItem value='start'>Bars</ToggleGroupItem>
            <ToggleGroupItem value='center'>Funnel</ToggleGroupItem>
          </ToggleGroup>
        </>
      }
      data={periods[period]}
      align={shape}
      valueLabel='People'
      className='my-0 w-full max-w-2xl'
    />
  );
}
