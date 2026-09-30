// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Calendar,
  CalendarDayButton
} from '../../../../src/components/core/Calendar/parts/calendar.jsx';
function getPriceForDate(date) {
  const seed =
    date.getFullYear() * 1e4 + (date.getMonth() + 1) * 100 + date.getDate();
  const val = (seed * 9301 + 49297) % 233280;
  return Math.floor(50 + (val / 233280) * 200);
}
export function Pattern() {
  const [date, setDate] = useState(/* @__PURE__ */ new Date());
  return (
    <Calendar
      mode='single'
      selected={date}
      onSelect={setDate}
      showOutsideDays={false}
      className='rounded-lg border [--cell-size:clamp(2rem,6vw,3rem)]'
      components={{
        DayButton: ({ children, modifiers, day, ...props }) => {
          const price = getPriceForDate(day.date);
          const isGreen = price < 100;
          return (
            <CalendarDayButton day={day} modifiers={modifiers} {...props}>
              {children}
              {!modifiers.outside && (
                <span
                  className={
                    isGreen && !modifiers.selected
                      ? 'text-green-700 dark:text-green-400'
                      : ''
                  }
                >
                  ${price}
                </span>
              )}
            </CalendarDayButton>
          );
        }
      }}
    />
  );
}
