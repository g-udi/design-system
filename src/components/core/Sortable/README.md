# Sortable

Drag-and-drop reordering for lists, lanes, and grids, with keyboard support. Use it when the order of items matters to the reader, such as a checklist or a gallery cover.

```jsx
import { Sortable, SortableItem, SortableItemHandle } from '@gaudi/design-system';

<Sortable value={tasks} onValueChange={setTasks} getItemValue={(task) => task.id}>
  {tasks.map((task) => (
    <SortableItem key={task.id} value={task.id}>
      <SortableItemHandle aria-label={`Reorder ${task.title}`}>⋮⋮</SortableItemHandle>
      {task.title}
    </SortableItem>
  ))}
</Sortable>
```

- `strategy`: `vertical` (default), `horizontal`, or `grid`.
- `onValueCommit` fires once per completed move, which is where you persist the new order.
- `disabled` on an item pins it in place. `SortableOverlay` customises the lifted copy shown while dragging.
- Handles are buttons: Space picks up an item, arrow keys move it, Space drops it, and Escape cancels.
