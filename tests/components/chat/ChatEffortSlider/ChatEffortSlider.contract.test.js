import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const api = await loadComponent(new URL('../../../../src/components/chat/ChatEffortSlider/index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('Effort is a named slider that announces the level, not a number', () => {
  const html = render(api.ChatEffortSlider, { defaultValue: 'high' });
  assert.match(html, /role="slider"/);
  assert.match(html, /aria-label="Effort"/);
  assert.match(html, /aria-valuetext="High effort"/);
  assert.match(html, /Thinks longer before it answers/);
  assert.doesNotMatch(render(api.ChatEffortSlider, { compact: true }), /Thinks longer/);
  assert.deepEqual(api.chatEffortLevels.map((level) => level.value), ['low', 'medium', 'high', 'max']);
});
