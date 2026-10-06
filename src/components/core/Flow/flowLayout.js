'use client';

import { useCallback, useRef, useState } from 'react';
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react';

/*
 * Graph helpers shared by the Flow examples: a small layered layout, dependency
 * ordering, cycle and duplicate checks, reachability, a text summary for screen
 * readers, and an undo history that treats one drag as one step.
 */

const outgoing = (edges) => {
  const map = new Map();
  for (const edge of edges) {
    if (!map.has(edge.source)) map.set(edge.source, []);
    map.get(edge.source).push(edge.target);
  }
  return map;
};

const sizeOf = (node, fallback) => ({
  width: node.measured?.width ?? node.width ?? fallback.width,
  height: node.measured?.height ?? node.height ?? fallback.height
});

/**
 * Places nodes in layers, like a tidy tree: each node sits one rank below its deepest
 * parent, siblings keep their parents' order, and every rank is centred on the widest.
 * `direction` is `TB` (top to bottom) or `LR` (left to right). Cycles are tolerated;
 * an edge that closes a loop is ignored when ranking. Positions are node centres, and
 * each node gets `origin: [0.5, 0.5]`; `nodeWidth` / `nodeHeight` size unmeasured nodes.
 *
 * Nodes marked `attachment: true` (a connection, a test or a model hanging off a step) are
 * not ranked: each sits beside the step it links to, below it in `LR` layouts and to its
 * right in `TB`, `attachmentGap` away, and keeps its own handle sides. The step reserves
 * room for them, so neighbouring steps never overlap an attachment.
 */
export function layoutFlow(nodes, edges, options = {}) {
  const { direction = 'TB', nodeWidth = 240, nodeHeight = 96, attachmentGap = 56 } = options;
  const attachments = nodes.filter((node) => node.attachment);
  if (!attachments.length) return layoutRanks(nodes, edges, options);
  const horizontal = direction === 'LR';
  const fallback = { width: nodeWidth, height: nodeHeight };
  const steps = nodes.filter((node) => !node.attachment);
  const stepIds = new Set(steps.map((node) => node.id));
  const hostOf = new Map();
  for (const node of attachments) {
    const link = edges.find((edge) => (edge.source === node.id && stepIds.has(edge.target)) || (edge.target === node.id && stepIds.has(edge.source)));
    if (link) hostOf.set(node.id, link.source === node.id ? link.target : link.source);
  }
  const hosted = new Map();
  for (const node of attachments) {
    const host = hostOf.get(node.id);
    if (!host) continue;
    if (!hosted.has(host)) hosted.set(host, []);
    hosted.get(host).push(node);
  }
  // A step with attachments is laid out as one taller (or wider) block that includes them.
  const extra = (id) => {
    const list = hosted.get(id) || [];
    if (!list.length) return 0;
    return attachmentGap + Math.max(...list.map((node) => (horizontal ? sizeOf(node, fallback).height : sizeOf(node, fallback).width)));
  };
  const blocks = steps.map((node) => {
    const grow = extra(node.id);
    if (!grow) return node;
    const size = sizeOf(node, fallback);
    return { ...node, measured: horizontal ? { width: size.width, height: size.height + grow } : { width: size.width + grow, height: size.height } };
  });
  const placed = new Map(layoutRanks(blocks, edges.filter((edge) => stepIds.has(edge.source) && stepIds.has(edge.target)), options).map((node) => [node.id, node]));
  const result = [];
  for (const node of nodes) {
    if (!node.attachment) {
      const block = placed.get(node.id);
      const grow = extra(node.id);
      const position = grow ? (horizontal ? { x: block.position.x, y: block.position.y - grow / 2 } : { x: block.position.x - grow / 2, y: block.position.y }) : block.position;
      result.push({ ...node, position, origin: block.origin, targetPosition: block.targetPosition, sourcePosition: block.sourcePosition });
      continue;
    }
    const host = hostOf.get(node.id);
    if (!host) {
      result.push(node);
      continue;
    }
    const hostNode = placed.get(host);
    const list = hosted.get(host);
    const index = list.indexOf(node);
    const hostSize = sizeOf(steps.find((step) => step.id === host), fallback);
    const own = sizeOf(node, fallback);
    const spread = (index - (list.length - 1) / 2) * ((horizontal ? own.width : own.height) + 16);
    const block = hostNode.position;
    const grow = extra(host);
    const position = horizontal
      ? { x: block.x + spread, y: block.y - grow / 2 + hostSize.height / 2 + attachmentGap + own.height / 2 }
      : { x: block.x - grow / 2 + hostSize.width / 2 + attachmentGap + own.width / 2, y: block.y + spread };
    result.push({ ...node, position, origin: [0.5, 0.5] });
  }
  return result;
}

