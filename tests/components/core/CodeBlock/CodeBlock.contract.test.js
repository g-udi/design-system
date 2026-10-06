import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';
import { computeFoldRegions } from '../../../../src/components/core/CodeBlock/codeBlockFolding.js';

const parts = await loadComponent(new URL('../../../../src/components/core/CodeBlock/index.js', import.meta.url));

test('fold regions keep source line numbers across blank lines, nested blocks and tabs', () => {
  const text = ['outer', '\tchild', '\t\tleaf', '', '\tnext', 'last'];
  assert.deepEqual(computeFoldRegions(text.map((text, index) => ({ text, number: index + 20 }))), [
    { start: 20, end: 24 }, { start: 21, end: 22 }
  ]);
});

test('the public CodeBlock composition shares its context after private rendering extraction', () => {
  const html = renderToStaticMarkup(createElement(parts.CodeBlock, { code: 'const ready = true;', language: 'javascript', highlight: false },
    createElement(parts.CodeBlockHeader, null, createElement(parts.CodeBlockTitle, null, 'Example'), createElement(parts.CodeBlockCopyButton, null)),
    createElement(parts.CodeBlockContent, null)
  ));
  assert.match(html, /Example/);
  assert.match(html, /const ready = true;/);
  assert.match(html, /data-slot="code-block-copy"/);
  assert.match(html, /data-slot="code-block-copy-status" role="status" aria-live="polite" aria-atomic="true"/);
  assert.doesNotMatch(html, /\[object Object\]/);
});

test('selectable code exposes rows in one focusable grid, allowing real line actions', () => {
  const html = renderToStaticMarkup(createElement(parts.CodeBlock, {
    code: 'first\nsecond', language: 'text', highlight: false, selectable: true, selectedLines: [2]
  }));
  assert.match(html, /data-slot="code-block-viewport"[^>]*role="grid"[^>]*aria-multiselectable="true"[^>]*tabindex="0"/);
  assert.match(html, /data-code-line="2"[^>]*role="row"[^>]*aria-selected="true"/);
  assert.equal((html.match(/role="gridcell"/g) ?? []).length, 2);
  assert.doesNotMatch(html, /role="(?:listbox|option)"/);
});

test('ANSI styles persist across line breaks until an explicit reset', () => {
  const lines = parts.ansiToLines('\x1b[31mred\ncontinued\x1b[0m plain\nnormal', 8);
  assert.equal(lines[0].number, 8);
  assert.equal(lines[1].tokens[0].color, lines[0].tokens[0].color);
  assert.equal(lines[1].tokens[0].colorDark, lines[0].tokens[0].colorDark);
  assert.equal(lines[1].tokens[1].color, undefined);
  assert.equal(lines[2].tokens[0].color, undefined);
});

test('download controls compose host click callbacks and respect cancellation', () => {
  for (const cancel of [false, true]) {
    let click;
    let hostCalls = 0;
    let downloaded;
    let anchorClicked = false;
    function CaptureButton(props) {
      click = props.onClick;
      return createElement('button', { type: 'button' }, 'Download');
    }
    renderToStaticMarkup(createElement(parts.CodeBlock, { code: 'prepared file', language: 'text', highlight: false },
      createElement(parts.CodeBlockDownloadButton, {
        asChild: true,
        filename: 'example.txt',
        onClick: (event) => { hostCalls += 1; if (cancel) event.preventDefault(); },
        onDownload: (name) => { downloaded = name; }
      }, createElement(CaptureButton))
    ));
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {
      document: { createElement: () => ({ click: () => { anchorClicked = true; } }) },
      setTimeout: (callback) => callback()
    } });
    try {
      click(new Event('click', { cancelable: true }));
      assert.equal(hostCalls, 1);
      assert.equal(anchorClicked, !cancel);
      assert.equal(downloaded, cancel ? undefined : 'example.txt');
    } finally {
      if (descriptor) Object.defineProperty(globalThis, 'window', descriptor);
      else delete globalThis.window;
    }
  }
});
