'use client';

import { useEffect, useId, useMemo, useRef } from 'react';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { Background, BackgroundVariant, MarkerType, MiniMap, Panel, ReactFlow, ReactFlowProvider, useReactFlow, useStore } from '@xyflow/react';
import { default as Button } from '../Button/index.js';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup.jsx';
import { default as Icon } from '../Icon/index.js';
import { ToggleGroup, ToggleGroupItem } from '../ToggleGroup/ToggleGroupPrimitives.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip/TooltipPrimitives.jsx';
import { cn } from '../../../utilities/cn/index.js';
import { FlowEdge } from './FlowEdge.jsx';
import { describeFlow } from './flowLayout.js';
import { FLOW_STATUSES, FlowNode, FlowPillNode, FlowTaskNode, FlowTileNode } from './FlowNode.jsx';

/** Every string Flow and its controls render, plus React Flow's own announcements. */
export const DEFAULT_FLOW_LABELS = {
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  fitView: 'Fit to view',
  fitSelection: 'Fit selection',
  autoLayout: 'Auto layout',
  selectTool: 'Select',
  handTool: 'Pan',
  tools: 'Canvas tool',
  zoomLevel: (percent) => `Zoom ${percent}%`,
  issues: (count) => (count ? `${count} ${count === 1 ? 'issue' : 'issues'}` : 'No issues'),
  controls: 'Canvas controls',
  minimap: 'Mini map',
  summaryTitle: 'Steps in this flow',
  summaryCount: (nodes, edges) => `${nodes} ${nodes === 1 ? 'step' : 'steps'} and ${edges} ${edges === 1 ? 'connection' : 'connections'}.`,
  leadsTo: 'leads to',
  ends: 'ends here',
  nodeDescription: 'Press Enter or Space to select, then use the arrow keys to move it. Press Delete to remove a selected step.',
  activateDescription: 'Press Enter to open its details. Press Space to select, then use the arrow keys to move it.',
  edgeDescription: 'Press Enter or Space to select this connection. Press Delete to remove it.'
};

export const flowNodeTypes = { step: FlowNode, pill: FlowPillNode, tile: FlowTileNode, task: FlowTaskNode };
export const flowEdgeTypes = { flow: FlowEdge };

const backgrounds = { dots: BackgroundVariant.Dots, lines: BackgroundVariant.Lines, cross: BackgroundVariant.Cross };

