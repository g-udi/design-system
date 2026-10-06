import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const publicAPI = await loadComponent(new URL('../../../../src/components/core/Calendar/index.js', import.meta.url));
const example = await loadComponent(new URL('../../../../src/components/core/Calendar/stories/fixtures/calendar/calendar-selection-options.jsx', import.meta.url));

test('Calendar publishes its composition and supports server rendering', () => {
  assert.ok(publicAPI.Calendar, 'The documented public entry must stay available');
  const html = renderToStaticMarkup(createElement(example.Pattern));
  assert.ok(html.length > 0, 'The example must render useful server markup');
  assert.doesNotMatch(html, /\[object Object\]/);
});

test('DateSelector uses the requested year window and preserves explicit bounds', () => {
  const years = (props) => {
    const html = renderToStaticMarkup(createElement(publicAPI.DateSelector, {
      defaultPeriodType: 'year',
      baseYear: 2035,
      yearRange: 3,
      ...props
    }));
    return [...html.matchAll(/>(\d{4})<\/button>/g)].map((match) => Number(match[1]));
  };
  assert.deepEqual(years(), [2034, 2035, 2036]);
  assert.deepEqual(years({ minYear: 2020, maxYear: 2022 }), [2020, 2021, 2022]);
});
