import { verifyLatestCleanup } from '../../../../../tests/hooks/browserChecks.jsx';
import { expect, userEvent, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';
import { CleanupPreview } from './fixtures/use-unmount.jsx';
import exampleCode from './fixtures/use-unmount.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-unmount.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useUnmount',
  id: 'hooks-state-useunmount',
  tags: ['autodocs'],
  ...hookMeta('useUnmount')
};

export const Playground = {
  parameters: example('A working example using Gaudi controls and the documented hook contract.', exampleSource),
  render: () => <CleanupPreview />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await verifyLatestCleanup();
    await userEvent.clear(canvas.getByRole('textbox', { name: 'Preview title' }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Preview title' }), 'Latest draft');
    await userEvent.click(canvas.getByRole('button', { name: 'Close preview' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Latest draft');
    await userEvent.click(canvas.getByRole('button', { name: 'Open preview' }));
  }
};
