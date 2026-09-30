// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  isValid,
  parse,
  startOfDay
} from 'date-fns';
export const FILTER_DATE_FORMAT = 'yyyy-MM-dd';
export const RELATIVE_TODAY = { unit: 'day', offset: 0 };
export const RELATIVE_TOMORROW = { unit: 'day', offset: 1 };
export const RELATIVE_YESTERDAY = {
  unit: 'day',
  offset: -1
};
export const RELATIVE_NEXT_WEEK = {
  unit: 'week',
  offset: 1
};
export function applyFilterRelative(relative, now) {
  const base = startOfDay(now);
  if (relative.unit === 'day') return addDays(base, relative.offset);
  if (relative.unit === 'week') return addWeeks(base, relative.offset);
  if (relative.unit === 'month') return addMonths(base, relative.offset);
  return addYears(base, relative.offset);
}
export function resolveFilterDate(value, now = /* @__PURE__ */ new Date()) {
  if (!value) return null;
  if (value.relative) return applyFilterRelative(value.relative, now);
  if (value.date) {
    const parsed = parse(value.date, FILTER_DATE_FORMAT, now);
    return isValid(parsed) ? parsed : null;
  }
  return null;
}
export function toFilterDateValue(date, time) {
  const value = { date: format(date, FILTER_DATE_FORMAT) };
  if (time) value.time = time;
  return value;
}
const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];
const EXPLICIT_FORMATS = [
  'yyyy-MM-dd',
  'MM/dd/yyyy',
  'M/d/yyyy',
  'dd/MM/yyyy',
  'MMMM d, yyyy',
  'MMM d, yyyy',
  'MMMM d',
  'MMM d',
  'd MMMM yyyy',
  'd MMM yyyy'
];
export function parseFilterDate(text, now = /* @__PURE__ */ new Date()) {
  const input = text.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!input) return null;
  if (input === 'today' || input === 'now') return { relative: RELATIVE_TODAY };
  if (input === 'tomorrow') return { relative: RELATIVE_TOMORROW };
  if (input === 'yesterday') return { relative: RELATIVE_YESTERDAY };
  const nextLast = input.match(/^(next|last|this) (day|week|month|year)$/);
  if (nextLast) {
    const direction =
      nextLast[1] === 'next' ? 1 : nextLast[1] === 'last' ? -1 : 0;
    return {
      relative: {
        unit: nextLast[2],
        offset: direction
      }
    };
  }
  const counted = input.match(
    /^(?:in )?(\d+) (day|week|month|year)s?(?: ago)?$/
  );
  if (counted) {
    const magnitude = Number.parseInt(counted[1], 10);
    const past = input.endsWith('ago');
    return {
      relative: {
        unit: counted[2],
        offset: past ? -magnitude : magnitude
      }
    };
  }
  const weekday = input.match(/^(?:(next|last|this) )?([a-z]+)$/);
  if (weekday) {
    const index = WEEKDAYS.indexOf(weekday[2]);
    if (index !== -1) {
      const today = startOfDay(now);
      const current = today.getDay();
      let delta = index - current;
      const qualifier = weekday[1];
      if (qualifier === 'last') {
        if (delta >= 0) delta -= 7;
      } else {
        if (delta <= 0) delta += 7;
      }
      return { relative: { unit: 'day', offset: delta } };
    }
  }
  for (const pattern of EXPLICIT_FORMATS) {
    const parsed = parse(input, pattern, now);
    if (isValid(parsed)) {
      return toFilterDateValue(parsed);
    }
  }
  return null;
}
export function formatFilterDate(
  value,
  now = /* @__PURE__ */ new Date(),
  pattern = 'MMM d, yyyy'
) {
  if (!value) return '';
  if (value.relative) {
    const { unit, offset } = value.relative;
    if (unit === 'day' && offset === 0) return 'today';
    if (unit === 'day' && offset === 1) return 'tomorrow';
    if (unit === 'day' && offset === -1) return 'yesterday';
    const plural = Math.abs(offset) === 1 ? unit : `${unit}s`;
    if (offset > 0) return `in ${offset} ${plural}`;
    if (offset < 0) return `${Math.abs(offset)} ${plural} ago`;
    return `this ${unit}`;
  }
  const resolved = resolveFilterDate(value, now);
  if (!resolved) return '';
  const day = format(resolved, pattern);
  return value.time ? `${day} ${value.time}` : day;
}
export function isFilterTime(time) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}
