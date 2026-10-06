import { useEffect } from 'react';
import { act } from '../../../../../tests/support/reactAct.js';
import { createRoot } from 'react-dom/client';
import { expect, fireEvent, fn, within } from 'storybook/test';
import { EventCalendar, useEventCalendar, useEventCalendarGestures } from '../index.js';
import Button from '../../Button/index.js';

const firstDay = new Date('2026-06-15T00:00:00Z');
const secondDay = new Date('2026-06-16T00:00:00Z');
const event = { id: 'appointment', title: 'Appointment', start: firstDay, end: secondDay, allDay: true };

function GestureSurface({ onReady, resources }) {
  const calendar = useEventCalendar();
  const gestures = useEventCalendarGestures();
  useEffect(() => { onReady(calendar); }, [calendar, onReady]);
  const occurrence = calendar.api.getOccurrences()[0];
  return <div data-slot='event-calendar-month-view' className='flex'>
    {[firstDay, secondDay].map((day, index) => <div key={day.toISOString()} data-ec-day={resources ? firstDay.getTime() : day.getTime()} data-ec-resource={resources ? `room-${index}` : undefined} className='h-24 min-w-0 flex-1' onPointerDown={e => gestures.beginCreate(e, resources ? firstDay : day, true)}>
      {index === 0 && <Button data-slot='event-calendar-event' onPointerDown={e => { e.stopPropagation(); gestures.beginMove(e, { occurrence }); }}>Appointment</Button>}
    </div>)}
  </div>;
}

export async function checkCalendarGestures(canvasElement) {
  const host = canvasElement.ownerDocument.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  let calendar;
  const onReady = value => { calendar = value; };
  const onEventsChange = fn();
  const onSelectSlot = fn();
  const render = props => act(async () => root.render(<EventCalendar key={props.mode} defaultDate={firstDay} defaultEvents={[{ ...event, readOnly: props.readOnly }]} timeZone='UTC' onEventsChange={onEventsChange} onSelectSlot={onSelectSlot} {...props}><GestureSurface onReady={onReady} resources={props.mode === 'resources'} /></EventCalendar>));
  const pointer = (target, type, x, y) => fireEvent[type](target, { button: 0, pointerId: 71, pointerType: 'mouse', clientX: x, clientY: y });
  const document = canvasElement.ownerDocument;
  const body = document.body;
  const original = { cursor: body.style.cursor, userSelect: body.style.userSelect, webkitUserSelect: body.style.webkitUserSelect };
  try {
    await render({ mode: 'blocked-drop', canDropEvent: () => false });
    let cells = [...host.querySelectorAll('[data-ec-day]')];
    let from = cells[0].getBoundingClientRect();
    let to = cells[1].getBoundingClientRect();
    await pointer(within(host).getByRole('button'), 'pointerDown', from.left + 12, from.top + 12);
    await pointer(document.defaultView, 'pointerMove', to.left + 12, to.top + 12);
    await expect(calendar.getState().drag?.valid).toBe(false);
    await pointer(document.defaultView, 'pointerUp', to.left + 12, to.top + 12);
    await expect(onEventsChange).not.toHaveBeenCalled();
    await expect(calendar.api.getEvents()[0].start.getTime()).toBe(firstDay.getTime());

    await render({ mode: 'blocked-slot', canSelectSlot: slot => slot.end <= secondDay });
    cells = [...host.querySelectorAll('[data-ec-day]')];
    from = cells[0].getBoundingClientRect();
    to = cells[1].getBoundingClientRect();
    await pointer(cells[0], 'pointerDown', from.left + 12, from.bottom - 12);
    await pointer(document.defaultView, 'pointerMove', from.left + 30, from.bottom - 12);
    await expect(calendar.getState().slotDraft).not.toBeNull();
    await pointer(document.defaultView, 'pointerMove', to.left + 12, to.bottom - 12);
    await pointer(document.defaultView, 'pointerUp', to.left + 12, to.bottom - 12);
    await expect(onSelectSlot).not.toHaveBeenCalled();
    await expect(calendar.getState().slotDraft).toBeNull();

    await render({ mode: 'resources' });
    cells = [...host.querySelectorAll('[data-ec-day]')];
    from = cells[0].getBoundingClientRect();
    to = cells[1].getBoundingClientRect();
    await pointer(within(host).getByRole('button'), 'pointerDown', from.left + 12, from.top + 12);
    await pointer(document.defaultView, 'pointerMove', to.left + 12, to.top + 12);
    await pointer(document.defaultView, 'pointerUp', to.left + 12, to.top + 12);
    await expect(calendar.api.getEvents()[0].resourceId).toBe('room-1');
    await pointer(cells[1], 'pointerDown', to.left + 12, to.bottom - 12);
    await pointer(document.defaultView, 'pointerMove', to.left + 30, to.bottom - 12);
    await pointer(document.defaultView, 'pointerUp', to.left + 30, to.bottom - 12);
    await expect(onSelectSlot.mock.lastCall[0].resourceId).toBe('room-1');

    await render({ mode: 'read-only', readOnly: true });
    const chip = within(host).getByRole('button');
    from = chip.getBoundingClientRect();
    body.style.cursor = 'crosshair';
    body.style.userSelect = 'text';
    await pointer(chip, 'pointerDown', from.left + 8, from.top + 8);
    await pointer(document.defaultView, 'pointerMove', from.left + 30, from.top + 8);
    await expect(body.style.cursor).toBe('not-allowed');
    await act(async () => root.render(null));
    await expect(body.style.cursor).toBe('crosshair');
    await expect(body.style.userSelect).toBe('text');
    await expect(body).not.toHaveClass('ec-drag-blocked');
  } finally {
    await act(async () => root.unmount());
    Object.assign(body.style, original);
    host.remove();
  }
}
