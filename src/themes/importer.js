// shadcn / tweakcn / StyleGlide → Gaudi theme. Accepts theme CSS (:root + .dark custom properties
// in OKLCH, HSL, bare HSL triplets, hex or rgb), a shadcn registry item (cssVars.light/dark/theme)
// or a Gaudi theme JSON. Mapped values are kept verbatim; Gaudi-only tokens are derived and made
// contrast-safe. The mapping table lives in contract.js and src/tokens/THEMING.md.
import { contrastRatio, fitGamut, formatOklch, isHslTriplet, parseColor, toOklch } from './color.js';
import { COLOR_TOKENS, DEFAULT_THEME_ID, SHADCN_COLOR_MAP, SHADCN_SHADOW_MAP, STATUS_ROLES } from './contract.js';
import { checkContrast } from './contrast.js';
import { parseCssBlocks } from './cssBlocks.js';
import { repairContrast, solveContrast } from './generate.js';
import { themePresets } from './presets.js';
import { RADIUS_PATTERN, TRACKING_PATTERN, validateTheme } from './validate.js';

const baseline = themePresets.find((theme) => theme.id === DEFAULT_THEME_ID);
const STATUS_HUES = { success: 150, warning: 70, danger: 27, discovery: 185, info: 250, attention: 5 };
const UNSAFE = /[;{}<>\\]/;

export const slugify = (value, fallback = 'imported') => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || fallback;

