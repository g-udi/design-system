import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'event-calendar',
  import.meta.glob('../../../../.storybook/fixtures/patterns/event-calendar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/event-calendar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Planning/EventCalendar', id: 'core-eventcalendar', tags: ['autodocs'], ...catalogueMeta('event-calendar') };

export const EventCalendarPattern1 = { name: 'All views with live settings', ...pattern(1, 'Every view with a settings panel for week start, time zone, slot length and the other display options.') };
export const EventCalendarPattern3 = { name: 'Create and edit dialog', ...pattern(3, 'One dialog creates and edits events. Open it from an empty day, an event, or Add event; changes commit through apiRef.') };
export const EventCalendarPattern4 = { name: 'Custom event chips', ...pattern(4, 'Month chips and tooltips drawn by renderEvent, with toolbar buttons that add projects and milestones through apiRef.') };
export const EventCalendarPattern5 = { name: 'Drag-to-book appointments', ...pattern(5, 'A day view where dragging across free time books an appointment, and bookings drag and resize.') };
export const EventCalendarPattern2 = { name: 'Resource view for room bookings', ...pattern(2, 'Hotel rooms as resource rows, with stays, turnovers and check-ins you can drag between rooms.') };
