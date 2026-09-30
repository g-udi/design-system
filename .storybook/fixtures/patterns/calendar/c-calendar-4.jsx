'use client';
import { useState } from 'react';
import { addDays, subDays } from 'date-fns';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
export function Pattern() {
  const today = /* @__PURE__ */ new Date();
  const [date, setDate] = useState([
    subDays(today, 17),
    addDays(today, 2),
    addDays(today, 6),
    addDays(today, 8)
  ]);
  return (
    <Card className='p-0'>
      <CardContent className='p-0'>
        <Calendar mode='multiple' onSelect={setDate} selected={date} />
      </CardContent>
    </Card>
  );
}
