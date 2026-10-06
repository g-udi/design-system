import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { loadComponent } from '../tests/support/renderComponent.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const coverage = JSON.parse(await readFile(resolve(root, 'src/docs/catalogue/coverage.json'), 'utf8'));
const { publicSource } = await loadComponent(new URL('../src/docs/components/PatternStoryHelpers.jsx', import.meta.url));
const examples = Object.values(coverage.categories).flatMap((entry) => entry.examples);
const sources = new Map(await Promise.all(examples.map(async (example) => {
  const source = publicSource(await readFile(resolve(root, example.file), 'utf8'), example.file);
  if (/(?:from\s+|import\s*(?:\(\s*)?)['"]\./.test(source)) throw new Error(`${example.name}: copyable source still has a private relative import`);
  return [example.name, source];
})));
await build({
  stdin: { contents: [...sources.keys()].map((name, i) => `export * as Example${i} from 'example:${name}';`).join('\n'), resolveDir: root },
  bundle: true, write: false, outfile: '/tmp/gaudi-pattern-source-check.js', platform: 'browser', format: 'esm', jsx: 'automatic', packages: 'external', loader: { '.js': 'jsx' }, logLevel: 'silent',
  plugins: [{
    name: 'public-examples',
    setup(builder) {
      builder.onResolve({ filter: /^example:/ }, ({ path }) => ({ path: path.slice(8), namespace: 'example' }));
      builder.onLoad({ filter: /.*/, namespace: 'example' }, ({ path }) => ({ contents: sources.get(path), loader: 'jsx', resolveDir: root }));
      builder.onResolve({ filter: /^@gaudi\/design-system(?:\/|$)/ }, ({ path }) => {
        return { path: require.resolve(path) };
      });
    }
  }]
});
console.log(`Validated public imports for ${sources.size} copyable examples across ${Object.keys(coverage.categories).length} families.`);
