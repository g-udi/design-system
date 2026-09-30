import assert from 'node:assert/strict';
import test from 'node:test';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { loadComponent } from '../test-support/renderComponent.js';
const { getIcon } = await loadComponent(new URL('./index.jsx', import.meta.url));
async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const result = await Promise.all(entries.map((entry) => entry.isDirectory() ? collect(join(directory, entry.name)) : entry.name.endsWith('.jsx') ? readFile(join(directory, entry.name), 'utf8') : ''));
  return result.flat();
}
test('every catalogue icon resolves through the central Gaudi registry', async () => {
  const sources = await collect(fileURLToPath(new URL('../../.storybook/fixtures/patterns', import.meta.url)));
  const names = new Set(sources.flatMap((source) => [...source.matchAll(/lucide=['"]([^'"]+)['"]/g)].map((match) => match[1])));
  assert.ok(names.size > 100);
  for (const name of names) assert.ok(getIcon(name.replace(/Icon$/, '')) || getIcon(name), `Missing icon: ${name}`);
});
