'use client';
import { useState } from 'react';
import { HistogramChart } from '../../../../src/components/charts/HistogramChart/index.js';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';

// Minutes readers spent on 60 sampled essays.
const minutes = [ 2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 13, 13, 14, 14, 15, 15, 16, 17, 18, 19, 20, 21, 22, 24, 26, 28, 31, 34, 38, 41, 47 ];
const sorted = [ ...minutes ].sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];
const p90 = sorted[Math.floor(sorted.length * 0.9)];

export function Pattern() {
  const [bins, setBins] = useState('10');
  return (
    <HistogramChart
      ariaLabel='Distribution of reading time across 60 essays'
      title='Reading time'
      description='Most essays hold readers for 5 to 15 minutes; a long tail reads to the end.'
      toolbar={
        <ToggleGroup aria-label='Bin count' type='single' variant='outline' size='sm' spacing={0} value={bins} onValueChange={(next) => next && setBins(next)}>
          <ToggleGroupItem value='5'>Coarse</ToggleGroupItem>
          <ToggleGroupItem value='10'>Fine</ToggleGroupItem>
        </ToggleGroup>
      }
      values={minutes}
      bins={Number(bins)}
      unit=' min'
      markers={[{ label: 'Median', value: median }, { label: 'p90', tone: 'warning', value: p90 }]}
      countLabel='Essays'
      className='my-0 w-full max-w-3xl'
    />
  );
}
