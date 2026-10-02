import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));

test('Embed resolves each piece of content to the owner that renders it', () => {
  const { resolveEmbedType } = api;
  assert.equal(resolveEmbedType({ 'code': 'const a = 1;' }), 'code');
  assert.equal(resolveEmbedType({ 'html': '<p>hi</p>', 'url': 'https://preview.local' }), 'web');
  assert.equal(resolveEmbedType({ 'src': '/static/diagram.svg' }), 'image');
  assert.equal(resolveEmbedType({ 'url': 'https://youtu.be/abc' }), 'video');
  assert.equal(resolveEmbedType({ 'url': 'https://github.com/a/b' }), 'link');
  assert.equal(resolveEmbedType({ 'type': 'web', 'url': 'https://gaudi.dev' }), 'web');
  assert.equal(resolveEmbedType({ 'type': 'nonsense', 'url': 'https://gaudi.dev' }), 'link');
});

test('Embed renders through LinkPreview, WebPreview and component overrides on the server', () => {
  const Embed = api.default;
  const link = renderToStaticMarkup(createElement(Embed, { 'previewData': { 'title': 'Gaudi' }, 'url': 'https://gaudi.dev' }));
  assert.match(link, /data-type="link"/);
  assert.match(link, /data-slot="link-preview-card"/);
  assert.match(renderToStaticMarkup(createElement(Embed, { 'html': '<p>hi</p>', 'url': 'https://preview.local' })), /<iframe/);
  const image = renderToStaticMarkup(createElement(Embed, { 'alt': 'Diagram', 'src': '/static/diagram.svg' }));
  assert.match(image, /alt="Diagram"/);
  const Custom = ({ src, alt }) => createElement('figure', { 'data-custom': 'image' }, createElement('img', { alt, src }));
  assert.match(renderToStaticMarkup(createElement(Embed, { 'alt': 'Diagram', 'components': { 'image': Custom }, 'src': '/a.png' })), /data-custom="image"/);
  assert.match(renderToStaticMarkup(createElement(Embed, { 'title': 'Docs', 'url': 'https://gaudi.dev', 'variant': 'inline' })), /^<span data-slot="embed"/);
});
