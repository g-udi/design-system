'use client';
import { memo, useState } from 'react';
import { useGantt, useGanttSelector, useGanttSettings, useGanttViewConfig } from '../Gantt.jsx';
import { resolveScheduleMode } from '../ganttConfig.js';
import { GanttBar } from './GanttBar.jsx';
import { useGanttGestures } from './GanttDnd.jsx';
import { wasRecentDrag } from '../ganttGestures.js';
import { toZoned } from '../ganttModel.jsx';
import { cn } from '../../../../utilities/cn/index.js';
import {
  lowestFreeLane,
  trackPoint,
  trackFraction,
  laneTopRem,
  laneBlockRem,
  AUTO_LABEL_MIN_REM
} from '../ganttViewModel.js';
const GanttTimelineRow = memo(function GanttTimelineRow2({
  row,
  rowIndex,
  bars,
  rangeStartMs,
  rangeEndMs,
  trackWidth,
  trackRemWidth,
  rowBorder,
  selected,
  resolveHintStop,
  isPanning,
  laneHeightRem,
  laneGapRem,
  minRowRem,
  ghostHeightRem,
  dependencySourceIds
}) {
  const instance = useGantt();
  const settings = useGanttSettings();
  const viewConfig = useGanttViewConfig();
  const gestures = useGanttGestures();
  const segments = bars?.segments ?? [];
  const schedulable = !row.isGroup || viewConfig.parentScheduling;
  const heightRem = bars?.heightRem ?? minRowRem;
  const laneCount = bars?.laneCount ?? 1;
  const singleTrack =
    resolveScheduleMode(row.resource, viewConfig.scheduleMode) === 'single';
  const laneOffsetRem = bars?.laneOffsetRem ?? (minRowRem - laneHeightRem) / 2;
  const [hintStop, setHintStop] = useState(null);
  const hintSuppressed = useGanttSelector(
    (state) =>
      hintStop !== null && (state.drag !== null || state.slotDraft !== null)
  );
  const canSchedule = useGanttSelector(
    (state) => state.interactions.selectSlot
  );
  const hintFreeLane = hintStop
    ? lowestFreeLane(segments, hintStop.ms, hintStop.endMs)
    : 0;
  const hintLane = bars?.scheduleMode === 'single' ? 0 : hintFreeLane;
  const hintTopRem = Math.min(
    laneTopRem(laneOffsetRem, hintLane, laneHeightRem, laneGapRem) +
      laneHeightRem / 2,
    Math.max(heightRem - laneHeightRem / 2, laneHeightRem / 2)
  );
  const hintLabel = viewConfig.dragCreate
    ? settings.i18n.labels.scheduleHintDrag
    : settings.i18n.labels.scheduleHint;
  const showHint =
    viewConfig.displayScheduleHint &&
    schedulable &&
    canSchedule &&
    !isPanning &&
    !!(settings.onSelectSlot || settings.onSlotClick);
  const hintVisible =
    showHint &&
    hintStop !== null &&
    hintFreeLane < laneCount &&
    !hintSuppressed;
  const fractionOf = (ms) =>
    Math.min(Math.max((ms - rangeStartMs) / (rangeEndMs - rangeStartMs), 0), 1);
  const dragTarget = useGanttSelector((state) => {
    const drag = state.drag;
    if (!drag || drag.proposedResourceId !== row.resource.id) return null;
    return drag.valid ? 'valid' : 'invalid';
  });
  const ghost = useGanttSelector(
    (state) => {
      const drag = state.drag;
      if (!drag || drag.proposedResourceId !== row.resource.id) return null;
      return {
        from: fractionOf(drag.proposedStart.getTime()),
        to: fractionOf(drag.proposedEnd.getTime()),
        color: drag.occurrence.event.color,
        valid: drag.valid,
        title: drag.occurrence.event.title,
        kind: drag.kind,
        occurrenceKey: drag.occurrence.key,
        // real zero duration, not from==to: clamped fractions also coincide
        // for a bar dragged clear past a range edge
        milestone: drag.proposedEnd.getTime() === drag.proposedStart.getTime()
      };
    },
    {
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.from === b.from &&
          a.to === b.to &&
          a.valid === b.valid)
    }
  );
  const draft = useGanttSelector(
    (state) => {
      const slotDraft = state.slotDraft;
      if (!slotDraft || slotDraft.resourceId !== row.resource.id) return null;
      const startMs = slotDraft.start.getTime();
      const endMs = slotDraft.end.getTime();
      return {
        from: fractionOf(startMs),
        to: fractionOf(endMs),
        startMs,
        endMs
      };
    },
    {
      // from/to as well as the instants: they are derived through fractionOf,
      // which closes over the range. An extendRange mid-gesture moves every
      // bar while an instants-only compare serves the cached (stale) fractions,
      // leaving the placeholder pinned to where the range used to be.
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.startMs === b.startMs &&
          a.endMs === b.endMs &&
          a.from === b.from &&
          a.to === b.to)
    }
  );
  const draftLane = bars?.draftLane ?? 0;
  const draftTopRem = Math.min(
    laneTopRem(laneOffsetRem, draftLane, laneHeightRem, laneGapRem),
    Math.max(heightRem - laneHeightRem, 0)
  );
  const draftLabel = draft
    ? settings.i18n.functions.formatEventTime(
        toZoned(new Date(draft.startMs), settings.timeZone),
        toZoned(new Date(draft.endMs), settings.timeZone),
        false,
        settings.locale
      )
    : '';
  const createAt = (stop, e) => {
    const currentSettings = instance.settings;
    const draft = {
      start: new Date(stop.ms),
      end: new Date(Math.max(stop.endMs, stop.ms + 1)),
      allDay: false,
      resourceId: row.resource.id
    };
    if (!schedulable || !instance.getState().interactions.selectSlot ||
        !(currentSettings.canSelectSlot?.(draft) ?? true)) return;
    if (currentSettings.onSlotClick) {
      currentSettings.onSlotClick(
        { date: new Date(stop.ms), allDay: false, resourceId: row.resource.id },
        e
      );
    } else {
      currentSettings.onSelectSlot?.(draft);
    }
  };
  const ghostLane = ghost
    ? (segments.find(
        (segment) => segment.occurrence.key === ghost.occurrenceKey
      )?.column ?? 0)
    : 0;
  const ghostLaneOffsetRem =
    laneTopRem(laneOffsetRem, ghostLane, laneHeightRem, laneGapRem) +
    (laneHeightRem - ghostHeightRem) / 2;
  return (
    <div
      data-gantt-row=''
      data-gantt-resource={row.resource.id}
      data-gantt-row-id={row.resource.id}
      data-gantt-row-static={!schedulable || void 0}
      data-gantt-bar-min={bars?.extent?.from}
      data-gantt-bar-max={bars?.extent?.to}
      data-gantt-bar-color={bars?.extent?.color}
      data-gantt-bar-label={bars?.extent?.label}
      data-gantt-bar-start-ms={bars?.extent?.startMs}
      data-drop-target={dragTarget ?? void 0}
      data-selected={selected || void 0}
      className={cn(
        'data-hover:bg-ui-muted/30 data-selected:bg-ui-primary/5 data-selected:data-hover:bg-ui-primary/5 relative w-full min-w-0',
        // The ring is pointer-events-none, so a cursor set on IT can never be
        // reached - the row is the element actually under the pointer, so the
        // cursor belongs here. Gated on the same flag as the ring: wherever the
        // add affordance shows, the pointer says "add", and nowhere else.
        hintVisible && 'cursor-crosshair',
        // horizontal separators mirror the tree node borders across panes.
        // No special case for the last row: the columns run the full height of
        // the pane, so the grid closes on the container edge on its own.
        rowBorder !== null && 'border-b',
        rowBorder === 'dashed' && 'border-dashed',
        dragTarget === 'valid' && 'bg-ui-muted/40',
        dragTarget === 'invalid' && 'bg-ui-destructive/10'
      )}
      style={{
        height: `${heightRem}rem`,
        minWidth: trackWidth
      }}
      onPointerDown={(e) => {
        if (
          viewConfig.dragCreate &&
          e.button === 0 &&
          schedulable &&
          canSchedule && // the bare track, or the hint tile that spawns under the cursor -
          // a sub-threshold press still ends as the tile's own click
          (e.target === e.currentTarget ||
            !!e.target.closest?.('[data-slot=gantt-schedule-hint]')) &&
          !!settings.onSelectSlot
        ) {
          const stop = resolveHintStop(
            trackFraction(e.currentTarget, e.clientX)
          );
          const allowed =
            stop !== null &&
            (settings.canSelectSlot?.({
              start: new Date(stop.ms),
              end: new Date(Math.max(stop.endMs, stop.ms + 1)),
              allDay: false,
              resourceId: row.resource.id
            }) ??
              true);
          if (!allowed) return;
          e.stopPropagation();
          gestures.beginCreate(e);
        }
      }}
      onPointerMove={(e) => {
        const interacting =
          instance.getState().drag !== null ||
          instance.getState().slotDraft !== null;
        if (!showHint || e.pointerType !== 'mouse' || interacting) {
          if (hintStop) setHintStop(null);
          return;
        }
        if (e.target !== e.currentTarget) {
          if (hintStop) setHintStop(null);
          return;
        }
        const { fraction, offset } = trackPoint(e.currentTarget, e.clientX);
        e.currentTarget.style.setProperty('--gantt-hint-x', `${offset}px`);
        const stop = resolveHintStop(fraction);
        const allowed =
          stop !== null &&
          (settings.canSelectSlot?.({
            start: new Date(stop.ms),
            end: new Date(Math.max(stop.endMs, stop.ms + 1)),
            allDay: false,
            resourceId: row.resource.id
          }) ??
            true);
        const next = allowed ? stop : null;
        if (next?.index !== hintStop?.index) setHintStop(next);
      }}
      onPointerLeave={() => {
        if (hintStop) setHintStop(null);
      }}
      onClick={(e) => {
        if (!viewConfig.dragCreate || e.target !== e.currentTarget) return;
        if (!schedulable || !canSchedule) return;
        if (wasRecentDrag()) return;
        if (!settings.onSlotClick && !settings.onSelectSlot) return;
        const stop = resolveHintStop(trackFraction(e.currentTarget, e.clientX));
        if (!stop) return;
        const allowed =
          settings.canSelectSlot?.({
            start: new Date(stop.ms),
            end: new Date(Math.max(stop.endMs, stop.ms + 1)),
            allDay: false,
            resourceId: row.resource.id
          }) ?? true;
        if (!allowed) return;
        createAt(stop, e);
        setHintStop(null);
      }}
    >
      {/* row CONTENT (bars, labels, ghosts). Pointer-transparent so
       empty-track presses still hit the row itself. */}
      {/* content-visibility lets the browser skip rendering this layer for
       rows scrolled out of view (large trees stay cheap on low-end
       devices). Safe here: the layer is absolute inset-0 (geometry comes
       from the row, never from content), its paint containment keeps it
       a stacking context, and nothing inside escapes the row box - the
       schedule hint deliberately lives OUTSIDE this layer. Browsers
       without support simply ignore it. */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{ contentVisibility: 'auto' }}
      >
        {/* The node's own planned window: a band behind ALL of its lanes,
       first in the layer so even the per-event ghosts paint over it. */}
        {bars?.rowBaseline &&
          (() => {
            const plan = bars.rowBaseline;
            const from = fractionOf(rangeStartMs + plan.startMin * 6e4);
            const to = fractionOf(rangeStartMs + plan.endMin * 6e4);
            const bandRemHeight = laneBlockRem(
              laneCount,
              laneHeightRem,
              laneGapRem
            );
            const content = viewConfig.renderRowBaseline?.({
              resource: row.resource,
              start: plan.baseline.start,
              end: plan.baseline.end,
              milestone: plan.baseline.milestone,
              variance: plan.variance
            });
            return (
              <div
                data-slot='gantt-row-baseline'
                data-milestone={plan.baseline.milestone || void 0}
                data-variance={plan.variance ?? void 0}
                aria-hidden
                className={cn(
                  'absolute',
                  plan.baseline.milestone
                    ? 'flex items-center justify-center'
                    : 'px-px',
                  viewConfig.classNames?.baseline
                )}
                style={{
                  '--gantt-event-color':
                    row.resource.color ?? 'var(--ds-color-accent)',
                  insetInlineStart: plan.baseline.milestone
                    ? `clamp(0rem, ${from * 100}% - ${laneHeightRem / 2}rem, 100% - ${laneHeightRem}rem)`
                    : `${from * 100}%`,
                  width: plan.baseline.milestone
                    ? `${laneHeightRem}rem`
                    : `${Math.max((to - from) * 100, 0.5)}%`,
                  top: `${laneOffsetRem}rem`,
                  height: `${bandRemHeight}rem`
                }}
              >
                {content ??
                  (plan.baseline.milestone ? (
                    // hollow diamond marking the node's planned instant
                    <span className='size-2.5 rotate-45 rounded-sm border border-(--gantt-event-color)/60 bg-(--gantt-event-color)/15' />
                  ) : (
                    // fainter than a per-event ghost: a whole-row context
                    // band must never compete with the bars on it
                    <span className='relative block h-full w-full rounded-sm border border-(--gantt-event-color)/25 bg-(--gantt-event-color)/6' />
                  ))}
              </div>
            );
          })()}
        {/* Baseline ghosts BEFORE the bars, with no z-index: DOM order keeps
       them painting under every bar (z 10+), and the layer's pointer
       transparency means they can never catch a press or a drop. */}
        {bars?.baselines.map((plan) => {
          const from = fractionOf(rangeStartMs + plan.startMin * 6e4);
          const to = fractionOf(rangeStartMs + plan.endMin * 6e4);
          const content = viewConfig.renderBaseline?.({
            event: plan.event,
            start: plan.baseline.start,
            end: plan.baseline.end,
            milestone: plan.baseline.milestone,
            variance: plan.variance
          });
          return (
            <div
              key={`baseline-${plan.event.id}`}
              data-slot='gantt-baseline'
              data-milestone={plan.baseline.milestone || void 0}
              data-variance={plan.variance}
              aria-hidden
              className={cn(
                'absolute',
                plan.baseline.milestone
                  ? 'flex items-center justify-center'
                  : 'px-px',
                viewConfig.classNames?.baseline
              )}
              style={{
                '--gantt-event-color':
                  plan.event.color ?? 'var(--ds-color-accent)',
                /* clamped into the row box: the layer's paint containment
           slices anything that overhangs it, which would cut an
           edge milestone's diamond in half - so it nudges inward
           instead, at most half a lane off its instant */
                insetInlineStart: plan.baseline.milestone
                  ? `clamp(0rem, ${from * 100}% - ${laneHeightRem / 2}rem, 100% - ${laneHeightRem}rem)`
                  : `${from * 100}%`,
                width: plan.baseline.milestone
                  ? `${laneHeightRem}rem`
                  : `${Math.max((to - from) * 100, 0.5)}%`,
                top: `${laneTopRem(laneOffsetRem, plan.lane, laneHeightRem, laneGapRem)}rem`,
                height: `${laneHeightRem}rem`
              }}
            >
              {content ??
                (plan.baseline.milestone ? (
                  // hollow diamond marking the planned instant
                  <span className='size-2 rotate-45 rounded-sm border border-(--gantt-event-color)/60 bg-(--gantt-event-color)/15' />
                ) : (
                  // block child (not inset-0) so the px-px padding holds and
                  // the outline lands exactly on the bar's own box
                  <span className='relative block h-full w-full rounded-sm border border-(--gantt-event-color)/40 bg-(--gantt-event-color)/10' />
                ))}
            </div>
          );
        })}
        {segments.map((segment, segmentIndex) => {
          const from = fractionOf(rangeStartMs + (segment.startMin ?? 0) * 6e4);
          const to = fractionOf(rangeStartMs + (segment.endMin ?? 0) * 6e4);
          const milestone =
            segment.occurrence.end.getTime() ===
            segment.occurrence.start.getTime();
          if (to <= from && !milestone) return null;
          const lane = segment.column ?? 0;
          const barRemWidth = milestone
            ? laneHeightRem
            : (to - from) * trackRemWidth;
          const wantsOutside =
            milestone ||
            viewConfig.barLabel === 'outside' ||
            (viewConfig.barLabel === 'auto' &&
              barRemWidth <
                (viewConfig.metrics?.autoLabelMin ?? AUTO_LABEL_MIN_REM));
          const placement = !wantsOutside
            ? 'inside'
            : to <= 0.92
              ? 'after'
              : from >= 0.08
                ? 'before'
                : 'inside';
          const segDragKind =
            ghost && ghost.occurrenceKey === segment.occurrence.key
              ? ghost.kind
              : void 0;
          return (
            <div
              key={segment.occurrence.key}
              data-drag-kind={segDragKind}
              data-milestone={milestone || void 0}
              data-lane={lane}
              data-lane-count={laneCount}
              className='group/gantt-seg pointer-events-auto absolute px-px data-[drag-kind=move]:opacity-0'
              style={{
                /* a milestone wrapper is a lane-height square centered on the
           instant, clamped into the row box exactly like the planned
           milestone diamond */
                insetInlineStart: milestone
                  ? `clamp(0rem, ${from * 100}% - ${laneHeightRem / 2}rem, 100% - ${laneHeightRem}rem)`
                  : `${from * 100}%`,
                width: milestone
                  ? `${laneHeightRem}rem`
                  : `${Math.max((to - from) * 100, 0.5)}%`,
                top: `${laneTopRem(laneOffsetRem, lane, laneHeightRem, laneGapRem)}rem`,
                height: `${laneHeightRem}rem`,
                // one track means every lane is 0, so paint order (not the
                // lane) is what keeps overlapping bars individually reachable
                zIndex:
                  segment.occurrence.event.zIndex ??
                  10 + (singleTrack ? segmentIndex : lane)
              }}
            >
              <GanttBar
                segment={segment}
                labelOutside={placement !== 'inside'}
                rowTitle={row.resource.title}
                className='h-full'
              />
              {placement !== 'inside' && (
                <span
                  data-slot='gantt-bar-label'
                  data-placement={placement}
                  className={cn(
                    'text-ui-foreground pointer-events-none absolute top-1/2 z-10 max-w-60 -translate-y-1/2 truncate font-medium',
                    // one label at a time: the resize ghost carries it while
                    // this bar is the faded placeholder
                    'group-data-[drag-kind^=resize]/gantt-seg:opacity-0',
                    /* a departing dependency arrow drops its corner just past
           the bar's end, so exactly those labels reserve extra
           room; everything else keeps the tight default */
                    placement === 'after'
                      ? dependencySourceIds.has(segment.occurrence.eventId)
                        ? 'start-full ms-4'
                        : 'start-full ms-2'
                      : 'end-full me-2'
                  )}
                >
                  {segment.occurrence.event.title}
                </span>
              )}
            </div>
          );
        })}
        {bars?.summary && segments.length === 0 && (
          <div
            data-slot='gantt-summary'
            aria-hidden
            className='pointer-events-none absolute top-1/2 -translate-y-1/2'
            style={{
              insetInlineStart: `${bars.summary.from * 100}%`,
              width: `${Math.max((bars.summary.to - bars.summary.from) * 100, 0.5)}%`
            }}
          >
            {viewConfig.renderSummary ? (
              // consumer-owned rollup: the positioned envelope wrapper stays
              viewConfig.renderSummary({
                resource: row.resource,
                start: new Date(
                  rangeStartMs + bars.summary.from * (rangeEndMs - rangeStartMs)
                ),
                end: new Date(
                  rangeStartMs + bars.summary.to * (rangeEndMs - rangeStartMs)
                ),
                progress: bars.summary.progress
              })
            ) : (
              <>
                {/* envelope end caps: the classic PM rollup silhouette, muted */}
                <span
                  aria-hidden
                  className='bg-ui-muted-foreground/50 absolute start-0 top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-control'
                />
                <span
                  aria-hidden
                  className='bg-ui-muted-foreground/50 absolute end-0 top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-control'
                />
                <div className='bg-ui-muted-foreground/20 relative h-1.5 overflow-hidden rounded-control'>
                  {bars.summary.progress !== null && (
                    <div
                      data-slot='gantt-summary-progress'
                      className='bg-ui-muted-foreground/50 absolute inset-y-0 start-0 rounded-control'
                      style={{ width: `${bars.summary.progress}%` }}
                    />
                  )}
                </div>
                {bars.summary.progress !== null && (
                  <span className='text-ui-muted-foreground absolute start-full top-1/2 ms-2 -translate-y-1/2 whitespace-nowrap'>
                    {bars.summary.progress}%
                  </span>
                )}
              </>
            )}
          </div>
        )}
        {ghost && (
          <div
            data-slot='gantt-drag-ghost'
            data-kind={ghost.kind}
            data-milestone={ghost.milestone || void 0}
            data-drop-invalid={!ghost.valid || void 0}
            className={cn(
              // Slight dashed indicator, never a dramatic restyle. Move shows a
              // faint drop-target placeholder (the smooth cursor clone carries
              // the visual); resize shows the event at its new size in its own
              // color with just a dashed border.
              /* height via the class, not an inline style, so a consumer's
         own selector can still outrank it */
              'pointer-events-none absolute z-40 h-(--gantt-ghost-height) rounded-sm border border-dashed font-medium',
              !ghost.valid &&
                'border-ui-destructive bg-ui-destructive/10 text-ui-destructive',
              ghost.valid &&
                ghost.kind === 'move' &&
                'border-(--gantt-event-color)/50 bg-(--gantt-event-color)/8',
              ghost.valid &&
                ghost.kind !== 'move' &&
                'text-ui-foreground border-(--gantt-event-color)/70 bg-(--gantt-event-color)/22',
              /* a milestone's landing marker keeps the milestone's SHAPE: the
         wrapper sheds its own dashed box and centers a dashed diamond
         instead - a dashed rectangle read as a different object */
              ghost.milestone &&
                'flex items-center justify-center rounded-none border-0 bg-transparent'
            )}
            style={{
              /* a milestone drop lands as a lane-height square CENTERED on
         the instant (same clamp as the diamond); the generic 0.5%
         floor would anchor a sliver at the instant's left instead */
              insetInlineStart: ghost.milestone
                ? `clamp(0rem, ${ghost.from * 100}% - ${laneHeightRem / 2}rem, 100% - ${laneHeightRem}rem)`
                : `${ghost.from * 100}%`,
              width: ghost.milestone
                ? `${laneHeightRem}rem`
                : `${Math.max((ghost.to - ghost.from) * 100, 0.5)}%`,
              // sit on the dragged schedule's OWN lane. Centering the ghost
              // in the row put it on no lane at all once a node stacked, so
              // a 3-lane row showed the drop target floating in the middle.
              top: `${ghostLaneOffsetRem}rem`,
              /* metrics-driven, and published so a consumer can size
         against the SAME number instead of hardcoding 1.25 */
              '--gantt-ghost-height': `${ghostHeightRem}rem`,
              '--gantt-event-color': ghost.color ?? 'var(--ds-color-accent)'
            }}
          >
            {ghost.milestone && (
              <span
                className={cn(
                  'size-2.5 rotate-45 rounded-sm border border-dashed',
                  ghost.valid
                    ? 'border-(--gantt-event-color)/70 bg-(--gantt-event-color)/10'
                    : 'border-ui-destructive bg-ui-destructive/10'
                )}
              />
            )}
            {ghost.kind !== 'move' && ( // label rides OUTSIDE after the bar, exactly like the resting
              // outside placement - never inside the schedule
              <span className='pointer-events-none absolute start-full top-1/2 ms-2 max-w-60 -translate-y-1/2 truncate whitespace-nowrap'>
                {ghost.title}
              </span>
            )}
          </div>
        )}
        {draft && (
          <div
            data-slot='gantt-slot-draft'
            data-lane={draftLane}
            className='border-ui-primary bg-ui-background pointer-events-none absolute z-40 overflow-hidden rounded-sm border border-dashed'
            style={{
              insetInlineStart: `${draft.from * 100}%`,
              width: `${Math.max((draft.to - draft.from) * 100, 0.5)}%`,
              // the destination lane, not the row's middle (which on a stacked
              // row is the GAP between two lanes), and the real lane height
              // rather than a hardcoded h-5 a consumer's metrics would break
              top: `${draftTopRem}rem`,
              height: `${laneHeightRem}rem`
            }}
          >
            {/* the accent tint, over the opaque base rather than over whatever
       happens to be beneath the row */}
            <span aria-hidden className='bg-ui-primary/15 absolute inset-0' />
          </div>
        )}
      </div>
      {/* OUTSIDE the content layer for the same reason as the hint bubble: the
       layer's paint containment would CLIP a chip that overhangs the row.
       Centred on the range being painted, so the times track the drag. */}
      {draft && draftLabel && (
        <div
          data-slot='gantt-slot-draft-label'
          className='pointer-events-none absolute z-40'
          style={{
            // anchored to the range's END and riding after it, exactly like the
            // drag ghost's own label. Centred above the placeholder it covered
            // the schedule on the track above - and the one thing a create
            // gesture must never hide is what is already booked.
            insetInlineStart: `${draft.to * 100}%`,
            top: `${draftTopRem}rem`,
            height: `${laneHeightRem}rem`
          }}
        >
          <span className='bg-ui-foreground text-ui-background absolute start-full top-1/2 ms-2 inline-flex w-max -translate-y-1/2 items-center rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap'>
            {draftLabel}
            {/* Same arrow as every other bubble, one size down. A 45-degree
       square is symmetric, so size-2.5 spans ~14px whichever edge it
       straddles: a small nub under a ~120px-wide chip, but most of the
       short edge of a ~26px-TALL one. size-1.5 spans ~8.5px and
       protrudes ~4px, the usual tooltip-arrow proportion, so the side
       arrow reads the same weight as the ones above and below. */}
            <span
              aria-hidden
              className='bg-ui-foreground absolute start-0 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm'
            />
          </span>
        </div>
      )}
      {/* OUTSIDE the content layer: its paint containment creates a stacking
       context that would trap the bubble's z-index under neighboring rows.
       As a direct row child its z-30 stacks above every row in the pane. */}
      {/* `hintLane < laneCount` is the second half of "empty slots only": the
       pointer being on bare track can still mean the row's own padding above
       a column that is booked on every track. There is no free track to
       draw on there, so the clamp would park the ring on top of a bar -
       exactly what must never happen. Booking such an instant is a drag from
       a free point, not a click. */}
      {hintVisible && hintStop && (
        <div
          data-slot='gantt-schedule-hint'
          className='pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2'
          style={{
            // the live cursor position, written without React (see onPointerMove)
            insetInlineStart: 'var(--gantt-hint-x, 50%)',
            // first track, centred on it - z-30 on this wrapper keeps the dot
            // above every bar, so a busy span still offers the affordance
            top: `${hintTopRem}rem`
          }}
        >
          {viewConfig.renderScheduleHint ? (
            // consumer-owned hint: the wrapper stays snapped + validated;
            // the content drives its own create flow
            viewConfig.renderScheduleHint({
              start: new Date(hintStop.ms),
              end: new Date(Math.max(hintStop.endMs, hintStop.ms + 1)),
              resource: row.resource
            })
          ) : (
            <>
              {/* the band IS the placement affordance: it covers the interval
    under the pointer, so what you see is the slot you get. Clicking
    books it; pressing and dragging paints a longer range. The bubble
    mirrors the tooltip theme, arrow included. */}
              {/* The dot IS the cursor: an open ring, so whatever it is standing
    on stays readable through it. The outer background ring is what
    keeps it visible on a dark bar - an outline, not a fill.
    The GLYPH is the native cursor rather than an icon: `cell` is the
    range-select cursor every spreadsheet uses, which is exactly the
    drag-a-range gesture, and `copy` carries a plus for the
    click-to-add case. Clicking books the interval it is standing in;
    pressing and dragging paints a range whose ends snap to the
    nearest boundary. */}
              <button
                type='button'
                data-slot='gantt-schedule-hint-tile'
                aria-label={hintLabel}
                className='border-ui-primary ring-ui-background/80 pointer-events-none block size-5 rounded-full border-2 bg-transparent ring-1'
                onPointerDown={(e) => {
                  if (!viewConfig.dragCreate) e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (wasRecentDrag()) return;
                  createAt(hintStop, e);
                  setHintStop(null);
                }}
              />
              <span
                data-slot='gantt-schedule-hint-bubble'
                className={cn(
                  'bg-ui-foreground text-ui-background absolute start-1/2 inline-flex w-max -translate-x-1/2 items-center rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap',
                  rowIndex === 0 ? 'top-full mt-2' : 'bottom-full mb-2'
                )}
              >
                {hintLabel}
                <span
                  aria-hidden
                  className={cn(
                    'bg-ui-foreground absolute start-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-sm',
                    rowIndex === 0 ? '-top-1' : '-bottom-1'
                  )}
                />
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
});
export { GanttTimelineRow };
