import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';

import formatDate from '../../../src/utilities/formatDate/formatDate.js';

test('formatDate returns an empty string for missing or invalid input', () => {
  assert.equal(formatDate(), '');
  assert.equal(formatDate('not-a-date'), '');
});

test('formatDate falls back to the default locale when locale input is invalid', () => {
  assert.equal(formatDate(new Date(2024, 0, 15), 'not_a_locale'), 'January 15, 2024');
});

test('calendar dates preserve their day in western and eastern timezones', () => {
  const module = new URL('../../../src/utilities/formatDate/formatDate.js', import.meta.url).href;
  for (const TZ of ['America/Los_Angeles', 'Asia/Tokyo']) {
    const output = execFileSync(process.execPath, ['--input-type=module', '-e', `import formatDate from ${JSON.stringify(module)}; console.log(formatDate('2023-12-25')); console.log(formatDate('2023-12-25', 'not_a_locale'));`], { env: { ...process.env, TZ }, encoding: 'utf8' });
    assert.equal(output.trim(), 'December 25, 2023\nDecember 25, 2023');
  }
});
