'use client';
import { useState } from 'react';
import {
  ScheduleCalendar,
  addMinutes,
  formatDuration,
  minutesBetween,
  timeSlots
} from '../../../../src/components/blocks/Scheduling/Scheduling.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';

const times = timeSlots({ start: '08:00', end: '20:00', step: 15, duration: 0 });
const presets = [15, 30, 45, 60, 90];
const options = [
  ['video', 'Add a video link', true],
  ['notify', 'Notify attendees', true],
  ['focus', 'Block focus time after', false]
];

function TimeSelect({ id, label, value, onValueChange, after }) {
  return (
    <div className='grid gap-1.5'>
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className='w-full tabular-nums'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position='popper' className='max-h-60'>
          {times.filter((time) => !after || time > after).map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function Pattern() {
  const [date, setDate] = useState(new Date(2026, 9, 14));
  const [start, setStart] = useState('10:00');
  const [end, setEnd] = useState('10:45');
  const [repeat, setRepeat] = useState('weekly');
  const [toggles, setToggles] = useState(Object.fromEntries(options.map(([key, , on]) => [key, on])));
  const minutes = minutesBetween(start, end);
  // Moving the start keeps the meeting's length; a preset sets the end from the start.
  const moveStart = (next) => {
    setEnd(addMinutes(next, Math.max(minutes, 15)));
    setStart(next);
  };
  return (
    <div className='bg-surface grid w-full max-w-3xl overflow-hidden rounded-lg border md:grid-cols-[auto_1fr]'>
      <ScheduleCalendar mode='single' required selected={date} onSelect={setDate} defaultMonth={new Date(2026, 9, 1)} className='border-b p-3 md:border-e md:border-b-0' />
      <div className='grid content-start gap-4 p-4'>
        <div className='grid grid-cols-2 gap-3'>
          <TimeSelect id='meeting-start' label='Starts' value={start} onValueChange={moveStart} />
          <TimeSelect id='meeting-end' label='Ends' value={end} onValueChange={setEnd} after={start} />
        </div>
        <div className='grid gap-1.5'>
          <div className='flex items-baseline justify-between'>
            <span className='text-sm font-medium'>Duration</span>
            <span className='text-text-muted text-sm tabular-nums' aria-live='polite'>
              {formatDuration(minutes)}
            </span>
          </div>
          <ToggleGroup aria-label='Quick durations' type='single' variant='outline' size='sm' spacing={0} value={String(minutes)} onValueChange={(next) => next && setEnd(addMinutes(start, Number(next)))} className='w-full'>
            {presets.map((preset) => (
              <ToggleGroupItem key={preset} value={String(preset)} className='flex-1'>
                {formatDuration(preset)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className='grid gap-1.5'>
          <Label htmlFor='meeting-repeat'>Repeats</Label>
          <Select value={repeat} onValueChange={setRepeat}>
            <SelectTrigger id='meeting-repeat' className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position='popper'>
              <SelectItem value='none'>Does not repeat</SelectItem>
              <SelectItem value='daily'>Every weekday</SelectItem>
              <SelectItem value='weekly'>Weekly on {date.toLocaleDateString('en-GB', { weekday: 'long' })}</SelectItem>
              <SelectItem value='monthly'>Monthly on day {date.getDate()}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='grid gap-2.5 border-t pt-4'>
          {options.map(([key, label]) => (
            <Label key={key} className='justify-between font-normal'>
              {label}
              <Switch size='sm' checked={toggles[key]} onCheckedChange={(checked) => setToggles((current) => ({ ...current, [key]: checked }))} />
            </Label>
          ))}
        </div>
        <Button>
          Schedule for {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, {start}–{end}
        </Button>
      </div>
    </div>
  );
}
