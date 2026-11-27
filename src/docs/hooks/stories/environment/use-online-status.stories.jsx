import { expect, userEvent, waitFor, within } from 'storybook/test';

import { example, hookMeta } from '../../HookDocs.jsx';

import { PublishBar } from './fixtures/use-online-status.jsx';
import exampleCode from './fixtures/use-online-status.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const fixtureUrl = new URL('./fixtures/use-online-status.jsx', import.meta.url);
const exampleSource = hookExampleSource(exampleCode, readoutCode, fixtureUrl);

export default {
  title: 'Hooks/Environment/useOnlineStatus',
  id: 'hooks-environment-useonlinestatus',
  tags: ['autodocs'],
  ...hookMeta('useOnlineStatus')
};

export const OfflineNotice = {
  name: 'Offline notice',
  parameters: example(
    'Going offline shows an Alert (announced when it appears) and disables only the action that needs the network; editing continues. Toggle offline in the browser developer tools to try it.',
    exampleSource
  ),
  render: () => <PublishBar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Publish' })).toBeEnabled();
    Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => false });
    try {
      window.dispatchEvent(new Event('offline'));
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Publish' })).toBeDisabled());
      await expect(canvas.getByText('You are offline')).toBeVisible();
      await userEvent.click(canvas.getByRole('button', { name: 'Keep editing' }));
      const draft = canvas.getByRole('textbox', { name: 'Draft title' });
      await expect(draft).toHaveFocus();
      await userEvent.clear(draft);
      await userEvent.type(draft, 'Release checklist');
    } finally {
      delete navigator.onLine;
      window.dispatchEvent(new Event('online'));
    }
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Publish' })).toBeEnabled());
    await userEvent.click(canvas.getByRole('button', { name: 'Publish' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Published in this example: Release checklist');
  }
};
