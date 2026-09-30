import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'calendar',
  import.meta.glob('../../../../.storybook/fixtures/patterns/calendar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/calendar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Calendar', tags: ['autodocs'], ...catalogueMeta('calendar') };

export const CalendarPattern1 = { name: 'Basic', ...pattern(1) };
export const CalendarPattern2 = { name: 'Range', ...pattern(2) };
export const CalendarPattern3 = { name: 'Disabled dates', ...pattern(3) };
export const CalendarPattern4 = { name: 'Multiple days', ...pattern(4) };
export const CalendarPattern5 = { name: 'Custom selected day style', ...pattern(5) };
export const CalendarPattern6 = { name: 'Custom range style', ...pattern(6) };
export const CalendarPattern7 = { name: 'Navigation on the right', ...pattern(7) };
export const CalendarPattern8 = { name: 'Month and year dropdowns', ...pattern(8) };
export const CalendarPattern9 = { name: 'Year dropdown with navigation', ...pattern(9) };
export const CalendarPattern10 = { name: 'Week numbers', ...pattern(10) };
export const CalendarPattern11 = { name: 'Current month button', ...pattern(11) };
export const CalendarPattern12 = { name: 'Today button', ...pattern(12) };
export const CalendarPattern13 = { name: 'Year view navigation', ...pattern(13) };
export const CalendarPattern14 = { name: 'Time slot picker', ...pattern(14) };
export const CalendarPattern15 = { name: 'Past date presets', ...pattern(15) };
export const CalendarPattern16 = { name: 'Range with presets', ...pattern(16) };
export const CalendarPattern17 = { name: 'Daily pricing', ...pattern(17) };
export const CalendarPattern18 = { name: 'Upcoming date presets', ...pattern(18) };
export const CalendarPattern19 = { name: 'Appointments', ...pattern(19) };
export const CalendarPattern20 = { name: 'Two months', ...pattern(20) };
export const CalendarPattern21 = { name: 'Two-month range', ...pattern(21) };
export const CalendarPattern22 = { name: 'Event list', ...pattern(22) };
export const CalendarPattern23 = { name: 'Localized', ...pattern(23) };
export const CalendarPattern24 = { name: 'Popover date picker', ...pattern(24) };
export const CalendarPattern25 = { name: 'Popover range picker', ...pattern(25) };
export const CalendarPattern26 = { name: 'Date picker with year view', ...pattern(26) };
export const CalendarPattern27 = { name: 'Date and appointment picker', ...pattern(27) };
export const CalendarPattern28 = { name: 'Date picker with presets', ...pattern(28) };
export const CalendarPattern29 = { name: 'Range picker with presets', ...pattern(29) };
export const CalendarPattern30 = { name: 'Date and time range picker', ...pattern(30) };
