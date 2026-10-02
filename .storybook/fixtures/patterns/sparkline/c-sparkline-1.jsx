'use client';
import { StatCard } from '../../../../src/components/blocks/StatCard/StatCard.jsx';
import { Sparkline } from '../../../../src/components/charts/Sparkline/index.js';

// Last 14 days for three publishing metrics; each card pairs the number with its trend.
const metrics = [
  { label: 'Readers', value: '4,210', delta: '+12%', variant: 'area', color: 'var(--ds-color-chart-1)', data: [ 2980, 3120, 3040, 3310, 3260, 3480, 3550, 3420, 3690, 3810, 3760, 3990, 4080, 4210 ] },
  { label: 'Signups', value: '96', delta: '+4%', variant: 'bar', color: 'var(--ds-color-chart-2)', reference: 80, data: [ 71, 84, 66, 90, 88, 79, 102, 74, 93, 85, 99, 91, 88, 96 ] },
  { label: 'Unsubscribes', value: '7', delta: '-30%', invert: true, variant: 'line', color: 'var(--ds-color-chart-5)', data: [ 12, 9, 14, 10, 11, 8, 9, 13, 10, 8, 9, 7, 6, 7 ] }
];

export function Pattern() {
  return (
    <div className='grid w-full max-w-4xl gap-4 sm:grid-cols-3'>
      {metrics.map((metric) => (
        <StatCard key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} invert={metric.invert} description='Last 14 days'>
          <Sparkline
            ariaLabel={`${metric.label}, last 14 days`}
            data={metric.data}
            variant={metric.variant}
            color={metric.color}
            reference={metric.reference}
            valueLabel={metric.label}
            height={44}
          />
        </StatCard>
      ))}
    </div>
  );
}