/** Split theme CSS into { light, dark, theme } maps of variable name (without "--") → raw value. */
export function readThemeCss(css) {
  const sets = { light: {}, dark: {}, theme: {} };
  for (const block of parseCssBlocks(css)) {
    const selectors = block.selector.split(',').map((part) => part.trim());
    const target = block.selector.startsWith('@theme') ? 'theme'
      : selectors.some((selector) => /\.dark\b|\[data-theme=["']?dark|\[data-mode=["']?dark|prefers-color-scheme:\s*dark/.test(selector) || block.parents.some((parent) => /prefers-color-scheme:\s*dark/.test(parent))) ? 'dark'
        : selectors.some((selector) => /^(?::root|html|\.light|:host|\[data-theme=["']?light["']?\])$/.test(selector)) ? 'light' : null;
    if (!target) continue;
    for (const [name, value] of Object.entries(block.declarations)) sets[target][name.replace(/^--/, '')] = value;
  }
  return sets;
}

function resolveValue(value, ...scopes) {
  let current = String(value).trim();
  for (let depth = 0; depth < 8; depth += 1) {
    const next = current.replace(/var\(\s*--([\w-]+)\s*(?:,\s*([^()]*))?\)/g, (match, name, fallback) => {
      const found = scopes.find((scope) => scope[name] != null)?.[name];
      return found != null ? found : fallback != null ? fallback.trim() : match;
    });
    if (next === current) break;
    current = next;
  }
  // shadcn v3 stores bare triplets that are wrapped in hsl() at use.
  const wrapped = current.match(/^hsl\(\s*([^()]+)\s*\)$/);
  if (wrapped && isHslTriplet(wrapped[1])) return `hsl(${wrapped[1].trim()})`;
  return isHslTriplet(current) ? `hsl(${current})` : current;
}

const lch = (value) => toOklch(value);
const shift = (value, delta) => { const { l, c, h } = lch(value); return formatOklch(fitGamut({ l: l + delta, c, h })); };
const tint = (l, c, h) => formatOklch({ l, c, h });
const mixColor = (a, b, amount) => {
  const [x, y] = [lch(a), lch(b)];
  const hue = x.c < 0.02 ? y.h : x.h;
  return formatOklch({ l: x.l + (y.l - x.l) * amount, c: x.c + (y.c - x.c) * amount, h: hue });
};
const bestInk = (background, candidates) => candidates.reduce((best, candidate) => (contrastRatio(candidate, background) > contrastRatio(best, background) ? candidate : best));

function deriveMode(mapped, mode, light) {
  const isLight = mode === 'light';
  const dir = isLight ? -1 : 1;
  const colors = { ...mapped };
  const fallback = baseline[mode];
  colors.surface ??= fallback.surface;
  colors.text ??= fallback.text;
  colors['surface-raised'] ??= colors.surface;
  colors['surface-muted'] ??= mixColor(colors.surface, colors.text, 0.04);
  colors['text-muted'] ??= mixColor(colors.text, colors.surface, 0.3);
  const grounds = [colors.surface, colors['surface-muted'], colors['surface-raised']];
  colors['text-subtle'] ??= solveContrast(lch(mixColor(colors['text-muted'], colors.surface, 0.15)), grounds, 4.5, dir);
  colors['text-inverse'] ??= light?.surface ?? colors.surface;
  colors.border ??= mixColor(colors.surface, colors.text, 0.15);
  colors['border-muted'] ??= mixColor(colors.border, colors.surface, 0.5);
  colors.accent ??= fallback.accent;
  colors['accent-foreground'] ??= bestInk(colors.accent, [colors.surface, colors.text, 'oklch(1 0 0)', 'oklch(0.15 0 0)']);
  const accent = lch(colors.accent);
  colors['accent-dark'] ??= shift(colors.accent, dir * 0.07);
  colors['accent-muted'] ??= tint(isLight ? 0.91 : lch(colors.surface).l + 0.11, Math.min(accent.c * 0.4, 0.07), accent.h);
  colors['accent-subtle'] ??= tint(isLight ? 0.965 : lch(colors.surface).l + 0.05, Math.min(accent.c * 0.2, 0.04), accent.h);
  colors.focus ??= colors.accent;
  colors['focus-foreground'] ??= bestInk(colors.focus, [colors['accent-foreground'], colors.surface, colors.text]);
  const surfaceL = lch(colors.surface).l;
  for (const role of STATUS_ROLES) {
    const base = colors[role];
    const hue = base ? lch(base).h : role === 'info' ? accent.h : STATUS_HUES[role];
    const chroma = base ? Math.max(lch(base).c, 0.08) : 0.15;
    colors[`${role}-subtle`] ??= tint(isLight ? 0.975 : surfaceL + 0.06, isLight ? 0.02 : 0.04, hue);
    colors[`${role}-muted`] ??= tint(isLight ? 0.93 : surfaceL + 0.13, isLight ? 0.05 : 0.07, hue);
    colors[`${role}-border`] ??= tint(isLight ? 0.86 : 0.5, Math.min(chroma * 0.6, 0.1), hue);
    colors[role] ??= solveContrast({ l: isLight ? 0.55 : 0.82, c: isLight ? chroma : Math.min(chroma, 0.14), h: hue }, [...grounds, colors[`${role}-subtle`]], 4.5, dir);
    colors[`${role}-foreground`] ??= bestInk(colors[role], [colors.surface, colors.text, 'oklch(1 0 0)', 'oklch(0.15 0 0)']);
  }
  const chartBase = lch(colors['chart-1'] ?? colors.accent);
  for (let index = 1; index <= 8; index += 1) {
    colors[`chart-${index}`] ??= solveContrast({ l: isLight ? 0.6 : 0.7, c: Math.max(chartBase.c, 0.1), h: (chartBase.h + index * 137.5) % 360 }, [colors.surface], 3, dir);
  }
  colors.sidebar ??= colors['surface-muted'];
  colors['sidebar-foreground'] ??= colors.text;
  colors['sidebar-accent'] ??= colors['accent-subtle'];
  colors['sidebar-border'] ??= colors.border;
  return Object.fromEntries(COLOR_TOKENS.map((key) => [key, colors[key]]));
}

const cleanValue = (value) => (value && !UNSAFE.test(value) ? value.trim() : null);

/**
 * Map shadcn variable sets onto the Gaudi contract.
 * sets = { light: { background: '…' }, dark: {…}, theme: {…} } (names without "--").
 */
export function mapShadcnVariables(sets, { id, name, repair = false } = {}) {
  const warnings = [];
  const mapped = { light: {}, dark: {} };
  const sources = { light: {}, dark: {} };
  for (const mode of ['light', 'dark']) {
    const scope = sets[mode] || {};
    for (const row of SHADCN_COLOR_MAP.filter((entry) => entry.import)) {
      if (scope[row.shadcn] == null || mapped[mode][row.ds] != null) continue;
      const value = resolveValue(scope[row.shadcn], scope, sets.light || {}, sets.theme || {});
      if (parseColor(value) && cleanValue(value)) {
        mapped[mode][row.ds] = value;
        sources[mode][row.ds] = `--${row.shadcn}`;
      } else warnings.push(`${mode}: --${row.shadcn} (${scope[row.shadcn]}) is not a colour Gaudi can read; derived instead.`);
    }
  }
  if (!Object.keys(sets.dark || {}).length) warnings.push('No .dark block: dark mode uses Gaudi\'s default dark palette.');
  const light = deriveMode(mapped.light, 'light');
  const dark = Object.keys(sets.dark || {}).length ? deriveMode(mapped.dark, 'dark', light) : { ...baseline.dark };

  const lookup = (key) => { for (const scope of [sets.theme, sets.light]) if (scope?.[key] != null) return resolveValue(scope[key], sets.light || {}, sets.theme || {}); return null; };
  const fonts = { ...baseline.fonts };
  let customFonts = false;
  for (const key of ['sans', 'serif', 'mono']) {
    const value = cleanValue(lookup(`font-${key}`));
    if (value && !/var\(/.test(value)) { fonts[key] = value; customFonts = true; }
  }
  if (customFonts) fonts.heading = cleanValue(lookup('font-heading')) || fonts.sans;
  const radiusValue = lookup('radius');
  const radius = radiusValue && RADIUS_PATTERN.test(radiusValue.trim()) ? radiusValue.trim() : baseline.radius;
  if (radiusValue && radius !== radiusValue.trim()) warnings.push(`--radius ${radiusValue} is not a plain length; kept ${radius}.`);

  const shadows = { light: { ...baseline.shadows.light }, dark: { ...baseline.shadows.dark } };
  for (const mode of ['light', 'dark']) {
    const assigned = new Set();
    for (const { shadcn, ds } of SHADCN_SHADOW_MAP) {
      const raw = (sets[mode] || {})[shadcn] ?? (mode === 'dark' ? null : sets.theme?.[shadcn]);
      const value = raw != null ? cleanValue(resolveValue(raw, sets[mode] || {}, sets.light || {}, sets.theme || {})) : null;
      if (value && !/var\(/.test(value)) { shadows[mode][ds] = value; assigned.add(ds); }
    }
    if (assigned.has('card') && !assigned.has('table')) shadows[mode].table = shadows[mode].card;
  }
  const spacingValue = lookup('spacing')?.match(/^([\d.]+)rem$/);
  const tracking = cleanValue(lookup('tracking-normal'));

  const theme = {
    id: slugify(id || name),
    name: name || 'Imported theme',
    source: 'shadcn',
    light,
    dark,
    shadows,
    fonts,
    radius,
    spacing: spacingValue ? Math.min(2, Math.max(0.5, Math.round((Number(spacingValue[1]) / 0.25) * 100) / 100)) : 1,
    ...(tracking && TRACKING_PATTERN.test(tracking) && !/^-?0(?:\.0+)?(?:em|rem|px)?$/.test(tracking) ? { tracking } : {})
  };
  if (repair) repairContrast(theme);
  return { theme, sources, warnings };
}

/**
 * importTheme(input, { id?, name?, repair? }) → { theme, report, warnings, format, sources }.
 * input: CSS text, JSON text, a shadcn registry item object or a Gaudi theme object.
 */
export function importTheme(input, options = {}) {
  let data = input;
  if (typeof input === 'string') {
    const text = input.trim();
    if (text.startsWith('{')) {
      try { data = JSON.parse(text); } catch (error) { throw new SyntaxError(`Theme JSON could not be parsed: ${error.message}`, { cause: error }); }
    } else data = null;
  }
  let result;
  let format;
  if (data && data.light && data.dark && data.fonts && data.shadows) {
    format = 'gaudi';
    const { $schema: _schema, ...theme } = data;
    result = { theme: { ...theme, ...(options.id ? { id: options.id } : {}), ...(options.name ? { name: options.name } : {}) }, sources: {}, warnings: [] };
  } else if (data && data.meta?.gaudiTheme) {
    format = 'gaudi-registry';
    result = { theme: { ...data.meta.gaudiTheme, ...(options.id ? { id: options.id } : {}), ...(options.name ? { name: options.name } : {}) }, sources: {}, warnings: [] };
  } else if (data && data.cssVars) {
    format = 'shadcn-registry';
    const strip = (set = {}) => Object.fromEntries(Object.entries(set).map(([key, value]) => [key.replace(/^--/, ''), value]));
    const registryName = data.name ? data.name.replace(/^theme-/, '') : undefined;
    result = mapShadcnVariables({ light: strip(data.cssVars.light), dark: strip(data.cssVars.dark), theme: strip(data.cssVars.theme) }, { id: options.id || registryName, name: options.name || data.title || registryName, repair: options.repair });
  } else if (typeof input === 'string') {
    format = 'css';
    const sets = readThemeCss(input);
    if (!Object.keys(sets.light).length && !Object.keys(sets.dark).length) throw new Error('No :root or .dark custom properties found in the theme CSS.');
    result = mapShadcnVariables(sets, options);
  } else throw new TypeError('Unsupported theme input: pass theme CSS, a shadcn registry item or a Gaudi theme.');
  const { valid, errors } = validateTheme(result.theme);
  if (!valid) throw new TypeError(`Imported theme is invalid: ${errors.slice(0, 5).join(' ')}`);
  return { ...result, format, report: checkContrast(result.theme) };
}
