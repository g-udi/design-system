/**
 * Theme runtime: the pre-paint script (run in a VM against a minimal DOM, since jsdom is not a
 * dependency), applyTheme injection, and ThemeProvider/useTheme server rendering.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { loadComponent } from '../support/renderComponent.js';
import { compileTheme, compileThemes } from '../../src/themes/compile.js';
import { themePresets } from '../../src/themes/presets.js';
import { applyTheme, getThemeScript } from '../../src/themes/runtime.js';

function fakeDocument() {
  const styles = [];
  const element = (tag) => {
    const attributes = {};
    return {
      tag, textContent: '', attributes,
      setAttribute(name, value) { attributes[name] = String(value); },
      getAttribute: (name) => attributes[name] ?? null,
      remove() { styles.splice(styles.indexOf(this), 1); }
    };
  };
  const classes = new Set();
  const root = {
    ...element('html'),
    style: {},
    classList: { toggle: (name, force) => (force ? classes.add(name) : classes.delete(name)), contains: (name) => classes.has(name) }
  };
  return {
    styles,
    classes,
    documentElement: root,
    createElement: element,
    head: {
      appendChild: (node) => styles.push(node),
      querySelector: (selector) => styles.find((node) => selector === `style[data-gaudi-theme="${node.attributes['data-gaudi-theme']}"]`) || null
    }
  };
}

function runScript(script, { stored = {}, systemDark = false, storageThrows = false } = {}) {
  const document = fakeDocument();
  const localStorage = { getItem: (key) => { if (storageThrows) throw new Error('blocked'); return stored[key] ?? null; } };
  const window = { localStorage, matchMedia: (query) => ({ matches: systemDark && query === '(prefers-color-scheme: dark)' }) };
  vm.runInNewContext(script, { document, window });
  return document;
}

test('the pre-paint script applies the default theme and system mode before paint', () => {
  const light = runScript(getThemeScript());
  assert.equal(light.documentElement.getAttribute('data-theme'), 'gaudi');
  assert.equal(light.classes.has('dark'), false);
  assert.equal(light.documentElement.style.colorScheme, 'light');
  assert.equal(light.styles.length, 0, 'the default theme needs no injected CSS');
  const dark = runScript(getThemeScript(), { systemDark: true });
  assert.equal(dark.classes.has('dark'), true);
  assert.equal(dark.documentElement.style.colorScheme, 'dark');
});

test('the pre-paint script restores a stored theme, its CSS and an explicit mode', () => {
  const folio = themePresets.find((theme) => theme.id === 'folio');
  const css = compileTheme(folio);
  const document = runScript(getThemeScript(), { stored: { 'gaudi-theme': 'folio', 'gaudi-theme-mode': 'dark', 'gaudi-theme-css': css } });
  assert.equal(document.documentElement.getAttribute('data-theme'), 'folio');
  assert.equal(document.classes.has('dark'), true);
  assert.equal(document.styles.length, 1);
  assert.equal(document.styles[0].textContent, css);
  assert.equal(document.styles[0].getAttribute('data-gaudi-theme'), 'folio');
  const light = runScript(getThemeScript(), { stored: { 'gaudi-theme-mode': 'light' }, systemDark: true });
  assert.equal(light.classes.has('dark'), false);
});

test('the pre-paint script honours options, blocked storage and stays inert in <script>', () => {
  const custom = runScript(getThemeScript({ storageKey: 'app', defaultTheme: 'grove', attribute: 'data-palette', enableMode: false }), { stored: { 'app-mode': 'dark' }, systemDark: true });
  assert.equal(custom.documentElement.getAttribute('data-palette'), 'grove');
  assert.equal(custom.classes.has('dark'), false, 'mode left to another provider');
  const blocked = runScript(getThemeScript({ defaultMode: 'dark' }), { storageThrows: true });
  assert.equal(blocked.documentElement.getAttribute('data-theme'), 'gaudi');
  assert.equal(blocked.classes.has('dark'), true);
  assert.doesNotMatch(getThemeScript({ defaultTheme: '</script><script>alert(1)</script>' }), /<\/script>/);
});

test('applyTheme injects one replaceable style element and compiles without a DOM', () => {
  const document = fakeDocument();
  const ember = themePresets.find((theme) => theme.id === 'ember');
  const first = applyTheme(ember, { document, nonce: 'abc' });
  applyTheme(ember, { document });
  assert.equal(document.styles.length, 1);
  assert.equal(document.styles[0].getAttribute('nonce'), 'abc');
  assert.match(first.css, /\[data-theme="ember"\]/);
  first.remove();
  assert.equal(document.styles.length, 0);
  assert.match(applyTheme(ember, { document: undefined }).css, /--ds-color-accent:/);
});

test('custom theme selectors apply to tokens, anchors and the pre-paint stylesheet', () => {
  const theme = themePresets.find(theme => theme.id === 'gaudi');
  const options = { attribute: 'data-palette', darkClass: 'night' };
  const css = compileTheme(theme, options);
  assert.match(css, /\[data-palette="gaudi"\]\.night/);
  assert.doesNotMatch(css, /\[data-theme=|\.dark/);
  const collection = compileThemes([theme], options);
  assert.match(collection, /\[data-palette\], \[data-palette\] \.night/);
  const document = runScript(getThemeScript(options), { stored: { 'gaudi-theme-css': css, 'gaudi-theme-mode': 'dark' } });
  assert.equal(document.styles[0].textContent, css);
  assert.equal(document.classes.has('night'), true);
});

test('ThemeProvider renders deterministic defaults on the server', async () => {
  const { ThemeProvider, useTheme } = await loadComponent(new URL('../../src/themes/index.js', import.meta.url));
  let context;
  const Probe = () => { context = useTheme(); return h('span', null, `${context.theme}:${context.mode}:${context.resolvedMode}`); };
  assert.equal(typeof window, 'undefined');
  assert.equal(renderToString(h(ThemeProvider, null, h(Probe))), '<span>gaudi:system:light</span>');
  assert.equal(context.themes.length, themePresets.length);
  assert.equal(renderToString(h(ThemeProvider, { defaultTheme: 'midnight', defaultMode: 'dark' }, h(Probe))), '<span>midnight:dark:dark</span>');
  // Outside a provider the hook returns inert defaults.
  assert.equal(renderToString(h(Probe)), '<span>gaudi:system:light</span>');
  assert.doesNotThrow(() => context.setTheme('folio'));
});
