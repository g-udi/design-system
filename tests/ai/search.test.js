import assert from 'node:assert/strict';
import test from 'node:test';
import { findBlock, findComponent, loadMetadata } from '../../cli/metadata.mjs';
import { search } from '../../cli/search.mjs';

const metadata = loadMetadata();
const top = (query, options) => search(metadata, query, options)[0]?.id;

test('exact owner names rank first', () => {
  assert.equal(top('button'), 'core-button');
  assert.equal(top('Dialog'), 'core-dialog');
  assert.equal(top('line chart'), 'charts-linechart');
});

test('purpose words and synonyms find the owner', () => {
  assert.equal(top('modal'), 'core-dialog');
  assert.ok(search(metadata, 'date picker', { limit: 3 }).some((result) => result.id === 'core-calendar'));
  assert.ok(search(metadata, 'toast notification', { limit: 3 }).some((result) => result.id === 'core-toast'));
  assert.ok(search(metadata, 'sidebar', { limit: 5 }).some((result) => result.id === 'blocks-app-shell'));
});

test('category filters and limits apply', () => {
  const results = search(metadata, 'chart', { category: 'charts', limit: 5 });
  assert.ok(results.length > 0 && results.length <= 5);
  assert.ok(results.every((result) => result.category === 'charts'));
  assert.deepEqual(search(metadata, ''), []);
});

test('results are sorted by score and include blocks with install commands', () => {
  const results = search(metadata, 'settings page', { limit: 20 });
  for (let index = 1; index < results.length; index += 1) assert.ok(results[index - 1].score >= results[index].score);
  const block = results.find((result) => result.kind === 'block');
  assert.ok(block, 'expected a block result');
  assert.match(block.install, /^npx shadcn@latest add @gaudi\//);
});

test('names resolve by id, title, path or export, preferring core', () => {
  for (const name of ['Button', 'core/Button', 'Core/Button', 'core-button', '@gaudi/design-system/core/Button']) {
    assert.equal(findComponent(metadata, name).match?.id, 'core-button', name);
  }
  assert.equal(findComponent(metadata, 'Tooltip').match?.id, 'core-tooltip');
  assert.ok(findComponent(metadata, 'Tooltip').candidates.includes('mdx-tooltip'));
  assert.equal(findComponent(metadata, 'DialogConfirmationRoot').match?.id, 'core-dialog');
  assert.equal(findComponent(metadata, 'useDisclosure').match?.kind, 'hook');
  assert.equal(findComponent(metadata, 'nothing-like-this').match, null);
  assert.equal(findBlock(metadata, '@gaudi/screens-account-settings')?.name, 'screens-account-settings');
});
