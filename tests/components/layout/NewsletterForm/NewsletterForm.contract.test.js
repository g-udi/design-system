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
