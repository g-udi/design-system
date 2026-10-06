# Sortable

> Core/Sortable · core · `@gaudi/design-system/core/Sortable`

Reorder lists and grids with drag handles, keyboard controls and cancellation.

## Import

```js
import { Sortable } from '@gaudi/design-system/core/Sortable';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Sortable`, `SortableItem`, `SortableItemHandle`, `SortableOverlay`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value / onValueChange` | `Array / function` | `Required` | no | Controlled item order. |
| `getItemValue` | `(item) => string` | — | no | Stable unique identity for each item. |
| `strategy` | `vertical \| horizontal \| grid` | `vertical` | no | Layout-specific sorting strategy. |
| `onMove / onValueCommit` | `function` | — | no | Move notification and committed order. |
| `onDragStart / onDragEnd / onDragCancel` | `function` | — | no | Drag lifecycle callbacks. |
| `accessibility / modifiers` | `DndContext props` | — | no | Announcements, instructions and movement constraints. |
| `SortableItem.disabled` | `boolean` | `false` | no | Locks the item in place; its handle dims and shows a not-allowed cursor. |
| `SortableOverlay.children` | `ReactNode \| ({ value }) => ReactNode` | `Copy of the active item` | no | Custom content for the single drag overlay. Place it directly inside Sortable. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `strategy`: `vertical`, `horizontal`, `grid`

## Usage

```jsx
import { Sortable, SortableItem, SortableItemHandle } from '@gaudi/design-system/core/Sortable';

<Sortable value={ids} onValueChange={setIds}>
  {ids.map(id => <SortableItem key={id} value={id}>
    <SortableItemHandle aria-label={`Reorder ${labels[id]}`} />
    {labels[id]}
  </SortableItem>)}
</Sortable>
```

## Accessibility

Keep a keyboard-operable handle and announce moves. The application owns saving and restoring the last committed order.

## Examples

- Playground (Storybook `core-sortable--playground`)

Curated patterns:

- Media grid — registry item `@gaudi/sortable-media-grid` (uses `Badge`, `Frame`, `FrameDescription`, `FrameHeader`, `FramePanel`, `FrameTitle`, `RegistryIcon`, `Sortable`, `SortableItem`, `SortableItemHandle`, `cn`)
- Nested lists — registry item `@gaudi/sortable-nested` (uses `CardContent`, `CardRoot`, `RegistryIcon`, `Sortable`, `SortableItem`, `SortableItemHandle`, `ToastProvider`, `toast`)
- Persisted order — registry item `@gaudi/sortable-persisted` (uses `Badge`, `Label`, `RegistryIcon`, `Sortable`, `SortableItem`, `SortableItemHandle`, `SwitchRoot`, `ToastProvider`, `toast`, `useTimeout`)
- List with row controls — registry item `@gaudi/sortable-row-controls` (uses `Badge`, `Frame`, `FrameDescription`, `FrameHeader`, `FramePanel`, `FrameTitle`, `RegistryIcon`, `Sortable`, `SortableItem`, `SortableItemHandle`, `SwitchRoot`, `ToastProvider`, `toast`)

## README

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
