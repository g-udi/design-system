// Loads the generated agent metadata (ai/*.json) shipped with the package and resolves names.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const read = (file) => JSON.parse(readFileSync(path.join(packageRoot, file), 'utf8'));

export function loadMetadata(root = packageRoot) {
  const load = (file) => JSON.parse(readFileSync(path.join(root, file), 'utf8'));
  const components = load('ai/components.json');
  return {
    root,
    package: components.package,
    version: components.version,
    categories: components.categories,
    components: components.components,
    blocks: load('ai/blocks.json').blocks,
    tokens: load('ai/tokens.json'),
    icons: load('ai/icons.json'),
    setup: load('ai/setup.json'),
    exports: load('ai/exports.json').entries
  };
}

const normalize = (value) => String(value || '').toLowerCase().replace(/^@gaudi\/design-system\/?/, '').replace(/[^a-z0-9]+/g, '');

/** Resolve "Button", "core/Button", "Core/Button", "core-button", an export name or an import path. */
export function findComponent(metadata, name) {
  const key = normalize(name);
  if (!key) return { match: null, candidates: [] };
  const exact = metadata.components.filter((component) => [component.id, component.title, `${component.category}/${component.name}`, component.import?.path, component.import?.leaf]
    .some((value) => normalize(value) === key));
  const byName = metadata.components.filter((component) => normalize(component.name) === key || normalize(component.import?.mainExport) === key);
  const byExport = metadata.components.filter((component) => (component.import?.exports || []).some((exported) => normalize(exported) === key));
  const candidates = [...new Set([...exact, ...byName, ...byExport])];
  const rank = (component) => ['core', 'blocks', 'chat', 'charts', 'hooks', 'animations', 'layout', 'post', 'mdx'].indexOf(component.category);
  const preferred = [...(exact.length ? exact : byName.length ? byName : byExport)].sort((a, b) => rank(a) - rank(b));
  return { match: preferred[0] || null, candidates: candidates.map((component) => component.id) };
}

export function findBlock(metadata, name) {
  const key = normalize(String(name || '').replace(/^@gaudi\//, ''));
  return metadata.blocks.find((block) => normalize(block.name) === key) || null;
}

/** Block source: local registry output when present (repository checkout), otherwise null. */
export function readBlockItem(metadata, name) {
  const file = path.join(metadata.root, 'public/r', `${name}.json`);
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
}

export const readSkill = (root = packageRoot) => readFileSync(path.join(root, 'skills/gaudi-design-system/SKILL.md'), 'utf8');
export const packageManifest = () => read('package.json');
