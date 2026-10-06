'use client';
import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { default as Button } from '@gaudi/design-system/core/Button';
import { Calendar } from '@gaudi/design-system/core/Calendar';
import {
  CardRoot as Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const today = new Date();
// The next three days are fully booked; past days cannot be picked.
const booked = [1, 2, 3].map((offset) => addDays(today, offset));
// Half-hour slots from 09:00 to 17:30; a few are taken on every day.
const taken = new Set(['09:00', '09:30', '12:00', '14:30', '15:00']);
const slots = Array.from({ length: 18 }, (_, i) => {
  const minutes = 9 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
});

export function Pattern() {
  const [date, setDate] = useState(addDays(today, 4));
  const [time, setTime] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  return (
    <Card className='mx-auto w-fit max-w-full gap-0 p-0'>
      <CardHeader className='border-b border-border px-4 py-3'>
        <CardTitle>Book an appointment</CardTitle>
      </CardHeader>
      <CardContent className='flex p-0 max-sm:flex-col'>
        <Calendar
          mode='single'
          selected={date}
          defaultMonth={date}
          onSelect={(next) => {
            if (!next) return;
            setDate(next);
            setTime(null);
            setConfirmed(false);
          }}
          disabled={[{ before: today }, ...booked]}
          showOutsideDays={false}
          fixedWeeks
        />
        <div className='relative w-full max-sm:h-48 sm:w-36'>
          <div className='absolute inset-0 border-border max-sm:border-t sm:border-s'>
            <ScrollArea className='h-full'>
              <div className='flex flex-col gap-2 p-3'>
                <p className='text-sm font-medium'>{format(date, 'EEEE, d')}</p>
                <div className='grid gap-1.5 max-sm:grid-cols-3'>
                  {slots.map((slot) => (
                    <Button
                      key={slot}
                      className='w-full'
                      disabled={taken.has(slot)}
                      aria-pressed={time === slot}
                      onClick={() => { setTime(slot); setConfirmed(false); }}
                      size='sm'
                      variant={time === slot ? 'default' : 'outline'}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex flex-wrap items-center gap-3 border-t border-border px-4 py-3'>
        <p className='flex min-w-0 items-center gap-2 text-sm'>
          {time ? (
            <>
              <RegistryIcon lucide='CircleCheckIcon' className='size-4 shrink-0 text-success' />
              <span>
                {format(date, 'EEEE, MMMM d')} at <span className='font-medium'>{time}</span>
              </span>
            </>
          ) : (
            <span className='text-text-muted'>Pick a date and a free slot.</span>
          )}
        </p>
        <Button className='ms-auto' size='sm' disabled={!time || confirmed} onClick={() => setConfirmed(true)}>
          Confirm
        </Button>
        {confirmed && <p role='status' aria-label='Appointment selection' className='w-full text-sm text-text-muted'>Appointment selected for {format(date, 'MMMM d')} at {time}. This demo has not reserved a slot.</p>}
      </CardFooter>
    </Card>
  );
}
