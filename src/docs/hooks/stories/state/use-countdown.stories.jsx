import { verifyCountdown } from '../../../../../tests/hooks/browserChecks.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';
import { PreviewCountdown } from './fixtures/use-countdown.jsx';
import exampleCode from './fixtures/use-countdown.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-countdown.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useCountdown',
  id: 'hooks-state-usecountdown',
  tags: ['autodocs'],
  ...hookMeta('useCountdown')
};

export const Playground = {
  parameters: example('A working example using Gaudi controls and the documented hook contract.', exampleSource),
  render: () => <PreviewCountdown />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await verifyCountdown();
    await userEvent.click(canvas.getByRole('button', { name: 'Start' }));
    await waitFor(() => expect(canvas.getByText('2', { exact: true })).toBeVisible(), { timeout: 2000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Paused');
    await userEvent.click(canvas.getByRole('button', { name: 'Start' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Preview complete'), { timeout: 3500 });
    await expect(canvas.getByRole('button', { name: 'Start' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getByText('3', { exact: true })).toBeVisible();
  }
};
