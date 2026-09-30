'use client';
import { useState } from 'react';
import { addDays } from 'date-fns';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
export function Pattern() {
  const today = /* @__PURE__ */ new Date();
  const selectedDay = addDays(today, -28);
  const [month, setMonth] = useState(selectedDay);
  const [date, setDate] = useState(selectedDay);
  return (
    <Card className='p-0'>
      <CardContent className='p-0'>
        <Calendar
          mode='single'
          month={month}
          onMonthChange={setMonth}
          onSelect={setDate}
          selected={date}
        />
        <Button
          className='mb-2 ml-4'
          onClick={() => {
            setDate(today);
            setMonth(today);
          }}
          size='sm'
          variant='outline'
        >
          Current today
        </Button>
      </CardContent>
    </Card>
  );
}
