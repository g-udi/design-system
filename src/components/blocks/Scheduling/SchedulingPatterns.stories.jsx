import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'scheduling',
  import.meta.glob('../../../../.storybook/fixtures/patterns/scheduling/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/scheduling/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Scheduling', id: 'blocks-scheduling', tags: ['autodocs'], ...catalogueMeta('scheduling') };

export const SchedulingPattern1 = {
  name: 'Day agenda',
  ...pattern(1, 'A date picker beside the day’s agenda; status dots mark busy days and the agenda filters by confirmed, tentative or cancelled.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Cancelled' }));
    await expect(canvas.getByText('Hiring debrief')).toBeVisible();
    await expect(canvas.queryByText('Daily standup')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: 'All' }));
  }
};
export const SchedulingPattern2 = {
  name: 'Month at a glance',
  ...pattern(2, 'A compact month with per-day dots and filter chips: events show category dots and an attendee agenda; attendance shows status dots and bar rows per status.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Attendance' }));
    await expect(canvas.getByRole('button', { name: 'Office', pressed: true })).toBeVisible();
    await expect(canvasElement.querySelector('dl')).toHaveTextContent(/Office.*Remote.*Leave/);
    await userEvent.click(canvas.getByRole('radio', { name: 'Events' }));
    await expect(canvas.getByText('Team lunch')).toBeVisible();
  }
};
export const SchedulingPattern3 = {
  name: 'Book a meeting',
  ...pattern(3, 'A booking page: host details and a duration switch, a month with availability dots and unavailable days disabled, and scrolling start times with booked ones crossed out.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slots = canvas.getByRole('radiogroup', { name: /Start times/ });
    await userEvent.click(within(slots).getByRole('radio', { name: '11:00' }));
    await expect(canvas.getByRole('button', { name: 'Confirm 11:00–11:30' })).toBeEnabled();
  }
};
export const SchedulingPattern4 = {
  name: 'Plan a meeting',
  ...pattern(4, 'A calendar with separate start and end selects, quick durations that set the end, a live duration, a recurrence choice and meeting options.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: '1h 30m' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: /10:00–11:30/ })).toBeVisible());
  }
};
export const SchedulingPattern5 = { name: 'Create a schedule', ...pattern(5, 'A form with team members as removable chips, a date picker in a popover and file attachments.') };
export const SchedulingPattern6 = {
  name: 'Webinar details and RSVP',
  ...pattern(6, 'An event card with collapsible sections, presenters and a Yes, Maybe or Skip reply.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Yes' }));
    await expect(canvas.getByText(/calendar invite is on its way/)).toBeVisible();
  }
};
export const SchedulingPattern7 = {
  name: 'Date and time popover',
  ...pattern(7, 'One popover for scheduling: quick shortcuts, a calendar and time slots, with the trigger showing the chosen moment.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Schedule send' }));
    await userEvent.click(await within(document.body).findByRole('button', { name: /Next Monday/ }));
    await waitFor(() => expect(canvas.getByRole('button', { name: /Mon 19 Oct, 09:00/ })).toBeVisible());
  }
};
