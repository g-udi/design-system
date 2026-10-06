import { verifyStorageReader } from '../../../../../tests/hooks/browserChecks.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';
import { SharedPreference } from './fixtures/use-read-local-storage.jsx';
import exampleCode from './fixtures/use-read-local-storage.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-read-local-storage.jsx', import.meta.url));

export default {
  title: 'Hooks/Data/useReadLocalStorage',
  id: 'hooks-data-usereadlocalstorage',
  tags: ['autodocs'],
  ...hookMeta('useReadLocalStorage')
};

export const Playground = {
  parameters: example('A working example using Gaudi controls and the documented hook contract.', exampleSource),
  render: () => <SharedPreference />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await verifyStorageReader();
    await userEvent.click(canvas.getByRole('button', { name: 'Use compact spacing' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Compact'));
    await userEvent.click(canvas.getByRole('button', { name: 'Clear preference' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Comfortable'));
  }
};
