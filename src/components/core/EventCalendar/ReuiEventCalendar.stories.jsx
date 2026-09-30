// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';


const pattern = reuiPatterns(
  'event-calendar',
  import.meta.glob('../../../../.storybook/fixtures/reui/event-calendar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/event-calendar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/EventCalendar', tags: ['autodocs'], ...catalogueMeta('event-calendar') };

export const ReuiEventCalendar1 = { name: 'All views with live settings', ...pattern(1) };
export const ReuiEventCalendar2 = { name: 'Resource view for room bookings', ...pattern(2) };
export const ReuiEventCalendar3 = { name: 'Create and edit dialog', ...pattern(3, 'One dialog creates and edits events. Open it from an empty day, an event, or Add event; changes commit through apiRef.') };
export const ReuiEventCalendar4 = { name: 'Custom event chips', ...pattern(4) };
export const ReuiEventCalendar5 = { name: 'Drag-to-book appointments', ...pattern(5) };
