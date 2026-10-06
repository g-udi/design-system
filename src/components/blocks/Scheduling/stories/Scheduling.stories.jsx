import { Booking } from './fixtures/Booking.jsx';
import BookingSource from './fixtures/Booking.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { TimeSlots } from '../Scheduling';

const docs = getComponentDocs('Blocks/Scheduling');

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
      source: playgroundSource('Booking', { imports: publicSource(BookingSource, new URL('./fixtures/Booking.jsx', import.meta.url)) })
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
