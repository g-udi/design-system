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
| `columns`                        | {id, label, limit?}[]            | Ordered workflow columns; `limit` shows a WIP count. |
| `items`                          | {id, title, columnId, ...data}[] | Host-owned records and placement.                  |
| `renderItem`                     | function(item)                   | Optional card body.                                |
| `onMove`                         | function(id, columnId)           | Receives a move request. Update items in the host. |
| `disabled`                       | boolean                          | Disable move actions while host work is pending.   |
| `label / moveLabel / emptyLabel` | string                           | Accessible and empty-state copy.                   |

## Drag-and-drop composition

`Kanban`, `KanbanBoardPrimitive`, `KanbanColumn`, `KanbanColumnContent`, `KanbanItem`, the two handles and `KanbanOverlay`
compose a drag-and-drop board with keyboard sorting. For richer boards:

| Part / prop                                   | Contract                                                                                       |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `KanbanBoardPrimitive layout='scroll'`        | Fixed-width columns in their own focusable, horizontally scrolling region. Name it with `aria-label`. |
| `KanbanColumn collapsed` + `KanbanColumnRail` | A collapsed column drawn as a vertical rail button that expands it; cards dropped on it still land in the column. |
| `KanbanColumnCount count limit`               | The column count, or `count/limit`; over the limit it turns to the warning tone and says so.  |
| `KanbanItem withHandle`                       | Moves the sortable role and focus to `KanbanItemHandle`, so a card can hold its own buttons.  |

```jsx
<Kanban value={columns} onValueChange={setColumns} getItemValue={(item) => item.id}>
  <KanbanBoardPrimitive layout='scroll' aria-label='Release board'>
    {Object.entries(columns).map(([id, items]) => (
      <KanbanColumn key={id} value={id} collapsed={hidden.includes(id)}>
        {hidden.includes(id) ? (
          <KanbanColumnRail label={titles[id]} count={items.length} onExpand={() => show(id)} />
        ) : (
          <>
            <h3>{titles[id]}</h3>
            <KanbanColumnCount count={items.length} limit={limits[id]} />
            <KanbanColumnContent value={id}>{items.map(renderCard)}</KanbanColumnContent>
          </>
        )}
      </KanbanColumn>
    ))}
  </KanbanBoardPrimitive>
</Kanban>
```

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
