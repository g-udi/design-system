# Flow

> Core/Flow · core · `@gaudi/design-system/core/Flow`

A node-and-edge canvas for workflows, pipelines, agent trees and driver maps, themed with Gaudi tokens and built on React Flow.

## Import

```js
import { Flow } from '@gaudi/design-system/core/Flow';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `DEFAULT_FLOW_INSPECTOR_LABELS`, `DEFAULT_FLOW_LABELS`, `FLOW_EDGE_VARIANTS`, `FLOW_STATUSES`, `Flow`, `FlowControls`, `FlowEdge`, `FlowInspector`, `FlowMiniMap`, `FlowNode`, `FlowPanel`, `FlowPillNode`, `FlowProvider`, `FlowStatus`, `FlowTaskNode`, `FlowTileNode`, `MarkerType`, `Position`, `addEdge`, `applyEdgeChanges`, `applyNodeChanges`, `createsCycle`, `descendants`, `describeFlow`, `flowEdgeTypes`, `flowNodeTypes`, `hasEdge`, `layoutFlow`, `topologicalOrder`, `unreachableNodes`, `useFlowHistory`, `useReactFlow`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `Required` | no | Accessible name of the canvas region. |
| `nodes` | `Node[]` | — | no | Controlled graph. Pair with onNodesChange and onEdgesChange, or use useFlowHistory for undo and redo. |
| `edges` | `Edge[]` | — | no | Controlled graph. Pair with onNodesChange and onEdgesChange, or use useFlowHistory for undo and redo. |
| `defaultNodes` | `Node[]` | — | no | Uncontrolled graph for read-only or self-managed canvases. |
| `defaultEdges` | `Edge[]` | — | no | Uncontrolled graph for read-only or self-managed canvases. |
| `node.type` | `step \| pill \| tile \| task` | `step` | no | Card, compact pill, service tile with a run badge (round with data.shape circle, for satellites), or a one-line task card with an inline data.action. |
| `node.data.status` | `idle \| queued \| running \| success \| failed \| waiting \| blocked \| skipped` | — | no | Run state shown as a Badge, a tinted ring and the minimap colour; statusLabel overrides the text. |
| `node.data.outputs` | `{ id, label? }[]` | — | no | Named source handles for branches, and dashed attachment ports on any side. |
| `ports` | `{ id, label, position, type }[]` | — | no | Named source handles for branches, and dashed attachment ports on any side. |
| `edge.data` | `{ label, tone, status, variant, animated, path, emphasis, onInsert }` | — | no | Connector label, colour or run status, solid \| dashed \| dotted line, a flow toward the target, path shape and an insert button. |
| `background` | `dots \| lines \| cross \| none` | `dots` | no | Canvas pattern. |
| `controls / minimap` | `boolean` | `true / false` | no | Built-in zoom controls and the overview map. Render FlowControls yourself for the toolbar variant, Auto layout (onAutoLayout), Fit selection, select / pan tools and the issues count. |
| `summary` | `boolean` | `true` | no | Visually hidden count and step list that describe the graph without the canvas. |
| `labels` | `object` | `DEFAULT_FLOW_LABELS` | no | Every visible and announced string, including the toolbar, tool and issue labels. |
| `tool` | `select \| hand` | — | no | Select drags a selection box and pans with scroll; hand pans by dragging. |
| `onNodeActivate` | `(node, event) => void` | — | no | Called when a node is clicked or Enter is pressed on a focused node; use it to open a FlowInspector. |
| `FlowInspector` | `open, onOpenChange, nodeId, title, icon, status, tabs, callout, dirty, onSave, onCancel` | — | no | Side panel for the selected node: floats over the canvas and becomes a Sheet under 768px, with focus moving in and back to the node. |
| `layoutFlow(nodes, edges, options)` | `function` | `direction TB` | no | Layered layout (TB or LR) for tidy trees and driver maps, without another dependency. |
| `useFlowHistory({ nodes, edges, limit })` | `hook` | `limit 50` | no | Undo and redo that treat one drag as one step; commit() records edits made outside React Flow. |
| `topologicalOrder / createsCycle / hasEdge / unreachableNodes / descendants` | `function` | — | no | Dependency order with a cycle fallback, relink validation and reachability checks. |
| `Other props` | `ReactFlowProps` | — | no | Passed to React Flow, such as onConnect, onBeforeDelete, snapToGrid and onNodeContextMenu. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `node.type`: `step`, `pill`, `tile`, `task`
- `node.data.status`: `idle`, `queued`, `running`, `success`, `failed`, `waiting`, `blocked`, `skipped`
- `background`: `dots`, `lines`, `cross`, `none`
- `tool`: `select`, `hand`

## Usage

```jsx
import '@gaudi/design-system/flow.css';
import { Flow, layoutFlow } from '@gaudi/design-system/core/Flow';

