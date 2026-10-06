// Theming: the themeable token contract, presets, runtime provider, compiler, generator and
// shadcn/tweakcn/StyleGlide import/export. See src/tokens/THEMING.md.
import { themePresets } from './presets.js';

export { COLOR_GROUPS, COLOR_TOKENS, CONTRAST_PAIRS, DEFAULT_THEME_ID, FONT_TOKENS, SHADCN_COLOR_MAP, SHADCN_SHADOW_MAP, SHADOW_TOKENS, TOKEN_COUNT, TOKEN_DESCRIPTIONS } from './contract.js';
export { contrastRatio, formatHex, formatOklch, parseColor, toOklch } from './color.js';
export { anchorCss, compileTheme, compileThemes } from './compile.js';
export { checkContrast, formatContrastReport } from './contrast.js';
export { exportTheme, THEME_EXPORT_FORMATS, toRegistryItem, toShadcnCss, toShadcnVariables } from './exporter.js';
export { FONT_PAIRS, generateShadows, generateTheme, randomTheme, repairContrast } from './generate.js';
export { importTheme, readThemeCss } from './importer.js';
export { themePresets } from './presets.js';
export { applyTheme, getThemeScript, localStorageAdapter, resolveMode, storageKeys, THEME_MODES, THEME_STORAGE_KEY } from './runtime.js';
export { ThemeProvider, useTheme } from './ThemeProvider.jsx';
export { assertTheme, validateTheme } from './validate.js';


/** Preset lookup by id (undefined when unknown). */
export const getThemePreset = (id) => themePresets.find((theme) => theme.id === id);

/** Lightweight list for pickers: id, name, description, tags and a few swatches per mode. */
export const listThemes = (themes = themePresets) => themes.map(({ id, name, description = '', tags = [], light, dark, fonts, radius }) => ({
  id,
  name,
  description,
  tags,
  radius,
  font: fonts.heading,
  swatches: Object.fromEntries([ [ 'light', light ], [ 'dark', dark ] ].map(([ mode, colors ]) => [ mode, [ colors.surface, colors.text, colors.accent, colors['chart-2'], colors['chart-3'] ] ]))
}));
