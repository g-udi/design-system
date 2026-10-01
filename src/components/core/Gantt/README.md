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
- `columns` adds tree columns (owner, status, load) beside the row names, and `treePanel` sizes the resizable split; `renderEvent`, `renderEventMenu` and `renderResourceLabel` customise bars, their right-click menu and row labels.
- `canDropEvent` validates a drag or resize while it happens; add `enforceCanDrop` so a refused drop snaps back. `checkDependencies(update, events)` returns `{ ok, blockedBy, blocking }` for finish-to-start rules, and `getCriticalPath(events)` returns the task ids that drive the finish date.

```jsx
import { Gantt, GanttNav, GanttView, checkDependencies } from '@gaudi/design-system';

<Gantt
  defaultEvents={tasks}
  resources={phases}
  apiRef={apiRef}
  canDropEvent={(update) => checkDependencies(update, apiRef.current.getEvents()).ok}
  enforceCanDrop
>
  <GanttNav />
  <GanttView />
</Gantt>
```

Examples cover a project planner with live dependency validation and an edit dialog, a day dispatch on an hour grid with a skills guardrail, an agent playbook with retry lanes and a critical path, and a capacity-aware resource planner with booking cards and full create, edit, copy and delete.

## Accessibility

Navigation and row controls are labelled buttons, and bars scrolled out of view get labelled jump buttons at the edge of the timeline. Every visible string comes from `i18n`. When a drop is refused, say why in a `role='status'` line, as the examples do, and keep a non-drag path: bars are buttons, so a click opens a dialog or sheet with the same edits.
