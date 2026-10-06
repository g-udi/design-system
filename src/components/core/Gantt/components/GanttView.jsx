'use client';
import { useControllableState } from '../../../../hooks/state/use-controllable-state.js';
import { useInterval } from '../../../../hooks/state/use-interval.js';
import { useEventListener } from '../../../../hooks/interaction/use-event-listener.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { resolveTimelineLines, useGantt, useGanttSelector, useGanttSettings, useGanttViewConfig } from '../Gantt.jsx';
import { getDayKey, getRangeKey } from '../ganttModel.jsx';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import Loader from '../../Loader/index.js';
import { ScrollArea, ScrollBar } from '../../ScrollArea/ScrollArea.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../Tooltip/TooltipPrimitives.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import {
  lowestFreeLane,
  LANE_HEIGHT_REM,
  LANE_GAP_REM,
  ROW_PADDING_REM,
  GHOST_HEIGHT_REM,
  laneTopRem,
  laneBlockRem,
  DEFAULT_COLUMN_WIDTH,
  MIN_TIMELINE_WIDTH,
  EMPTY_ID_SET
} from '../ganttViewModel.js';
import { GanttNowLine, GanttNowDot, GanttCustomDragLayer } from './GanttIndicators.jsx';
import { GanttDependencyLayer } from './GanttDependencyLayer.jsx';
import { GanttTreeRow } from './GanttTreeRow.jsx';
import { GanttTimelineRow } from './GanttTimelineRow.jsx';
import { GanttOffscreenChips } from './GanttOffscreenChips.jsx';
import { useGanttRowReorder } from '../hooks/useGanttRowReorder.js';
import { useGanttViewport } from '../hooks/useGanttViewport.js';
import { useGanttRows } from '../hooks/useGanttRows.js';
import { useGanttTimeScale } from '../hooks/useGanttTimeScale.js';
function useTodayKey(timeZone) {
  const [key, setKey] = useState(() =>
    getDayKey(new Date(), timeZone)
  );
  const tick = useCallback(() => setKey(getDayKey(new Date(), timeZone)), [timeZone]);
  useEffect(tick, [tick]);
  useInterval(tick, 60000);
  useEventListener('visibilitychange', tick, 'document');
  useEventListener('focus', tick);
  return key;
}
const DEFAULT_TREE_PANEL = {
  width: 288,
  minWidth: 180,
  maxWidth: 640,
  resizable: true,
  nameColumnWidth: 208
};
const INFINITE_EDGE_PX = 160;
function GanttView({
  className,
  asChild = false,
  interval: intervalProp,
  ...props
}) {
  const instance = useGantt();
  const settings = useGanttSettings();
  const viewConfig = useGanttViewConfig();
  const range = useGanttSelector((state) => state.visibleRange, {
    isEqual: (a, b) => getRangeKey(a) === getRangeKey(b)
  });
  const occurrences = useGanttSelector(() => instance.api.getOccurrences(), {
    calendar: instance,
    isEqual: (a, b) =>
      a.length === b.length &&
      a.every(
        (occ, i) =>
          occ.key === b[i]?.key &&
          occ.start.getTime() === b[i]?.start.getTime() &&
          occ.end.getTime() === b[i]?.end.getTime() &&
          occ.event === b[i]?.event
      )
  });
  const [collapsedIds, setCollapsedIds] = useControllableState({
    value: viewConfig.collapsedGroups,
    defaultValue: () => viewConfig.defaultCollapsedGroups ?? [],
    onChange: viewConfig.onCollapsedGroupsChange
  });
  const collapsedGroups = useMemo(() => new Set(collapsedIds), [collapsedIds]);
  const scale = useGanttSelector((state) => state.scale);
  const interval = Math.min(
    Math.max(intervalProp ?? viewConfig.interval, 15),
    240
  );
  const metrics = viewConfig.metrics;
  const laneHeightRem = metrics?.laneHeight ?? LANE_HEIGHT_REM;
  const rowPaddingRem = metrics?.rowPadding ?? ROW_PADDING_REM;
  const laneGapRem = metrics?.laneGap ?? LANE_GAP_REM;
  const minRowRem = metrics?.minRowHeight ?? 2.5;
  const ghostHeightRem = metrics?.ghostHeight ?? GHOST_HEIGHT_REM;
  const minTimelineWidth = metrics?.minTimelineWidth ?? MIN_TIMELINE_WIDTH;
  const infiniteEdgePx = metrics?.infiniteScrollEdge ?? INFINITE_EDGE_PX;
  const timeZone = settings.timeZone;
  const rangeStartMs = range.start.getTime();
  const rangeEndMs = range.end.getTime();
  const rangeKey = getRangeKey(range);
  const snapMin = scale === 'day' ? settings.snapDuration : 24 * 60;
  const todayDayKey = useTodayKey(timeZone);
  const rows = useMemo(() => {
    const result = [];
    const walk = (resources, depth, parentId) => {
      for (const resource of resources) {
        const isGroup = !!resource.children?.length;
        const collapsed = collapsedGroups.has(resource.id);
        result.push({ resource, parentId, depth, isGroup, collapsed });
        if (isGroup && !collapsed)
          walk(resource.children, depth + 1, resource.id);
      }
    };
    walk(settings.resources, 0, null);
    return result;
  }, [settings.resources, collapsedGroups]);
  const {
    units,
    groups,
    zoomRange,
    clampZoom,
    zoom,
    setZoomValue,
    canZoomIn,
    canZoomOut,
    trackRemWidth,
    trackWidth,
    uniform,
    unitFractions,
    resolveHintStop,
    groupBoundaries
  } = useGanttTimeScale({
    timeZone,
    scale,
    interval,
    settings,
    range,
    rangeEndMs,
    viewConfig,
    metrics,
    todayDayKey
  });
  const {
    allEvents,
    draftLayout,
    baseRowBars
  } = useGanttRows({
    settings,
    viewConfig,
    rows,
    rangeEndMs,
    rangeStartMs,
    occurrences,
    laneHeightRem,
    laneGapRem,
    minRowRem,
    rowPaddingRem
  });
  const treeConfig = { ...DEFAULT_TREE_PANEL, ...viewConfig.treePanel };
  const clampTree = (width) =>
    Math.min(Math.max(width, treeConfig.minWidth), treeConfig.maxWidth);
  const [treeWidth, setTreeWidth] = useState(treeConfig.width);
  const configuredTreeWidth = clampTree(treeWidth);
  const columns = viewConfig.columns ?? [];
  const rowBars = useMemo(() => {
    if (!draftLayout) return baseRowBars;
    const base = baseRowBars.get(draftLayout.resourceId);
    if (!base) return baseRowBars;
    const next = new Map(baseRowBars);
    if (base.scheduleMode === 'single') {
      next.set(draftLayout.resourceId, { ...base, draftLane: 0 });
      return next;
    }
    const draftLane = lowestFreeLane(
      base.segments,
      draftLayout.startMs,
      draftLayout.endMs
    );
    const trackCount = Math.max(base.laneCount, draftLane + 1);
    const draftBlockRem = laneBlockRem(trackCount, laneHeightRem, laneGapRem);
    next.set(draftLayout.resourceId, {
      ...base,
      draftLane,
      heightRem: Math.max(
        base.heightRem,
        base.laneOffsetRem * 2 + draftBlockRem
      )
    });
    return next;
  }, [baseRowBars, draftLayout, laneHeightRem, laneGapRem]);
  const dependencySourceIds = useMemo(() => {
    if (!viewConfig.dependencyLines) return EMPTY_ID_SET;
    let ids = null;
    for (const event of allEvents) {
      if (!event.dependencies?.length) continue;
      for (const id of event.dependencies) {
        if (!ids) ids = new Set();
        ids.add(id);
      }
    }
    return ids ?? EMPTY_ID_SET;
  }, [allEvents, viewConfig.dependencyLines]);
  const dependencyEdges = useMemo(() => {
    const none = { edges: [], totalRem: 0 };
    if (!viewConfig.dependencyLines) return none;
    const totalMin = (rangeEndMs - rangeStartMs) / 6e4;
    if (totalMin <= 0) return none;
    const anchors = new Map();
    const pending = [];
    let topRem = 0;
    for (const row of rows) {
      const bars = rowBars.get(row.resource.id);
      if (bars) {
        for (const segment of bars.segments) {
          const occ = segment.occurrence;
          if (occ.isRecurring) continue;
          const lane = segment.column ?? 0;
          const y =
            topRem +
            laneTopRem(bars.laneOffsetRem, lane, laneHeightRem, laneGapRem) +
            laneHeightRem / 2;
          const startX = ((segment.startMin ?? 0) / totalMin) * trackRemWidth;
          const endX = ((segment.endMin ?? 0) / totalMin) * trackRemWidth;
          anchors.set(occ.eventId, { endX, y });
          if (occ.event.dependencies?.length) {
            pending.push({
              id: occ.eventId,
              dependencies: occ.event.dependencies,
              startX,
              y
            });
          }
        }
      }
      topRem += bars?.heightRem ?? minRowRem;
    }
    if (pending.length === 0) return none;
    const edges = [];
    for (const item of pending) {
      for (const depId of item.dependencies) {
        if (depId === item.id) continue;
        const from = anchors.get(depId);
        if (!from) continue;
        edges.push({
          key: `${depId}->${item.id}`,
          fromId: depId,
          toId: item.id,
          fromX: from.endX,
          fromY: from.y,
          toX: item.startX,
          toY: item.y
        });
      }
    }
    return { edges, totalRem: topRem };
  }, [
    rows,
    rowBars,
    rangeStartMs,
    rangeEndMs,
    trackRemWidth,
    laneHeightRem,
    laneGapRem,
    minRowRem,
    viewConfig.dependencyLines
  ]);
  const showCreateTask =
    viewConfig.displayCreateTaskHint &&
    !!settings.onCreateTask &&
    (settings.canCreateTask?.({ parentId: null }) ?? true);
  const [isPanning, setIsPanning] = useState(false);
  const {
    clampedTreeWidth,
    liveTreeWidthRef,
    selectedSet,
    toggleRowSelected,
    bodyRef,
    treePaneRef,
    timelinePaneRef,
    treeRowsRef,
    beginSplit,
    anchorZoomCenter,
    beginHeaderPan
  } = useGanttViewport({
    minTimelineWidth,
    treeConfig,
    configuredTreeWidth,
    zoom,
    scale,
    rangeKey,
    rows,
    viewConfig,
    clampTree,
    setTreeWidth,
    instance,
    rangeStartMs,
    rangeEndMs,
    infiniteEdgePx,
    timeZone,
    clampZoom,
    setZoomValue,
    setIsPanning
  });
  const {
    reorder,
    reorderEnabled,
    beginRowReorder
  } = useGanttRowReorder({
    settings,
    rows,
    treeRowsRef,
    treePaneRef
  });
  const onToggleRow = useCallback((row) => {
    setCollapsedIds((current) => current.includes(row.resource.id)
      ? current.filter((id) => id !== row.resource.id)
      : [...current, row.resource.id]);
  }, [setCollapsedIds]);
  const loading = useGanttSelector((state) => state.loading);
  const customScrollbars = viewConfig.scrollbars !== 'native';
  const gridLines = resolveTimelineLines(viewConfig.timelineLines);
  const showVerticalLines = gridLines.vertical !== null;
  const offDayClassName =
    (typeof viewConfig.offDays === 'object' && viewConfig.offDays.className) ||
    'bg-ui-muted/40';
  const offDayBodyClassName =
    (typeof viewConfig.offDays === 'object' && viewConfig.offDays.className) ||
    'bg-ui-muted/25 bg-[repeating-linear-gradient(135deg,transparent,transparent_5px,color-mix(in_oklab,var(--ds-color-border)_35%,transparent)_5px,color-mix(in_oklab,var(--ds-color-border)_35%,transparent)_6px)]';
  const showUnitLines = !uniform || showVerticalLines;
  const namePaddingStart = reorderEnabled ? '3.125rem' : '2.25rem';
  const treeContent = (
    <div
      className={cn(
        'flex min-h-full w-max min-w-full flex-col',
        // clearance for the pinned horizontal scrollbar strip
        customScrollbars && 'pb-2.5'
      )}
    >
      {/* Same 65px height as the two-row timeline header so the panes align.
       The head keeps its own bottom rule (under the Resources label), but
       the header/body boundary line is transparent so the first tree node
       has no rule directly above it - the 1px is kept only to preserve the
       65px height, matching the timeline. */}
      <div
        data-slot='gantt-tree-header'
        className='bg-ui-background sticky top-0 z-30 box-content h-16 shrink-0 border-b border-b-transparent'
      >
        <div className='flex h-8 border-b'>
          <div className='flex h-full min-w-0 flex-1'>
            <div
              className='flex h-full shrink-0 items-center'
              style={{
                width: treeConfig.nameColumnWidth,
                paddingInlineStart: namePaddingStart
              }}
            >
              <span className='text-ui-muted-foreground truncate font-medium'>
                {settings.i18n.labels.resources}
              </span>
            </div>
            {columns.map((column) => (
              <div
                key={column.id}
                data-slot='gantt-column-header'
                data-column={column.id}
                className={cn(
                  'text-ui-muted-foreground flex h-full shrink-0 items-center px-2 font-medium',
                  column.align === 'center' && 'justify-center',
                  column.align === 'end' && 'justify-end',
                  column.className
                )}
                style={{ width: column.width ?? DEFAULT_COLUMN_WIDTH }}
              >
                <span className='truncate'>{column.title ?? column.id}</span>
              </div>
            ))}
            <div className='min-w-0 flex-1' />
          </div>
          {viewConfig.columnsMenu && (
            <div
              data-slot='gantt-columns-menu'
              className='bg-ui-background before:from-ui-background sticky end-0 z-10 flex h-full shrink-0 items-center ps-1.5 pe-2.5 before:pointer-events-none before:absolute before:inset-y-0 before:-start-5 before:w-5 before:bg-linear-to-l before:to-transparent rtl:before:bg-linear-to-r'
            >
              {viewConfig.columnsMenu}
            </div>
          )}
        </div>
      </div>
      <div ref={treeRowsRef} className='flex flex-col'>
        {rows.map((row) => (
          <GanttTreeRow
            key={row.resource.id}
            row={row}
            heightRem={rowBars.get(row.resource.id)?.heightRem ?? minRowRem}
            bandRem={rowBars.get(row.resource.id)?.bandRem ?? minRowRem}
            columns={columns}
            nameWidth={treeConfig.nameColumnWidth}
            dimmed={reorder?.resourceId === row.resource.id}
            selected={selectedSet.has(row.resource.id)}
            onSelectedChange={row.isGroup ? void 0 : toggleRowSelected}
            onGripPointerDown={reorderEnabled ? beginRowReorder : void 0}
            onToggle={onToggleRow}
          />
        ))}
        {showCreateTask && (
          <button
            type='button'
            data-slot='gantt-create-task'
            className='text-ui-muted-foreground hover:text-ui-foreground hover:bg-ui-muted/40 flex h-10 w-full shrink-0 items-center border-b ps-3 pe-3'
            onClick={() =>
              settings.onCreateTask?.({
                parentId: null,
                index: settings.resources.length
              })
            }
          >
            <span className='flex h-full w-full items-center'>
              {reorderEnabled && (
                <span aria-hidden className='w-3.5 shrink-0' />
              )}
              {/* group chevrons sit centered in a size-5 button that fills
       this w-5 gutter, so the + must center here too */}
              <span className='me-1 flex w-5 shrink-0 items-center justify-center'>
                <RegistryIcon
                  lucide='PlusIcon'
                  className='size-3.5'
                  aria-hidden='true'
                />
              </span>
              <span>{settings.i18n.labels.addTask}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
  const timelineContent = (
    <div
      className={cn(
        // grow (not just min-h-full) so the body reaches the bottom of the
        // pane: the columns then run the full height and the empty space
        // below the last row becomes pannable canvas instead of dead area
        'flex min-h-full w-max min-w-full grow flex-col',
        customScrollbars && 'pb-2.5'
      )}
    >
      {/* Two-row grouped header; also the drag-to-pan surface */}
      <div
        data-slot='gantt-timeline-header'
        className='bg-ui-background sticky top-0 z-30 shrink-0 border-b'
        style={{ minWidth: trackWidth }}
        onPointerDown={beginHeaderPan}
      >
        {/* group sectors; boundaries painted like the body lines */}
        <div className='relative h-8 border-b'>
          <div className='flex h-full'>
            {groups.map((group) => (
              <div
                key={group.key}
                data-slot='gantt-axis-group'
                className='text-ui-muted-foreground flex min-w-0 items-center ps-3 pe-2'
                style={{ flex: `${group.span} 0 0px` }}
              >
                {/* Pure-CSS sticky: the label rides the leading edge for as
     long as its own band is on screen, then the next band pushes
     it out - so the day you are looking at always names itself.
     The browser composites this; a scroll listener would run JS
     on every frame to do worse. start-3 matches the cell's ps-3
     so the gutter is identical parked or pinned. */}
                <span
                  data-slot='gantt-axis-group-label'
                  className='sticky start-3 max-w-full truncate'
                >
                  {group.label}
                </span>
              </div>
            ))}
          </div>
          {/* same span formula as the unit lines below: equal fractions get
       equal layout rounding, so the two rows' lines never drift apart */}
          {groupBoundaries.map((fraction) => (
            <span
              key={fraction}
              aria-hidden
              className='bg-ui-border absolute inset-y-0 w-px'
              style={{ insetInlineStart: `calc(${fraction * 100}% - 1px)` }}
            />
          ))}
        </div>
        {/* units, engine axis = this row */}
        <div
          data-gantt-axis=''
          data-gantt-range-start={rangeStartMs}
          data-gantt-range-end={rangeEndMs}
          data-gantt-snap={snapMin}
          className='relative h-8'
        >
          {/* chrome underlay: off-day washes under the label layer */}
          <div aria-hidden className='absolute inset-0'>
            {unitFractions.map(
              ({ unit, start, width }) =>
                unit.isOff && (
                  <span
                    key={unit.key}
                    className={cn('absolute inset-y-0', offDayClassName)}
                    style={{
                      insetInlineStart: `${start * 100}%`,
                      width: `${width * 100}%`
                    }}
                  />
                )
            )}
          </div>
          <div className='flex h-full'>
            {units.map((unit) => (
              <div
                key={unit.key}
                data-today={unit.isToday || void 0}
                data-off={unit.isOff || void 0}
                className={cn(
                  'flex min-w-0 items-center justify-center truncate px-1.5 text-center',
                  'text-ui-muted-foreground',
                  unit.isToday && 'text-ui-primary font-medium'
                )}
                style={{ flex: `${unit.weight} 0 0px` }}
              >
                {/* today reads as a soft pill, not just tinted text */}
                {unit.isToday ? (
                  <span className='bg-ui-primary/10 truncate rounded-control px-1.5 py-px'>
                    {unit.label}
                  </span>
                ) : (
                  unit.label
                )}
              </div>
            ))}
          </div>
          {showUnitLines &&
            unitFractions.slice(1).map(({ unit, start }) => (
              <span
                key={unit.key}
                aria-hidden
                data-slot='gantt-grid-line'
                data-axis='vertical'
                className={cn(
                  'absolute inset-y-0 w-px',
                  // a dashed rule is a repeating gradient, not a border: the
                  // line is a 1px span, and border-dashed on a zero-width box
                  // paints nothing
                  gridLines.vertical === 'dashed'
                    ? 'bg-[repeating-linear-gradient(to_bottom,var(--ds-color-border)_0,var(--ds-color-border)_3px,transparent_3px,transparent_6px)]'
                    : 'bg-ui-border'
                )}
                style={{ insetInlineStart: `calc(${start * 100}% - 1px)` }}
              />
            ))}
          {viewConfig.nowIndicator && (
            <GanttNowDot rangeStartMs={rangeStartMs} rangeEndMs={rangeEndMs} />
          )}
        </div>
      </div>
      {/* Rows over a shared backdrop (off days, today, boundaries, now);
       grows so the columns run to the bottom of the pane. Pressing anywhere
       here that is not a bar or a hint tile begins a scroll pan - the whole
       panel is a draggable canvas, not just the rows. */}
      <div
        className='relative flex min-h-0 grow flex-col'
        onPointerDown={beginHeaderPan}
      >
        {/* off-day / today / now backdrop only; vertical gridlines are
       per-row and reveal on selection, not painted here */}
        <div
          aria-hidden
          data-slot='gantt-timeline-backdrop'
          className='pointer-events-none absolute inset-0'
        >
          {unitFractions.map(({ unit, start, width }) => (
            <span key={unit.key} className='contents'>
              {unit.isOff && (
                <span
                  data-off=''
                  className={cn('absolute inset-y-0', offDayBodyClassName)}
                  style={{
                    insetInlineStart: `${start * 100}%`,
                    width: `${width * 100}%`
                  }}
                />
              )}
              {unit.isToday && scale !== 'day' && (
                <span
                  data-today=''
                  className='bg-ui-primary/5 absolute inset-y-0'
                  style={{
                    insetInlineStart: `${start * 100}%`,
                    width: `${width * 100}%`
                  }}
                />
              )}
            </span>
          ))}
          {/* one layer for the whole body, not per row: the unit boundaries
     have to line up with the header's spans exactly, so both use the
     same fraction formula */}
          {gridLines.vertical !== null &&
            unitFractions
              .slice(1)
              .map(({ unit, start }) => (
                <span
                  key={`grid-${unit.key}`}
                  data-slot='gantt-grid-line'
                  data-axis='vertical'
                  className={cn(
                    'absolute inset-y-0 w-px',
                    gridLines.vertical === 'dashed'
                      ? 'bg-[repeating-linear-gradient(to_bottom,var(--ds-color-border)_0,var(--ds-color-border)_3px,transparent_3px,transparent_6px)]'
                      : 'bg-ui-border'
                  )}
                  style={{ insetInlineStart: `calc(${start * 100}% - 1px)` }}
                />
              ))}
          {viewConfig.nowIndicator && (
            <GanttNowLine rangeStartMs={rangeStartMs} rangeEndMs={rangeEndMs} />
          )}
        </div>
        {/* Dependency arrows: after the backdrop, before the rows, so they
       run above the off-day wash but under every bar. Its own component
       because it follows drags per snap step, and that subscription must
       re-render a few paths, never this whole view. */}
        {dependencyEdges.edges.length > 0 && (
          <GanttDependencyLayer
            edges={dependencyEdges.edges}
            totalRem={dependencyEdges.totalRem}
            trackRemWidth={trackRemWidth}
            rangeStartMs={rangeStartMs}
            rangeEndMs={rangeEndMs}
            laneHeightRem={laneHeightRem}
            laneGapRem={laneGapRem}
          />
        )}
        {rows.map((row, rowIndex) => (
          <GanttTimelineRow
            key={row.resource.id}
            row={row}
            rowIndex={rowIndex}
            bars={rowBars.get(row.resource.id)}
            rangeStartMs={rangeStartMs}
            rangeEndMs={rangeEndMs}
            trackWidth={trackWidth}
            trackRemWidth={trackRemWidth}
            rowBorder={gridLines.horizontal}
            selected={selectedSet.has(row.resource.id)}
            resolveHintStop={resolveHintStop}
            isPanning={isPanning}
            laneHeightRem={laneHeightRem}
            laneGapRem={laneGapRem}
            minRowRem={minRowRem}
            ghostHeightRem={ghostHeightRem}
            dependencySourceIds={dependencySourceIds}
          />
        ))}
        {rows.length === 0 && viewConfig.renderNoResources && (
          <div
            data-slot='gantt-no-resources'
            className='text-ui-muted-foreground flex grow items-center justify-center p-6 text-sm'
          >
            {viewConfig.renderNoResources()}
          </div>
        )}
        {showCreateTask && (
          <div
            aria-hidden
            data-slot='gantt-create-task-spacer'
            className='h-10 border-b'
            style={{ minWidth: trackWidth }}
          />
        )}
      </div>
    </div>
  );
  const horizontalScrollbar = (
    <ScrollBar
      orientation='horizontal'
      className='bg-ui-background border-t-border! end-0! z-40 h-4! rounded-none py-1'
    />
  );
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='gantt-view'
      data-scale={scale}
      aria-busy={loading || void 0}
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-hidden',
        viewConfig.classNames?.view,
        className
      )}
      {...props}
    >
      <div ref={bodyRef} className='relative flex min-h-0 flex-1'>
        {/* Tree pane */}
        <div
          ref={treePaneRef}
          data-slot='gantt-tree-pane'
          className='relative h-full shrink-0'
          style={{ width: liveTreeWidthRef.current ?? clampedTreeWidth }}
        >
          {customScrollbars ? (
            // keyed by scale: Base UI measures overflow once per mount, and a
            // scale switch changes content without resizing the viewport
            <ScrollArea
              key={scale}
              className='h-full [&>[data-orientation=vertical]]:hidden'
            >
              {treeContent}
              {horizontalScrollbar}
            </ScrollArea>
          ) : (
            <div
              data-slot='scroll-area-viewport'
              data-gantt-native-scroll=''
              className='h-full overflow-x-auto overflow-y-hidden overscroll-contain'
            >
              {treeContent}
            </div>
          )}
          {/* Reserved horizontal-scrollbar rail: the tree usually has no
       horizontal overflow, so its real scrollbar never mounts and its
       bottom edge would sit higher than the timeline's pinned strip.
       This static rail fills that gutter (same 1rem height + top border)
       so the bottom strip reads as one continuous band across both
       panes; a real tree scrollbar (with columns) draws over it. */}
          {customScrollbars && (
            <div
              aria-hidden
              data-slot='gantt-tree-scrollbar-rail'
              className='bg-ui-background border-t-border pointer-events-none absolute inset-x-0 bottom-0 h-4 border-t'
            />
          )}
          {/* Reorder insertion indicator, pinned to the visible pane */}
          {reorder && (
            <div
              data-slot='gantt-reorder-indicator'
              data-invalid={!reorder.valid || void 0}
              className='pointer-events-none absolute inset-x-0 flex items-center'
              style={{ top: reorder.top - 4, zIndex: 110 }}
            >
              {/* caret head pointing along the insertion line (a clipped
       square, not a border triangle); the whole indicator sits above the row carry overlay (z 100) */}
              <span
                className={cn(
                  'ms-0.5 size-2 shrink-0 [clip-path:polygon(0_0,100%_50%,0_100%)] rtl:[clip-path:polygon(100%_0,0_50%,100%_100%)]',
                  reorder.valid ? 'bg-ui-primary' : 'bg-ui-destructive'
                )}
              />
              <span
                className={cn(
                  'h-px min-w-0 flex-1',
                  reorder.valid ? 'bg-ui-primary' : 'bg-ui-destructive'
                )}
              />
            </div>
          )}
        </div>
        {/* Splitter */}
        {treeConfig.resizable ? (
          <div
            role='separator'
            aria-orientation='vertical'
            aria-label={settings.i18n.labels.resizePanel}
            aria-valuenow={Math.round(clampedTreeWidth)}
            aria-valuemin={Math.round(
              Math.min(treeConfig.minWidth, clampedTreeWidth)
            )}
            aria-valuemax={Math.round(
              Math.max(treeConfig.maxWidth, clampedTreeWidth)
            )}
            tabIndex={0}
            data-slot='gantt-splitter'
            className={cn(
              'group/gantt-splitter bg-ui-border hover:bg-ui-primary/60 data-resizing:bg-ui-primary relative z-30 w-px shrink-0 cursor-col-resize touch-none outline-none',
              'focus-visible:ring-ui-primary focus-visible:ring-2',
              'after:absolute after:inset-y-0 after:-start-1 after:-end-1'
            )}
            onPointerDown={beginSplit}
            onDoubleClick={() => {
              setTreeWidth(treeConfig.width);
              treeConfig.onWidthChange?.(treeConfig.width);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const dir =
                  getComputedStyle(e.currentTarget).direction === 'rtl'
                    ? -1
                    : 1;
                const delta = (e.key === 'ArrowLeft' ? -16 : 16) * dir;
                const next = clampTree(clampedTreeWidth + delta);
                setTreeWidth(next);
                treeConfig.onWidthChange?.(next);
              }
            }}
          >
            {/* grip pill: makes the hairline read as draggable on approach */}
            <span
              aria-hidden
              data-slot='gantt-splitter-grip'
              className='bg-ui-primary/60 group-data-resizing/gantt-splitter:bg-ui-primary absolute top-1/2 left-1/2 h-6 w-0.75 -translate-x-1/2 -translate-y-1/2 rounded-control opacity-0 transition-opacity duration-150 group-hover/gantt-splitter:opacity-100 group-focus-visible/gantt-splitter:opacity-100 group-data-resizing/gantt-splitter:opacity-100'
            />
          </div>
        ) : (
          <div aria-hidden className='bg-ui-border w-px shrink-0' />
        )}
        {/* Timeline pane */}
        <div
          ref={timelinePaneRef}
          data-slot='gantt-timeline-pane'
          className='relative h-full min-w-0 flex-1'
        >
          {viewConfig.zoomControl && (
            <div
              data-slot='gantt-zoom'
              className='bg-ui-background absolute end-[calc(0.75rem+var(--gantt-zoom-shift,0px))] bottom-5 z-40 flex flex-col rounded-md border shadow-sm transition-[inset-inline-end] duration-200'
            >
              {/* aria-disabled instead of disabled: the not-allowed cursor
       must still show at the zoom limits */}
              <TooltipProvider delayDuration={600} skipDelayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon-xs'
                      aria-label={settings.i18n.labels.zoomIn}
                      aria-disabled={!canZoomIn || void 0}
                      className='text-ui-muted-foreground hover:text-ui-foreground size-5! rounded-b-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-transparent'
                      onClick={() => {
                        if (!canZoomIn) return;
                        if (viewConfig.zoom === void 0) anchorZoomCenter();
                        setZoomValue(
                          +(zoom + (zoomRange.step ?? 0.25)).toFixed(2)
                        );
                      }}
                    >
                      <RegistryIcon
                        lucide='PlusIcon'
                        className='size-3'
                        aria-hidden='true'
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side='left'>
                    {settings.i18n.labels.zoomIn}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon-xs'
                      aria-label={settings.i18n.labels.zoomOut}
                      aria-disabled={!canZoomOut || void 0}
                      className='text-ui-muted-foreground hover:text-ui-foreground size-5! rounded-t-none border-t aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-transparent'
                      onClick={() => {
                        if (!canZoomOut) return;
                        if (viewConfig.zoom === void 0) anchorZoomCenter();
                        setZoomValue(
                          +(zoom - (zoomRange.step ?? 0.25)).toFixed(2)
                        );
                      }}
                    >
                      <RegistryIcon
                        lucide='MinusIcon'
                        className='size-3'
                        aria-hidden='true'
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side='left'>
                    {settings.i18n.labels.zoomOut}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {customScrollbars ? (
            // The vertical scrollbar is inset into the body lane: it starts
            // below the sticky 65px two-row header (otherwise its top slides
            // behind the header and the thumb is clipped) and stops above the
            // pinned 16px horizontal strip. `!` overrides the primitive's
            // inline top/bottom; h-auto lets top+bottom define the track
            // height so the thumb is measured against the visible lane.
            // The last selector is the radix twin of base's
            // ScrollAreaPrimitive.Content min-h-full: radix's Viewport wraps
            // children in its own display:table div, and without a height on
            // it the content's min-h-full collapses - the columns then stop at
            // the last row and leave the rest of the pane dead and unpannable.
            <ScrollArea
              key={scale}
              className='h-full [&>[data-orientation=vertical]]:top-[65px]! [&>[data-orientation=vertical]]:bottom-4! [&>[data-orientation=vertical]]:h-auto! [&>[data-slot=scroll-area-viewport]>div]:flex! [&>[data-slot=scroll-area-viewport]>div]:min-h-full [&>[data-slot=scroll-area-viewport]>div]:flex-col'
            >
              {timelineContent}
              {horizontalScrollbar}
            </ScrollArea>
          ) : (
            <div
              data-slot='scroll-area-viewport'
              data-gantt-native-scroll=''
              className='h-full overflow-auto overscroll-contain'
            >
              {timelineContent}
            </div>
          )}
          {/* Reserved scrollbar rail - the twin of the tree rail. Keeps the
       bottom gutter present even when the real horizontal scrollbar is
       hidden (e.g. hover-reveal scrollbars at rest), so the strip reads
       as one continuous reserved band across both panes; the real
       scrollbar (z-40) draws over it when active. */}
          {customScrollbars && (
            <div
              aria-hidden
              data-slot='gantt-timeline-scrollbar-rail'
              className='bg-ui-background border-t-border pointer-events-none absolute inset-x-0 bottom-0 h-4 border-t'
            />
          )}
          {viewConfig.offscreenIndicators && (
            <GanttOffscreenChips
              paneRef={timelinePaneRef}
              occurrences={occurrences}
              locale={settings.locale}
              refreshKey={`${scale}:${rangeKey}:${zoom}:${rows.length}:${clampedTreeWidth}:${viewConfig.scrollbars}`}
            />
          )}
        </div>
        {loading && (
          <div
            data-slot='gantt-loading'
            role='status'
            className='bg-ui-background/60 absolute inset-0 z-50 flex items-center justify-center gap-2'
          >
            <Loader size='sm' aria-hidden='true' />
            <span className='text-ui-muted-foreground text-sm'>
              {settings.i18n.labels.loading}
            </span>
          </div>
        )}
        {(viewConfig.renderDragPreview || viewConfig.renderResizeIndicator) && (
          <GanttCustomDragLayer />
        )}
      </div>
    </Comp>
  );
}
export { GanttView };
