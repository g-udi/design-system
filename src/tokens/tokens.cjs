/**
 * Supported JavaScript token projection. Runtime CSS in tokens.css and theme.css
 * is authoritative; tokens.json mirrors values exposed to JS and the preset.
 * Token contracts enforce parity. Keep the ESM/CJS assembly in sync: Tailwind
 * config uses require(), while browser bundlers consume the ESM entry.
 */

const tailwindColors = require('tailwindcss/colors');

const { chartPalettes, dsVariables, motion, paletteNames, paletteShades, radii, semanticColors, shadows, spaceScales, typography } = require('./tokens.json');

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

module.exports = {
  chartPalettes,
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
