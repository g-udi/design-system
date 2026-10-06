import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { shareUrl, ShareLink, InstallCommands, ResettableCopy } from './fixtures/use-copy-to-clipboard.jsx';
import exampleCode from './fixtures/use-copy-to-clipboard.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-copy-to-clipboard.jsx', import.meta.url));

export default {
  title: 'Hooks/Interaction/useCopyToClipboard',
  id: 'hooks-interaction-usecopytoclipboard',
  tags: ['autodocs'],
  ...hookMeta('useCopyToClipboard')
};

export const ShareField = {
  name: 'Copy a share link',
  parameters: example('The button reads "Copied" for two seconds and the result is announced politely. If the browser blocks the clipboard, the error is announced and the field stays selectable.', exampleSource),
  render: () => <ShareLink />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const writes = [];
    const original = navigator.clipboard?.writeText;
    if (navigator.clipboard) navigator.clipboard.writeText = async (text) => writes.push(text);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy link' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Copied' })).toBeVisible());
    if (navigator.clipboard) {
      await expect(writes).toEqual([ shareUrl ]);
      navigator.clipboard.writeText = original;
    }
  }
};

export const SeveralTargets = {
  name: 'One hook, several copy buttons',
  parameters: example('`copiedText` says which value was copied, so one hook can drive a list of icon buttons. A number argument is the reset timeout.', exampleSource),
  render: () => <InstallCommands />
};

export const ResetPendingCopy = {
  name: 'Reset pending feedback',
  parameters: example('Reset clears feedback and cancels feedback from an earlier pending clipboard request. It does not undo the clipboard write itself.', exampleSource),
  render: () => <ResettableCopy />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const original = navigator.clipboard?.writeText;
    if (!navigator.clipboard) return;
    let finishCopy;
    navigator.clipboard.writeText = () => new Promise((resolve) => { finishCopy = resolve; });
    try {
      await userEvent.click(canvas.getByRole('button', { name: 'Copy share link' }));
      await expect(finishCopy).toBeTypeOf('function');
      await userEvent.click(canvas.getByRole('button', { name: 'Reset copy feedback' }));
      finishCopy();
      await new Promise((resolve) => setTimeout(resolve, 0));
      await expect(canvas.getByRole('button', { name: 'Copy share link' })).toBeVisible();
    } finally {
      navigator.clipboard.writeText = original;
    }
  }
};
