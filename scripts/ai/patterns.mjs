// Curated pattern examples (src/docs/catalogue/coverage.json) as copy-in registry items. The source
// is the owner fixture rewritten by Storybook's `publicSource`, so every Gaudi import is a public
// package import and components are never copied.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { loadPublicSource, packageJson, readJson, root } from './sources.mjs';

export const REGISTRY_NAMESPACE = '@gaudi';
const peerProvided = new Set(['react', 'react-dom', 'next']);
const packageName = (specifier) => specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];

export const installCommands = (name) => ({
  registry: `npx shadcn@latest add ${REGISTRY_NAMESPACE}/${name}`,
  local: `npx shadcn@latest add ./public/r/${name}.json`
});

/** Exact import graph per rewritten fixture, resolved by esbuild instead of regexes over JSX text. */
async function importsOf(sources) {
  const result = await build({
    entryPoints: Object.keys(sources).map((name) => `fixture:${name}`),
    bundle: true, write: false, metafile: true, format: 'esm', outdir: '/tmp/gaudi-registry', logLevel: 'silent',
    plugins: [{
      name: 'fixtures',
      setup(builder) {
        builder.onResolve({ filter: /^fixture:/ }, ({ path: id }) => ({ path: id.slice(8), namespace: 'fixture' }));
        builder.onResolve({ filter: /.*/ }, ({ path: id }) => ({ path: id, external: true }));
        builder.onLoad({ filter: /.*/, namespace: 'fixture' }, ({ path: id }) => ({ contents: sources[id], loader: 'jsx' }));
      }
    }]
  });
  return Object.fromEntries(Object.entries(result.metafile.inputs).map(([key, input]) => [
    key.replace(/^fixture:/, ''),
    [...new Set(input.imports.map((entry) => entry.path))].sort()
  ]));
}

const namedImports = (source) => {
  const names = new Set();
  for (const match of source.matchAll(/^import\s+([^;]+?)\s+from\s+['"](@gaudi\/design-system[^'"]*)['"]/gm)) {
    const bindings = match[1];
    const defaultName = bindings.match(/^([A-Za-z_$][\w$]*)/);
    if (defaultName && !bindings.startsWith('{')) names.add(defaultName[1]);
    for (const named of bindings.match(/\{([^}]*)\}/)?.[1].split(',') || []) {
      const [imported, local] = named.trim().split(/\s+as\s+/);
      const name = imported === 'default' ? local : imported;
      if (name) names.add(name);
    }
  }
  return [...names].sort();
};

export async function derivePatterns({ catalogue = readJson('src/docs/catalogue/catalogue.json') } = {}) {
  const manifest = packageJson();
  const versions = { ...manifest.devDependencies, ...manifest.peerDependencies, ...manifest.dependencies };
  const packageSpec = process.env.GAUDI_PACKAGE_SPEC ? `${manifest.name}@${process.env.GAUDI_PACKAGE_SPEC}` : manifest.name;
  const publicSource = await loadPublicSource();
  const coverage = readJson('src/docs/catalogue/coverage.json');
  const patterns = [];
  for (const [family, { owner, examples }] of Object.entries(coverage.categories)) {
    for (const example of examples) {
      const file = path.join(root, example.file);
      const source = publicSource(readFileSync(file, 'utf8'), pathToFileURL(file));
      const story = catalogue.entries[example.storyId];
      const isBlock = owner.startsWith('blocks/');
      patterns.push({
        name: example.name,
        type: isBlock ? 'registry:block' : 'registry:example',
        title: example.title,
        family,
        owner,
        ownerImport: `${manifest.name}/${owner}`,
        storyId: example.storyId,
        storyTitle: story?.title || null,
        sourceFile: example.file,
        assets: [...new Set([...source.matchAll(/['"`](\/?(?:avatars|static|flags)\/[^'"`\s]+)['"`]/g)].map((match) => match[1]).filter((asset) => !asset.includes('${')))].sort(),
        source
      });
    }
  }
  const graph = await importsOf(Object.fromEntries(patterns.map((pattern) => [pattern.name, pattern.source])));
  for (const pattern of patterns) {
    const specifiers = graph[pattern.name] || [];
    pattern.packageImports = specifiers.filter((specifier) => specifier.startsWith(manifest.name));
    pattern.uses = namedImports(pattern.source);
    pattern.dependencies = [packageSpec, ...[...new Set(specifiers.map(packageName))]
      .filter((name) => name !== manifest.name && !peerProvided.has(name))
      .sort()
      .map((name) => versions[name] ? `${name}@${versions[name].replace(/^[\^~]/, '')}` : name)];
    const where = pattern.storyTitle ? `${pattern.storyTitle} pattern` : 'Pattern';
    pattern.description = `${pattern.title}. ${where} composed from ${pattern.ownerImport} and other public Gaudi components; the components stay package imports.`;
    pattern.install = installCommands(pattern.name);
  }
  return patterns.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
}
