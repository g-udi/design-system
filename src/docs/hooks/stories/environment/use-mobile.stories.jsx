import { example, hookMeta } from '../../HookDocs.jsx';

import { ResponsiveFilters } from './fixtures/use-mobile.jsx';
import exampleCode from './fixtures/use-mobile.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-mobile.jsx', import.meta.url));

export default {
  title: 'Hooks/Environment/useIsMobile',
  id: 'hooks-environment-useismobile',
  tags: ['autodocs'],
  ...hookMeta('useIsMobile')
};

export const FiltersPanel = {
  name: 'Sidebar or sheet',
  parameters: example('On phones the filters move into a bottom Sheet; on wider screens they sit in the page. Both layouts reach the same filters. Try it at a narrow width.', exampleSource),
  render: () => <ResponsiveFilters />
};
