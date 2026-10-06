import { example, hookMeta } from '../../HookDocs.jsx';

import { Clock } from './fixtures/use-event-callback.jsx';
import exampleCode from './fixtures/use-event-callback.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-event-callback.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useEventCallback',
  id: 'hooks-state-useeventcallback',
  tags: ['autodocs'],
  ...hookMeta('useEventCallback')
};

export const StableSubscription = {
  name: 'Fresh state, stable subscription',
  parameters: example('The tick handler reads the label as you type, yet the subscription that depends on it starts once.', exampleSource),
  render: () => <Clock />
};
