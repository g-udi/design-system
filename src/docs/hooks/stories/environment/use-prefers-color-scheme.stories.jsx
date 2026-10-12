import { expect, waitFor, within } from 'storybook/test';
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
  render: () => <SystemScheme />,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const { commands } = await import('vitest/browser');
    const canvas = within(canvasElement);
    try {
      for (const colorScheme of ['dark', 'light', 'dark']) {
        await commands.emulateStoryMedia({ colorScheme });
        await waitFor(() => expect(canvas.getByText(new RegExp(`load the ${colorScheme} map style`))).toBeVisible());
      }
    } finally { await commands.emulateStoryMedia({ colorScheme: null }); }
  }
};
