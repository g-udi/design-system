import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
import {
  getSignaturePadBounds,
  getSignaturePadStrokePath,
  sameStrokes,
  serializeSignaturePad,
  signaturePadToSVG,
} from '../../../../src/components/core/SignaturePad/signaturePadModel.js';

const api = await loadComponent(
  new URL(
    '../../../../src/components/core/SignaturePad/index.js',
    import.meta.url,
  ),
);
const ink = [
  {
    points: [
      [10, 20, 4],
      [24, 30, 2],
      [40, 15, 6],
    ],
  },
];

test('signature entry and saved previews render on the server with named parts and native form state', () => {
  const html = renderToStaticMarkup(
    h(
      api.SignaturePad,
      { name: 'recipient', required: true, disabled: true, defaultValue: ink },
      h(
        api.SignaturePadArea,
        { 'aria-label': 'Recipient signature' },
        h(api.SignaturePadGuide),
        h(api.SignaturePadPlaceholder),
      ),
      h(api.SignaturePadClear),
      h(api.SignaturePadUndo),
      h(api.SignaturePadRedo),
      h(api.SignaturePadSave),
    ),
  );
  for (const control of ['clear', 'undo', 'redo', 'save']) {
    const button = html.match(new RegExp(`<button[^>]*data-slot="signature-pad-${control}"[\\s\\S]*?</button>`))?.[0];
    assert.match(button || '', /<svg/, `${control} renders its registered icon`);
  }
  assert.match(html, /role="application"/);
  assert.match(html, /aria-label="Recipient signature"/);
  assert.match(html, /aria-disabled="true"/);
  assert.match(html, /data-slot="signature-pad-stroke"/);
  assert.match(html, /name="recipient"/);
  assert.match(html, /required=""/);
  assert.doesNotMatch(html, /data-slot="signature-pad-placeholder"/);
  assert.match(
    renderToStaticMarkup(
      h(api.SignaturePadPreview, {
        strokes: ink,
        'aria-label': 'Saved recipient signature',
      }),
    ),
    /role="img" aria-label="Saved recipient signature"/,
  );
  assert.equal(
    renderToStaticMarkup(h(api.SignaturePadPreview, { strokes: [] })),
    '',
  );
});

test('empty point groups cannot masquerade as a required signature', () => {
  assert.equal(getSignaturePadBounds([]), null);
  assert.equal(serializeSignaturePad([{ points: [] }], 'json'), '');
  const html = renderToStaticMarkup(
    h(
      api.SignaturePad,
      {
        defaultValue: [{ points: [] }],
        labels: { placeholder: 'Draw here', area: 'Approval signature' },
      },
      h(api.SignaturePadArea, null, h(api.SignaturePadPlaceholder)),
    ),
  );
  assert.match(html, /data-empty="true"/);
  assert.match(html, /Draw here/);
  assert.match(html, /aria-label="Approval signature"/);
});

test('export crops include the entire ink diameter and padding', () => {
  assert.deepEqual(getSignaturePadBounds(ink), {
    x: 8,
    y: 12,
    width: 35,
    height: 19,
  });
  const svg = signaturePadToSVG(ink, { padding: 8 });
  assert.match(svg, /viewBox="0 4 51 35" width="51" height="35"/);
  assert.match(svg, /fill="#000000"/);
  assert.match(
    signaturePadToSVG(ink, { width: 300, height: 120 }),
    /viewBox="0 0 300 120"/,
  );
  assert.deepEqual(JSON.parse(serializeSignaturePad(ink, 'json')), ink);
  assert.equal(
    decodeURIComponent(serializeSignaturePad(ink, 'svg').split(',')[1]),
    svg,
  );
});

test('SVG attributes are escaped and taps, sharp turns, and repeated points produce finite ink', () => {
  const svg = signaturePadToSVG(
    [{ ...ink[0], color: '"><script>alert(1)</script>' }],
    { background: '" onload="alert(1)' },
  );
  assert.doesNotMatch(svg, /<script|fill=""/);
  assert.match(svg, /&#34;/);
  for (const points of [
    [[12, 14, 2]],
    [
      [5, 5, 2],
      [5, 5, 2],
    ],
    [
      [0, 0, 2],
      [20, 0, 3],
      [0, 1, 2],
    ],
  ]) {
    const path = getSignaturePadStrokePath({ points });
    assert.ok(path.startsWith('M') && path.endsWith('Z'));
    assert.doesNotMatch(path, /NaN|Infinity|undefined/);
  }
});

test('history compares every point so an external edit in the middle cannot retain stale undo', () => {
  assert.equal(sameStrokes(ink, structuredClone(ink)), true);
  const changed = structuredClone(ink);
  changed[0].points[1][0] += 1;
  assert.equal(sameStrokes(ink, changed), false);
  assert.equal(sameStrokes(ink, [{ ...ink[0], color: 'blue' }]), false);
});
