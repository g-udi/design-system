// Shared by distributed CSS and local development. Native require keeps the CJS
// preset intact when Tailwind invalidates its configuration during hot reload.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default {
  darkMode: 'class',
  plugins: [
    require('./addVariablesColors.cjs'),
    require('./tailwindGrid.cjs')
  ],
  presets: [require('../../tailwind-preset.cjs')]
};
