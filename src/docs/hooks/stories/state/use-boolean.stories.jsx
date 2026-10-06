import { expect, userEvent, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';
import { TogglePreference } from './fixtures/use-boolean.jsx';
import exampleCode from './fixtures/use-boolean.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-boolean.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useBoolean',
  id: 'hooks-state-useboolean',
  tags: ['autodocs'],
  ...hookMeta('useBoolean')
};

export const Playground = {
  parameters: example('A working example using Gaudi controls and the documented hook contract.', exampleSource),
  render: () => <TogglePreference />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Focus reading' }));
    await expect(canvas.getByRole('button', { name: 'Focus reading' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Enable' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Disable' }));
    await expect(canvas.getByText('Standard')).toBeVisible();
  }
};
