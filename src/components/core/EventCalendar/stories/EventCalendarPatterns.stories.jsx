import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'event-calendar', import.meta.url,
  import.meta.glob('./fixtures/event-calendar/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/event-calendar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);


const verifyNavigationTitle = async ({ canvasElement }) => {
  const verify = () => {
    const title = canvasElement.querySelector('[data-slot="event-calendar-title"]');
    expect(title).toBeInTheDocument();
    expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth + 1);
  };
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return verify();
  const { page } = await import('vitest/browser');
  const original = { width: window.innerWidth, height: window.innerHeight };
  try {
    for (const scale of [0.75, 1, 1.25]) {
      canvasElement.style.setProperty('--ds-space-scale', String(scale));
      for (const width of [320, 390, 639, 640, 1440]) {
        await page.viewport(width, original.height);
        await waitFor(verify);
      }
    }
  } finally {
    canvasElement.style.removeProperty('--ds-space-scale');
    await page.viewport(original.width, original.height);
  }
};


const verifySettings = async (context) => {
  await verifyNavigationTitle(context);
  const canvas = within(context.canvasElement);
  const body = within(context.canvasElement.ownerDocument.body);
  await userEvent.click(canvas.getByRole('button', { name: 'Settings', exact: true }));
  await waitFor(() => expect(body.getByRole('combobox', { name: 'Week starts' })).toBeVisible());
  await userEvent.click(body.getByRole('tab', { name: 'Region' }));
  await expect(body.getByRole('combobox', { name: 'Language' })).toBeVisible();
  await expect(body.getByRole('combobox', { name: 'Time zone' })).toBeVisible();
  await userEvent.click(body.getByRole('tab', { name: 'Behavior' }));
  await expect(body.getByRole('switch', { name: 'Select time range' })).toBeChecked();
  await userEvent.keyboard('{Escape}');
};

const verifyResourceScrolling = async (context) => {
  await verifyNavigationTitle(context);
  const calendar = context.canvasElement.querySelector('[data-slot="event-calendar-resource-view"]');
  const viewport = calendar.querySelector('[data-slot="scroll-area-viewport"]');
  const previousMaxWidth = calendar.style.maxWidth;
  const previousScroll = viewport.scrollLeft;
  try {
    // Exercise horizontal scrolling even when the story initially opens on a wide screen.
    calendar.style.maxWidth = '20rem';
    await waitFor(() => expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth));
    viewport.scrollLeft = viewport.scrollWidth;
    await waitFor(() => {
      expect(viewport.scrollLeft).toBeGreaterThan(0);
      const headers = calendar.querySelectorAll('[data-slot="event-calendar-resource-header"]');
      const columns = calendar.querySelectorAll('[data-slot="event-calendar-day-column"]');
      const allDay = calendar.querySelectorAll('[data-slot="event-calendar-all-day-cell"]');
      expect(headers.length).toBe(columns.length);
      expect(allDay.length).toBe(columns.length);
      columns.forEach((column, index) => {
        const bounds = column.getBoundingClientRect();
        for (const label of [headers[index], allDay[index]]) {
          expect(Math.abs(label.getBoundingClientRect().left - bounds.left)).toBeLessThan(1);
          expect(Math.abs(label.getBoundingClientRect().width - bounds.width)).toBeLessThan(1);
        }
      });
    });
  } finally {
    calendar.style.maxWidth = previousMaxWidth;
    viewport.scrollLeft = previousScroll;
  }
};

