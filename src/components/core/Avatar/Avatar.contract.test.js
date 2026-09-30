import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../test-support/renderComponent.js';
import { getAvatarInitials, getAvatarGroupState } from './avatarModel.js';

test('Avatar initials support non-Latin names and missing identities', () => {
  for (const [name, expected] of [['Maya Chen', 'MC'], ['Élodie Brontë', 'ÉB'], ['محمد أحمد', 'مأ'], ['李明', '李明'], ['  ', '?'], ['!!!', '?']]) {
    assert.equal(getAvatarInitials(name), expected);
  }
});

test('Avatar preserves legacy labels and forwards native root attributes', async () => {
  const html = await renderComponent(new URL('./Avatar.jsx', import.meta.url), { label: 'AA', size: 'lg', shape: 'circle', 'data-owner': 'profile' });
  assert.match(html, /aria-label="AA avatar"/);
  assert.match(html, /data-owner="profile"/);
  assert.match(html, /size-14/);
  assert.match(html, />AA</);
});

test('Avatar keeps explicit decorative identities out of the accessible name', async () => {
  const html = await renderComponent(new URL('./Avatar.jsx', import.meta.url), { name: 'Maya Chen', alt: '', indicator: { label: 'Online', tone: 'success' } });
  assert.match(html, /aria-hidden="true"/);
  assert.doesNotMatch(html, /role="img"|aria-label=/);
});

test('Avatar includes host-provided presence in the identity label', async () => {
  const html = await renderComponent(new URL('./Avatar.jsx', import.meta.url), { name: 'Maya Chen', indicator: { label: 'Online', tone: 'success', position: 'top-start' } });
  assert.match(html, /aria-label="Maya Chen, Online"/);
  assert.match(html, /data-position="top-start"/);
});

test('AvatarGroup handles empty lists and numeric limits without losing identities', () => {
  const people = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, name: id }));
  assert.deepEqual(getAvatarGroupState([], 3), { visible: [], overflow: 0 });
  assert.deepEqual(getAvatarGroupState(people, 2.8), { visible: people.slice(0, 2), overflow: 3 });
  assert.equal(getAvatarGroupState(people, 0.5).visible.length, 1);
  for (const max of [0, -1, Infinity, NaN]) assert.deepEqual(getAvatarGroupState(people, max).visible, people);
});
