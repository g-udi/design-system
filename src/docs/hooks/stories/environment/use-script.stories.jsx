import { verifyScriptOwnership } from '../../../../../tests/hooks/browserChecks.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';
import { ScriptPreview } from './fixtures/use-script.jsx';
import exampleCode from './fixtures/use-script.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-script.jsx', import.meta.url));

export default {
  title: 'Hooks/Environment/useScript',
  id: 'hooks-environment-usescript',
  tags: ['autodocs'],
  ...hookMeta('useScript')
};

export const Playground = {
  parameters: example('A working example using Gaudi controls and the documented hook contract.', exampleSource),
  render: () => <ScriptPreview />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await verifyScriptOwnership();
    await expect(canvas.getByRole('status')).toHaveTextContent('idle');
    await userEvent.click(canvas.getByRole('button', { name: 'Load preview script' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('ready'));
    const scripts = () => Array.from(canvasElement.ownerDocument.scripts).filter((script) => script.src.endsWith('/static/scripts/hook-preview.js'));
    await expect(scripts()).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Release script' }));
    await waitFor(() => expect(scripts()).toHaveLength(0));
    await expect(canvas.getByRole('status')).toHaveTextContent('idle');
  }
};
