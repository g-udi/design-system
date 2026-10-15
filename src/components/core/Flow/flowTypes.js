import { FlowEdge } from './FlowEdge.jsx';
import { FlowNode, FlowPillNode, FlowTaskNode, FlowTileNode } from './FlowNode.jsx';

// The default node and edge renderers by type; a plain module so the maps stay readable on the server.
export const flowNodeTypes = { step: FlowNode, pill: FlowPillNode, tile: FlowTileNode, task: FlowTaskNode };
export const flowEdgeTypes = { flow: FlowEdge };
