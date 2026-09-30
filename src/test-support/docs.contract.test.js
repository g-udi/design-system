import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getComponentDocs } from '../../.storybook/stories/componentDocumentation.js';
import { acceptsPreviewArgs, displayedPreviewArgs, previewArgTypes, selectPreviewStory } from '../../.storybook/stories/docsContract.js';
import { previewSource } from '../../.storybook/stories/previewSource.js';

test('every indexed component has specific documentation and a readable API reference', () => {
  const catalogue = JSON.parse(readFileSync(new URL('../../.storybook/fixtures/catalogue.json', import.meta.url)));
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

test('copyable preview source keeps quoted strings, arrays and complete prop expressions', () => {
  const source = previewSource('Input', {placeholder: 'Say "hello"', disabled: false, value: [1, 2], onChange: () => {}}, {imports: "import Input from '@gaudi/design-system/core/Input';"});
  assert.ok(source.includes('placeholder={"Say \\"hello\\""}'));
  assert.ok(source.includes('disabled={false}'));
  assert.ok(source.includes('value={[1,2]}'));
  assert.ok(!source.includes('onChange'));
});
