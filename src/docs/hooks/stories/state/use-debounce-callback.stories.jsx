import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { Autosave } from './fixtures/use-debounce-callback.jsx';
import exampleCode from './fixtures/use-debounce-callback.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-debounce-callback.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useDebounceCallback',
  id: 'hooks-state-usedebouncecallback',
  tags: ['autodocs'],
  ...hookMeta('useDebounceCallback')
};

export const AutosaveDraft = {
  name: 'Autosave a draft',
  parameters: example('Typing schedules one save 800ms after the last keystroke; leaving the field flushes it at once so nothing is lost. The status is a polite live region.', exampleSource),
  render: () => <Autosave />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Draft' }), 'Hello');
    await expect(canvas.getByText('Saving…')).toBeVisible();
    await waitFor(() => expect(canvas.getByText('Saved 5 characters')).toBeVisible(), { timeout: 2000 });
    await expect(canvas.getByText(/1 save$/)).toBeVisible();
  }
};
