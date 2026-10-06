import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const publicAPI = await loadComponent(new URL('../../../../src/components/core/Gantt/index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../src/components/core/Gantt/stories/fixtures/gantt/gantt-settings-reordering.jsx', import.meta.url));

test('Gantt publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.Gantt, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});

test('Gantt dependency helpers validate moves and find the critical path', () => {
  const { checkDependencies, getCriticalPath } = publicAPI;
  const day = (n) => new Date(2026, 0, n);
  const tasks = [
    { id: 'plan', start: day(1), end: day(3) },
    { id: 'build', start: day(3), end: day(8), dependencies: ['plan'] },
    { id: 'docs', start: day(3), end: day(5), dependencies: ['plan'] },
    { id: 'ship', start: day(8), end: day(9), dependencies: ['build', 'docs'] }
  ];
  assert.deepEqual(getCriticalPath(tasks), ['plan', 'build', 'ship']);
  const withMilestone = [...tasks, { id: 'launch', start: day(9), end: day(9), dependencies: ['ship'] }];
  assert.deepEqual(getCriticalPath(withMilestone), ['plan', 'build', 'ship', 'launch']);
  assert.equal(checkDependencies({ event: tasks[1], start: day(4), end: day(8) }, tasks).ok, true);
  const early = checkDependencies({ event: tasks[1], start: day(2), end: day(7) }, tasks);
  assert.equal(early.ok, false);
  assert.deepEqual(early.blockedBy.map((t) => t.id), ['plan']);
  const late = checkDependencies({ event: tasks[2], start: day(4), end: day(9) }, tasks);
  assert.deepEqual(late.blocking.map((t) => t.id), ['ship']);
});

test('Gantt navigation composes host callbacks and honors cancellation', () => {
  for (const name of ['GanttNavToday', 'GanttNavPrev', 'GanttNavNext']) {
    for (const cancel of [false, true]) {
      let click;
      let hostCalls = 0;
      let dateChanges = 0;
      function CaptureButton(props) {
        click = props.onClick;
        return createElement('button', { type: 'button' }, 'Navigate');
      }
      renderToStaticMarkup(createElement(publicAPI.Gantt, {
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
