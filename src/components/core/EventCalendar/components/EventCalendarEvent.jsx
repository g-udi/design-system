'use client';
import { createContext, useContext, useMemo } from 'react';
import {
  useEventCalendar,
  useEventCalendarSelector,
  useEventCalendarViewConfig,
  useEventCalendarViewContext
} from '../EventCalendar.jsx';
import {
  markChipPress,
  useEventCalendarGestures,
  wasRecentDrag
} from './EventCalendarDnd.jsx';
import {
  spansMultipleDays,
  toZoned,
  zonedStartOfDay
} from '../eventCalendarModel.jsx';
import { addDays, format } from 'date-fns';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../Tooltip/TooltipPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const EVENT_CALENDAR_COLORS = [
  { name: 'Blue', value: 'var(--color-blue-500)' },
  { name: 'Emerald', value: 'var(--color-emerald-500)' },
  { name: 'Violet', value: 'var(--color-violet-500)' },
  { name: 'Rose', value: 'var(--color-rose-500)' },
  { name: 'Amber', value: 'var(--color-amber-500)' },
  { name: 'Cyan', value: 'var(--color-cyan-500)' },
  { name: 'Orange', value: 'var(--color-orange-500)' },
  { name: 'Pink', value: 'var(--color-pink-500)' },
  { name: 'Teal', value: 'var(--color-teal-500)' },
  { name: 'Indigo', value: 'var(--color-indigo-500)' }
];
const EVENT_CALENDAR_GHOST = {
  move: 'rounded-sm border border-dashed border-(--ec-event-color)/50 bg-(--ec-event-color)/8',
  resize:
    'rounded-sm border border-dashed border-(--ec-event-color)/70 overflow-hidden',
  invalid: 'border-ui-destructive/70 bg-ui-destructive/10',
  invalidResize: 'border-ui-destructive/70',
  /** Applied to the clone inside an invalid resize ghost. */
  invalidContent: 'opacity-60'
};
const EVENT_CALENDAR_FADE_TRUNCATE =
  'w-full truncate @max-[10rem]:text-clip @max-[10rem]:[mask-image:linear-gradient(to_right,#000_calc(100%-0.75rem),transparent)] @max-[10rem]:rtl:[mask-image:linear-gradient(to_left,#000_calc(100%-0.75rem),transparent)]';
