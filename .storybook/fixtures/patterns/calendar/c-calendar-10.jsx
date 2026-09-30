'use client';
import { useState } from 'react';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
export function Pattern() {
  const [date, setDate] = useState(/* @__PURE__ */ new Date());
  return (
    <Card className='p-0'>
      <CardContent className='p-0'>
        <Calendar
          components={{
            WeekNumber: ({ week, ...props }) => {
              return (
                <th {...props}>
                  <span className='text-ui-muted-foreground inline-flex size-8 items-center justify-center text-sm font-normal'>
                    {week.weekNumber}
                  </span>
                </th>
              );
            }
          }}
          fixedWeeks
          mode='single'
          onSelect={setDate}
          selected={date}
          showWeekNumber
        />
      </CardContent>
    </Card>
  );
}
