import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'calendar',
  import.meta.glob('../../../../.storybook/fixtures/patterns/calendar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/calendar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Calendar', tags: ['autodocs'], ...catalogueMeta('calendar') };

export const CalendarPattern1 = { name: 'Selection and display options', ...pattern(1, 'One calendar with every display option: single, multiple or range selection, locale, two months, week numbers, outside days, rounded days, and weekends disabled and excluded from ranges.') };
export const CalendarPattern24 = { name: 'Date pickers in popovers', ...pattern(24, 'Form fields that open a calendar in a popover: a single date, a two-month stay range, and a date with start and end times.') };
export const CalendarPattern16 = { name: 'Presets', ...pattern(16, 'A preset rail beside the calendar: look-back ranges that cannot end in the future, or look-ahead due dates that cannot be in the past.') };
export const CalendarPattern8 = { name: 'Caption and navigation', ...pattern(8, 'Caption layouts: centred label, arrows at the end, month and year dropdowns, or a year dropdown between the arrows. The controlled month jumps back with This month or Today.') };
export const CalendarPattern13 = { name: 'Year and month grid', ...pattern(13, 'The caption opens a year grid, then a month grid, for jumping far from the current month.') };
export const CalendarPattern19 = { name: 'Appointment booking', ...pattern(19, 'Past and fully booked days are disabled; taken slots are disabled and the chosen slot resets when the day changes.') };
export const CalendarPattern17 = { name: 'Daily pricing', ...pattern(17, 'A custom day button shows a price under each date, with larger cells to fit it.') };
export const CalendarPattern22 = { name: 'Event list', ...pattern(22) };
