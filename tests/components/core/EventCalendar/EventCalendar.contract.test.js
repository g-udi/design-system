import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const publicAPI = await loadComponent(new URL('../../../../src/components/core/EventCalendar/index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../src/components/core/EventCalendar/stories/fixtures/event-calendar/event-calendar-all-views.jsx', import.meta.url));

test('EventCalendar publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.EventCalendar, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});

const { expandRecurrence, parseRRuleString } = await loadComponent(new URL('../../../../src/components/core/EventCalendar/eventCalendarRecurrence.jsx', import.meta.url));
test('recurring appointments preserve local time across a daylight-saving change', () => {
  const occurrences = expandRecurrence({ id: 'standup', start: new Date('2026-03-28T09:00:00Z'), end: new Date('2026-03-28T10:00:00Z'), recurrence: { freq: 'daily', count: 3 } },
    { start: new Date('2026-03-28T00:00:00Z'), end: new Date('2026-04-01T00:00:00Z') }, { timeZone: 'Europe/London' });
  assert.deepEqual(occurrences.map((item) => item.start.toISOString()), ['2026-03-28T09:00:00.000Z', '2026-03-29T08:00:00.000Z', '2026-03-30T08:00:00.000Z']);
  assert.throws(() => parseRRuleString('FREQ=MINUTELY;COUNT=3'));
});

test('EventCalendar navigation composes host callbacks and honors cancellation', () => {
  for (const name of ['EventCalendarNavToday', 'EventCalendarNavPrev', 'EventCalendarNavNext']) {
    for (const cancel of [false, true]) {
      let click;
      let hostCalls = 0;
      let dateChanges = 0;
      function CaptureButton(props) {
        click = props.onClick;
        return createElement('button', { type: 'button' }, 'Navigate');
      }
      renderToStaticMarkup(createElement(publicAPI.EventCalendar, {
        defaultDate: new Date(2000, 0, 15),
        onDateChange: () => { dateChanges += 1; }
      }, createElement(publicAPI[name], {
        asChild: true,
        tooltip: null,
        onClick: (event) => { hostCalls += 1; if (cancel) event.preventDefault(); }
      }, createElement(CaptureButton))));
      click(new Event('click', { cancelable: true }));
      assert.equal(hostCalls, 1, name);
      assert.equal(dateChanges, cancel ? 0 : 1, `${name} navigation respects host cancellation`);
    }
  }
});

test('milestones at the visible boundary survive native and custom recurrence expansion', () => {
  const start = new Date('2026-06-15T00:00:00Z');
  const end = new Date('2026-06-16T00:00:00Z');
  const milestone = { id: 'milestone', start, end: start, recurrence: { freq: 'daily' } };
  assert.equal(expandRecurrence(milestone, { start, end }, { timeZone: 'UTC' }).length, 1);
  const index = publicAPI.buildEventIndex([milestone], { start, end }, {
    timeZone: 'UTC', weekStartsOn: 1,
    getOccurrences: () => [{ start, end: start }, { start: end, end }]
  });
  assert.equal(index.occurrences.length, 1);
  assert.equal(index.byDay.get('2026-06-15').timed.length, 1);
  assert.equal(publicAPI.eventsOverlap({ start, end: start }, { start, end }), true);
});

test('agenda headings honor localized formats and custom rendering', () => {
  const day = new Date('2026-06-15T09:00:00Z');
  const props = { defaultDate: day, defaultView: 'agenda', timeZone: 'UTC', defaultEvents: [{ id: 'meeting', title: 'Meeting', start: day, end: new Date('2026-06-15T10:00:00Z') }] };
  const render = overrides => renderToStaticMarkup(createElement(publicAPI.EventCalendar, { ...props, ...overrides }, createElement(publicAPI.EventCalendarContent)));
  assert.match(render({ i18n: { formats: { agendaWeekday: "'Regional weekday'", agendaDayHeader: "'Regional date'" } } }), /Regional weekday/);
  assert.match(render({ renderAgendaDayHeader: ({ segments }) => `Custom heading with ${segments.length} meeting` }), /Custom heading with 1 meeting/);
});
