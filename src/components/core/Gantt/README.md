# Gantt

A timeline of tasks against a resource tree, with day to year scales, progress, dependencies, baselines, milestones, drag to move and resize, and row reordering. Use it to plan work over weeks or months; use an EventCalendar for hour-level schedules.

```jsx
import { Gantt, GanttNav, GanttView } from '@gaudi/design-system';

<Gantt defaultEvents={tasks} resources={teams} defaultScale='month' treePanel={{ width: 200 }} className='h-[580px]'>
  <GanttNav />
  <GanttView />
</Gantt>
```

- Tasks are `{ id, title, resourceId, start, end, progress?, dependencies?, baselineStart?, baselineEnd?, color? }`; a zero-length task renders as a milestone. `GANTT_COLORS` matches the EventCalendar colours.
- `resources` is a tree of `{ id, title, children? }`; `treePanel` configures the left panel, such as its `width`.
- `defaultScale` / `scale` zoom between `GANTT_SCALES`; `interactions` turns drag, resize and slot selection on or off; `apiRef` and `onEventsChange` connect edits to your data.
- Time-zone, lane and recurrence helpers are shared with EventCalendar, so both components read dates and RRULEs the same way.

## Accessibility

Navigation and row controls are labelled buttons, and bars scrolled out of view get labelled jump buttons at the edge of the timeline. Every visible string comes from `i18n`.
