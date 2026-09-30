'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '../../../../src/components/core/Popover/parts/hover-card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const releases = [
  {
    version: 'v3.2.0',
    date: 'Feb 5, 2026',
    tag: 'Latest',
    tagVariant: 'success',
    description:
      'Added real-time collaboration cursors, improved markdown editor performance, and fixed PDF export layout issues.'
  },
  {
    version: 'v3.1.4',
    date: 'Jan 22, 2026',
    tag: 'Patch',
    tagVariant: 'destructive',
    description:
      'Resolved a memory leak in the dashboard widgets, patched a security vulnerability in file uploads.'
  },
  {
    version: 'v3.1.0',
    date: 'Jan 10, 2026',
    tag: 'Minor',
    tagVariant: 'info',
    description:
      'Introduced API rate limiting dashboard, added webhook retry configuration, and new audit log filters.'
  },
  {
    version: 'v3.0.0',
    date: 'Dec 15, 2025',
    tag: 'Major',
    tagVariant: 'warning',
    description:
      'Complete UI redesign with new component library, migrated to edge runtime, and added multi-tenant workspace support.'
  }
];
export function Pattern() {
  const [current, setCurrent] = useState(0);
  const handleNext = () => {
    if (current < releases.length - 1) {
      setCurrent(current + 1);
    }
  };
  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };
  const isFirst = current === 0;
  const isLast = current === releases.length - 1;
  const release = releases[current];
  return (
    <div className='flex min-h-[100px] items-center justify-center'>
      <HoverCard openDelay={100} closeDelay={200}>
        <HoverCardTrigger className='text-ui-primary cursor-default text-sm font-medium underline decoration-dashed decoration-1 underline-offset-4'>
          What&apos;s new?
        </HoverCardTrigger>
        <HoverCardContent className='w-72 space-y-1 px-3 pt-3 pb-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>{release.version}</span>
              <Badge variant={release.tagVariant} size='xs'>
                {release.tag}
              </Badge>
            </div>
            <span className='text-ui-muted-foreground'>{release.date}</span>
          </div>
          <p className='text-ui-muted-foreground leading-relaxed'>
            {release.description}
          </p>
          <div className='flex items-center justify-between'>
            <div className='flex gap-1'>
              {releases.map((_, i) => (
                <span
                  key={i}
                  className={`size-1.5 rounded-full transition-colors ${i === current ? 'bg-ui-primary' : 'bg-ui-muted-foreground/30'}`}
                />
              ))}
            </div>
            <div className='flex gap-0.5'>
              <Button
                aria-label='Previous release'
                className='size-6'
                disabled={isFirst}
                onClick={handlePrev}
                size='icon'
                variant='ghost'
              >
                <RegistryIcon
                  lucide='ArrowLeftIcon'
                  className='size-3.5'
                  aria-hidden='true'
                />
              </Button>
              <Button
                aria-label='Next release'
                className='size-6'
                disabled={isLast}
                onClick={handleNext}
                size='icon'
                variant='ghost'
              >
                <RegistryIcon
                  lucide='ArrowRightIcon'
                  className='size-3.5'
                  aria-hidden='true'
                />
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
