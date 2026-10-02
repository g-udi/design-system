import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const flow = await loadComponent(new URL('./index.js', import.meta.url));
const examples = await Promise.all([1, 2, 3, 4, 5].map((n) => loadComponent(new URL(`../../../../.storybook/fixtures/patterns/flow/c-flow-${n}.jsx`, import.meta.url))));

const nodes = [
  { id: 'start', type: 'pill', position: { x: 0, y: 0 }, data: { title: 'Draft ready', target: false } },
  { id: 'review', type: 'step', position: { x: 0, y: 0 }, data: { title: 'Editor review', status: 'running', outputs: [{ id: 'yes' }, { id: 'no' }] } },
  { id: 'ship', type: 'step', position: { x: 0, y: 0 }, data: { title: 'Ship' } },
  { id: 'revise', type: 'step', position: { x: 0, y: 0 }, data: { title: 'Revise' } },
  { id: 'orphan', type: 'step', position: { x: 0, y: 0 }, data: { title: 'Orphan' } }
];
const edges = [
  { id: 'a', source: 'start', target: 'review' },
  { id: 'b', source: 'review', sourceHandle: 'no', target: 'revise', data: { label: 'No' } },
  { id: 'c', source: 'review', sourceHandle: 'yes', target: 'ship', data: { label: 'Yes' } }
];

test('Flow publishes its parts and renders every example on the server', () => {
  for (const name of ['Flow', 'FlowNode', 'FlowTileNode', 'FlowTaskNode', 'FlowEdge', 'FlowInspector', 'FlowControls', 'FlowMiniMap', 'FlowPanel', 'FlowProvider', 'FlowStatus', 'layoutFlow', 'useFlowHistory']) {
    assert.ok(flow[name], `${name} must stay exported`);
  }
  for (const example of examples) {
    const html = renderToStaticMarkup(createElement(example.Pattern));
    assert.match(html, /data-slot="flow"/);
    assert.doesNotMatch(html, /\[object Object\]/);
  }
});

test('Flow is a labelled region with a text alternative of its steps', () => {
  const html = renderToStaticMarkup(createElement(flow.Flow, { label: 'Publishing pipeline', nodes, edges }));
  const describedBy = html.match(/<section aria-label="Publishing pipeline" aria-describedby="([^"]+)"/)?.[1];
  assert.ok(describedBy, 'the canvas is a named, described region');
  assert.match(html, new RegExp(`<p id="${describedBy}">5 steps and 3 connections\\.</p>`));
  assert.match(html, /Editor review \(Running\): leads to Revise \(No\), Ship \(Yes\)/);
  assert.match(html, /Orphan: ends here/);
});

test('layoutFlow ranks by dependency and keeps branches in output order', () => {
  const laid = flow.layoutFlow(nodes.slice(0, 4), edges, { direction: 'TB' });
  const at = Object.fromEntries(laid.map((node) => [node.id, node.position]));
  assert.ok(at.start.y < at.review.y && at.review.y < at.ship.y, 'each rank sits below its parent');
  assert.ok(at.ship.x < at.revise.x, 'the first output (yes) is laid out before the second (no)');
  assert.deepEqual(laid[0].origin, [0.5, 0.5]);
  const across = flow.layoutFlow(nodes.slice(0, 4), edges, { direction: 'LR' });
  assert.equal(across[1].targetPosition, 'left');
  assert.ok(across.find((node) => node.id === 'ship').position.x > across.find((node) => node.id === 'review').position.x);
});

test('graph helpers order, validate and find unreachable steps', () => {
  const { order, cyclic } = flow.topologicalOrder(nodes, edges);
  assert.equal(cyclic, false);
  assert.ok(order.indexOf('start') < order.indexOf('review') && order.indexOf('review') < order.indexOf('ship'));
  const loop = flow.topologicalOrder(nodes, [...edges, { source: 'ship', target: 'start' }]);
  assert.equal(loop.cyclic, true);
  assert.equal(loop.order.length, nodes.length, 'a cycle still yields every node');
  assert.equal(flow.createsCycle(edges, 'ship', 'start'), true);
  assert.equal(flow.createsCycle(edges, 'start', 'ship'), false);
  assert.equal(flow.hasEdge(edges, 'start', 'review'), true);
  assert.equal(flow.hasEdge(edges, 'start', 'review', 'a'), false);
  assert.deepEqual(flow.unreachableNodes(nodes, edges, ['start']).map((node) => node.id), ['orphan']);
});

test('statuses map to Gaudi badge variants and registry icons', () => {
  for (const [status, entry] of Object.entries(flow.FLOW_STATUSES)) {
    assert.ok(entry.label && entry.badge && entry.icon, `${status} has a label, badge and icon`);
  }
  const html = renderToStaticMarkup(createElement(flow.FlowStatus, { status: 'failed', label: 'Last run failed' }));
  assert.match(html, /data-status="failed"/);
  assert.match(html, /Last run failed/);
});

