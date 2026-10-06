import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

test('the Breadcrumb part names its landmark through label, defaulting to breadcrumb', async () => {
  const { Breadcrumb } = await loadComponent(new URL('../../../../src/components/core/Breadcrumb/BreadcrumbPrimitives.jsx', import.meta.url));
  assert.match(renderToStaticMarkup(createElement(Breadcrumb)), /<nav aria-label="breadcrumb"/);
  assert.match(renderToStaticMarkup(createElement(Breadcrumb, { label: 'Fil d’Ariane' })), /<nav aria-label="Fil d’Ariane"/);
});
