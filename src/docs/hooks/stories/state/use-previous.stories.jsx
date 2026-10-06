import { expect, userEvent, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { SubscriberTrend } from './fixtures/use-previous.jsx';
import exampleCode from './fixtures/use-previous.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-previous.jsx', import.meta.url));

export default {
  title: 'Hooks/State/usePrevious',
  id: 'hooks-state-useprevious',
  tags: ['autodocs'],
  ...hookMeta('usePrevious')
};

export const Trend = {
  name: 'Change since the last value',
  parameters: example('The trend compares the current value with the previous one and states the direction in words, not only colour.', exampleSource),
  render: () => <SubscriberTrend />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'New signups' }));
    await expect(canvas.getByText('up 25')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Unsubscribes' }));
    await expect(canvas.getByText('down 10')).toBeVisible();
  }
};
