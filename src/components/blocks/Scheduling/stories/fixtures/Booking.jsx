import { useState } from 'react';
import { ScheduleCalendar, TimeSlots, timeSlots } from '@gaudi/design-system/blocks/Scheduling';

export const markers = { '2026-10-13': ['success'], '2026-10-14': ['success', 'warning'], '2026-10-15': ['danger'], '2026-10-16': ['success'] };

export const booked = ['10:00', '13:30'];

export function Booking({ start, end, step, duration, hour12, columns, showMarkers }) {
  const [date, setDate] = useState(new Date(2026, 9, 14));
  const [slot, setSlot] = useState('');
  return (
    <div className='bg-surface grid w-full max-w-2xl overflow-hidden rounded-lg border md:grid-cols-[auto_1fr]'>
      <ScheduleCalendar mode='single' required selected={date} onSelect={setDate} defaultMonth={new Date(2026, 9, 1)} markers={showMarkers ? markers : {}} className='border-b p-3 md:border-e md:border-b-0' />
      <div className='grid content-start gap-3 p-4'>
        <p className='text-sm font-medium'>{date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <TimeSlots slots={timeSlots({ start, end, step: Number(step), duration: Number(duration) })} unavailable={booked} hour12={hour12} columns={Number(columns)} value={slot} onValueChange={setSlot} />
      </div>
    </div>
  );
}
