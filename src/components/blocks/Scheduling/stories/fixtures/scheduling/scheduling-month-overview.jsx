'use client';
import { useState } from 'react';
import { ScheduleCalendar, dayKey } from '@gaudi/design-system/blocks/Scheduling';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import {
  ToggleGroupRoot as ToggleGroup,
  ToggleGroupItem
} from '@gaudi/design-system/core/ToggleGroup';
import { cn } from '@gaudi/design-system/utilities/cn';

const portrait = (path) => `/avatars/${path}.svg`;
const dot = { info: 'bg-info', warning: 'bg-warning', discovery: 'bg-discovery', success: 'bg-success', attention: 'bg-attention', neutral: 'bg-text-muted' };

// Events: category dots per day, with the selected day's agenda below.
const categories = { meeting: { label: 'Meetings', tone: 'info' }, deadline: { label: 'Deadlines', tone: 'warning' }, social: { label: 'Social', tone: 'discovery' } };
const events = [
  { day: '2026-10-05', time: '10:00', title: 'Sprint kickoff', category: 'meeting', people: ['person-20', 'person-41', 'person-24'] },
  { day: '2026-10-09', time: '17:00', title: 'Launch checklist due', category: 'deadline', people: ['person-45'] },
  { day: '2026-10-14', time: '09:30', title: 'Design critique', category: 'meeting', people: ['person-07', 'person-43'] },
  { day: '2026-10-14', time: '12:00', title: 'Team lunch', category: 'social', people: ['person-14', 'person-50', 'person-23', 'person-41'] },
  { day: '2026-10-14', time: '18:00', title: 'Release notes due', category: 'deadline', people: ['person-20'] },
  { day: '2026-10-21', time: '15:00', title: 'Customer advisory board', category: 'meeting', people: ['person-45', 'person-24'] },
  { day: '2026-10-23', time: '19:00', title: 'Autumn party', category: 'social', people: ['person-07', 'person-43', 'person-14'] },
  { day: '2026-10-30', time: '12:00', title: 'Quarter close', category: 'deadline', people: ['person-50'] }
];

// Attendance: one status per working day, summarised as bar rows.
const attendanceStatus = { office: { label: 'Office', tone: 'success' }, remote: { label: 'Remote', tone: 'info' }, leave: { label: 'Leave', tone: 'attention' } };
const attendance = {
  '2026-10-01': 'office', '2026-10-02': 'remote', '2026-10-05': 'office', '2026-10-06': 'office', '2026-10-07': 'remote',
  '2026-10-08': 'office', '2026-10-09': 'leave', '2026-10-12': 'office', '2026-10-13': 'remote', '2026-10-14': 'office',
  '2026-10-15': 'office', '2026-10-16': 'remote', '2026-10-19': 'leave', '2026-10-20': 'leave', '2026-10-21': 'office'
};

function Chips({ label, options, value, onValueChange }) {
  return (
    <ToggleGroup aria-label={label} type='multiple' variant='outline' size='xs' value={value} onValueChange={onValueChange} className='flex-wrap'>
      {Object.entries(options).map(([key, option]) => (
        <ToggleGroupItem key={key} value={key} className='gap-1.5'>
          <span aria-hidden='true' className={cn('size-2 rounded-full', dot[option.tone])} />
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export function Pattern() {
  const [mode, setMode] = useState('events');
  const [date, setDate] = useState(new Date(2026, 9, 14));
  const [shown, setShown] = useState(Object.keys(categories));
  const [statuses, setStatuses] = useState(Object.keys(attendanceStatus));
  const visible = events.filter((event) => shown.includes(event.category));
  const markers =
    mode === 'events'
      ? visible.reduce((all, event) => ({ ...all, [event.day]: [...(all[event.day] || []), categories[event.category].tone] }), {})
      : Object.fromEntries(Object.entries(attendance).filter(([, status]) => statuses.includes(status)).map(([day, status]) => [day, [attendanceStatus[status].tone]]));
  const days = Object.values(attendance);
  return (
    <div className='@container bg-surface grid min-w-0 w-full max-w-sm grid-cols-1 gap-3 rounded-lg border p-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h3 className='font-medium'>October</h3>
        <ToggleGroup aria-label='View' type='single' variant='outline' size='xs' spacing={0} value={mode} onValueChange={(next) => setMode(next || mode)}>
          <ToggleGroupItem value='events'>Events</ToggleGroupItem>
          <ToggleGroupItem value='attendance'>Attendance</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {mode === 'events' ? (
        <Chips label='Event categories' options={categories} value={shown} onValueChange={setShown} />
      ) : (
        <Chips label='Attendance statuses' options={attendanceStatus} value={statuses} onValueChange={setStatuses} />
      )}
      <ScheduleCalendar
        mode='single'
        required
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2026, 9, 1)}
        markers={markers}
        markerLabel={(tones) => (mode === 'events' ? `${tones.length} ${tones.length === 1 ? 'event' : 'events'}` : 'attendance recorded')}
        className='mx-auto p-0 [--cell-size:min(--spacing(10),calc(100cqw/7))]'
      />
      {mode === 'events' ? (
        <ul className='grid gap-2 border-t pt-3'>
          {visible.filter((event) => event.day === dayKey(date)).map((event) => (
            <li key={event.title} className='flex items-center gap-2.5 text-sm'>
              <span aria-hidden='true' className={cn('h-8 w-1 rounded-full', dot[categories[event.category].tone])} />
              <div className='min-w-0 flex-1'>
                <p className='truncate font-medium'>{event.title}</p>
                <p className='text-text-muted text-xs tabular-nums'>
                  {event.time} · {categories[event.category].label}
                </p>
              </div>
              <AvatarGroup>
                {event.people.slice(0, 3).map((person) => (
                  <Avatar key={person} className='size-6'>
                    <AvatarImage src={portrait(person)} alt='' />
                    <AvatarFallback>·</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
            </li>
          ))}
          {!visible.some((event) => event.day === dayKey(date)) ? <li className='text-text-muted text-sm'>No events on this day.</li> : null}
        </ul>
      ) : (
        <dl className='grid gap-2 border-t pt-3 text-sm'>
          {Object.entries(attendanceStatus).map(([key, status]) => {
            const count = days.filter((day) => day === key).length;
            return (
              <div key={key} className='grid grid-cols-[4.5rem_1fr_2rem] items-center gap-2'>
                <dt className='text-text-muted'>{status.label}</dt>
                <dd className='bg-surface-muted h-2 overflow-hidden rounded-full'>
                  <span className={cn('block h-full rounded-full', dot[status.tone])} style={{ width: `${(count / days.length) * 100}%` }} />
                </dd>
                <dd className='text-end font-medium tabular-nums'>{count}d</dd>
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );
}
