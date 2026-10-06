'use client';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  PopoverPrimitive as Popover,
  PopoverContentPrimitive as PopoverContent,
  PopoverTriggerPrimitive as PopoverTrigger
} from '@gaudi/design-system/core/Popover';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const releases = [
  {
    version: 'v3.2.0',
    date: 'Feb 5, 2026',
    tag: 'Latest',
    tone: 'success',
    description:
      'Real-time collaboration cursors, a faster markdown editor, and fixed PDF export layouts.'
  },
  {
    version: 'v3.1.4',
    date: 'Jan 22, 2026',
    tag: 'Patch',
    tone: 'destructive',
    description:
      'Fixed a memory leak in dashboard widgets and patched a file upload vulnerability.'
  },
  {
    version: 'v3.1.0',
    date: 'Jan 10, 2026',
    tag: 'Minor',
    tone: 'info',
    description:
      'A rate limiting dashboard, webhook retry settings, and new audit log filters.'
  },
  {
    version: 'v3.0.0',
    date: 'Dec 15, 2025',
    tag: 'Major',
    tone: 'warning',
    description:
      'A redesigned interface, the edge runtime, and multi-tenant workspaces.'
  }
];
export function Pattern() {
  const [current, setCurrent] = useState(0);
  const release = releases[current];
  return (
    <div className='flex items-center justify-center'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline'>
            <RegistryIcon lucide='SparklesIcon' aria-hidden='true' />
            What&apos;s new
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-72 gap-2 px-3 pt-3 pb-2' sideOffset={8}>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>{release.version}</span>
              <Badge variant={release.tone} size='xs'>
                {release.tag}
              </Badge>
            </div>
            <span className='text-text-muted'>{release.date}</span>
          </div>
          <p className='text-text-muted'>{release.description}</p>
          <div className='flex items-center justify-between'>
            <span className='text-text-muted tabular-nums' aria-live='polite'>
              {current + 1} of {releases.length}
            </span>
            <div className='flex gap-0.5'>
              <Button
                aria-label='Previous release'
                className='size-6'
                disabled={current === 0}
                onClick={() => setCurrent(current - 1)}
                size='icon'
                variant='ghost'
              >
                <RegistryIcon lucide='ArrowLeftIcon' className='size-3.5' aria-hidden='true' />
              </Button>
              <Button
                aria-label='Next release'
                className='size-6'
                disabled={current === releases.length - 1}
                onClick={() => setCurrent(current + 1)}
                size='icon'
                variant='ghost'
              >
                <RegistryIcon lucide='ArrowRightIcon' className='size-3.5' aria-hidden='true' />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
