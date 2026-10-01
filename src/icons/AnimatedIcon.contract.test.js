import assert from 'node:assert/strict';
import test from 'node:test';
import { readdir } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../test-support/renderComponent.js';
import { observeIconActivity } from './animated/observeIconActivity.js';

const { AnimatedIcon, animatedIconRegistry, animatedIconMetadata } = await loadComponent(new URL('./AnimatedIcon.jsx', import.meta.url));
const { iconRegistry } = await loadComponent(new URL('./index.jsx', import.meta.url));

test('animated counterparts preserve Gaudi names and their original glyph family', () => {
  for (const [name, Glyph] of Object.entries(iconRegistry)) {
    if (!Glyph.displayName || !Glyph.render?.({}, null)?.props?.iconNode) continue;
    assert.ok(animatedIconRegistry[name], `Missing animated counterpart: ${name}`);
    assert.equal(animatedIconMetadata[name].canonical, Glyph.displayName);
  }
  assert.equal(animatedIconMetadata.Calendar.canonical, 'CalendarDays');
  assert.equal(animatedIconMetadata.CalendarOutline.canonical, 'Calendar');
  assert.equal(animatedIconMetadata.Link.canonical, 'Link');
  assert.equal(animatedIconMetadata.Link2.canonical, 'Link2');
  assert.equal(animatedIconMetadata.MailOutline.canonical, 'Mail');
});

test('server rendering starts still and supports Gaudi tokens and explicit dimensions', () => {
  const token = renderToStaticMarkup(createElement(AnimatedIcon, { name: 'Rocket', active: true, size: 'lg', color: 'success' }));
  assert.match(token, /data-animated-icon-active="false"/);
  assert.match(token, /size-6/);
  assert.match(token, /text-green-600/);
  const numeric = renderToStaticMarkup(createElement(AnimatedIcon, { name: 'Rocket', size: 32, strokeWidth: 1.5 }));
  assert.match(numeric, /width="32" height="32"/);
  assert.match(numeric, /stroke-width="1.5"/);
  assert.doesNotMatch(numeric, /h-5 w-5/);
});

test('non-animated brand artwork remains available and unknown names are harmless', () => {
  const brand = renderToStaticMarkup(createElement(AnimatedIcon, { name: 'Github', active: true }));
  assert.match(brand, /<svg/);
  assert.doesNotMatch(brand, /data-animated-icon/);
  assert.equal(renderToStaticMarkup(createElement(AnimatedIcon, { name: 'NotAnIcon' })), '');
});

test('every imported artwork module renders real SVG geometry at rest', async () => {
  const files = (await readdir(new URL('./animated/catalog/', import.meta.url))).filter((file) => file.endsWith('.jsx'));
  for (const file of files) {
    const { default: Artwork } = await loadComponent(new URL(`./animated/catalog/${file}`, import.meta.url));
    const html = renderToStaticMarkup(createElement('svg', null, createElement(Artwork, { active: false })));
    assert.match(html, /<(path|circle|rect|line|polyline|polygon|ellipse)\b/, `Empty artwork: ${file}`);
  }
});

function environment({ reduced = false, intersection = true, legacy = false } = {}) {
  const documentListeners = new Set();
  const mediaListeners = new Set();
  let callback;
  const observed = new Set();
  let disconnected = 0;
  let constructed = 0;
  const media = { matches: reduced };
  media[legacy ? 'addListener' : 'addEventListener'] = (...args) => mediaListeners.add(args.at(-1));
  media[legacy ? 'removeListener' : 'removeEventListener'] = (...args) => mediaListeners.delete(args.at(-1));
  const doc = {
    visibilityState: 'visible',
    addEventListener: (_event, listener) => documentListeners.add(listener),
    removeEventListener: (_event, listener) => documentListeners.delete(listener),
    defaultView: {
      matchMedia: () => media,
      ...(intersection ? { IntersectionObserver: class {
        constructor(listener) { callback = listener; constructed += 1; }
        observe(node) { observed.add(node); }
        unobserve(node) { observed.delete(node); }
        disconnect() { disconnected += 1; observed.clear(); }
      } } : {})
    }
  };
  return {
    doc, media, observed, documentListeners, mediaListeners,
    get constructed() { return constructed; },
    get disconnected() { return disconnected; },
    intersect: (node, isIntersecting) => callback([{ target: node, isIntersecting }]),
    motion: (value) => { media.matches = value; mediaListeners.forEach((notify) => notify()); },
    visibility: (value) => { doc.visibilityState = value; documentListeners.forEach((notify) => notify()); }
  };
}

test('motion follows visibility, live reduced-motion changes, and re-entry', () => {
  const env = environment();
  const node = { ownerDocument: env.doc };
  const states = [];
  const cleanup = observeIconActivity(node, (value) => states.push(value));
  assert.equal(states.at(-1), false);
  env.intersect(node, true);
  assert.equal(states.at(-1), true);
  env.motion(true);
  assert.equal(states.at(-1), false);
  env.motion(false);
  assert.equal(states.at(-1), true);
  env.visibility('hidden');
  assert.equal(states.at(-1), false);
  env.visibility('visible');
  assert.equal(states.at(-1), true);
  env.intersect(node, false);
  assert.equal(states.at(-1), false);
  env.intersect(node, true);
  assert.equal(states.at(-1), true);
  cleanup();
  const count = states.length;
  env.intersect(node, true);
  assert.equal(states.length, count);
  assert.equal(env.disconnected, 1);
  assert.equal(env.documentListeners.size, 0);
  assert.equal(env.mediaListeners.size, 0);
});

test('many icons share one observer and release it after the last unmount', () => {
  const env = environment();
  const first = { ownerDocument: env.doc }, second = { ownerDocument: env.doc };
  const a = observeIconActivity(first, () => {});
  const b = observeIconActivity(second, () => {});
  assert.equal(env.constructed, 1);
  assert.equal(env.documentListeners.size, 1);
  assert.equal(env.mediaListeners.size, 1);
  a();
  assert.equal(env.disconnected, 0);
  assert.equal(env.observed.size, 1);
  b();
  assert.equal(env.disconnected, 1);
});

test('missing IntersectionObserver and legacy media listeners retain motion controls', () => {
  const env = environment({ intersection: false, legacy: true, reduced: true });
  let active;
  const cleanup = observeIconActivity({ ownerDocument: env.doc }, (value) => { active = value; });
  assert.equal(active, false);
  env.motion(false);
  assert.equal(active, true);
  env.visibility('hidden');
  assert.equal(active, false);
  cleanup();
  assert.equal(env.mediaListeners.size, 0);
});
