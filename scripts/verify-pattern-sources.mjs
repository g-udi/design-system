import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { loadComponent } from '../src/test-support/renderComponent.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const coverage = JSON.parse(await readFile(resolve(root, '.storybook/fixtures/patterns/coverage.json'), 'utf8'));
const { publicSource } = await loadComponent(new URL('../.storybook/stories/PatternStoryHelpers.jsx', import.meta.url));
const examples = Object.entries(coverage.categories).flatMap(([family, entry]) => entry.examples.map((example) => ({ family, ...example })));
const sources = new Map(await Promise.all(examples.map(async (example) => {
  const source = publicSource(await readFile(resolve(root, `.storybook/fixtures/patterns/${example.family}/${example.name}.jsx`), 'utf8'));
  if (/from\s+['"]\./.test(source)) throw new Error(`${example.name}: copyable source still has a private relative import`);
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
        const subpath = path.replace('@gaudi/design-system', '').replace(/^\//, '');
        if (!subpath) return { path: resolve(root, 'src/index.js') };
        if (subpath === 'icons') return { path: resolve(root, 'src/icons/index.jsx') };
        if (subpath.startsWith('icons/')) return { path: resolve(root, `src/${subpath}.jsx`) };
        if (subpath === 'hooks') return { path: resolve(root, 'src/hooks/index.js') };
        if (subpath.startsWith('hooks/')) return { path: resolve(root, `src/${subpath}.js`) };
        return { path: resolve(root, `src/components/${subpath}/index.js`) };
      });
    }
  }]
});
console.log(`Validated public imports for ${sources.size} copyable examples across ${Object.keys(coverage.categories).length} families.`);
