'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { parse } from 'date-fns';
import { cn } from '../../../utilities/cn/index.js';
import { default as Button } from '../Button/index.js';
import { FieldInput as Input } from '../Field/index.js';
import { ScrollArea } from '../ScrollArea/ScrollArea.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { DEFAULT_DATE_SELECTOR_I18N } from './dateSelectorLabels.js';
import { DateSelectorContext } from './DateSelectorContext.jsx';
import { formatDateValue } from './dateSelectorModel.js';
import { useDateSelector } from './hooks/useDateSelector.js';
import { DateSelectorFilterToggle, DateSelectorPeriodTabs } from './components/DateSelectorControls.jsx';
import { DateSelectorDayPicker } from './components/DateSelectorDayPicker.jsx';
import { DateSelectorPeriodGrid, DateSelectorYearList } from './components/DateSelectorPeriods.jsx';
export function DateSelector({
  value,
  onChange,
  allowRange = true,
  periodTypes,
  defaultPeriodType = 'day',
  defaultFilterType = 'is',
  presetMode,
  showInput = true,
  showTwoMonths = true,
  label,
  className,
  yearRange = 10,
  baseYear,
  minYear,
  maxYear,
  i18n: i18nOverride,
  inputHint,
  dayDateFormat = 'MM/dd/yyyy',
  dayDateFormats,
  weekStartsOn
}) {
  const mergedI18n = useMemo(
    () => ({ ...DEFAULT_DATE_SELECTOR_I18N, ...i18nOverride }),
    [i18nOverride]
  );
  const selector = useDateSelector({
    value,
    onChange,
    defaultPeriodType,
    defaultFilterType,
    presetMode,
    allowRange,
    yearRange,
    baseYear,
    minYear,
    maxYear,
    periodTypes
  });
  const {
    periodType,
    filterType,
    selectedDate,
    selectedEndDate,
    calendarMonth,
    selectedYear,
    selectedMonth,
    selectedQuarter,
    selectedHalfYear,
    rangeStart,
    rangeEnd,
    hoverDate,
    years,
    currentValue,
    setPeriodType,
    setFilterType,
    setCalendarMonth,
    setHoverDate,
    clearSelection,
    handleDayClick,
    handlePeriodSelect,
    handleYearSelect,
    isInRange,
    isYearInRange
  } = selector;
  const displayValue = formatDateValue(currentValue, mergedI18n, dayDateFormat);
  const [inputValue, setInputValue] = useState(displayValue);
  const [isInputFocused, setIsInputFocused] = useState(false);
  useEffect(() => {
    if (!isInputFocused || !displayValue) {
      setInputValue(displayValue);
    }
  }, [displayValue, isInputFocused]);
  const dateFormats = useMemo(() => {
    if (dayDateFormats && dayDateFormats.length > 0) {
      const formats = [...dayDateFormats];
      if (!formats.includes(dayDateFormat)) {
        formats.unshift(dayDateFormat);
      }
      return formats;
    }
    const defaultFormats = [
      dayDateFormat,
      'dd/MM/yyyy',
      'yyyy-MM-dd',
      'MM-dd-yyyy',
      'dd-MM-yyyy'
    ];
    return Array.from(new Set(defaultFormats));
  }, [dayDateFormat, dayDateFormats]);
  const parseInputValue = useCallback(
    (text) => {
      if (!text.trim()) return null;
      const trimmed = text.trim();
      const yearMatch = trimmed.match(/^\d{4}$/);
      if (yearMatch) {
        const year = parseInt(yearMatch[0]);
        if (year >= 1900 && year <= 2100) {
          return {
            period: 'year',
            operator: presetMode ?? filterType,
            year
          };
        }
      }
      const quarterMatch = trimmed.match(/^Q([1-4])(?:\s+(\d{4}))?$/i);
      if (quarterMatch) {
        const quarter = parseInt(quarterMatch[1]) - 1;
        const year = quarterMatch[2]
          ? parseInt(quarterMatch[2])
          : new Date().getFullYear();
        if (year >= 1900 && year <= 2100) {
          return {
            period: 'quarter',
            operator: presetMode ?? filterType,
            year,
            quarter
          };
        }
      }
      for (const dateFormat of dateFormats) {
        try {
          const parsed = parse(trimmed, dateFormat, new Date());
          if (!isNaN(parsed.getTime())) {
            return {
              period: 'day',
              operator: presetMode ?? filterType,
              startDate: parsed
            };
          }
        } catch {
          // Unsupported browser operation: retain the fallback below.
        }
      }
      return null;
    },
    [filterType, presetMode, dateFormats]
  );
  const handleInputChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      const parsed = parseInputValue(newValue);
      if (parsed) {
        onChange?.(parsed);
      }
    },
    [onChange, parseInputValue]
  );
  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
    if (!parseInputValue(inputValue)) {
      setInputValue(displayValue);
    }
  }, [inputValue, displayValue, parseInputValue]);
  return (
    <DateSelectorContext.Provider
      value={{ i18n: mergedI18n, variant: 'outline', size: 'default' }}
    >
      <div className={cn('w-full space-y-4 sm:w-[470px]', className)}>
        <div className='flex flex-wrap items-center gap-3'>
          {label && (
            <h3 className='text-sm font-medium' data-slot='data-selector-label'>
              {label}
            </h3>
          )}
          <DateSelectorFilterToggle
            value={filterType}
            onChange={setFilterType}
            showBetween={allowRange}
            presetMode={presetMode}
          />
        </div>
        {showInput && (
          <div className='relative'>
            <Input
              type='text'
              aria-label={typeof label === 'string' ? label : mergedI18n.selectDate}
              value={inputHint ? inputValue : displayValue}
              readOnly={!inputHint}
              placeholder={
                isInputFocused && inputHint ? inputHint : mergedI18n.placeholder
              }
              onFocus={() => setIsInputFocused(true)}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
            />
            {(inputHint ? inputValue : displayValue) && (
              <Button
                variant='ghost'
                tone='neutral'
                size='icon-xs'
                aria-label={mergedI18n.clear}
                onClick={clearSelection}
                className='absolute end-1 top-1/2 -translate-y-1/2'
              >
                <RegistryIcon lucide='XIcon' />
              </Button>
            )}
          </div>
        )}
        <DateSelectorPeriodTabs
          value={periodType}
          onChange={setPeriodType}
          periodTypes={periodTypes}
          calendarMonth={calendarMonth}
          onMonthChange={setCalendarMonth}
          showNavigationButtons={periodType === 'day'}
        />

        {periodType === 'day' ? (
          <div className='w-full pb-1'>
            <DateSelectorDayPicker
              currentMonth={calendarMonth}
              selectedDate={selectedDate}
              selectedEndDate={selectedEndDate}
              onDayClick={handleDayClick}
              isRange={filterType === 'between' && allowRange}
              onDayHover={setHoverDate}
              hoverDate={hoverDate}
              showTwoMonths={showTwoMonths}
              weekStartsOn={weekStartsOn}
            />
          </div>
        ) : (
          <div className='-mr-3 w-full'>
            <ScrollArea key={periodType} className='h-[200px] w-full pe-3'>
              {periodType === 'month' && (
                <DateSelectorPeriodGrid
                  years={years}
                  items={mergedI18n.monthsShort}
                  selectedYear={selectedYear}
                  selectedValue={selectedMonth}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  isInRange={isInRange}
                  onSelect={handlePeriodSelect}
                  columns={3}
                />
              )}

              {periodType === 'quarter' && (
                <DateSelectorPeriodGrid
                  years={years}
                  items={mergedI18n.quarters}
                  selectedYear={selectedYear}
                  selectedValue={selectedQuarter}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  isInRange={isInRange}
                  onSelect={handlePeriodSelect}
                  columns={4}
                />
              )}

              {periodType === 'half-year' && (
                <DateSelectorPeriodGrid
                  years={years}
                  items={mergedI18n.halfYears}
                  selectedYear={selectedYear}
                  selectedValue={selectedHalfYear}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  isInRange={isInRange}
                  onSelect={handlePeriodSelect}
                  columns={2}
                />
              )}

              {periodType === 'year' && (
                <DateSelectorYearList
                  years={years}
                  selectedYear={selectedYear}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  isYearInRange={isYearInRange}
                  onSelect={handleYearSelect}
                />
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    </DateSelectorContext.Provider>
  );
}
export { useDateSelectorContext } from './DateSelectorContext.jsx';
export { useDateSelector } from './hooks/useDateSelector.js';