function layoutRanks(nodes, edges, { direction = 'TB', rankGap = 80, nodeGap = 32, nodeWidth = 240, nodeHeight = 96 } = {}) {
  const horizontal = direction === 'LR';
  const ids = new Set(nodes.map((node) => node.id));
  const links = edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target) && edge.source !== edge.target);
  const children = outgoing(links);
  const parents = new Map(nodes.map((node) => [node.id, []]));
  for (const edge of links) parents.get(edge.target).push(edge.source);

  // Longest-path ranks from the roots, skipping back edges found by the depth-first walk.
  const rank = new Map();
  const state = new Map();
  const back = new Set();
  const visit = (id) => {
    state.set(id, 'open');
    for (const next of children.get(id) || []) {
      if (state.get(next) === 'open') back.add(`${id}>${next}`);
      else if (!state.has(next)) visit(next);
    }
    state.set(id, 'done');
  };
  const roots = nodes.filter((node) => !parents.get(node.id).length);
  for (const node of [...roots, ...nodes]) if (!state.has(node.id)) visit(node.id);
  const forward = links.filter((edge) => !back.has(`${edge.source}>${edge.target}`));
  const incoming = new Map(nodes.map((node) => [node.id, 0]));
  for (const edge of forward) incoming.set(edge.target, incoming.get(edge.target) + 1);
  const queue = nodes.filter((node) => !incoming.get(node.id)).map((node) => node.id);
  for (const id of queue) rank.set(id, 0);
  const forwardChildren = outgoing(forward);
  while (queue.length) {
    const id = queue.shift();
    for (const next of forwardChildren.get(id) || []) {
      rank.set(next, Math.max(rank.get(next) ?? 0, rank.get(id) + 1));
      incoming.set(next, incoming.get(next) - 1);
      if (!incoming.get(next)) queue.push(next);
    }
  }

  // Order each rank by the average position of its parents (one barycentre sweep). A child hanging
  // from a parent's second output sits right of one on its first, so branches do not cross.
  const ranks = [];
  for (const node of nodes) {
    const r = rank.get(node.id) ?? 0;
    (ranks[r] ||= []).push(node);
  }
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const slot = (edge) => {
    const outputs = byId.get(edge.source)?.data?.outputs || [];
    const index = outputs.findIndex((output) => output.id === edge.sourceHandle);
    return index < 0 ? 0 : (index + 1) / (outputs.length + 1) - 0.5;
  };
  const order = new Map();
  ranks.forEach((row, r) => {
    if (r > 0) {
      const score = (node) => {
        const into = links.filter((edge) => edge.target === node.id && order.has(edge.source));
        return into.length ? into.reduce((sum, edge) => sum + order.get(edge.source) + slot(edge), 0) / into.length : Number.MAX_SAFE_INTEGER;
      };
      row.sort((a, b) => score(a) - score(b));
    }
    row.forEach((node, i) => order.set(node.id, i));
  });

  const fallback = { width: nodeWidth, height: nodeHeight };
  const across = (node) => (horizontal ? sizeOf(node, fallback).height : sizeOf(node, fallback).width);
  const along = (node) => (horizontal ? sizeOf(node, fallback).width : sizeOf(node, fallback).height);
  const spans = ranks.map((row) => row.reduce((sum, node) => sum + across(node), 0) + nodeGap * Math.max(0, row.length - 1));
  const widest = Math.max(0, ...spans);
  const positions = new Map();
  let offset = 0;
  ranks.forEach((row, r) => {
    let cursor = (widest - spans[r]) / 2;
    const depth = Math.max(...row.map(along));
    for (const node of row) {
      // Centres, not corners: with origin [0.5, 0.5] a node lines up whatever its rendered size.
      const a = cursor + across(node) / 2;
      const b = offset + depth / 2;
      positions.set(node.id, horizontal ? { x: b, y: a } : { x: a, y: b });
      cursor += across(node) + nodeGap;
    }
    offset += depth + rankGap;
  });

  return nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) ?? node.position,
    origin: [0.5, 0.5],
    targetPosition: horizontal ? 'left' : 'top',
    sourcePosition: horizontal ? 'right' : 'bottom'
  }));
}

