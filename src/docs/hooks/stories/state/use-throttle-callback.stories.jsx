import { example, hookMeta } from '../../HookDocs.jsx';

import { PointerTracker } from './fixtures/use-throttle-callback.jsx';
import exampleCode from './fixtures/use-throttle-callback.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-throttle-callback.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useThrottleCallback',
  id: 'hooks-state-usethrottlecallback',
  tags: ['autodocs'],
  ...hookMeta('useThrottleCallback')
};

export const PointerMoves = {
  name: 'Throttle pointer moves',
  parameters: example('Dozens of pointer events become at most five updates a second, and the trailing call keeps the final position exact.', exampleSource),
  render: () => <PointerTracker />
};
