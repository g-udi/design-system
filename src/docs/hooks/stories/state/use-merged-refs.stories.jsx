import { expect, userEvent, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { Page } from './fixtures/use-merged-refs.jsx';
import exampleCode from './fixtures/use-merged-refs.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-merged-refs.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useMergedRefs',
  id: 'hooks-state-usemergedrefs',
  tags: ['autodocs'],
  ...hookMeta('useMergedRefs')
};

export const ForwardedAndOwnRef = {
  name: 'Forward a ref and keep your own',
  parameters: example('The field uses its own ref for Clear, and the page reads the same input through the ref it passed in.', exampleSource),
  render: () => <Page />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Read from the page ref' }));
    await expect(canvas.getByText('13')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    await expect(canvas.getByRole('searchbox', { name: 'Search posts' })).toHaveFocus();
  }
};