test('FlowEdge draws solid, dashed or dotted lines that can flow toward the target', async () => {
  assert.deepEqual(flow.FLOW_EDGE_VARIANTS, ['solid', 'dashed', 'dotted']);
  const ReactFlowProvider = flow.FlowProvider;
  const edge = (data, extra = {}) => renderToStaticMarkup(createElement(ReactFlowProvider, null, createElement('svg', null, createElement(flow.FlowEdge, {
    id: 'e', source: 'a', target: 'b', sourceX: 0, sourceY: 0, targetX: 100, targetY: 40, sourcePosition: 'right', targetPosition: 'left', data, ...extra
  }))));
  assert.match(edge({}), /data-variant="solid"/);
  const dotted = edge({ variant: 'dotted', animated: true });
  assert.match(dotted, /data-variant="dotted"/);
  assert.match(dotted, /ds-flow-edge-animated/);
  // A solid line keeps its stroke and carries a train of dots over it.
  assert.match(edge({ variant: 'solid', animated: true }), /class="ds-flow-edge-flow"/);
  // A run status colours the stroke and a running step flows on its own.
  const running = edge({ status: 'running', variant: 'dashed' });
  assert.match(running, /data-tone="accent"/);
  assert.match(running, /ds-flow-edge-animated/);
  assert.match(edge({ status: 'failed' }), /data-tone="danger"/);
  // The earlier `dashed` flag and React Flow's `animated` still map to a moving dashed line.
  assert.match(edge({ dashed: true }), /data-variant="dashed"/);
  const legacy = edge({}, { animated: true });
  assert.match(legacy, /data-variant="dashed"/);
  assert.match(legacy, /ds-flow-edge-animated/);
});

test('layoutFlow keeps attachments beside the step they belong to', () => {
  const steps = [
    { id: 'extract', type: 'tile', position: { x: 0, y: 0 }, data: { title: 'extract' } },
    { id: 'load', type: 'tile', position: { x: 0, y: 0 }, data: { title: 'load' } },
    { id: 'conn', type: 'tile', attachment: true, targetPosition: 'top', position: { x: 0, y: 0 }, data: { title: 'conn', shape: 'circle' } }
  ];
  const links = [{ id: 'a', source: 'extract', target: 'load' }, { id: 'b', source: 'extract', target: 'conn' }];
  const laid = Object.fromEntries(flow.layoutFlow(steps, links, { direction: 'LR', nodeWidth: 136, nodeHeight: 84 }).map((node) => [node.id, node]));
  assert.equal(laid.conn.position.x, laid.extract.position.x, 'the attachment sits under its step');
  assert.ok(laid.conn.position.y > laid.extract.position.y + 84, 'below it, clear of the tile');
  assert.ok(laid.load.position.x > laid.extract.position.x, 'the attachment takes no rank of its own');
  assert.equal(laid.conn.targetPosition, 'top', 'it keeps its own handle side');
});

test('tile and task nodes, the toolbar controls and the inspector render their contract', async () => {
  const ReactFlowProvider = flow.FlowProvider;
  const inProvider = (element) => renderToStaticMarkup(createElement(ReactFlowProvider, null, element));
  const tile = inProvider(createElement(flow.FlowTileNode, { id: 't', data: { title: 'reconcile_ledger', meta: 'Duplicate charge id', metaTone: 'danger', status: 'failed', icon: 'BookOpen' } }));
  assert.match(tile, /data-slot="flow-tile"[^>]*data-status="failed"/);
  assert.match(tile, /class="ds-flow-tile-badge" data-status="failed"/);
  assert.match(tile, /data-tone="danger">Duplicate charge id/);
  const task = inProvider(createElement(flow.FlowTaskNode, { id: 'p', data: { title: 'publish_mrr', status: 'waiting', action: { label: 'Approve' } } }));
  assert.match(task, /data-slot="flow-task"[^>]*data-status="waiting"/);
  assert.match(task, /aria-label="Approve publish_mrr"/);
  const flowWithControls = renderToStaticMarkup(createElement(flow.Flow, { label: 'Pipeline', nodes: [], edges: [], controls: false, tool: 'hand' },
    createElement(flow.FlowControls, { variant: 'toolbar', tool: 'hand', onToolChange: () => {}, onAutoLayout: () => [], showFitSelection: true, issues: 2 })));
  assert.match(flowWithControls, /data-tool="hand"/);
  assert.match(flowWithControls, /role="toolbar" aria-label="Canvas controls"/);
  for (const label of ['Auto layout', 'Fit selection', 'Zoom in', 'Zoom out', '2 issues', 'Select', 'Pan']) {
    assert.match(flowWithControls, new RegExp(`aria-label="${label}"`), `${label} control`);
  }
  const inspector = renderToStaticMarkup(createElement(flow.Flow, { label: 'Pipeline', nodes: [], edges: [] },
    createElement(flow.FlowInspector, { open: true, nodeId: 'p', title: 'publish_mrr', status: 'waiting', tabs: [{ value: 'settings', label: 'Settings', content: 'Fields' }, { value: 'wiring', label: 'Wiring', content: 'Links' }], callout: { tone: 'warning', title: 'Awaiting approval' } })));
  const titleId = inspector.match(/role="dialog" aria-modal="false" aria-labelledby="([^"]+)"/)?.[1];
  assert.ok(titleId, 'the floating inspector is a labelled dialog');
  assert.match(inspector, new RegExp(`id="${titleId}"[^>]*>publish_mrr<`));
  assert.match(inspector, />Settings</);
  assert.match(inspector, />Awaiting approval</);
  assert.match(inspector, /<button[^>]*disabled=""[^>]*>Save task<\/button>|<button[^>]*disabled[^>]*>Save task/);
  assert.equal(flow.DEFAULT_FLOW_LABELS.activateDescription.startsWith('Press Enter to open'), true, 'activatable nodes announce Enter');
});
