'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  addMonths,
  format,
  isBefore,
  isSameMonth,
  parse,
  subMonths
} from 'date-fns';
import { useIsMobile } from '../../../../hooks/use-mobile.js';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import { Calendar, CalendarDayButton } from './calendar.jsx';
import { FieldInput as Input } from '../../Field/index.js';
import { ScrollArea } from '../../ScrollArea/parts/scroll-area.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
export const DEFAULT_DATE_SELECTOR_I18N = {
  selectDate: 'Select date',
  apply: 'Apply',
  cancel: 'Cancel',
  clear: 'Clear',
  today: 'Today',
  filterTypes: {
    is: 'is',
    before: 'before',
    after: 'after',
    between: 'between'
  },
  periodTypes: {
    day: 'Day',
    month: 'Month',
    quarter: 'Quarter',
    halfYear: 'Half-year',
    year: 'Year'
  },
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  monthsShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
  halfYears: ['H1', 'H2'],
  weekdays: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],
  weekdaysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  placeholder: 'Select date...',
  rangePlaceholder: 'Select date range...'
};
const DateSelectorContext = createContext({
  i18n: DEFAULT_DATE_SELECTOR_I18N,
  variant: 'outline',
  size: 'default'
});
export const useDateSelectorContext = () => useContext(DateSelectorContext);
export function formatDateValue(
  value,
  i18n = DEFAULT_DATE_SELECTOR_I18N,
  dayDateFormat = 'MM/dd/yyyy'
) {
  const {
    period,
    startDate,
    endDate,
    year,
    month,
    quarter,
    halfYear,
    rangeStart,
    rangeEnd
  } = value;
  if (period === 'day') {
    if (startDate && endDate) {
      return `${format(startDate, dayDateFormat)} - ${format(endDate, dayDateFormat)}`;
    }
    if (startDate) {
      return format(startDate, dayDateFormat);
    }
    return '';
  }
  if (period === 'month') {
    if (rangeStart && rangeEnd) {
      return `${i18n.monthsShort[rangeStart.value]} ${rangeStart.year} - ${i18n.monthsShort[rangeEnd.value]} ${rangeEnd.year}`;
    }
    if (year !== void 0 && month !== void 0) {
      return `${i18n.monthsShort[month]} ${year}`;
    }
    return '';
  }
  if (period === 'quarter') {
    if (rangeStart && rangeEnd) {
      return `${i18n.quarters[rangeStart.value]} ${rangeStart.year} - ${i18n.quarters[rangeEnd.value]} ${rangeEnd.year}`;
    }
    if (year !== void 0 && quarter !== void 0) {
      return `${i18n.quarters[quarter]} ${year}`;
    }
    return '';
  }
  if (period === 'half-year') {
    if (rangeStart && rangeEnd) {
      return `${i18n.halfYears[rangeStart.value]} ${rangeStart.year} - ${i18n.halfYears[rangeEnd.value]} ${rangeEnd.year}`;
    }
    if (year !== void 0 && halfYear !== void 0) {
      return `${i18n.halfYears[halfYear]} ${year}`;
    }
    return '';
  }
  if (period === 'year') {
    if (rangeStart && rangeEnd) {
      return `${rangeStart.year} - ${rangeEnd.year}`;
    }
    if (year !== void 0) {
      return `${year}`;
    }
    return '';
  }
  return '';
}
export function useDateSelector({
  value,
  onChange,
  defaultPeriodType = 'day',
  defaultFilterType = 'is',
  presetMode,
  allowRange = true,
  yearRange = 11,
  baseYear,
  minYear,
  maxYear,
  periodTypes
}) {
  const currentYear = baseYear ?? new Date().getFullYear();
  const validDefaultPeriodType = useMemo(() => {
    if (!periodTypes || periodTypes.length === 0) return defaultPeriodType;
    if (periodTypes.includes(defaultPeriodType)) return defaultPeriodType;
    return periodTypes[0];
  }, [periodTypes, defaultPeriodType]);
  const effectiveFilterType =
    presetMode ?? value?.operator ?? defaultFilterType;
  const [periodType, setPeriodType] = useState(
    value?.period || validDefaultPeriodType
  );
  const [filterType, setFilterType] = useState(effectiveFilterType);
  const [selectedDate, setSelectedDate] = useState(value?.startDate);
  const [selectedEndDate, setSelectedEndDate] = useState(value?.endDate);
  const [calendarMonth, setCalendarMonth] = useState(
    value?.startDate || new Date()
  );
  const [selectedYear, setSelectedYear] = useState(value?.year);
  const [selectedMonth, setSelectedMonth] = useState(value?.month);
  const [selectedQuarter, setSelectedQuarter] = useState(value?.quarter);
  const [selectedHalfYear, setSelectedHalfYear] = useState(value?.halfYear);
  const [rangeStart, setRangeStart] = useState(value?.rangeStart);
  const [rangeEnd, setRangeEnd] = useState(value?.rangeEnd);
  const [hoverDate, setHoverDate] = useState();
  const years = useMemo(() => {
    if (minYear !== void 0 && maxYear !== void 0) {
      return Array.from(
        { length: maxYear - minYear + 1 },
        (_, i) => minYear + i
      );
    }
    return Array.from(
      { length: yearRange },
      (_, i) => currentYear - Math.floor(yearRange / 2) + i
    );
  }, [currentYear, yearRange, minYear, maxYear]);
  const currentValue = useMemo(
    () => ({
      period: periodType,
      operator: presetMode ?? filterType,
      startDate: selectedDate,
      endDate: selectedEndDate,
      year: selectedYear,
      month: selectedMonth,
      quarter: selectedQuarter,
      halfYear: selectedHalfYear,
      rangeStart,
      rangeEnd
    }),
    [
      periodType,
      presetMode,
      filterType,
      selectedDate,
      selectedEndDate,
      selectedYear,
      selectedMonth,
      selectedQuarter,
      selectedHalfYear,
      rangeStart,
      rangeEnd
    ]
  );
  const clearSelection = useCallback(() => {
    setSelectedDate(void 0);
    setSelectedEndDate(void 0);
    setSelectedYear(void 0);
    setSelectedMonth(void 0);
    setSelectedQuarter(void 0);
    setSelectedHalfYear(void 0);
    setRangeStart(void 0);
    setRangeEnd(void 0);
  }, []);
  const handleDayClick = useCallback(
    (day) => {
      if (filterType === 'between' && allowRange) {
        if (!selectedDate || (selectedDate && selectedEndDate)) {
          setSelectedDate(day);
          setSelectedEndDate(void 0);
        } else {
          if (isBefore(day, selectedDate)) {
            setSelectedEndDate(selectedDate);
            setSelectedDate(day);
          } else {
            setSelectedEndDate(day);
          }
        }
      } else {
        setSelectedDate(day);
        setSelectedEndDate(void 0);
      }
    },
    [filterType, allowRange, selectedDate, selectedEndDate]
  );
  const handlePeriodSelect = useCallback(
    (year, value2) => {
      if (filterType === 'between' && allowRange) {
        if (!rangeStart || (rangeStart && rangeEnd)) {
          setRangeStart({ year, value: value2 });
          setRangeEnd(void 0);
          setSelectedYear(year);
          if (periodType === 'month') setSelectedMonth(value2);
          if (periodType === 'quarter') setSelectedQuarter(value2);
          if (periodType === 'half-year') setSelectedHalfYear(value2);
        } else {
          const startKey = rangeStart.year * 100 + rangeStart.value;
          const endKey = year * 100 + value2;
          if (endKey < startKey) {
            setRangeEnd(rangeStart);
            setRangeStart({ year, value: value2 });
          } else {
            setRangeEnd({ year, value: value2 });
          }
        }
      } else {
        setSelectedYear(year);
        if (periodType === 'month') setSelectedMonth(value2);
        if (periodType === 'quarter') setSelectedQuarter(value2);
        if (periodType === 'half-year') setSelectedHalfYear(value2);
        setRangeStart(void 0);
        setRangeEnd(void 0);
      }
    },
    [filterType, allowRange, rangeStart, rangeEnd, periodType]
  );
  const handleYearSelect = useCallback(
    (year) => {
      if (filterType === 'between' && allowRange) {
        if (!rangeStart || (rangeStart && rangeEnd)) {
          setRangeStart({ year, value: 0 });
          setRangeEnd(void 0);
          setSelectedYear(year);
        } else {
          if (year < rangeStart.year) {
            setRangeEnd(rangeStart);
            setRangeStart({ year, value: 0 });
          } else {
            setRangeEnd({ year, value: 0 });
          }
        }
      } else {
        setSelectedYear(year);
        setRangeStart(void 0);
        setRangeEnd(void 0);
      }
    },
    [filterType, allowRange, rangeStart, rangeEnd]
  );
  const handlePeriodTypeChange = useCallback(
    (type) => {
      setPeriodType(type);
      clearSelection();
    },
    [clearSelection]
  );
  const handleFilterTypeChange = useCallback(
    (type) => {
      if (presetMode !== void 0) return;
      setFilterType(type);
      clearSelection();
    },
    [clearSelection, presetMode]
  );
  const isInRange = useCallback(
    (year, value2) => {
      if (!rangeStart || !rangeEnd) return false;
      const key = year * 100 + value2;
      const startKey = rangeStart.year * 100 + rangeStart.value;
      const endKey = rangeEnd.year * 100 + rangeEnd.value;
      return key >= startKey && key <= endKey;
    },
    [rangeStart, rangeEnd]
  );
  const isYearInRange = useCallback(
    (year) => {
      if (!rangeStart || !rangeEnd) return false;
      return year >= rangeStart.year && year <= rangeEnd.year;
    },
    [rangeStart, rangeEnd]
  );
  useEffect(() => {
    if (value) {
      setPeriodType(value.period || validDefaultPeriodType);
      const newFilterType = presetMode ?? value.operator ?? defaultFilterType;
      setFilterType(newFilterType);
      setSelectedDate(value.startDate);
      setSelectedEndDate(value.endDate);
      setSelectedYear(value.year);
      setSelectedMonth(value.month);
      setSelectedQuarter(value.quarter);
      setSelectedHalfYear(value.halfYear);
      setRangeStart(value.rangeStart);
      setRangeEnd(value.rangeEnd);
    }
  }, [value, validDefaultPeriodType, defaultFilterType, presetMode]);
  useEffect(() => {
    if (presetMode !== void 0) {
      setFilterType(presetMode);
    }
  }, [presetMode]);
  useEffect(() => {
    onChange?.(currentValue);
  }, [currentValue, onChange]);
  return {
    // State
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
    allowRange,
    // Setters
    setPeriodType: handlePeriodTypeChange,
    setFilterType: handleFilterTypeChange,
    setSelectedDate,
    setSelectedEndDate,
    setCalendarMonth,
    setHoverDate,
    // Actions
    clearSelection,
    handleDayClick,
    handlePeriodSelect,
    handleYearSelect,
    isInRange,
    isYearInRange
  };
}
function DateSelectorFilterToggle({
  value,
  onChange,
  showBetween = true,
  showIs = true,
  presetMode,
  className
}) {
  const { i18n } = useDateSelectorContext();
  const isDisabled = presetMode !== void 0;
  return (
    <ToggleGroup
      type='single'
      value={value}
      onValueChange={(newValue) => {
        if (!isDisabled && newValue) {
          onChange(newValue);
        }
      }}
      className={className}
    >
      <div
        className={cn(
          'bg-ui-muted/80',
          isDisabled && 'pointer-events-none opacity-50',
          className
        )}
      >
        {showIs && (
          <ToggleGroupItem
            value='is'
            aria-label={i18n.filterTypes.is}
            className='py-1 font-normal'
          >
            {i18n.filterTypes.is}
          </ToggleGroupItem>
        )}
        <ToggleGroupItem
          value='before'
          aria-label={i18n.filterTypes.before}
          className='py-1 font-normal'
        >
          {i18n.filterTypes.before}
        </ToggleGroupItem>
        <ToggleGroupItem
          value='after'
          aria-label={i18n.filterTypes.after}
          className='py-1 font-normal'
        >
          {i18n.filterTypes.after}
        </ToggleGroupItem>
        {showBetween && (
          <ToggleGroupItem
            value='between'
            aria-label={i18n.filterTypes.between}
            className='py-1 font-normal'
          >
            {i18n.filterTypes.between}
          </ToggleGroupItem>
        )}
      </div>
    </ToggleGroup>
  );
}
function DateSelectorPeriodTabs({
  value,
  onChange,
  periodTypes,
  className,
  calendarMonth,
  onMonthChange,
  showNavigationButtons = false
}) {
  const { i18n } = useDateSelectorContext();
  const tabs = [
    { value: 'day', label: i18n.periodTypes.day },
    { value: 'month', label: i18n.periodTypes.month },
    { value: 'quarter', label: i18n.periodTypes.quarter },
    { value: 'half-year', label: i18n.periodTypes.halfYear },
    { value: 'year', label: i18n.periodTypes.year }
  ];
  const filteredTabs = periodTypes
    ? tabs.filter((tab) => periodTypes.includes(tab.value))
    : tabs;
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3',
        className
      )}
    >
      <ToggleGroup
        type='single'
        value={value}
        onValueChange={(newValue) => {
          if (newValue) {
            onChange(newValue);
          }
        }}
      >
        <div>
          {filteredTabs.map((tab) => (
            <ToggleGroupItem
              key={tab.value}
              value={tab.value}
              aria-label={tab.label}
              className='px-1 py-1 font-normal sm:px-2.5'
            >
              {tab.label}
            </ToggleGroupItem>
          ))}
        </div>
      </ToggleGroup>
      {showNavigationButtons &&
        value === 'day' &&
        calendarMonth &&
        onMonthChange && (
          <div className='flex items-center'>
            {!isSameMonth(calendarMonth, new Date()) && (
              <Button
                variant='ghost'
                tone='neutral'
                size='icon'
                aria-label={i18n.today}
                title={i18n.today}
                onClick={() => onMonthChange(new Date())}
              >
                <RegistryIcon lucide={calendarMonth > new Date() ? 'CornerUpLeftIcon' : 'CornerUpRightIcon'} />
              </Button>
            )}
            <Button
              aria-label='Previous period'
              variant='ghost'
              tone='neutral'
              size='icon'
              onClick={() => onMonthChange(subMonths(calendarMonth, 1))}
            >
              <RegistryIcon lucide='ChevronLeftIcon' />
            </Button>
            <Button
              aria-label='Next period'
              variant='ghost'
              tone='neutral'
              size='icon'
              onClick={() => onMonthChange(addMonths(calendarMonth, 1))}
            >
              <RegistryIcon lucide='ChevronRightIcon' />
            </Button>
          </div>
        )}
    </div>
  );
}
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
  const handleSelect = (date) => {
    if (!date) {
      return;
    }
    if (isRange && 'from' in date) {
      if (date.from && !date.to) {
        onDayClick(date.from);
      } else if (date.from && date.to) {
        onDayClick(date.to);
      }
    } else if (!isRange && date instanceof Date) {
      onDayClick(date);
    }
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
      {isRange ? (
        <Calendar
          month={currentMonth}
          mode='range'
          selected={selected}
          onSelect={handleSelect}
          numberOfMonths={isMobile ? 1 : showTwoMonths ? 2 : 1}
          showOutsideDays={true}
          weekStartsOn={weekStartsOn}
          formatters={formatters}
          className='w-full shrink-0 p-0'
          classNames={monthClassNames}
          components={{
            DayButton: CustomDayButton
          }}
        />
      ) : (
        <Calendar
          month={currentMonth}
          mode='single'
          selected={selected}
          onSelect={handleSelect}
          numberOfMonths={isMobile ? 1 : showTwoMonths ? 2 : 1}
          showOutsideDays={true}
          weekStartsOn={weekStartsOn}
          formatters={formatters}
          className='w-full shrink-0 p-0'
          classNames={monthClassNames}
          components={{
            DayButton: CustomDayButton
          }}
        />
      )}
    </div>
  );
}
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
  minYear = 2015,
  maxYear = 2026,
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
    if (!isInputFocused) {
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
