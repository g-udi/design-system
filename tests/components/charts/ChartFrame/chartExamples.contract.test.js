import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../../../../', import.meta.url));
const chartRoot = new URL('../../../../src/components/charts/', import.meta.url);
const { chartExampleSource } = await loadComponent(new URL('stories/chartExamples.js', chartRoot));
// Relationship diagrams own semantic lists/groups, not ChartFrame's numeric data states.
// Their copyable examples and interactions are checked by their owner-local Storybook plays.
const relationshipDiagrams = new Set(['OrgChart', 'TournamentBracket']);
const fixtures = readdirSync(chartRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== 'stories' && !relationshipDiagrams.has(entry.name))
  .map((entry) => new URL(`${entry.name}/stories/fixtures/NativeExamples.jsx`, chartRoot));

test('every native chart example copies its real data and handlers through public imports', async () => {
  for (const origin of fixtures) {
    const source = chartExampleSource(readFileSync(origin, 'utf8'), origin);
    assert.doesNotMatch(source, /(?:from\s+|import\s*\()\s*['"]\.|storybook\/test|play:\s*async/, origin.pathname);
    await build({
      stdin: { contents: source, loader: 'jsx', resolveDir: root },
      bundle: true, write: false, platform: 'browser', format: 'esm', jsx: 'automatic', packages: 'external',
      loader: { '.js': 'jsx', '.css': 'empty', '.module.css': 'empty' }, logLevel: 'silent', treeShaking: false,
      plugins: [{ name: 'native-chart-public-imports', setup(builder) {
        builder.onResolve({ filter: /^@gaudi\/design-system(?:\/|$)/ }, ({ path }) => ({ path: require.resolve(path) }));
      } }]
    });
  }
});

test('every native chart Playground renders the requested invalid state', async () => {
  for (const origin of fixtures) {
    const { PlaygroundExample } = await loadComponent(origin);
    const html = renderToStaticMarkup(createElement(PlaygroundExample, { state: 'invalid' }));
    assert.match(html, /data-slot="chart-state" data-state="invalid"/, origin.pathname);
  }
});
