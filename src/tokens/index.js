/**
 * Design Tokens (ESM entry)
 *
 * @description Builds the design tokens from the canonical data in
 * `tokens.json` for ESM consumers (Next.js, Vite/Storybook, Node).
 *
 * Keep the palette/tokens assembly in sync with `src/tokens/tokens.cjs` — the
 * CJS twin exists because Tailwind configs must `require()` the preset, while
 * browser bundlers cannot import a local CJS module. All VALUES live once in
 * `tokens.json`; only this little glue is duplicated.
 */

import tailwindColors from 'tailwindcss/colors';

/*
 * No `with { type: 'json' }` attribute here: esbuild downlevels it to the
 * removed `assert` syntax, which current Chromium rejects (breaking Storybook
 * browser tests). Bundlers (Next, Vite) resolve JSON imports natively.
 */
import data from './tokens.json';

const { chartPalettes, dsVariables, motion, paletteNames, paletteShades, radii, semanticColors, shadows, spaceScales, typography } = data;

const pickShades = (color) => Object.fromEntries(paletteShades.map((shade) => [ shade, color[shade] ]));
const palette = Object.fromEntries(paletteNames.map((name) => [ name, pickShades(tailwindColors[name]) ]));

const colors = {
  ...palette,
  ...semanticColors
};

const tokens = {
  chartPalettes,
  colors,
  motion,
  palette,
  radii,
  semanticColors,
  shadows,
  spaceScales,
  typography
};

export { chartPalettes, colors, dsVariables, motion, palette, radii, semanticColors, shadows, spaceScales, tokens, typography };
