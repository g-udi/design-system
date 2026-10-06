import { expect, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';
import { ScreenReadout } from './fixtures/use-screen.jsx';
import exampleCode from './fixtures/use-screen.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-screen.jsx', import.meta.url));

export default {
  title: 'Hooks/Environment/useScreen',
  id: 'hooks-environment-usescreen',
  tags: ['autodocs'],
  ...hookMeta('useScreen')
};

export const Playground = {
  parameters: example('A working example using Gaudi controls and the documented hook contract.', exampleSource),
  render: () => <ScreenReadout />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Display:', { exact: true })).toBeVisible());
    const original = Object.getOwnPropertyDescriptor(window.screen, 'width');
    try {
      Object.defineProperty(window.screen, 'width', { configurable: true, value: 2048 });
      window.dispatchEvent(new Event('resize'));
      await waitFor(() => expect(canvas.getByText(`2048 × ${window.screen.height}`)).toBeVisible());
    } finally {
      if (original) Object.defineProperty(window.screen, 'width', original);
      else delete window.screen.width;
      window.dispatchEvent(new Event('resize'));
    }
  }
};
