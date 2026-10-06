'use client';
import { useNow } from '../../../../hooks/shared/use-now.js';
import { useGanttSelector, useGanttViewConfig } from '../Gantt.jsx';
import { resolveEventBaseline } from '../ganttModel.jsx';
function GanttNowLine({ rangeStartMs, rangeEndMs }) {
  const now = useNow();
  const ms = now.getTime();
  if (ms < rangeStartMs || ms >= rangeEndMs) return null;
  const fraction = (ms - rangeStartMs) / (rangeEndMs - rangeStartMs);
  return (
    <div
      data-slot='gantt-now-indicator'
      className='from-ui-destructive/80 via-ui-destructive/45 to-ui-destructive/15 absolute inset-y-0 z-10 w-px bg-linear-to-b'
      style={{ insetInlineStart: `${fraction * 100}%` }}
    />
  );
}
function GanttNowDot({ rangeStartMs, rangeEndMs }) {
  const now = useNow();
  const ms = now.getTime();
  if (ms < rangeStartMs || ms >= rangeEndMs) return null;
  const fraction = (ms - rangeStartMs) / (rangeEndMs - rangeStartMs);
  return (
    <span
      aria-hidden
      data-slot='gantt-now-dot'
      className='bg-ui-destructive absolute -bottom-0.75 z-10 size-1.5 -translate-x-1/2 rounded-full rtl:translate-x-1/2'
      style={{ insetInlineStart: `${fraction * 100}%` }}
    />
  );
}
function GanttCustomDragLayer() {
  const viewConfig = useGanttViewConfig();
  const drag = useGanttSelector((state) => state.drag);
  if (!drag) return null;
  const render =
    drag.kind === 'move'
      ? viewConfig.renderDragPreview
      : viewConfig.renderResizeIndicator;
  if (!render) return null;
  return (
    <div
      data-slot={
        drag.kind === 'move' ? 'gantt-drag-overlay' : 'gantt-resize-indicator'
      }
      data-custom=''
      className='pointer-events-none fixed top-0 left-0 z-100 will-change-transform'
      style={{ visibility: 'hidden' }}
    >
      {render({
        occurrence: drag.occurrence,
        kind: drag.kind,
        start: drag.proposedStart,
        end: drag.proposedEnd,
        valid: drag.valid,
        // the plan rides along so a custom overlay can keep drawing it
        // mid-gesture (the resting ghost is hidden with the original bar)
        baseline: resolveEventBaseline(drag.occurrence.event)
      })}
    </div>
  );
}
export { GanttNowLine, GanttNowDot, GanttCustomDragLayer };
