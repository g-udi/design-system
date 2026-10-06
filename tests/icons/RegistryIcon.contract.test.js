import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import { Linter } from 'eslint';
import { loadComponent } from '../support/renderComponent.js';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const { default: Icon, getIcon } = await loadComponent(new URL('../../src/icons/index.jsx', import.meta.url));

test('static icons preserve explicit dimensions and accessible labels', () => {
  const html = renderToStaticMarkup(createElement(Icon, { name: 'Search', size: 32, 'aria-label': 'Search records' }));
  assert.match(html, /width="32"/);
  assert.match(html, /height="32"/);
  assert.match(html, /aria-label="Search records"/);
  assert.match(html, /role="img"/);
  assert.doesNotMatch(html, /size-5|aria-hidden="true"/);
});
test('every catalogue icon resolves through the central Gaudi registry', async () => {
  const root = new URL('../../', import.meta.url);
  const coverage = JSON.parse(await readFile(new URL('src/docs/catalogue/coverage.json', root), 'utf8'));
  const examples = Object.values(coverage.categories).flatMap(({ examples }) => examples);
  const sources = await Promise.all(examples.map(({ file }) => readFile(new URL(file, root), 'utf8')));
  const names = new Set(sources.flatMap((source) => [...source.matchAll(/lucide=['"]([^'"]+)['"]/g)].map((match) => match[1])));
  assert.ok(names.size > 100);
  for (const name of names) assert.ok(getIcon(name.replace(/Icon$/, '')) || getIcon(name), `Missing icon: ${name}`);
});

test('literal Gaudi icon names in runtime and examples resolve to visible glyphs', async () => {
  const root = new URL('../../src/', import.meta.url);
  const files = (await readdir(root, { recursive: true })).filter((file) => /\.jsx?$/.test(file));
  const linter = new Linter();
  const missing = [];
  const rule = {
    create(context) {
      const names = new Set();
      return {
        ImportDeclaration(node) {
          if (!/(?:\/Icon|\/icons)(?:\/index)?(?:\.jsx?)?$/.test(node.source.value)) return;
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportDefaultSpecifier' || specifier.imported?.name === 'default') names.add(specifier.local.name);
          }
        },
        JSXOpeningElement(node) {
          if (!names.has(node.name.name)) return;
          const name = node.attributes.find((attribute) => attribute.name?.name === 'name')?.value;
          if (name?.type === 'Literal' && !getIcon(name.value)) missing.push(context.filename + ': ' + name.value);
        }
      };
    }
  };
  for (const file of files) {
    const source = await readFile(new URL(file, root), 'utf8');
    const messages = linter.verify(source, [{ files: ['**/*.{js,jsx}'], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } }, plugins: { registry: { rules: { names: rule } } }, rules: { 'registry/names': 'error' } }], { filename: file, allowInlineConfig: false });
    assert.deepEqual(messages, [], file);
  }
  assert.deepEqual(missing, []);
});
