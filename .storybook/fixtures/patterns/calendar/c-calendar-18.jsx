'use client';
import { useState } from 'react';
import { addDays } from 'date-fns';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Card,
  CardContent,
  CardFooter
} from '../../../../src/components/core/Card/parts/card.jsx';
export function Pattern() {
  const [date, setDate] = useState(
    new Date(/* @__PURE__ */ new Date().getFullYear(), 1, 12)
  );
  const [currentMonth, setCurrentMonth] = useState(
    new Date(
      /* @__PURE__ */ new Date().getFullYear(),
      /* @__PURE__ */ new Date().getMonth(),
      1
    )
  );
  return (
    <Card className='mx-auto w-fit max-w-[300px]' size='sm'>
      <CardContent>
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          fixedWeeks
          className='p-0 [--cell-size:--spacing(9.5)]'
        />
      </CardContent>
      <CardFooter className='grid grid-cols-2 gap-2 border-t'>
        {[
          { label: 'Today', value: 0 },
          { label: 'Tomorrow', value: 1 },
          { label: 'Week', value: 7 },
          { label: '2 weeks', value: 14 }
        ].map((preset) => (
          <Button
            key={preset.value}
            variant='outline'
            size='sm'
            onClick={() => {
              const newDate = addDays(/* @__PURE__ */ new Date(), preset.value);
              setDate(newDate);
              setCurrentMonth(
                new Date(newDate.getFullYear(), newDate.getMonth(), 1)
              );
            }}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}
