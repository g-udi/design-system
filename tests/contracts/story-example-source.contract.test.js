import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { build } from 'esbuild';
import { parser } from 'storybook/internal/babel';
import { storyExamples, storyExampleSourcePlugin } from '../../.storybook/storyExampleSource.js';
import { setFallbackSource } from '../../src/docs/components/previewSource.js';

async function generate(owner) {
  const file = fileURLToPath(new URL(`../../src/components/${owner}`, import.meta.url));
  const { examples } = await storyExamples(await readFile(file, 'utf8'), file);
  return examples;
}

test('Docs fallback copies the JSX, its fixture dependencies and CSS with public imports', async () => {
  const examples = await generate('blocks/AppShell/stories/AppShell.stories.jsx');
  const story = { parameters: { docs: { description: { story: 'Loading layouts' } } } };
  setFallbackSource(story, {}, examples.get('LoadingLayouts'));
  const initialArgs = { preset: 'dashboard', animated: false };
  const code = story.parameters.docs.source.transform('', { args: { ...initialArgs, preset: 'board' }, initialArgs });
  assert.match(code, /function AppShellPlaceholderGrid\b/);
  assert.match(code, /@gaudi\/design-system\/core\/Skeleton/);
  assert.match(code, /<style>\{styles\}<\/style>/);
  assert.match(code, /ds-app-shell-placeholder-grid/);
  assert.match(code, /"preset": "board"/);
  assert.doesNotMatch(code, /__gaudiEditedProps|from ['"]\.|storybook\/test|\bplay:\s*async/);
  assert.doesNotThrow(() => parser.parse(code, { sourceType: 'module', plugins: ['jsx'] }));
  assert.ok(story.parameters.docs.description);
});

test('Docs fallback preserves authored and inherited sources and inlines the real callback defaults', async () => {
  const examples = await generate('core/Accordion/stories/Accordion.stories.jsx');
  assert.equal(examples.has('Playground'), false);
  const example = examples.get('Controlled');
  const authored = { code: 'An authored source' };
  const inherited = {};
  setFallbackSource(inherited, { parameters: { docs: { source: authored } } }, example);
  assert.equal(inherited.parameters, undefined);
  const story = {};
  setFallbackSource(story, {}, example);
  const args = { onValueChange: () => {} };
  const code = story.parameters.docs.source.transform('', { args, initialArgs: args });
  assert.match(code, /function ControlledExample\b/);
  assert.match(code, /const items|var items/);
  assert.match(code, /@gaudi\/design-system\/core\/Accordion/);
  assert.doesNotMatch(code, /\bfn\(|storybook\/test|__gaudiEditedProps/);
});

test('Vite copies original JSX after Storybook has compiled the module and assigned originalSource', async () => {
  const file = fileURLToPath(new URL('../../src/components/core/RadioGroup/stories/RadioGroup.stories.jsx', import.meta.url));
  const compiled = `
    export default { title: 'Core/RadioGroup' };
    export const Controlled = { render: () => null };
    Controlled.parameters = { docs: { source: { originalSource: 'serialized CSF' } } };
  `;
  const { code } = await storyExampleSourcePlugin().transform.call({ addWatchFile() {} }, compiled, file);
  const result = await build({
    stdin: { contents: code, resolveDir: dirname(file) }, bundle: true, write: false, format: 'esm'
  });
  const module = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
  const copy = module.Controlled.parameters.docs.source.transform('', {});
  assert.match(copy, /<RadioGroup\b/);
  assert.match(copy, /@gaudi\/design-system\/core\/RadioGroup/);
  assert.match(copy, /Reset to weekly/);
  assert.doesNotMatch(copy, /serialized CSF|jsx-runtime|__gaudiEditedProps/);
});
