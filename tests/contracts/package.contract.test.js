import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));

test('documented root, category, owner, and hook imports remain public', () => {
  for (const subpath of ['', '/core', '/core/Button', '/blocks/Navigation', '/chat', '/chat/ChatWorkspace', '/charts/ChartFrame', '/layout/LayoutContainer', '/mdx/runtime', '/mdx/remark', '/post', '/context', '/hooks', '/hooks/state/use-step', '/icons', '/icons/RegistryIcon', '/icons/brands/claudeAiIcon', '/icons/brands/openai', '/tokens', '/tailwind-preset', '/global.css', '/styles.css', '/flow.css']) {
    assert.ok(existsSync(require.resolve(`@gaudi/design-system${subpath}`)), `Missing public import: ${subpath || '.'}`);
  }
});

test('consumer imports cannot address private implementations or examples', () => {
  assert.ok(Object.keys(manifest.exports).every((key) => !key.includes('*')), 'An open wildcard makes private owners part of the public API');
  for (const subpath of ['components/blocks/Navigation/MenuMobile.jsx', 'components/core/Button/Button.jsx', 'core/Button/stories/Button.stories.jsx', 'chat/shared', 'hooks/shared/use-now', 'hooks/data/storage-state', 'icons/animated/catalog/activity', 'src/index.js']) {
    assert.throws(() => require.resolve(`@gaudi/design-system/${subpath}`), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' }, subpath);
  }
});

test('every declared public entry resolves to a shipped runtime target', () => {
  for (const subpath of Object.keys(manifest.exports)) {
    const resolved = require.resolve(manifest.name + (subpath === '.' ? '' : subpath.slice(1)));
    assert.ok(existsSync(resolved), `${subpath} points at a missing file`);
    assert.doesNotMatch(resolved, /\/(?:stories|docs|tests|\.storybook)\//, `${subpath} exposes repository scaffolding`);
  }
});

test('the class-name utility entry loads without a JSX transform', async () => {
  const { cn } = await import('@gaudi/design-system/utilities/cn');
  assert.equal(cn('px-2', false, { 'font-bold': true }, 'px-4'), 'font-bold px-4');
});

test('example fixtures compile through public package self-references without aliases', async () => {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const fixtures = readdirSync(path.join(root, 'src/components'), { recursive: true })
    .filter(file => file.includes('/stories/fixtures/') && /\.(?:js|jsx)$/.test(file))
    .map(file => `src/components/${file}`);
  const result = await build({
    absWorkingDir: root,
    stdin: {
      contents: fixtures.map((file, i) => `export * as Example${i} from './${file}';`).join('\n'),
      resolveDir: root
    },
    bundle: true, write: false, platform: 'browser', format: 'esm', jsx: 'automatic',
    loader: { '.js': 'jsx', '.css': 'empty', '.module.css': 'empty', '.md': 'text', '.csv': 'text' },
    metafile: true, logLevel: 'silent', treeShaking: false,
    plugins: [{
      name: 'external-dependencies',
      setup(builder) {
        builder.onLoad({ filter: /\.(?:js|jsx)$/ }, ({ path: file, suffix }) => {
          if (suffix === '?raw') return { contents: readFileSync(file, 'utf8'), loader: 'text' };
        });
        // Let esbuild resolve Gaudi's own exports natively, with no resolver alias.
        builder.onResolve({ filter: /^[^./]/ }, ({ path: specifier }) => {
          if (specifier === manifest.name || specifier.startsWith(`${manifest.name}/`)) return;
          return { path: specifier, external: true };
        });
      }
    }]
  });
  const publicTargets = new Set(Object.values(manifest.exports).map(target => target.replace(/^\.\//, '')));
  for (const fixture of fixtures) {
    const input = result.metafile.inputs[fixture];
    assert.ok(input, `${fixture} was not compiled`);
    for (const dependency of input.imports) {
      assert.ok(!dependency.external || !dependency.path.startsWith(manifest.name), `${fixture}: unresolved self-reference ${dependency.path}`);
      const runtimeComponent = dependency.path.startsWith('src/components/') && !dependency.path.includes('/stories/');
      if (runtimeComponent || publicTargets.has(dependency.path)) {
        assert.ok(dependency.original?.startsWith(`${manifest.name}/`) || dependency.original === manifest.name,
          `${fixture}: import ${dependency.original} through its public package namespace`);
      }
    }
  }
});
