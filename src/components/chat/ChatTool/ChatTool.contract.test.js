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

test('A tool approval asks first, then reports the decision as a status', () => {
  const requested = render(api.MessageToolApproval, { name: 'publish_post', description: 'Publish the draft', input: { slug: 'drafts' }, allowAlways: true });
  assert.match(requested, /role="group"/);
  assert.match(requested, /Allow publish_post\?/);
  assert.match(requested, /data-state="requested"/);
  assert.match(requested, /Needs approval/);
  assert.match(requested, />Approve</);
  assert.match(requested, />Deny</);
  assert.match(requested, /role="checkbox"/);
  assert.match(requested, /Always allow publish_post/);
  const denied = render(api.MessageToolApproval, { name: 'publish_post', state: 'denied', reason: 'Not today.' });
  assert.doesNotMatch(denied, />Approve</);
  assert.match(denied, /role="status"[^>]*>.*Denied\. Nothing was run\./);
  assert.match(denied, /Not today\./);
  const executed = render(api.MessageToolApproval, { name: 'publish_post', state: 'executed' }, h('p', null, 'Published'));
  assert.match(executed, /data-status="done"/);
  assert.match(executed, /Published/);
  assert.deepEqual(api.approvalStates, ['requested', 'approved', 'denied', 'executed']);
});
