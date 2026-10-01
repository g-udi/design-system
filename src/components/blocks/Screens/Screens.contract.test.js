import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderComponent } from '../../../test-support/renderComponent.js';

test('Screen keeps the main column first and hides the aside below md', async () => {
  const html = await renderComponent(new URL('./Screen.jsx', import.meta.url), {
    aside: createElement('p', null, 'Quote'),
    asideSide: 'start',
    header: 'Logo',
    footer: 'Legal',
    children: createElement('form', { 'aria-label': 'Sign in' })
  });
  assert.ok(html.indexOf('<form') < html.indexOf('data-slot="screen-aside"'), 'the form precedes the aside in source order');
  assert.match(html, /data-slot="screen-aside"[^>]*class="[^"]*hidden[^"]*md:block[^"]*md:order-first/);
  assert.match(html, /data-slot="screen-header"[^>]*>Logo/);
  assert.match(html, /data-slot="screen-footer"[^>]*>Legal/);
  const bare = await renderComponent(new URL('./Screen.jsx', import.meta.url), { children: 'Form' });
  assert.doesNotMatch(bare, /screen-aside|md:grid-cols-2/);
});

test('ScreenTestimonial names each quote dot and marks the current one', async () => {
  const { loadComponent } = await import('../../../test-support/renderComponent.js');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { ScreenTestimonial } = await loadComponent(new URL('./Screen.jsx', import.meta.url));
  const html = renderToStaticMarkup(
    createElement(ScreenTestimonial, {
      quotes: [
        { quote: 'Fast.', name: 'Maya Lopez', role: 'Editor' },
        { quote: 'Calm.', name: 'Tom Becker', role: 'Engineer' }
      ]
    })
  );
  assert.match(html, /aria-label="Show quote from Maya Lopez"[^>]*aria-current="true"|aria-current="true"[^>]*aria-label="Show quote from Maya Lopez"/);
  assert.match(html, /aria-label="Show quote from Tom Becker"/);
  assert.match(html, /<blockquote/);
});
