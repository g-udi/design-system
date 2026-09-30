'use client';
import { useEffect, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
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
        <Popover>
          <PopoverTrigger asChild>
            <button className='text-ui-foreground cursor-default underline decoration-dashed decoration-1 underline-offset-4 outline-hidden'>
              {formatDistanceToNow(referenceTime, { addSuffix: true })}
            </button>
          </PopoverTrigger>
          <PopoverContent className='w-auto max-w-86 gap-0 p-0' align='start'>
            <p className='text-ui-foreground border-b px-2 py-1 font-medium'>
              {formatDistanceToNow(referenceTime, { addSuffix: true })}
            </p>
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
          </PopoverContent>
        </Popover>{' '}
        by CI/CD pipeline.
      </p>
    </div>
  );
}
