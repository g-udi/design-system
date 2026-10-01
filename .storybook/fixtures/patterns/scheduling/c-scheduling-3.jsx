'use client';
import { useState } from 'react';
import {
  ScheduleCalendar,
  TimeSlots,
  addMinutes,
  dayKey,
  timeSlots
} from '../../../../src/components/blocks/Scheduling/Scheduling.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ScrollArea } from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// Weekdays in October with open time; some slots on each are already booked.
const open = ['2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-27', '2026-10-28'];
const booked = { '2026-10-14': ['10:00', '13:00', '13:30'], '2026-10-15': ['09:00', '09:30', '15:00'], '2026-10-16': ['11:00'] };
const markers = Object.fromEntries(open.map((day) => [day, [booked[day]?.length > 2 ? 'warning' : 'success']]));

export function Pattern() {
  const [duration, setDuration] = useState('30');
  const [date, setDate] = useState(new Date(2026, 9, 14));
  const [slot, setSlot] = useState('');
  const minutes = Number(duration);
  const day = dayKey(date);
  return (
    <div className='bg-surface grid w-full max-w-4xl overflow-hidden rounded-lg border md:grid-cols-[14rem_auto_1fr]'>
      <div className='grid content-start gap-3 border-b p-5 md:border-e md:border-b-0'>
        <Avatar className='size-10'>
          <AvatarImage src='https://randomuser.me/api/portraits/women/44.jpg' alt='Sarah Chen' />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div>
          <p className='text-text-muted text-sm'>Sarah Chen</p>
          <h3 className='text-lg font-semibold'>Product walkthrough</h3>
        </div>
        <ul className='text-text-muted grid gap-1.5 text-sm'>
          <li className='flex items-center gap-2'>
            <RegistryIcon lucide='VideoIcon' aria-hidden='true' className='size-4' />
            Google Meet
          </li>
          <li className='flex items-center gap-2'>
            <RegistryIcon lucide='GlobeIcon' aria-hidden='true' className='size-4' />
            Europe/Berlin
          </li>
        </ul>
        <ToggleGroup aria-label='Duration' type='single' variant='outline' size='sm' spacing={0} value={duration} onValueChange={(next) => { setDuration(next || duration); setSlot(''); }}>
          {['15', '30', '60'].map((value) => (
            <ToggleGroupItem key={value} value={value}>
              {value}m
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className='border-b p-3 md:border-e md:border-b-0'>
        <ScheduleCalendar
          mode='single'
          required
          selected={date}
          onSelect={(next) => { setDate(next); setSlot(''); }}
          defaultMonth={new Date(2026, 9, 1)}
          disabled={(candidate) => !open.includes(dayKey(candidate))}
          markers={markers}
          markerLabel={(tones) => (tones[0] === 'warning' ? 'few times left' : 'times available')}
        />
      </div>
      <div className='grid content-start gap-3 p-4'>
        <p className='text-sm font-medium'>{date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
        <ScrollArea className='h-64 pe-3'>
          <TimeSlots
            columns={1}
            label={`Start times, ${minutes} minutes`}
            slots={timeSlots({ start: '09:00', end: '17:00', step: 30, duration: minutes })}
            unavailable={booked[day] || []}
            value={slot}
            onValueChange={setSlot}
          />
        </ScrollArea>
        <Button disabled={!slot} className='w-full'>
          {slot ? `Confirm ${slot}–${addMinutes(slot, minutes)}` : 'Pick a time'}
        </Button>
      </div>
    </div>
  );
}
