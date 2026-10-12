// Theme JSON → CSS scoped by [data-theme="<id>"]. Light values apply on the themed element; dark
// values when it (or an ancestor) has .dark, or for a .dark descendant. `.light` on the themed
// element opts out of an ancestor's .dark (used by previews). Output is unlayered so it overrides
// the layered defaults in tokens.css.
import { COLOR_TOKENS, DARK_CLASS, DEFAULT_THEME_ID, FONT_TOKENS, RADIUS_VAR, SHADOW_TOKENS, SPACING_VAR, THEME_ATTRIBUTE, colorVar, fontVar, shadowVar } from './contract.js';
import { contrastRatio, formatOklch, toOklch } from './color.js';
import { ANCHOR_DECLARATIONS, themePresets } from './presets.js';
import { assertTheme } from './validate.js';

const baseline = themePresets.find((theme) => theme.id === DEFAULT_THEME_ID);

export const themeSelector = (id, attribute = THEME_ATTRIBUTE) => `[${attribute}="${id}"]`;
export const darkSelector = (id, attribute = THEME_ATTRIBUTE, darkClass = DARK_CLASS) => {
  const base = themeSelector(id, attribute);
  return `${base}.${darkClass}, .${darkClass} ${base}:not(.light), ${base} .${darkClass}`;
};

const mix = (variable, percent, other = 'transparent') => `color-mix(in oklab, var(${variable}) ${percent}%, ${other})`;

/** Ramp of five steps at the accent hue, low → high (away from the surface). */
function ramp(accent, mode) {
  const { c, h } = toOklch(accent);
  const steps = mode === 'light' ? [0.93, 0.8, 0.65, 0.5, 0.36] : [0.36, 0.5, 0.65, 0.8, 0.93];
  return steps.map((l) => formatOklch({ l, c: Math.max(0.04, Math.min(c, 0.16)) * (l > 0.85 ? 0.45 : 1), h }));
}
const inkOn = (background, colors) => (contrastRatio(colors.text, background) >= contrastRatio(colors.surface, background) ? colors.text : colors.surface);

/**
 * DS-only tokens recomputed from the contract for non-default themes, so launchers, popovers,
 * citations, aurora and chart ramps follow the theme. The default theme keeps tokens.css values.
 */
export function derivedDeclarations(colors, mode) {
  const sequential = ramp(colors.accent, mode);
  const heat = [colors['surface-muted'], ...ramp(colors['chart-3'], mode)];
  return [
    ['--ds-color-chart-cursor', mix('--ds-color-accent', 10)],
    ['--ds-color-chart-grid', mix('--ds-color-text-subtle', 30)],
    ['--ds-color-chart-muted', 'var(--ds-color-text-subtle)'],
    ['--ds-color-chart-baseline', 'var(--ds-color-text-muted)'],
    ['--ds-color-chart-track', 'var(--ds-color-border-muted)'],
    ['--ds-color-chart-positive', 'var(--ds-color-success)'],
    ['--ds-color-chart-negative', 'var(--ds-color-danger)'],
    ['--ds-color-chart-total', 'var(--ds-color-text-muted)'],
    ...sequential.map((value, index) => [`--ds-color-chart-seq-${index + 1}`, value]),
    ...heat.map((value, index) => [`--ds-color-chart-heat-${index}`, value]),
    ...heat.map((value, index) => [`--ds-color-chart-heat-ink-${index}`, inkOn(value, colors)]),
    ['--ds-color-launcher-bg', 'var(--ds-color-surface-raised)'],
    ['--ds-color-launcher-border', 'var(--ds-color-border)'],
    ['--ds-color-launcher-heading', 'var(--ds-color-text-subtle)'],
    ['--ds-color-launcher-input-text', 'var(--ds-color-text)'],
    ['--ds-color-launcher-item-selected-bg', mix('--ds-color-accent', 10)],
    ['--ds-color-launcher-item-text', 'var(--ds-color-text-muted)'],
    ['--ds-color-launcher-placeholder', 'var(--ds-color-text-subtle)'],
    ['--ds-color-launcher-scrollbar-thumb', 'var(--ds-color-border)'],
    ['--ds-color-launcher-text', 'var(--ds-color-text)'],
    ['--ds-color-popover-bg', mix('--ds-color-surface-raised', 95)],
    ['--ds-color-popover-link', 'var(--ds-color-accent)'],
    ['--ds-color-popover-link-hover', 'var(--ds-color-accent-dark)'],
    ['--ds-color-popover-strong', 'var(--ds-color-text)'],
    ['--ds-color-popover-text', 'var(--ds-color-text-muted)'],
    ['--ds-color-caption-text', 'var(--ds-color-text-subtle)'],
    ['--ds-color-citation-badge-text', 'var(--ds-color-accent)'],
    ['--ds-color-citation-badge-bg', mix('--ds-color-accent', 10)],
    ['--ds-color-citation-badge-bg-hover', mix('--ds-color-accent', 18)],
    ['--ds-color-citation-back-active-bg', 'var(--ds-color-accent-muted)'],
    ['--ds-color-citation-back-active-border', 'var(--ds-color-accent)'],
    ['--ds-color-citation-back-active-text', 'var(--ds-color-text)'],
    ['--ds-color-scrollbar-thumb', 'var(--ds-color-border)'],
    ['--ds-color-scrollbar-track', 'var(--ds-color-surface-muted)'],
    ['--ds-color-aurora-primary-start', mix('--ds-color-accent', mode === 'light' ? 30 : 45)],
    ['--ds-color-aurora-primary-mid', mix('--ds-color-accent', mode === 'light' ? 18 : 30)],
    ['--ds-color-aurora-secondary-mid', mix('--ds-color-chart-3', mode === 'light' ? 22 : 35)],
    ['--ds-color-aurora-tertiary-mid', mix('--ds-color-chart-3', mode === 'light' ? 16 : 28)]
  ];
}

