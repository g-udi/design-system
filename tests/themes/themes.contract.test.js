/**
 * Theme contract: schema parity, default-theme identity with tokens.css, presets and generator
 * contrast/determinism, the shadcn/tweakcn/StyleGlide importer and the exporters.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { extractAnchors, extractDefaultTheme, themeSchema } from '../../scripts/themes/extract.mjs';
import { contrastRatio, formatHex, parseColor, toOklch } from '../../src/themes/color.js';
import { compileTheme } from '../../src/themes/compile.js';
import { COLOR_TOKENS, FONT_TOKENS, SHADOW_TOKENS, TOKEN_COUNT, colorVar, shadowVar } from '../../src/themes/contract.js';
import { checkContrast } from '../../src/themes/contrast.js';
import { parseCssBlocks } from '../../src/themes/cssBlocks.js';
import { exportTheme, toRegistryItem } from '../../src/themes/exporter.js';
import { generateTheme, randomTheme } from '../../src/themes/generate.js';
import { importTheme } from '../../src/themes/importer.js';
import { themePresets } from '../../src/themes/presets.js';
import { validateTheme } from '../../src/themes/validate.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (file) => readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
const fixture = (file) => readFileSync(new URL(`./fixtures/${file}`, import.meta.url), 'utf8');
const gaudi = themePresets[0];
const declarationsFor = (css, selector) => Object.assign({}, ...parseCssBlocks(css).filter((block) => block.selector === selector).map((block) => block.declarations));

test('the JSON schema, the contract and the generated artefacts stay in sync', () => {
  const schema = JSON.parse(read('themes/theme.schema.json'));
  assert.deepEqual(schema, themeSchema());
  assert.deepEqual(schema.properties.light.required, COLOR_TOKENS);
  assert.deepEqual(schema.properties.shadows.properties.dark.required, SHADOW_TOKENS);
  assert.deepEqual(schema.properties.fonts.required, FONT_TOKENS);
  assert.equal(TOKEN_COUNT, 134);
  const theming = read('src/tokens/THEMING.md');
  for (const token of COLOR_TOKENS.filter((key) => !/^(?:success|warning|danger|discovery|info|attention)-|^chart-[2-7]$/.test(key))) assert.match(theming, new RegExp(`\`${token}\``), `THEMING.md documents ${token}`);
  execFileSync(process.execPath, ['scripts/themes/build.mjs', '--check'], { cwd: root, stdio: 'pipe' });
});

test('validation accepts every preset and rejects malformed or unsafe themes', () => {
  for (const theme of themePresets) assert.deepEqual(validateTheme(theme).errors, [], theme.id);
  const broken = (patch) => validateTheme({ ...structuredClone(gaudi), ...patch(structuredClone(gaudi)) });
  assert.equal(broken((theme) => { delete theme.light.accent; return { light: theme.light }; }).valid, false);
  assert.equal(broken((theme) => ({ light: { ...theme.light, accent: 'bluish' } })).valid, false);
  assert.equal(broken((theme) => ({ dark: { ...theme.dark, surface: 'red; } body { display: none' } })).valid, false);
  assert.equal(broken((theme) => ({ fonts: { ...theme.fonts, sans: 'Inter</style><script>' } })).valid, false);
  assert.equal(broken(() => ({ radius: '1vw' })).valid, false);
  assert.equal(broken(() => ({ id: 'Not A Slug' })).valid, false);
  assert.equal(broken(() => ({ extra: true })).valid, false);
  assert.throws(() => compileTheme({ ...gaudi, light: { ...gaudi.light, text: 'red;}' } }), /Invalid theme/);
});

test('the default theme is extracted from tokens.css and compiles to today\'s exact values', () => {
  const tokensCss = read('src/tokens/tokens.css');
  const rootVars = declarationsFor(tokensCss, ':root');
  const darkVars = { ...rootVars, ...declarationsFor(tokensCss, '.dark') };
  const resolve = (vars, name) => { const value = vars[name]; const alias = value.match(/^var\((--ds-[\w-]+)\)$/); return alias ? resolve(vars, alias[1]) : value; };
  assert.deepEqual(extractDefaultTheme(), Object.fromEntries(Object.entries(gaudi).filter(([key]) => key !== '$schema')));

  const css = compileTheme(gaudi);
  const light = declarationsFor(css, '[data-theme="gaudi"]');
  const dark = declarationsFor(css, '[data-theme="gaudi"].dark, .dark [data-theme="gaudi"]:not(.light), [data-theme="gaudi"] .dark');
  for (const key of COLOR_TOKENS) {
    assert.equal(light[colorVar(key)], resolve(rootVars, colorVar(key)), `light ${key}`);
    assert.equal(dark[colorVar(key)], resolve(darkVars, colorVar(key)), `dark ${key}`);
  }
  for (const key of SHADOW_TOKENS) {
    assert.equal(light[shadowVar(key)], resolve(rootVars, shadowVar(key)), `light shadow ${key}`);
    assert.equal(dark[shadowVar(key)], resolve(darkVars, shadowVar(key)), `dark shadow ${key}`);
  }
  assert.equal(light['--ds-radius'], rootVars['--ds-radius']);
  assert.equal(light['--ds-space-scale'], rootVars['--ds-space-scale']);
  assert.equal(light['--ds-font-sans'], rootVars['--ds-font-sans']);
  assert.equal(light['--ds-font-mono'], rootVars['--ds-font-mono']);
  // The default theme adds no recomputed tokens, font rules or letter-spacing.
  assert.equal(light['--ds-color-launcher-bg'], undefined);
  assert.doesNotMatch(css, /font-family|letter-spacing/);
  // Anchors repeat the alias declarations verbatim.
  const anchors = declarationsFor(css, '[data-theme="gaudi"], [data-theme="gaudi"].dark, .dark [data-theme="gaudi"]:not(.light), [data-theme="gaudi"] .dark');
  for (const [name, value] of extractAnchors()) {
    assert.equal(anchors[name], value, name);
    if (rootVars[name]) assert.equal(value, rootVars[name], `${name} matches tokens.css`);
  }
  // New contract roles default to the roles components used before.
  assert.equal(rootVars['--ds-color-focus'], 'var(--ds-color-discovery)');
  assert.equal(rootVars['--ds-color-sidebar'], 'var(--ds-color-surface-muted)');
  const themeCss = read('src/tokens/theme.css');
  assert.match(themeCss, /--color-ui-focus: var\(--ds-color-focus\);/);
  assert.match(themeCss, /--color-ui-sidebar: var\(--ds-color-sidebar\);/);
});

test('every preset passes WCAG AA in both modes and compiles to scoped CSS', () => {
  assert.ok(themePresets.length >= 7);
  assert.equal(new Set(themePresets.map((theme) => theme.id)).size, themePresets.length);
  for (const theme of themePresets) {
    const report = checkContrast(theme);
    assert.deepEqual(report.failures, [], `${theme.id} contrast`);
    const css = compileTheme(theme);
    assert.match(css, new RegExp(`\\[data-theme="${theme.id}"\\] \\{`));
    assert.match(css, new RegExp(`\\[data-theme="${theme.id}"\\]\\.dark`));
    if (theme.id !== 'gaudi') assert.match(css, /--ds-color-launcher-bg: var\(--ds-color-surface-raised\)/);
  }
  assert.match(compileTheme(themePresets.find((theme) => theme.id === 'folio')), /:is\(h1, h2, h3, h4, h5, h6\) \{\n {2}font-family: var\(--ds-font-heading\)/);
});

test('generation is deterministic, offline and contrast-safe from any seed', () => {
  assert.deepEqual(generateTheme({ brand: '#0e7490', seed: 4 }), generateTheme({ brand: '#0e7490', seed: 4 }));
  assert.deepEqual(randomTheme(7), randomTheme(7));
  assert.notDeepEqual(randomTheme(7).light, randomTheme(8).light);
  for (const brand of ['#ff0000', '#ffff00', '#00ff00', '#000000', '#ffffff', '#7c3aed', 'oklch(0.9 0.2 100)', 'hsl(200 100% 50%)']) {
    const theme = generateTheme({ brand, secondary: '#f0abfc' });
    assert.deepEqual(validateTheme(theme).errors, [], brand);
    assert.deepEqual(checkContrast(theme).failures, [], brand);
  }
  for (let seed = 0; seed < 40; seed += 1) assert.equal(checkContrast(randomTheme(seed)).pass, true, `seed ${seed}`);
  // The accent keeps the brand hue; only lightness moves.
  const brand = toOklch('#7c3aed');
  const accent = toOklch(generateTheme({ brand: '#7c3aed' }).light.accent);
  assert.ok(Math.abs(accent.h - brand.h) < 6, `accent hue ${accent.h} vs ${brand.h}`);
});

test('the importer maps shadcn v4 OKLCH CSS verbatim and reports contrast', () => {
  const { theme, report, format, warnings } = importTheme(fixture('shadcn-v4-oklch.css'), { id: 'neutral' });
  assert.equal(format, 'css');
  assert.deepEqual(warnings, []);
  assert.equal(theme.id, 'neutral');
  assert.equal(theme.light.surface, 'oklch(1 0 0)');
  assert.equal(theme.light.text, 'oklch(0.145 0 0)');
  assert.equal(theme.light.accent, 'oklch(0.205 0 0)');
  assert.equal(theme.light['accent-muted'], 'oklch(0.97 0 0)');
  assert.equal(theme.light.danger, 'oklch(0.577 0.245 27.325)');
  assert.equal(theme.light.focus, 'oklch(0.708 0 0)');
  assert.equal(theme.light['chart-3'], 'oklch(0.398 0.07 227.392)');
  assert.equal(theme.dark.border, 'oklch(1 0 0 / 10%)');
  assert.equal(theme.dark['surface-raised'], 'oklch(0.205 0 0)');
  assert.equal(theme.radius, '0.625rem');
  // Gaudi-only tokens are derived and safe.
  assert.ok(contrastRatio(theme.light['text-subtle'], theme.light['surface-muted']) >= 4.5);
  assert.ok(contrastRatio(theme.light.success, theme.light.surface) >= 4.5);
  // shadcn's own yellow chart series are below 3:1; the report says so and repair fixes it.
  assert.ok(report.failures.some((failure) => failure.fg === 'chart-4' && failure.mode === 'light'));
  assert.equal(importTheme(fixture('shadcn-v4-oklch.css'), { repair: true }).report.pass, true);
});

test('the importer reads shadcn v3 bare HSL triplets inside @layer base', () => {
  const { theme } = importTheme(fixture('shadcn-v3-hsl.css'), { name: 'Zinc' });
  assert.equal(theme.id, 'zinc');
  assert.equal(theme.name, 'Zinc');
  assert.equal(theme.light.surface, 'hsl(0 0% 100%)');
  assert.equal(theme.light.accent, 'hsl(240 5.9% 10%)');
  assert.equal(theme.light['danger-foreground'], 'hsl(0 0% 98%)');
  assert.equal(theme.dark.accent, 'hsl(0 0% 98%)');
  assert.equal(formatHex(parseColor(theme.dark.surface)), '#09090b');
  assert.equal(theme.radius, '0.5rem');
});

test('the importer maps tweakcn fonts, shadows, tracking, spacing and var() references', () => {
  const { theme } = importTheme(fixture('tweakcn.css'));
  assert.equal(theme.fonts.sans, '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif');
  assert.equal(theme.fonts.serif, '"Lora", ui-serif, Georgia, serif');
  assert.equal(theme.fonts.mono, '"IBM Plex Mono", ui-monospace, monospace');
  assert.equal(theme.fonts.heading, theme.fonts.sans);
  assert.equal(theme.shadows.light.card, '0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1)');
  assert.equal(theme.shadows.light.popover, '0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1)');
  assert.equal(theme.shadows.dark.card, '0 1px 3px 0px hsl(0 0% 0% / 0.4), 0 1px 2px -1px hsl(0 0% 0% / 0.4)');
  assert.equal(theme.light.focus, 'oklch(0.5583 0.1276 42.9956)', '--ring: var(--primary) resolves');
  assert.equal(theme.tracking, '-0.025em');
  assert.equal(theme.spacing, 1.2);
  assert.match(compileTheme(theme), /letter-spacing: -0\.025em/);
});

test('the importer handles hex/rgb StyleGlide CSS without dark mode and shadcn registry items', () => {
  const hex = importTheme(fixture('styleglide-hex.css'), { id: 'stone' });
  assert.equal(hex.theme.light.surface, '#fdfcfb');
  assert.equal(hex.theme.light.text, 'rgb(28, 25, 23)');
  assert.equal(hex.theme.light.success, '#15803d');
  assert.deepEqual(hex.theme.dark, gaudi.dark);
  assert.match(hex.warnings.join(' '), /No \.dark block/);

  const registry = importTheme(fixture('tweakcn-registry.json'));
  assert.equal(registry.format, 'shadcn-registry');
  assert.equal(registry.theme.id, 'ocean-breeze');
  assert.equal(registry.theme.name, 'Ocean Breeze');
  assert.equal(registry.theme.fonts.sans, 'DM Sans, sans-serif');
  assert.equal(registry.theme.radius, '0.375rem');
  assert.equal(registry.theme.dark.accent, 'oklch(0.7 0.13 236)');
  assert.equal(registry.report.pass, true);
});

test('exports round-trip through shadcn CSS and the registry item', () => {
  const folio = themePresets.find((theme) => theme.id === 'folio');
  const shadcn = exportTheme(folio, 'shadcn');
  assert.match(shadcn, /:root \{\n {2}--background: /);
  assert.match(shadcn, /@theme inline \{/);
  const back = importTheme(shadcn, { id: 'folio' }).theme;
  for (const key of ['surface', 'surface-raised', 'surface-muted', 'text', 'text-muted', 'accent', 'accent-foreground', 'accent-muted', 'accent-subtle', 'border', 'focus', 'danger', 'danger-foreground', 'chart-1', 'chart-5', 'sidebar', 'sidebar-accent']) {
    assert.equal(back.light[key], folio.light[key], `light ${key}`);
    assert.equal(back.dark[key], folio.dark[key], `dark ${key}`);
  }
  assert.deepEqual(back.fonts, folio.fonts);
  assert.equal(back.shadows.light.popover, folio.shadows.light.popover);

  const item = toRegistryItem(folio);
  assert.equal(item.type, 'registry:theme');
  assert.equal(item.name, 'theme-folio');
  assert.equal(item.cssVars.light.primary, folio.light.accent);
  assert.equal(item.cssVars.theme.radius, folio.radius);
  assert.deepEqual(importTheme(JSON.stringify(item)).theme, folio);
  assert.deepEqual(JSON.parse(read('public/r/theme-folio.json')), item);
  assert.deepEqual(JSON.parse(exportTheme(folio, 'json')), folio);
});
