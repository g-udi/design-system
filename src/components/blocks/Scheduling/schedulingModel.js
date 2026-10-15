// Server-safe scheduling data helpers, shared by the Scheduling components and their callers.

export const scheduleTones = ['neutral', 'accent', 'info', 'success', 'warning', 'danger', 'discovery', 'attention'];

const pad = (value) => String(value).padStart(2, '0');

/** A local `YYYY-MM-DD` key for a date, the format `markers` is keyed by. */
export const dayKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
const fromMinutes = (total) => {
  const wrapped = ((total % 1440) + 1440) % 1440;
  return `${pad(Math.floor(wrapped / 60))}:${pad(wrapped % 60)}`;
};

/** Adds minutes to an `HH:MM` time. */
export const addMinutes = (time, minutes) => fromMinutes(toMinutes(time) + minutes);

/** Minutes between two `HH:MM` times on the same day. */
export const minutesBetween = (start, end) => toMinutes(end) - toMinutes(start);

/** `HH:MM` slots from `start` while a `duration`-long meeting still ends by `end`, every `step` minutes. */
export function timeSlots({ start = '09:00', end = '17:00', step = 30, duration = step } = {}) {
  const slots = [];
  const first = toMinutes(start);
  const last = toMinutes(end);
  if (![first, last, step, duration].every(Number.isFinite) || step <= 0 || duration < 0) return slots;
  for (let time = first; time + duration <= last; time += step) slots.push(fromMinutes(time));
  return slots;
}

/** Formats an `HH:MM` time in 24-hour or 12-hour form. */
export function formatTime(time, hour12 = false) {
  if (!hour12) return time;
  const [hours, minutes] = time.split(':').map(Number);
  return `${hours % 12 || 12}:${pad(minutes)} ${hours < 12 ? 'AM' : 'PM'}`;
}

/** `90` → `1h 30m`, `45` → `45m`. */
export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return [hours && `${hours}h`, rest && `${rest}m`].filter(Boolean).join(' ') || '0m';
}
