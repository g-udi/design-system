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
        <Calendar mode='range' onSelect={setDate} selected={date} />
      </CardContent>
    </Card>
  );
}
