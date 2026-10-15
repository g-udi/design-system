'use client';
import { createContext, useContext } from 'react';
import { cn } from '../../../utilities/cn';
import { Calendar, CalendarDayButton } from '../../core/Calendar/Calendar.jsx';
import { ToggleGroup, ToggleGroupItem } from '../../core/ToggleGroup/ToggleGroupPrimitives.jsx';
import { dayKey, formatTime } from './schedulingModel.js';

// Static class map keeps every tone visible to Tailwind.
const dotClass = {
  neutral: 'bg-text-muted',
  accent: 'bg-accent',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  discovery: 'bg-discovery',
  attention: 'bg-attention'
};

// ToggleGroup owns its inline style (the gap), so columns come from static classes.
const gridColumns = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };

const MarkersContext = createContext({ markers: {}, markerLabel: () => '' });

// Module-level so day buttons keep their identity (and focus) across renders.
function MarkerDayButton({ children, day, modifiers, ...props }) {
  const { markers, markerLabel } = useContext(MarkersContext);
  const tones = (!modifiers.outside && markers[dayKey(day.date)]) || [];
  return (
    <CalendarDayButton day={day} modifiers={modifiers} {...props}>
      {children}
      {tones.length ? (
        <span data-slot='schedule-markers' className='flex h-1 gap-0.5'>
          {tones.slice(0, 3).map((tone, index) => (
            <span key={index} aria-hidden='true' className={cn('size-1 rounded-full', modifiers.selected ? 'bg-current' : dotClass[tone] || dotClass.neutral)} />
          ))}
          <span className='sr-only'>, {markerLabel(tones)}</span>
        </span>
      ) : null}
    </CalendarDayButton>
  );
}

/**
 * The Core Calendar with per-day markers. `markers` maps `YYYY-MM-DD` keys (see `dayKey`)
 * to an array of tones; up to three dots show under the day and `markerLabel` names them
 * for screen readers. Every other prop goes to Calendar.
 */
export function ScheduleCalendar({ markers = {}, markerLabel = (tones) => `${tones.length} ${tones.length === 1 ? 'event' : 'events'}`, components, ...props }) {
  return (
    <MarkersContext.Provider value={{ markers, markerLabel }}>
      <Calendar components={{ DayButton: MarkerDayButton, ...components }} {...props} />
    </MarkersContext.Provider>
  );
}

/**
 * A single-choice grid of time slots on the DS ToggleGroup (radio semantics and arrow keys).
 * `slots` are `HH:MM` strings (see `timeSlots`); `unavailable` ones stay visible but disabled.
 */
export function TimeSlots({ slots = [], value, defaultValue, onValueChange, unavailable = [], hour12 = false, columns = 3, label = 'Available times', className }) {
  return (
    <ToggleGroup
      type='single'
      variant='outline'
      size='sm'
      aria-label={label}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={cn('grid w-full', gridColumns[columns] || gridColumns[3], className)}
    >
      {slots.map((slot) => (
        <ToggleGroupItem key={slot} value={slot} disabled={unavailable.includes(slot)} className='w-full tabular-nums data-disabled:line-through'>
          {formatTime(slot, hour12)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export default ScheduleCalendar;
