import assert from 'node:assert/strict';
import test from 'node:test';
import { commandItemProps, prepareCommandCollection } from '../../../../src/components/core/Commander/commanderItems.js';

test('Commander preserves prepared destinations, identity, labels and actions for every collection', () => {
  const onClick = () => {};
  for (const type of ['navigation', 'post', 'project', 'thought', 'publication', 'tag']) {
    const item = { id: 0, slug: 'legacy-slug', title: '', name: 'Fallback title', subtitle: 0, category: 'API_platform', href: '/custom/destination', disabled: true, onClick, closeOnSelect: false };
    const [prepared] = prepareCommandCollection([item], type);
    assert.equal(prepared.id, 0);
    assert.equal(prepared.title, '');
    assert.equal(prepared.subtitle, 0);
    assert.equal(prepared.category, 'API_platform');
    assert.deepEqual(commandItemProps(prepared), { href: '/custom/destination', disabled: true, onClick, closeOnSelect: false });
    assert.equal(item.type, undefined, 'Preparation must not mutate the host record');
  }
});

test('Commander never invents a route from a slug or overwrites an explicitly empty href', () => {
  for (const type of ['post', 'project', 'thought', 'publication', 'tag']) {
    assert.equal(prepareCommandCollection([{ slug: 'entry', title: 'Entry' }], type)[0].href, undefined);
    assert.equal(prepareCommandCollection([{ id: 'entry', href: '' }], type)[0].href, '');
  }
  assert.deepEqual(prepareCommandCollection(null, 'post'), []);
});
