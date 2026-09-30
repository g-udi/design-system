# Resizable

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
