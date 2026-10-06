import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';
import katex from 'katex';

import sanitizeHtml from '../../../src/utilities/sanitizeHtml/sanitizeHtml.js';

const mathMarkup = katex.renderToString('\\frac{x^2}{\\sqrt{y}}', { throwOnError: false, trust: false });
const diagramMarkup = '<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><style>#diagram .node{fill:red}</style><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" orient="auto"><path d="M0,0 L8,4 L0,8 Z"></path></marker></defs><g transform="translate(4,4)"><path d="M0,0 L8,8" marker-end="url(#arrow)"></path><foreignObject width="80" height="40"><div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;text-align:center"><span class="nodeLabel">Start</span></div></foreignObject></g></svg>';
const hostileUrls = ['jav&#97;script:alert(1)', '&#x6a;avascript:alert(1)', 'java&#x09;script:alert(1)', 'java\nscript:alert(1)', 'data:text/html,<script>alert(1)</script>'];

test('sanitizeHtml removes script-capable markup and inline event handlers', () => {
  assert.equal(
    sanitizeHtml('<strong onclick="alert(1)">Safe</strong><script>alert(1)</script>'),
    '<strong>Safe</strong>'
  );
});

test('sanitizeHtml removes unsafe URL attributes but keeps safe links', () => {
  assert.equal(
    sanitizeHtml('<a href="javascript:alert(1)">Bad</a><a href="https://example.com">Good</a>'),
    '<a>Bad</a><a href="https://example.com">Good</a>'
  );
});

test('sanitizeHtml can preserve style tags for trusted generated SVG output', () => {
  assert.equal(
    sanitizeHtml('<style>.node{fill:red}</style><svg onload="alert(1)"></svg>', { 'allowStyleTags': true }),
    '<style>.node{fill:red}</style><svg></svg>'
  );
});

test('encoded and whitespace-obfuscated executable URLs are removed after HTML parsing', () => {
  for (const href of hostileUrls) {
    assert.doesNotMatch(sanitizeHtml(`<a href="${href}">Link</a>`), /href=/);
    assert.doesNotMatch(sanitizeHtml(`<svg><use xlink:href="${href}"></use></svg>`), /xlink:href=/);
  }
  assert.equal(sanitizeHtml('<a href="#note" class="footnote">Note</a>'), '<a href="#note" class="footnote">Note</a>');
  assert.equal(sanitizeHtml('<svg><a xlink:href="/guide">Guide</a></svg>'), '<svg><a xlink:href="/guide">Guide</a></svg>');
});

test('executable SVG elements, event handlers and HTML integrations are not allowed', () => {
  const clean = sanitizeHtml('<svg onload=alert(1)><foreignObject><div><img src="/sample.png" onerror="alert(1)"><iframe srcdoc="<script>alert(1)</script>"></iframe></div></foreignObject><animate attributeName="href" values="javascript:alert(1)"></animate></svg>');
  assert.doesNotMatch(clean, /onload|onerror|iframe|srcdoc|script|animate/);
  assert.match(clean, /<foreignObject><div><img src="\/sample.png"/);
});

test('KaTeX HTML, MathML semantics, inline dimensions and SVG geometry survive sanitation', () => {
  const clean = sanitizeHtml(mathMarkup);
  for (const marker of ['class="katex"', '<math ', '<semantics>', '<mfrac>', '<annotation encoding="application/x-tex">', 'aria-hidden="true"', 'style="height:', 'viewBox=', '<path d=']) {
    assert.ok(clean.includes(marker), marker);
  }
  assert.doesNotMatch(sanitizeHtml('<span style="background-image:url(javascript:alert(1));width:2em">Math</span>'), /background-image|javascript/);
});

test('generated Mermaid styles, HTML labels, references and case-sensitive SVG attributes survive', () => {
  const clean = sanitizeHtml(diagramMarkup, { allowStyleTags: true });
  for (const marker of ['viewBox="0 0 100 80"', '<style>', 'markerWidth="10"', 'marker-end="url(#arrow)"', '<foreignObject', 'display:flex', 'class="nodeLabel"']) {
    assert.ok(clean.includes(marker), marker);
  }
  assert.doesNotMatch(sanitizeHtml(diagramMarkup), /<style>/);
});

test('the browser bundle preserves server sanitation without Node globals or polyfills', async () => {
  const { outputFiles, warnings } = await build({
    entryPoints: [fileURLToPath(new URL('../../../src/utilities/sanitizeHtml/sanitizeHtml.js', import.meta.url))],
    bundle: true, write: false, platform: 'browser', format: 'iife',
    globalName: 'SanitizerUnderTest', logLevel: 'silent'
  });
  assert.deepEqual(warnings, []);
  const diagnostics = [];
  const scope = { window: {}, console: { warn: (...args) => diagnostics.push(args), error: (...args) => diagnostics.push(args) } };
  runInNewContext(outputFiles[0].text, scope);
  const browserSanitize = scope.SanitizerUnderTest.default;
  for (const [html, options] of [
    [mathMarkup, {}],
    [diagramMarkup, {}],
    [diagramMarkup, { allowStyleTags: true }],
    ['<span style="background-image:url(javascript:alert(1));width:2em" onclick="alert(1)">Math</span><script>alert(1)</script>', {}],
    ...hostileUrls.map((href) => [`<a href="${href}">Link</a><svg><use xlink:href="${href}"></use></svg>`, {}])
  ]) {
    assert.equal(browserSanitize(html, options), sanitizeHtml(html, options), 'Browser and SSR sanitation diverged');
  }
  assert.deepEqual(diagnostics, [], 'Browser style parsing failed or emitted sanitizer diagnostics');
});
