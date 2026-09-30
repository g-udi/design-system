// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
          mode='single'
          numberOfMonths={2}
          onSelect={setDate}
          selected={date}
        />
      </CardContent>
    </Card>
  );
}
