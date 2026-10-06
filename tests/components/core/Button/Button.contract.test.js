import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

import { buttonToneAliases, buttonToneClasses, buttonTones, canonicalButtonToneClasses } from '../../../../src/components/core/Button/buttonTones.js';

test('Button recommends only semantic tones', () => {
  assert.deepEqual(buttonTones, [ 'accent', 'attention', 'danger', 'discovery', 'info', 'neutral', 'success', 'warning' ]);
});

test('Button legacy hue names remain exact aliases of semantic tones', () => {
  for (const [ alias, tone ] of Object.entries(buttonToneAliases)) {
    assert.equal(buttonToneClasses[alias], canonicalButtonToneClasses[tone]);
  }
});

test('Button links reuse safe navigation for URL objects, mail and external destinations', async () => {
  const { default: Button } = await loadComponent(new URL('../../../../src/components/core/Button/Button.jsx', import.meta.url));
  const render = (href) => renderToStaticMarkup(createElement(Button, { href }, 'Open'));
  assert.match(render({ pathname: '/search', query: { q: 'design' } }), /href="\/search\?q=design"/);
  assert.match(render('mailto:hello@example.com'), /href="mailto:hello@example.com"/);
  assert.doesNotMatch(render('mailto:hello@example.com'), /target=/);
  assert.match(render('https://example.com'), /target="_blank"/);
  assert.doesNotMatch(render('javascript:alert(1)'), /href=/);
});
