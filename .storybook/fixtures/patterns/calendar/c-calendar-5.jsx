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
          classNames={{
            day_button: '!rounded-full'
          }}
          mode='single'
          onSelect={setDate}
          selected={date}
        />
      </CardContent>
    </Card>
  );
}
