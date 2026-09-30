'use client';
import { createContext, useContext, useMemo, useState } from 'react';
import {
  useGantt,
  useGanttSelector,
  useGanttViewConfig
} from './gantt-extended.jsx';
import { useGanttGestures, wasRecentDrag } from './gantt-dnd-extended.jsx';
import {
  flattenResources,
  getBaselineVariance,
  resolveEventBaseline,
  toZoned
} from './gantt-lib-extended.jsx';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger
} from '../../DropdownMenu/parts/context-menu.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const GANTT_COLORS = [
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
const GanttBarContext = createContext(null);
function useGanttBarContext() {
  const ctx = useContext(GanttBarContext);
  if (!ctx) {
    throw new Error('useGanttBarContext must be used within <GanttBar>');
  }
  return ctx;
}
function GanttBar({
  segment,
  className,
  asChild = false,
  children,
  labelOutside,
  rowTitle: rowTitleProp,
  ...props
}) {
  const instance = useGantt();
  const viewConfig = useGanttViewConfig();
  const gestures = useGanttGestures();
  const { settings } = instance;
  const occurrence = segment.occurrence;
  const event = occurrence.event;
  const isSelected = useGanttSelector(
    (state) => state.selection.eventKeys.includes(occurrence.key),
    { calendar: instance }
  );
  const isDragging = useGanttSelector(
    (state) => state.drag?.occurrence.key === occurrence.key,
    { calendar: instance }
  );
  const dragKind = useGanttSelector(
    (state) =>
      state.drag?.occurrence.key === occurrence.key ? state.drag.kind : null,
    { calendar: instance }
  );
  const [tipOpen, setTipOpen] = useState(false);
  const anyInteracting = useGanttSelector(
    (state) => tipOpen && (state.drag !== null || state.slotDraft !== null),
    { calendar: instance }
  );
  const progress =
    typeof event.progress === 'number'
      ? Math.min(Math.max(Math.round(event.progress), 0), 100)
      : null;
  const milestone = occurrence.end.getTime() === occurrence.start.getTime();
  const baseline = viewConfig.baselineBars ? resolveEventBaseline(event) : null;
  const baselineVariance = baseline ? getBaselineVariance(event) : null;
  const defaultContent = (
    <>
      {occurrence.isRecurring && (
        <RegistryIcon
          lucide='RepeatIcon'
          className='size-2.5 shrink-0 opacity-70'
          aria-hidden='true'
        />
      )}
      <span className='truncate font-medium'>{event.title}</span>
      {!occurrence.allDay && segment.isStart && (
        <span className='text-ui-muted-foreground hidden truncate @[8rem]:inline'>
          {settings.i18n.functions.formatEventTime(
            toZoned(occurrence.start, settings.timeZone),
            toZoned(occurrence.end, settings.timeZone),
            occurrence.allDay,
            settings.locale
          )}
        </span>
      )}
    </>
  );
  const renderProps = { occurrence, segment, isDragging, isSelected };
  const content =
    children ??
    viewConfig.renderEvent?.(renderProps) ??
    (labelOutside || milestone ? null : defaultContent);
  const consumerOwnsContent = children !== void 0 || !!viewConfig.renderEvent;
  const timeLabel = settings.i18n.functions.formatEventTime(
    toZoned(occurrence.start, settings.timeZone),
    toZoned(occurrence.end, settings.timeZone),
    occurrence.allDay,
    settings.locale
  );
  const baselineStartMs = baseline?.start.getTime();
  const baselineEndMs = baseline?.end.getTime();
  const plannedLabel = useMemo(
    () =>
      baselineStartMs === void 0 || baselineEndMs === void 0
        ? void 0
        : settings.i18n.labels.planned(
            settings.i18n.functions.formatEventTime(
              toZoned(new Date(baselineStartMs), settings.timeZone),
              toZoned(new Date(baselineEndMs), settings.timeZone),
              occurrence.allDay,
              settings.locale
            )
          ),
    [
      baselineStartMs,
      baselineEndMs,
      occurrence.allDay,
      settings.i18n,
      settings.timeZone,
      settings.locale
    ]
  );
  const fallbackRowTitle = useMemo(
    () =>
      rowTitleProp === void 0 && event.resourceId
        ? flattenResources(settings.resources).find(
            ({ resource }) => resource.id === event.resourceId
          )?.resource.title
        : void 0,
    [rowTitleProp, event.resourceId, settings.resources]
  );
  const rowTitle = rowTitleProp ?? fallbackRowTitle;
  const showResize = gestures.canResize(segment);
  const resizeHandles = showResize && (
    <>
      {segment.isStart && (
        <span
          data-slot='gantt-resize-handle'
          data-edge='start'
          className='absolute inset-y-0 start-0.5 flex w-2 cursor-ew-resize items-center justify-start opacity-0 group-hover/gantt-bar-group:opacity-100 pointer-coarse:opacity-100'
          onPointerDown={(e) => gestures.beginResize(e, segment, 'start')}
        >
          <span
            aria-hidden
            className='bg-ui-foreground/40 h-2.5 w-0.5 rounded-control'
          />
        </span>
      )}
      {segment.isEnd && (
        <span
          data-slot='gantt-resize-handle'
          data-edge='end'
          className='absolute inset-y-0 end-0.5 flex w-2 cursor-ew-resize items-center justify-end opacity-0 group-hover/gantt-bar-group:opacity-100 pointer-coarse:opacity-100'
          onPointerDown={(e) => gestures.beginResize(e, segment, 'end')}
        >
          <span
            aria-hidden
            className='bg-ui-foreground/40 h-2.5 w-0.5 rounded-control'
          />
        </span>
      )}
    </>
  );
  const Comp = asChild ? Slot.Root : 'button';
  const barButton = (
    <Comp
      type='button'
      data-slot='gantt-bar'
      data-milestone={milestone || void 0}
      data-all-day={occurrence.allDay || void 0}
      data-recurring={occurrence.isRecurring || void 0}
      data-selected={isSelected || void 0}
      data-dragging={isDragging || void 0}
      data-drag-kind={dragKind ?? void 0}
      data-past={occurrence.end.getTime() < Date.now() || void 0}
      data-label-outside={labelOutside || void 0}
      data-progress={progress ?? void 0}
      data-completed={progress === 100 || void 0}
      data-baseline={!!baseline || void 0}
      data-baseline-variance={baselineVariance ?? void 0}
      aria-label={settings.i18n.functions.formatEventAriaLabel({
        title: event.title,
        timeLabel,
        milestoneLabel: milestone ? settings.i18n.labels.milestone : void 0,
        rowTitle,
        progressLabel:
          progress !== null ? settings.i18n.labels.progress(progress) : void 0,
        plannedLabel,
        continues: segment.continuesBefore || segment.continuesAfter
      })}
      style={{
        '--gantt-event-color': event.color ?? 'var(--color-primary)'
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        gestures.beginMove(e, segment);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (wasRecentDrag()) return;
        instance.api.selectEvent(occurrence.key);
        settings.onEventClick?.(occurrence, e);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        settings.onEventDoubleClick?.(occurrence, e);
      }}
      className={cn(
        'group/gantt-bar-group text-ui-foreground @container relative flex w-full min-w-0 cursor-pointer touch-none items-center gap-1.5 overflow-hidden rounded-sm px-1.5 py-0.5 text-start leading-normal select-none',
        'focus-visible:ring-ui-ring/50 outline-none focus-visible:ring-2',
        // the unfilled remainder has to be legible on its own - at /12 a bar
        // with a progress fill read as a floating segment with no basement
        'bg-(--gantt-event-color)/20 hover:bg-(--gantt-event-color)/30',
        // move: hide the original (the smooth cursor clone represents it)
        'data-[drag-kind=move]:opacity-0',
        // resize: keep the original event exactly, just fade it to a soft
        // placeholder behind the dashed preview - no dramatic restyle
        'data-[drag-kind=resize-end]:opacity-40 data-[drag-kind=resize-start]:opacity-40',
        'data-selected:bg-(--gantt-event-color)/30',
        /* the diamond is the milestone's body, so the shell sheds its own
         tinted fill and centers the glyph on the instant */
        milestone &&
          'justify-center bg-transparent px-0 hover:bg-transparent data-selected:bg-transparent',
        segment.continuesBefore && 'rounded-s-none',
        segment.continuesAfter && 'rounded-e-none',
        viewConfig.classNames?.event,
        className
      )}
      {...props}
    >
      {milestone &&
        !consumerOwnsContent && ( // the filled diamond IS the milestone's body - chrome, so a custom
          // renderEvent still starts from a blank canvas (data-milestone
          // keeps the fact readable there)
          <span
            aria-hidden
            data-slot='gantt-bar-milestone'
            className={cn(
              'size-2.5 shrink-0 rotate-45 rounded-sm border border-(--gantt-event-color) bg-(--gantt-event-color)/80',
              isSelected && 'ring-ui-ring/50 ring-2'
            )}
          />
        )}
      {progress !== null &&
        !milestone && ( // Chrome, not content: it is an absolutely-positioned layer BEHIND
          // whatever the bar renders, so a consumer bar (renderEvent) keeps its
          // completion fill instead of silently losing it. The inline done-mark
          // below stays gated, because that one really is content.
          <span
            aria-hidden
            data-slot='gantt-bar-progress'
            className='pointer-events-none absolute inset-y-0 start-0 border-e border-(--gantt-event-color)/65 bg-(--gantt-event-color)/40 data-full:border-e-0'
            data-full={progress === 100 || void 0}
            style={{ width: `${progress}%` }}
          />
        )}
      {progress === 100 &&
        !consumerOwnsContent &&
        !milestone && ( // done mark: completion chrome like the fill itself, so it shows
          // for outside-label bars too (where the inner content is empty)
          <RegistryIcon
            lucide='CheckIcon'
            className='relative size-2.5 shrink-0 opacity-80'
            aria-hidden='true'
          />
        )}
      {content}
      {resizeHandles}
    </Comp>
  );
  const menu = viewConfig.renderEventMenu?.(renderProps);
  const trigger = menu ? (
    <ContextMenuTrigger asChild>
      <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
        {barButton}
      </TooltipTrigger>
    </ContextMenuTrigger>
  ) : (
    <TooltipTrigger asChild onFocus={(e) => e.preventDefault()}>
      {barButton}
    </TooltipTrigger>
  );
  const barTree = (
    <TooltipProvider delayDuration={500} skipDelayDuration={300}>
      <Tooltip
        open={tipOpen && !anyInteracting}
        onOpenChange={(next) => setTipOpen(next)}
      >
        {trigger}
        {tipOpen && !anyInteracting && (
          <TooltipContent side='top' className='pointer-events-none'>
            <div className='font-medium'>{event.title}</div>
            <div className='opacity-80'>{timeLabel}</div>
            {plannedLabel && <div className='opacity-80'>{plannedLabel}</div>}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
  return (
    <GanttBarContext.Provider
      value={{ occurrence, segment, isDragging, isSelected }}
    >
      {menu ? (
        <ContextMenu>
          {barTree}
          <ContextMenuContent data-slot='gantt-bar-menu' className='min-w-44'>
            {menu}
          </ContextMenuContent>
        </ContextMenu>
      ) : (
        barTree
      )}
    </GanttBarContext.Provider>
  );
}
export { GANTT_COLORS, GanttBar, useGanttBarContext };
