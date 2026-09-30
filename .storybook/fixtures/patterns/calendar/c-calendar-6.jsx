'use client';
import { useState } from 'react';
import { addDays } from 'date-fns';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
export function Pattern() {
  const today = /* @__PURE__ */ new Date();
  const [date, setDate] = useState({
    from: today,
    to: addDays(today, 5)
  });
  return (
    <Card className='p-0'>
      <CardContent className='p-0'>
        <Calendar
          classNames={{
            day: 'relative before:absolute before:inset-y-px before:inset-x-0 [&.range-start:not(.range-end):before]:bg-linear-to-r before:from-transparent before:from-50% before:to-ui-accent before:to-50% [&.range-end:not(.range-start):before]:bg-linear-to-l',
            day_button:
              '!rounded-full group-[.range-start:not(.range-end)]:rounded-e-full group-[.range-end:not(.range-start)]:rounded-s-full'
          }}
          mode='range'
          onSelect={setDate}
          selected={date}
        />
      </CardContent>
    </Card>
  );
}
