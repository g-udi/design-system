// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useId, useState } from 'react';
import { format } from 'date-fns';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const id = useId();
  const [date, setDate] = useState();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className='group/pick-date w-60 justify-between'
          id={id}
          variant='outline'
        >
          <span className={cn('truncate', !date && 'text-ui-muted-foreground')}>
            {date ? format(date, 'PPP') : 'Pick a date'}
          </span>
          <RegistryIcon
            lucide='CalendarIcon'
            aria-hidden='true'
            className='opacity-60 transition-opacity group-hover/pick-date:opacity-100'
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-auto p-0'>
        <Calendar mode='single' onSelect={setDate} selected={date} />
      </PopoverContent>
    </Popover>
  );
}
