'use client';
import { useState } from 'react';
import { ScheduleCalendar, dayKey } from '../../../../src/components/blocks/Scheduling/Scheduling.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const portrait = (path) => `/avatars/${path}.jpg`;
const statuses = {
  confirmed: { label: 'Confirmed', variant: 'success-light', tone: 'success' },
  tentative: { label: 'Tentative', variant: 'warning-light', tone: 'warning' },
  cancelled: { label: 'Cancelled', variant: 'destructive-light', tone: 'danger' }
};
// Agenda by day; the calendar dots come from the same data.
const agenda = {
  '2026-10-13': [
    { time: '10:00', end: '10:30', title: 'Roadmap sync', place: 'Zoom', status: 'confirmed', people: ['women/44', 'men/32'] }
  ],
  '2026-10-14': [
    { time: '09:00', end: '09:15', title: 'Daily standup', place: 'Room 2A', status: 'confirmed', people: ['women/44', 'men/32', 'women/68'] },
    { time: '11:30', end: '12:30', title: 'Design review: onboarding', place: 'Figma', status: 'tentative', people: ['men/49', 'women/12'] },
    { time: '14:00', end: '14:45', title: 'Customer call with Contoso', place: 'Google Meet', status: 'confirmed', people: ['women/65'] },
    { time: '16:00', end: '16:30', title: 'Hiring debrief', place: 'Room 4C', status: 'cancelled', people: ['men/41', 'women/23'] }
  ],
  '2026-10-16': [
    { time: '13:00', end: '14:00', title: 'Quarterly planning', place: 'Main hall', status: 'tentative', people: ['women/68', 'men/75'] }
  ]
};
const markers = Object.fromEntries(Object.entries(agenda).map(([day, events]) => [day, events.map((event) => statuses[event.status].tone)]));

export function Pattern() {
  const [date, setDate] = useState(new Date(2026, 9, 14));
  const [filter, setFilter] = useState('all');
  const events = (agenda[dayKey(date)] || []).filter((event) => filter === 'all' || event.status === filter);
  return (
    <div className='bg-surface grid w-full max-w-3xl overflow-hidden rounded-lg border md:grid-cols-[auto_1fr]'>
      <ScheduleCalendar
        mode='single'
        required
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2026, 9, 1)}
        markers={markers}
        className='border-b p-3 md:border-e md:border-b-0'
      />
      <div className='grid content-start gap-3 p-4'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <h3 className='font-medium'>
            {date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          <ToggleGroup aria-label='Filter by status' type='single' variant='outline' size='xs' spacing={0} value={filter} onValueChange={(next) => setFilter(next || filter)}>
            <ToggleGroupItem value='all'>All</ToggleGroupItem>
            {Object.entries(statuses).map(([key, status]) => (
              <ToggleGroupItem key={key} value={key}>
                {status.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        {events.length ? (
          <ul className='grid gap-2'>
            {events.map((event) => (
              <li key={event.title} className='grid grid-cols-[3.5rem_1fr] gap-3 rounded-md border p-3'>
                <div className='text-sm tabular-nums'>
                  <p className='font-medium'>{event.time}</p>
                  <p className='text-text-muted text-xs'>{event.end}</p>
                </div>
                <div className='grid min-w-0 gap-1.5'>
                  <div className='flex items-start justify-between gap-2'>
                    <p className={event.status === 'cancelled' ? 'text-text-muted text-sm font-medium line-through' : 'text-sm font-medium'}>{event.title}</p>
                    <Badge variant={statuses[event.status].variant} size='sm'>
                      {statuses[event.status].label}
                    </Badge>
                  </div>
                  <div className='text-text-muted flex items-center justify-between gap-2 text-xs'>
                    <span className='inline-flex items-center gap-1'>
                      <RegistryIcon lucide='MapPinIcon' aria-hidden='true' className='size-3.5' />
                      {event.place}
                    </span>
                    <AvatarGroup>
                      {event.people.map((person) => (
                        <Avatar key={person} className='size-5'>
                          <AvatarImage src={portrait(person)} alt='' />
                          <AvatarFallback>·</AvatarFallback>
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-text-muted rounded-md border border-dashed p-6 text-center text-sm'>Nothing scheduled{filter === 'all' ? '' : ` with this status`}.</p>
        )}
      </div>
    </div>
  );
}
