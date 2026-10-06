'use client';
import { useState } from 'react';
import { cn } from '@gaudi/design-system/utilities/cn';
import {
  Calendar,
  CalendarDayButton
} from '@gaudi/design-system/core/Calendar';
function getPriceForDate(date) {
  const seed =
    date.getFullYear() * 1e4 + (date.getMonth() + 1) * 100 + date.getDate();
  const val = (seed * 9301 + 49297) % 233280;
  return Math.floor(50 + (val / 233280) * 200);
}
export function Pattern() {
  const [date, setDate] = useState(new Date());
  return (
    <Calendar
      mode='single'
      selected={date}
      onSelect={setDate}
      showOutsideDays={false}
      className='mx-auto rounded-lg border border-border [--cell-size:clamp(2rem,6vw,3rem)] [&_td]:h-12 [&_td]:aspect-auto'
      components={{
        DayButton: ({ children, className, modifiers, day, ...props }) => {
          const price = getPriceForDate(day.date);
          const isGreen = price < 100;
          return (
            <CalendarDayButton day={day} modifiers={modifiers} {...props} className={cn(className, 'h-12 aspect-auto')}>
              {children}
              {!modifiers.outside && (
                <span
                  className={
                    isGreen && !modifiers.selected
                      ? 'text-ui-success-ink'
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
