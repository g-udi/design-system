# Flow

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

## Accessibility

The canvas is a labelled region described by a step count, followed by a visually hidden list of each step, its status and where it leads. Nodes and edges are focusable: Enter or Space selects, the arrow keys move a selected node with a live announcement, and Delete removes it. Zoom controls, node menus and connector buttons are labelled; connection handles are pointer targets, so the node name and the step list carry their meaning. Every string, including React Flow's keyboard instructions, comes from `labels`.

React Flow has no keyboard way to draw a connection between two handles, so offer a menu action or inspector field for linking, as the impact map example does. Dragging should never be the only way to change the graph.
