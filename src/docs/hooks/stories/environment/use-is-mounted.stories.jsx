import { verifyMountGetter } from '../../../../../tests/hooks/browserChecks.jsx';
import { expect, userEvent, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';
import { MountCheck } from './fixtures/use-is-mounted.jsx';
import exampleCode from './fixtures/use-is-mounted.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-is-mounted.jsx', import.meta.url));

export default {
  title: 'Hooks/Environment/useIsMounted',
  id: 'hooks-environment-useismounted',
  tags: ['autodocs'],
  ...hookMeta('useIsMounted')
};

export const Playground = {
  parameters: example('A working example using Gaudi controls and the documented hook contract.', exampleSource),
  render: () => <MountCheck />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await verifyMountGetter();
    await userEvent.click(canvas.getByRole('button', { name: 'Check mount state' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Mounted');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove preview' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Check mount state' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Unmounted');
    await userEvent.click(canvas.getByRole('button', { name: 'Mount preview' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Check mount state' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Mounted');
  }
};
