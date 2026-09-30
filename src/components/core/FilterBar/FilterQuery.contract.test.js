import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent } from '../../../test-support/renderComponent.js';
const { createFilterGroup, createFilterQuery, createFilterRule, moveFilterNodeTo, removeFilterNode, flattenFilterRules } = await loadComponent(new URL('./parts/filters-query-extended.jsx', import.meta.url));

test('moving nested filters cannot create cycles or mutate the previous query', () => {
  const rule = createFilterRule({ id: 'status', path: ['status'], operator: 'is', value: 'active' });
  const group = createFilterGroup({ id: 'team', rules: [rule] });
  const query = createFilterQuery([group]);
  assert.equal(moveFilterNodeTo(query, 'team', 'team', 0), query);
  const moved = moveFilterNodeTo(query, 'status', 'root', 1);
  assert.equal(query.rules[0].rules.length, 1);
  assert.equal(moved.rules[1].id, 'status');
  assert.deepEqual(flattenFilterRules(removeFilterNode(moved, 'status')), []);
});
