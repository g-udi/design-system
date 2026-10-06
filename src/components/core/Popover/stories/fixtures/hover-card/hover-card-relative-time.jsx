'use client';
import { useEffect, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { Badge } from '@gaudi/design-system/core/Pill';
import { formatDistanceToNow } from 'date-fns';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@gaudi/design-system/core/Popover';
import { Separator } from '@gaudi/design-system/core/Separator';
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const zones = [
  { label: 'UTC', timeZone: 'UTC' },
  { label: `Local (${localZone.split('/').pop().replaceAll('_', ' ')})`, timeZone: localZone }
];
const formatIn = (date, timeZone, options) =>
  new Intl.DateTimeFormat('en-US', { timeZone, ...options }).format(date);
export function Pattern() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  const deployedAt = new Date(now.getTime() - 1e3 * 60 * 120);
  const relative = formatDistanceToNow(deployedAt, { addSuffix: true });
  return (
    <div className='flex items-center justify-center'>
      <p className='text-sm text-text-muted'>
        Last deployed{' '}
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button
              variant='ghost'
              className='h-auto min-h-0 p-0 align-baseline font-normal underline decoration-dashed decoration-1 underline-offset-4'
            >
              {relative}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className='w-auto p-0' align='start'>
            <p className='px-2 py-1 font-medium text-text'>{relative}</p>
            <Separator />
            <dl className='grid gap-2 px-2 py-1.5'>
              {zones.map(({ label, timeZone }) => (
                <div key={label + timeZone} className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
                  <dt><Badge variant='outline'>{label}</Badge></dt>
                  <dd className='flex flex-wrap gap-x-4 gap-y-1'>
                    <span>{formatIn(deployedAt, timeZone, { dateStyle: 'medium' })}</span>
                    <span className='text-text-muted tabular-nums'>
                      {formatIn(deployedAt, timeZone, { timeStyle: 'medium' })}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </HoverCardContent>
        </HoverCard>{' '}
        by the deploy pipeline.
      </p>
    </div>
  );
}
