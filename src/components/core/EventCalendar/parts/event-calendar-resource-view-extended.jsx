// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { observeResize } from '../../../../utilities/observeResize.js';
import { useEffect, useMemo, useRef } from 'react';
import {
  EventCalendarViewContext,
  useEventCalendar,
  useEventCalendarDay,
  useEventCalendarSelector,
  useEventCalendarSettings,
  useEventCalendarViewConfig,
  useEventCalendarViewSettings
} from './event-calendar-extended.jsx';
import {
  useEventCalendarGestures,
  wasRecentChipPress,
  wasRecentDrag
} from './event-calendar-dnd-extended.jsx';
import {
  EVENT_CALENDAR_GHOST,
  EVENT_CALENDAR_SLOT_DRAFT,
  EventCalendarEvent
} from './event-calendar-event-extended.jsx';
import {
  flattenResources,
  getDayKey,
  getDayTotalMinutes,
  packTimedSegments,
  resolveOffDay,
  snapMinutes,
  toZoned,
  zonedStartOfDay
} from './event-calendar-lib-extended.jsx';
import {
  EVENT_TRACK_WIDTH,
  EventCalendarNowIndicator,
  EventCalendarTimeGutter,
  minuteBlockStyle
} from './event-calendar-time-grid-extended.jsx';
import { addDays, addMinutes } from 'date-fns';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
import { ScrollArea } from '../../ScrollArea/parts/scroll-area.jsx';
const EMPTY_ALL_DAY_SEGMENTS = [];
function EventCalendarResourceView({
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
  const { effective } = useEventCalendarViewSettings();
  const anchorDate = useEventCalendarSelector((state) => state.date, {
    isEqual: (a, b) => a.getTime() === b.getTime()
  });
  const startHour = dayStartHour ?? settings.dayStartHour;
  const endHour = dayEndHour ?? settings.dayEndHour;
  const interval = Math.min(
    Math.max(intervalProp ?? viewConfig.interval, 5),
    240
  );
  const contained = viewConfig.scrollMode !== 'page';
  const day = zonedStartOfDay(anchorDate, settings.timeZone);
  const resources = useMemo(
    () =>
      flattenResources(settings.resources)
        .filter(({ resource }) => !resource.children?.length)
        .map(({ resource }) => resource),
    [settings.resources]
  );
  const scrollRef = useRef(null);
  useEffect(() => {
    if (!contained) return;
    const el = scrollRef.current;
    if (!el) return;
    const viewport = el.querySelector('[data-slot=scroll-area-viewport]');
    const slotRow = el.querySelector(
      '[data-slot=event-calendar-time-gutter] > div'
    );
    const slotPx = slotRow?.getBoundingClientRect().height || 64;
    const pxPerMinute = slotPx / interval;
    const scrollTo = (minutes) => {
      viewport?.scrollTo({
        top: Math.max(0, (minutes - startHour * 60) * pxPerMinute - 12)
      });
    };
    scrollTo(viewConfig.scrollToHour * 60);
    instance.internals.registerScrollHandler((time) => {
      const minutes =
        typeof time === 'number'
          ? time
          : toZoned(time, settings.timeZone).getHours() * 60 +
            toZoned(time, settings.timeZone).getMinutes();
      scrollTo(minutes);
    });
    const root = el.closest(
      '[data-slot=event-calendar-time-grid], [data-slot=event-calendar-resource-view]'
    );
    const syncScrollbarGutter = () => {
      root?.style.setProperty(
        '--ec-scrollbar-w',
        `${viewport ? viewport.offsetWidth - viewport.clientWidth : 0}px`
      );
    };
    syncScrollbarGutter();
    const gutterObserver = viewport ? observeResize(syncScrollbarGutter) : null;
    if (viewport) gutterObserver?.observe(viewport);
    return () => {
      instance.internals.registerScrollHandler(null);
      gutterObserver?.disconnect();
    };
  }, [
    contained,
    instance,
    settings.timeZone,
    startHour,
    interval,
    viewConfig.scrollToHour,
    // scrollbars custom<->native swaps the scroller DOM: re-bind the
    // viewport, the scroll wiring, and the measured --ec-scrollbar-w
    viewConfig.scrollbars
  ]);
  const slots = useMemo(() => {
    const result = [];
    for (let m = startHour * 60; m < endHour * 60; m += interval) {
      result.push(m);
    }
    return result;
  }, [startHour, endHour, interval]);
  const allDaySegments = useEventCalendarSelector(
    () =>
      viewConfig.renderAllDaySection
        ? (instance.internals
            .getIndex()
            .byDay.get(getDayKey(day, settings.timeZone))?.allDay ??
          EMPTY_ALL_DAY_SEGMENTS)
        : EMPTY_ALL_DAY_SEGMENTS,
    {
      isEqual: (a, b) =>
        a === b ||
        (a.length === b.length && a.every((segment, i) => segment === b[i]))
    }
  );
  const gridTemplateColumns = `repeat(${resources.length || 1}, minmax(var(--ec-resource-col-min,8rem), 1fr))`;
  const track = (
    <div className='relative flex'>
      {/* shared gutter component, so renderTimeGutterSlot and
       classNames.timeGutter customizations apply here too */}
      <EventCalendarTimeGutter
        days={[day]}
        slots={slots}
        startHour={startHour}
        interval={interval}
      />
      <div className='grid min-w-0 flex-1' style={{ gridTemplateColumns }}>
        {resources.map((resource) => (
          <EventCalendarResourceColumn
            key={resource.id}
            resource={resource}
            day={day}
            startHour={startHour}
            endHour={endHour}
            interval={interval}
          />
        ))}
      </div>
      {effective.nowIndicator && (
        <EventCalendarNowIndicator
          days={[day]}
          startHour={startHour}
          endHour={endHour}
        />
      )}
    </div>
  );
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <EventCalendarViewContext.Provider value={{ view: 'resource' }}>
      <Comp
        data-slot='event-calendar-resource-view'
        data-view='resource'
        className={cn(
          'flex flex-col border-t',
          contained && 'min-h-0 flex-1 overflow-hidden',
          viewConfig.classNames?.timeGrid,
          className
        )}
        style={{ '--ec-hour-height': '4rem', ...style }}
        {...props}
      >
        {/* Resource header row */}
        <div
          className={cn(
            'flex border-b pe-(--ec-scrollbar-w,0px)',
            !contained &&
              'bg-ui-background sticky top-(--ec-sticky-offset,0px) z-20',
            viewConfig.classNames?.timeGridHeader
          )}
        >
          <div className='w-(--ec-gutter-width,4.5rem) shrink-0 border-e' />
          <div className='grid min-w-0 flex-1' style={{ gridTemplateColumns }}>
            {resources.map((resource) => (
              <div
                key={resource.id}
                data-slot='event-calendar-resource-header'
                className={cn(
                  'min-w-0 truncate border-e px-2 py-1.5 text-center font-medium last:border-e-0',
                  viewConfig.classNames?.resourceHeader
                )}
              >
                {viewConfig.renderResourceHeader?.({ resource }) ??
                  resource.title}
              </div>
            ))}
          </div>
        </div>
        {/* All-day row per resource */}
        {showAllDay && (
          <div
            data-slot='event-calendar-all-day-section'
            className={cn(
              'flex border-b pe-(--ec-scrollbar-w,0px)',
              viewConfig.classNames?.allDaySection
            )}
          >
            {viewConfig.renderAllDaySection?.({
              days: [day],
              segments: allDaySegments
            }) ?? (
              <>
                <div
                  className={cn(
                    // pt-1.5 matches the all-day cell's top inset; the inner box is
                    // one bar-row tall and centers the label so it sits on the SAME
                    // baseline as the first all-day chip and stays top-aligned when
                    // the chips wrap onto more lanes (mirrors the time-grid label)
                    'text-ui-muted-foreground w-(--ec-gutter-width,4.5rem) shrink-0 border-e ps-2 pe-2.5 pt-1.5',
                    viewConfig.classNames?.allDayLabel
                  )}
                >
                  <span className='flex h-[calc(var(--ec-month-bar-h,1.625rem)-0.125rem)] items-center justify-end'>
                    {settings.i18n.labels.allDay}
                  </span>
                </div>
                <div
                  className='grid min-w-0 flex-1'
                  style={{ gridTemplateColumns }}
                >
                  {resources.map((resource) => (
                    <EventCalendarResourceAllDayCell
                      key={resource.id}
                      resource={resource}
                      day={day}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        {contained ? (
          <div ref={scrollRef} className='min-h-0 flex-1'>
            {viewConfig.scrollbars === 'native' ? (
              <div
                data-slot='scroll-area-viewport'
                data-ec-native-scroll=''
                className='h-full overflow-y-auto'
              >
                {track}
              </div>
            ) : (
              <ScrollArea className='h-full'>{track}</ScrollArea>
            )}
          </div>
        ) : (
          track
        )}
      </Comp>
    </EventCalendarViewContext.Provider>
  );
}
function EventCalendarResourceAllDayCell({ resource, day }) {
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const { effective } = useEventCalendarViewSettings();
  const gestures = useEventCalendarGestures();
  const { segments } = useEventCalendarDay(day);
  const mine = segments.allDay.filter(
    (segment) => segment.occurrence.event.resourceId === resource.id
  );
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
  const inDraft = useEventCalendarSelector((state) => {
    const draft = state.slotDraft;
    if (!draft || !draft.allDay) return false;
    return draft.start < dayEnd && draft.end > dayStart;
  });
  return (
    <div
      data-slot='event-calendar-all-day-cell'
      data-ec-day={dayStart.getTime()}
      data-drop-target={isDropTarget ?? void 0}
      data-off={isOff || void 0}
      className={cn(
        // reserve one bar row so the all-day row keeps the same height with or
        // without events, matching the time-grid all-day row (which reserves
        // the same via its bars-grid minHeight)
        'relative flex min-h-[calc(var(--ec-month-bar-h,1.625rem)+0.625rem)] min-w-0 flex-col gap-0.5 border-e px-1 py-1.5 last:border-e-0',
        isOff && offClassName,
        viewConfig.dayClassName?.(day),
        inDraft &&
          cn(
            EVENT_CALENDAR_SLOT_DRAFT.surface,
            EVENT_CALENDAR_SLOT_DRAFT.segment,
            EVENT_CALENDAR_SLOT_DRAFT.segmentStart,
            EVENT_CALENDAR_SLOT_DRAFT.segmentEnd,
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
          settings.onSlotClick?.(
            {
              date: dayStart,
              allDay: true,
              view: 'resource',
              resourceId: resource.id
            },
            e
          );
        }
      }}
    >
      {mine.map((segment) => (
        <EventCalendarEvent
          key={segment.occurrence.key}
          segment={segment}
          className='h-[calc(var(--ec-month-bar-h,1.625rem)-0.125rem)]'
        />
      ))}
      {isDropTarget && (
        <span
          aria-hidden
          data-slot='event-calendar-drop-indicator'
          data-drop-target={isDropTarget}
          className={cn(
            'pointer-events-none absolute inset-0.5 z-10 rounded-sm border border-dashed',
            isDropTarget === 'valid'
              ? 'border-ui-primary/50'
              : 'border-ui-destructive/60',
            viewConfig.classNames?.dropIndicator
          )}
        />
      )}
    </div>
  );
}
function EventCalendarResourceColumn({
  resource,
  day,
  startHour,
  endHour,
  interval
}) {
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const { effective } = useEventCalendarViewSettings();
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
  const totalMinutes = getDayTotalMinutes(day, timeZone);
  const boundsStartMin = startHour * 60;
  const boundsEndMin = Math.min(endHour * 60, totalMinutes);
  const boundsMinutes = Math.max(60, boundsEndMin - boundsStartMin);
  const packed = useMemo(() => {
    const mine = segments.timed
      .filter((segment) => {
        if (segment.occurrence.event.resourceId !== resource.id) return false;
        const startMin = Math.max(segment.startMin ?? 0, boundsStartMin);
        const endMin = Math.min(segment.endMin ?? startMin, boundsEndMin);
        return endMin > boundsStartMin && startMin < boundsEndMin;
      })
      .map((segment) => ({ ...segment }));
    packTimedSegments(mine);
    return mine;
  }, [segments.timed, resource.id, boundsStartMin, boundsEndMin]);
  const dragGhost = useEventCalendarSelector(
    (state) => {
      const drag = state.drag;
      if (!drag || drag.proposedDayGranular) return null;
      const targetResourceId =
        drag.proposedResourceId ?? drag.occurrence.event.resourceId;
      if (targetResourceId !== resource.id) return null;
      const from = Math.max(
        (drag.proposedStart.getTime() - dayStart.getTime()) / 6e4,
        boundsStartMin
      );
      const to = Math.min(
        (drag.proposedEnd.getTime() - dayStart.getTime()) / 6e4,
        boundsEndMin
      );
      if (to <= from) return null;
      return {
        window: [from, to],
        valid: drag.valid,
        kind: drag.kind,
        color: drag.occurrence.event.color,
        title: drag.occurrence.event.title,
        occurrence: drag.occurrence,
        proposedStart: drag.proposedStart,
        proposedEnd: drag.proposedEnd
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
          a.proposedStart.getTime() === b.proposedStart.getTime() &&
          a.proposedEnd.getTime() === b.proposedEnd.getTime())
    }
  );
  const draftRange = useEventCalendarSelector(
    (state) => {
      const draft = state.slotDraft;
      if (!draft || draft.allDay || draft.resourceId !== resource.id) {
        return null;
      }
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
  const draftWindow = useEventCalendarSelector(
    (state) => {
      const draft = state.slotDraft;
      if (!draft || draft.allDay || draft.resourceId !== resource.id) {
        return null;
      }
      const from = Math.max(
        (draft.start.getTime() - dayStart.getTime()) / 6e4,
        boundsStartMin
      );
      const to = Math.min(
        (draft.end.getTime() - dayStart.getTime()) / 6e4,
        boundsEndMin
      );
      return to > from ? [from, to] : null;
    },
    {
      isEqual: (a, b) =>
        a === b || (a !== null && b !== null && a[0] === b[0] && a[1] === b[1])
    }
  );
  return (
    <div
      data-slot='event-calendar-day-column'
      data-today={isToday || void 0}
      data-off={isOff || void 0}
      data-ec-day={dayStart.getTime()}
      data-ec-bounds-start={boundsStartMin}
      data-ec-bounds-end={boundsEndMin}
      data-ec-resource={resource.id}
      data-drop-target={
        dragGhost ? (dragGhost.valid ? 'valid' : 'invalid') : void 0
      }
      role='group'
      aria-label={resource.title}
      className={cn(
        'relative min-w-0 border-e last:border-e-0',
        isOff && offClassName,
        // the resource view is a single day, so today gets no column tint (the
        // header marks it); only a consumer todayClassName can tint it
        isToday && viewConfig.todayClassName,
        viewConfig.dayClassName?.(day),
        viewConfig.classNames?.dayColumn
      )}
      style={{
        height: `calc(var(--ec-hour-height) * ${boundsMinutes / 60})`,
        backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent calc(var(--ec-hour-height) * ${interval / 60} - var(--ec-slot-line-width, 1px)), var(--ec-slot-line-color, var(--color-border)) calc(var(--ec-hour-height) * ${interval / 60} - var(--ec-slot-line-width, 1px)), var(--ec-slot-line-color, var(--color-border)) calc(var(--ec-hour-height) * ${interval / 60}))`
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
        settings.onSlotClick?.(
          {
            date: addMinutes(dayStart, clamped),
            end: addMinutes(dayStart, clamped + settings.slotDuration),
            allDay: false,
            view: 'resource',
            resourceId: resource.id
          },
          e
        );
      }}
    >
      {packed.map((segment) => {
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
      {/* Standardized ghost (EVENT_CALENDAR_GHOST): faint drop placeholder
       for moves (the cursor-attached carry clone owns the visual), dashed
       clone for resizes, destructive marking when invalid. */}
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
            '--ec-event-color': dragGhost.color ?? 'var(--color-primary)'
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
          {draftRange && (
            <span className={cn('block', EVENT_CALENDAR_SLOT_DRAFT.label)}>
              {settings.i18n.functions.formatEventTime(
                toZoned(draftRange.start, settings.timeZone),
                toZoned(draftRange.end, settings.timeZone),
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
export { EventCalendarResourceView };
