// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'calendar',
  import.meta.glob('../../../../.storybook/fixtures/reui/calendar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/calendar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Calendar', tags: ['autodocs'], ...catalogueMeta('calendar') };

export const ReuiCalendar1 = { name: 'Basic', ...pattern(1) };
export const ReuiCalendar2 = { name: 'Range', ...pattern(2) };
export const ReuiCalendar3 = { name: 'Disabled dates', ...pattern(3) };
export const ReuiCalendar4 = { name: 'Multiple days', ...pattern(4) };
export const ReuiCalendar5 = { name: 'Custom selected day style', ...pattern(5) };
export const ReuiCalendar6 = { name: 'Custom range style', ...pattern(6) };
export const ReuiCalendar7 = { name: 'Navigation on the right', ...pattern(7) };
export const ReuiCalendar8 = { name: 'Month and year dropdowns', ...pattern(8) };
export const ReuiCalendar9 = { name: 'Year dropdown with navigation', ...pattern(9) };
export const ReuiCalendar10 = { name: 'Week numbers', ...pattern(10) };
export const ReuiCalendar11 = { name: 'Current month button', ...pattern(11) };
export const ReuiCalendar12 = { name: 'Today button', ...pattern(12) };
export const ReuiCalendar13 = { name: 'Year view navigation', ...pattern(13) };
export const ReuiCalendar14 = { name: 'Time slot picker', ...pattern(14) };
export const ReuiCalendar15 = { name: 'Past date presets', ...pattern(15) };
export const ReuiCalendar16 = { name: 'Range with presets', ...pattern(16) };
export const ReuiCalendar17 = { name: 'Daily pricing', ...pattern(17) };
export const ReuiCalendar18 = { name: 'Upcoming date presets', ...pattern(18) };
export const ReuiCalendar19 = { name: 'Appointments', ...pattern(19) };
export const ReuiCalendar20 = { name: 'Two months', ...pattern(20) };
export const ReuiCalendar21 = { name: 'Two-month range', ...pattern(21) };
export const ReuiCalendar22 = { name: 'Event list', ...pattern(22) };
export const ReuiCalendar23 = { name: 'Localized', ...pattern(23) };
export const ReuiCalendar24 = { name: 'Popover date picker', ...pattern(24) };
export const ReuiCalendar25 = { name: 'Popover range picker', ...pattern(25) };
export const ReuiCalendar26 = { name: 'Date picker with year view', ...pattern(26) };
export const ReuiCalendar27 = { name: 'Date and appointment picker', ...pattern(27) };
export const ReuiCalendar28 = { name: 'Date picker with presets', ...pattern(28) };
export const ReuiCalendar29 = { name: 'Range picker with presets', ...pattern(29) };
export const ReuiCalendar30 = { name: 'Date and time range picker', ...pattern(30) };
