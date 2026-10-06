// Read-only loaders shared by the AI metadata and registry builds. Every value is derived from
// the repository's sources of truth (package exports, authored owner docs, READMEs, the story
// catalogue, coverage manifest, tokens and the icon registry) so generated files cannot drift.
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

export const root = fileURLToPath(new URL('../../', import.meta.url));
export const readJson = (file) => JSON.parse(readFileSync(path.join(root, file), 'utf8'));
export const readText = (file) => readFileSync(path.join(root, file), 'utf8');
export const packageJson = () => readJson('package.json');
export const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const cache = path.join(root, 'node_modules/.cache/gaudi-ai');

/** Public export subpaths with the names each one exposes, resolved by esbuild from the source graph. */
export async function loadEntryExports(manifest = packageJson()) {
  const entries = Object.entries(manifest.exports)
    .filter(([, target]) => /\.(?:js|jsx)$/.test(target))
    .map(([subpath, target]) => ({ subpath, target, file: path.join(root, target) }));
  const result = await build({
    entryPoints: entries.map(({ file }) => file),
    bundle: true, splitting: true, write: false, format: 'esm', platform: 'neutral',
    outdir: path.join(cache, 'exports'), packages: 'external', jsx: 'automatic', metafile: true,
    loader: { '.js': 'jsx', '.css': 'empty', '.md': 'text', '.txt': 'text' }, logLevel: 'silent'
  });
  const byEntry = new Map();
  for (const output of Object.values(result.metafile.outputs)) {
    if (output.entryPoint) byEntry.set(path.join(root, output.entryPoint), [...output.exports].sort());
  }
  return Object.fromEntries(entries.map(({ subpath, target, file }) => [subpath, {
    specifier: manifest.name + (subpath === '.' ? '' : subpath.slice(1)),
    target,
    exports: byEntry.get(file) || []
  }]));
}

/** The authored owner documentation modules, keyed by docs file, exactly as Storybook reads them. */
export async function loadOwnerDocs() {
  const module = await import(pathToFileURL(path.join(root, 'src/docs/catalogue/component-docs.js')));
  return module.ownerDocumentationModules;
}

export async function loadHookCatalogue() {
  return import(pathToFileURL(path.join(root, 'src/docs/hooks/catalogue.js')));
}

/**
 * The Storybook `publicSource` rewrite (relative fixture imports -> public owner subpaths).
 * Bundled from the docs helper so registry items and Docs "Show code" stay identical.
 */
export async function loadPublicSource() {
  mkdirSync(cache, { recursive: true });
  const outfile = path.join(cache, 'pattern-story-helpers.mjs');
  await build({
    entryPoints: [path.join(root, 'src/docs/components/PatternStoryHelpers.jsx')],
    bundle: true, format: 'esm', platform: 'node', outfile, packages: 'external',
    jsx: 'automatic', loader: { '.js': 'jsx' }, logLevel: 'silent'
  });
  return (await import(`${pathToFileURL(outfile)}?v=${Date.now()}`)).publicSource;
}

/** Icon registry names, parsed from the `iconRegistry` object literal. */
export function loadIconNames() {
  const source = readText('src/icons/index.jsx');
  const block = source.slice(source.indexOf('export const iconRegistry = {'));
  const body = block.slice(block.indexOf('{') + 1, block.indexOf('\n};'));
  const names = [];
  for (const line of body.split('\n')) {
    const match = line.trim().match(/^'?([\w-]+)'?\s*(?::|,|$)/);
    if (match && !line.trim().startsWith('//')) names.push(match[1]);
  }
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}

export function loadObjectKeys(file, exportName) {
  const source = readText(file);
  const start = source.indexOf(`export const ${exportName} = {`);
  if (start < 0) return [];
  const body = source.slice(source.indexOf('{', start) + 1, source.indexOf('\n};', start));
  return [...body.matchAll(/^\s*['"]?([\w-]+)['"]?\s*:/gm)].map((match) => match[1]);
}

export const exists = (file) => existsSync(path.join(root, file));
