import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { Hero } = await loadComponent(new URL('../../../../src/components/blocks/Hero/Hero.jsx', import.meta.url));

test('heroes have independent accessible section names and preserve heading hierarchy', () => {
  const html = renderToStaticMarkup(createElement('main', null,
    createElement(Hero, { title: 'First', headingAs: 'h1' }),
    createElement(Hero, { title: 'Second', headingAs: 'h2' })
  ));
  const labels = [...html.matchAll(/aria-labelledby="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(labels).size, 2);
  assert.ok(html.includes(`id="${labels[0]}"`));
  assert.ok(html.includes(`id="${labels[1]}"`));
  assert.match(html, /<h1[^>]*>First<\/h1>/);
  assert.match(html, /<h2[^>]*>Second<\/h2>/);
});

test('hero slots preserve semantic reading order and empty media does not reserve a column', () => {
  const html = renderToStaticMarkup(createElement(Hero, {
    title: 'Title', description: 'Description', actions: createElement('a', { href: '/start' }, 'Start'),
    media: createElement('img', { src: '/art.svg', alt: 'Artwork' })
  }, 'Support'));
  assert.ok(html.indexOf('Description') < html.indexOf('href="/start"'));
  assert.ok(html.indexOf('Support') < html.indexOf('alt="Artwork"'));
  const empty = renderToStaticMarkup(createElement(Hero, { title: 'Title', layout: 'split' }));
  assert.match(empty, /data-has-media="false"/);
  assert.doesNotMatch(empty, /data-slot="hero-media"/);
});

test('the eyebrow precedes the heading without joining the section name', () => {
  const html = renderToStaticMarkup(createElement(Hero, { eyebrow: 'New release', title: 'Title' }));
  assert.match(html, /data-slot="hero-eyebrow"[^>]*>New release<\/div><h1[^>]*>Title<\/h1>/);
  assert.doesNotMatch(renderToStaticMarkup(createElement(Hero, { title: 'Title' })), /hero-eyebrow/);
});
