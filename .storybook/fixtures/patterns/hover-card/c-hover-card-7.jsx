'use client';
import { useEffect, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { formatDistanceToNow } from 'date-fns';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '../../../../src/components/core/Popover/parts/hover-card.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const zones = [
  { label: 'UTC', timeZone: 'UTC' },
  { label: localZone.split('/').pop().replace('_', ' '), timeZone: localZone }
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
            <button
              type='button'
              className='cursor-default text-text underline decoration-dashed decoration-1 underline-offset-4'
            >
              {relative}
            </button>
          </HoverCardTrigger>
          <HoverCardContent className='w-auto p-0' align='start'>
            <p className='px-2 py-1 font-medium text-text'>{relative}</p>
            <Separator />
            <table className='mx-2 my-1.5 border-separate border-spacing-y-1 whitespace-nowrap'>
              <tbody>
                {zones.map(({ label, timeZone }) => (
                  <tr key={label}>
                    <td className='pr-4'>
                      <Badge variant='outline'>{label}</Badge>
                    </td>
                    <td className='pr-6'>
                      {formatIn(deployedAt, timeZone, { dateStyle: 'medium' })}
                    </td>
                    <td className='text-text-muted tabular-nums'>
                      {formatIn(deployedAt, timeZone, { timeStyle: 'medium' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </HoverCardContent>
        </HoverCard>{' '}
        by the deploy pipeline.
      </p>
    </div>
  );
}
