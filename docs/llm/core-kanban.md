# Kanban

> Core/Kanban · core · `@gaudi/design-system/core/KanbanBoard`

Move work items between columns while retaining an accessible move action.

## Import

```js
import Kanban from '@gaudi/design-system/core/KanbanBoard';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Kanban`, `KanbanBoardPrimitive`, `KanbanColumn`, `KanbanColumnContent`, `KanbanColumnCount`, `KanbanColumnHandle`, `KanbanColumnRail`, `KanbanItem`, `KanbanItemHandle`, `KanbanOverlay`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `columns` | `Array<{ id, label, limit? }>` | `[]` | no | Board columns with stable IDs; limit adds a work-in-progress count that warns when exceeded. |
| `items` | `Array<{ id, columnId }>` | `[]` | no | Host-owned work items. |
| `renderItem` | `(item) => ReactNode` | — | no | Item card content. |
| `onMove` | `(itemId, columnId) => void` | — | no | Request a move; the application updates items. |
| `label / moveLabel / emptyLabel` | `string` | `Board / Move / No items` | no | Accessible board and action labels. |
| `disabled` | `boolean` | `false` | no | Disable moving items. |

## Usage

```jsx
import KanbanBoard from '@gaudi/design-system/core/KanbanBoard';

<KanbanBoard columns={columns} items={tasks} onMove={moveTask} />
```

## Accessibility

Every item has a move control so dragging is optional. Keep columns inside the contained horizontal scrolling region (layout="scroll" on the composition board). Collapsed rails are buttons that name the column and its count; cards with their own controls use withHandle so the drag grip, not the card, is the sortable control.

## Examples

- Playground (Storybook `core-kanban--playground`)

Curated patterns:

- Pipeline and access review — registry item `@gaudi/kanban-access-review` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Kanban`, `KanbanBoardPrimitive`, `KanbanColumn`, `KanbanColumnContent`, `KanbanColumnCount`, `KanbanColumnHandle`, `KanbanItem`, `KanbanItemHandle`, `KanbanOverlay`, `Loom`, `Openai`, `Rating`, `RegistryIcon`, `Slack`, `Stripe`, `Supabase`, `ToggleGroupItem`, `ToggleGroupRoot`, `Zoom`, `cn`)
- Workflow with collapsible columns — registry item `@gaudi/kanban-collapsible-columns` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `DropdownMenuCheckboxItemPrimitive`, `DropdownMenuContent`, `DropdownMenuLabelPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `Kanban`, `KanbanBoardPrimitive`, `KanbanColumn`, `KanbanColumnContent`, `KanbanColumnCount`, `KanbanColumnRail`, `KanbanItem`, `KanbanItemHandle`, `KanbanOverlay`, `ProgressRing`, `RegistryIcon`, `ToggleGroupItem`, `ToggleGroupRoot`, `cn`)
- Issue tracking — registry item `@gaudi/kanban-issue-tracking` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `DropdownMenuCheckboxItemPrimitive`, `DropdownMenuContent`, `DropdownMenuLabelPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `Kanban`, `KanbanBoardPrimitive`, `KanbanColumn`, `KanbanColumnContent`, `KanbanColumnCount`, `KanbanColumnHandle`, `KanbanItem`, `KanbanItemHandle`, `KanbanOverlay`, `ProgressRing`, `RegistryIcon`, `cn`, `useCopyToClipboard`)
- Board options — registry item `@gaudi/kanban-options` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Frame`, `FrameDescription`, `FrameHeader`, `FramePanel`, `FrameTitle`, `Kanban`, `KanbanBoardPrimitive`, `KanbanColumn`, `KanbanColumnContent`, `KanbanColumnHandle`, `KanbanItem`, `KanbanItemHandle`, `KanbanOverlay`, `Label`, `ProgressRoot`, `RegistryIcon`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`, `cn`)
- Persisted to a backend — registry item `@gaudi/kanban-persisted` (uses `Badge`, `Button`, `CardContent`, `CardHeader`, `CardRoot`, `Kanban`, `KanbanBoardPrimitive`, `KanbanColumn`, `KanbanColumnContent`, `KanbanColumnHandle`, `KanbanItem`, `KanbanItemHandle`, `KanbanOverlay`, `Label`, `RegistryIcon`, `SwitchRoot`, `ToastProvider`, `toast`)
- Recruiting pipeline — registry item `@gaudi/kanban-recruiting` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Kanban`, `KanbanBoardPrimitive`, `KanbanColumn`, `KanbanColumnContent`, `KanbanColumnCount`, `KanbanItem`, `KanbanItemHandle`, `KanbanOverlay`, `Label`, `ProgressRoot`, `RegistryIcon`, `SwitchRoot`, `cn`)
- Release readiness — registry item `@gaudi/kanban-release-readiness` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `CheckboxRoot`, `DropdownMenuCheckboxItemPrimitive`, `DropdownMenuContent`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `Kanban`, `KanbanBoardPrimitive`, `KanbanColumn`, `KanbanColumnContent`, `KanbanColumnCount`, `KanbanItem`, `KanbanItemHandle`, `KanbanOverlay`, `Label`, `PopoverContentPrimitive`, `PopoverHeader`, `PopoverPrimitive`, `PopoverTitle`, `PopoverTriggerPrimitive`, `ProgressRoot`, `RegistryIcon`, `cn`)
- Renewals risk — registry item `@gaudi/kanban-renewals-risk` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Discord`, `Dropbox`, `Kanban`, `KanbanBoardPrimitive`, `KanbanColumn`, `KanbanColumnContent`, `KanbanColumnCount`, `KanbanItem`, `KanbanItemHandle`, `KanbanOverlay`, `Openai`, `ProgressRoot`, `Redis`, `RegistryIcon`, `Slack`, `Stripe`, `Supabase`, `Zoom`, `cn`)
- Feature roadmap — registry item `@gaudi/kanban-roadmap` (uses `Badge`, `Button`, `Kanban`, `KanbanBoardPrimitive`, `KanbanColumn`, `KanbanColumnContent`, `KanbanColumnCount`, `KanbanItem`, `KanbanItemHandle`, `KanbanOverlay`, `Label`, `ProgressRoot`, `RegistryIcon`, `SwitchRoot`, `cn`)
- Support escalations — registry item `@gaudi/kanban-support-escalations` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Kanban`, `KanbanBoardPrimitive`, `KanbanColumn`, `KanbanColumnContent`, `KanbanColumnCount`, `KanbanColumnHandle`, `KanbanItem`, `KanbanItemHandle`, `KanbanOverlay`, `RegistryIcon`, `cn`)

## Related

`core-item`

## README

A controlled board for editorial workflows. Supply columns, items, renderItem and onMove. Moves are explicit menu actions accessible by keyboard and touch; this version does not implement drag-and-drop.

### Usage

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

### API

| Prop / export                    | Type                             | Contract                                           |
| -------------------------------- | -------------------------------- | -------------------------------------------------- |
| `columns`                        | {id, label, limit?}[]            | Ordered workflow columns; `limit` shows a WIP count. |
| `items`                          | {id, title, columnId, ...data}[] | Host-owned records and placement.                  |
| `renderItem`                     | function(item)                   | Optional card body.                                |
| `onMove`                         | function(id, columnId)           | Receives a move request. Update items in the host. |
| `disabled`                       | boolean                          | Disable move actions while host work is pending.   |
| `label / moveLabel / emptyLabel` | string                           | Accessible and empty-state copy.                   |

### Drag-and-drop composition

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

### Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
