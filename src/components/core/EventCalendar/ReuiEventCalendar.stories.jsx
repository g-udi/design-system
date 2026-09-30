// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'event-calendar',
  import.meta.glob('../../../../.storybook/fixtures/reui/event-calendar/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/event-calendar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/EventCalendar', tags: ['autodocs'], ...catalogueMeta('event-calendar') };

export const ReuiEventCalendar1 = { name: 'Event calendar with all views and live settings', ...pattern(1) };
export const ReuiEventCalendar2 = { name: 'Event calendar with resource view for room bookings', ...pattern(2) };
export const ReuiEventCalendar3 = { name: 'Event calendar with create and edit dialog', ...pattern(3, 'Month calendar with event CRUD in one dialog: open from an empty day, an event, or Add event, commit via apiRef. Title, color, start, duration, all-day fields. ReUI EventCalendar, Nav, Toolbar; shadcn Dialog, Field, Select, Switch. Scheduling apps.') };
export const ReuiEventCalendar4 = { name: 'Event calendar with custom event chips', ...pattern(4) };
export const ReuiEventCalendar5 = { name: 'Event calendar with drag-to-book appointments', ...pattern(5) };
