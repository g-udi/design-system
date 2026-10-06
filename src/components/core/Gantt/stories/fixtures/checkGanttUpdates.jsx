import { createRoot } from 'react-dom/client';
import { expect, fireEvent, fn, waitFor, within } from 'storybook/test';
import { Gantt, GanttView } from '@gaudi/design-system/core/Gantt';

const day = (value) => new Date(2026, 5, value);
const resources = [{ id: 'work', title: 'Work' }];

export async function checkGanttUpdates(canvasElement) {
  const document = canvasElement.ownerDocument;
  const host = document.createElement('div');
  host.style.cssText = 'width:400px;max-width:100%;height:300px';
  canvasElement.append(host);
  const root = createRoot(host);
  const event = { id: 'work', resourceId: 'work', title: 'Original task', color: '#2563eb', start: day(27), end: day(29), allDay: true };
  const render = (events, extra = {}) => root.render(
    <Gantt events={events} resources={resources} defaultDate={day(15)} defaultScale='month' infiniteScroll={false} scrollbars='native' displayScheduleHint treePanel={{ width: 120, minWidth: 100 }} className='h-full' {...extra}>
      <GanttView />
    </Gantt>
  );
  try {
    render([event]);
    await waitFor(() => expect(host.querySelector('[data-slot=gantt-timeline-pane] [data-gantt-native-scroll]')).not.toBeNull());
    const viewport = host.querySelector('[data-slot=gantt-timeline-pane] [data-gantt-native-scroll]');
    viewport.scrollLeft = 0;
    await fireEvent.scroll(viewport);
    const chip = await within(host).findByRole('button', { name: 'Scroll to "Original task"' });
    const initialScroll = viewport.scrollLeft;
    render([{ ...event, title: 'Renamed task', color: '#e11d48' }]);
    await waitFor(() => expect(chip).toHaveAccessibleName('Scroll to "Renamed task"'));
    await expect(chip.querySelector('span[aria-hidden]')).toHaveStyle({ backgroundColor: 'rgb(225, 29, 72)' });
    await expect(viewport.scrollLeft).toBe(initialScroll);
    host.dir = 'rtl';
    await waitFor(() => expect(getComputedStyle(chip.querySelector('svg')).rotate).toBe('180deg'));

    host.dir = 'ltr';
    const onSelectSlot = fn();
    const canSelectSlot = ({ start, end }) => end - start <= 2 * 86400000;
    render([], { onSelectSlot, canSelectSlot, dragCreate: true });
    await waitFor(() => expect(host.querySelector('[data-gantt-row] [data-slot=gantt-bar]')).toBeNull());
    viewport.scrollLeft = 0;
    const row = host.querySelector('[data-gantt-row]');
    const axis = host.querySelector('[data-gantt-axis]');
    const rect = axis.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const pixelsPerDay = rect.width / ((Number(axis.dataset.ganttRangeEnd) - Number(axis.dataset.ganttRangeStart)) / 86400000);
    const pointer = { pointerId: 89, button: 0, pointerType: 'mouse', clientX: rect.left + pixelsPerDay * 0.25, clientY: rowRect.top + rowRect.height / 2 };
    await fireEvent.pointerMove(row, pointer);
    await waitFor(() => expect(host.querySelector('[data-slot=gantt-schedule-hint]')).not.toBeNull());
    render([], { onSelectSlot, canSelectSlot, interactions: { selectSlot: false } });
    await waitFor(() => expect(host.querySelector('[data-slot=gantt-schedule-hint]')).toBeNull());
    render([], { onSelectSlot, canSelectSlot, dragCreate: true, 'data-phase': 'drag' });
    await waitFor(() => expect(host.firstElementChild).toHaveAttribute('data-phase', 'drag'));
    await fireEvent.pointerDown(row, pointer);
    await fireEvent.pointerMove(document.defaultView, { ...pointer, clientX: pointer.clientX + pixelsPerDay });
    await waitFor(() => expect(host.querySelector('[data-slot=gantt-slot-draft]')).not.toBeNull());
    await fireEvent.pointerMove(document.defaultView, { ...pointer, clientX: pointer.clientX + pixelsPerDay * 4 });
    await waitFor(() => expect(host.querySelector('[data-slot=gantt-slot-draft]')).toBeNull());
    await fireEvent.pointerUp(document.defaultView, pointer);
    await expect(onSelectSlot).not.toHaveBeenCalled();

    for (const guard of ['policy', 'disabled', 'allowed']) {
      render([], { onSelectSlot, canSelectSlot, dragCreate: true, 'data-phase': 'start' });
      await waitFor(() => expect(host.firstElementChild).toHaveAttribute('data-phase', 'start'));
      await fireEvent.pointerDown(row, pointer);
      await fireEvent.pointerMove(document.defaultView, { ...pointer, clientX: pointer.clientX + pixelsPerDay });
      await waitFor(() => expect(host.querySelector('[data-slot=gantt-slot-draft]')).not.toBeNull());
      render([], {
        onSelectSlot, dragCreate: true, 'data-phase': guard,
        canSelectSlot: guard === 'policy' ? () => false : canSelectSlot,
        interactions: { selectSlot: guard !== 'disabled' }
      });
      await waitFor(() => expect(host.firstElementChild).toHaveAttribute('data-phase', guard));
      await fireEvent.pointerUp(document.defaultView, pointer);
      await expect(onSelectSlot).toHaveBeenCalledTimes(guard === 'allowed' ? 1 : 0);
      await expect(host.querySelector('[data-slot=gantt-slot-draft]')).toBeNull();
    }
    host.dir = 'rtl';
    const now = new Date();
    render([{ ...event, title: 'Default color', color: undefined, start: now, end: new Date(+now + 86400000) }], { date: now, timelineLines: { vertical: 'dashed' }, offDays: true, 'data-phase': 'now' });
    await waitFor(() => {
      const dot = host.querySelector('[data-slot=gantt-now-dot]');
      const line = host.querySelector('[data-slot=gantt-now-indicator]');
      expect(dot).not.toBeNull();
      expect(line).not.toBeNull();
      const dotRect = dot.getBoundingClientRect();
      const lineRect = line.getBoundingClientRect();
      expect(Math.abs(dotRect.left + dotRect.width / 2 - lineRect.left - lineRect.width / 2)).toBeLessThanOrEqual(1);
    });
    const defaultBar = host.querySelector('[data-slot=gantt-bar]');
    await expect(getComputedStyle(defaultBar).getPropertyValue('--gantt-event-color').trim()).not.toBe('');
    await expect(getComputedStyle(defaultBar).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(host.querySelector('[data-slot=gantt-grid-line]')).backgroundImage).not.toBe('none');
    render([], { loading: true });
    const loading = await within(host).findByRole('status');
    await expect(loading).toHaveTextContent('Loading events');
    await expect(host.querySelector('[data-slot=gantt-view]')).toHaveAttribute('aria-busy', 'true');
    const loadingText = loading.querySelector('span');
    for (const animation of loadingText.getAnimations()) {
      animation.pause();
      animation.currentTime = 1000;
    }
    await expect(getComputedStyle(loadingText).opacity).toBe('1');
    await expect(loading.querySelector('[data-slot=loader]')).toBeVisible();
    render([], { loading: false });
    await waitFor(() => expect(host.querySelector('[data-slot=gantt-loading]')).toBeNull());
  } finally {
    await fireEvent.pointerCancel(document.defaultView, { pointerId: 89 });
    root.unmount();
    host.remove();
  }
}
