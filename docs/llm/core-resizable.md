# Resizable

> Core/Resizable · core · `@gaudi/design-system/core/Resizable`

Resizable panes with accessible separators and bounded panel sizes.

## Import

```js
import { ResizableHandle } from '@gaudi/design-system/core/Resizable';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `ResizableHandle`, `ResizablePanel`, `ResizablePanelGroup`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ResizablePanelGroup.orientation` | `horizontal \| vertical` | `Required` | no | Direction in which panels are arranged. |
| `ResizablePanelGroup.onLayoutChanged` | `function` | — | no | Observe committed panel sizes. |
| `ResizablePanel.defaultSize / minSize / maxSize` | `number \| string` | — | no | Initial size and bounds accepted by react-resizable-panels. |
| `ResizablePanel.collapsible` | `boolean` | `false` | no | Allow a panel to collapse. |
| `ResizableHandle.withHandle` | `boolean` | `false` | no | Show a visible grip. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@gaudi/design-system/core/Resizable';

<ResizablePanelGroup orientation='horizontal'>
  <ResizablePanel defaultSize='30%'>{navigation}</ResizablePanel>
  <ResizableHandle aria-label='Resize navigation' />
  <ResizablePanel>{content}</ResizablePanel>
</ResizablePanelGroup>
```

## Accessibility

Separators support keyboard resizing. Keep minimum sizes large enough for panel content and retain a way to restore collapsed panes.

## Examples

- Playground (Storybook `core-resizable--playground`)
- Collapsible (Storybook `core-resizable--collapsible`)

Curated patterns:

- Editor workspace — registry item `@gaudi/resizable-editor-workspace` (uses `ResizableHandle`, `ResizablePanel`, `ResizablePanelGroup`)
- Handle styles — registry item `@gaudi/resizable-handles` (uses `ResizableHandle`, `ResizablePanel`, `ResizablePanelGroup`)

## Related

`core-direction`

## README

Panels separated by draggable handles, for layouts where readers choose how much space each area gets: an editor beside a preview, or a mail list beside a reading pane.

```jsx
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@gaudi/design-system';

<ResizablePanelGroup orientation='horizontal'>
  <ResizablePanel defaultSize='30%' minSize='20%'>Folders</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize='70%'>Messages</ResizablePanel>
</ResizablePanelGroup>
```

- `orientation` sets the split direction; nest a group to split the other way.
- String sizes are percentages. `collapsible` lets a panel close below its `minSize`.
- `withHandle` shows a grip on the handle. Handles are focusable separators: arrow keys resize, Home and End jump to the limits, Enter collapses a collapsible panel.
