'use client';
import { GaugeChart } from '../../../../src/components/mdx/Chart/index.js';

// Field data for the home page, scored against the public thresholds for each metric.
const vitals = [
  { label: 'Largest contentful paint', value: 2.1, max: 6, target: 2.5, unit: ' s', bands: [{ to: 2.5, tone: 'success' }, { to: 4, tone: 'warning' }, { to: 6, tone: 'danger' }] },
  { label: 'Interaction to next paint', value: 240, max: 600, target: 200, unit: ' ms', bands: [{ to: 200, tone: 'success' }, { to: 500, tone: 'warning' }, { to: 600, tone: 'danger' }] },
  { label: 'Cumulative layout shift', value: 0.04, max: 0.5, target: 0.1, bands: [{ to: 0.1, tone: 'success' }, { to: 0.25, tone: 'warning' }, { to: 0.5, tone: 'danger' }] }
];

export function Pattern() {
  return (
    <div className='grid w-full max-w-4xl gap-4 sm:grid-cols-3'>
      {vitals.map((vital) => (
        <GaugeChart
          key={vital.label}
          ariaLabel={`${vital.label} gauge`}
          title={vital.label}
          {...vital}
          label={vital.value <= vital.target ? 'Good' : vital.value <= vital.bands[1].to ? 'Needs work' : 'Poor'}
          height={170}
          className='my-0'
        />
      ))}
    </div>
  );
}
