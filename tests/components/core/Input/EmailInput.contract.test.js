import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { EmailInput } = await loadComponent(new URL('../../../../src/components/core/Input/index.js', import.meta.url));
const render = (props = {}) => renderToStaticMarkup(createElement(EmailInput, props));
const getPattern = (props) => render(props).match(/pattern="([^"]+)"/)[1]
  .replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const matches = (props, value) => new RegExp(`^(?:${getPattern(props)})$`, 'v').test(value);

test('EmailInput renders one native text editor with email semantics and form attributes on the server', () => {
  const html = render({ name: 'email', form: 'profile', required: true, defaultValue: 'amira@example.com', caretMode: 'smooth', 'aria-label': 'Email', maxLength: 254 });
  assert.equal((html.match(/<input\b/g) || []).length, 1);
  for (const attribute of ['type="text"', 'inputMode="email"', 'autoComplete="email"', 'autoCapitalize="none"', 'spellCheck="false"', 'name="email"', 'form="profile"', 'required=""', 'value="amira@example.com"', 'maxLength="254"', 'aria-label="Email"']) {
    assert.ok(html.includes(attribute), attribute);
  }
  assert.doesNotMatch(html, /caretMode|data-smooth-caret-active/);
});

test('EmailInput pattern accepts the HTML single-address grammar and rejects malformed values', () => {
  for (const email of ['a@b', 'amira+news@example.co.uk', 'A.B@example.COM', "a!#$%&'*+/=?^_`{|}~-@example.com", 'user@xn--bcher-kva.example']) {
    assert.ok(matches({}, email), email);
  }
  for (const email of ['hello', '@example.com', 'a@', 'a@@example.com', 'a@-example.com', 'a@example-.com', 'a@exa_mple.com', 'a@example..com', ' a@example.com', 'a@example.com ', 'a@example.com,b@example.com', `a@${'b'.repeat(64)}.com`]) {
    assert.equal(matches({}, email), false, email);
  }
});

test('EmailInput adds host patterns without disabling email validation', () => {
  assert.ok(matches({ pattern: '.+@example\\.com' }, 'a@example.com'));
  assert.equal(matches({ pattern: '.+@example\\.com' }, 'a@elsewhere.com'), false);
  assert.equal(matches({ pattern: '.*' }, 'not-an-email'), false);
  assert.equal(matches({ pattern: '' }, 'a@example.com'), false);
  assert.ok(matches({ pattern: '[' }, 'a@example.com'));
  assert.equal(matches({ pattern: '[' }, 'not-an-email'), false);
  const html = render({ type: 'email', inputMode: 'numeric', multiple: true, autoComplete: 'off' });
  assert.match(html, /type="text"/);
  assert.match(html, /inputMode="email"/);
  assert.match(html, /autoComplete="off"/);
  assert.doesNotMatch(html, /multiple=/);
});
