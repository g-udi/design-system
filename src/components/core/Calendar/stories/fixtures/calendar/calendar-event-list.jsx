'use client';
import { useState } from 'react';
import { formatDateRange } from 'little-date';
import { addMinutes, isSameDay, setHours, startOfDay } from 'date-fns';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Calendar } from '@gaudi/design-system/core/Calendar';
import {
  CardRoot as Card,
  CardContent,
  CardFooter
} from '@gaudi/design-system/core/Card';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import EmptyState from '@gaudi/design-system/core/EmptyState';
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
  const [date, setDate] = useState(() => new Date(events[0].start));
  const [demoEvents, setDemoEvents] = useState(events);
  const visibleEvents = demoEvents.filter((event) => isSameDay(new Date(event.start), date));
  return (
    <Card className='mx-auto w-fit gap-3 py-3'>
      <CardContent className='px-3'>
        <Calendar
          mode='single'
          selected={date}
          defaultMonth={date}
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
            onClick={() => {
              const start = setHours(startOfDay(date), 9);
              setDemoEvents((current) => [...current, {
                title: `Demo event ${current.length - events.length + 1}`,
                start: start.toISOString(),
                end: addMinutes(start, 30).toISOString(),
                colorful: 'after:bg-info'
              }]);
            }}
          >
            <RegistryIcon lucide='PlusIcon' />
            <span className='sr-only'>Add event</span>
          </Button>
        </div>
        <div className='flex w-full flex-col gap-2'>
          {visibleEvents.length === 0 && <EmptyState title='No events for this day' description='Add a local demo event to see it here.' />}
          {visibleEvents.map((event) => (
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
        <p className='text-xs text-text-muted'>Events added here stay in this demo.</p>
      </CardFooter>
    </Card>
  );
}
