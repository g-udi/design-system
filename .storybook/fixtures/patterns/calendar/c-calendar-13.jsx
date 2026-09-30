'use client';
import { useEffect, useRef, useState } from 'react';
import {
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfYear,
  format,
  isAfter,
  isBefore,
  startOfYear
} from 'date-fns';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import { ScrollArea } from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const today = /* @__PURE__ */ new Date();
  const [month, setMonth] = useState(today);
  const [date, setDate] = useState(today);
  const [isYearView, setIsYearView] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const startYear = today.getFullYear() - 10;
  const endYear = today.getFullYear() + 10;
  const startDate = startOfYear(new Date(startYear, 0));
  const endDate = endOfYear(new Date(endYear, 11));
  const years = eachYearOfInterval({
    end: endOfYear(endDate),
    start: startOfYear(startDate)
  });
  return (
    <Card className='p-0'>
      <CardContent className='p-0'>
        <Calendar
          classNames={{
            month_caption: 'ms-2.5 justify-start',
            nav: 'flex items-center w-full absolute inset-x-0 justify-end pointer-events-none [&>button]:pointer-events-auto'
          }}
          components={{
            CaptionLabel: (props) => (
              <CaptionLabel
                isYearView={isYearView}
                setIsYearView={(val) => {
                  setIsYearView(val);
                  if (!val) setSelectedYear(null);
                }}
                {...props}
              />
            ),
            MonthGrid: (props) => {
              return (
                <MonthGrid
                  className={props.className}
                  currentMonth={month.getMonth()}
                  currentYear={month.getFullYear()}
                  endDate={endDate}
                  isYearView={isYearView}
                  onMonthSelect={(selectedMonth) => {
                    setMonth(selectedMonth);
                    setIsYearView(false);
                    setSelectedYear(null);
                  }}
                  setIsYearView={setIsYearView}
                  startDate={startDate}
                  years={years}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                >
                  {props.children}
                </MonthGrid>
              );
            }
          }}
          defaultMonth={/* @__PURE__ */ new Date()}
          endMonth={endDate}
          mode='single'
          month={month}
          onMonthChange={setMonth}
          onSelect={setDate}
          selected={date}
          startMonth={startDate}
        />
      </CardContent>
    </Card>
  );
}
function MonthGrid({
  className,
  children,
  isYearView,
  years,
  currentYear,
  currentMonth,
  onMonthSelect,
  selectedYear,
  setSelectedYear,
  startDate,
  endDate
}) {
  const scrollAreaRef = useRef(null);
  useEffect(() => {
    if (isYearView && scrollAreaRef.current) {
      const activeElement = scrollAreaRef.current.querySelector(
        "[data-active='true']"
      );
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'center' });
      }
    }
  }, [isYearView, selectedYear]);
  return (
    <div className='relative'>
      <table className={className}>{children}</table>
      {isYearView && (
        <div className='bg-ui-background absolute inset-0 z-20 -m-2'>
          <div className='h-full' ref={scrollAreaRef}>
            <ScrollArea className='h-full'>
              <div className='px-3 pt-1 pb-3'>
                {selectedYear === null ? (
                  <div className='grid grid-cols-4 gap-2'>
                    {years.map((year) => {
                      const y = year.getFullYear();
                      const isCurrent = y === currentYear;
                      return (
                        <Button
                          key={y}
                          variant={isCurrent ? 'default' : 'outline'}
                          size='sm'
                          className='h-8'
                          data-active={isCurrent}
                          onClick={() => setSelectedYear(y)}
                        >
                          {y}
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                      <Button
                        aria-label='Show options'
                        variant='ghost'
                        size='sm'
                        className='px-2'
                        onClick={() => setSelectedYear(null)}
                      >
                        <RegistryIcon
                          lucide='ChevronDownIcon'
                          className='mr-1 size-4 rotate-90'
                        />
                        {selectedYear}
                      </Button>
                    </div>
                    <div className='grid grid-cols-3 gap-2'>
                      {eachMonthOfInterval({
                        start: startOfYear(new Date(selectedYear, 0)),
                        end: endOfYear(new Date(selectedYear, 0))
                      }).map((month) => {
                        const isCurrent =
                          month.getMonth() === currentMonth &&
                          selectedYear === currentYear;
                        const isDisabled =
                          isBefore(month, startOfYear(startDate)) ||
                          isAfter(month, endOfYear(endDate));
                        return (
                          <Button
                            key={month.getTime()}
                            variant={isCurrent ? 'default' : 'outline'}
                            size='sm'
                            className='h-8'
                            data-active={isCurrent}
                            disabled={isDisabled}
                            onClick={() => onMonthSelect(month)}
                          >
                            {format(month, 'MMM')}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
function CaptionLabel({ children, isYearView, setIsYearView }) {
  return (
    <Button
      aria-label='Show options'
      className='data-[state=open]:text-ui-muted-foreground -ms-2 flex items-center gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180'
      data-state={isYearView ? 'open' : 'closed'}
      onClick={() => setIsYearView((prev) => !prev)}
      size='sm'
      variant='ghost'
    >
      {children}
      <RegistryIcon
        lucide='ChevronDownIcon'
        aria-hidden='true'
        className='text-ui-muted-foreground shrink-0 transition-transform duration-200'
      />
    </Button>
  );
}
