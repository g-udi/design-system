/**
 * Token Sync Contract
 *
 * @description tokens.css is the shipped source of truth for design tokens, and
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

const here = fileURLToPath(new URL('../../src/tokens/', import.meta.url));
const tokens = JSON.parse(readFileSync(path.join(here, 'tokens.json'), 'utf8'));
const css = readFileSync(path.join(here, 'tokens.css'), 'utf8');
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
  assert.match(readFileSync(path.join(here, '..', 'styles.css'), 'utf8'), /@import '\.\/spacing\.css';/, 'styles.css must load the spacing utilities');

  // Every padding and gap utility re-declares itself against the scale.
  const spacing = readFileSync(path.join(here, '..', 'spacing.css'), 'utf8');
  for (const utility of [ 'p', 'px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl', 'gap', 'gap-x', 'gap-y' ]) {
    assert.match(spacing, new RegExp(`@utility ${utility}-\\* \\{[^}]*var\\(--ds-space-scale, 1\\) \\* var\\(--spacing\\)`), `${utility}-* must follow --ds-space-scale`);
  }

  // Component CSS must not hard-code inner spacing. Prose rhythm (MdxContent)
  // and Typography.css are editorial, not inner spacing.
  const editorial = new Set([ 'Typography.css', 'MdxContent.module.css' ]);
  const cssFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return [ 'docs', 'stories' ].includes(entry.name) ? [] : cssFiles(full);
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

test('every dsVariables root token matches its tokens.css :root value', () => {
  for (const [ variable, value ] of Object.entries(tokens.dsVariables.root)) {
    const found = cssValues(variable);

    assert.ok(found.length > 0, `${variable} is missing from tokens.css`);
    assert.equal(found[0], String(value).trim(), `${variable} drifted: tokens.json has "${value}", tokens.css has "${found[0]}"`);
  }
});

test('the JavaScript projection preserves every dark override of its public tokens', () => {
  const darkBlock = css.match(/\.dark\s*\{([^}]+)\}/s)?.[1];
  assert.ok(darkBlock, 'tokens.css must define the dark theme');
  const darkValues = Object.fromEntries([...darkBlock.matchAll(/(--ds-[\w-]+):\s*([^;]+);/g)].map(([, key, value]) => [key, value.trim()]));
  for (const [ variable, value ] of Object.entries(tokens.dsVariables.dark)) {
    assert.equal(darkValues[variable], String(value).trim(), `${variable} must match the dark declaration`);
  }
  for (const [variable, value] of Object.entries(darkValues)) {
    if (Object.hasOwn(tokens.dsVariables.root, variable)) {
      assert.equal(tokens.dsVariables.dark[variable], value, `${variable} dark override is missing from the JavaScript projection`);
    }
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

const luminance = (hex) => {
  const channels = hex.replace('#', '').match(/../g).map((part) => parseInt(part, 16) / 255);
  const [ r, g, b ] = channels.map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [ high, low ] = [ luminance(a), luminance(b) ].sort((x, y) => y - x);

  return (high + 0.05) / (low + 0.05);
};

test('chart palettes are defined for light and dark and stay readable', () => {
  const { chartPalettes, dsVariables } = tokens;
  assert.ok(chartPalettes, 'tokens.json names the chart palettes');
  for (const [ mode, values ] of Object.entries({ 'dark': dsVariables.dark, 'light': dsVariables.root })) {
    const surface = values['--ds-color-surface'];
    for (const [ name, variables ] of Object.entries(chartPalettes)) {
      for (const variable of variables) assert.match(String(values[variable]), /^#[0-9a-f]{6}$/i, `${variable} (${mode}, ${name}) needs a hex value`);
    }
    // Series and status marks are graphics: 3:1 against the chart surface.
    for (const variable of [ ...chartPalettes.categorical, ...chartPalettes.status, '--ds-color-chart-muted', '--ds-color-chart-baseline' ]) {
      assert.ok(contrast(values[variable], surface) >= 3, `${variable} (${mode}) is below 3:1 on the surface`);
    }
    // Values printed in heatmap cells are text: 4.5:1 against their cell.
    chartPalettes.heatmap.forEach((variable, step) => {
      assert.ok(contrast(values[variable], values[chartPalettes.heatmapInk[step]]) >= 4.5, `heatmap step ${step} (${mode}) ink is below 4.5:1`);
    });
    const [ negative2, negative1, mid, positive1, positive2 ] = chartPalettes.diverging;
    for (const variable of [ negative2, positive2 ]) assert.ok(contrast(values[variable], values['--ds-color-chart-div-ink']) >= 4.5, `${variable} (${mode}) ink is below 4.5:1`);
    for (const variable of [ negative1, mid, positive1 ]) assert.ok(contrast(values[variable], values['--ds-color-text']) >= 4.5, `${variable} (${mode}) text is below 4.5:1`);
    // Ramps read low → high: away from the surface in light mode, towards bright in dark mode.
    // Heatmap step 0 is "no data", not the lowest value, so the order starts at step 1.
    for (const ramp of [ chartPalettes.sequential, chartPalettes.heatmap.slice(1) ]) {
      const levels = ramp.map((variable) => luminance(values[variable]));
      levels.slice(1).forEach((level, index) => {
        assert.ok(mode === 'light' ? level < levels[index] : level > levels[index], `${ramp[index + 1]} (${mode}) breaks the ramp order`);
      });
    }
  }
});
