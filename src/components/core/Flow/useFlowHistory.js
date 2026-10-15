'use client';

import { useCallback, useRef, useState } from 'react';
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react';

const structural = new Set(['add', 'remove', 'replace']);
const snapshot = (current) => ({ nodes: current.nodes, edges: current.edges });
const push = (current, record, limit) => (record ? { past: [...current.past, snapshot(current)].slice(-limit), future: [] } : {});

/**
 * Nodes and edges with undo and redo. Selection and measuring never create history;
 * a drag records one entry when it starts, so undo puts the node back in one step.
 * Call `commit(nodes, edges)` for edits made outside React Flow's change handlers.
 */
export function useFlowHistory({ nodes: initialNodes = [], edges: initialEdges = [], limit = 50 } = {}) {
  // One state object keeps the graph and both stacks in step, so every update stays pure.
  const [state, setState] = useState(() => ({ nodes: initialNodes, edges: initialEdges, past: [], future: [] }));
  const dragging = useRef(false);
  const initial = useRef({ nodes: initialNodes, edges: initialEdges });

  const commit = useCallback((nodes, edges) => {
    setState((current) => ({ ...current, ...push(current, true, limit), nodes: nodes ?? current.nodes, edges: edges ?? current.edges }));
  }, [limit]);

  const onNodesChange = useCallback((changes) => {
    const starts = changes.some((change) => change.type === 'position' && change.dragging) && !dragging.current;
    if (starts) dragging.current = true;
    if (changes.some((change) => change.type === 'position' && change.dragging === false)) dragging.current = false;
    const record = starts || changes.some((change) => structural.has(change.type));
    setState((current) => ({ ...current, ...push(current, record, limit), nodes: applyNodeChanges(changes, current.nodes) }));
  }, [limit]);

  const onEdgesChange = useCallback((changes) => {
    const record = changes.some((change) => structural.has(change.type));
    setState((current) => ({ ...current, ...push(current, record, limit), edges: applyEdgeChanges(changes, current.edges) }));
  }, [limit]);

  const undo = useCallback(() => {
    setState((current) => {
      if (!current.past.length) return current;
      const previous = current.past.at(-1);
      return { ...previous, past: current.past.slice(0, -1), future: [snapshot(current), ...current.future] };
    });
  }, []);

  const redo = useCallback(() => {
    setState((current) => {
      if (!current.future.length) return current;
      const [next, ...rest] = current.future;
      return { ...next, past: [...current.past, snapshot(current)].slice(-limit), future: rest };
    });
  }, [limit]);

  const reset = useCallback((next = initial.current) => {
    setState({ nodes: next.nodes, edges: next.edges, past: [], future: [] });
  }, []);

  const setNodes = useCallback((update) => {
    setState((current) => ({ ...current, nodes: typeof update === 'function' ? update(current.nodes) : update }));
  }, []);
  const setEdges = useCallback((update) => {
    setState((current) => ({ ...current, edges: typeof update === 'function' ? update(current.edges) : update }));
  }, []);

  return {
    nodes: state.nodes,
    edges: state.edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    commit,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0
  };
}
