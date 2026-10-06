'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isBefore } from 'date-fns';
import { useLatestRef } from '../../../../hooks/shared/use-latest-ref.js';
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
  const onChangeRef = useLatestRef(onChange);
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
    } else {
      // Hosts clear drafts with an empty value, including while a closing
      // overlay keeps this selector mounted for its exit transition.
      clearSelection();
    }
  }, [value, validDefaultPeriodType, defaultFilterType, presetMode, clearSelection]);
  useEffect(() => {
    if (presetMode !== void 0) {
      setFilterType(presetMode);
    }
  }, [presetMode]);
  useEffect(() => {
    onChangeRef.current?.(currentValue);
  }, [currentValue, onChangeRef]);
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
