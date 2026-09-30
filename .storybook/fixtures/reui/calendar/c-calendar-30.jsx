// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useId, useState } from 'react';
import { format } from 'date-fns';
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
export function Pattern() {
  const id = useId();
  const [date, setDate] = useState(
    new Date(
      /* @__PURE__ */ new Date().getFullYear(),
      /* @__PURE__ */ new Date().getMonth(),
      12
    )
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className='group/pick-date w-60 justify-between'
          id={id}
          variant={'outline'}
        >
          <span className={cn('truncate', date && 'text-ui-muted-foreground')}>
            {date ? format(date, 'PPP') : 'Pick a date and time'}
          </span>
          <RegistryIcon
            lucide='CalendarIcon'
            aria-hidden='true'
            className='text-ui-muted-foreground group-hover:text-ui-foreground shrink-0 transition-colors'
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-auto'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
          className='p-0'
        />

        <Separator />

        <FieldGroup className='grid grid-cols-2 gap-2.5'>
          <Field className='gap-1.5'>
            <FieldLabel htmlFor='time-from'>Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id='time-from'
                type='time'
                step='1'
                defaultValue='10:30:00'
                className='appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              />
              <InputGroupAddon>
                <RegistryIcon lucide='ClockIcon' />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field className='gap-1.5'>
            <FieldLabel htmlFor='time-to'>End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id='time-to'
                type='time'
                step='1'
                defaultValue='12:30:00'
                className='appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              />
              <InputGroupAddon>
                <RegistryIcon lucide='ClockIcon' />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
}
