// Colour maths for themes: CSS colour parsing, OKLab/OKLCH conversion, sRGB gamut mapping and
// WCAG 2 contrast. Dependency-free so the CLI, MCP server and browser share one implementation.

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const round = (value, digits) => Number(value.toFixed(digits));

const NAMED = { black: '#000000', white: '#ffffff', transparent: '#00000000' };

const toLinear = (channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
const fromLinear = (channel) => (channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055);

/** sRGB (0–1, gamma encoded) → OKLab. */
export function rgbToOklab({ r, g, b }) {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  };
}

/** OKLab → sRGB (0–1, gamma encoded; may fall outside 0–1 when out of gamut). */
export function oklabToRgb({ l, a, b }) {
  const l1 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m1 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s1 = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return {
    r: fromLinear(4.0767416621 * l1 - 3.3077115913 * m1 + 0.2309699292 * s1),
    g: fromLinear(-1.2684380046 * l1 + 2.6097574011 * m1 - 0.3413193965 * s1),
    b: fromLinear(-0.0041960863 * l1 - 0.7034186147 * m1 + 1.707614701 * s1)
  };
}

export const oklchToOklab = ({ l, c, h }) => ({ l, a: c * Math.cos((h * Math.PI) / 180), b: c * Math.sin((h * Math.PI) / 180) });
export function oklabToOklch({ l, a, b }) {
  const c = Math.hypot(a, b);
  const h = c < 1e-4 ? 0 : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return { l, c, h };
}
export const rgbToOklch = (rgb) => oklabToOklch(rgbToOklab(rgb));
export const oklchToRgb = (lch) => oklabToRgb(oklchToOklab(lch));

const inGamut = ({ r, g, b }) => [r, g, b].every((channel) => channel >= -1e-4 && channel <= 1 + 1e-4);

/** Reduce chroma (keeping lightness and hue) until the colour fits sRGB, as CSS gamut mapping does. */
export function fitGamut({ l, c, h }) {
  const lightness = clamp01(l);
  if (inGamut(oklchToRgb({ l: lightness, c, h }))) return { l: lightness, c, h };
  let low = 0;
  let high = c;
  for (let step = 0; step < 24; step += 1) {
    const mid = (low + high) / 2;
    if (inGamut(oklchToRgb({ l: lightness, c: mid, h }))) low = mid;
    else high = mid;
  }
  return { l: lightness, c: low, h };
}

const hueOf = (value) => {
  const match = String(value).trim().match(/^(-?[\d.]+)(deg|rad|turn|grad)?$/);
  if (!match) return Number.NaN;
  const amount = Number(match[1]);
  const unit = match[2] || 'deg';
  return unit === 'rad' ? (amount * 180) / Math.PI : unit === 'turn' ? amount * 360 : unit === 'grad' ? amount * 0.9 : amount;
};
const numberOrPercent = (value, scale = 1) => {
  const text = String(value).trim();
  if (text === 'none') return 0;
  return text.endsWith('%') ? (Number(text.slice(0, -1)) / 100) * scale : Number(text);
};
const alphaOf = (value) => (value == null ? 1 : clamp01(numberOrPercent(value)));

function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const k = (n) => (n + hue / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: f(0), g: f(8), b: f(4) };
}

const splitArgs = (inner) => {
  const [main, alpha] = inner.split('/').map((part) => part.trim());
  const parts = main.includes(',') ? main.split(',').map((part) => part.trim()) : main.split(/\s+/);
  const values = parts.filter(Boolean);
  // Legacy comma syntax carries alpha as a fourth argument.
  return values.length === 4 && alpha == null ? { values: values.slice(0, 3), alpha: values[3] } : { values, alpha };
};

/** A bare shadcn v3 HSL triplet such as "222.2 84% 4.9%". */
export const isHslTriplet = (value) => /^-?[\d.]+(?:deg)?\s+[\d.]+%\s+[\d.]+%(?:\s*\/\s*[\d.]+%?)?$/.test(String(value).trim());

/**
 * Parse a CSS colour into { r, g, b, alpha } (sRGB, 0–1; channels may exceed the gamut for
 * OKLCH/OKLab input). Supports hex, rgb(), hsl(), oklch(), oklab(), bare HSL triplets and
 * black/white/transparent. Returns null for anything else (var(), color-mix(), keywords).
 */
