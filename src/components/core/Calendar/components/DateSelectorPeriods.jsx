'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
function DateSelectorPeriodGrid({
  years,
  items,
  selectedYear,
  selectedValue,
  rangeStart,
  rangeEnd,
  isInRange,
  onSelect,
  columns,
  className
}) {
  return (
    <div className={cn('w-full space-y-6', className)}>
      {years.map((year) => (
        <div key={year}>
          <div className='text-ui-muted-foreground mb-3 text-sm font-medium'>
            {year}
          </div>
          <div
            className='grid gap-2'
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
            }}
          >
            {items.map((item, index) => {
              const isSelected =
                selectedYear === year && selectedValue === index;
              const isRangeStart =
                rangeStart?.year === year && rangeStart?.value === index;
              const isRangeEnd =
                rangeEnd?.year === year && rangeEnd?.value === index;
              const inRange = isInRange(year, index);
              return (
                <DateSelectorCell
                  key={item}
                  aria-label={`${item} ${year}`}
                  selected={isSelected || isRangeStart || isRangeEnd}
                  inRange={inRange}
                  onClick={() => onSelect(year, index)}
                >
                  {item}
                </DateSelectorCell>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
// One month, quarter, half-year or year button: filled when it is an end of the selection, tinted inside a range.
function DateSelectorCell({ selected, inRange, ...props }) {
  return (
    <Button
      size='sm'
      variant={selected ? 'default' : 'outline'}
      tone={selected ? undefined : 'neutral'}
      aria-pressed={Boolean(selected || inRange)}
      className={cn(inRange && !selected && 'bg-ui-accent')}
      {...props}
    />
  );
}
function DateSelectorYearList({
  years,
  selectedYear,
  rangeStart,
  rangeEnd,
  isYearInRange,
  onSelect,
  className
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      {years.map((year) => {
        const isSelected = selectedYear === year && !rangeStart && !rangeEnd;
        const isRangeStart = rangeStart?.year === year;
        const isRangeEnd = rangeEnd?.year === year;
        const inRange = isYearInRange(year);
        return (
          <DateSelectorCell
            key={year}
            selected={isSelected || isRangeStart || isRangeEnd}
            inRange={inRange}
            onClick={() => onSelect(year)}
          >
            {year}
          </DateSelectorCell>
        );
      })}
    </div>
  );
}
export { DateSelectorPeriodGrid, DateSelectorYearList };
