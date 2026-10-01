/**
 * Design Tokens (CJS entry)
 *
 * @description Builds the design tokens from the canonical data in
 * `tokens.json` for synchronous `require()` consumers: `tailwind-preset.cjs`
 * and the plugins in `src/tailwind/*.cjs`.
 *
 * The palette is derived from `tailwindcss/colors` so it always matches the
 * consumer's installed Tailwind version. Semantic colors point at the
 * `--ds-*` custom properties (declared in `src/styles.css`, mirrored by
 * `dsVariables`) so every semantic utility flips automatically in dark mode.
 *
 * Keep the palette/tokens assembly in sync with `src/tokens/index.js` — the
 * ESM twin exists because browser bundlers (Vite/Storybook) cannot import a
 * local CJS module, while Tailwind configs cannot `require()` ESM. All VALUES
 * live once in `tokens.json`; only this little glue is duplicated.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

const tailwindColors = require('tailwindcss/colors');

const { dsVariables, motion, paletteNames, paletteShades, radii, semanticColors, shadows, spaceScales, typography } = require('./tokens.json');

const pickShades = (color) => Object.fromEntries(paletteShades.map((shade) => [ shade, color[shade] ]));
const palette = Object.fromEntries(paletteNames.map((name) => [ name, pickShades(tailwindColors[name]) ]));

const colors = {
  ...palette,
  ...semanticColors
};

const tokens = {
  colors,
  motion,
  palette,
  radii,
  semanticColors,
  shadows,
  spaceScales,
  typography
};

module.exports = {
  colors,
  dsVariables,
  motion,
  palette,
  radii,
  semanticColors,
  shadows,
  spaceScales,
  tokens,
  typography
};
