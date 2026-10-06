'use client';
import { useNow } from '../../../../hooks/shared/use-now.js';
import { useEventCalendarScroll } from '../hooks/use-event-calendar-scroll.js';
import { useMemo } from 'react';
import {
  EventCalendarViewContext,
  useEventCalendar,
  useEventCalendarDay,
  useEventCalendarSelector,
  useEventCalendarSettings,
  useEventCalendarViewConfig,
  useEventCalendarViewContext,
  useEventCalendarViewSettings
} from '../EventCalendar.jsx';
import {
  useEventCalendarGestures,
  wasRecentChipPress,
  wasRecentDrag
} from './EventCalendarDnd.jsx';
import {
  EVENT_CALENDAR_GHOST,
  EVENT_CALENDAR_SLOT_DRAFT,
  EventCalendarEvent
} from './EventCalendarEvent.jsx';
import {
  getDayKey,
  getDayTotalMinutes,
  getRangeKey,
  packTimedSegments,
  resolveOffDay,
  snapMinutes,
  toZoned,
  zonedStartOfDay
} from '../eventCalendarModel.jsx';
import { addDays, addMinutes, differenceInMinutes, format } from 'date-fns';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
import { ScrollArea, ScrollBar } from '../../ScrollArea/ScrollArea.jsx';

