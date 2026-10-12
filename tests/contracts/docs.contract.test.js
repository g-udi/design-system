import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { ownerDocumentation } from '../../src/docs/catalogue/component-docs.js';
import { getComponentDocs } from '../../src/docs/components/componentDocumentation.js';
import { acceptsPreviewArgs, displayedPreviewArgs, docsArgTypes, previewArgTypes, selectPreviewStory } from '../../src/docs/components/docsContract.js';
import { previewSource } from '../../src/docs/components/previewSource.js';
import { loadComponent } from '../support/renderComponent.js';

const { publicSource } = await loadComponent(new URL('../../src/docs/components/PatternStoryHelpers.jsx', import.meta.url));
const require = createRequire(import.meta.url);

test('authored React usage examples compile against supported public package exports', async () => {
  // Markdown syntax is consumed by the host's MDX pipeline. React usage must be
  // valid JSX and cannot rely on private source aliases or unsupported exports.
  const examples = Object.entries(ownerDocumentation).filter(([title]) => !title.startsWith('MDX/'));
  const root = fileURLToPath(new URL('../..', import.meta.url));
  await build({
    stdin: { contents: examples.map((_, i) => `import 'documentation:${i}';`).join('\n'), resolveDir: root },
    bundle: true, write: false, platform: 'browser', format: 'esm', jsx: 'automatic', packages: 'external',
    loader: { '.js': 'jsx', '.css': 'empty', '.module.css': 'empty' }, logLevel: 'silent', treeShaking: false,
    plugins: [{
      name: 'authored-documentation',
      setup(builder) {
        builder.onResolve({ filter: /^documentation:/ }, ({ path }) => ({ path: path.slice(14), namespace: 'documentation' }));
        builder.onLoad({ filter: /.*/, namespace: 'documentation' }, ({ path }) => {
          const [title, docs] = examples[Number(path)];
          assert.doesNotMatch(docs.usage, /(?:from\s+|import\s*\()\s*['"]\./, `${title}: private relative import`);
          return { contents: docs.usage, loader: 'jsx', resolveDir: root };
        });
        builder.onResolve({ filter: /^@gaudi\/design-system(?:\/|$)/ }, ({ path }) => ({ path: require.resolve(path) }));
      }
    }]
  });
});

test('every indexed component has specific documentation and a readable API reference', () => {
  const catalogue = JSON.parse(readFileSync(new URL('../../src/docs/catalogue/catalogue.json', import.meta.url)));
  for (const entry of Object.values(catalogue.entries).filter(entry => entry.type === 'docs')) {
    const docs = getComponentDocs(entry.title);
    assert.ok(docs.description && docs.accessibility && docs.usage, entry.title);
    assert.ok(docs.props?.length, `${entry.title}: missing API reference`);
    for (const row of docs.props) {
      assert.equal(row.length, 4, `${entry.title}: malformed prop row`);
      assert.ok(row.every(value => typeof value === 'string' && value.length), `${entry.title}: empty prop metadata`);
      assert.notEqual(row[1], 'unknown', entry.title);
    }
  }
});

test('fixed examples cannot receive inert controls and a playground takes priority', () => {
  const base = {tags: ['autodocs'], parameters: {}, originalStoryFn: () => null};
  const fixed = {...base, name: 'All variants'};
  const primary = {...base, name: 'Primary', originalStoryFn: args => args};
  const playground = {...primary, name: 'Playground'};
  assert.equal(acceptsPreviewArgs(fixed), false);
  assert.equal(selectPreviewStory([fixed, primary, playground]), playground);
  assert.equal(selectPreviewStory([fixed, primary]), primary);
});

test('preview controls preserve defaults and exclude callbacks and read-only values', () => {
  const rows = previewArgTypes({initialArgs: {}, argTypes: {
    disabled: {control: {type: 'object'}, type: {name: 'unknown'}, table: {defaultValue: {summary: 'false'}}},
    onChange: {control: {type: 'object'}, type: {name: 'unknown'}},
    items: {control: 'object', table: {readonly: true}}
  }});
  assert.deepEqual(Object.keys(rows), ['disabled']);
  assert.equal(rows.disabled.control.type, 'boolean');
  assert.deepEqual(displayedPreviewArgs(rows, {}), {disabled: false});
  assert.deepEqual(displayedPreviewArgs(rows, {disabled: true}), {disabled: true});
});

test('effect radius remains editable while corner presets use the global toolbar', () => {
  const glyph = getComponentDocs('Animations/Text/GlyphInspector');
  const radius = docsArgTypes(glyph, {radius: 'number'}).radius;
  assert.equal(radius.control, 'number');
  assert.match(radius.description, /Area reveal radius/);
  const card = getComponentDocs('Core/Card');
  assert.equal(docsArgTypes(card, {radius: ['none', 'sm', 'md', 'lg']}).radius.control, false);
});

test('copyable preview source keeps quoted strings, arrays and complete prop expressions', () => {
  const source = previewSource('Input', {placeholder: 'Say "hello"', disabled: false, value: [1, 2], onChange: () => {}}, {imports: "import Input from '@gaudi/design-system/core/Input';"});
  assert.ok(source.includes('placeholder={"Say \\"hello\\""}'));
  assert.ok(source.includes('disabled={false}'));
  assert.ok(source.includes('value={[1,2]}'));
  assert.ok(!source.includes('onChange'));
});

test('copyable preview source preserves JSX-sensitive text as a string', () => {
  const children = '11$^{th}$ < 12 &amp; \\u00e9';
  const source = previewSource('LatexText', { children });
  assert.ok(source.includes(`{${JSON.stringify(children)}}`));
});

test('copyable fixture source resolves named and default imports from their owner', () => {
  const origin = 'src/components/core/Button/stories/fixtures/button/button-icons-loading.jsx';
  const source = publicSource("import Button, { buttonVariants } from '../../../index.js';", origin);
  assert.match(source, /import Button,\s*\{\s*buttonVariants\s*\}\s*from ['"]@gaudi\/design-system\/core\/Button['"]/);
  assert.doesNotMatch(source, /\.\.\/|src\/components|\/stories\/|\/fixtures\//);
});

test('copyable fixture source preserves public Root aliases and local binding names', () => {
  const origin = new URL('../../src/components/core/Banner/stories/fixtures/alert/alert-variants.jsx', import.meta.url);
  const source = publicSource("import { Alert as AlertRoot, AlertTitle as Heading } from '../../../AlertPrimitives.jsx';", origin);
  assert.match(source, /import\s*\{\s*AlertRoot,\s*AlertTitlePrimitive as Heading\s*\}\s*from ['"]@gaudi\/design-system\/core\/Banner['"]/);
  assert.doesNotMatch(source, /\.\.\/|AlertPrimitives\.jsx|src\/components|\/stories\/|\/fixtures\//);
});

test('copyable fixture source keeps lazy charts on their public entrypoint', () => {
  const origin = 'src/components/blocks/Dashboard/stories/fixtures/dashboard/dashboard-operations-capacity.jsx';
  const source = publicSource("const chart = import('../../../../../charts/BarChart/index.js');", origin);
  assert.match(source, /import\(['"]@gaudi\/design-system\/charts\/BarChart['"]\)/);
  assert.doesNotMatch(source, /\.\.\/|index\.js|src\/components|\/stories\/|\/fixtures\//);
});

test('copyable fixtures resolve category barrels through their supported entrypoints', () => {
  const origin = 'src/components/chat/ChatInput/stories/fixtures/Composer.jsx';
  const source = publicSource("import { ChatInput } from '../../../index.js';", origin);
  assert.equal(source, "import { ChatInput } from '@gaudi/design-system/chat';");
});

test('native composed examples include their data and compile through public imports', async () => {
  const fixtures = [
    'core/Direction/stories/fixtures/DirectionExample.jsx',
    'mdx/CitationPopover/stories/fixtures/CitationExample.jsx',
    'mdx/CitationTracker/stories/fixtures/CitationTrackerExample.jsx',
    'mdx/Footnote/stories/fixtures/FootnoteExample.jsx',
    'mdx/Table/stories/fixtures/TableExample.jsx',
    'mdx/Table/stories/fixtures/HeaderConsistency.jsx'
  ];
  const root = fileURLToPath(new URL('../..', import.meta.url));
  for (const fixture of fixtures) {
    const origin = new URL(`../../src/components/${fixture}`, import.meta.url);
    const source = publicSource(readFileSync(origin, 'utf8'), origin);
    assert.match(source, /@gaudi\/design-system\//, fixture);
    assert.doesNotMatch(source, /(?:from\s+|import\s*\()\s*['"]\.|storybook\/test|parameters:\s*\{|play:\s*async/, fixture);
    await build({
      stdin: { contents: source, loader: 'jsx', resolveDir: root },
      bundle: true, write: false, platform: 'browser', format: 'esm', jsx: 'automatic', packages: 'external',
      loader: { '.js': 'jsx', '.css': 'empty', '.module.css': 'empty' }, logLevel: 'silent', treeShaking: false,
      plugins: [{
        name: 'native-example-public-imports',
        setup(builder) {
          builder.onResolve({ filter: /^@gaudi\/design-system(?:\/|$)/ }, ({ path }) => ({ path: require.resolve(path) }));
        }
      }]
    });
  }
});
