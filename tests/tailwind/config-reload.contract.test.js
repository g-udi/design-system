import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const require = createRequire(import.meta.url);
const tailwindRequire = createRequire(require.resolve('@tailwindcss/vite'));
const { compile } = await import(tailwindRequire.resolve('@tailwindcss/node'));
const { clearRequireCache } = tailwindRequire('@tailwindcss/node/require-cache');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

test('preview and package CSS retain custom utilities after configuration reloads', async () => {
  for (const entry of ['.storybook/preview.css', 'src/global.css']) {
    const path = resolve(root, entry);
    const css = await readFile(path, 'utf8');
    const dependencies = new Set();
    for (let reload = 0; reload < 3; reload += 1) {
      // The Vite plugin clears CJS dependencies before rebuilding changed CSS.
      clearRequireCache([...dependencies]);
      const compiler = await compile(css, { base: dirname(path), onDependency: dependency => dependencies.add(dependency) });
      const result = compiler.build(['rounded-control', 'text-text', 'font-sans']);
      for (const utility of ['rounded-control', 'text-text', 'font-sans']) {
        assert.ok(result.includes(`.${utility}`), `${entry}, reload ${reload}: missing ${utility}`);
      }
      assert.ok(dependencies.has(resolve(root, 'src/tokens/tokens.json')), 'Token changes remain tracked');
    }
  }
});
