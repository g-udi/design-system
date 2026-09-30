import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'event-calendar',
  import.meta.glob('../../../../.storybook/fixtures/patterns/event-calendar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/event-calendar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Planning/EventCalendar', id: 'core-eventcalendar', tags: ['autodocs'], ...catalogueMeta('event-calendar') };

export const EventCalendarPattern1 = { name: 'All views with live settings', ...pattern(1) };
export const EventCalendarPattern3 = { name: 'Create and edit dialog', ...pattern(3, 'One dialog creates and edits events. Open it from an empty day, an event, or Add event; changes commit through apiRef.') };
export const EventCalendarPattern4 = { name: 'Custom event chips', ...pattern(4) };
export const EventCalendarPattern5 = { name: 'Drag-to-book appointments', ...pattern(5) };
export const EventCalendarPattern2 = { name: 'Resource view for room bookings', ...pattern(2) };
