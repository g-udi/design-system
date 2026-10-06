import { example, hookMeta } from '../../HookDocs.jsx';

import { SystemScheme } from './fixtures/use-prefers-color-scheme.jsx';
import exampleCode from './fixtures/use-prefers-color-scheme.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-prefers-color-scheme.jsx', import.meta.url));

export default {
  title: 'Hooks/Environment/usePrefersColorScheme',
  id: 'hooks-environment-usepreferscolorscheme',
  tags: ['autodocs'],
  ...hookMeta('usePrefersColorScheme')
};

export const SystemDefault = {
  name: 'System default for an embed',
  parameters: example('Reads the operating system preference. The site theme can differ (the reader may pick light on a dark system), so use the theme provider for site styling.', exampleSource),
  render: () => <SystemScheme />
};
