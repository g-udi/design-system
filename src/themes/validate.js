// Theme validation against the contract. Mirrors themes/theme.schema.json (a contract test keeps
// them aligned) and additionally parses every colour, so compiled CSS can never be malformed.
import { parseColor } from './color.js';
import { COLOR_TOKENS, FONT_TOKENS, SHADOW_TOKENS } from './contract.js';

export const THEME_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,47}$/;
export const RADIUS_PATTERN = /^(?:0|\d*\.?\d+(?:px|rem|em))$/;
export const TRACKING_PATTERN = /^-?(?:0|\d*\.?\d+(?:em|rem|px))$/;
// Values are written into <style> elements: forbid anything that could close a declaration or block.
const UNSAFE = /[;{}<>\\]|\/\*|\*\//;
const TOP_LEVEL = new Set(['$schema', 'id', 'name', 'description', 'tags', 'author', 'source', 'light', 'dark', 'shadows', 'fonts', 'radius', 'spacing', 'tracking']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const safeString = (value) => typeof value === 'string' && value.trim() !== '' && !UNSAFE.test(value);

/** Returns { valid, errors[] } for a DS theme object. */
export function validateTheme(theme) {
  const errors = [];
  if (!isObject(theme)) return { valid: false, errors: ['Theme must be an object.'] };
  for (const key of Object.keys(theme)) if (!TOP_LEVEL.has(key)) errors.push(`Unknown property "${key}".`);
  if (typeof theme.id !== 'string' || !THEME_ID_PATTERN.test(theme.id)) errors.push('id must be a lowercase slug (a-z, 0-9, -; up to 48 characters).');
  if (!safeString(theme.name)) errors.push('name must be a non-empty string without ; { } < > \\.');
  if (theme.description != null && (typeof theme.description !== 'string' || UNSAFE.test(theme.description))) errors.push('description must be a plain string.');
  if (theme.tags != null && (!Array.isArray(theme.tags) || !theme.tags.every(safeString))) errors.push('tags must be an array of strings.');
  for (const key of ['author', 'source']) if (theme[key] != null && !safeString(theme[key])) errors.push(`${key} must be a plain string.`);

  for (const mode of ['light', 'dark']) {
    const colors = theme[mode];
    if (!isObject(colors)) { errors.push(`${mode} must be an object of colour tokens.`); continue; }
    for (const key of COLOR_TOKENS) {
      if (!(key in colors)) errors.push(`${mode}.${key} is missing.`);
      else if (!safeString(colors[key]) || !parseColor(colors[key])) errors.push(`${mode}.${key} must be a CSS colour (hex, rgb(), hsl(), oklch(), oklab()); got ${JSON.stringify(colors[key])}.`);
    }
    for (const key of Object.keys(colors)) if (!COLOR_TOKENS.includes(key)) errors.push(`${mode}.${key} is not a themeable colour token.`);
  }

  if (!isObject(theme.shadows)) errors.push('shadows must be an object with light and dark scales.');
  else {
    for (const key of Object.keys(theme.shadows)) if (key !== 'light' && key !== 'dark') errors.push(`shadows.${key} is not a mode.`);
    for (const mode of ['light', 'dark']) {
      const scale = theme.shadows[mode];
      if (!isObject(scale)) { errors.push(`shadows.${mode} must be an object.`); continue; }
      for (const key of SHADOW_TOKENS) if (!safeString(scale[key])) errors.push(`shadows.${mode}.${key} must be a box-shadow value.`);
      for (const key of Object.keys(scale)) if (!SHADOW_TOKENS.includes(key)) errors.push(`shadows.${mode}.${key} is not a themeable shadow.`);
    }
  }

  if (!isObject(theme.fonts)) errors.push('fonts must be an object.');
  else {
    for (const key of FONT_TOKENS) if (!safeString(theme.fonts[key])) errors.push(`fonts.${key} must be a font-family list.`);
    for (const key of Object.keys(theme.fonts)) if (!FONT_TOKENS.includes(key)) errors.push(`fonts.${key} is not a themeable font.`);
  }
  if (typeof theme.radius !== 'string' || !RADIUS_PATTERN.test(theme.radius)) errors.push('radius must be a length such as "4px" or "0.5rem".');
  if (theme.spacing != null && !(typeof theme.spacing === 'number' && theme.spacing >= 0.5 && theme.spacing <= 2)) errors.push('spacing must be a number between 0.5 and 2.');
  if (theme.tracking != null && (typeof theme.tracking !== 'string' || !TRACKING_PATTERN.test(theme.tracking))) errors.push('tracking must be a length such as "0em" or "-0.01em".');
  return { valid: errors.length === 0, errors };
}

export function assertTheme(theme) {
  const { valid, errors } = validateTheme(theme);
  if (!valid) throw new TypeError(`Invalid theme${theme?.id ? ` "${theme.id}"` : ''}: ${errors.slice(0, 5).join(' ')}${errors.length > 5 ? ` (+${errors.length - 5} more)` : ''}`);
  return theme;
}
