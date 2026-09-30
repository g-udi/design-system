// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useRef } from 'react';
import { Scrollspy } from '../../../../src/components/core/Scrollspy/parts/scrollspy-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ScrollArea } from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
export function Pattern() {
  const parentRef = useRef(null);
  const nav = [
    {
      id: 'section-1',
      label: 'Section 1'
    },
    {
      id: 'section-2',
      label: 'Section 2'
    },
    {
      id: 'section-3',
      label: 'Section 3'
    },
    {
      id: 'section-4',
      label: 'Section 4'
    },
    {
      id: 'section-5',
      label: 'Section 5'
    }
  ];
  return (
    <div className='flex w-full min-w-0 grow flex-col gap-5 sm:flex-row'>
      <div className='flex w-[150px] flex-col gap-2'>
        <Scrollspy
          offset={50}
          targetRef={parentRef}
          className='flex flex-col gap-2.5'
        >
          {nav.map((item) => (
            <Button
              key={item.id}
              variant='outline'
              data-scrollspy-anchor={item.id}
              className={
                'data-[active=true]:bg-ui-primary data-[active=true]:text-ui-primary-foreground'
              }
            >
              {item.label}
            </Button>
          ))}
        </Scrollspy>
      </div>
      <div className='min-w-0 flex-1' ref={parentRef}>
        <ScrollArea className='h-[500px] w-full'>
          <div className='space-y-8'>
            {nav.map((item) => (
              <div key={item.id} id={item.id} className='space-y-2.5'>
                <h3 className='text-ui-foreground text-base'>{item.label}</h3>
                <div className='bg-ui-muted rounded-2xl h-[350px]' />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
