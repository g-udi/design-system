import { expect, userEvent, waitFor, within } from 'storybook/test';

import { example, hookMeta } from '../../HookDocs.jsx';

import { SearchShortcut, CommentShortcuts } from './fixtures/use-hotkey.jsx';
import exampleCode from './fixtures/use-hotkey.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-hotkey.jsx', import.meta.url));

export default {
  title: 'Hooks/Interaction/useHotkey',
  id: 'hooks-interaction-usehotkey',
  tags: ['autodocs'],
  ...hookMeta('useHotkey')
};

export const CommandPalette = {
  name: 'Platform-aware mod key',
  parameters: example("`'mod+k'` is Command+K on macOS and Control+K elsewhere. The button does the same thing, carries `aria-keyshortcuts`, and shows the keys with `Kbd`.", exampleSource),
  render: () => <SearchShortcut />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const apple = /mac|iphone|ipad/i.test(navigator.userAgentData?.platform || navigator.platform || '');
    await userEvent.keyboard(apple ? '{Meta>}k{/Meta}' : '{Control>}k{/Control}');
    await waitFor(() => expect(canvas.getByText('Search opened 1 time')).toBeVisible());
    await expect(canvas.getByRole('button', { name: /Search posts/ })).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K');
  }
};

export const SingleKeys = {
  name: 'Single-key shortcuts that can be turned off',
  parameters: example('Plain-key shortcuts skip text fields automatically and, as WCAG 2.1.4 asks, can be switched off through `enabled`. A list of combinations shares one callback, which receives the matched combination.', exampleSource),
  render: () => <CommentShortcuts />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: /single-key shortcuts/ }).focus();
    await userEvent.keyboard('j');
    await expect(canvas.getByText('Next comment')).toBeVisible();
    await userEvent.click(canvas.getByRole('textbox', { name: 'Reply' }));
    await userEvent.keyboard('k');
    await expect(canvas.getByText('Next comment')).toBeVisible();
  }
};
