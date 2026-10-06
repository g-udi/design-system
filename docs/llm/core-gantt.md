# Gantt

> Core/Gantt · core · `@gaudi/design-system/core/Gantt`

A timeline board for scheduled work, dependencies and resource planning.

## Import

```js
import { Gantt } from '@gaudi/design-system/core/Gantt';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `DEFAULT_GANTT_I18N`, `DEFAULT_ROW_ALIGN`, `DEFAULT_SCHEDULE_MODE`, `DEFAULT_VIEW_CONFIG`, `GANTT_ACTIVATION`, `GANTT_COLORS`, `GANTT_SCALES`, `Gantt`, `GanttBar`, `GanttContext`, `GanttDatePicker`, `GanttNav`, `GanttNavNext`, `GanttNavPrev`, `GanttNavToday`, `GanttRecurrenceError`, `GanttScaleSwitcher`, `GanttTitle`, `GanttToolbar`, `GanttView`, `GanttViewConfigContext`, `MAX_OCCURRENCES`, `MIN_PACK_SLOT`, `buildDependencyPath`, `buildEventIndex`, `cancelActiveGanttGestures`, `checkDependencies`, `defaultEventOrder`, `eventsOverlap`, `expandRecurrence`, `findResource`, `flattenResources`, `formatRRuleString`, `getBaselineVariance`, `getCriticalPath`, `getDayKey`, `getDayTotalMinutes`, `getGanttDateRange`, `getLaneKey`, `getRangeKey`, `markGestureEnd`, `mergeGanttI18n`, `occurrenceIntersects`, `packTimedSegments`, `parseRRuleString`, `rangesIntersect`, `reorderResources`, `resolveEventBaseline`, `resolveOffDay`, `resolveScheduleMode`, `resolveTimelineLines`, `snapMinutes`, `spansMultipleDays`, `stepGanttDate`, `toZoned`, `useGantt`, `useGanttBarContext`, `useGanttGestureTeardown`, `useGanttGestures`, `useGanttInteractions`, `useGanttNavigation`, `useGanttNodeSchedules`, `useGanttOccurrences`, `useGanttScale`, `useGanttSelection`, `useGanttSelector`, `useGanttSettings`, `useGanttSettingsVersion`, `useGanttState`, `useGanttViewConfig`, `wasRecentDrag`, `zonedStartOfDay`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `calendar` | `Gantt state instance` | `Internal state` | no | Optionally adopt an instance created with useGanttState. |
| `events / defaultEvents / onEventsChange` | `Event[] / function` | `[] (uncontrolled)` | no | Scheduled work and host-owned updates. |
| `resources` | `Resource[]` | `[]` | no | Resource hierarchy used for board rows. |
| `scale / defaultScale / onScaleChange` | `GanttScale / function` | `day (uncontrolled)` | no | Controlled or initial timeline scale. |
| `date / defaultDate / onDateChange` | `Date / function` | `Current date (uncontrolled)` | no | Navigation date and changes. |
| `slotDuration / snapDuration` | `number` | `30 / 15` | no | Scheduling and drag increments in minutes. |
| `apiRef` | `MutableRefObject` | — | no | Imperative navigation and update API. |
| `GanttView.interval` | `number` | `60` | no | Time-grid interval in minutes, clamped from 15 to 240. |
| `GanttBar.segment` | `Gantt segment` | `Required` | no | Scheduled segment rendered by the bar. |
| `GanttScaleSwitcher.scales` | `Scale[]` | `GANTT_SCALES` | no | Available timeline scales. |
| `columns / treePanel` | `{id, title, width, render}[] / {width, nameColumnWidth, minWidth, maxWidth, resizable}` | `[] / 200px, resizable` | no | Extra tree columns beside the row names, and the resizable split between tree and timeline. |
| `canDropEvent / enforceCanDrop` | `fn(update) => boolean / boolean` | `— / false` | no | Validates a move or resize live; with enforceCanDrop a refused drop snaps back. |
| `renderEvent / renderEventMenu / renderResourceLabel` | `fn(props) => ReactNode` | `Built-in bar` | no | Custom bar content such as booking cards, a right-click menu of ContextMenu items, and row labels. |
| `checkDependencies(update, events)` | `{ok, blockedBy, blocking}` | — | no | Finish-to-start check for a proposed move; pair it with canDropEvent. |
| `getCriticalPath(events)` | `string[]` | — | no | Task ids on the chain that drives the finish date. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { useState } from 'react';
import { Gantt } from '@gaudi/design-system/core/Gantt';

const resources = [{ id: 'design', title: 'Design' }];
const initialTasks = [{ id: 'review', title: 'Design review', resourceId: 'design', start: new Date(2026, 9, 4), end: new Date(2026, 9, 6), allDay: true }];

export default function ProjectSchedule() {
  const [tasks, setTasks] = useState(initialTasks);
  return <Gantt events={tasks} onEventsChange={setTasks} resources={resources} defaultDate={new Date(2026, 9, 4)} defaultScale='week' />;
}
```

