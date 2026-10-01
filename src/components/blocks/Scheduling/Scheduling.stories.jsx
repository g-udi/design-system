import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { ScheduleCalendar, TimeSlots, timeSlots } from './Scheduling';

const docs = getComponentDocs('Blocks/Scheduling');
const markers = { '2026-10-13': ['success'], '2026-10-14': ['success', 'warning'], '2026-10-15': ['danger'], '2026-10-16': ['success'] };
const booked = ['10:00', '13:30'];

function Booking({ start, end, step, duration, hour12, columns, showMarkers }) {
  const [date, setDate] = useState(new Date(2026, 9, 14));
  const [slot, setSlot] = useState('');
  return (
    <div className='bg-surface grid w-full max-w-2xl overflow-hidden rounded-lg border md:grid-cols-[auto_1fr]'>
      <ScheduleCalendar mode='single' required selected={date} onSelect={setDate} defaultMonth={new Date(2026, 9, 1)} markers={showMarkers ? markers : {}} className='border-b p-3 md:border-e md:border-b-0' />
      <div className='grid content-start gap-3 p-4'>
        <p className='text-sm font-medium'>{date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <TimeSlots slots={timeSlots({ start, end, step: Number(step), duration: Number(duration) })} unavailable={booked} hour12={hour12} columns={Number(columns)} value={slot} onValueChange={setSlot} />
      </div>
    </div>
  );
}

export default {
  title: 'Blocks/Scheduling',
  id: 'blocks-scheduling',
  component: TimeSlots,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    start: 'text',
    end: 'text',
    step: ['15', '30', '60'],
    duration: ['15', '30', '60'],
    hour12: 'boolean',
    columns: ['2', '3', '4'],
    showMarkers: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { start: '09:00', end: '17:00', step: '30', duration: '30', hour12: false, columns: '3', showMarkers: true },
  parameters: {
    docs: {
      description: { story: 'A booking picker: ScheduleCalendar marks busy days with dots and TimeSlots lists start times. `start`, `end`, `step` and `duration` build the slots with timeSlots (a slot only appears if the whole meeting fits before `end`), booked times stay visible but disabled, `hour12` switches the clock and `columns` the grid.' },
      source: playgroundSource('TimeSlots', {
        imports: "import { ScheduleCalendar, TimeSlots, timeSlots } from '@gaudi/design-system/blocks/Scheduling';",
        before: `<ScheduleCalendar mode='single' markers={${JSON.stringify(markers)}} />\n`,
        attributes: ["slots={timeSlots({ start: '09:00', end: '17:00', step: 30 })}", `unavailable={${JSON.stringify(booked)}}`]
      })
    }
  },
  render: (args) => <Booking {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slots = canvas.getByRole('radiogroup', { name: 'Available times' });
    // Booked slots stay listed but cannot be picked.
    await expect(within(slots).getAllByRole('radio').find((slot) => slot.disabled)).toBeDefined();
    const first = within(slots).getAllByRole('radio').find((slot) => !slot.disabled);
    await userEvent.click(first);
    await expect(first).toHaveAttribute('aria-checked', 'true');
  }
};
