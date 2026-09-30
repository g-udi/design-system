// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useEffect, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { format, formatDistanceToNow } from 'date-fns';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '../../../../src/components/core/Popover/parts/hover-card.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
export function Pattern() {
  const [now, setNow] = useState(/* @__PURE__ */ new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  const referenceTime = new Date(now.getTime() - 1e3 * 60 * 120);
  return (
    <div className='flex min-h-[100px] items-center justify-center'>
      <p className='text-ui-muted-foreground text-sm'>
        Last deployed{' '}
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger className='text-ui-foreground cursor-default underline decoration-dashed decoration-1 underline-offset-4'>
            {formatDistanceToNow(referenceTime, { addSuffix: true })}
          </HoverCardTrigger>
          <HoverCardContent className='w-78 p-0'>
            <p className='text-ui-foreground px-2 py-1 font-medium'>
              {formatDistanceToNow(referenceTime, { addSuffix: true })}
            </p>
            <Separator />
            <div className='px-2 py-1.5'>
              <table>
                <tbody>
                  <tr>
                    <td className='pr-4 pb-1.5'>
                      <Badge variant='outline'>UTC</Badge>
                    </td>
                    <td className='pr-6 pb-1.5'>
                      {format(referenceTime, 'MMM d, yyyy')}
                    </td>
                    <td className='text-ui-muted-foreground pb-1.5'>
                      {format(referenceTime, 'hh:mm:ss a')}
                    </td>
                  </tr>
                  <tr>
                    <td className='pr-4'>
                      <span className='bg-ui-muted rounded px-1.5 py-0.5 font-medium'>
                        {Intl.DateTimeFormat()
                          .resolvedOptions()
                          .timeZone.split('/')
                          .pop()
                          ?.replace('_', ' ') || 'Local'}
                      </span>
                    </td>
                    <td className='pr-6'>{format(now, 'MMM d, yyyy')}</td>
                    <td className='text-ui-muted-foreground w-28'>
                      {format(now, 'hh:mm:ss a')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </HoverCardContent>
        </HoverCard>{' '}
        by CI/CD pipeline.
      </p>
    </div>
  );
}