## Accessibility

Keep the timeline in its own scroll region. Provide labelled date navigation and preserve non-drag ways to inspect scheduled work.

## Notes

- When calendar is supplied, set state options on that instance. The Gantt root still accepts presentation settings, including dependency lines, baseline bars and row selection.

## Examples

- Playground (Storybook `core-gantt--playground`)

Curated patterns:

- Agent playbook — registry item `@gaudi/gantt-agent-playbook` (uses `Badge`, `CardContent`, `CardRoot`, `Gantt`, `GanttNav`, `GanttToolbar`, `GanttView`, `Label`, `RegistryIcon`, `SwitchRoot`, `checkDependencies`, `getCriticalPath`)
- Baseline, dependencies and milestones — registry item `@gaudi/gantt-baselines-dependencies` (uses `CardContent`, `CardRoot`, `Gantt`, `GanttNav`, `GanttView`)
- Day dispatch — registry item `@gaudi/gantt-day-dispatch` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `CardContent`, `CardRoot`, `CheckboxRoot`, `FieldErrorPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `Gantt`, `GanttNav`, `GanttToolbar`, `GanttView`, `ProgressRoot`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Sheet`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetTitle`)
- Project planner with live validation — registry item `@gaudi/gantt-live-validation` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `CardContent`, `CardRoot`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `FieldGroup`, `FieldInput`, `FieldLabelPrimitive`, `FieldRoot`, `Gantt`, `GanttNav`, `GanttToolbar`, `GanttView`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Slider`, `checkDependencies`)
- Quarter roadmap with rollups — registry item `@gaudi/gantt-quarter-roadmap` (uses `Button`, `CardContent`, `CardRoot`, `Gantt`, `GanttNav`, `GanttToolbar`, `GanttView`, `RegistryIcon`)
- Capacity-aware resource planner — registry item `@gaudi/gantt-resource-planner` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `CardContent`, `CardRoot`, `ContextMenuItem`, `ContextMenuSeparator`, `DialogConfirmationAction`, `DialogConfirmationCancel`, `DialogConfirmationContent`, `DialogConfirmationDescription`, `DialogConfirmationFooter`, `DialogConfirmationHeader`, `DialogConfirmationRoot`, `DialogConfirmationTitle`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `FieldErrorPrimitive`, `FieldGroup`, `FieldInput`, `FieldLabelPrimitive`, `FieldRoot`, `Gantt`, `GanttNav`, `GanttToolbar`, `GanttView`, `ProgressRoot`, `RegistryIcon`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Settings menu, row reordering and scheduling — registry item `@gaudi/gantt-settings-reordering` (uses `Button`, `CardContent`, `CardRoot`, `Gantt`, `GanttNav`, `GanttToolbar`, `GanttView`, `Label`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `RadioGroupItem`, `RadioGroupRoot`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `SwitchRoot`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`)
- Task table with progress — registry item `@gaudi/gantt-task-table` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `CardContent`, `CardRoot`, `Gantt`, `GanttNav`, `GanttToolbar`, `GanttView`, `RegistryIcon`)

## Related

`blocks-navigation`, `blocks-scheduling`

## README

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

### Accessibility

Navigation and row controls are labelled buttons, and bars scrolled out of view get labelled jump buttons at the edge of the timeline. Every visible string comes from `i18n`. When a drop is refused, say why in a `role='status'` line, as the examples do, and keep a non-drag path: bars are buttons, so a click opens a dialog or sheet with the same edits.

### Implementation ownership

`GanttView` composes private row and overlay components. Owner-local hooks manage the time scale, packed row layout, synchronized viewports and row reordering; models and recurrence remain separate from rendering.
