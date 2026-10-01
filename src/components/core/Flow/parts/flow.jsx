'use client';

import { useId, useMemo } from 'react';
import { Background, BackgroundVariant, MarkerType, MiniMap, Panel, ReactFlow, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { default as Button } from '../../Button/index.js';
import { ButtonGroup } from '../../ButtonGroup/parts/button-group.jsx';
import { default as Icon } from '../../Icon/index.js';
import { cn } from '../../../../utilities/cn/index.js';
import { FlowEdge } from './flow-edge.jsx';
import { describeFlow } from './flow-lib.js';
import { FLOW_STATUSES, FlowNode, FlowPillNode } from './flow-node.jsx';

/** Every string Flow and its controls render, plus React Flow's own announcements. */
export const DEFAULT_FLOW_LABELS = {
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  fitView: 'Fit to view',
  controls: 'Canvas controls',
  minimap: 'Mini map',
  summaryTitle: 'Steps in this flow',
  summaryCount: (nodes, edges) => `${nodes} ${nodes === 1 ? 'step' : 'steps'} and ${edges} ${edges === 1 ? 'connection' : 'connections'}.`,
  leadsTo: 'leads to',
  ends: 'ends here',
  nodeDescription: 'Press Enter or Space to select, then use the arrow keys to move it. Press Delete to remove a selected step.',
  edgeDescription: 'Press Enter or Space to select this connection. Press Delete to remove it.'
};

export const flowNodeTypes = { step: FlowNode, pill: FlowPillNode };
export const flowEdgeTypes = { flow: FlowEdge };

const backgrounds = { dots: BackgroundVariant.Dots, lines: BackgroundVariant.Lines, cross: BackgroundVariant.Cross };

/** Zoom in, zoom out and fit, as labelled Gaudi buttons. Children add more controls to the group. */
export function FlowControls({ position = 'bottom-left', labels: custom, children, className, showFit = true }) {
  const labels = { ...DEFAULT_FLOW_LABELS, ...custom };
  const flow = useReactFlow();
  return (
    <Panel position={position} className={cn('ds-flow-panel', className)}>
      <ButtonGroup orientation='vertical' aria-label={labels.controls} className='ds-flow-controls'>
        <Button size='icon-sm' variant='outline' tone='neutral' aria-label={labels.zoomIn} onClick={() => flow.zoomIn({ duration: 150 })}>
          <Icon name='ZoomIn' decorative />
        </Button>
        <Button size='icon-sm' variant='outline' tone='neutral' aria-label={labels.zoomOut} onClick={() => flow.zoomOut({ duration: 150 })}>
          <Icon name='ZoomOut' decorative />
        </Button>
        {showFit && (
          <Button size='icon-sm' variant='outline' tone='neutral' aria-label={labels.fitView} onClick={() => flow.fitView({ duration: 200, padding: 0.2 })}>
            <Icon name='Maximize' decorative />
          </Button>
        )}
        {children}
      </ButtonGroup>
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
    'node.a11yDescription.default': labels.nodeDescription,
    'edge.a11yDescription.default': labels.edgeDescription,
    'controls.ariaLabel': labels.controls,
    'controls.zoomIn.ariaLabel': labels.zoomIn,
    'controls.zoomOut.ariaLabel': labels.zoomOut,
    'controls.fitView.ariaLabel': labels.fitView,
    'minimap.ariaLabel': labels.minimap,
    ...props.ariaLabelConfig
  };
  const controlled = nodes !== undefined ? { nodes: named, edges: graphEdges } : { defaultNodes: named, defaultEdges: graphEdges };
  return (
    <section
      aria-label={label}
      aria-describedby={summary ? summaryId : undefined}
      data-slot='flow'
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
        {...props}
        ariaLabelConfig={ariaLabelConfig}
      >
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
