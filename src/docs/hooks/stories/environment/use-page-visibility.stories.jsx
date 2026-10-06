import { example, hookMeta } from '../../HookDocs.jsx';

import { PausedPolling } from './fixtures/use-page-visibility.jsx';
import exampleCode from './fixtures/use-page-visibility.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-page-visibility.jsx', import.meta.url));

export default {
  title: 'Hooks/Environment/usePageVisibility',
  id: 'hooks-environment-usepagevisibility',
  tags: ['autodocs'],
  ...hookMeta('usePageVisibility')
};

export const PausePolling = {
  name: 'Pause polling in the background',
  parameters: example('Polling runs every second while the tab is visible and stops while it is hidden, by passing `null` to `useInterval`.', exampleSource),
  render: () => <PausedPolling />
};
