/**
 * Token Sync Contract
 *
 * @description styles.css is the shipped source of truth for design tokens, and
 * tokens.json hand-mirrors a subset for the Tailwind preset and Storybook docs.
 * These tests fail the build when the two drift apart, which has happened before
 * (the prose heading margins diverged silently).
 */

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const tokens = JSON.parse(readFileSync(path.join(here, 'tokens.json'), 'utf8'));
const css = readFileSync(path.join(here, '..', 'styles.css'), 'utf8');
const preset = createRequire(import.meta.url)('../../tailwind-preset.cjs');

const cssValues = (variable) => [ ...css.matchAll(new RegExp(`${variable.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')}:\\s*([^;]+);`, 'g')) ].map((match) => match[1].trim());

test('corner tokens keep a runtime reference to one global radius', () => {
  assert.equal(tokens.dsVariables.root['--ds-radius'], '4px');
  assert.equal(cssValues('--ds-radius')[0], '4px');
  for (const [ name, value ] of Object.entries(tokens.radii)) {
    assert.equal(value, 'var(--ds-radius)', `${name} must follow the global radius`);
    assert.equal(cssValues(`--ds-radius-${name}`)[0], value, `${name} CSS radius drifted`);
  }
  for (const [ name, value ] of Object.entries(preset.theme.borderRadius)) {
    // Full is geometric: avatars, status dots, radios, and loading rings.
    if (name === 'full') continue;
    assert.equal(value, name === 'none' ? '0px' : 'var(--ds-radius)', `${name} utility must stay adjustable without rebuilding CSS`);
  }
});

test('inner spacing follows one global --ds-space-scale', () => {
  assert.equal(tokens.dsVariables.root['--ds-space-scale'], '1');
  assert.equal(cssValues('--ds-space-scale')[0], '1');
  assert.equal(tokens.spaceScales.default, 1, 'the default preset must be the unscaled layout');
  assert.match(css, /@import '\.\/spacing\.css';/, 'styles.css must load the spacing utilities');

  // Every padding and gap utility re-declares itself against the scale.
  const spacing = readFileSync(path.join(here, '..', 'spacing.css'), 'utf8');
  for (const utility of [ 'p', 'px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl', 'gap', 'gap-x', 'gap-y' ]) {
    assert.match(spacing, new RegExp(`@utility ${utility}-\\* \\{[^}]*var\\(--ds-space-scale, 1\\) \\* var\\(--spacing\\)`), `${utility}-* must follow --ds-space-scale`);
  }

  // Component CSS must not hard-code inner spacing. Prose rhythm (MdxContent)
  // and styles.css (prose tokens, overlay viewport insets) are editorial, not inner spacing.
  const editorial = new Set([ 'styles.css', 'MdxContent.module.css' ]);
  const cssFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(full);
    return entry.name.endsWith('.css') && !editorial.has(entry.name) ? [ full ] : [];
  });
  for (const file of cssFiles(path.join(here, '..'))) {
    const source = readFileSync(file, 'utf8');
    for (const [ , property, value ] of source.matchAll(/^\s*(padding[a-z-]*|gap|row-gap|column-gap)\s*:\s*([^;]+);/gm)) {
      const raw = value.replace(/calc\(var\(--ds-space-scale, 1\) \* [^)]+\)/g, '').match(/(?<![\w.(-])(?!0(?:rem|px|em)\b)\d*\.?\d+(rem|px|em)\b/);
      assert.equal(raw, null, `${path.relative(here, file)}: ${property}: ${value} must scale with --ds-space-scale`);
    }
  }
});

test('every dsVariables root token matches its styles.css :root value', () => {
  for (const [ variable, value ] of Object.entries(tokens.dsVariables.root)) {
    const found = cssValues(variable);

    assert.ok(found.length > 0, `${variable} is missing from styles.css`);
    assert.equal(found[0], String(value).trim(), `${variable} drifted: tokens.json has "${value}", styles.css has "${found[0]}"`);
  }
});

test('every dsVariables dark token has a matching styles.css declaration', () => {
  for (const [ variable, value ] of Object.entries(tokens.dsVariables.dark)) {
    const found = cssValues(variable);

    assert.ok(found.includes(String(value).trim()), `${variable} (dark) drifted: tokens.json has "${value}", styles.css declares [${found.join(', ')}]`);
  }
});

test('typography.prose mirrors the --ds-prose-* custom properties', () => {
  const { prose } = tokens.typography;

  assert.equal(cssValues('--ds-prose-font-size')[0], prose.fontSize);
  assert.equal(cssValues('--ds-prose-max-width')[0], prose.maxWidth);

  for (const heading of [ 'h1', 'h2', 'h3', 'h4' ]) {
    assert.equal(cssValues(`--ds-prose-${heading}-margin-top`)[0], prose.headingMargin[heading].top, `${heading} margin-top drifted`);
    assert.equal(cssValues(`--ds-prose-${heading}-margin-bottom`)[0], prose.headingMargin[heading].bottom, `${heading} margin-bottom drifted`);
  }
});
