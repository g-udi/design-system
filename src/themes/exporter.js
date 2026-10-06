// Gaudi theme → DS JSON, scoped CSS, shadcn-compatible CSS variables or a shadcn registry item.
import { compileTheme } from './compile.js';
import { SHADCN_COLOR_MAP, SHADCN_SHADOW_MAP } from './contract.js';
import { assertTheme } from './validate.js';

export const THEME_EXPORT_FORMATS = ['json', 'css', 'shadcn', 'registry'];

/** shadcn variable map (names without "--") for one mode, including radius, fonts and shadows. */
export function toShadcnVariables(theme, mode) {
  const vars = {};
  for (const row of SHADCN_COLOR_MAP) if (!row.exportSkip) vars[row.shadcn] = theme[mode][row.ds];
  for (const { shadcn, ds } of SHADCN_SHADOW_MAP) vars[shadcn] = theme.shadows[mode][ds];
  vars['shadow-2xs'] = theme.shadows[mode].table;
  vars.shadow = theme.shadows[mode].card;
  if (mode === 'light') {
    Object.assign(vars, { radius: theme.radius, 'font-sans': theme.fonts.sans, 'font-serif': theme.fonts.serif, 'font-mono': theme.fonts.mono });
    if (theme.fonts.heading !== theme.fonts.sans) vars['font-heading'] = theme.fonts.heading;
    if (theme.tracking) vars['tracking-normal'] = theme.tracking;
  }
  return vars;
}

const declarations = (vars) => Object.entries(vars).map(([name, value]) => `  --${name}: ${value};`).join('\n');
const SHADCN_THEME_INLINE = [
  ...SHADCN_COLOR_MAP.filter((row) => !row.exportSkip).map((row) => `  --color-${row.shadcn}: var(--${row.shadcn});`),
  '  --font-sans: var(--font-sans);',
  '  --font-serif: var(--font-serif);',
  '  --font-mono: var(--font-mono);',
  '  --radius-sm: calc(var(--radius) - 4px);',
  '  --radius-md: calc(var(--radius) - 2px);',
  '  --radius-lg: var(--radius);',
  '  --radius-xl: calc(var(--radius) + 4px);',
  ...['shadow-2xs', 'shadow-xs', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'].map((name) => `  --${name}: var(--${name});`)
].join('\n');

/** shadcn/tweakcn-compatible CSS: :root, .dark and the Tailwind v4 @theme inline bridge. */
export function toShadcnCss(theme) {
  assertTheme(theme);
  return `/* ${theme.name}: shadcn-compatible theme exported from Gaudi (${theme.id}) */\n:root {\n${declarations(toShadcnVariables(theme, 'light'))}\n}\n\n.dark {\n${declarations(toShadcnVariables(theme, 'dark'))}\n}\n\n@theme inline {\n${SHADCN_THEME_INLINE}\n}\n`;
}

/** shadcn registry item (registry:theme) with cssVars; meta.gaudiTheme keeps the lossless DS theme. */
export function toRegistryItem(theme) {
  assertTheme(theme);
  const { $schema: _schema, ...gaudiTheme } = theme;
  const light = toShadcnVariables(theme, 'light');
  const { radius, 'font-sans': fontSans, 'font-serif': fontSerif, 'font-mono': fontMono, 'font-heading': fontHeading, 'tracking-normal': tracking, ...lightColors } = light;
  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: `theme-${theme.id}`,
    type: 'registry:theme',
    title: `${theme.name} theme`,
    description: theme.description || `${theme.name} theme for Gaudi and shadcn/ui.`,
    cssVars: {
      theme: { 'font-sans': fontSans, 'font-serif': fontSerif, 'font-mono': fontMono, ...(fontHeading ? { 'font-heading': fontHeading } : {}), ...(tracking ? { 'tracking-normal': tracking } : {}), radius },
      light: lightColors,
      dark: toShadcnVariables(theme, 'dark')
    },
    meta: { gaudiTheme }
  };
}

/** exportTheme(theme, format) → string in the requested format. */
export function exportTheme(theme, format = 'json') {
  if (format === 'json') { assertTheme(theme); const { $schema: _schema, ...rest } = theme; return `${JSON.stringify(rest, null, 2)}\n`; }
  if (format === 'css') return compileTheme(theme);
  if (format === 'shadcn') return toShadcnCss(theme);
  if (format === 'registry') return `${JSON.stringify(toRegistryItem(theme), null, 2)}\n`;
  throw new RangeError(`Unknown theme export format "${format}". Use one of: ${THEME_EXPORT_FORMATS.join(', ')}.`);
}