/**
 * Dependency order (Kahn). When the graph has a cycle, the nodes left over are appended
 * in their original order and `cyclic` is true, so a replay can still visit every node.
 */
export function topologicalOrder(nodes, edges) {
  const ids = nodes.map((node) => node.id);
  const indegree = new Map(ids.map((id) => [id, 0]));
  const links = edges.filter((edge) => indegree.has(edge.source) && indegree.has(edge.target));
  for (const edge of links) indegree.set(edge.target, indegree.get(edge.target) + 1);
  const children = outgoing(links);
  const queue = ids.filter((id) => !indegree.get(id));
  const order = [];
  while (queue.length) {
    const id = queue.shift();
    order.push(id);
    for (const next of children.get(id) || []) {
      indegree.set(next, indegree.get(next) - 1);
      if (!indegree.get(next)) queue.push(next);
    }
  }
  const cyclic = order.length < ids.length;
  if (cyclic) for (const id of ids) if (!order.includes(id)) order.push(id);
  return { order, cyclic };
}

/** Every node reachable from `from` by following edges forward (excluding `from`). */
export function descendants(edges, from) {
  const children = outgoing(edges);
  const seen = new Set();
  const stack = [...(children.get(from) || [])];
  while (stack.length) {
    const id = stack.pop();
    if (id === from || seen.has(id)) continue;
    seen.add(id);
    stack.push(...(children.get(id) || []));
  }
  return seen;
}

/** True when an edge `source → target` would close a loop. */
export function createsCycle(edges, source, target) {
  return source === target || descendants(edges, target).has(source);
}

/** True when an edge between the same two nodes already exists (ignoring `ignoreId`). */
export function hasEdge(edges, source, target, ignoreId) {
  return edges.some((edge) => edge.id !== ignoreId && edge.source === source && edge.target === target);
}

/** Nodes that cannot be reached from any of `startIds` (defaults to the nodes with no incoming edges). */
export function unreachableNodes(nodes, edges, startIds) {
  const starts = startIds || nodes.filter((node) => !edges.some((edge) => edge.target === node.id)).map((node) => node.id);
  const reached = new Set(starts);
  for (const id of starts) for (const next of descendants(edges, id)) reached.add(next);
  return nodes.filter((node) => !reached.has(node.id));
}

const nodeName = (node) => node?.data?.title || node?.data?.label || node?.ariaLabel || node?.id || '';

/**
 * A text alternative for the canvas: one entry per node with its status and where it
 * leads, in reading order. Flow renders it as a visually hidden list.
 */
export function describeFlow(nodes, edges) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return nodes.map((node) => ({
    id: node.id,
    name: nodeName(node),
    status: node.data?.statusLabel || node.data?.status,
    next: edges
      .filter((edge) => edge.source === node.id && byId.has(edge.target))
      .map((edge) => ({ name: nodeName(byId.get(edge.target)), label: edge.data?.label || edge.label }))
  }));
}

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