const fontsDiffer = (fonts) => FONT_TOKENS.some((key) => fonts[key] !== baseline?.fonts[key]);
const block = (selector, declarations) => `${selector} {\n${declarations.map(([name, value]) => `  ${name}: ${value};`).join('\n')}\n}\n`;

/**
 * compileTheme(theme, { derived? }) → CSS text. `derived` (default: every theme except "gaudi")
 * also recomputes DS-only tokens from the contract; the default theme reproduces tokens.css exactly.
 */
export function compileTheme(theme, { derived = theme?.id !== DEFAULT_THEME_ID, anchors = true, attribute = THEME_ATTRIBUTE, darkClass = DARK_CLASS } = {}) {
  assertTheme(theme);
  const base = themeSelector(theme.id, attribute);
  const dark = darkSelector(theme.id, attribute, darkClass);
  const modeDeclarations = (mode) => [
    ...COLOR_TOKENS.map((key) => [colorVar(key), theme[mode][key]]),
    ...SHADOW_TOKENS.map((key) => [shadowVar(key), theme.shadows[mode][key]]),
    ...(derived ? derivedDeclarations(theme[mode], mode) : [])
  ];
  const shared = [
    ...FONT_TOKENS.map((key) => [fontVar(key), theme.fonts[key]]),
    [RADIUS_VAR, theme.radius],
    [SPACING_VAR, String(theme.spacing ?? 1)]
  ];
  let css = `/* Gaudi theme: ${theme.name} (${theme.id}) */\n`;
  css += block(base, [...shared, ...modeDeclarations('light')]);
  css += block(dark, modeDeclarations('dark'));
  if (anchors) css += block(`${base}, ${dark}`, ANCHOR_DECLARATIONS);
  // Tailwind's font utilities inline the default stacks, so a theme with its own fonts re-points them.
  if (fontsDiffer(theme.fonts)) {
    css += block(`${base}, ${base} body, ${base} .font-sans`, [['font-family', `var(${fontVar('sans')})`]]);
    css += block(`${base} .font-serif`, [['font-family', `var(${fontVar('serif')})`]]);
    css += block(`${base} .font-mono`, [['font-family', `var(${fontVar('mono')})`]]);
    if (theme.fonts.heading !== theme.fonts.sans) css += block(`${base} :is(h1, h2, h3, h4, h5, h6)`, [['font-family', `var(${fontVar('heading')})`]]);
  }
  if (theme.tracking && !/^-?0(?:\.0+)?(?:em|rem|px)?$/.test(theme.tracking)) css += block(`${base}, ${base} body`, [['letter-spacing', theme.tracking]]);
  return css;
}

/**
 * Tokens that alias contract tokens (tokens.css and the shadcn bridge in theme.css), re-declared in
 * themed scopes so a nested data-theme element (a preview card) resolves them against its own values.
 */
export const anchorCss = ({ attribute = THEME_ATTRIBUTE, darkClass = DARK_CLASS } = {}) => block(`[${attribute}], [${attribute}] .${darkClass}`, ANCHOR_DECLARATIONS);

/** CSS for several themes (e.g. every preset) in one stylesheet, sharing one anchor block. */
export const compileThemes = (themes, options) => [anchorCss(options), ...themes.map((theme) => compileTheme(theme, { ...options, anchors: false }))].join('\n');
