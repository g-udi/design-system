import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../support/renderComponent.js';

const { SiteConfigProvider, useSiteConfig, defaultSiteConfig } = await loadComponent(new URL('../../src/context/index.js', import.meta.url));
let config;
function Consumer() {
  config = useSiteConfig();
  return null;
}

test('isolated site components have inert defaults and providers preserve prepared host data', () => {
  renderToStaticMarkup(h(Consumer));
  assert.equal(config, defaultSiteConfig);
  assert.equal(config.preview.endpoint, null);
  const links = [{ id: 0, label: '', href: '/zero' }];
  const resolveImage = () => '/local.png';
  renderToStaticMarkup(h(SiteConfigProvider, {
    metadata: { title: '', author: { name: 'Ada' } },
    navigation: { links },
    preview: { endpoint: '/preview', resolveImage }
  }, h(Consumer)));
  assert.equal(config.metadata.title, '');
  assert.equal(config.metadata.locale, 'en-US');
  assert.deepEqual(config.metadata.author, { name: 'Ada' });
  assert.equal(config.navigation.links, links);
  assert.equal(config.preview.resolveImage, resolveImage);
  assert.equal(config.preview.endpoint, '/preview');
  assert.equal(defaultSiteConfig.preview.endpoint, null);
});
