import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { ownerDocumentationModules } from '../../src/docs/catalogue/component-docs.js';
import { syncComponentDocs } from '../../scripts/sync-component-docs.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const catalogue = JSON.parse(readFileSync(resolve(root, 'src/docs/catalogue/catalogue.json'), 'utf8'));
const owners = new Set(Object.values(manifest.exports).flatMap(entry => {
  const target = typeof entry === 'string' ? entry : entry.import || entry.default;
  const owner = target?.match(/^\.\/src\/components\/([^/]+\/[^/]+)\//)?.[1];
  return owner ? [owner] : [];
}));
const files = directory => existsSync(resolve(root, directory)) ? readdirSync(resolve(root, directory), { recursive: true }).map(file => `${directory}/${file}`) : [];

// The async server shell cannot be mounted by Storybook's client renderer. Its
// public boundary is explained in Layout and exercised by a server contract.
const storyExceptions = {
  'layout/LayoutContainer': {
    reason: 'Async JSON-LD processing requires server rendering; the overview documents its direct server entry.',
    file: 'src/docs/stories/LayoutOverview.stories.jsx'
  }
};

test('the generated documentation index matches the owner-local source files', async () => {
  await syncComponentDocs({ check: true });
  const titles = Object.values(ownerDocumentationModules).flatMap(docs => Object.keys(docs));
  assert.equal(new Set(titles).size, titles.length, 'Multiple owners author the same documentation title');
  for (const file of Object.keys(ownerDocumentationModules)) {
    const owner = file.match(/^src\/components\/([^/]+\/[^/]+)\/stories\/docs\//)?.[1];
    assert.ok(owners.has(owner), `${file}: documentation must belong to a canonical public owner`);
  }
});

test('every public component owner has authored docs, a discoverable example, and semantic test coverage', () => {
  assert.ok(owners.size > 100, 'Public owner discovery must inspect the full explicit package export map');
  const failures = [];
  for (const owner of owners) {
    const directory = `src/components/${owner}`;
    if (!existsSync(resolve(root, `${directory}/index.js`))) failures.push(`${owner}: missing explicit owner index`);
    const metadata = Object.entries(ownerDocumentationModules).filter(([file]) => file.startsWith(`${directory}/stories/docs/`));
    if (!metadata.length) failures.push(`${owner}: missing owner-local authored documentation`);
    for (const [, entries] of metadata) for (const [title, docs] of Object.entries(entries)) {
      if (!docs.description || !docs.accessibility || !docs.props?.length || !docs.usage) failures.push(`${title}: incomplete authored API, accessibility, or usage`);
    }
    const stories = files(`${directory}/stories`).filter(file => /\.stories\.(jsx?|mdx)$/.test(file));
    const exception = storyExceptions[owner];
    if (!stories.length && !(exception?.reason && existsSync(resolve(root, exception.file)))) failures.push(`${owner}: missing owner-local story`);
    if (stories.length && !Object.values(catalogue.entries).some(entry => entry.type === 'story' && stories.includes(entry.importPath.replace(/^\.\//, '')))) failures.push(`${owner}: local examples are not discoverable in the catalogue`);
    const contracts = files(`tests/components/${owner}`).filter(file => file.endsWith('.contract.test.js'));
    // Browser plays exercise keyboard, portals, focus, and async interaction that
    // a duplicate server-render smoke test cannot establish.
    const hasBrowserContract = stories.some(file => /\bplay\s*:/.test(readFileSync(resolve(root, file), 'utf8')));
    if (!contracts.length && !hasBrowserContract) failures.push(`${owner}: needs a mirrored contract or owner-local Storybook play`);
  }
  for (const owner of Object.keys(storyExceptions)) assert.ok(owners.has(owner), `Obsolete artifact exception: ${owner}`);
  assert.deepEqual(failures, [], failures.join('\n'));
});
