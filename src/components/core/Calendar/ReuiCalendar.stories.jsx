// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'calendar',
  import.meta.glob('../../../../.storybook/fixtures/reui/calendar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/calendar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Calendar', tags: ['autodocs'], ...catalogueMeta('calendar') };

export const ReuiCalendar1 = { name: 'Basic calendar', ...pattern(1) };
export const ReuiCalendar2 = { name: 'Range calendar', ...pattern(2) };
export const ReuiCalendar3 = { name: 'Disabled dates', ...pattern(3) };
export const ReuiCalendar4 = { name: 'Multiple day selection', ...pattern(4) };
export const ReuiCalendar5 = { name: 'Custom select day style', ...pattern(5) };
export const ReuiCalendar6 = { name: 'Custom select range style', ...pattern(6) };
export const ReuiCalendar7 = { name: 'Right navigation', ...pattern(7) };
export const ReuiCalendar8 = { name: 'Month and year selection', ...pattern(8) };
export const ReuiCalendar9 = { name: 'Year select with navigation', ...pattern(9) };
export const ReuiCalendar10 = { name: 'Display week numbers', ...pattern(10) };
export const ReuiCalendar11 = { name: 'Current month button', ...pattern(11) };
export const ReuiCalendar12 = { name: 'Today button', ...pattern(12) };
export const ReuiCalendar13 = { name: 'Custom navigation with year view', ...pattern(13) };
export const ReuiCalendar14 = { name: 'Preset time selection', ...pattern(14) };
export const ReuiCalendar15 = { name: 'Calendar with presets', ...pattern(15) };
export const ReuiCalendar16 = { name: 'Range calendar with presets', ...pattern(16) };
export const ReuiCalendar17 = { name: 'Calendar with pricing', ...pattern(17) };
export const ReuiCalendar18 = { name: 'Calendar with presets', ...pattern(18) };
export const ReuiCalendar19 = { name: 'Appointment calendar', ...pattern(19) };
export const ReuiCalendar20 = { name: 'Display 2 months', ...pattern(20) };
export const ReuiCalendar21 = { name: 'Display 2 months with range picker', ...pattern(21) };
export const ReuiCalendar22 = { name: 'Calendar with event list', ...pattern(22) };
export const ReuiCalendar23 = { name: 'Localize calendar', ...pattern(23) };
export const ReuiCalendar24 = { name: 'Calendar with date picker', ...pattern(24) };
export const ReuiCalendar25 = { name: 'Calendar with date range picker', ...pattern(25) };
export const ReuiCalendar26 = { name: 'Calendar with date picker and year view', ...pattern(26) };
export const ReuiCalendar27 = { name: 'Calendar with date and appointment picker', ...pattern(27) };
export const ReuiCalendar28 = { name: 'Calendar with date picker and presets', ...pattern(28) };
export const ReuiCalendar29 = { name: 'Range calendar with date picker and presets', ...pattern(29) };
export const ReuiCalendar30 = { name: 'Calendar with date and time range picker', ...pattern(30) };
