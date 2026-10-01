'use client';
import { useState } from 'react';
import { TimeSlots, timeSlots } from '../../../../src/components/blocks/Scheduling/Scheduling.jsx';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// "Today" is fixed so the shortcuts read the same every time the example renders.
const today = new Date(2026, 9, 14);
const shift = (days) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
const shortcuts = [
  { label: 'Later today', hint: '17:00', date: today, time: '17:00', icon: 'SunIcon' },
  { label: 'Tomorrow morning', hint: 'Thu 09:00', date: shift(1), time: '09:00', icon: 'CoffeeIcon' },
  { label: 'Next Monday', hint: 'Mon 09:00', date: shift(5), time: '09:00', icon: 'BriefcaseIcon' },
  { label: 'In a week', hint: 'Wed 21 Oct', date: shift(7), time: '10:00', icon: 'CalendarDaysIcon' }
];
const format = (date, time) => `${date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}, ${time}`;

export function Pattern() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(shift(1));
  const [time, setTime] = useState('09:00');
  const [value, setValue] = useState(null);
  // Applying also moves the draft, so reopening shows the chosen moment.
  const apply = (nextDate, nextTime) => {
    setDate(nextDate);
    setTime(nextTime);
    setValue({ date: nextDate, time: nextTime });
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='font-normal'>
          <RegistryIcon lucide='CalendarClockIcon' aria-hidden='true' />
          {value ? format(value.date, value.time) : 'Schedule send'}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-auto p-0'>
        <div className='grid sm:grid-cols-[15rem_auto]'>
          <ul aria-label='Shortcuts' className='grid content-start gap-0.5 border-b p-2 sm:border-e sm:border-b-0'>
            {shortcuts.map((shortcut) => (
              <li key={shortcut.label}>
                <Button variant='ghost' size='sm' className='w-full justify-start font-normal' onClick={() => apply(shortcut.date, shortcut.time)}>
                  <RegistryIcon lucide={shortcut.icon} aria-hidden='true' />
                  <span className='flex-1 text-start'>{shortcut.label}</span>
                  <span className='text-text-muted text-xs'>{shortcut.hint}</span>
                </Button>
              </li>
            ))}
          </ul>
          <div className='grid gap-3 p-3'>
            <Calendar mode='single' required selected={date} onSelect={setDate} defaultMonth={today} disabled={{ before: today }} className='p-0' />
            <TimeSlots columns={4} label='Time' slots={timeSlots({ start: '08:00', end: '18:00', step: 60, duration: 0 })} value={time} onValueChange={(next) => next && setTime(next)} />
            <div className='flex justify-end gap-2 border-t pt-3'>
              <Button variant='ghost' size='sm' onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size='sm' onClick={() => apply(date, time)}>
                Schedule for {format(date, time)}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
