'use client';
import { memo } from 'react';
import { useGanttSelector, useGanttViewConfig } from '../Gantt.jsx';
import { buildDependencyPath } from '../ganttModel.jsx';
import { cn } from '../../../../utilities/cn/index.js';
const GanttDependencyLayer = memo(function GanttDependencyLayer2({
  edges,
  totalRem,
  trackRemWidth,
  rangeStartMs,
  rangeEndMs,
  laneHeightRem,
  laneGapRem
}) {
  const viewConfig = useGanttViewConfig();
  const dragLink = useGanttSelector(
    (state) =>
      state.drag
        ? {
            eventId: state.drag.occurrence.eventId,
            startMs: state.drag.proposedStart.getTime(),
            endMs: state.drag.proposedEnd.getTime()
          }
        : null,
    {
      isEqual: (a, b) =>
        a === b ||
        (a !== null &&
          b !== null &&
          a.eventId === b.eventId &&
          a.startMs === b.startMs &&
          a.endMs === b.endMs)
    }
  );
  const totalMin = (rangeEndMs - rangeStartMs) / 6e4;
  const liveX = (ms) =>
    (Math.min(Math.max((ms - rangeStartMs) / 6e4, 0), totalMin) / totalMin) *
    trackRemWidth;
  return (
    <svg
      aria-hidden
      data-slot='gantt-dependencies'
      className={cn(
        'text-ui-muted-foreground pointer-events-none absolute start-0 top-0 w-full overflow-visible rtl:-scale-x-100',
        viewConfig.classNames?.dependencies
      )}
      style={{ height: `${totalRem}rem` }}
      viewBox={`0 0 ${trackRemWidth} ${totalRem}`}
      preserveAspectRatio='none'
    >
      {edges.map((edge) => {
        const dragged =
          dragLink !== null &&
          (edge.fromId === dragLink.eventId || edge.toId === dragLink.eventId);
        const fromX =
          dragged && edge.fromId === dragLink.eventId
            ? liveX(dragLink.endMs)
            : edge.fromX;
        const toX =
          dragged && edge.toId === dragLink.eventId
            ? liveX(dragLink.startMs)
            : edge.toX;
        const geometry = buildDependencyPath(
          { x: fromX, y: edge.fromY },
          { x: toX, y: edge.toY },
          {
            clearance: 0.625,
            // the loop route hops just past the lane edge
            laneStep: laneHeightRem / 2 + laneGapRem,
            arrowSize: 0.375
          }
        );
        return (
          <g
            key={edge.key}
            data-slot='gantt-dependency'
            data-dragging={dragged || void 0}
            className={dragged ? 'opacity-50' : void 0}
          >
            <path
              d={geometry.line}
              fill='none'
              stroke='currentColor'
              strokeWidth={1.5}
              vectorEffect='non-scaling-stroke'
            />
            <path d={geometry.arrow} fill='currentColor' />
          </g>
        );
      })}
    </svg>
  );
});
export { GanttDependencyLayer };
