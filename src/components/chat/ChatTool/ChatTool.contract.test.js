import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const api = await loadComponent(new URL('./index.js', import.meta.url));
const render = (Component, props, ...children) => renderToStaticMarkup(h(Component, props, ...children));

test('A tool call carries its status, and a failed call opens with the error and a retry', () => {
  const failed = render(api.MessageTool, { name: 'schedule_newsletter', status: 'failed', error: 'Timed out.', onRetry: () => {} });
  assert.match(failed, /data-status="failed"/);
  assert.match(failed, /role="alert"/);
  assert.match(failed, /Retry/);
  const data = render(api.MessageData, { label: 'Totals', value: { opens: 10, clicks: 4 } });
  assert.match(data, /Totals/);
  assert.match(data, /<dt[^>]*>Opens<\/dt>/);
});