function ControlButton({ label, icon, onClick, disabled, pressed, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size='icon-sm' variant='outline' tone='neutral' aria-label={label} aria-pressed={pressed} disabled={disabled} onClick={onClick}>
          {icon ? <Icon name={icon} decorative /> : children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

// Nodes glide to their new places while a layout settles, then dragging stays instant.
function animateLayout(flowElement, apply) {
  const canvas = flowElement?.closest('.ds-flow');
  canvas?.setAttribute('data-layout-animating', '');
  apply();
  window.setTimeout(() => canvas?.removeAttribute('data-layout-animating'), 360);
}

/**
 * Canvas controls as labelled Gaudi buttons with tooltips: zoom in, zoom out and fit,
 * plus Fit selection (`showFitSelection`) and Auto layout (`onAutoLayout`, which receives
 * the current nodes and edges and returns or applies the new layout while nodes glide into
 * place). `variant='toolbar'` lays them out in one row with a select / pan tool switch
 * (`tool`, `onToolChange`), the zoom level and an issues button (`issues`, `onIssues`).
 * Children add more controls to the group.
 */
export function FlowControls({
  position = 'bottom-left',
  variant = 'stack',
  labels: custom,
  children,
  className,
  showFit = true,
  showFitSelection = false,
  onAutoLayout,
  tool,
  onToolChange,
  issues,
  onIssues
}) {
  const labels = { ...DEFAULT_FLOW_LABELS, ...custom };
  const reduceMotion = usePrefersReducedMotion();
  const flow = useReactFlow();
  const zoom = useStore((state) => state.transform[2]);
  const selectedCount = useStore((state) => state.nodes.filter((node) => node.selected).length);
  const toolbar = variant === 'toolbar';
  const percent = Math.round(zoom * 100);
  const layout = (event) => animateLayout(event.currentTarget, () => {
    const next = onAutoLayout({ nodes: flow.getNodes(), edges: flow.getEdges() });
    if (Array.isArray(next)) flow.setNodes(next);
    window.requestAnimationFrame(() => flow.fitView({ duration: reduceMotion ? 0 : 300, padding: 0.2 }));
  });
  const zoomIn = <ControlButton label={labels.zoomIn} icon={toolbar ? 'Plus' : 'ZoomIn'} onClick={() => flow.zoomIn({ duration: reduceMotion ? 0 : 150 })} />;
  const zoomOut = <ControlButton label={labels.zoomOut} icon={toolbar ? 'Minus' : 'ZoomOut'} onClick={() => flow.zoomOut({ duration: reduceMotion ? 0 : 150 })} />;
  const extras = (
    <>
      {showFit && <ControlButton label={labels.fitView} icon='Maximize' onClick={() => flow.fitView({ duration: reduceMotion ? 0 : 200, padding: 0.2 })} />}
      {showFitSelection && (
        <ControlButton
          label={labels.fitSelection}
          icon='LocateFixed'
          disabled={!selectedCount}
          onClick={() => flow.fitView({ nodes: flow.getNodes().filter((node) => node.selected), duration: reduceMotion ? 0 : 250, padding: 0.4, maxZoom: 1.4 })}
        />
      )}
      {onAutoLayout && <ControlButton label={labels.autoLayout} icon='LayoutDashboard' onClick={layout} />}
    </>
  );
  return (
    <Panel position={position} className={cn('ds-flow-panel', className)}>
      <TooltipProvider>
        {toolbar ? (
          <div role='toolbar' aria-label={labels.controls} className='ds-flow-toolbar nodrag nopan'>
            {onToolChange && (
              <>
                <ToggleGroup
                  type='single'
                  size='sm'
                  variant='default'
                  spacing={0}
                  aria-label={labels.tools}
                  value={tool}
                  onValueChange={(next) => next && onToolChange(next)}
                >
                  <ToggleGroupItem value='select' aria-label={labels.selectTool} title={labels.selectTool}>
                    <Icon name='MousePointer2' decorative />
                  </ToggleGroupItem>
                  <ToggleGroupItem value='hand' aria-label={labels.handTool} title={labels.handTool}>
                    <Icon name='Hand' decorative />
                  </ToggleGroupItem>
                </ToggleGroup>
                <span className='ds-flow-toolbar-divider' aria-hidden='true' />
              </>
            )}
            {zoomOut}
            <output className='ds-flow-zoom' aria-live='off' aria-label={labels.zoomLevel(percent)}>{percent}%</output>
            {zoomIn}
            <span className='ds-flow-toolbar-divider' aria-hidden='true' />
            {extras}
            {issues != null && (
              <ControlButton label={labels.issues(issues)} onClick={onIssues} disabled={!issues && !onIssues}>
                <span className='ds-flow-issues' data-count={issues || undefined}>
                  <Icon name='TriangleAlert' decorative />
                  {issues > 0 && <span className='ds-flow-issues-count'>{issues}</span>}
                </span>
              </ControlButton>
            )}
            {children}
          </div>
        ) : (
          <ButtonGroup orientation='vertical' aria-label={labels.controls} className='ds-flow-controls'>
            {zoomIn}
            {zoomOut}
            {extras}
            {children}
          </ButtonGroup>
        )}
      </TooltipProvider>
    </Panel>
  );
}

/** The overview map, tinted by each node's run status; hidden on narrow canvases. */
export function FlowMiniMap({ labels: custom, className, ...props }) {
  const labels = { ...DEFAULT_FLOW_LABELS, ...custom };
  return (
    <MiniMap
      pannable
      zoomable
      ariaLabel={labels.minimap}
      className={cn('ds-flow-minimap', className)}
      nodeClassName={(node) => cn('ds-flow-minimap-node', node.data?.status && `is-${node.data.status}`)}
      nodeBorderRadius={4}
      style={{ width: 168, height: 108 }}
      {...props}
    />
  );
}

/** A positioned overlay for toolbars, legends and inspectors inside the canvas. */
export function FlowPanel({ className, position = 'top-left', ...props }) {
  return <Panel position={position} className={cn('ds-flow-panel', className)} {...props} />;
}

const nodeLabel = (node) => {
  const title = node.data?.title || node.data?.label || node.id;
  const status = node.data?.statusLabel || FLOW_STATUSES[node.data?.status]?.label;
  return status ? `${title}, ${status}` : title;
};

// Keep the same world-space center when a responsive canvas changes size. A controlled
// viewport remains entirely host-owned, and user zoom/pan are otherwise left intact.
function FlowViewportResize() {
  const width = useStore((state) => state.width);
  const height = useStore((state) => state.height);
  const previous = useRef(null);
  const { getViewport, setViewport } = useReactFlow();
  useEffect(() => {
    if (!width || !height) return;
    const before = previous.current;
    previous.current = { width, height };
    if (!before || (before.width === width && before.height === height)) return;
    const viewport = getViewport();
    setViewport({ ...viewport, x: viewport.x + (width - before.width) / 2, y: viewport.y + (height - before.height) / 2 });
  }, [width, height, getViewport, setViewport]);
  return null;
}

/**
 * A node-and-edge canvas themed with Gaudi tokens. It is a labelled region with a
 * visually hidden list of steps and where each leads, so the graph reads without the
 * canvas. Every other prop is passed to React Flow.
 */
export function Flow({
  label,
  nodes,
  edges,
  defaultNodes,
  defaultEdges,
  nodeTypes,
  edgeTypes,
  defaultEdgeOptions,
  background = 'dots',
  controls = true,
  minimap = false,
  summary = true,
  labels: custom,
  tool,
  onNodeActivate,
  fitView = true,
  fitViewOptions,
  className,
  children,
  ...props
}) {
  const labels = { ...DEFAULT_FLOW_LABELS, ...custom };
  const summaryId = useId();
  const graphNodes = useMemo(() => nodes ?? defaultNodes ?? [], [nodes, defaultNodes]);
  const graphEdges = useMemo(() => edges ?? defaultEdges ?? [], [edges, defaultEdges]);
  // Nodes get an accessible name from their title and status unless they bring one.
  const named = useMemo(() => graphNodes.map((node) => (node.ariaLabel ? node : { ...node, ariaLabel: nodeLabel(node) })), [graphNodes]);
  const types = useMemo(() => ({ ...flowNodeTypes, ...nodeTypes }), [nodeTypes]);
  const edgeKinds = useMemo(() => ({ ...flowEdgeTypes, ...edgeTypes }), [edgeTypes]);
  const steps = summary ? describeFlow(graphNodes, graphEdges) : [];
  const ariaLabelConfig = {
    'node.a11yDescription.default': onNodeActivate ? labels.activateDescription : labels.nodeDescription,
    'edge.a11yDescription.default': labels.edgeDescription,
    'controls.ariaLabel': labels.controls,
    'controls.zoomIn.ariaLabel': labels.zoomIn,
    'controls.zoomOut.ariaLabel': labels.zoomOut,
    'controls.fitView.ariaLabel': labels.fitView,
    'minimap.ariaLabel': labels.minimap,
    ...props.ariaLabelConfig
  };
  // Opening a node (for an inspector) works from the pointer and from Enter on a focused node,
  // which React Flow otherwise only uses to select it.
  const activate = onNodeActivate && {
    onNodeClick: (event, node) => {
      props.onNodeClick?.(event, node);
      onNodeActivate(node, event);
    },
    onKeyDown: (event) => {
      props.onKeyDown?.(event);
      if (event.key !== 'Enter' || event.defaultPrevented) return;
      const element = event.target.closest?.('.react-flow__node');
      if (!element || element !== event.target) return;
      const node = graphNodes.find((item) => item.id === element.getAttribute('data-id'));
      if (node) onNodeActivate(node, event);
    }
  };
  const controlled = nodes !== undefined ? { nodes: named, edges: graphEdges } : { defaultNodes: named, defaultEdges: graphEdges };
  return (
    <section
      aria-label={label}
      aria-describedby={summary ? summaryId : undefined}
      data-slot='flow'
      data-tool={tool || undefined}
      className={cn('ds-flow', className)}
    >
      <ReactFlow
        {...controlled}
        nodeTypes={types}
        edgeTypes={edgeKinds}
        defaultEdgeOptions={{ type: 'flow', markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: 'var(--ds-flow-stroke)' }, ...defaultEdgeOptions }}
        fitView={fitView}
        // The first fit stops at a readable zoom on narrow canvases; the Fit control still shows everything.
        fitViewOptions={{ padding: 0.2, minZoom: 0.5, ...fitViewOptions }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.25}
        // `select` drags a selection box and pans with scroll; `hand` pans by dragging.
        {...(tool === 'select' ? { selectionOnDrag: true, panOnDrag: [1, 2], panOnScroll: true } : tool === 'hand' ? { selectionOnDrag: false, panOnDrag: true } : {})}
        {...props}
        {...activate}
        ariaLabelConfig={ariaLabelConfig}
      >
        {props.viewport === undefined && <FlowViewportResize />}
        {background !== 'none' && <Background variant={backgrounds[background] || BackgroundVariant.Dots} gap={background === 'dots' ? 16 : 24} size={background === 'dots' ? 1.5 : 1} />}
        {controls && <FlowControls labels={custom} />}
        {minimap && <FlowMiniMap labels={custom} />}
        {children}
      </ReactFlow>
      {summary && (
        <div className='sr-only'>
          <p id={summaryId}>{labels.summaryCount(graphNodes.length, graphEdges.length)}</p>
          <p>{labels.summaryTitle}</p>
          <ol>
            {steps.map((step) => (
              <li key={step.id}>
                {step.name}
                {step.status ? ` (${FLOW_STATUSES[step.status]?.label || step.status})` : ''}
                {': '}
                {step.next.length
                  ? `${labels.leadsTo} ${step.next.map((next) => (next.label ? `${next.name} (${next.label})` : next.name)).join(', ')}`
                  : labels.ends}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

/** Wrap a Flow and the controls beside it when they need `useReactFlow` outside the canvas. */
export const FlowProvider = ReactFlowProvider;