const verifyPreciseEventEditing = async (context) => {
  await verifyNavigationTitle(context);
  const canvas = within(context.canvasElement);
  const body = within(context.canvasElement.ownerDocument.body);
  await userEvent.click(canvas.getByRole('button', { name: /^Team standup,/ }));
  const dialog = within(await body.findByRole('dialog', { name: 'Edit event' }));
  await waitFor(() => expect(dialog.getByRole('combobox', { name: 'Start' })).toBeVisible());
  await expect(dialog.getByRole('combobox', { name: 'Start' })).toHaveTextContent('09:15');
  await expect(dialog.getByRole('combobox', { name: 'Duration' })).toHaveTextContent('15 min');
  await userEvent.clear(dialog.getByRole('textbox', { name: 'Title' }));
  await userEvent.type(dialog.getByRole('textbox', { name: 'Title' }), 'Renamed standup');
  await userEvent.click(dialog.getByRole('button', { name: 'Save changes' }));
  await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  await waitFor(() => expect(canvas.getByRole('button', { name: /^Renamed standup,/ })).toHaveFocus());
  await userEvent.click(canvas.getByRole('button', { name: /^Renamed standup,/ }));
  const reopened = within(await body.findByRole('dialog', { name: 'Edit event' }));
  await waitFor(() => expect(reopened.getByRole('combobox', { name: 'Start' })).toBeVisible());
  await expect(reopened.getByRole('combobox', { name: 'Start' })).toHaveTextContent('09:15');
  await expect(reopened.getByRole('combobox', { name: 'Duration' })).toHaveTextContent('15 min');
  const colors = reopened.getByRole('radiogroup', { name: 'Color' });
  await userEvent.click(within(colors).getByRole('radio', { name: 'Violet' }));
  await expect(within(colors).getByRole('radio', { name: 'Violet' })).toBeChecked();
  // Radix selects while an arrow is held; wait for its deferred focus movement before releasing.
  await userEvent.keyboard('{ArrowDown>}');
  await waitFor(() => expect(within(colors).getByRole('radio', { name: 'Emerald' })).toHaveFocus());
  await userEvent.keyboard('{/ArrowDown}');
  await expect(within(colors).getByRole('radio', { name: 'Emerald' })).toBeChecked();
  await userEvent.click(within(colors).getByRole('radio', { name: 'Amber' }));
  await userEvent.clear(reopened.getByRole('textbox', { name: 'Title' }));
  await userEvent.type(reopened.getByRole('textbox', { name: 'Title' }), 'Team standup');
  await userEvent.click(reopened.getByRole('button', { name: 'Save changes' }));
  await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  await waitFor(() => expect(canvas.getByRole('button', { name: /^Team standup,/ })).toHaveFocus());
  await userEvent.click(canvas.getByRole('button', { name: /^Team standup,/ }));
  await waitFor(() => expect(body.getByRole('dialog', { name: 'Edit event' })).toBeVisible());
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(canvas.getByRole('button', { name: /^Team standup,/ })).toHaveFocus());

  // Delete a temporary event to verify the surviving toolbar fallback without changing the fixture.
  const addEvent = canvas.getByRole('button', { name: 'Add event', exact: true });
  await userEvent.click(addEvent);
  const create = within(await body.findByRole('dialog', { name: 'New event' }));
  await waitFor(() => expect(create.getByRole('textbox', { name: 'Title' })).toBeVisible());
  await userEvent.type(create.getByRole('textbox', { name: 'Title' }), 'Temporary focus check');
  await userEvent.click(create.getByRole('button', { name: 'Create event' }));
  await waitFor(() => expect(addEvent).toHaveFocus());
  await userEvent.click(canvas.getByRole('button', { name: /^Temporary focus check,/ }));
  const temporary = within(await body.findByRole('dialog', { name: 'Edit event' }));
  await waitFor(() => expect(temporary.getByRole('button', { name: 'Delete', exact: true })).toBeVisible());
  await userEvent.click(temporary.getByRole('button', { name: 'Delete', exact: true }));
  await waitFor(() => expect(canvas.queryByRole('button', { name: /^Temporary focus check,/ })).not.toBeInTheDocument());
  await waitFor(() => expect(addEvent).toHaveFocus());
};

export default { title: 'Core/Planning/EventCalendar', id: 'core-eventcalendar', tags: ['autodocs'], ...catalogueMeta('event-calendar') };

export const AllViews = { name: 'All views with live settings', ...pattern('all-views', 'Every view with a settings panel for week start, time zone, slot length and the other display options.'), play: verifySettings };
export const EditDialog = { name: 'Create and edit dialog', ...pattern('edit-dialog', 'One dialog creates and edits events. Open it from an empty day, an event, or Add event; changes commit through apiRef. Editing a title preserves quarter-hour start times and short durations.'), play: verifyPreciseEventEditing };
export const CustomChips = { name: 'Custom event chips', ...pattern('custom-chips', 'Month chips and tooltips drawn by renderEvent, with toolbar buttons that add projects and milestones through apiRef.'), play: verifyNavigationTitle };
export const DragToBook = { name: 'Drag-to-book appointments', ...pattern('drag-to-book', 'A day view where dragging across free time books an appointment, and bookings drag and resize.'), play: verifyNavigationTitle };
export const RoomResources = { name: 'Resource view for room bookings', ...pattern('room-resources', 'Hotel rooms as resource columns, with stays, turnovers and check-ins you can drag between rooms.'), play: verifyResourceScrolling };
