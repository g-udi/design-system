'use client';
import { useState } from 'react';
import { BoxPlotChart } from '../../../../src/components/charts/BoxPlotChart/index.js';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';

// Server response times in milliseconds, sampled per route over the last hour.
const regions = {
  eu: [
    { label: 'Home', values: [ 92, 104, 110, 118, 121, 130, 138, 142, 151, 170, 410 ] },
    { label: 'Essay', values: [ 120, 131, 138, 149, 156, 162, 171, 188, 196, 214 ] },
    { label: 'Search', values: [ 210, 236, 248, 262, 281, 302, 318, 344, 371, 402, 890 ] },
    { label: 'Feed', values: [ 64, 70, 73, 78, 81, 86, 92, 97, 104, 112 ] },
    { label: 'Account', values: [ 150, 166, 174, 188, 203, 221, 239, 257, 610, 720 ] }
  ],
  us: [
    { label: 'Home', values: [ 128, 140, 151, 158, 166, 179, 186, 197, 214, 233 ] },
    { label: 'Essay', values: [ 156, 171, 178, 190, 203, 214, 226, 248, 260, 281, 540 ] },
    { label: 'Search', values: [ 260, 281, 299, 318, 336, 352, 371, 402, 438, 470 ] },
    { label: 'Feed', values: [ 88, 93, 99, 104, 110, 117, 121, 129, 138, 146 ] },
    { label: 'Account', values: [ 190, 204, 219, 231, 246, 262, 280, 301, 322, 344 ] }
  ]
};

export function Pattern() {
  const [region, setRegion] = useState('eu');
  return (
    <BoxPlotChart
      ariaLabel='Response time distribution by route'
      title='Response time by route'
      description='Median, middle half and whiskers per route; dots are slow outliers worth a look.'
      toolbar={
        <ToggleGroup aria-label='Region' type='single' variant='outline' size='sm' spacing={0} value={region} onValueChange={(next) => next && setRegion(next)}>
          <ToggleGroupItem value='eu'>Europe</ToggleGroupItem>
          <ToggleGroupItem value='us'>Americas</ToggleGroupItem>
        </ToggleGroup>
      }
      data={regions[region]}
      unit=' ms'
      showData='toggle'
      className='my-0 w-full max-w-3xl'
    />
  );
}
