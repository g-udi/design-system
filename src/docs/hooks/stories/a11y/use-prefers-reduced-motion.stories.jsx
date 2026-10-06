import { example, hookMeta } from '../../HookDocs.jsx';

import { Preference, RotatingQuote } from './fixtures/use-prefers-reduced-motion.jsx';
import exampleCode from './fixtures/use-prefers-reduced-motion.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-prefers-reduced-motion.jsx', import.meta.url));

export default {
  title: 'Hooks/A11y/usePrefersReducedMotion',
  id: 'hooks-a11y-useprefersreducedmotion',
  tags: ['autodocs'],
  ...hookMeta('usePrefersReducedMotion')
};

export const Reading = {
  name: 'Read the preference',
  parameters: example('The value follows the system setting live.', exampleSource),
  render: () => <Preference />
};

export const AutoplayOff = {
  name: 'Turn autoplay off',
  parameters: example('Rotating content stops when motion should be reduced, and always keeps a manual control and a pause button.', exampleSource),
  render: () => <RotatingQuote />
};
