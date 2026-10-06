// Deterministic, offline theme generation: one or two seed colours (or a random seed) → a full
// contrast-safe OKLCH palette for light and dark, plus fonts, radius and shadows. No network, no AI:
// the same options always produce the same theme.
import { contrastRatio, fitGamut, formatHex, formatOklch, parseColor, toOklch } from './color.js';
import { CONTRAST_PAIRS, STATUS_ROLES } from './contract.js';

const SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const stack = (family, fallback) => (family ? `"${family}", ${fallback}` : fallback);

/**
 * Curated open-source pairs (all on Google Fonts / Fontsource). Gaudi never downloads fonts:
 * each stack falls back to system faces until the app loads the webfont (next/font or @fontsource).
 */
export const FONT_PAIRS = [
  { id: 'system', label: 'System UI', sans: SANS, serif: SERIF, mono: MONO, heading: SANS },
  { id: 'inter', label: 'Inter + JetBrains Mono', sans: stack('Inter', SANS), serif: SERIF, mono: stack('JetBrains Mono', MONO), heading: stack('Inter', SANS) },
  { id: 'geist', label: 'Geist + Geist Mono', sans: stack('Geist', SANS), serif: SERIF, mono: stack('Geist Mono', MONO), heading: stack('Geist', SANS) },
  { id: 'plex', label: 'IBM Plex Sans, Serif + Mono', sans: stack('IBM Plex Sans', SANS), serif: stack('IBM Plex Serif', SERIF), mono: stack('IBM Plex Mono', MONO), heading: stack('IBM Plex Sans', SANS) },
  { id: 'editorial', label: 'Fraunces + Source Sans 3', sans: stack('Source Sans 3', SANS), serif: stack('Fraunces', SERIF), mono: stack('Source Code Pro', MONO), heading: stack('Fraunces', SERIF) },
  { id: 'literary', label: 'Source Serif 4 + Source Sans 3', sans: stack('Source Sans 3', SANS), serif: stack('Source Serif 4', SERIF), mono: stack('Source Code Pro', MONO), heading: stack('Source Serif 4', SERIF) },
  { id: 'grotesk', label: 'Space Grotesk + Space Mono', sans: stack('Space Grotesk', SANS), serif: SERIF, mono: stack('Space Mono', MONO), heading: stack('Space Grotesk', SANS) },
  { id: 'dm', label: 'DM Sans + DM Serif Display', sans: stack('DM Sans', SANS), serif: stack('DM Serif Display', SERIF), mono: stack('DM Mono', MONO), heading: stack('DM Serif Display', SERIF) },
  { id: 'humanist', label: 'Nunito Sans + Lora', sans: stack('Nunito Sans', SANS), serif: stack('Lora', SERIF), mono: stack('Fira Code', MONO), heading: stack('Lora', SERIF) },
  { id: 'mono', label: 'JetBrains Mono everywhere', sans: stack('JetBrains Mono', MONO), serif: SERIF, mono: stack('JetBrains Mono', MONO), heading: stack('JetBrains Mono', MONO) },
  { id: 'manrope', label: 'Manrope + Fira Code', sans: stack('Manrope', SANS), serif: SERIF, mono: stack('Fira Code', MONO), heading: stack('Manrope', SANS) }
];

const fontsFor = (pair) => {
  const found = typeof pair === 'object' ? pair : FONT_PAIRS.find((entry) => entry.id === pair) || FONT_PAIRS[1];
  return { sans: found.sans, serif: found.serif, mono: found.mono, heading: found.heading };
};

