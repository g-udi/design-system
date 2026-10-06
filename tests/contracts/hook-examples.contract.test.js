import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { ESLint } from 'eslint';
import { loadComponent } from '../support/renderComponent.js';

const root = new URL('../../', import.meta.url);
const require = createRequire(import.meta.url);
const { hookExampleSource } = await loadComponent(new URL('src/docs/hooks/hookExampleSource.js', root));
const readouts = readFileSync(new URL('src/docs/hooks/stories/fixtures/HookReadouts.jsx', root), 'utf8');
const eslint = new ESLint({ cwd: fileURLToPath(root) });

test('copied hook examples include their rendered composition, data, valid hook scope and public imports', async () => {
  for (const group of ['a11y', 'data', 'environment', 'interaction', 'layout', 'state']) {
    const directory = new URL(`src/docs/hooks/stories/${group}/fixtures/`, root);
    for (const file of readdirSync(directory).filter((name) => name.endsWith('.jsx'))) {
      const origin = new URL(file, directory);
      const source = hookExampleSource(readFileSync(origin, 'utf8'), readouts, origin);
      assert.doesNotMatch(source, /(?:from\s+|import\s*\()\s*['"]\.|storybook\/test|play:\s*async/, file);
      assert.match(source, /@gaudi\/design-system\/hooks/, file);
      const results = await eslint.lintText(source, { filePath: fileURLToPath(origin) });
      assert.deepEqual(results.flatMap((result) => result.messages), [], file);
      await build({
        stdin: { contents: source, loader: 'jsx', resolveDir: fileURLToPath(root) },
        bundle: true, write: false, platform: 'browser', format: 'esm', jsx: 'automatic', packages: 'external',
        loader: { '.js': 'jsx', '.css': 'empty', '.module.css': 'empty' }, logLevel: 'silent', treeShaking: false,
        plugins: [{ name: 'hook-example-public-imports', setup(builder) {
          builder.onResolve({ filter: /^@gaudi\/design-system(?:\/|$)/ }, ({ path }) => ({ path: require.resolve(path) }));
        } }]
      });
    }
  }
});
