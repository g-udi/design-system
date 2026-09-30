import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { EventCalendar, EventCalendarContent, EventCalendarNav } from './index.js';

const docs = getComponentDocs('Core/EventCalendar');
const at = (day, hour, minutes = 0) => new Date(2026, 5, day, hour, minutes);
const events = [
  { id: 'standup', title: 'Team standup', start: at(15, 9), end: at(15, 9, 30), color: 'var(--color-blue-500)' },
  { id: 'review', title: 'Design review', start: at(16, 13), end: at(16, 14, 30), color: 'var(--color-violet-500)' },
  { id: 'offsite', title: 'Planning offsite', start: at(18, 0), end: at(20, 0), allDay: true, color: 'var(--color-amber-500)' }
];
const today = at(15, 9);

export default {
  title: 'Core/EventCalendar',
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
      source: playgroundSource('EventCalendar', {
        imports: "import { EventCalendar, EventCalendarContent, EventCalendarNav } from '@gaudi/design-system';",
        children: '  <EventCalendarNav />\n  <EventCalendarContent />'
      })
    }
  },
  render: (args) => (
    <EventCalendar key={args.defaultView} defaultEvents={events} defaultDate={today} className='h-[560px] w-full' {...args}>
      <EventCalendarNav />
      <EventCalendarContent />
    </EventCalendar>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findAllByText(events[0].title)).not.toHaveLength(0);
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(args.onDateChange).toHaveBeenCalled();
    await expect(args.onDateChange.mock.lastCall[0].getTime()).toBeGreaterThan(today.getTime());
  }
};
