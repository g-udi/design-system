'use client';
import { RangeChart } from '../../../../src/components/charts/RangeChart/index.js';

// Open issues in the 2.0 release: the actual count to day 8, then a forecast band to launch.
const days = [
  { label: 'Day 1', value: 64 },
  { label: 'Day 2', value: 61 },
  { label: 'Day 3', value: 59 },
  { label: 'Day 4', value: 52 },
  { label: 'Day 5', value: 49 },
  { label: 'Day 6', value: 47 },
  { label: 'Day 7', value: 41 },
  { label: 'Day 8', value: 36, low: 36, high: 36 },
  { label: 'Day 9', low: 30, high: 35 },
  { label: 'Day 10', low: 24, high: 33 },
  { label: 'Day 11', low: 17, high: 30 },
  { label: 'Day 12', low: 11, high: 27 },
  { label: 'Day 13', low: 5, high: 24 },
  { label: 'Day 14', low: 0, high: 21 }
];

export function Pattern() {
  return (
    <RangeChart
      ariaLabel='Open issues for the 2.0 release, with the forecast to launch'
      title='Release 2.0 burn-down'
      description='Open issues so far, and the range we expect to land in by launch day.'
      data={days}
      valueLabel='Open issues'
      bandLabel='Forecast'
      references={[{ x: 'Day 8', label: 'Today', tone: 'accent' }, { y: 0, label: 'Launch ready', tone: 'success' }]}
      showData='toggle'
      height={300}
      className='my-0 w-full max-w-3xl'
    />
  );
}
