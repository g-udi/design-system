# KanbanBoard

A controlled board for editorial workflows. Supply columns, items, renderItem and onMove. Moves are explicit menu actions accessible by keyboard and touch; this version does not implement drag-and-drop.

## Usage

```jsx
<KanbanBoard
  columns={columns}
  items={items}
  onMove={(id, columnId) =>
    setItems(
      items.map((item) => (item.id === id ? { ...item, columnId } : item))
    )
  }
/>
```

## API

| Prop / export                    | Type                             | Contract                                           |
| -------------------------------- | -------------------------------- | -------------------------------------------------- |
| `columns`                        | {id, label}[]                    | Ordered workflow columns.                          |
| `items`                          | {id, title, columnId, ...data}[] | Host-owned records and placement.                  |
| `renderItem`                     | function(item)                   | Optional card body.                                |
| `onMove`                         | function(id, columnId)           | Receives a move request. Update items in the host. |
| `disabled`                       | boolean                          | Disable move actions while host work is pending.   |
| `label / moveLabel / emptyLabel` | string                           | Accessible and empty-state copy.                   |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
