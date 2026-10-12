import { expect, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { PausedPolling } from './fixtures/use-page-visibility.jsx';
import exampleCode from './fixtures/use-page-visibility.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-page-visibility.jsx', import.meta.url));

export default {
  title: 'Hooks/Environment/usePageVisibility',
  id: 'hooks-environment-usepagevisibility',
  tags: ['autodocs'],
  ...hookMeta('usePageVisibility')
};

export const PausePolling = {
  name: 'Pause polling in the background',
  parameters: example('Polling runs every second while the tab is visible and stops while it is hidden, by passing `null` to `useInterval`.', exampleSource),
  render: () => <PausedPolling />,
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(canvasElement);
    const document = canvasElement.ownerDocument;
    const descriptor = Object.getOwnPropertyDescriptor(document, 'visibilityState');
    const counter = () => canvas.getByText('Checks for new comments:').parentElement.textContent;
    try {
      Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));
      await waitFor(() => expect(canvas.getByText('Tab visible:').parentElement).toHaveTextContent('false'));
      const paused = counter();
      await new Promise(resolve => setTimeout(resolve, 1100));
      await expect(counter()).toBe(paused);
      Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
      document.dispatchEvent(new Event('visibilitychange'));
      await waitFor(() => expect(canvas.getByText('Tab visible:').parentElement).toHaveTextContent('true'));
      await waitFor(() => expect(counter()).not.toBe(paused), { timeout: 2000 });
    } finally {
      if (descriptor) Object.defineProperty(document, 'visibilityState', descriptor);
      else delete document.visibilityState;
      document.dispatchEvent(new Event('visibilitychange'));
    }
  }
};
