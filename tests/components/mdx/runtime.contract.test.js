import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('the MDX runtime does not import the full component catalogue', async() => {
  const source = await readFile(new URL('../../../src/components/mdx/runtime.js', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /from ['"]\.\/index['"]/);
  assert.match(source, /components = \{\}/);
  assert.match(source, /globals = EMPTY_GLOBALS/);
});
