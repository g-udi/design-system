'use client';
import { SankeyChart } from '@gaudi/design-system/charts/SankeyChart';

// Where readers arrived from, which kind of post they read, and what they did next.
const links = [
  { source: 'Search', target: 'Essays', value: 4820 },
  { source: 'Search', target: 'Notes', value: 1310 },
  { source: 'Newsletter', target: 'Essays', value: 2240 },
  { source: 'Newsletter', target: 'Notes', value: 610 },
  { source: 'Social', target: 'Essays', value: 940 },
  { source: 'Social', target: 'Notes', value: 1180 },
  { source: 'Essays', target: 'Read another', value: 2650 },
  { source: 'Essays', target: 'Subscribed', value: 840 },
  { source: 'Essays', target: 'Left', value: 4510 },
  { source: 'Notes', target: 'Read another', value: 720 },
  { source: 'Notes', target: 'Subscribed', value: 190 },
  { source: 'Notes', target: 'Left', value: 2190 }
];

export function Pattern() {
  return (
    <SankeyChart
      ariaLabel='Reader flow from source to post type to next action'
      title='Where readers go'
      description='Arrivals by source, the kind of post they read, and what happened next. Arrow keys walk each flow.'
      links={links}
      valueLabel='Readers'
      showData='toggle'
      height={360}
      className='my-0 w-full max-w-3xl'
    />
  );
}
