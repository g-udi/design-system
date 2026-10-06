import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
import { readingProgress } from '../../../../src/components/core/ReadingIndicator/readingProgress.js';

test('reading ranges clamp overscroll, skip unrelated content and handle short documents', () => {
  assert.equal(readingProgress(-10, 0, 400), 0);
  assert.equal(readingProgress(200, 0, 400), 50);
  assert.equal(readingProgress(900, 100, 500), 100);
  assert.equal(readingProgress(50, 100, 500), 0);
  assert.equal(readingProgress(300, 100, 500), 50);
  assert.equal(readingProgress(0, 0, 0), 100);
  assert.equal(readingProgress(0, 100, 50), 0);
  assert.equal(readingProgress(100, 100, 50), 100);
  assert.equal(readingProgress(NaN, 0, 400), 0);
});

test('all reading styles expose one named determinate progressbar during SSR', async () => {
  const { ReadingIndicator } = await loadComponent(new URL('../../../../src/components/core/ReadingIndicator/index.js', import.meta.url));
  for (const variant of ['bar', 'ruler', 'ring']) {
    const html = renderToStaticMarkup(createElement(ReadingIndicator, { variant, label: 'Article progress' }));
    assert.equal((html.match(/role="progressbar"/g) ?? []).length, 1);
    assert.match(html, /aria-label="Article progress"/);
    assert.match(html, /aria-valuenow="0"/);
    assert.doesNotMatch(html, /aria-live|tabindex|NaN/);
    for (const [value, expected] of [[145, 100], [-5, 0], [Infinity, 0], [NaN, 0], [0, 0], [62.5, 62.5]]) {
      const controlled = renderToStaticMarkup(createElement(ReadingIndicator, { variant, value }));
      assert.match(controlled, new RegExp(`aria-valuenow="${expected}"`));
    }
  }
});

test('only a positioned draggable ring adds a keyboard handle', async () => {
  const { ReadingIndicator } = await loadComponent(new URL('../../../../src/components/core/ReadingIndicator/index.js', import.meta.url));
  const render = props => renderToStaticMarkup(createElement(ReadingIndicator, props));
  assert.match(render({ variant: 'ring', draggable: true }), /aria-label="Move reading indicator"/);
  assert.doesNotMatch(render({ variant: 'ring', draggable: true, position: 'inline' }), /Move reading indicator/);
  assert.doesNotMatch(render({ variant: 'ruler', draggable: true }), /Move reading indicator/);
});
