'use client';
import { BubbleChart } from '../../../../src/components/mdx/Chart/index.js';

// Each essay: length, average minutes read, and shares as the bubble size.
const essays = [
  { label: 'Notes on local-first software', x: 4200, y: 17, z: 1240 },
  { label: 'Small tools, long lifetimes', x: 1800, y: 8, z: 610 },
  { label: 'Designing for real data', x: 3100, y: 14, z: 880 },
  { label: 'A practical guide to knowledge graphs', x: 5600, y: 19, z: 430 },
  { label: 'Writing that survives a reorg', x: 2400, y: 11, z: 1020 },
  { label: 'Running a calm team', x: 1500, y: 6, z: 290 },
  { label: 'Interviews worth having', x: 2900, y: 9, z: 170 },
  { label: 'A desk setup, revisited', x: 900, y: 4, z: 560 }
];

export function Pattern() {
  return (
    <BubbleChart
      ariaLabel='Essay length against minutes read, sized by shares'
      title='What holds readers'
      description='Longer essays keep readers longer; the biggest bubbles were shared most.'
      data={essays}
      xLabel='Words'
      yLabel='Minutes read'
      zLabel='Shares'
      references={[{ y: 12, label: 'Average 12 min' }]}
      showData='toggle'
      height={320}
      className='my-0 w-full max-w-3xl'
    />
  );
}
