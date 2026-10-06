export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const byte = value => Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0');

export function normalizeHex(value) {
  if (typeof value !== 'string') return null;
  const hex = value.trim().replace(/^#/, '');
  if (!/^(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(hex)) return null;
  const expanded = (hex.length < 5 ? [...hex].map(char => char + char).join('') : hex).toLowerCase();
  return `#${expanded.endsWith('ff') && expanded.length === 8 ? expanded.slice(0, 6) : expanded}`;
}

export function toHex({ r, g, b, a = 1 }) {
  const alpha = byte(clamp(a) * 255);
  return `#${byte(r)}${byte(g)}${byte(b)}${alpha === 'ff' ? '' : alpha}`;
}

export function hsvToRgb({ h, s, v }) {
  const hue = ((h % 360) + 360) % 360 / 60;
  const chroma = v * s;
  const x = chroma * (1 - Math.abs(hue % 2 - 1));
  const channels = [[chroma, x, 0], [x, chroma, 0], [0, chroma, x], [0, x, chroma], [x, 0, chroma], [chroma, 0, x]][Math.floor(hue)];
  const [r, g, b] = channels.map(channel => Math.round((channel + v - chroma) * 255));
  return { r, g, b };
}

export function rgbToHsv({ r, g, b }) {
  const [red, green, blue] = [r, g, b].map(channel => channel / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let h = 0;
  if (delta) {
    if (max === red) h = ((green - blue) / delta) % 6;
    else if (max === green) h = (blue - red) / delta + 2;
    else h = (red - green) / delta + 4;
  }
  return { h: (h * 60 + 360) % 360, s: max ? delta / max : 0, v: max };
}

export function rgbToHsl(rgb) {
  const { h, s, v } = rgbToHsv(rgb);
  const l = v * (1 - s / 2);
  return { h: Math.round(h), s: Math.round((l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l)) * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }) {
  const lightness = l / 100;
  const v = lightness + s / 100 * Math.min(lightness, 1 - lightness);
  return hsvToRgb({ h, s: v ? 2 * (1 - lightness / v) : 0, v });
}

export function parseColor(value) {
  const hex = normalizeHex(value);
  if (hex) return {
    r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16),
    a: hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1
  };
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^(rgba?|hsla?)\(([^)]+)\)$/i);
  if (!match) return null;
  let parts;
  if (match[2].includes(',')) {
    if (match[2].includes('/')) return null;
    parts = match[2].split(',').map(part => part.trim());
  } else {
    const segments = match[2].trim().split(/\s*\/\s*/);
    if (segments.length > 2) return null;
    parts = segments[0].split(/\s+/);
    if (parts.length !== 3) return null;
    if (segments.length === 2) parts.push(segments[1]);
  }
  if (parts.length < 3 || parts.length > 4 || !parts.every(part => /^[-+]?(?:\d*\.)?\d+(?:%|deg)?$/.test(part))) return null;
  const values = parts.map(parseFloat);
  if (!values.every(Number.isFinite) || parts[3]?.endsWith('deg')) return null;
  const a = parts[3] ? clamp(values[3] / (parts[3].endsWith('%') ? 100 : 1)) : 1;
  if (match[1].toLowerCase().startsWith('hsl')) {
    if (!parts[1].endsWith('%') || !parts[2].endsWith('%') || parts[0].endsWith('%')) return null;
    return { ...hslToRgb({ h: values[0], s: clamp(values[1], 0, 100), l: clamp(values[2], 0, 100) }), a };
  }
  if (parts.slice(0, 3).some(part => part.endsWith('deg'))) return null;
  const [r, g, b] = values.slice(0, 3).map((channel, index) => Math.round(clamp(parts[index].endsWith('%') ? channel * 255 / 100 : channel, 0, 255)));
  return { r, g, b, a };
}

export function normalizeColor(value) {
  const rgba = parseColor(value);
  return rgba ? toHex(rgba) : null;
}
