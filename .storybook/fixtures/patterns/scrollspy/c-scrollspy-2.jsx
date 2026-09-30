'use client';
import { useRef } from 'react';
import { Scrollspy } from '../../../../src/components/core/Scrollspy/parts/scrollspy-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ScrollArea } from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';

// A product page with wrapping section tabs above the content, for layouts too narrow for a side rail.
const sections = [
  { id: 'spy-overview', label: 'Overview', body: 'A 14-inch laptop with a matte display, all-day battery and a quiet fan curve.' },
  { id: 'spy-specs', label: 'Specs', body: '16 GB memory, 1 TB storage, two USB-C ports, Wi-Fi 7 and a 1080p camera.' },
  { id: 'spy-reviews', label: 'Reviews', body: 'Rated 4.7 out of 5 across 2,184 reviews. Buyers praise the keyboard and the screen.' },
  { id: 'spy-shipping', label: 'Shipping', body: 'Free delivery in two to four days. Returns are free for 30 days.' },
  { id: 'spy-faq', label: 'FAQ', body: 'Every order includes a charger. Extended warranty adds two years of cover.' }
];

export function Pattern() {
  const targetRef = useRef(null);
  return (
    <div className='mx-auto grid w-full max-w-lg gap-3'>
      <Scrollspy offset={8} targetRef={targetRef} className='flex flex-wrap gap-1'>
        {sections.map(({ id, label }) => (
          <Button
            key={id}
            size='sm'
            variant='ghost'
            data-scrollspy-anchor={id}
            className='data-[active=true]:bg-ui-primary data-[active=true]:text-ui-primary-foreground'
          >
            {label}
          </Button>
        ))}
      </Scrollspy>
      <div ref={targetRef}>
        <ScrollArea className='h-64 rounded-2xl border border-ui-border'>
          {sections.map(({ id, label, body }) => (
            <section key={id} id={id} className='grid min-h-40 content-start gap-2 p-4 text-sm'>
              <h3 className='text-base font-semibold'>{label}</h3>
              <p className='text-ui-muted-foreground'>{body}</p>
              <div className='h-16 rounded-xl bg-ui-muted' />
            </section>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
