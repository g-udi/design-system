import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../../', import.meta.url));
const source = path.join(root, 'src');
const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const isScaffolding = (file) => /(?:^|\/)(?:stories|docs|tests|\.storybook)(?:\/|$)/.test(path.relative(root, file));

test('global CSS aggregates styles owned beside their runtime components', () => {
  assert.deepEqual(readdirSync(source).filter((file) => file.endsWith('.css')).sort(), ['global.css', 'spacing.css', 'styles.css']);
  const entry = readFileSync(path.join(source, 'styles.css'), 'utf8');
  assert.equal(entry.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@import\s+['"][^'"]+['"];?/g, '').trim(), '', 'styles.css must not collect component rules');
  const reachable = new Set();
  const visit = (file) => {
    if (reachable.has(file)) return;
    reachable.add(file);
    for (const [, specifier] of readFileSync(file, 'utf8').matchAll(/@import\s+['"]([^'"]+)['"]/g)) {
      if (!specifier.startsWith('.')) continue;
      const dependency = path.resolve(path.dirname(file), specifier);
      assert.ok(!isScaffolding(dependency), `${file} imports demo/test CSS: ${specifier}`);
      visit(dependency);
    }
  };
  for (const file of [path.join(source, 'global.css'), path.join(source, 'components/core/Flow/Flow.css')]) visit(file);
  for (const file of walk(path.join(source, 'components'))) {
    if (!file.endsWith('.css') || file.endsWith('.module.css') || isScaffolding(file)) continue;
    assert.ok(reachable.has(file), `${path.relative(root, file)} is missing from distributed style entries`);
  }
});

test('runtime modules cannot import stories, docs, or test scaffolding', () => {
  for (const file of walk(source)) {
    if (!/\.(?:js|jsx)$/.test(file) || isScaffolding(file)) continue;
    for (const [, specifier] of readFileSync(file, 'utf8').matchAll(/\b(?:from\s*|import\s*\(?\s*)['"]([^'"]+)['"]/g)) {
      if (!specifier.startsWith('.')) continue;
      assert.ok(!isScaffolding(path.resolve(path.dirname(file), specifier)), `${path.relative(root, file)} imports ${specifier}`);
    }
  }
});

test('shared focus defaults render no focus rings in any interaction state', () => {
  const base = readFileSync(path.join(source, 'foundations/base.css'), 'utf8');
  assert.match(base, /:where\(\*\):where\(:focus, :focus-visible, :focus-within, :active\)\s*\{[^}]*outline:\s*none !important/);
  assert.match(base, /--tw-ring-shadow:\s*0 0 #0000 !important/);
});
