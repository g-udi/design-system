// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { observeResize } from '../../../../utilities/observeResize.js';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  EventCalendarViewContext,
  useEventCalendar,
  useEventCalendarDay,
  useEventCalendarSelector,
  useEventCalendarSettings,
  useEventCalendarViewConfig,
  useEventCalendarViewSettings,
  useEventCalendarWeek
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
  getDayKey,
  getRangeKey,
  resolveOffDay,
  toZoned,
  zonedStartOfDay
} from './event-calendar-lib-extended.jsx';
import { addDays, format, getWeek } from 'date-fns';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../Popover/parts/popover.jsx';
import { ScrollArea } from '../../ScrollArea/parts/scroll-area.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
let focusedChip = null;
function restoreChipFocus(root, segments) {
  const pending = focusedChip;
  if (!root || !pending || pending.node.isConnected) return;
  const active = document.activeElement;
  if (active && active !== document.body) return;
  const index = segments.findIndex(
    (segment) =>
      segment.occurrence.eventId === pending.eventId &&
      segment.occurrence.recurrenceIndex === pending.recurrenceIndex
  );
  if (index < 0) return;
  const chip = root.querySelectorAll('[data-slot=event-calendar-event]')[index];
  if (!chip) return;
  focusedChip = null;
  chip.focus();
}
function EventCalendarMonthView({
  className,
  asChild = false,
  maxEventsPerCell,
  ...props
}) {
  const instance = useEventCalendar();
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const visibleRange = useEventCalendarSelector((state) => state.visibleRange, {
    isEqual: (a, b) => getRangeKey(a) === getRangeKey(b)
  });
  const anchorDate = useEventCalendarSelector((state) => state.date);
  const { effective } = useEventCalendarViewSettings();
  const weeks = useMemo(() => {
    const days = [];
    let cursor = zonedStartOfDay(visibleRange.start, settings.timeZone);
    while (cursor < visibleRange.end) {
      days.push(cursor);
      cursor = zonedStartOfDay(
        addDays(toZoned(cursor, settings.timeZone), 1),
        settings.timeZone
      );
    }
    const rows = [];
    for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
    if (effective.weekends) return rows;
    return rows.map((row) =>
      row.filter(
        (day) =>
          !settings.weekendDays.includes(
            toZoned(day, settings.timeZone).getDay()
          )
      )
    );
  }, [
    visibleRange,
    settings.timeZone,
    settings.weekendDays,
    effective.weekends
  ]);
  const headerDays = weeks[0] ?? [];
  const title = settings.i18n.functions.formatTitle('month', {
    date: toZoned(anchorDate, settings.timeZone),
    activeRange: instance.api.getActiveRange(),
    visibleRange,
    locale: settings.locale
  });
  const gridTemplateColumns = `${effective.weekNumbers ? 'var(--ec-week-number-w, 2.75rem) ' : ''}repeat(${headerDays.length}, minmax(0, 1fr))`;
  const cap = maxEventsPerCell ?? viewConfig.maxEventsPerCell;
  const contained = viewConfig.scrollMode !== 'page';
  const autoFit = cap === 'auto' && contained;
  const slotProbeRef = useRef(null);
  const contentProbeRef = useRef(null);
  const [autoCap, setAutoCap] = useState(null);
  const measureCap = useCallback(() => {
    const content = contentProbeRef.current;
    const slot = slotProbeRef.current;
    if (!content || !slot) return;
    const laneH = slot.getBoundingClientRect().height;
    if (laneH <= 0) return;
    const cs = getComputedStyle(content);
    const inner = content.clientHeight - (parseFloat(cs.paddingTop) || 0);
    const gap = parseFloat(cs.rowGap) || 0;
    setAutoCap(Math.max(1, Math.floor((inner + gap) / laneH)));
  }, []);
  useIsoLayoutEffect(() => {
    if (!autoFit) {
      setAutoCap(null);
      return;
    }
    const content = contentProbeRef.current;
    if (!content || typeof ResizeObserver === 'undefined') return;
    measureCap();
    const observer = observeResize(measureCap);
    observer.observe(content);
    return () => observer.disconnect();
  }, [autoFit, measureCap, weeks.length, anchorDate]);
  const resolvedCap = cap === 'auto' ? (autoFit ? (autoCap ?? 3) : 3) : cap;
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <EventCalendarViewContext.Provider value={{ view: 'month' }}>
      <Comp
        data-slot='event-calendar-month-view'
        data-view='month'
        role='grid'
        aria-label={title}
        className={cn(
          'flex flex-col border-t',
          contained && 'min-h-0 flex-1 overflow-hidden',
          viewConfig.classNames?.monthView,
          className
        )}
        {...props}
      >
        <div
          role='row'
          data-slot='event-calendar-month-header'
          className={cn(
            '@container grid border-b',
            viewConfig.classNames?.monthHeader
          )}
          style={{ gridTemplateColumns }}
        >
          {effective.weekNumbers && (
            <div
              role='columnheader'
              aria-hidden
              className={cn(
                'border-e px-2 py-1.5',
                viewConfig.classNames?.weekNumber
              )}
            />
          )}
          {headerDays.map((day) => (
            <div
              key={day.getTime()}
              role='columnheader'
              className={cn(
                'text-ui-muted-foreground truncate px-2 py-1.5 font-medium',
                viewConfig.classNames?.monthDayHeader
              )}
            >
              {viewConfig.renderDayHeader?.({
                day,
                view: 'month',
                isToday:
                  getDayKey(day, settings.timeZone) ===
                  getDayKey(/* @__PURE__ */ new Date(), settings.timeZone)
              }) ?? (
                <>
                  <span className='@max-[36rem]:hidden'>
                    {format(
                      toZoned(day, settings.timeZone),
                      settings.i18n.formats.monthDayHeader,
                      { locale: settings.locale }
                    )}
                  </span>
                  <span className='hidden @max-[36rem]:inline'>
                    {format(
                      toZoned(day, settings.timeZone),
                      settings.i18n.formats.monthDayHeaderNarrow,
                      { locale: settings.locale }
                    )}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
        <div
          data-slot='event-calendar-month-body'
          className={cn(
            'grid',
            contained && 'min-h-0 flex-1',
            viewConfig.classNames?.monthBody
          )}
          style={{
            gridTemplateRows: contained
              ? `repeat(${weeks.length}, minmax(0, 1fr))`
              : `repeat(${weeks.length}, minmax(var(--ec-month-row-min-h, 8rem), auto))`
          }}
        >
          {weeks.map((week, rowIndex) => (
            <EventCalendarMonthWeek
              key={rowIndex}
              week={week}
              gridTemplateColumns={gridTemplateColumns}
              showWeekNumber={effective.weekNumbers}
              cap={resolvedCap}
              autoFit={autoFit}
              contentRef={rowIndex === 0 ? contentProbeRef : void 0}
            />
          ))}
        </div>
        {autoFit && (
          <div
            ref={slotProbeRef}
            aria-hidden
            className='pointer-events-none invisible absolute h-[var(--ec-month-bar-h,1.75rem)] w-0'
          />
        )}
      </Comp>
    </EventCalendarViewContext.Provider>
  );
}
function EventCalendarMonthWeek({
  week,
  gridTemplateColumns,
  showWeekNumber,
  cap,
  autoFit,
  contentRef
}) {
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const { bars, rowStart } = useEventCalendarWeek(week[0]);
  const colOffset = showWeekNumber ? 1 : 0;
  const dayMs = 864e5;
  const rowStartMs = zonedStartOfDay(
    rowStart ?? week[0],
    settings.timeZone
  ).getTime();
  const offsets = week.map((d) =>
    Math.round(
      (zonedStartOfDay(d, settings.timeZone).getTime() - rowStartMs) / dayMs
    )
  );
  const gridPos = (colStart, colSpan) => {
    let start = -1;
    let end = -1;
    for (let o = colStart; o < colStart + colSpan; o++) {
      const col = offsets.indexOf(o);
      if (col === -1) continue;
      if (start === -1) start = col;
      end = col;
    }
    return start === -1 ? null : { col: start, span: end - start + 1 };
  };
  const visibleBars = bars.filter((b) => (b.lane ?? 0) < cap);
  const covers = (b, dayOffset) =>
    (b.colStart ?? 0) <= dayOffset &&
    dayOffset < (b.colStart ?? 0) + (b.colSpan ?? 1);
  const hiddenBarKeysByCol = week.map(
    (_, col) =>
      new Set(
        bars
          .filter((b) => (b.lane ?? 0) >= cap && covers(b, offsets[col]))
          .map((b) => b.occurrence.key)
      )
  );
  const dragGhost = useEventCalendarSelector(
    (state) => {
      const drag = state.drag;
      if (!drag) return null;
      const rowEndMs = rowStartMs + 7 * dayMs;
      const startDayMs = zonedStartOfDay(
        drag.proposedStart,
        settings.timeZone
      ).getTime();
      const lastDayMs = zonedStartOfDay(
        new Date(drag.proposedEnd.getTime() - 1),
        settings.timeZone
      ).getTime();
      if (startDayMs >= rowEndMs || lastDayMs < rowStartMs) return null;
      const startCol = Math.max(
        0,
        Math.round((startDayMs - rowStartMs) / dayMs)
      );
      const endCol = Math.min(6, Math.round((lastDayMs - rowStartMs) / dayMs));
      if (endCol < startCol) return null;
      return {
        kind: drag.kind,
        valid: drag.valid,
        occurrence: drag.occurrence,
        proposedStart: drag.proposedStart,
        proposedEnd: drag.proposedEnd,
        proposedAllDay: drag.proposedAllDay,
        colStart: startCol,
        colSpan: endCol - startCol + 1,
        isStart: startDayMs >= rowStartMs,
        isEnd: lastDayMs < rowEndMs,
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
          a.proposedAllDay === b.proposedAllDay &&
          a.proposedStart.getTime() === b.proposedStart.getTime() &&
          a.proposedEnd.getTime() === b.proposedEnd.getTime())
    }
  );
  const ghostPos = dragGhost
    ? gridPos(dragGhost.colStart, dragGhost.colSpan)
    : null;
  const ghostLane = dragGhost
    ? (bars.find((b) => b.occurrence.key === dragGhost.occurrence.key)?.lane ??
      0)
    : 0;
  const ghostIsBar =
    !!dragGhost &&
    (dragGhost.kind !== 'move' ||
      dragGhost.proposedAllDay ||
      dragGhost.proposedEnd.getTime() - dragGhost.proposedStart.getTime() >
        dayMs);
  return (
    <div
      role='row'
      data-slot='event-calendar-month-row'
      className={cn(
        'relative grid min-h-0 border-b last:border-b-0',
        viewConfig.classNames?.monthRow
      )}
      style={{ gridTemplateColumns }}
    >
      {showWeekNumber && (
        <div
          role='rowheader'
          data-slot='event-calendar-week-number'
          className={cn(
            'text-ui-muted-foreground border-e px-2 pt-1 tabular-nums',
            viewConfig.classNames?.weekNumber
          )}
        >
          {settings.i18n.labels.week(
            getWeek(toZoned(week[0], settings.timeZone), {
              // locale supplies firstWeekContainsDate, so a de/ISO calendar
              // numbers the year-boundary weeks its own way instead of falling
              // back to US numbering; weekStartsOn stays explicit so the number
              // keeps matching the rendered grid
              locale: settings.locale,
              weekStartsOn: settings.weekStartsOn
            })
          )}
        </div>
      )}
      {week.map((day, col) => (
        <EventCalendarMonthCell
          key={day.getTime()}
          day={day}
          cap={cap}
          reservedLanes={visibleBars.reduce(
            (max, b) =>
              covers(b, offsets[col]) ? Math.max(max, (b.lane ?? 0) + 1) : max,
            0
          )}
          hiddenBarKeys={hiddenBarKeysByCol[col]}
          isLast={col === week.length - 1}
          autoFit={autoFit}
          contentRef={col === 0 ? contentRef : void 0}
        />
      ))}
      {/* Continuous bar overlay: one element per bar, placed by grid-column so
       a cross-day span is a single unbroken block. pointer-events pass
       through the gaps to the cells below. NOT aria-hidden - these are the
       real interactive bars. */}
      {(visibleBars.length > 0 || (dragGhost && ghostPos && ghostIsBar)) && (
        <div
          data-slot='event-calendar-month-bar-overlay'
          role='gridcell'
          aria-label='Multi-day events'
          aria-colspan={week.length}
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 z-10 grid pt-1.5',
            viewConfig.classNames?.monthBarOverlay
          )}
          style={{
            gridTemplateColumns,
            gridAutoRows: 'var(--ec-month-bar-h, 1.75rem)'
          }}
        >
          {visibleBars.map((bar) => {
            const pos = gridPos(bar.colStart ?? 0, bar.colSpan ?? 1);
            if (!pos) return null;
            return (
              <div
                key={bar.occurrence.key}
                className={cn(
                  'pointer-events-auto min-w-0 px-1',
                  viewConfig.classNames?.monthBar
                )}
                style={{
                  gridColumn: `${colOffset + pos.col + 1} / span ${pos.span}`,
                  gridRow: (bar.lane ?? 0) + 1
                }}
              >
                {/* lane height minus the 2px inter-lane gap */}
                <EventCalendarEvent
                  segment={bar}
                  className='h-[calc(var(--ec-month-bar-h,1.75rem)-0.125rem)]'
                />
              </div>
            );
          })}
          {dragGhost && ghostPos && ghostIsBar && (
            <div
              aria-hidden
              className={cn('min-w-0 px-1', viewConfig.classNames?.monthBar)}
              style={{
                gridColumn: `${colOffset + ghostPos.col + 1} / span ${ghostPos.span}`,
                gridRow: ghostLane + 1
              }}
            >
              <div
                data-slot='event-calendar-drag-ghost'
                data-kind={dragGhost.kind}
                data-drop-invalid={!dragGhost.valid || void 0}
                className={cn(
                  'h-[calc(var(--ec-month-bar-h,1.75rem)-0.125rem)]',
                  dragGhost.kind === 'move'
                    ? // faint drop placeholder only: the cursor-attached
                      // carry clone owns the visual during moves
                      cn(
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
                        end: dragGhost.proposedEnd
                      },
                      day: week[ghostPos.col] ?? week[0],
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
function EventCalendarMonthCell({
  day,
  cap,
  reservedLanes,
  hiddenBarKeys,
  isLast,
  autoFit,
  contentRef
}) {
  const _instance = useEventCalendar();
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const gestures = useEventCalendarGestures();
  const { segments, isToday, isOutside } = useEventCalendarDay(day);
  const dayStart = zonedStartOfDay(day, settings.timeZone);
  const dayEnd = addDays(toZoned(dayStart, settings.timeZone), 1);
  const { effective } = useEventCalendarViewSettings();
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
    if (!drag) return null;
    const covered = drag.proposedStart < dayEnd && drag.proposedEnd > dayStart;
    if (!covered) return null;
    return drag.valid ? 'valid' : 'invalid';
  });
  const isInteracting = useEventCalendarSelector((state) =>
    viewConfig.showDayAddButton
      ? state.drag !== null || state.slotDraft !== null
      : false
  );
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
  const draftRange = useEventCalendarSelector(
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
  const inlineDrop = useEventCalendarSelector(
    (state) => {
      const drag = state.drag;
      if (!drag || drag.kind !== 'move' || drag.proposedAllDay) return null;
      if (drag.proposedEnd.getTime() - drag.proposedStart.getTime() > 864e5)
        return null;
      const dropDayMs = zonedStartOfDay(
        drag.proposedStart,
        settings.timeZone
      ).getTime();
      if (dropDayMs !== dayStart.getTime()) return null;
      if (
        zonedStartOfDay(drag.occurrence.start, settings.timeZone).getTime() ===
        dayStart.getTime()
      )
        return null;
      return {
        min: (drag.proposedStart.getTime() - dropDayMs) / 6e4,
        valid: drag.valid,
        color: drag.occurrence.event.color
      };
    },
    {
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.min === b.min &&
          a.valid === b.valid &&
          a.color === b.color)
    }
  );
  const extraHidden = hiddenBarKeys.size;
  const hiddenBarSegs = segments.allDay.filter((s) =>
    hiddenBarKeys.has(s.occurrence.key)
  );
  const m = segments.timed.length;
  const timedSlots = Math.max(0, cap - reservedLanes);
  const staticOverflow = extraHidden > 0 || m > timedSlots;
  const staticShown =
    autoFit && staticOverflow ? Math.max(0, timedSlots - 1) : timedSlots;
  const overflowSegments = [
    ...hiddenBarSegs,
    ...segments.timed.slice(staticShown)
  ];
  let visibleTimed;
  let overflowCount;
  let placeholderIndex;
  let placeholderAtMore;
  if (!inlineDrop) {
    visibleTimed = segments.timed.slice(0, staticShown);
    overflowCount = overflowSegments.length;
    placeholderIndex = -1;
    placeholderAtMore = false;
  } else {
    const insertRank = segments.timed.filter(
      (s) => (s.startMin ?? 0) <= inlineDrop.min
    ).length;
    const dropOverflow = extraHidden > 0 || m + 1 > timedSlots;
    const vis = !dropOverflow
      ? m + 1
      : autoFit
        ? Math.max(0, timedSlots - 1)
        : timedSlots;
    placeholderAtMore = insertRank >= vis;
    visibleTimed = placeholderAtMore
      ? segments.timed.slice(0, vis)
      : segments.timed.slice(0, Math.max(0, vis - 1));
    placeholderIndex = placeholderAtMore ? -1 : insertRank;
    overflowCount =
      extraHidden + (m - visibleTimed.length) + (placeholderAtMore ? 1 : 0);
  }
  const rootRef = useRef(null);
  useIsoLayoutEffect(() => {
    restoreChipFocus(rootRef.current, visibleTimed);
  });
  const dropPlaceholder = inlineDrop ? (
    <div
      key='ec-drop-placeholder'
      aria-hidden
      data-slot='event-calendar-drop-placeholder'
      data-drop-invalid={!inlineDrop.valid || void 0}
      className={cn(
        'shrink-0 rounded-sm border border-dashed',
        inlineDrop.valid
          ? 'border-(--ec-event-color)/50 bg-(--ec-event-color)/8'
          : 'border-ui-destructive/70 bg-ui-destructive/10',
        viewConfig.classNames?.dragGhost
      )}
      style={{
        '--ec-event-color': inlineDrop.color ?? 'var(--color-primary)',
        height: 'calc(var(--ec-month-bar-h, 1.75rem) - 0.125rem)'
      }}
    />
  ) : null;
  const defaultContent = (
    <>
      <div
        ref={contentRef}
        className={cn(
          // gap-0.5 pairs with the 0.125rem subtraction in the lane spacer
          // below; changing the gap requires renderMonthCell
          // px-1 matches the all-day bar wrapper inset so single-day chips and
          // multi-day bars line up on the same left/right edge in a cell
          'flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden px-1 pt-1.5',
          viewConfig.classNames?.monthCellContent
        )}
      >
        {reservedLanes > 0 && (
          <div
            aria-hidden
            className='shrink-0'
            style={{
              // lane height already carries the 2px inter-lane gap; subtract
              // it so spacer + the column's own gap-0.5 = the SAME 2px rhythm
              // between the last bar and the first timed chip
              height: `calc(${reservedLanes} * var(--ec-month-bar-h, 1.75rem) - 0.125rem)`
            }}
          />
        )}
        {visibleTimed.flatMap((segment, i) => {
          const chip = (
            <EventCalendarEvent
              key={segment.occurrence.key}
              segment={segment}
              onFocus={(e) => {
                focusedChip = {
                  node: e.currentTarget,
                  eventId: segment.occurrence.eventId,
                  recurrenceIndex: segment.occurrence.recurrenceIndex
                };
              }}
              onBlur={(e) => {
                if (e.currentTarget.isConnected) focusedChip = null;
              }}
              className='shrink-0'
            />
          );
          return i === placeholderIndex ? [dropPlaceholder, chip] : [chip];
        })}
        {placeholderIndex >= 0 &&
          placeholderIndex >= visibleTimed.length &&
          dropPlaceholder}
        {overflowCount > 0 && (
          <EventCalendarMoreIndicator
            day={day}
            count={overflowCount}
            segments={overflowSegments}
            dropInto={
              placeholderAtMore && inlineDrop
                ? { color: inlineDrop.color, valid: inlineDrop.valid }
                : void 0
            }
          />
        )}
      </div>
      {/* Day number + add affordance, bottom-right (Notion-style) */}
      <div
        className={cn(
          'flex items-center justify-end gap-1 px-2 pb-1.5',
          viewConfig.classNames?.monthCellFooter
        )}
      >
        {viewConfig.showDayAddButton && !isInteracting && (
          <button
            type='button'
            data-slot='event-calendar-day-add'
            aria-label={settings.i18n.labels.addEvent}
            className={cn(
              'bg-ui-primary text-ui-primary-foreground flex size-5 cursor-pointer items-center justify-center rounded-sm opacity-0 transition-opacity group-hover/ec-cell:opacity-100 focus-visible:opacity-100',
              viewConfig.classNames?.dayAddButton
            )}
            onClick={(e) => {
              e.stopPropagation();
              settings.onSlotClick?.(
                { date: day, allDay: true, view: 'month' },
                e
              );
            }}
          >
            <RegistryIcon
              lucide='PlusIcon'
              className='size-3.5'
              aria-hidden='true'
            />
          </button>
        )}
        <span
          data-slot='event-calendar-month-day-number'
          className={cn(
            'flex size-5 items-center justify-center rounded-full',
            isOutside && 'text-ui-muted-foreground',
            // the filled circle already marks today; keep the number the same
            // weight/size as the other days so it does not read as larger
            // Same font-size as every other day; a lighter weight cancels the
            // way white digits on the filled circle read bolder/larger than the
            // dark-on-light numbers around them.
            isToday && 'bg-ui-primary text-ui-primary-foreground font-light',
            viewConfig.classNames?.monthDayNumber
          )}
        >
          {format(
            toZoned(day, settings.timeZone),
            settings.i18n.formats.monthCellDay,
            { locale: settings.locale }
          )}
        </span>
      </div>
    </>
  );
  const content =
    viewConfig.renderMonthCell?.({
      day,
      segments,
      isToday,
      isOutside,
      overflowCount,
      defaultContent
    }) ?? defaultContent;
  return (
    <div
      ref={rootRef}
      role='gridcell'
      data-slot='event-calendar-month-cell'
      data-today={isToday || void 0}
      data-outside={isOutside || void 0}
      data-weekend={
        settings.weekendDays.includes(
          toZoned(day, settings.timeZone).getDay()
        ) || void 0
      }
      data-ec-day={dayStart.getTime()}
      data-drop-target={isDropTarget ?? void 0}
      data-off={isOff || void 0}
      data-draft={inDraft ? '' : void 0}
      aria-label={format(
        toZoned(day, settings.timeZone),
        settings.i18n.formats.monthCellAriaLabel,
        { locale: settings.locale }
      )}
      className={cn(
        'group/ec-cell relative flex min-h-0 min-w-0 flex-col overflow-hidden',
        !isLast && 'border-e',
        isOutside && !settings.showOutsideDays && 'invisible',
        isOff && offClassName,
        isToday &&
          cn(
            'bg-ui-primary/3 border-b-primary/40 relative border-b-2',
            viewConfig.todayClassName
          ),
        viewConfig.dayClassName?.(day),
        // No drop-target bg fill on move/resize - the dragged bar + not-allowed
        // cursor carry the feedback; a cell-wide color wash is too distracting.
        // data-drop-target stays as an opt-in styling hook.
        inDraft && EVENT_CALENDAR_SLOT_DRAFT.surface,
        viewConfig.classNames?.monthCell
      )}
      onPointerDown={(e) => {
        const target = e.target;
        if (target.closest('[data-slot=event-calendar-event]')) return;
        if (target.closest('[data-slot=event-calendar-more]')) return;
        gestures.beginCreate(e, day, true);
      }}
      onClick={(e) => {
        if (wasRecentDrag() || wasRecentChipPress()) return;
        settings.onSlotClick?.({ date: day, allDay: true, view: 'month' }, e);
      }}
    >
      {inDraft && (
        <span
          aria-hidden
          data-slot='event-calendar-slot-draft'
          className={cn(
            'pointer-events-none absolute inset-0 z-10',
            EVENT_CALENDAR_SLOT_DRAFT.segment,
            inDraft.isStart && EVENT_CALENDAR_SLOT_DRAFT.segmentStart,
            inDraft.isEnd && EVENT_CALENDAR_SLOT_DRAFT.segmentEnd,
            viewConfig.classNames?.slotDraft
          )}
        >
          {/* Date-range readout, the month-view counterpart of the time-grid
       one. Rendered only on the FIRST cell of the selection, otherwise
       a three-day drag would repeat the same label three times. Pinned
       to the bottom because the day number owns the top of the cell,
       and given its own surface so it stays legible over event chips. */}
          {inDraft.isStart && draftRange && (
            <span
              className={cn(
                'absolute inset-x-1 bottom-1',
                EVENT_CALENDAR_SLOT_DRAFT.label
              )}
            >
              {settings.i18n.functions.formatDayRange(
                {
                  start: toZoned(draftRange.start, settings.timeZone),
                  end: toZoned(draftRange.end, settings.timeZone)
                },
                { locale: settings.locale }
              )}
            </span>
          )}
        </span>
      )}
      {content}
    </div>
  );
}
function EventCalendarMoreIndicator({ day, count, segments, dropInto }) {
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const [open, setOpen] = useState(false);
  const headerId = useId();
  const isDragging = useEventCalendarSelector((state) => state.drag !== null);
  useEffect(() => {
    if (isDragging) setOpen(false);
  }, [isDragging]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        data-slot='event-calendar-more'
        data-drop-into={dropInto ? '' : void 0}
        data-drop-invalid={dropInto && !dropInto.valid ? '' : void 0}
        className={cn(
          'text-ui-muted-foreground hover:text-ui-foreground cursor-pointer truncate rounded-sm px-1.5 text-start',
          // While a dragged chip will land in this overflow bucket, the "+N more"
          // link itself becomes the drop placeholder: dashed, event-tinted, one
          // chip tall, so the drop target is unmistakable.
          dropInto &&
            cn(
              'flex shrink-0 items-center border border-dashed',
              dropInto.valid
                ? 'text-ui-foreground border-(--ec-event-color)/50 bg-(--ec-event-color)/8'
                : 'border-ui-destructive/70 bg-ui-destructive/10 text-ui-destructive'
            ),
          viewConfig.classNames?.moreIndicator
        )}
        style={
          dropInto
            ? {
                '--ec-event-color': dropInto.color ?? 'var(--color-primary)',
                height: 'calc(var(--ec-month-bar-h, 1.75rem) - 0.125rem)'
              }
            : void 0
        }
        onClick={(e) => {
          e.stopPropagation();
          const verdict = settings.onMoreClick?.(
            day,
            segments.map((segment) => segment.occurrence),
            e
          );
          if (verdict === false) {
            e.preventDefault();
            setOpen(false);
          }
        }}
      >
        {viewConfig.renderMoreIndicator?.({ day, count, segments }) ??
          settings.i18n.labels.more(count)}
      </PopoverTrigger>
      <PopoverContent
        data-slot='event-calendar-more-popover'
        align={viewConfig.morePopoverAlign}
        aria-labelledby={viewConfig.renderMoreContent ? void 0 : headerId}
        aria-label={
          viewConfig.renderMoreContent
            ? format(
                toZoned(day, settings.timeZone),
                settings.i18n.formats.moreDayHeader,
                { locale: settings.locale }
              )
            : void 0
        }
        className={cn(
          'w-64 gap-1! p-2! text-xs',
          viewConfig.classNames?.morePopover
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {viewConfig.renderMoreContent ? (
          viewConfig.renderMoreContent({
            day,
            segments,
            close: () => setOpen(false)
          })
        ) : (
          <EventCalendarMoreDefaultContent
            day={day}
            segments={segments}
            headerId={headerId}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
function EventCalendarMoreDefaultContent({ day, segments, headerId }) {
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  return (
    <>
      <div
        id={headerId}
        className={cn(
          'text-ui-muted-foreground px-1 py-1 text-xs font-medium',
          viewConfig.classNames?.morePopoverHeader
        )}
      >
        {format(
          toZoned(day, settings.timeZone),
          settings.i18n.formats.moreDayHeader,
          { locale: settings.locale }
        )}
      </div>
      {/* The scroll region breaks out of the popover's right padding (-me-2)
         so the scrollbar sits flush in the gutter; the list then pads itself
         back (ps-1 aligns with the header, pe-4 clears the ~10px bar with a
         gap) and adds py-1 so the first/last focus ring is not clipped by
         the overflow. Layout is identical with or without a scrollbar. */}
      {viewConfig.scrollbars === 'native' ? (
        <div
          data-ec-native-scroll=''
          className='-me-2 max-h-(--ec-more-max-height,16rem) min-h-0 overflow-y-auto'
        >
          <div className='flex flex-col gap-1 py-1 ps-1 pe-4'>
            {segments.map((segment) => (
              <EventCalendarEvent
                key={segment.occurrence.key}
                segment={segment}
                className='py-0.5'
              />
            ))}
          </div>
        </div>
      ) : (
        <ScrollArea className='-me-2 min-h-0 **:data-[slot=scroll-area-viewport]:max-h-(--ec-more-max-height,16rem)'>
          <div className='flex flex-col gap-1 py-1 ps-1 pe-4'>
            {segments.map((segment) => (
              <EventCalendarEvent
                key={segment.occurrence.key}
                segment={segment}
                className='py-0.5'
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </>
  );
}
export { EventCalendarMonthView, EventCalendarMoreIndicator };
