// `pnpm registry:build` — shadcn-compatible registry for Gaudi blocks and patterns.
// Writes registry.json (generated manifest) and public/r/<name>.json items whose file content is the
// owner fixture rewritten to public @gaudi/design-system imports (the same source Storybook shows).
// Components are never copied: every item depends on the package. `--check` fails on stale output.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { derivePatterns } from '../ai/patterns.mjs';
import { exists, json, packageJson, root } from '../ai/sources.mjs';
import { toRegistryItem } from '../../src/themes/exporter.js';

const check = process.argv.includes('--check');
const manifest = packageJson();
const patterns = await derivePatterns();

const docs = (pattern) => [
  `Copy-in ${pattern.type === 'registry:block' ? 'block' : 'pattern'} built on ${manifest.name}; the components stay package imports.`,
  `Load '${manifest.name}/global.css' once and add transpilePackages: ['${manifest.name}'] in Next.js.`,
  'Until the package is on npm, install it from GitHub first: pnpm add github:g-udi/design-system.',
  pattern.assets.length ? `Demo assets referenced (supply your own or copy them into public/): ${pattern.assets.join(', ')}.` : ''
].filter(Boolean).join(' ');

const filePath = (pattern) => `registry/gaudi/${pattern.type === 'registry:block' ? 'blocks' : 'examples'}/${pattern.name}.jsx`;
const itemBase = (pattern) => ({
  name: pattern.name,
  type: pattern.type,
  title: pattern.title,
  description: pattern.description,
  dependencies: pattern.dependencies,
  categories: [...new Set([pattern.family, pattern.owner.split('/')[0]])],
  docs: docs(pattern),
  meta: { owner: pattern.owner, import: pattern.ownerImport, storyId: pattern.storyId, source: pattern.sourceFile, ...(pattern.assets.length ? { assets: pattern.assets } : {}) }
});

// Theme presets (pnpm themes:build) ship as registry:theme items with shadcn cssVars.
const themes = readdirSync(path.join(root, 'themes/presets')).filter((file) => file.endsWith('.json')).sort()
  .map((file) => toRegistryItem(JSON.parse(readFileSync(path.join(root, 'themes/presets', file), 'utf8'))));

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'gaudi',
  homepage: 'https://github.com/g-udi/design-system',
  items: [
    ...patterns.map((pattern) => ({ ...itemBase(pattern), files: [{ path: filePath(pattern), type: 'registry:component' }] })),
    ...themes.map(({ $schema: _schema, meta: _meta, ...item }) => item)
  ]
};

const outputs = new Map([['registry.json', json(registry)], ['public/r/registry.json', json(registry)]]);
for (const pattern of patterns) {
  outputs.set(`public/r/${pattern.name}.json`, json({
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    ...itemBase(pattern),
    files: [{ path: filePath(pattern), type: 'registry:component', content: pattern.source }]
  }));
}

for (const item of themes) outputs.set(`public/r/${item.name}.json`, json(item));

const stale = [];
for (const [file, content] of outputs) {
  const target = path.join(root, file);
  if (exists(file) && readFileSync(target, 'utf8') === content) continue;
  if (check) { stale.push(file); continue; }
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
}
for (const file of exists('public/r') ? readdirSync(path.join(root, 'public/r')) : []) {
  if (outputs.has(`public/r/${file}`)) continue;
  if (check) stale.push(`public/r/${file}`);
  else rmSync(path.join(root, 'public/r', file));
}
if (stale.length) throw new Error(`Registry output is stale (${stale.slice(0, 5).join(', ')}${stale.length > 5 ? '…' : ''}). Run pnpm registry:build.`);
const blocks = patterns.filter((pattern) => pattern.type === 'registry:block').length;
console.log(`Registry ${check ? 'is current' : 'written'}: ${patterns.length + themes.length} items (${blocks} blocks, ${patterns.length - blocks} patterns, ${themes.length} themes) in public/r.`);
