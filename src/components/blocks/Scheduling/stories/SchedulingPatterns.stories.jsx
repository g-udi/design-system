import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'scheduling', import.meta.url,
  import.meta.glob('./fixtures/scheduling/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/scheduling/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Scheduling', id: 'blocks-scheduling', tags: ['autodocs'], ...catalogueMeta('scheduling') };

export const DayAgenda = {
  name: 'Day agenda',
  ...pattern('day-agenda', 'A date picker beside the day’s agenda; status dots mark busy days and the agenda filters by confirmed, tentative or cancelled.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Cancelled' }));
    await expect(canvas.getByText('Hiring debrief')).toBeVisible();
    await expect(canvas.queryByText('Daily standup')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: 'All' }));
  }
};
export const MonthOverview = {
  name: 'Month at a glance',
  ...pattern('month-overview', 'A compact month with per-day dots and filter chips: events show category dots and an attendee agenda; attendance shows status dots and bar rows per status.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Attendance' }));
    await expect(canvas.getByRole('button', { name: 'Office', pressed: true })).toBeVisible();
    await expect(canvasElement.querySelector('dl')).toHaveTextContent(/Office.*Remote.*Leave/);
    await userEvent.click(canvas.getByRole('radio', { name: 'Events' }));
    await expect(canvas.getByText('Team lunch')).toBeVisible();
  }
};
export const BookMeeting = {
  name: 'Book a meeting',
  ...pattern('book-meeting', 'A booking page: host details and a duration switch, a month with availability dots and unavailable days disabled, and scrolling start times with booked ones crossed out.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slots = canvas.getByRole('radiogroup', { name: /Start times/ });
    await userEvent.click(within(slots).getByRole('radio', { name: '11:00' }));
    await expect(canvas.getByRole('button', { name: 'Confirm 11:00–11:30' })).toBeEnabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm 11:00–11:30' }));
    await expect(canvas.getByText('Demo booking confirmed for 2026-10-14, 11:00–11:30.')).toHaveAttribute('role', 'status');
  }
};
export const PlanMeeting = {
  name: 'Plan a meeting',
  ...pattern('plan-meeting', 'A calendar with separate start and end selects, quick durations that set the end, a live duration, a recurrence choice and meeting options.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: '1h 30m' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: /10:00–11:30/ })).toBeVisible());
    await expect(canvas.getByRole('combobox', { name: 'Starts' })).toHaveTextContent('10:00');
    await expect(canvas.getByRole('combobox', { name: 'Ends' })).toHaveTextContent('11:30');
    await userEvent.click(canvas.getByRole('combobox', { name: 'Starts' }));
    await userEvent.click(await within(document.body).findByRole('option', { name: '10:15' }));
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Ends' })).toHaveTextContent('11:45'));
    await userEvent.click(canvas.getByRole('combobox', { name: 'Starts' }));
    await userEvent.click(await within(document.body).findByRole('option', { name: '19:45' }));
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Ends' })).toHaveTextContent('20:00'));
    await expect(canvas.getByRole('radio', { name: '1h 30m' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: /Schedule for.*19:45–20:00/ }));
    await expect(canvas.getByText('Demo meeting scheduled for 14 Oct, 19:45–20:00.')).toHaveAttribute('role', 'status');
  }
};
export const CreateSchedule = {
  name: 'Create a schedule',
  ...pattern('create-schedule', 'A form with team members as removable chips, a date picker in a popover and file attachments. Creation and cancellation use local demo feedback.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Create schedule' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Demo schedule created: Design team offsite, 2 team members.');
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.getByRole('textbox', { name: 'Title' })).toHaveValue('');
    await expect(canvas.queryByRole('button', { name: 'Remove offsite-agenda.pdf' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('status')).toHaveTextContent('Demo schedule cancelled');
  }
};
export const WebinarRsvp = {
  name: 'Webinar details and RSVP',
  ...pattern('webinar-rsvp', 'An event card with collapsible sections, presenters and a Yes, Maybe or Skip reply.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Yes' }));
    await expect(canvas.getByText(/calendar invite is on its way/)).toBeVisible();
  }
};
export const DateTimePopover = {
  name: 'Date and time popover',
  ...pattern('date-time-popover', 'One popover for scheduling: quick shortcuts, a calendar and time slots, with the trigger showing the chosen moment.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Schedule send' }));
    const body = within(document.body);
    await expect(await body.findByRole('radio', { name: '10:00' })).toBeVisible();
    await userEvent.click(body.getByRole('radio', { name: '10:00' }));
    await expect(body.getByRole('button', { name: 'Schedule for Thu 15 Oct, 10:00' })).toBeEnabled();
    await userEvent.click(body.getByRole('button', { name: /Next Monday/ }));
    await waitFor(() => expect(canvas.getByRole('button', { name: /Mon 19 Oct, 09:00/ })).toBeVisible());
  }
};
