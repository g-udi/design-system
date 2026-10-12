import { expect, waitFor, within } from 'storybook/test';
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
  render: () => <Breakpoints />,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const { page } = await import('vitest/browser');
    const canvas = within(canvasElement);
    const original = { width: innerWidth, height: innerHeight };
    try {
      for (const width of [639, 640, 641, 767, 768, 769, 1023, 1024, 1025]) {
        await page.viewport(width, original.height);
        for (const breakpoint of [640, 768, 1024]) {
          const term = canvas.getByText(`(min-width: ${breakpoint}px)`);
          await waitFor(() => expect(term.nextElementSibling).toHaveTextContent(String(width >= breakpoint)));
        }
      }
    } finally { await page.viewport(original.width, original.height); }
  }
};

export const DifferentTree = {
  name: 'Render a different tree',
  parameters: example('When the layout itself changes (two panes or one), branch on the query. The fallback (`true` here) is what the server renders, so pick the layout most readers get.', exampleSource),
  render: () => <SplitOrStack />,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const { page } = await import('vitest/browser');
    const canvas = within(canvasElement);
    const original = { width: innerWidth, height: innerHeight };
    try {
      await page.viewport(767, original.height);
      await waitFor(() => expect(canvas.queryByRole('heading', { name: 'Amira Haddad' })).not.toBeInTheDocument());
      await expect(canvas.getByText(/One pane at a time/)).toBeVisible();
      await page.viewport(768, original.height);
      await waitFor(() => expect(canvas.getByRole('heading', { name: 'Amira Haddad' })).toBeVisible());
      await expect(canvas.getByText(/Two panes side by side/)).toBeVisible();
      await page.viewport(767, original.height);
      await waitFor(() => expect(canvas.queryByRole('heading', { name: 'Amira Haddad' })).not.toBeInTheDocument());
    } finally { await page.viewport(original.width, original.height); }
  }
};
