'use client';
import { useEffect, useState } from 'react';
import { useGanttSettings } from '../Gantt.jsx';
import { toZoned } from '../ganttModel.jsx';
import { format } from 'date-fns';
import { observeResize } from '../../../../utilities/observeResize.js';
import { default as Button } from '../../Button/index.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../Tooltip/TooltipPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { getPaneViewport, getScrollStart } from '../ganttViewModel.js';
function sameChips(a, b) {
  return (
    a.length === b.length &&
    a.every(
      (chip, i) =>
        chip.id === b[i].id &&
        chip.side === b[i].side &&
        chip.top === b[i].top &&
        chip.target === b[i].target &&
        chip.label === b[i].label &&
        chip.color === b[i].color &&
        chip.startMs === b[i].startMs
    )
  );
}
function GanttOffscreenChips({ paneRef, occurrences, locale, refreshKey }) {
  const settings = useGanttSettings();
  const [chips, setChips] = useState([]);
  useEffect(() => {
    const pane = paneRef.current;
    const viewport = getPaneViewport(pane);
    if (!pane || !viewport) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const paneRect = pane.getBoundingClientRect();
      const header = viewport.querySelector(
        '[data-slot=gantt-timeline-header]'
      );
      const headerBottom = header
        ? header.getBoundingClientRect().bottom - paneRect.top
        : 0;
      const trackW = viewport.scrollWidth;
      const visibleStart = getScrollStart(viewport);
      const visibleEnd = visibleStart + viewport.clientWidth;
      const zoomEl = pane.querySelector('[data-slot=gantt-zoom]');
      const zoom = zoomEl
        ? {
            top: zoomEl.getBoundingClientRect().top - paneRect.top - 8,
            bottom: zoomEl.getBoundingClientRect().bottom - paneRect.top + 8
          }
        : null;
      let chipInZoomBand = false;
      const next = [];
      for (const rowEl of viewport.querySelectorAll('[data-gantt-row]')) {
        const from = parseFloat(rowEl.dataset.ganttBarMin ?? '');
        const to = parseFloat(rowEl.dataset.ganttBarMax ?? '');
        if (Number.isNaN(from) || Number.isNaN(to)) continue;
        const rect = rowEl.getBoundingClientRect();
        const top = rect.top - paneRect.top + rect.height / 2;
        if (top < headerBottom + 10 || top > paneRect.height - 16) continue;
        const startPx = from * trackW;
        const endPx = to * trackW;
        const startMs = parseFloat(rowEl.dataset.ganttBarStartMs ?? '');
        const base = {
          id: rowEl.dataset.ganttRowId ?? '',
          top: Math.round(top),
          color: rowEl.dataset.ganttBarColor,
          label: rowEl.dataset.ganttBarLabel ?? '',
          startMs: Number.isNaN(startMs) ? null : startMs
        };
        if (endPx <= visibleStart + 2) {
          next.push({
            ...base,
            side: 'start',
            target: startPx - 24
          });
        } else if (startPx >= visibleEnd - 2) {
          if (zoom && top >= zoom.top && top <= zoom.bottom) {
            chipInZoomBand = true;
          }
          next.push({
            ...base,
            side: 'end',
            target: endPx - viewport.clientWidth + 24
          });
        }
      }
      zoomEl?.style.setProperty(
        '--gantt-zoom-shift',
        chipInZoomBand ? '28px' : '0px'
      );
      setChips((prev) => (sameChips(prev, next) ? prev : next));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    viewport.addEventListener('scroll', schedule);
    // A resize measures now, superseding any scroll-scheduled frame.
    const observer = observeResize(() => {
      cancelAnimationFrame(raf);
      measure();
    });
    observer.observe(viewport);
    schedule();
    return () => {
      viewport.removeEventListener('scroll', schedule);
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      pane
        .querySelector('[data-slot=gantt-zoom]')
        ?.style.removeProperty('--gantt-zoom-shift');
    };
  }, [paneRef, occurrences, refreshKey]);
  if (chips.length === 0) return null;
  const scrollTo = (chip) => {
    const viewport = getPaneViewport(paneRef.current);
    if (!viewport) return;
    const target = Math.max(0, chip.target);
    viewport.scrollTo({
      // chip targets are distances from the inline start; RTL signs them
      left: getComputedStyle(viewport).direction === 'rtl' ? -target : target,
      behavior: 'smooth'
    });
    const bar = viewport.querySelector(
      `[data-gantt-row-id="${CSS.escape(chip.id)}"] [data-slot=gantt-bar]`
    );
    bar?.focus({ preventScroll: true });
  };
  return (
    <div
      data-slot='gantt-offscreen-chips'
      className='pointer-events-none absolute inset-0 z-30 overflow-hidden'
    >
      <TooltipProvider delayDuration={600} skipDelayDuration={300}>
        {chips.map((chip) => (
          <Tooltip key={`${chip.id}-${chip.side}`}>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                tone='neutral'
                size='icon-xs'
                radius='full'
                data-slot='gantt-offscreen-chip'
                data-side={chip.side}
                aria-label={settings.i18n.labels.jumpToBar(chip.label)}
                className='bg-ui-background text-ui-muted-foreground hover:text-ui-foreground pointer-events-auto absolute size-5 min-h-5 -translate-y-1/2 shadow-xs'
                style={{
                  top: chip.top,
                  ...(chip.side === 'start'
                    ? { insetInlineStart: '0.5rem' }
                    : { insetInlineEnd: '0.875rem' })
                }}
                onClick={() => scrollTo(chip)}
              >
                {chip.side === 'start' ? (
                  <RegistryIcon
                    lucide='ChevronLeftIcon'
                    className='size-3 rtl:rotate-180'
                    aria-hidden='true'
                  />
                ) : (
                  <RegistryIcon
                    lucide='ChevronRightIcon'
                    className='size-3 rtl:rotate-180'
                    aria-hidden='true'
                  />
                )}
                <span
                  aria-hidden
                  className='ring-ui-background absolute -end-px -top-px size-1.5 rounded-full ring-1'
                  style={{ background: chip.color ?? 'var(--ds-color-accent)' }}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side={chip.side === 'start' ? 'right' : 'left'}>
              <div className='font-medium'>{chip.label}</div>
              {chip.startMs !== null && (
                <div className='opacity-80'>
                  {/* zoned: the chip must name the same day the grid shows */}
                  {format(
                    toZoned(new Date(chip.startMs), settings.timeZone),
                    'MMM d, yyyy',
                    { locale }
                  )}
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
export { GanttOffscreenChips };
