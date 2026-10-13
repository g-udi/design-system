import assert from 'node:assert/strict';
import test from 'node:test';
import { escapeHtml } from '../../../src/utilities/escapeHtml.js';

test('escapeHtml escapes markup and quote characters', () => {
  assert.equal(escapeHtml(`<b class="x">Tom & Jerry's</b>`), '&lt;b class=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/b&gt;');
});

test('escapeHtml prints empty values as empty text and other values as strings', () => {
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
  assert.equal(escapeHtml(0), '0');
});
