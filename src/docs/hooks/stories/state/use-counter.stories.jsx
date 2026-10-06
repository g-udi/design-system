import { expect, userEvent, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';
import { DraftCounter } from './fixtures/use-counter.jsx';
import exampleCode from './fixtures/use-counter.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-counter.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useCounter',
  id: 'hooks-state-usecounter',
  tags: ['autodocs'],
  ...hookMeta('useCounter')
};

export const Playground = {
  parameters: example('A working example using Gaudi controls and the documented hook contract.', exampleSource),
  render: () => <DraftCounter />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Add two' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('3');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove draft' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('2');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('1');
  }
};
