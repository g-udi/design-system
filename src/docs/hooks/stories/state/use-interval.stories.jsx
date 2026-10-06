import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { FocusTimer } from './fixtures/use-interval.jsx';
import exampleCode from './fixtures/use-interval.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-interval.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useInterval',
  id: 'hooks-state-useinterval',
  tags: ['autodocs'],
  ...hookMeta('useInterval')
};

export const Timer = {
  name: 'A pausable timer',
  parameters: example('Passing `null` as the delay pauses the interval; the callback uses an updater so it never reads stale state.', exampleSource),
  render: () => <FocusTimer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Start' }));
    await waitFor(() => expect(canvas.getByText('00:01')).toBeVisible(), { timeout: 2500 });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getByText('00:00')).toBeVisible();
  }
};
