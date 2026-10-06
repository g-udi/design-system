import { format } from 'date-fns';
import { DEFAULT_DATE_SELECTOR_I18N } from './dateSelectorLabels.js';
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
