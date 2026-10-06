import { expect, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';
import { ViewportReadout } from './fixtures/use-window-size.jsx';
import exampleCode from './fixtures/use-window-size.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-window-size.jsx', import.meta.url));

export default {
  title: 'Hooks/Environment/useWindowSize',
  id: 'hooks-environment-usewindowsize',
  tags: ['autodocs'],
  ...hookMeta('useWindowSize')
};

export const Playground = {
  parameters: example('A working example using Gaudi controls and the documented hook contract.', exampleSource),
  render: () => <ViewportReadout />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(`${window.innerWidth} × ${window.innerHeight}`)).toBeVisible());
    const original = Object.getOwnPropertyDescriptor(window, 'innerWidth');
    try {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 823 });
      window.dispatchEvent(new Event('resize'));
      await waitFor(() => expect(canvas.getByText(`823 × ${window.innerHeight}`)).toBeVisible());
    } finally {
      if (original) Object.defineProperty(window, 'innerWidth', original);
      window.dispatchEvent(new Event('resize'));
    }
  }
};
