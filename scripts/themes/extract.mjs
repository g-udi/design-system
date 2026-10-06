// Extracts the default theme and alias anchors from the runtime token CSS, and generates the theme
// JSON schema from the contract. Shared by `pnpm themes:build` and the theme contract tests.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCssBlocks } from '../../src/themes/cssBlocks.js';
import { COLOR_GROUPS, COLOR_TOKENS, DEFAULT_THEME_ID, FONT_TOKENS, RADIUS_VAR, SHADOW_TOKENS, SPACING_VAR, TOKEN_DESCRIPTIONS, colorVar, fontVar, shadowVar } from '../../src/themes/contract.js';

export const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (file) => readFileSync(path.join(root, file), 'utf8');

/** Default theme: every contract token resolved from tokens.css (dark falls back to :root, var() chains followed). */
export function extractDefaultTheme(tokensCss = read('src/tokens/tokens.css')) {
  const blocks = parseCssBlocks(tokensCss);
  const rootVars = Object.assign({}, ...blocks.filter((block) => block.selector === ':root').map((block) => block.declarations));
  const darkVars = Object.assign({}, ...blocks.filter((block) => block.selector === '.dark').map((block) => block.declarations));
  const resolve = (name, mode, seen = new Set()) => {
    const value = (mode === 'dark' ? darkVars[name] : undefined) ?? rootVars[name];
    if (value == null) throw new Error(`tokens.css does not define ${name}`);
    const alias = value.match(/^var\((--ds-[\w-]+)\)$/);
    if (!alias) return value;
    if (seen.has(name)) throw new Error(`Circular token ${name}`);
    return resolve(alias[1], mode, seen.add(name));
  };
  const colors = (mode) => Object.fromEntries(COLOR_TOKENS.map((key) => [key, resolve(colorVar(key), mode)]));
  const shadows = (mode) => Object.fromEntries(SHADOW_TOKENS.map((key) => [key, resolve(shadowVar(key), mode)]));
  return {
    id: DEFAULT_THEME_ID,
    name: 'Gaudi',
    description: 'The default Gaudi theme: neutral surfaces, functional blue accents, Inter and JetBrains Mono.',
    tags: ['default', 'neutral'],
    light: colors('light'),
    dark: colors('dark'),
    shadows: { light: shadows('light'), dark: shadows('dark') },
    fonts: Object.fromEntries(FONT_TOKENS.map((key) => [key, resolve(fontVar(key), 'light')])),
    radius: resolve(RADIUS_VAR, 'light'),
    spacing: Number(resolve(SPACING_VAR, 'light'))
  };
}

/** Declarations that alias contract tokens (tokens.css :root and theme.css's shadcn bridge). */
export function extractAnchors(tokensCss = read('src/tokens/tokens.css'), themeCss = read('src/tokens/theme.css')) {
  const contract = new Set([...COLOR_TOKENS.map(colorVar), ...SHADOW_TOKENS.map(shadowVar), ...FONT_TOKENS.map(fontVar), RADIUS_VAR, SPACING_VAR]);
  const anchors = new Map();
  const collect = (blocks, matches) => {
    for (const block of blocks.filter((entry) => matches(entry.selector))) {
      for (const [name, value] of Object.entries(block.declarations)) {
        if (!contract.has(name) && /var\(--ds-/.test(value)) anchors.set(name, value);
      }
    }
  };
  collect(parseCssBlocks(tokensCss), (selector) => selector === ':root');
  collect(parseCssBlocks(themeCss), (selector) => selector.split(',').map((part) => part.trim()).join(',') === ':root,.dark');
  return [...anchors];
}

export function themeSchema() {
  const colorProperties = Object.fromEntries(COLOR_TOKENS.map((key) => [key, { $ref: '#/$defs/color', description: TOKEN_DESCRIPTIONS[key] }]));
  const shadowProperties = Object.fromEntries(SHADOW_TOKENS.map((key) => [key, { $ref: '#/$defs/cssValue' }]));
  const colorSet = { type: 'object', additionalProperties: false, required: COLOR_TOKENS, properties: colorProperties };
  const shadowSet = { type: 'object', additionalProperties: false, required: SHADOW_TOKENS, properties: shadowProperties };
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://github.com/ahmadassaf/design-system/themes/theme.schema.json',
    title: 'Gaudi theme',
    description: `A Gaudi design-system theme: the themeable --ds-* contract for light and dark (src/tokens/THEMING.md). Colour groups: ${COLOR_GROUPS.map((group) => group.label).join(', ')}.`,
    type: 'object',
    additionalProperties: false,
    required: ['id', 'name', 'light', 'dark', 'shadows', 'fonts', 'radius'],
    properties: {
      $schema: { type: 'string' },
      id: { type: 'string', pattern: '^[a-z0-9][a-z0-9-]{0,47}$', description: 'Slug used in data-theme="<id>".' },
      name: { $ref: '#/$defs/cssValue' },
      description: { type: 'string' },
      tags: { type: 'array', items: { $ref: '#/$defs/cssValue' } },
      author: { $ref: '#/$defs/cssValue' },
      source: { $ref: '#/$defs/cssValue' },
      light: { ...colorSet, description: 'Colour tokens for light mode (CSS colours; OKLCH recommended).' },
      dark: { ...colorSet, description: 'Colour tokens for dark mode.' },
      shadows: { type: 'object', additionalProperties: false, required: ['light', 'dark'], properties: { light: shadowSet, dark: shadowSet }, description: '--ds-shadow-* box-shadow values per mode.' },
      fonts: { type: 'object', additionalProperties: false, required: FONT_TOKENS, properties: Object.fromEntries(FONT_TOKENS.map((key) => [key, { $ref: '#/$defs/cssValue', description: `font-family list for --ds-font-${key}` }])) },
      radius: { type: 'string', pattern: '^(?:0|\\d*\\.?\\d+(?:px|rem|em))$', description: 'Base corner radius (--ds-radius).' },
      spacing: { type: 'number', minimum: 0.5, maximum: 2, description: 'Density multiplier (--ds-space-scale).' },
      tracking: { type: 'string', pattern: '^-?(?:0|\\d*\\.?\\d+(?:em|rem|px))$', description: 'Body letter-spacing.' }
    },
    $defs: {
      cssValue: { type: 'string', minLength: 1, pattern: '^[^;{}<>\\\\]+$' },
      color: { type: 'string', minLength: 1, pattern: '^(?:#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla|oklch|oklab)\\([^;{}<>\\\\]+\\)|black|white|transparent)$' }
    }
  };
}
