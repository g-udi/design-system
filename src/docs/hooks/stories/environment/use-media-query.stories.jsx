import { example, hookMeta } from '../../HookDocs.jsx';

import { Breakpoints, SplitOrStack } from './fixtures/use-media-query.jsx';
import exampleCode from './fixtures/use-media-query.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-media-query.jsx', import.meta.url));

export default {
  title: 'Hooks/Environment/useMediaQuery',
  id: 'hooks-environment-usemediaquery',
  tags: ['autodocs'],
  ...hookMeta('useMediaQuery')
};

export const Queries = {
  name: 'Live queries',
  parameters: example('Each value follows its query; resize the window or change a system setting to see it update.', exampleSource),
  render: () => <Breakpoints />
};

export const DifferentTree = {
  name: 'Render a different tree',
  parameters: example('When the layout itself changes (two panes or one), branch on the query. The fallback (`true` here) is what the server renders, so pick the layout most readers get.', exampleSource),
  render: () => <SplitOrStack />
};
