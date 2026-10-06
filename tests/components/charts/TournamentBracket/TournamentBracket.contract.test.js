import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { TournamentBracket } = await loadComponent(new URL('../../../../src/components/charts/TournamentBracket/index.js', import.meta.url));
const render = (props) => renderToStaticMarkup(createElement(TournamentBracket, props));
test('the bracket preserves explicit zero scores, penalties and winners without inferring advancement', () => {
  const rounds = [{ id: 'final', name: 'Final', matches: [{ id: 'f1', home: { name: 'North', score: 0, penalties: 0 }, away: null, winner: 'home' }] }];
  const html = render({ rounds });
  assert.match(html, /Final: North versus To be decided/);
  assert.match(html, /tabular-nums">0/);
  assert.match(html, /\(0\)/);
  assert.match(html, /data-winner="true"/);
  assert.match(html, /Winner/);
  delete rounds[0].matches[0].winner;
  assert.doesNotMatch(render({ rounds }), /data-winner/);
  assert.match(render({ rounds: [] }), /No matches to display/);
  assert.match(render({ rounds: [{ id: 'broken', matches: [] }] }), /Bracket unavailable/);
});
