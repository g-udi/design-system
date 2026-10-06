import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { TagFilter } from './fixtures/use-debounce-value.jsx';
import exampleCode from './fixtures/use-debounce-value.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-debounce-value.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useDebounceValue',
  id: 'hooks-state-usedebouncevalue',
  tags: ['autodocs'],
  ...hookMeta('useDebounceValue')
};

export const SearchFilter = {
  name: 'Filter after typing settles',
  parameters: example('The input stays instant while the filter waits for a pause, so the list does not jump on every keystroke.', exampleSource),
  render: () => <TagFilter />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Filter tags' }), 'mo');
    await waitFor(() => expect(canvas.getByText('"mo"')).toBeVisible(), { timeout: 2000 });
    await expect(canvas.queryByText('charts')).toBeNull();
  }
};