/** Seeded PRNG (mulberry32 over an FNV-1a hash of the seed). */
export function createRandom(seed = 1) {
  let hash = 2166136261;
  for (const char of String(seed)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  let state = hash >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lchString = (l, c, h, alpha) => formatOklch({ l, c, h }, alpha);
const lightnessOf = (value) => toOklch(value).l;

/**
 * Move lightness (dir -1 darker, +1 lighter) until the colour reaches `min` contrast against every
 * background. Hue and chroma are kept (chroma shrinks only to stay inside sRGB).
 */
export function solveContrast({ l, c, h }, backgrounds, min, dir) {
  const target = min + 0.02;
  let lightness = l;
  for (let step = 0; step < 220; step += 1) {
    const candidate = formatOklch(fitGamut({ l: lightness, c, h }));
    if (backgrounds.every((background) => contrastRatio(candidate, background) >= target)) return candidate;
    lightness += dir * 0.005;
    if (lightness < 0 || lightness > 1) break;
  }
  return dir < 0 ? 'oklch(0 0 0)' : 'oklch(1 0 0)';
}

const seedLch = (value, fallback) => {
  const parsed = value ? toOklch(value) : null;
  return parsed || fallback;
};

const STATUS_HUES = { success: 150, warning: 70, danger: 27, discovery: 185, info: 250, attention: 5 };
const STATUS_CHROMA = { success: 0.15, warning: 0.15, danger: 0.19, discovery: 0.12, info: 0.16, attention: 0.19 };
const CHART_OFFSETS = [0, 140, 50, 260, 100, 320, 200, 20];

function shadowScale(strength, mode, hue, chroma) {
  const k = strength / 0.5;
  const tint = (alpha) => (mode === 'light' ? lchString(0.2, Math.min(chroma * 2, 0.03), hue, Math.min(alpha, 0.9)) : `oklch(0 0 0 / ${Math.min(alpha * 3.2, 0.85).toFixed(3)})`);
  const ring = mode === 'light' ? tint(0.08) : 'oklch(1 0 0 / 0.06)';
  const layer = (geometry, alpha) => (k > 0 ? [`${geometry} ${tint(alpha * k)}`] : []);
  const join = (...layers) => layers.flat().join(', ') || 'none';
  return {
    card: join(layer('0 1px 2px 0', 0.05)),
    'card-hover': join(layer('0 10px 20px -12px', 0.25)),
    floating: join(layer('0 2px 3px -1px', 0.1), `0 0 0 1px ${ring}`),
    popover: join(layer('0 20px 25px -5px', 0.1), layer('0 10px 10px -5px', 0.04), `0 0 0 1px ${ring}`),
    launcher: join(layer('0 28px 64px -24px', 0.42), layer('0 10px 28px -18px', 0.24), k > 0 ? [] : [`0 0 0 1px ${ring}`]),
    table: join(layer('0 1px 2px', 0.04))
  };
}

/** Shadow scales for both modes from a strength (0 = flat with hairline rings, 0.5 ≈ Gaudi, 1 = deep). */
export const generateShadows = (strength, { hue = 0, chroma = 0 } = {}) => ({ light: shadowScale(strength, 'light', hue, chroma), dark: shadowScale(strength, 'dark', hue, chroma) });

function buildMode(mode, options) {
  const { brand, secondary, neutralHue, neutralChroma, vivid, contrast, sidebar, raised, surfaces = {} } = options;
  const light = mode === 'light';
  const dir = light ? -1 : 1;
  const textMin = contrast === 'high' ? 7 : 4.5;
  const n = (l, scale = 1) => lchString(l, neutralChroma * scale, neutralHue);
  const base = light ? surfaces.surface ?? 0.995 : surfaces.surface ?? 0.19;
  const colors = {};
  colors.surface = n(base, light ? 0.5 : 1);
  colors['surface-muted'] = n(surfaces.muted ?? (light ? base - 0.025 : base + 0.045));
  colors['surface-raised'] = raised === 'white' && light ? 'oklch(1 0 0)' : n(surfaces.raised ?? (light ? base : base + 0.025), light ? 0.5 : 1);
  colors.border = n(surfaces.border ?? (light ? (contrast === 'high' ? 0.55 : base - 0.095) : (contrast === 'high' ? 0.6 : base + 0.13)));
  colors['border-muted'] = n(surfaces.borderMuted ?? (light ? base - 0.05 : base + 0.07));
  const grounds = [colors.surface, colors['surface-muted'], colors['surface-raised']];

  // Accent: the brand colour, moved only in lightness until it reads as text and carries its label.
  const accentStart = light ? Math.min(brand.l, 0.62) : Math.max(brand.l, 0.74);
  const accentChroma = light ? brand.c : Math.min(brand.c, 0.17);
  const lightInk = lchString(0.99, Math.min(brand.c, 0.012), brand.h);
  colors.accent = solveContrast({ l: accentStart, c: accentChroma, h: brand.h }, light ? [...grounds, lightInk] : grounds, textMin === 7 && light ? 7 : 4.5, dir);
  colors['accent-dark'] = solveContrast({ l: lightnessOf(colors.accent) + dir * 0.07, c: accentChroma, h: brand.h }, light ? [lightInk] : grounds, 4.5, dir);
  colors['accent-foreground'] = light ? lightInk : solveContrast({ l: 0.24, c: Math.min(brand.c * 0.4, 0.05), h: brand.h }, [colors.accent, colors['accent-dark']], 4.5, -1);
  colors['accent-muted'] = lchString(light ? 0.91 : base + 0.11, Math.min(brand.c * (light ? 0.4 : 0.45), light ? 0.07 : 0.08), brand.h);
  colors['accent-subtle'] = lchString(light ? 0.965 : base + 0.05, Math.min(brand.c * (light ? 0.18 : 0.3), light ? 0.035 : 0.05), brand.h);

  // Status roles keep conventional hues so meaning survives any brand.
  for (const role of STATUS_ROLES) {
    const hue = role === 'info' ? brand.h : role === 'discovery' && secondary ? secondary.h : STATUS_HUES[role];
    const chroma = STATUS_CHROMA[role] * vivid;
    colors[`${role}-subtle`] = lchString(light ? 0.975 : base + 0.06, (light ? 0.02 : 0.04) * vivid, hue);
    colors[`${role}-muted`] = lchString(light ? 0.93 : base + 0.13, (light ? 0.05 : 0.07) * vivid, hue);
    colors[`${role}-border`] = lchString(light ? 0.86 : 0.5, 0.09 * vivid, hue);
    const ink = light ? lchString(0.99, 0.005, hue) : null;
    colors[role] = solveContrast({ l: light ? 0.55 : 0.82, c: light ? chroma : Math.min(chroma, 0.14), h: hue }, [...grounds, colors[`${role}-subtle`], ...(ink ? [ink] : [])], light && contrast === 'high' ? 7 : 4.5, dir);
    colors[`${role}-foreground`] = ink || solveContrast({ l: 0.24, c: 0.05, h: hue }, [colors[role]], 4.5, -1);
  }

  // Focus: the secondary seed when given, otherwise the accent.
  if (secondary) {
    const ink = lightInk;
    colors.focus = solveContrast({ l: light ? Math.min(secondary.l, 0.6) : Math.max(secondary.l, 0.76), c: secondary.c, h: secondary.h }, light ? [...grounds, ink] : grounds, 4.5, dir);
    colors['focus-foreground'] = light ? ink : solveContrast({ l: 0.24, c: 0.05, h: secondary.h }, [colors.focus], 4.5, -1);
  } else {
    colors.focus = colors.accent;
    colors['focus-foreground'] = colors['accent-foreground'];
  }

  CHART_OFFSETS.forEach((offset, index) => {
    const key = `chart-${index + 1}`;
    if (index === 0) { colors[key] = colors.accent; return; }
    const hue = index === 1 && secondary ? secondary.h : (brand.h + offset) % 360;
    const chroma = index === 5 ? 0.04 : Math.max(0.1, Math.min(0.16, brand.c + 0.02)) * vivid;
    const startL = light ? (index % 2 ? 0.58 : 0.66) : (index % 2 ? 0.74 : 0.66);
    colors[key] = solveContrast({ l: startL, c: chroma, h: hue }, [colors.surface], 3, dir);
  });

  const tinted = lchString(light ? 0.955 : base + 0.03, Math.min(brand.c * 0.12, 0.03), brand.h);
  colors.sidebar = sidebar === 'surface' ? colors.surface : sidebar === 'tinted' ? tinted : colors['surface-muted'];
  colors['sidebar-accent'] = colors['accent-subtle'];
  colors['sidebar-border'] = colors.border;

  const textGrounds = [...grounds, colors['accent-subtle'], colors['accent-muted'], colors.sidebar, ...STATUS_ROLES.map((role) => colors[`${role}-muted`])];
  colors.text = solveContrast({ l: light ? (contrast === 'high' ? 0.12 : 0.21) : (contrast === 'high' ? 0.97 : 0.9), c: neutralChroma * 1.5, h: neutralHue }, textGrounds, textMin, dir);
  colors['text-muted'] = solveContrast({ l: light ? 0.44 : 0.77, c: neutralChroma * 1.5, h: neutralHue }, grounds, textMin, dir);
  colors['text-subtle'] = solveContrast({ l: light ? 0.54 : 0.7, c: neutralChroma * 1.2, h: neutralHue }, grounds, 4.5, dir);
  colors['text-inverse'] = options.inverse;
  colors['sidebar-foreground'] = colors.text;
  return colors;
}

/**
 * Nudge foregrounds that miss a contract pair (away from their background's lightness). A safety
 * net for hand-tuned overrides and imports; generated palettes already satisfy every pair.
 */
const TINTS = /-(?:muted|subtle)$|^sidebar(?:-accent)?$/;

/** The smallest lightness change (darker or lighter) that gives `color` `min` contrast against `other`. */
function nearestPassing(color, other, min) {
  const lch = toOklch(color);
  const options = [-1, 1].map((dir) => solveContrast(lch, [other], min, dir)).filter((candidate) => contrastRatio(candidate, other) >= min);
  return options.sort((a, b) => Math.abs(lightnessOf(a) - lch.l) - Math.abs(lightnessOf(b) - lch.l))[0] || color;
}

export function repairContrast(theme) {
  for (const mode of ['light', 'dark']) {
    const colors = theme[mode];
    for (let pass = 0; pass < 3; pass += 1) {
      for (const { fg, bg, min } of CONTRAST_PAIRS) {
        if (fg === 'surface' || contrastRatio(colors[fg], colors[bg]) >= min) continue;
        // Tinted fills move away from shared text colours first; otherwise the foreground moves.
        if (TINTS.test(bg) && !TINTS.test(fg)) colors[bg] = nearestPassing(colors[bg], colors[fg], min);
        if (contrastRatio(colors[fg], colors[bg]) < min) colors[fg] = nearestPassing(colors[fg], colors[bg], min);
      }
    }
  }
  return theme;
}

/**
 * generateTheme({ brand?, secondary?, seed?, id?, name?, fonts?, radius?, shadow?, ... }) → DS theme.
 * brand/secondary accept any CSS colour; without a brand the seed picks a harmonious random palette.
 * Options: neutral ('tinted' | 'neutral' | { hue, chroma }), contrast ('normal' | 'high'), vivid (0.5–1.3),
 * sidebar ('muted' | 'surface' | 'tinted'), raised ('surface' | 'white'), shadow (0–1), spacing,
 * surfaces { light: {surface, muted, raised, border, borderMuted}, dark: {…} } (OKLCH lightness),
 * overrides { light: {token: colour}, dark: {…} } applied before the contrast repair pass.
 */
export function generateTheme(options = {}) {
  const random = createRandom(options.seed ?? options.brand ?? 1);
  const pick = (list) => list[Math.floor(random() * list.length)];
  const brand = seedLch(options.brand, { l: 0.55 + random() * 0.1, c: 0.09 + random() * 0.11, h: random() * 360 });
  const secondary = options.secondary ? seedLch(options.secondary, null) : null;
  const tintChroma = options.neutral === 'neutral' ? 0 : typeof options.neutral === 'object' ? options.neutral.chroma : options.neutral === 'tinted' ? 0.012 : pick([0, 0.004, 0.008, 0.014]);
  const neutralHue = typeof options.neutral === 'object' && options.neutral.hue != null ? options.neutral.hue : random() < 0.7 ? brand.h : pick([70, 250]);
  const settings = {
    brand,
    secondary,
    neutralHue,
    neutralChroma: tintChroma,
    vivid: options.vivid ?? 0.85 + random() * 0.3,
    contrast: options.contrast || 'normal',
    sidebar: options.sidebar || pick(['muted', 'muted', 'surface', 'tinted']),
    raised: options.raised || 'surface'
  };
  const fonts = fontsFor(options.fonts || pick(FONT_PAIRS.slice(1)).id);
  const radius = options.radius ?? pick(['0px', '2px', '4px', '6px', '8px', '12px']);
  const shadow = options.shadow ?? pick([0, 0.3, 0.5, 0.8]);
  const lightSurface = settings.contrast === 'high' ? 1 : (options.surfaces?.light?.surface ?? 0.995);
  const inverse = lchString(lightSurface, tintChroma * 0.5, neutralHue);
  const light = buildMode('light', { ...settings, inverse, surfaces: { ...options.surfaces?.light, surface: lightSurface } });
  const dark = buildMode('dark', { ...settings, inverse, surfaces: { ...(settings.contrast === 'high' ? { surface: 0.12 } : {}), ...options.surfaces?.dark } });
  Object.assign(light, options.overrides?.light);
  Object.assign(dark, options.overrides?.dark);
  const brandHex = formatHex(parseColor(formatOklch(brand)));
  const theme = {
    id: options.id || `custom-${brandHex.slice(1)}`,
    name: options.name || `Custom ${brandHex}`,
    ...(options.description ? { description: options.description } : {}),
    ...(options.tags ? { tags: options.tags } : {}),
    light,
    dark,
    shadows: generateShadows(shadow, { hue: neutralHue, chroma: tintChroma }),
    fonts,
    radius,
    spacing: options.spacing ?? 1,
    ...(options.tracking ? { tracking: options.tracking } : {})
  };
  return repairContrast(theme);
}

/** A harmonious random theme for a seed (Studio "Randomise"). */
export const randomTheme = (seed, options = {}) => generateTheme({ ...options, seed, brand: undefined });
