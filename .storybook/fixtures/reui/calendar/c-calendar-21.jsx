// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
const now = /* @__PURE__ */ new Date();
const year = now.getFullYear();
const month = now.getMonth();
const endOfMonth = new Date(year, month + 1, 0).getDate();
const from = new Date(year, month, Math.min(6, endOfMonth));
const to = new Date(year, month, Math.min(18, endOfMonth));
export function Pattern() {
  const [date, setDate] = useState({
    from,
    to
  });
  return (
    <Card className='p-0'>
      <CardContent className='p-0'>
        <Calendar
          mode='range'
          numberOfMonths={2}
          onSelect={setDate}
          selected={date}
        />
      </CardContent>
    </Card>
  );
}
