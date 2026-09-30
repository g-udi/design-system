'use client';
import { addDays } from 'date-fns';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
export function Pattern() {
  const today = /* @__PURE__ */ new Date();
  return (
    <Card className='p-0'>
      <CardContent className='p-0'>
        <Calendar
          disabled={[
            { before: /* @__PURE__ */ new Date() },
            /* @__PURE__ */ new Date(),
            { dayOfWeek: [0, 6] },
            {
              from: addDays(today, 14),
              to: addDays(today, 16)
            },
            {
              from: addDays(today, 23),
              to: addDays(today, 24)
            }
          ]}
          excludeDisabled
          mode='range'
        />
      </CardContent>
    </Card>
  );
}
