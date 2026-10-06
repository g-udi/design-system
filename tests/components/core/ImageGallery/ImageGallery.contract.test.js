import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

test('gallery SSR reserves thumbnail dimensions and exposes named expansion buttons', async () => {
  const { ImageGallery } = await loadComponent(new URL('../../../../src/components/core/ImageGallery/index.js', import.meta.url));
  const render = props => renderToStaticMarkup(createElement(ImageGallery, props));
  const html = render({ images: [{ id: 'one', src: '/full.svg', thumbnailSrc: '/small.svg', alt: 'Study', caption: 'Figure one', width: 800, height: 600 }], disabled: true });
  assert.match(html, /data-single="true"/);
  assert.match(html, /aria-label="Open image: Study"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /src="\/small.svg"/);
  assert.match(html, /width="800" height="600" loading="lazy"/);
  assert.match(html, /<figcaption>Figure one<\/figcaption>/);
  assert.match(html, /disabled=""/);
  assert.doesNotMatch(html, /role="dialog"/);
  assert.match(render({ images: [] }), /No images to display/);
  assert.doesNotMatch(render({ images: [{ id: 'x', src: '/x.svg', alt: 'X', caption: 'Hidden' }], showCaptions: false }), /<figcaption>/);
});
