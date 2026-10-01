'use client';
import { useState } from 'react';
import { WaterfallChart } from '../../../../src/components/mdx/Chart/index.js';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';

// Monthly recurring revenue from September to October, change by change.
const bridge = [
  { label: 'September', total: true, value: 48200 },
  { label: 'New plans', value: 6900 },
  { label: 'Upgrades', value: 2650 },
  { label: 'Downgrades', value: -1180 },
  { label: 'Cancelled', value: -3240 },
  { label: 'October', total: true }
];

export function Pattern() {
  const [locale, setLocale] = useState('en-GB');
  return (
    <WaterfallChart
      ariaLabel='Recurring revenue bridge from September to October'
      title='Recurring revenue'
      description='What moved monthly recurring revenue between September and October.'
      toolbar={
        <ToggleGroup aria-label='Number format' type='single' variant='outline' size='sm' spacing={0} value={locale} onValueChange={(next) => next && setLocale(next)}>
          <ToggleGroupItem value='en-GB'>English</ToggleGroupItem>
          <ToggleGroupItem value='de-DE'>Deutsch</ToggleGroupItem>
        </ToggleGroup>
      }
      data={bridge}
      locale={locale}
      formatValue={{ currency: 'EUR', maximumFractionDigits: 0, style: 'currency' }}
      changeLabel='Change'
      totalLabel='MRR'
      showData='toggle'
      className='my-0 w-full max-w-3xl'
    />
  );
}
