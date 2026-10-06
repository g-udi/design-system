import { useEffect, useRef } from 'react';
import { observeResize } from '../../../../utilities/observeResize.js';
import { toZoned } from '../eventCalendarModel.jsx';

/** Keep the fixed day/resource headers aligned with their shared scroll viewport. */
export function useEventCalendarScroll({ instance, contained, timeZone, startHour, interval, scrollToHour, scrollbars }) {
  const scrollRef = useRef(null);
  useEffect(() => {
    const element = scrollRef.current;
    const viewport = element?.querySelector('[data-slot=scroll-area-viewport]');
    if (!viewport) return;
    const root = element.closest('[data-slot=event-calendar-time-grid], [data-slot=event-calendar-resource-view]');
    const scrollTo = minutes => {
      const slot = element.querySelector('[data-slot=event-calendar-time-gutter] > div');
      const pxPerMinute = (slot?.getBoundingClientRect().height || 64) / interval;
      viewport.scrollTo({ top: Math.max(0, (minutes - startHour * 60) * pxPerMinute - 12) });
    };
    if (contained) {
      scrollTo(scrollToHour * 60);
      instance.internals.registerScrollHandler(time => {
        const zoned = typeof time === 'number' ? null : toZoned(time, timeZone);
        scrollTo(zoned ? zoned.getHours() * 60 + zoned.getMinutes() : time);
      });
    }
    const syncHeader = () => {
      root?.style.setProperty('--ec-scroll-x', `${viewport.scrollLeft}px`);
      root?.style.setProperty('--ec-scrollbar-w', `${viewport.offsetWidth - viewport.clientWidth}px`);
    };
    syncHeader();
    viewport.addEventListener('scroll', syncHeader, { passive: true });
    const observer = observeResize(syncHeader);
    observer.observe(viewport);
    return () => {
      if (contained) instance.internals.registerScrollHandler(null);
      viewport.removeEventListener('scroll', syncHeader);
      observer.disconnect();
      root?.style.removeProperty('--ec-scroll-x');
      root?.style.removeProperty('--ec-scrollbar-w');
    };
  }, [contained, instance, timeZone, startHour, interval, scrollToHour, scrollbars]);
  return scrollRef;
}
