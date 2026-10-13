import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

const component = new URL('../../../../src/components/layout/NewsletterForm/index.js', import.meta.url);

test('NewsletterForm requires an explicit host endpoint before signup is available', async () => {
  const unconfigured = await renderComponent(component);
  assert.match(unconfigured, /<button[^>]*disabled=""/);
  assert.match(unconfigured, /Newsletter sign-up is currently unavailable/);
  const configured = await renderComponent(component, { endpoint: '/api/newsletter' });
  assert.doesNotMatch(configured, /<button[^>]*disabled=/);
  assert.doesNotMatch(configured, /currently unavailable/);
  assert.match(configured, /type="text"/);
});


test('NewsletterForm adapts its copy and heading level while retaining one labelled form', async () => {
  const html = await renderComponent(component, {
    title: 'Journal notes', description: 'Ideas worth sharing.', headingAs: 'h2', titleVariant: 'heading-xl', children: 'Read our privacy notice.'
  });
  assert.match(html, /<h2[^>]*>Journal notes<\/h2>/);
  assert.match(html, /Ideas worth sharing/);
  assert.match(html, /aria-label="Newsletter signup"/);
  assert.match(html, /Read our privacy notice/);
  const compact = await renderComponent(component, { title: null, description: null });
  assert.doesNotMatch(compact, /<h3|Get new articles/);
  assert.match(compact, /Email address/);
});
