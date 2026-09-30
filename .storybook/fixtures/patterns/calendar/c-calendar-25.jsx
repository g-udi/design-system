'use client';
import { useId, useState } from 'react';
import { format } from 'date-fns';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
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
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              'Pick a date range'
            )}
          </span>
          <RegistryIcon
            lucide='CalendarIcon'
            aria-hidden='true'
            className='text-ui-muted-foreground group-hover:text-ui-foreground shrink-0 transition-colors'
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-auto p-0'>
        <Card className='p-0'>
          <CardContent className='p-0'>
            <Calendar
              mode='range'
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
