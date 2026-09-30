'use client';
import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const today = new Date();
const short = (date) => format(date, 'LLL d, y');
const describeRange = (range) => {
  if (!range?.from) return null;
  return range.to ? `${short(range.from)} – ${short(range.to)}` : short(range.from);
};

function PickerField({ id, label, text, placeholder, children }) {
  return (
    <Field className='gap-1.5'>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button id={id} variant='outline' className='group w-full justify-between'>
            <span className={cn('truncate', !text && 'text-text-muted')}>
              {text ?? placeholder}
            </span>
            <RegistryIcon
              lucide='CalendarIcon'
              aria-hidden='true'
              className='shrink-0 text-text-muted transition-colors group-hover:text-text'
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-auto p-0'>
          {children}
        </PopoverContent>
      </Popover>
    </Field>
  );
}

function TimeInput({ id, label, defaultValue }) {
  return (
    <Field className='gap-1.5'>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          type='time'
          defaultValue={defaultValue}
          className='appearance-none [&::-webkit-calendar-picker-indicator]:hidden'
        />
        <InputGroupAddon>
          <RegistryIcon lucide='ClockIcon' />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

export function Pattern() {
  const [due, setDue] = useState();
  const [stay, setStay] = useState({
    from: addDays(today, 7),
    to: addDays(today, 11)
  });
  const [meeting, setMeeting] = useState(addDays(today, 2));
  return (
    <FieldGroup className='mx-auto w-full max-w-64 gap-3'>
      <PickerField
        id='due-date'
        label='Due date'
        placeholder='Pick a date'
        text={due && format(due, 'PPP')}
      >
        <Calendar mode='single' selected={due} onSelect={setDue} />
      </PickerField>
      <PickerField
        id='stay'
        label='Stay'
        placeholder='Pick a date range'
        text={describeRange(stay)}
      >
        <Calendar
          mode='range'
          selected={stay}
          onSelect={setStay}
          defaultMonth={stay?.from}
          numberOfMonths={2}
          disabled={{ before: today }}
        />
      </PickerField>
      <PickerField
        id='meeting'
        label='Meeting'
        placeholder='Pick a date and time'
        text={meeting && format(meeting, 'PPP')}
      >
        <Calendar mode='single' selected={meeting} onSelect={setMeeting} />
        <Separator />
        <div className='grid grid-cols-2 gap-2 p-3'>
          <TimeInput id='meeting-start' label='Start' defaultValue='10:30' />
          <TimeInput id='meeting-end' label='End' defaultValue='11:30' />
        </div>
      </PickerField>
    </FieldGroup>
  );
}