export function parseColor(input) {
  if (input == null) return null;
  const value = String(input).trim().toLowerCase();
  if (NAMED[value]) return parseColor(NAMED[value]);
  if (isHslTriplet(value)) return parseColor(`hsl(${value})`);
  const hex = value.match(/^#([\da-f]{3,8})$/);
  if (hex) {
    let digits = hex[1];
    if (digits.length === 3 || digits.length === 4) digits = [...digits].map((digit) => digit + digit).join('');
    if (digits.length !== 6 && digits.length !== 8) return null;
    const channel = (index) => parseInt(digits.slice(index, index + 2), 16) / 255;
    return { r: channel(0), g: channel(2), b: channel(4), alpha: digits.length === 8 ? channel(6) : 1 };
  }
  const fn = value.match(/^([a-z]+)\((.*)\)$/s);
  if (!fn) return null;
  const { values, alpha } = splitArgs(fn[2]);
  if (values.length !== 3) return null;
  let rgb;
  if (fn[1] === 'rgb' || fn[1] === 'rgba') {
    rgb = Object.fromEntries(['r', 'g', 'b'].map((key, index) => [key, numberOrPercent(values[index], 255) / 255]));
  } else if (fn[1] === 'hsl' || fn[1] === 'hsla') {
    rgb = hslToRgb(hueOf(values[0]), numberOrPercent(values[1].endsWith('%') ? values[1] : `${values[1]}%`), numberOrPercent(values[2].endsWith('%') ? values[2] : `${values[2]}%`));
  } else if (fn[1] === 'oklch') {
    rgb = oklchToRgb({ l: numberOrPercent(values[0]), c: numberOrPercent(values[1], 0.4), h: values[2] === 'none' ? 0 : hueOf(values[2]) });
  } else if (fn[1] === 'oklab') {
    rgb = oklabToRgb({ l: numberOrPercent(values[0]), a: numberOrPercent(values[1], 0.4), b: numberOrPercent(values[2], 0.4) });
  } else return null;
  if (![rgb.r, rgb.g, rgb.b].every(Number.isFinite)) return null;
  return { ...rgb, alpha: alphaOf(alpha) };
}

export const isColor = (value) => parseColor(value) !== null;

/** OKLCH of any parsed CSS colour, or null. */
export function toOklch(value) {
  const rgb = typeof value === 'string' ? parseColor(value) : value;
  return rgb ? rgbToOklch(rgb) : null;
}

/** Format { l, c, h } as a CSS oklch() string after gamut mapping. */
export function formatOklch(lch, alpha = 1) {
  const { l, c, h } = fitGamut(lch);
  const chroma = round(c, 4);
  const body = `${round(l, 4)} ${chroma} ${chroma === 0 ? 0 : round(h, 2)}`;
  return alpha < 1 ? `oklch(${body} / ${round(alpha, 3)})` : `oklch(${body})`;
}

export function formatHex(value) {
  const rgb = typeof value === 'string' ? parseColor(value) : value;
  if (!rgb) return null;
  const hex = (channel) => Math.round(clamp01(channel) * 255).toString(16).padStart(2, '0');
  return `#${hex(rgb.r)}${hex(rgb.g)}${hex(rgb.b)}${rgb.alpha != null && rgb.alpha < 1 ? hex(rgb.alpha) : ''}`;
}

/** WCAG 2 relative luminance of a colour (clipped to sRGB, as displays render it). */
export function luminance(value) {
  const rgb = typeof value === 'string' ? parseColor(value) : value;
  if (!rgb) return Number.NaN;
  const mapped = inGamut(rgb) ? rgb : oklchToRgb(fitGamut(rgbToOklch(rgb)));
  const [r, g, b] = [mapped.r, mapped.g, mapped.b].map((channel) => toLinear(clamp01(channel)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio between two opaque colours (1–21). NaN when either cannot be parsed. */
export function contrastRatio(foreground, background) {
  const [high, low] = [luminance(foreground), luminance(background)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

/** Mix two colours in OKLab (amount = share of `b`). Returns an oklch() string. */
export function mixOklab(a, b, amount) {
  const [x, y] = [parseColor(a), parseColor(b)].map((rgb) => rgbToOklab(rgb));
  return formatOklch(oklabToOklch({ l: x.l + (y.l - x.l) * amount, a: x.a + (y.a - x.a) * amount, b: x.b + (y.b - x.b) * amount }));
}
