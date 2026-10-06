import { act } from '../../../../../tests/support/reactAct.js';
import { createRoot } from 'react-dom/client';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { EventCalendar, EventCalendarContent } from '../index.js';

const date = new Date(2026, 5, 15);
const resources = ['Design', 'Product', 'Research', 'Engineering'].map(title => ({ id: title, title }));
const reviewTitle = 'Design review with the product and engineering teams before the upcoming launch';
const monthEvents = [
  { id: 'review', title: reviewTitle, start: new Date(2026, 5, 15, 9), end: new Date(2026, 5, 15, 10) },
  ...Array.from({ length: 8 }, (_, index) => ({ id: `all-${index}`, title: `All-day event ${index + 1}`, start: date, end: new Date(2026, 5, 16), allDay: true }))
];

export async function checkCalendarScrolling(canvasElement) {
  const host = canvasElement.ownerDocument.createElement('div');
  host.style.width = '256px';
  host.style.maxWidth = '100%';
  canvasElement.append(host);
  const root = createRoot(host);
  try {
    for (const view of ['week', 'resource']) {
      for (const mode of ['custom', 'native', 'page']) {
        await act(async () => root.render(
          <EventCalendar key={`${view}-${mode}`} defaultView={view} defaultDate={date} resources={resources}
            scrollMode={mode === 'page' ? 'page' : 'contained'} scrollbars={mode === 'native' ? 'native' : 'custom'}
            className={mode === 'page' ? undefined : 'h-80'}>
            <EventCalendarContent />
          </EventCalendar>
        ));
        const viewport = host.querySelector('[data-slot="scroll-area-viewport"]');
        await waitFor(() => expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth));
        const columns = host.querySelectorAll('[data-slot="event-calendar-day-column"]');
        const headers = host.querySelectorAll(`[data-slot="event-calendar-${view === 'week' ? 'day' : 'resource'}-header"]`);
        expect(headers.length).toBe(columns.length);
        for (const column of columns) expect(column.getBoundingClientRect().width).toBeGreaterThanOrEqual(127);
        if (mode === 'page') expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.clientHeight + 1);
        viewport.scrollLeft = viewport.scrollWidth;
        await waitFor(() => {
          expect(viewport.scrollLeft).toBeGreaterThan(0);
          columns.forEach((column, index) => {
            expect(Math.abs(headers[index].getBoundingClientRect().left - column.getBoundingClientRect().left)).toBeLessThan(1);
          });
          expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth + 1);
        });
      }
    }
    await act(async () => root.render(
      <EventCalendar key='compact-month' defaultView='month' defaultDate={date} className='h-120' showDayAddButton defaultEvents={monthEvents}>
        <EventCalendarContent />
      </EventCalendar>
    ));
    const more = await within(host).findByRole('button', { name: '+9 more' });
    await expect(more).toHaveTextContent('+9');
    await expect(host.querySelector('[data-slot="event-calendar-event"]')).toBeNull();
    for (const button of host.querySelectorAll('[data-slot="event-calendar-day-add"]')) {
      const bounds = button.getBoundingClientRect();
      const cell = button.closest('[data-slot="event-calendar-month-cell"]').getBoundingClientRect();
      expect(bounds.left).toBeGreaterThanOrEqual(cell.left);
      expect(bounds.right).toBeLessThanOrEqual(cell.right);
    }
    await userEvent.click(more);
    await waitFor(() => expect(within(document.body).getByRole('button', { name: /^Design review with/ })).toBeVisible());
    const event = within(document.body).getByRole('button', { name: /^Design review with/ });
    const title = event.querySelector('[data-slot="event-calendar-event-title"]');
    await expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth + 1);
    await expect(getComputedStyle(event).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(more).toHaveFocus());
    host.style.width = '900px';
    await waitFor(() => {
      const trigger = host.querySelector('[data-slot="event-calendar-more"]');
      const bounds = trigger.getBoundingClientRect();
      const content = trigger.parentElement.getBoundingClientRect();
      expect(bounds.bottom).toBeLessThanOrEqual(content.bottom + 1);
    });
  } finally {
    await act(async () => root.unmount());
    host.remove();
  }
}
