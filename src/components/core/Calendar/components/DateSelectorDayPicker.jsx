'use client';
import { useCallback } from 'react';
import { useIsMobile } from '../../../../hooks/environment/use-mobile.js';
import { cn } from '../../../../utilities/cn/index.js';
import { Calendar, CalendarDayButton } from '../Calendar.jsx';
import { useDateSelectorContext } from '../DateSelectorContext.jsx';
function DateSelectorDayPicker({
  currentMonth,
  selectedDate,
  selectedEndDate,
  onDayClick,
  isRange,
  onDayHover,
  hoverDate,
  showTwoMonths = true,
  weekStartsOn,
  className
}) {
  const { i18n } = useDateSelectorContext();
  const isMobile = useIsMobile();
  const selected = isRange
    ? selectedDate && selectedEndDate
      ? { from: selectedDate, to: selectedEndDate }
      : selectedDate
        ? { from: selectedDate, to: hoverDate || selectedDate }
        : void 0
    : selectedDate;
  const handleSelect = (_selection, triggerDate) => {
    // DayPicker sorts range endpoints; the selector needs the actual activated
    // day to distinguish an earlier end date from the existing start.
    if (triggerDate) onDayClick(triggerDate);
  };
  const CustomDayButton = useCallback(
    (props) => {
      return (
        <CalendarDayButton
          {...props}
          onMouseEnter={() => {
            if (isRange && onDayHover && props.day) {
              onDayHover(props.day.date);
            }
          }}
          onMouseLeave={() => {
            if (isRange && onDayHover) {
              onDayHover(void 0);
            }
          }}
        />
      );
    },
    [isRange, onDayHover]
  );
  const formatters = {
    formatWeekdayName: (date) => {
      const dayIndex = date.getDay();
      return i18n.weekdaysShort[dayIndex] || i18n.weekdays[dayIndex];
    },
    formatMonthCaption: (date) => {
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      return `${i18n.months[monthIndex]} ${year}`;
    }
  };
  // Two months share the width; a single month keeps its square cells at their natural size.
  const twoMonths = !isMobile && showTwoMonths;
  const monthClassNames = {
    months: cn('flex w-full flex-wrap items-start gap-5', twoMonths ? 'justify-between' : 'justify-center'),
    month: cn('flex min-w-0 flex-col items-center', twoMonths && 'flex-1'),
    nav: 'hidden'
  };
  return (
    <div className={cn('flex w-full items-center justify-between', className)}>
      <Calendar
        month={currentMonth}
        mode={isRange ? 'range' : 'single'}
        selected={selected}
        onSelect={handleSelect}
        numberOfMonths={twoMonths ? 2 : 1}
        showOutsideDays
        weekStartsOn={weekStartsOn}
        formatters={formatters}
        className='w-full shrink-0 p-0'
        classNames={monthClassNames}
        components={{ DayButton: CustomDayButton }}
      />
    </div>
  );
}
export { DateSelectorDayPicker };