const EMPTY_ALL_DAY_SEGMENTS = [];
function EventCalendarTimeGrid({
  view,
  className,
  asChild = false,
  dayStartHour,
  dayEndHour,
  showAllDay = true,
  interval: intervalProp,
  style,
  ...props
}) {
  const instance = useEventCalendar();
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const visibleRange = useEventCalendarSelector((state) => state.visibleRange, {
    isEqual: (a, b) => getRangeKey(a) === getRangeKey(b)
  });
  const startHour = dayStartHour ?? settings.dayStartHour;
  const endHour = dayEndHour ?? settings.dayEndHour;
  const interval = Math.min(
    Math.max(intervalProp ?? viewConfig.interval, 5),
    240
  );
  const contained = viewConfig.scrollMode !== 'page';
  const { effective } = useEventCalendarViewSettings();
  const days = useMemo(() => {
    const result = [];
    let cursor = zonedStartOfDay(visibleRange.start, settings.timeZone);
    while (cursor < visibleRange.end) {
      result.push(cursor);
      cursor = zonedStartOfDay(
        addDays(toZoned(cursor, settings.timeZone), 1),
        settings.timeZone
      );
    }
    if (effective.weekends || view === 'day') return result;
    const filtered = result.filter(
      (day) =>
        !settings.weekendDays.includes(toZoned(day, settings.timeZone).getDay())
    );
    return filtered.length ? filtered : result;
  }, [
    visibleRange,
    settings.timeZone,
    settings.weekendDays,
    effective.weekends,
    view
  ]);
  const scrollRef = useEventCalendarScroll({
    instance, contained, timeZone: settings.timeZone, startHour, interval,
    scrollToHour: viewConfig.scrollToHour, scrollbars: viewConfig.scrollbars
  });
  const slots = useMemo(() => {
    const result = [];
    for (let m = startHour * 60; m < endHour * 60; m += interval) {
      result.push(m);
    }
    return result;
  }, [startHour, endHour, interval]);
  const allDaySegments = useEventCalendarSelector(
    () => {
      if (!viewConfig.renderAllDaySection) return EMPTY_ALL_DAY_SEGMENTS;
      const byDay = instance.internals.getIndex().byDay;
      const result = days.flatMap(
        (day) => byDay.get(getDayKey(day, settings.timeZone))?.allDay ?? []
      );
      return result.length ? result : EMPTY_ALL_DAY_SEGMENTS;
    },
    {
      isEqual: (a, b) =>
        a === b ||
        (a.length === b.length && a.every((segment, i) => segment === b[i]))
    }
  );
  const gridTemplateColumns = `repeat(${days.length}, minmax(var(--ec-day-col-min,8rem), 1fr))`;
  const track = (
    <div className='relative flex' style={{ minWidth: `calc(var(--ec-gutter-width, 4.5rem) + ${days.length} * var(--ec-day-col-min, 8rem))` }}>
      <EventCalendarTimeGutter
        days={days}
        slots={slots}
        startHour={startHour}
        interval={interval}
      />
      <div className='grid min-w-0 flex-1' style={{ gridTemplateColumns }}>
        {days.map((day) => (
          <EventCalendarDayColumn
            key={day.getTime()}
            day={day}
            startHour={startHour}
            endHour={endHour}
            interval={interval}
          />
        ))}
      </div>
      {effective.nowIndicator && (
        <EventCalendarNowIndicator
          days={days}
          startHour={startHour}
          endHour={endHour}
        />
      )}
    </div>
  );
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <EventCalendarViewContext.Provider value={{ view }}>
      <Comp
        data-slot='event-calendar-time-grid'
        data-view={view}
        className={cn(
          'flex min-w-0 flex-col border-t',
          contained ? 'min-h-0 flex-1 overflow-hidden' : 'overflow-x-clip',
          viewConfig.classNames?.timeGrid,
          className
        )}
        style={{ '--ec-hour-height': '4rem', ...style }}
        {...props}
      >
        {/* Day-header row (sticky below the nav in page scroll mode) */}
        <div
          style={{ translate: 'calc(-1 * var(--ec-scroll-x, 0px)) 0' }}
          className={cn(
            'flex border-b pe-(--ec-scrollbar-w,0px)',
            !contained &&
              'bg-ui-background sticky top-(--ec-sticky-offset,0px) z-20',
            viewConfig.classNames?.timeGridHeader
          )}
        >
          <div className='w-(--ec-gutter-width,4.5rem) shrink-0 border-e' />
          <div className='grid min-w-0 flex-1' style={{ gridTemplateColumns }}>
            {days.map((day) => (
              <EventCalendarDayHeader
                key={day.getTime()}
                day={day}
                view={view}
              />
            ))}
          </div>
        </div>
        {/* All-day row */}
        {showAllDay && (
          <div
            data-slot='event-calendar-all-day-section'
            style={{ translate: 'calc(-1 * var(--ec-scroll-x, 0px)) 0' }}
            className={cn(
              'flex border-b pe-(--ec-scrollbar-w,0px)',
              viewConfig.classNames?.allDaySection
            )}
          >
            {viewConfig.renderAllDaySection?.({
              days,
              segments: allDaySegments
            }) ?? (
              <>
                <div
                  className={cn(
                    // pt-1.5 matches the bar overlay's top inset; the inner box
                    // is one bar-row tall and centers the label so it sits on
                    // the SAME baseline as the first all-day chip and stays top-
                    // aligned when the chips wrap onto more lanes
                    'text-ui-muted-foreground w-(--ec-gutter-width,4.5rem) shrink-0 border-e ps-2 pe-2.5 pt-1.5',
                    viewConfig.classNames?.allDayLabel
                  )}
                >
                  <span className='flex h-[calc(var(--ec-month-bar-h,1.625rem)-0.125rem)] items-center justify-end'>
                    {settings.i18n.labels.allDay}
                  </span>
                </div>
                <EventCalendarAllDayBars
                  days={days}
                  gridTemplateColumns={gridTemplateColumns}
                />
              </>
            )}
          </div>
        )}
        {/* Time track: internal scroll (contained) or document flow (page) */}
        <div ref={scrollRef} className={cn('min-w-0', contained && 'min-h-0 flex-1')}>
            {!contained || viewConfig.scrollbars === 'native' ? (
              <div
                data-slot='scroll-area-viewport'
                data-ec-native-scroll=''
                className={cn('overflow-auto', contained && 'h-full')}
              >
                {track}
              </div>
            ) : (
              <ScrollArea className='h-full'>{track}<ScrollBar orientation='horizontal' /></ScrollArea>
            )}
          </div>
      </Comp>
    </EventCalendarViewContext.Provider>
  );
}
function EventCalendarDayHeader({ day, view }) {
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const { isToday } = useEventCalendarDay(day);
  return (
    <div
      data-slot='event-calendar-day-header'
      data-today={isToday || void 0}
      className={cn(
        'data-today:text-ui-primary min-w-0 truncate border-e px-2 py-1.5 font-medium last:border-e-0',
        isToday && viewConfig.todayClassName
      )}
    >
      {viewConfig.renderDayHeader?.({ day, view, isToday }) ??
        format(
          toZoned(day, settings.timeZone),
          settings.i18n.formats.timeGridDayHeader,
          { locale: settings.locale }
        )}
    </div>
  );
}
function useEventCalendarAllDayBars(days) {
  const instance = useEventCalendar();
  const settings = useEventCalendarSettings();
  return useEventCalendarSelector(
    () => {
      const byDay = instance.internals.getIndex().byDay;
      const merged = new Map();
      days.forEach((day, col) => {
        for (const seg of byDay.get(getDayKey(day, settings.timeZone))
          ?.allDay ?? []) {
          const key = seg.occurrence.key;
          const bar = merged.get(key);
          if (bar) {
            bar.colEnd = col;
            bar.isEnd = seg.isEnd;
          } else {
            merged.set(key, {
              seg,
              colStart: col,
              colEnd: col,
              isStart: seg.isStart,
              isEnd: seg.isEnd,
              lane: 0
            });
          }
        }
      });
      const packed = Array.from(merged.values()).sort(
        (a, b) =>
          a.colStart - b.colStart ||
          b.colEnd - b.colStart - (a.colEnd - a.colStart) ||
          a.seg.occurrence.key.localeCompare(b.seg.occurrence.key)
      );
      const lanes = [];
      for (const bar of packed) {
        let lane = 0;
        for (;;) {
          lanes[lane] ??= new Array(days.length).fill(false);
          let free = true;
          for (let c = bar.colStart; c <= bar.colEnd; c++) {
            if (lanes[lane][c]) {
              free = false;
              break;
            }
          }
          if (free) break;
          lane++;
        }
        for (let c = bar.colStart; c <= bar.colEnd; c++) lanes[lane][c] = true;
        bar.lane = lane;
      }
      return {
        bars: packed.map((bar) => ({
          ...bar.seg,
          isStart: bar.isStart,
          isEnd: bar.isEnd,
          continuesBefore: !bar.isStart,
          continuesAfter: !bar.isEnd,
          colStart: bar.colStart,
          colSpan: bar.colEnd - bar.colStart + 1,
          lane: bar.lane
        })),
        laneCount: lanes.length
      };
    },
    {
      calendar: instance,
      isEqual: (a, b) =>
        a.laneCount === b.laneCount &&
        a.bars.length === b.bars.length &&
        a.bars.every((s, i) => {
          const o = b.bars[i];
          return (
            s.occurrence === o.occurrence &&
            s.colStart === o.colStart &&
            s.colSpan === o.colSpan &&
            s.lane === o.lane &&
            s.isStart === o.isStart &&
            s.isEnd === o.isEnd
          );
        })
    }
  );
}
function EventCalendarAllDayBars({ days, gridTemplateColumns }) {
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const { bars, laneCount } = useEventCalendarAllDayBars(days);
  const dragGhost = useEventCalendarSelector(
    (state) => {
      const drag = state.drag;
      if (!drag || !drag.proposedDayGranular) return null;
      const tz = settings.timeZone;
      const startMs = zonedStartOfDay(drag.proposedStart, tz).getTime();
      const lastMs = zonedStartOfDay(
        new Date(drag.proposedEnd.getTime() - 1),
        tz
      ).getTime();
      let colStart = -1;
      let colEnd = -1;
      days.forEach((day, i) => {
        const t = zonedStartOfDay(day, tz).getTime();
        if (t >= startMs && t <= lastMs) {
          if (colStart === -1) colStart = i;
          colEnd = i;
        }
      });
      if (colStart === -1) return null;
      return {
        kind: drag.kind,
        valid: drag.valid,
        occurrence: drag.occurrence,
        proposedStart: drag.proposedStart,
        proposedEnd: drag.proposedEnd,
        colStart,
        colSpan: colEnd - colStart + 1,
        isStart: zonedStartOfDay(days[colStart], tz).getTime() <= startMs,
        isEnd: zonedStartOfDay(days[colEnd], tz).getTime() >= lastMs,
        color: drag.occurrence.event.color
      };
    },
    {
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.colStart === b.colStart &&
          a.colSpan === b.colSpan &&
          a.valid === b.valid &&
          a.kind === b.kind &&
          a.proposedStart.getTime() === b.proposedStart.getTime() &&
          a.proposedEnd.getTime() === b.proposedEnd.getTime())
    }
  );
  const ghostLane = dragGhost
    ? (bars.find((s) => s.occurrence.key === dragGhost.occurrence.key)?.lane ??
      laneCount)
    : 0;
  const effectiveLanes = Math.max(laneCount, dragGhost ? ghostLane + 1 : 0);
  return (
    <div className='relative min-w-0 flex-1'>
      <div
        className='grid h-full'
        style={{
          gridTemplateColumns,
          // always reserve at least one bar row so the all-day row keeps the
          // same height whether or not the day has all-day events (an empty
          // row would otherwise collapse to the label height and misalign)
          minHeight: `calc(${Math.max(effectiveLanes, 1)} * var(--ec-month-bar-h, 1.625rem) + 0.625rem)`
        }}
      >
        {days.map((day) => (
          <EventCalendarAllDayCell key={day.getTime()} day={day} />
        ))}
      </div>
      {(bars.length > 0 || dragGhost) && (
        <div
          data-slot='event-calendar-all-day-bar-overlay'
          className='pointer-events-none absolute inset-x-0 top-0 grid pt-1.5'
          style={{
            gridTemplateColumns,
            gridAutoRows: 'var(--ec-month-bar-h, 1.625rem)'
          }}
        >
          {bars.map((segment) => (
            <div
              key={segment.occurrence.key}
              className={cn(
                'pointer-events-auto min-w-0 px-1',
                viewConfig.classNames?.monthBar
              )}
              style={{
                gridColumn: `${(segment.colStart ?? 0) + 1} / span ${segment.colSpan ?? 1}`,
                gridRow: (segment.lane ?? 0) + 1
              }}
            >
              <EventCalendarEvent
                segment={segment}
                className='h-[calc(var(--ec-month-bar-h,1.625rem)-0.125rem)]'
              />
            </div>
          ))}
          {dragGhost && (
            <div
              aria-hidden
              className={cn('min-w-0 px-1', viewConfig.classNames?.monthBar)}
              style={{
                gridColumn: `${dragGhost.colStart + 1} / span ${dragGhost.colSpan}`,
                gridRow: ghostLane + 1
              }}
            >
              <div
                data-slot='event-calendar-drag-ghost'
                data-kind={dragGhost.kind}
                data-drop-invalid={!dragGhost.valid || void 0}
                className={cn(
                  'h-[calc(var(--ec-month-bar-h,1.625rem)-0.125rem)]',
                  dragGhost.kind === 'move'
                    ? cn(
                        EVENT_CALENDAR_GHOST.move,
                        !dragGhost.valid && EVENT_CALENDAR_GHOST.invalid
                      )
                    : cn(
                        EVENT_CALENDAR_GHOST.resize,
                        !dragGhost.valid && EVENT_CALENDAR_GHOST.invalidResize
                      ),
                  viewConfig.classNames?.dragGhost
                )}
                style={{
                  '--ec-event-color': dragGhost.color ?? 'var(--ds-color-accent)'
                }}
              >
                {dragGhost.kind !== 'move' && (
                  <EventCalendarEvent
                    preview
                    segment={{
                      occurrence: {
                        ...dragGhost.occurrence,
                        start: dragGhost.proposedStart,
                        end: dragGhost.proposedEnd
                      },
                      day: days[dragGhost.colStart] ?? days[0],
                      isStart: dragGhost.isStart,
                      isEnd: dragGhost.isEnd,
                      continuesBefore: !dragGhost.isStart,
                      continuesAfter: !dragGhost.isEnd
                    }}
                    className={cn(
                      'h-full inset-ring-0',
                      !dragGhost.valid && EVENT_CALENDAR_GHOST.invalidContent
                    )}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function EventCalendarAllDayCell({ day }) {
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const { view } = useEventCalendarViewContext();
  const { effective } = useEventCalendarViewSettings();
  const gestures = useEventCalendarGestures();
  const dayStart = zonedStartOfDay(day, settings.timeZone);
  const dayEnd = addDays(toZoned(dayStart, settings.timeZone), 1);
  const isOff = resolveOffDay(
    day,
    settings.timeZone,
    effective.offDays
      ? typeof viewConfig.offDays === 'object'
        ? viewConfig.offDays
        : true
      : false,
    settings.weekendDays
  );
  const offClassName =
    (typeof viewConfig.offDays === 'object' && viewConfig.offDays.className) ||
    'bg-ui-muted/25';
  const isDropTarget = useEventCalendarSelector((state) => {
    const drag = state.drag;
    if (!drag || !drag.proposedDayGranular) return null;
    const covered = drag.proposedStart < dayEnd && drag.proposedEnd > dayStart;
    if (!covered) return null;
    return drag.valid ? 'valid' : 'invalid';
  });
  const inDraft = useEventCalendarSelector(
    (state) => {
      const draft = state.slotDraft;
      if (!draft || !draft.allDay) return null;
      if (draft.start >= dayEnd || draft.end <= dayStart) return null;
      return {
        isStart: draft.start >= dayStart,
        isEnd: draft.end <= dayEnd
      };
    },
    {
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.isStart === b.isStart &&
          a.isEnd === b.isEnd)
    }
  );
  const allDayDraftRange = useEventCalendarSelector(
    (state) => {
      const draft = state.slotDraft;
      if (!draft || !draft.allDay) return null;
      return { start: draft.start, end: draft.end };
    },
    {
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.start.getTime() === b.start.getTime() &&
          a.end.getTime() === b.end.getTime())
    }
  );
  return (
    <div
      data-slot='event-calendar-all-day-cell'
      data-ec-day={dayStart.getTime()}
      data-drop-target={isDropTarget ?? void 0}
      data-off={isOff || void 0}
      className={cn(
        'relative flex min-w-0 flex-col gap-0.5 border-e px-1 py-1.5 last:border-e-0',
        isOff && offClassName,
        viewConfig.dayClassName?.(day),
        // No drop-target bg fill on move/resize (see month view) - a subtle
        // dashed inset outline below marks the target instead.
        inDraft &&
          cn(
            EVENT_CALENDAR_SLOT_DRAFT.surface,
            EVENT_CALENDAR_SLOT_DRAFT.segment,
            inDraft.isStart && EVENT_CALENDAR_SLOT_DRAFT.segmentStart,
            inDraft.isEnd && EVENT_CALENDAR_SLOT_DRAFT.segmentEnd,
            viewConfig.classNames?.slotDraft
          ),
        viewConfig.classNames?.allDayCell
      )}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) gestures.beginCreate(e, day, true);
      }}
      onClick={(e) => {
        if (
          e.target === e.currentTarget &&
          !wasRecentDrag() &&
          !wasRecentChipPress()
        ) {
          settings.onSlotClick?.({ date: dayStart, allDay: true, view }, e);
        }
      }}
    >
      {/* Only on the first cell of the selection, same rule as the month grid,
       so a three-day all-day drag labels itself once rather than three
       times. pointer-events-none keeps the cell's own pointerdown guard
       (`e.target === e.currentTarget`) intact. */}
      {inDraft?.isStart && allDayDraftRange && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-1 top-1/2 -translate-y-1/2',
            EVENT_CALENDAR_SLOT_DRAFT.label
          )}
        >
          {settings.i18n.functions.formatDayRange(
            {
              start: toZoned(allDayDraftRange.start, settings.timeZone),
              end: toZoned(allDayDraftRange.end, settings.timeZone)
            },
            { locale: settings.locale }
          )}
        </span>
      )}
    </div>
  );
}
function EventCalendarTimeGutter({ days, slots, startHour, interval }) {
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const referenceDay = days[0] ?? new Date();
  const labelFormat =
    interval % 60 === 0
      ? settings.i18n.formats.timeGutter
      : settings.i18n.formats.timeGutterMinute;
  return (
    <div
      data-slot='event-calendar-time-gutter'
      className={cn(
        'relative w-(--ec-gutter-width,4.5rem) shrink-0 border-e',
        viewConfig.classNames?.timeGutter
      )}
    >
      {slots.map((minutes) => {
        const time = addMinutes(
          zonedStartOfDay(referenceDay, settings.timeZone),
          minutes
        );
        const label =
          viewConfig.renderTimeGutterSlot?.({
            time,
            hour: Math.floor(minutes / 60),
            minute: minutes % 60
          }) ??
          (minutes > startHour * 60
            ? format(time, labelFormat, { locale: settings.locale })
            : null);
        return (
          <div
            key={minutes}
            className='relative'
            style={{ height: `calc(var(--ec-hour-height) * ${interval / 60})` }}
          >
            {label != null && (
              <span
                className={cn(
                  'text-ui-muted-foreground absolute end-2.5 -top-2',
                  viewConfig.classNames?.timeGutterLabel
                )}
              >
                {label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
const EVENT_TRACK_WIDTH = '(100% - var(--ec-event-gutter, 0.75rem))';
function minuteBlockStyle(startMin, endMin, boundsStartMin) {
  const top = (startMin - boundsStartMin) / 60;
  const height = Math.max((endMin - startMin) / 60, 0.25);
  return {
    top: `calc(var(--ec-hour-height) * ${top})`,
    height: `calc(var(--ec-hour-height) * ${height})`
  };
}
function EventCalendarDayColumn({ day, startHour, endHour, interval }) {
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const { effective } = useEventCalendarViewSettings();
  const { view } = useEventCalendarViewContext();
  const gestures = useEventCalendarGestures();
  const { segments, isToday } = useEventCalendarDay(day);
  const isOff = resolveOffDay(
    day,
    settings.timeZone,
    effective.offDays
      ? typeof viewConfig.offDays === 'object'
        ? viewConfig.offDays
        : true
      : false,
    settings.weekendDays
  );
  const offClassName =
    (typeof viewConfig.offDays === 'object' && viewConfig.offDays.className) ||
    'bg-ui-muted/25';
  const timeZone = settings.timeZone;
  const dayStart = zonedStartOfDay(day, timeZone);
  const dayEnd = addDays(toZoned(dayStart, timeZone), 1);
  const totalMinutes = getDayTotalMinutes(day, timeZone);
  const boundsStartMin = startHour * 60;
  const boundsEndMin = Math.min(endHour * 60, totalMinutes);
  const boundsMinutes = Math.max(60, boundsEndMin - boundsStartMin);
  const windowFor = (start, end) => {
    if (start >= dayEnd || end <= dayStart) return null;
    const from = Math.max(
      differenceInMinutes(start > dayStart ? start : dayStart, dayStart),
      boundsStartMin
    );
    const to = Math.min(
      differenceInMinutes(end < dayEnd ? end : dayEnd, dayStart),
      boundsEndMin
    );
    return to > from ? [from, to] : null;
  };
  const dragGhost = useEventCalendarSelector(
    (state) => {
      const drag = state.drag;
      if (!drag || drag.proposedDayGranular) return null;
      const window2 = windowFor(drag.proposedStart, drag.proposedEnd);
      if (!window2) return null;
      return {
        valid: drag.valid,
        kind: drag.kind,
        occurrence: drag.occurrence,
        proposedStart: drag.proposedStart,
        proposedEnd: drag.proposedEnd,
        window: window2,
        color: drag.occurrence.event.color,
        title: drag.occurrence.event.title
      };
    },
    {
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.window[0] === b.window[0] &&
          a.window[1] === b.window[1] &&
          a.valid === b.valid &&
          a.kind === b.kind &&
          a.proposedStart.getTime() === b.proposedStart.getTime() &&
          a.proposedEnd.getTime() === b.proposedEnd.getTime())
    }
  );
  const draftWindow = useEventCalendarSelector(
    (state) => {
      const draft = state.slotDraft;
      if (!draft || draft.allDay) return null;
      return windowFor(draft.start, draft.end);
    },
    {
      isEqual: (a, b) =>
        a === b || (a !== null && b !== null && a[0] === b[0] && a[1] === b[1])
    }
  );
  const draftRange = useEventCalendarSelector(
    (state) => {
      const draft = state.slotDraft;
      if (!draft || draft.allDay) return null;
      return { start: draft.start, end: draft.end };
    },
    {
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.start.getTime() === b.start.getTime() &&
          a.end.getTime() === b.end.getTime())
    }
  );
  const packedTimed = useMemo(() => {
    const visible = segments.timed.filter((segment) => {
      const startMin = Math.max(segment.startMin ?? 0, boundsStartMin);
      const endMin = Math.min(segment.endMin ?? startMin, boundsEndMin);
      return endMin > boundsStartMin && startMin < boundsEndMin;
    });
    if (visible.length === segments.timed.length) return segments.timed;
    const clones = visible.map((segment) => ({ ...segment }));
    packTimedSegments(clones);
    return clones;
  }, [segments.timed, boundsStartMin, boundsEndMin]);
  const slotFromPointer = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pxPerMinute = rect.height / boundsMinutes;
    const minutes = snapMinutes(
      boundsStartMin + (e.clientY - rect.top) / pxPerMinute,
      settings.snapDuration
    );
    const clamped = Math.min(
      Math.max(minutes, boundsStartMin),
      boundsEndMin - settings.slotDuration
    );
    return {
      date: addMinutes(dayStart, clamped),
      end: addMinutes(dayStart, clamped + settings.slotDuration)
    };
  };
  return (
    <div
      data-slot='event-calendar-day-column'
      data-today={isToday || void 0}
      data-off={isOff || void 0}
      data-ec-day={dayStart.getTime()}
      data-ec-bounds-start={boundsStartMin}
      data-ec-bounds-end={boundsEndMin}
      role='group'
      aria-label={format(
        toZoned(day, timeZone),
        settings.i18n.formats.dayAria,
        { locale: settings.locale }
      )}
      className={cn(
        'relative min-w-0 border-e last:border-e-0',
        isOff && offClassName,
        // time grid keeps today's column on the normal background (the header
        // marks today); only a consumer todayClassName can tint it
        isToday && viewConfig.todayClassName,
        viewConfig.dayClassName?.(day),
        viewConfig.classNames?.dayColumn
      )}
      style={{
        height: `calc(var(--ec-hour-height) * ${boundsMinutes / 60})`,
        backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent calc(var(--ec-hour-height) * ${interval / 60} - var(--ec-slot-line-width, 1px)), var(--ec-slot-line-color, var(--ds-color-border)) calc(var(--ec-hour-height) * ${interval / 60} - var(--ec-slot-line-width, 1px)), var(--ec-slot-line-color, var(--ds-color-border)) calc(var(--ec-hour-height) * ${interval / 60}))`
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) gestures.beginCreate(e, day, false);
      }}
      onClick={(e) => {
        if (
          e.target !== e.currentTarget ||
          wasRecentDrag() ||
          wasRecentChipPress()
        )
          return;
        const slot = slotFromPointer(e);
        settings.onSlotClick?.({ ...slot, allDay: false, view }, e);
      }}
    >
      {viewConfig.renderDayColumnBackground && (
        <div className='pointer-events-none absolute inset-0'>
          {viewConfig.renderDayColumnBackground({
            day,
            boundsStartMin,
            boundsEndMin,
            totalMinutes
          })}
        </div>
      )}
      {packedTimed.map((segment) => {
        const startMin = Math.max(segment.startMin ?? 0, boundsStartMin);
        const endMin = Math.min(segment.endMin ?? startMin, boundsEndMin);
        if (endMin <= boundsStartMin || startMin >= boundsEndMin) return null;
        const columnCount = segment.columnCount ?? 1;
        const column = segment.column ?? 0;
        const span = segment.columnSpan ?? 1;
        const zIndex = segment.occurrence.event.zIndex ?? 10 + column;
        return (
          <div
            key={segment.occurrence.key}
            className='absolute z-(--ec-z) min-h-(--ec-event-min-h,1.5rem) px-0.5 hover:z-40'
            style={{
              ...minuteBlockStyle(startMin, endMin, boundsStartMin),
              left: `calc(${EVENT_TRACK_WIDTH} * ${column / columnCount})`,
              width: `calc(${EVENT_TRACK_WIDTH} * ${span / columnCount})`,
              '--ec-z': zIndex
            }}
          >
            <EventCalendarEvent
              segment={segment}
              className={cn(
                columnCount > 1 && 'ring-ui-background ring-1',
                // short chips: single centered row, exact-fit line height so
                // the title never slices mid-glyph
                endMin - startMin < viewConfig.compactEventMinutes
                  ? 'h-full gap-1 py-0 leading-4'
                  : 'h-full flex-col items-start justify-start gap-0 py-1',
                viewConfig.classNames?.timedChip
              )}
            />
          </div>
        );
      })}
      {/* Drag ghost, standardized (EVENT_CALENDAR_GHOST). Move: a faint
       dashed placeholder at the snapped slot - the cursor-attached carry
       clone owns the visual. Resize: the chip clone with a dashed boundary
       at the proposed extent. Invalid: destructive marking. */}
      {dragGhost && (
        <div
          data-slot='event-calendar-drag-ghost'
          data-kind={dragGhost.kind}
          data-drop-invalid={!dragGhost.valid || void 0}
          className={cn(
            'pointer-events-none absolute inset-x-0.5 z-50 min-h-(--ec-event-min-h,1.5rem)',
            dragGhost.kind === 'move'
              ? cn(
                  EVENT_CALENDAR_GHOST.move,
                  !dragGhost.valid && EVENT_CALENDAR_GHOST.invalid
                )
              : cn(
                  EVENT_CALENDAR_GHOST.resize,
                  !dragGhost.valid && EVENT_CALENDAR_GHOST.invalidResize
                ),
            viewConfig.classNames?.dragGhost
          )}
          style={{
            ...minuteBlockStyle(
              dragGhost.window[0],
              dragGhost.window[1],
              boundsStartMin
            ),
            '--ec-event-color': dragGhost.color ?? 'var(--ds-color-accent)'
          }}
        >
          {dragGhost.kind !== 'move' && (
            <EventCalendarEvent
              preview
              segment={{
                occurrence: {
                  ...dragGhost.occurrence,
                  start: dragGhost.proposedStart,
                  end: dragGhost.proposedEnd,
                  allDay: false
                },
                day,
                isStart: true,
                isEnd: true,
                continuesBefore: false,
                continuesAfter: false,
                startMin: dragGhost.window[0],
                endMin: dragGhost.window[1]
              }}
              className={cn(
                dragGhost.window[1] - dragGhost.window[0] <
                  viewConfig.compactEventMinutes
                  ? 'h-full gap-1 py-0 leading-4'
                  : 'h-full flex-col items-start justify-start gap-0 py-1',
                viewConfig.classNames?.timedChip,
                'inset-ring-0',
                !dragGhost.valid && EVENT_CALENDAR_GHOST.invalidContent
              )}
            />
          )}
        </div>
      )}
      {/* Drag-create draft */}
      {draftWindow && (
        <div
          data-slot='event-calendar-slot-draft'
          className={cn(
            EVENT_CALENDAR_SLOT_DRAFT.box,
            'pointer-events-none absolute inset-x-0.5 z-40 overflow-hidden',
            viewConfig.classNames?.slotDraft
          )}
          style={minuteBlockStyle(
            draftWindow[0],
            draftWindow[1],
            boundsStartMin
          )}
        >
          {/* Live range readout while dragging, the way Outlook and Google
       Calendar do it: the entire point of the gesture is to pick a
       time, so show the time being picked instead of an empty box.
       Reuses `formatEventTime`, the same formatter the chips use, so
       locale, time zone and 12/24-hour all match the rest of the
       calendar for free. `truncate` plus the wrapper's overflow-hidden
       keeps a 15-minute draft from spilling past its own border. */}
          {draftRange && (
            <span className={cn('block', EVENT_CALENDAR_SLOT_DRAFT.label)}>
              {settings.i18n.functions.formatEventTime(
                toZoned(draftRange.start, timeZone),
                toZoned(draftRange.end, timeZone),
                false,
                { locale: settings.locale }
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
function EventCalendarNowIndicator({ days, startHour, endHour }) {
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const now = useNow(viewConfig.nowIndicatorInterval);
  const timeZone = settings.timeZone;
  const todayKey = getDayKey(now, timeZone);
  const todayIndex = days.findIndex(
    (day) => getDayKey(day, timeZone) === todayKey
  );
  if (todayIndex === -1) return null;
  const dayStart = zonedStartOfDay(now, timeZone);
  const minutes = differenceInMinutes(now, dayStart);
  if (minutes < startHour * 60 || minutes > endHour * 60) return null;
  const top = minutes / 60 - startHour;
  if (viewConfig.renderNowIndicator) {
    return (
      <div
        className='pointer-events-none absolute inset-x-0 z-40'
        style={{ top: `calc(var(--ec-hour-height) * ${top})` }}
      >
        {viewConfig.renderNowIndicator({ time: now })}
      </div>
    );
  }
  const columnWidthPct = 100 / days.length;
  return (
    <div
      data-slot='event-calendar-now-indicator'
      className='pointer-events-none absolute inset-x-0 z-40'
      style={{ top: `calc(var(--ec-hour-height) * ${top})` }}
    >
      {/* hairline across the content columns only (clear of the time gutter) */}
      <div className='bg-ui-destructive/40 absolute start-(--ec-gutter-width,4.5rem) end-0 h-px' />
      {/* stronger segment + dot over today's column */}
      <div
        className='absolute h-px'
        style={{
          left: `calc(var(--ec-gutter-width, 4.5rem) + (100% - var(--ec-gutter-width, 4.5rem)) * ${(todayIndex * columnWidthPct) / 100})`,
          width: `calc((100% - var(--ec-gutter-width, 4.5rem)) * ${columnWidthPct / 100})`
        }}
      >
        <div className='bg-ui-destructive absolute inset-x-0 top-0 h-px' />
        {/* dot leads the line at today's column-start border: pulled 1px left of
       center (-start-1 = -4px vs the 6px/size-1.5 circle) so it reads as a
       distinct bullet instead of merging into the line to its right */}
        <div className='bg-ui-destructive absolute -start-1 top-0 size-1.5 -translate-y-1/2 rounded-full' />
      </div>
    </div>
  );
}
function EventCalendarWeekView(props) {
  return <EventCalendarTimeGrid view='week' {...props} />;
}
function EventCalendarDayView(props) {
  return <EventCalendarTimeGrid view='day' {...props} />;
}
function EventCalendarDaysView(props) {
  return <EventCalendarTimeGrid view='days' {...props} />;
}
export {
  EVENT_TRACK_WIDTH,
  EventCalendarDayView,
  EventCalendarDaysView,
  EventCalendarNowIndicator,
  EventCalendarTimeGrid,
  EventCalendarTimeGutter,
  EventCalendarWeekView,
  minuteBlockStyle,
  useNow
};
