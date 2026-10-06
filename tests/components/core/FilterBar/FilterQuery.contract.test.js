import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent } from '../../../support/renderComponent.js';
const { createFilterGroup, createFilterQuery, createFilterRule, moveFilterNodeTo, removeFilterNode, flattenFilterRules } = await loadComponent(new URL('../../../../src/components/core/FilterBar/filterQuery.jsx', import.meta.url));

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

const { buildFilterIndex, computeFilterSchemaSignature } = await loadComponent(new URL('../../../../src/components/core/FilterBar/filterModel.jsx', import.meta.url));

test('prepared filter metadata updates without requiring a structural schema change', () => {
  const initial = [{ id: 'status', options: [{ value: 'ready', label: 'Ready', disabled: false }], operators: [{ value: 'is', label: 'is' }], loadOptions: () => 'old' }];
  const replacement = [{ ...initial[0], options: [{ value: 'ready', label: 'Ready', disabled: true }], operators: [{ value: 'is', label: 'matches' }], loadOptions: () => 'new' }];
  assert.equal(computeFilterSchemaSignature(initial), computeFilterSchemaSignature(replacement));
  const first = buildFilterIndex(initial);
  assert.equal(buildFilterIndex(initial, first), first, 'unchanged prepared fields retain their index');
  const next = buildFilterIndex(replacement, first);
  assert.notEqual(next, first);
  assert.equal(next.byPath.get('status'), replacement[0]);
  assert.equal(next.byPath.get('status').options[0].disabled, true);
  assert.equal(next.byPath.get('status').operators[0].label, 'matches');
  assert.equal(next.byPath.get('status').loadOptions(), 'new');
});
