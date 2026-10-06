import { example, hookMeta } from '../../HookDocs.jsx';

import { SavedNotice } from './fixtures/use-timeout.jsx';
import exampleCode from './fixtures/use-timeout.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-timeout.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useTimeout',
  id: 'hooks-state-usetimeout',
  tags: ['autodocs'],
  ...hookMeta('useTimeout')
};

export const AutoDismiss = {
  name: 'Auto-dismiss that pauses',
  parameters: example('The notice hides after six seconds, but `clear` holds it while the reader points at or focuses it and `reset` restarts the countdown when they leave. It also has a Dismiss button.', exampleSource),
  render: () => <SavedNotice />
};
