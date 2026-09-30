'use client';
import { useState } from 'react';
import { formatDateRange } from 'little-date';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Card,
  CardContent,
  CardFooter
} from '../../../../src/components/core/Card/parts/card.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const events = [
  {
    title: 'Product launch',
    start: '2026-01-24T10:00:00',
    end: '2026-01-24T11:30:00',
    colorful: 'after:bg-success'
  },
  {
    title: 'Weekly standup',
    start: '2026-01-28T13:00:00',
    end: '2026-01-28T13:30:00',
    colorful: 'after:bg-warning'
  },
  {
    title: 'Code review',
    start: '2026-01-31T15:00:00',
    end: '2026-01-31T16:00:00',
    colorful: 'after:bg-info'
  }
];
export function Pattern() {
  const [date, setDate] = useState(/* @__PURE__ */ new Date());
  return (
    <Card className='mx-auto w-fit gap-3 py-3'>
      <CardContent className='px-3'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
          className='p-0'
          required
        />
      </CardContent>
      <CardFooter className='flex flex-col items-start gap-2 border-t border-border px-3 pt-3'>
        <div className='flex w-full items-center justify-between px-1'>
          <div className='text-sm font-medium'>
            {date?.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='size-6'
            title='Add event'
          >
            <RegistryIcon lucide='PlusIcon' />
            <span className='sr-only'>Add event</span>
          </Button>
        </div>
        <div className='flex w-full flex-col gap-2'>
          {events.map((event) => (
            <div
              key={event.title}
              className={cn(
                'bg-surface-muted relative p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1',
                'rounded-md',
                'after:rounded-full',
                event.colorful
              )}
            >
              <div className='font-medium'>{event.title}</div>
              <div className='text-text-muted text-xs'>
                {formatDateRange(new Date(event.start), new Date(event.end))}
              </div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
