import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const flow = await loadComponent(new URL('./index.js', import.meta.url));
const examples = await Promise.all([1, 2, 3, 4].map((n) => loadComponent(new URL(`../../../../.storybook/fixtures/patterns/flow/c-flow-${n}.jsx`, import.meta.url))));

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
  for (const name of ['Flow', 'FlowNode', 'FlowEdge', 'FlowControls', 'FlowMiniMap', 'FlowPanel', 'FlowProvider', 'FlowStatus', 'layoutFlow', 'useFlowHistory']) {
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
