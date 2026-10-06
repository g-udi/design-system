import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { OrgChart } = await loadComponent(new URL('../../../../src/components/charts/OrgChart/index.js', import.meta.url));
const data = { id: 'lead', name: 'Team lead', children: [{ id: 'report', name: 'Direct report' }] };
const render = (props) => renderToStaticMarkup(createElement(OrgChart, { data, ...props }));
test('reporting hierarchy renders semantic nesting and honors authoritative collapsed state', () => {
  assert.match(render({}), /<ul[^>]+aria-label="1 direct report"/);
  assert.doesNotMatch(render({ defaultCollapsedIds: ['lead'] }), /Direct report/);
  assert.match(render({ collapsedIds: [], defaultCollapsedIds: ['lead'] }), /Direct report/);
  assert.match(render({ onNodeClick() {}, disabled: true }), /disabled=""/);
  assert.match(render({ data: null, labels: { empty: 'No team' } }), /No team/);
});
