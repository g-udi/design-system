import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../test-support/renderComponent.js';

const publicAPI = await loadComponent(new URL('./index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../.storybook/fixtures/reui/event-calendar/c-event-calendar-1.jsx', import.meta.url));

test('EventCalendar publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.EventCalendar, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});

const { expandRecurrence, parseRRuleString } = await loadComponent(new URL('./parts/event-calendar-recurrence-extended.jsx', import.meta.url));
test('recurring appointments preserve local time across a daylight-saving change', () => {
  const occurrences = expandRecurrence({ id: 'standup', start: new Date('2026-03-28T09:00:00Z'), end: new Date('2026-03-28T10:00:00Z'), recurrence: { freq: 'daily', count: 3 } },
    { start: new Date('2026-03-28T00:00:00Z'), end: new Date('2026-04-01T00:00:00Z') }, { timeZone: 'Europe/London' });
  assert.deepEqual(occurrences.map((item) => item.start.toISOString()), ['2026-03-28T09:00:00.000Z', '2026-03-29T08:00:00.000Z', '2026-03-30T08:00:00.000Z']);
  assert.throws(() => parseRRuleString('FREQ=MINUTELY;COUNT=3'));
});
