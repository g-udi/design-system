import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { EVENT_CALENDAR_COLORS as COLORS, EventCalendar, EventCalendarContent, EventCalendarNav } from './index.js';

const docs = getComponentDocs('Core/EventCalendar');
const at = (day, hour, minutes = 0) => new Date(2026, 5, day, hour, minutes);
// Events use the colours EventCalendar offers, by lower-case name.
const tone = Object.fromEntries(COLORS.map(({ name, value }) => [name.toLowerCase(), value]));
const standups = [15, 16, 17, 19].map((day) => ({ id: `standup-${day}`, title: 'Team standup', start: at(day, 9), end: at(day, 9, 30), color: tone.blue }));
// A product team's sprint week: daily standups, overlapping meetings, focus blocks, and a multi-day offsite.
const events = [
  ...standups,
  { id: 'customer', title: 'Customer call · Acme', start: at(15, 11), end: at(15, 12), color: tone.emerald },
  { id: 'focus-mon', title: 'Focus time', start: at(15, 13), end: at(15, 15, 30), color: tone.teal },
  { id: 'review', title: 'Design review', start: at(16, 10), end: at(16, 11, 30), color: tone.violet },
  { id: 'hiring', title: 'Interview · Frontend', start: at(16, 10, 30), end: at(16, 11, 30), color: tone.rose },
  { id: 'planning', title: 'Sprint planning', start: at(17, 10), end: at(17, 12), color: tone.amber },
  { id: 'lunch', title: 'Lunch and learn', start: at(17, 12, 30), end: at(17, 13, 30), color: tone.cyan },
  { id: 'offsite', title: 'Planning offsite', start: at(18, 0), end: at(20, 0), allDay: true, color: tone.orange },
  { id: 'release', title: 'Release 4.2', start: at(19, 8), end: at(19, 8, 45), color: tone.pink },
  { id: 'retro', title: 'Retro', start: at(19, 11), end: at(19, 12), color: tone.indigo },
  // The rest of June, so the month view reads as a real calendar.
  { id: 'kickoff', title: 'Quarterly kickoff', start: at(2, 10), end: at(2, 12), color: tone.indigo },
  { id: 'board', title: 'Board update', start: at(10, 15), end: at(10, 16), color: tone.teal },
  { id: 'launch', title: 'Launch party', start: at(24, 17), end: at(24, 19), color: tone.rose },
  { id: 'holiday', title: 'Company holiday', start: at(29, 0), end: at(30, 0), allDay: true, color: tone.amber }
];
const today = at(15, 9);

export default {
  title: 'Core/Planning/EventCalendar',
  id: 'core-eventcalendar',
  component: EventCalendar,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { defaultView: ['month', 'week', 'day', 'agenda'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { defaultView: 'week', onDateChange: fn(), onViewChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A product team\'s sprint week: daily standups, overlapping meetings on Tuesday, focus blocks, and a three-day offsite. `defaultView` shows the same schedule as a month, week, day, or agenda.' },
      source: playgroundSource('EventCalendar', {
        imports: "import { EventCalendar, EventCalendarContent, EventCalendarNav } from '@gaudi/design-system';",
        children: '  <EventCalendarNav />\n  <EventCalendarContent />'
      })
    }
  },
  render: (args) => (
    <EventCalendar key={args.defaultView} defaultEvents={events} defaultDate={today} className='h-[600px] w-full' {...args}>
      <EventCalendarNav />
      <EventCalendarContent />
    </EventCalendar>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findAllByText(events[0].title)).not.toHaveLength(0);
    // Every offered colour resolves to a defined theme variable, so no event or bar renders untinted.
    for (const { value } of COLORS) {
      await expect(getComputedStyle(canvasElement).getPropertyValue(value.match(/--[\w-]+/)[0])).not.toBe('');
    }
    await expect(canvasElement.querySelector('[data-slot="event-calendar-content"]')).toHaveAttribute('data-view', args.defaultView);
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(args.onDateChange).toHaveBeenCalled();
    await expect(args.onDateChange.mock.lastCall[0].getTime()).toBeGreaterThan(today.getTime());
    // Step back so the preview ends on the seeded schedule.
    await userEvent.click(canvas.getByRole('button', { name: 'Previous' }));
    await expect(args.onDateChange.mock.lastCall[0].getTime()).toBeLessThanOrEqual(today.getTime());
  }
};
