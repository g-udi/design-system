import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { ESLint } from 'eslint';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../support/renderComponent.js';

const root = new URL('../../', import.meta.url);
const require = createRequire(import.meta.url);
const owners = ['Pagination', 'PhoneInput', 'SchemaDisplay', 'ScrollArea', 'Scrollspy', 'Separator', 'Textarea', 'Sortable', 'Questionnaire', 'Tree', 'ToggleGroup', 'WebPreview', 'Sheet', 'Popover', 'Tabs', 'Timeline', 'Loader', 'Slider', 'Toast'];
const { publicSource } = await loadComponent(new URL('src/docs/components/PatternStoryHelpers.jsx', root));
const { webPreviewExampleSource } = await loadComponent(new URL('src/components/core/WebPreview/stories/exampleSource.js', root));
const eslint = new ESLint({ cwd: fileURLToPath(root) });

test('fixture lint recognizes framed icons, dividers and spinners in their copyable forms', async () => {
  const jsx = [
    "<div className='border flex size-[32px] items-center rounded-full'><RegistryIcon /></div>",
    "<span className={`grid size-6 place-items-center rounded-full ${tone}`}><RegistryIcon /></span>",
    "<div className='rounded-md border p-1.5'>{feature.icon}</div>",
    "<span aria-hidden='true' className='h-4 w-px bg-ui-border' />",
    "<RegistryIcon lucide='LoaderCircleIcon' className={cn('size-4', busy && 'animate-spin')} />",
    "<div className='rounded-md border p-1.5'>{feature.icon}<span>Summary</span></div>",
    "<span className='absolute inset-y-0 w-px bg-ui-border' />"
  ];
  const [result] = await eslint.lintText(`export const example = <>\n${jsx.join('\n')}\n</>;`, {
    filePath: fileURLToPath(new URL('src/components/core/Icon/stories/fixtures/Sample.jsx', root))
  });
  const ownership = result.messages.filter(message => ['gaudi/use-icon-tile', 'no-restricted-syntax'].includes(message.ruleId));
  assert.deepEqual(ownership.map(message => message.line), [2, 3, 4, 5, 6]);
});

test('copied native compositions include their data, valid hooks, callbacks and public imports', async () => {
  for (const owner of owners) {
    const origin = new URL(`src/components/core/${owner}/stories/fixtures/NativeExamples.jsx`, root);
    const raw = readFileSync(origin, 'utf8');
    const source = owner === 'WebPreview'
      ? webPreviewExampleSource(raw, readFileSync(new URL('src/docs/fixtures/site/link-previews.js', root), 'utf8'), readFileSync(new URL('src/docs/fixtures/site/artwork.js', root), 'utf8'), origin)
      : publicSource(raw, origin);
    assert.doesNotMatch(source, /(?:from\s+|import\s*\()\s*['"]\.|storybook\/test|play:\s*async/, owner);
    const results = await eslint.lintText(source, { filePath: fileURLToPath(origin) });
    assert.deepEqual(results.flatMap((result) => result.messages), [], owner);
    await build({
      stdin: { contents: source, loader: 'jsx', resolveDir: fileURLToPath(root) },
      bundle: true, write: false, platform: 'browser', format: 'esm', jsx: 'automatic', packages: 'external',
      loader: { '.js': 'jsx', '.css': 'empty', '.module.css': 'empty' }, logLevel: 'silent', treeShaking: false,
      plugins: [{ name: 'native-example-public-imports', setup(builder) {
        builder.onResolve({ filter: /^@gaudi\/design-system(?:\/|$)/ }, ({ path }) => ({ path: require.resolve(path) }));
      } }]
    });
  }
});

test('native compositions render with their copied defaults and no Storybook callbacks', async () => {
  for (const owner of owners) {
    const { PlaygroundDemo } = await loadComponent(new URL(`src/components/core/${owner}/stories/fixtures/NativeExamples.jsx`, root));
    const html = renderToStaticMarkup(createElement(PlaygroundDemo));
    assert.ok(html.length > 0, owner);
    assert.doesNotMatch(html, /(?:\bNaN\b|\bundefined\b)/, owner);
  }
});

test('copied input configuration examples use the public context entry', () => {
  const origin = new URL('src/components/core/Input/stories/fixtures/SmoothCaretExample.jsx', root);
  const source = publicSource(readFileSync(origin, 'utf8'), origin);
  assert.match(source, /from '@gaudi\/design-system\/context'/);
  assert.doesNotMatch(source, /from\s+['"]\./);
});
