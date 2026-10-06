'use client';
import { useState } from 'react';
import { BarChart } from '@gaudi/design-system/charts/BarChart';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';

const weeks = [
  { label: 'W1', views: 12840 },
  { label: 'W2', views: 15210 },
  { label: 'W3', views: 11960 },
  { label: 'W4', views: 18430 }
];
const datasets = { empty: [], error: weeks, invalid: [{ label: 'W1', views: 'pending' }], loading: weeks, ready: weeks };
// Copy for each state, in the voice of the dashboard it sits in.
const labels = {
  empty: 'No views yet. Publish a post to start the count.',
  error: 'Views could not load. Check the connection and try again.',
  invalid: 'Some weeks are still being counted, so the chart is paused.',
  loading: 'Loading views'
};

export function Pattern() {
  const [state, setState] = useState('ready');
  const [locale, setLocale] = useState('en-US');
  return (
    <div className='grid w-full max-w-3xl gap-3'>
      <div className='flex flex-wrap gap-2'>
        <ToggleGroup aria-label='Chart state' className='max-w-full flex-wrap' type='single' variant='outline' size='sm' spacing={1} value={state} onValueChange={(next) => next && setState(next)}>
          {[ 'ready', 'loading', 'empty', 'invalid', 'error' ].map((value) => <ToggleGroupItem key={value} value={value} className='capitalize'>{value}</ToggleGroupItem>)}
        </ToggleGroup>
        <ToggleGroup aria-label='Locale' type='single' variant='outline' size='sm' spacing={0} value={locale} onValueChange={(next) => next && setLocale(next)}>
          <ToggleGroupItem value='en-US'>en-US</ToggleGroupItem>
          <ToggleGroupItem value='de-DE'>de-DE</ToggleGroupItem>
          <ToggleGroupItem value='hi-IN'>hi-IN</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <BarChart
        ariaLabel='Weekly views'
        title='Weekly views'
        description='The same chart in each state, with numbers in the chosen locale.'
        data={datasets[state]}
        state={state === 'loading' || state === 'error' ? state : undefined}
        yKey='views'
        series={[{ key: 'views', label: 'Views' }]}
        labels={labels}
        locale={locale}
        formatValue={{ notation: 'compact', maximumFractionDigits: 1 }}
        showData='visible'
        height={240}
        className='my-0'
      />
    </div>
  );
}
