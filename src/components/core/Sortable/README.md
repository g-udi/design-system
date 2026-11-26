# Sortable

Drag-and-drop reordering for lists, lanes, and grids, with keyboard and tap controls. Use it when the order of items matters to the reader, such as a checklist or a gallery cover.

```jsx
import { Sortable, SortableItem, SortableItemHandle, SortableItemPosition } from '@gaudi/design-system';

<Sortable value={tasks} onValueChange={setTasks} getItemValue={(task) => task.id}>
  {tasks.map((task) => (
    <SortableItem key={task.id} value={task.id}>
      <SortableItemHandle aria-label={`Reorder ${task.title}`}>⋮⋮</SortableItemHandle>
      {task.title}
      <SortableItemPosition aria-label={`Position of ${task.title}`} />
    </SortableItem>
  ))}
</Sortable>
```

- `strategy`: `vertical` (default), `horizontal`, or `grid`.
- `onValueCommit` fires once per completed move, which is where you persist the new order.
- `disabled` prevents an item from starting a drag or moving through its position picker. `SortableOverlay` customises the lifted copy shown while dragging.
- Handles are buttons: Space picks up an item, arrow keys move it, Space drops it, and Escape cancels.

Pair the drag handle with `SortableItemPosition` for pointer users who cannot drag. The native picker shows the current position and can move the item one place earlier or later. Give it a label that identifies the item. Both interactions follow the same `onMove`, `onValueChange` and `onValueCommit` rules. The event in the callback is the originating drag or select event.