const edges = [{ id: 'start-review', source: 'start', target: 'review' }];
const nodes = layoutFlow([
  { id: 'start', type: 'pill', data: { title: 'Draft ready', icon: 'FileText', target: false } },
  { id: 'review', type: 'step', data: { title: 'Editor review', status: 'running', meta: ['Due today'] } }
], edges);

<Flow label='Publishing pipeline' nodes={nodes} edges={edges} className='h-[32rem]' />
```

## Accessibility

The canvas is a labelled region described by a step count, followed by a visually hidden list of every step and where it leads. Nodes and edges are focusable: Enter or Space selects, arrow keys move a selected node and Delete removes it, with React Flow announcing moves. Controls, menus and insert buttons are labelled; handles are pointer targets described by their node. Dragging is never the only way to edit: offer menus, toolbars or an inspector for the same actions.

## Notes

- Requires the @xyflow/react peer dependency; its structural CSS is imported inside the Gaudi stylesheet.
- React Flow does not provide a keyboard way to draw a new connection between handles; offer an inspector field or menu action for linking.
- Give the canvas an explicit height with className; it scrolls and zooms inside its own region.

## Examples

- Playground (Storybook `core-flow--playground`)

Curated patterns:

- Agent tree with test run — registry item `@gaudi/flow-agent-tree` (uses `Button`, `ButtonGroup`, `ClaudeAiIcon`, `Field`, `FieldError`, `FieldInput`, `FieldLabel`, `Flow`, `FlowPanel`, `FlowProvider`, `FlowStatus`, `Redis`, `RegistryIcon`, `Slack`, `Stripe`, `Supabase`, `ToastProvider`, `Toggle`, `layoutFlow`, `toast`, `useCopyToClipboard`, `useFlowHistory`, `useReactFlow`)
- Automation workflow editor — registry item `@gaudi/flow-automation-editor` (uses `Alert`, `AlertAction`, `AlertDescription`, `AlertTitle`, `BreadcrumbItemPrimitive`, `BreadcrumbLinkPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbPagePrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `Button`, `ButtonGroup`, `ContextMenu`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuTrigger`, `DialogConfirmationAction`, `DialogConfirmationCancel`, `DialogConfirmationContent`, `DialogConfirmationDescription`, `DialogConfirmationFooter`, `DialogConfirmationHeader`, `DialogConfirmationRoot`, `DialogConfirmationTitle`, `Field`, `FieldInput`, `FieldLabel`, `Flow`, `FlowPanel`, `FlowProvider`, `FlowStatus`, `KbdGroup`, `KbdRoot`, `RegistryIcon`, `Sheet`, `SheetContent`, `SheetDescription`, `SheetHeader`, `SheetTitle`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`, `addEdge`, `unreachableNodes`, `useElementSize`, `useFlowHistory`, `useMergedRefs`, `useReactFlow`)
- Growth impact map — registry item `@gaudi/flow-impact-map` (uses `Badge`, `Button`, `Field`, `FieldDescription`, `FieldError`, `FieldInput`, `FieldLabel`, `Flow`, `FlowPanel`, `FlowProvider`, `FlowStatus`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `RegistryIcon`, `ToastProvider`, `ToggleGroupItem`, `ToggleGroupRoot`, `createsCycle`, `hasEdge`, `layoutFlow`, `toast`, `useFlowHistory`)
- Payments pipeline with an inspector — registry item `@gaudi/flow-payments-inspector` (uses `Button`, `Field`, `FieldInput`, `FieldLabel`, `Flow`, `FlowControls`, `FlowInspector`, `FlowProvider`, `Redis`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `Stripe`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`, `applyEdgeChanges`, `applyNodeChanges`, `layoutFlow`, `useReactFlow`)
- Pipeline run monitor — registry item `@gaudi/flow-pipeline-monitor` (uses `Button`, `Flow`, `FlowProvider`, `FlowStatus`, `Progress`, `RegistryIcon`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `ToastProvider`, `toast`, `topologicalOrder`, `useFlowHistory`, `useReactFlow`)

## Related

`core-card`, `core-select`, `core-sheet`

## README

A node-and-edge canvas for automation workflows, pipeline runs, agent trees and driver maps. It is built on React Flow and themed with Gaudi tokens, so cards, handles, edges, the minimap and the controls follow the theme, the radius and the space scale. Use Gantt for work over time and Timeline for a linear history.

Flow is opt-in so apps that don't use it skip the canvas library: install the optional peer `pnpm add @xyflow/react`, import the stylesheet once, and import Flow from its subpath (it is not part of the root entry).

```jsx
import '@gaudi/design-system/flow.css';
import { Flow, layoutFlow } from '@gaudi/design-system/core/Flow';

const edges = [{ id: 'draft-review', source: 'draft', target: 'review' }];
const nodes = layoutFlow([
  { id: 'draft', type: 'pill', data: { title: 'Draft ready', icon: 'FileText', target: false } },
  { id: 'review', type: 'step', data: { title: 'Editor review', status: 'running', meta: ['Due today'] } }
], edges);

<Flow label='Publishing pipeline' nodes={nodes} edges={edges} className='h-[32rem]' />
```

- `tile` nodes render `FlowTileNode`: a service or brand `icon` on a tile with a run badge under it, the `title` and a `meta` line (`metaTone: 'danger'` for an error). `shape: 'circle'` makes a satellite such as a connection, test or model. `task` nodes render `FlowTaskNode`: a one-line card with an inline `action` (for example Approve) and a warning ring while `waiting`.
- `step` nodes render `FlowNode`: `data` takes `title`, `description`, `icon` (registry name or element), `tone`, `status` / `statusLabel`, `badge`, `meta` (facts such as duration or cost), `owner`, `progress`, `content`, `footer`, `actions` (a menu), `toolbar` (shown while selected), `outputs` (named branch handles) and `ports` (dashed attachment handles). `pill` nodes are compact triggers, ends and attachments.
- `FLOW_STATUSES` maps `idle`, `queued`, `running`, `success`, `failed`, `waiting`, `blocked` and `skipped` to a Badge, an icon, a tinted ring and the minimap colour. `FlowStatus` renders the same badge outside the canvas.
- Edges default to `FlowEdge`: `data.label`, `tone`, `status` (`running` flows in the accent, `failed` turns danger, `waiting` warning, `success` success), `variant` (`solid`, `dashed` or `dotted`), `animated` (the dots or dashes travel toward the target; a solid line carries moving dots over it), `path` (`smoothstep`, `bezier`, `step`, `straight`), `emphasis` and `onInsert`, which adds a plus button on the connector when hovered or focused. Motion stops under reduced motion and the pattern stays. Satellite links read best as `variant: 'dotted'` without `animated` or an arrow.
- `layoutFlow(nodes, edges, { direction: 'TB' | 'LR' })` is a small layered layout for tidy trees and driver maps. Nodes marked `attachment: true` sit beside the step they link to instead of taking a rank. `topologicalOrder`, `createsCycle`, `hasEdge`, `descendants` and `unreachableNodes` cover replay order, relink validation and reachability. `useFlowHistory` gives undo and redo that treat one drag as one step.
- `FlowPanel`, `FlowControls` and `FlowMiniMap` place toolbars, zoom controls and the overview map on the canvas. `FlowControls variant='toolbar'` lays the controls in one row with a select / pan switch (`tool`, `onToolChange`, paired with `Flow tool`), the zoom level and an issues button (`issues`, `onIssues`); `onAutoLayout` adds an Auto layout button (nodes glide into place) and `showFitSelection` a Fit selection button. Every control has a label and a tooltip.
- `FlowInspector`, rendered inside `Flow`, is the side panel for a selected node. Open it from `Flow onNodeActivate`, which fires on a click and on Enter from a focused node, so keyboard users reach it too: a header with the node's icon, title and status, `tabs` (such as Settings and Wiring), a `callout` for its state, and Cancel / Save (disabled until `dirty`). It floats over the canvas and becomes a Sheet when the canvas is narrower than 768px; focus moves in when it opens and back to the node (`nodeId`) when it closes, and Escape closes it. Wrap the canvas and outside controls in `FlowProvider` to use `useReactFlow` beside it.
- Every other prop goes to React Flow, such as `onConnect`, `onBeforeDelete` (confirm deletes), `snapToGrid`, `nodeOrigin` and `onNodeContextMenu`.

Install the `@xyflow/react` peer dependency. Its structural CSS is imported by the Gaudi stylesheet, so no extra import is needed.

### Accessibility

The canvas is a labelled region described by a step count, followed by a visually hidden list of each step, its status and where it leads. Nodes and edges are focusable: Enter or Space selects, the arrow keys move a selected node with a live announcement, and Delete removes it. Zoom controls, node menus and connector buttons are labelled; connection handles are pointer targets, so the node name and the step list carry their meaning. Every string, including React Flow's keyboard instructions, comes from `labels`.

React Flow has no keyboard way to draw a connection between two handles, so offer a menu action or inspector field for linking, as the impact map example does. Dragging should never be the only way to change the graph.
