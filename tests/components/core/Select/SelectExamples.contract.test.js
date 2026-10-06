import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const fixtures = ['autocomplete/autocomplete-input-options', 'combobox/combobox-input-options', 'combobox/combobox-grouped', 'combobox/combobox-multiple-chips', 'combobox/combobox-member-tags', 'native-select/native-select-fields', 'select/select-form-states', 'select/select-in-dialog', 'select/select-descriptions', 'select/select-rich-options', 'select/select-clearable', 'select/select-grouped'];

test('independent select examples keep labels and error descriptions associated with their own controls', async () => {
  for (const fixture of fixtures) {
    const { Pattern } = await loadComponent(new URL(`../../../../src/components/core/Select/stories/fixtures/${fixture}.jsx`, import.meta.url));
    const html = renderToStaticMarkup(createElement(Fragment, null, createElement(Pattern), createElement(Pattern)));
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, fixture);
    for (const [, target] of html.matchAll(/\bfor="([^"]+)"/g)) assert.ok(ids.includes(target), `${fixture}: ${target}`);
  }
});