const EVENT_CALENDAR_SLOT_DRAFT = {
  box: 'rounded-sm border border-dashed border-ui-primary/40 bg-ui-primary/5',
  segment: 'border-y border-dashed border-ui-primary/40',
  segmentStart: 'rounded-s-sm border-s',
  segmentEnd: 'rounded-e-sm border-e',
  /**
   * The wash for segmented views, on the CELL not the dashed overlay: the
   * overlay stacks above the chips, so tinting it would wash them instead.
   */
  surface: 'bg-ui-primary/5',
  /**
   * The range readout. `leading-none` is load-bearing: the shortest timed
   * draft is one snap interval tall (16px at the default 15-minute snap and
   * 4rem hour height), and looser leading renders ~18px, clipped by the
   * draft's own overflow-hidden.
   */
  label:
    'text-ui-primary truncate px-1 py-0.5 text-xs leading-none font-medium'
};
const EventCalendarChipContext = createContext(null);
function useEventCalendarEventChip() {
  const ctx = useContext(EventCalendarChipContext);
  if (!ctx) {
    throw new Error(
      'useEventCalendarEventChip must be used within <EventCalendarEvent>'
    );
  }
  return ctx;
}
function EventCalendarEvent({
  segment,
  className,
  asChild = false,
  children,
  preview = false,
  style,
  onPointerDown,
  onClick,
  onDoubleClick,
  ...props
}) {
  const instance = useEventCalendar();
  const viewConfig = useEventCalendarViewConfig();
  const { view } = useEventCalendarViewContext();
  const gestures = useEventCalendarGestures();
  const { settings } = instance;
  const occurrence = segment.occurrence;
  const event = occurrence.event;
  const isSelectedRaw = useEventCalendarSelector(
    (state) => state.selection.eventKeys.includes(occurrence.key),
    { calendar: instance }
  );
  const isDraggingRaw = useEventCalendarSelector(
    (state) => state.drag?.occurrence.key === occurrence.key,
    { calendar: instance }
  );
  const resizeOn = useEventCalendarSelector(
    (state) => state.interactions.resize,
    { calendar: instance }
  );
  const isSelected = preview ? false : isSelectedRaw;
  const isDragging = preview ? false : isDraggingRaw;
  const isBar =
    occurrence.allDay || spansMultipleDays(occurrence, settings.timeZone);
  const inTimeGrid =
    view === 'week' || view === 'day' || view === 'days' || view === 'resource';
  const interactive = view !== 'agenda' && !preview;
  const timedBlock = inTimeGrid && !isBar;
  const horizontalBar = isBar && !inTimeGrid;
  const stackedBlock =
    timedBlock &&
    (segment.endMin ?? 0) - (segment.startMin ?? 0) >=
      viewConfig.compactEventMinutes;
  const defaultContent = (
    <>
      {/* leading dot for single-row chips (month cells, all-day bars); a
       time-grid block takes its color from the tinted surface instead, and
       in its stacked layout a dot would sit alone on the first line */}
      {!timedBlock && (
        <span
          aria-hidden
          data-slot='event-calendar-event-dot'
          className='-me-0.5 size-1.5 shrink-0 rounded-full bg-(--ec-event-color)'
        />
      )}
      {occurrence.isRecurring && (
        <RegistryIcon
          lucide='RepeatIcon'
          className='size-2.5 shrink-0 opacity-70'
          aria-hidden='true'
        />
      )}
      <span
        data-slot='event-calendar-event-title'
        className={cn(
          'min-w-0 font-medium',
          stackedBlock ? EVENT_CALENDAR_FADE_TRUNCATE : 'truncate'
        )}
      >
        {event.title}
      </span>
      {/* Show a start time only when there is room beside the title; grids
       show the full range. The time is a faded
       foreground, not the neutral muted gray, so it keeps 4.5:1 on every
       event tint in both themes */}
      {!occurrence.allDay &&
        segment.isStart &&
        (view === 'month' ? (
          <span className='text-ui-foreground/80 hidden shrink-0 @[8rem]:inline'>
            {format(
              toZoned(occurrence.start, settings.timeZone),
              settings.i18n.formats.eventTime,
              { locale: settings.locale }
            )}
          </span>
        ) : (
          <span
            className={cn(
              'text-ui-foreground/80 hidden @[8rem]:inline',
              stackedBlock ? EVENT_CALENDAR_FADE_TRUNCATE : 'truncate'
            )}
          >
            {settings.i18n.functions.formatEventTime(
              toZoned(occurrence.start, settings.timeZone),
              toZoned(occurrence.end, settings.timeZone),
              occurrence.allDay,
              { locale: settings.locale }
            )}
          </span>
        ))}
    </>
  );
  const agendaTimeText = (() => {
    if (view !== 'agenda') return '';
    if (occurrence.allDay) return settings.i18n.labels.allDay;
    const dayStart = zonedStartOfDay(segment.day, settings.timeZone);
    const dayEnd = addDays(toZoned(dayStart, settings.timeZone), 1);
    const startsBefore = occurrence.start < dayStart;
    const endsAfter = occurrence.end > dayEnd;
    if (startsBefore && endsAfter) return settings.i18n.labels.allDay;
    if (endsAfter) {
      return settings.i18n.labels.timeFrom(
        format(
          toZoned(occurrence.start, settings.timeZone),
          settings.i18n.formats.eventTime,
          { locale: settings.locale }
        )
      );
    }
    if (startsBefore) {
      return settings.i18n.labels.timeUntil(
        format(
          toZoned(occurrence.end, settings.timeZone),
          settings.i18n.formats.eventTime,
          { locale: settings.locale }
        )
      );
    }
    return settings.i18n.functions.formatEventTime(
      toZoned(occurrence.start, settings.timeZone),
      toZoned(occurrence.end, settings.timeZone),
      false,
      { locale: settings.locale }
    );
  })();
  const agendaDefaultContent = (
    <>
      <span className='text-ui-muted-foreground w-40 shrink-0 truncate tabular-nums'>
        {agendaTimeText}
      </span>
      <span
        aria-hidden
        data-slot='event-calendar-agenda-dot'
        className='size-2 shrink-0 rounded-full bg-(--ec-event-color)'
      />
      <span className='truncate text-sm'>{event.title}</span>
      {occurrence.isRecurring && (
        <RegistryIcon
          lucide='RepeatIcon'
          className='text-ui-muted-foreground size-2.5 shrink-0'
          aria-hidden='true'
        />
      )}
    </>
  );
  const customContent = useMemo(() => {
    const renderProps = { occurrence, segment, view, isDragging, isSelected };
    return view === 'agenda'
      ? viewConfig.renderAgendaEvent?.(renderProps)
      : viewConfig.renderEvent?.(renderProps);
  }, [
    occurrence,
    segment,
    view,
    isDragging,
    isSelected,
    viewConfig
  ]);
  const content =
    children ??
    customContent ??
    (view === 'agenda' ? agendaDefaultContent : defaultContent);
  const timeLabel = settings.i18n.functions.formatEventTime(
    toZoned(occurrence.start, settings.timeZone),
    toZoned(occurrence.end, settings.timeZone),
    occurrence.allDay,
    { locale: settings.locale }
  );
  const label = settings.i18n.functions.formatEventLabel
    ? settings.i18n.functions.formatEventLabel(event.title, timeLabel)
    : `${event.title}, ${timeLabel}`;
  const tooltipOpts =
    typeof viewConfig.eventTooltip === 'object'
      ? viewConfig.eventTooltip
      : null;
  const tooltipContent =
    !preview && viewConfig.eventTooltip
      ? viewConfig.renderEventTooltip?.({
          occurrence,
          segment,
          view,
          label
        }) || label
      : null;
  const tooltipOn = Boolean(tooltipContent);
  const showResize =
    interactive && resizeOn && !event.readOnly && event.resizable !== false;
  const grip = (
    <span
      aria-hidden
      data-slot='event-calendar-resize-grip'
      className={cn(
        'bg-ui-foreground/40 rounded-full',
        timedBlock ? 'h-0.5 w-2.5' : 'h-2.5 w-0.5',
        viewConfig.classNames?.resizeGrip
      )}
    />
  );
  const resizeHandles = showResize && (
    <>
      {timedBlock && segment.isStart && (
        <span
          data-slot='event-calendar-resize-handle'
          data-edge='start'
          className={cn(
            'absolute inset-x-1 top-0 flex h-1.5 cursor-ns-resize items-center justify-center opacity-0 transition-opacity duration-150 group-hover/ec-event:opacity-100',
            viewConfig.classNames?.resizeHandle
          )}
          onPointerDown={(e) => gestures.beginResize(e, segment, 'start')}
        >
          {grip}
        </span>
      )}
      {timedBlock && segment.isEnd && (
        <span
          data-slot='event-calendar-resize-handle'
          data-edge='end'
          className={cn(
            'absolute inset-x-1 bottom-0 flex h-1.5 cursor-ns-resize items-center justify-center opacity-0 transition-opacity duration-150 group-hover/ec-event:opacity-100',
            viewConfig.classNames?.resizeHandle
          )}
          onPointerDown={(e) => gestures.beginResize(e, segment, 'end')}
        >
          {grip}
        </span>
      )}
      {(horizontalBar || (isBar && inTimeGrid)) && segment.isStart && (
        <span
          data-slot='event-calendar-resize-handle'
          data-edge='start'
          className={cn(
            'absolute inset-y-0 start-0 flex w-2 cursor-ew-resize items-center justify-center opacity-0 transition-opacity duration-150 group-hover/ec-event:opacity-100',
            viewConfig.classNames?.resizeHandle
          )}
          onPointerDown={(e) => gestures.beginResize(e, segment, 'start')}
        >
          {grip}
        </span>
      )}
      {(horizontalBar || (isBar && inTimeGrid)) && segment.isEnd && (
        <span
          data-slot='event-calendar-resize-handle'
          data-edge='end'
          className={cn(
            'absolute inset-y-0 end-0 flex w-2 cursor-ew-resize items-center justify-center opacity-0 transition-opacity duration-150 group-hover/ec-event:opacity-100',
            viewConfig.classNames?.resizeHandle
          )}
          onPointerDown={(e) => gestures.beginResize(e, segment, 'end')}
        >
          {grip}
        </span>
      )}
    </>
  );
  const Comp = asChild ? Slot.Root : 'button';
  const chip = (
    <Comp
      type='button'
      data-slot='event-calendar-event'
      data-view={view}
      data-all-day={occurrence.allDay || void 0}
      data-recurring={occurrence.isRecurring || void 0}
      data-selected={isSelected || void 0}
      data-dragging={isDragging || void 0}
      data-preview={preview || void 0}
      data-past={occurrence.end.getTime() < Date.now() || void 0}
      title={preview || tooltipOn ? void 0 : label}
      aria-label={
        settings.i18n.functions.formatEventAriaLabel?.(
          event.title,
          timeLabel,
          segment.continuesBefore || segment.continuesAfter
        ) ??
        `${event.title}, ${timeLabel}${segment.continuesBefore || segment.continuesAfter ? `, ${settings.i18n.labels.continues}` : ''}`
      }
      aria-pressed={interactive ? isSelected : void 0}
      aria-hidden={preview || void 0}
      tabIndex={preview ? -1 : void 0}
      style={{
        '--ec-event-color': event.color ?? 'var(--ds-color-accent)',
        ...style
      }}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        e.stopPropagation();
        markChipPress();
        if (interactive) gestures.beginMove(e, segment);
      }}
      onClick={(e) => {
        onClick?.(e);
        e.stopPropagation();
        if (wasRecentDrag()) return;
        settings.onEventClick?.(occurrence, e);
        if (e.defaultPrevented || view === 'agenda') return;
        instance.api.selectEvent(occurrence.key);
      }}
      onDoubleClick={(e) => {
        onDoubleClick?.(e);
        e.stopPropagation();
        settings.onEventDoubleClick?.(occurrence, e);
      }}
      className={cn(
        'group/ec-event text-ui-foreground relative flex w-full min-w-0 cursor-pointer touch-none items-center overflow-hidden text-start select-none',
        'focus-visible:ring-ui-primary outline-none focus-visible:ring-2',
        preview && 'pointer-events-none',
        view === 'agenda'
          ? // plain list row: color lives in the dot badge, not a tinted pill;
            // hover AND selection surfaces are owned by the agenda row wrapper
            'gap-3 rounded-md text-sm'
          : cn(
              // @container removes intrinsic sizing; only grid chips are containers
              // py-1: room above/below inline badges (attendee pill etc.)
              '@container gap-1.5 rounded-sm px-1.5 py-1 leading-normal',
              // soft tint + inset ring, not an accent border: legible on both themes
              'bg-(--ec-event-color)/15 hover:bg-(--ec-event-color)/25',
              // a flat tint reads darker on a dark surface, so lift it there
              'dark:bg-(--ec-event-color)/20 dark:hover:bg-(--ec-event-color)/30',
              'inset-ring inset-ring-(--ec-event-color)/15',
              'transition-[background-color,box-shadow] duration-150',
              'data-dragging:opacity-40',
              'data-selected:bg-(--ec-event-color)/30 data-selected:inset-ring-(--ec-event-color)/40',
              segment.continuesBefore && 'rounded-s-none',
              segment.continuesAfter && 'rounded-e-none'
            ),
        viewConfig.classNames?.event,
        className
      )}
      {...props}
    >
      {content}
      {resizeHandles}
    </Comp>
  );
  return (
    <EventCalendarChipContext.Provider
      value={{ occurrence, segment, isDragging, isSelected }}
    >
      {tooltipOn ? (
        <TooltipProvider delayDuration={tooltipOpts?.delay ?? 600}>
          <Tooltip>
            <TooltipTrigger asChild>{chip}</TooltipTrigger>
            <TooltipContent
              side={tooltipOpts?.side ?? 'top'}
              className={viewConfig.classNames?.eventTooltip}
            >
              {tooltipContent}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        chip
      )}
    </EventCalendarChipContext.Provider>
  );
}
export {
  EVENT_CALENDAR_COLORS,
  EVENT_CALENDAR_FADE_TRUNCATE,
  EVENT_CALENDAR_GHOST,
  EVENT_CALENDAR_SLOT_DRAFT,
  EventCalendarEvent,
  useEventCalendarEventChip
};
