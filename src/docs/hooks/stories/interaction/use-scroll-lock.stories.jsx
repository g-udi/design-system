import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { FullScreenMenu } from './fixtures/use-scroll-lock.jsx';
import exampleCode from './fixtures/use-scroll-lock.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-scroll-lock.jsx', import.meta.url));

export default {
  title: 'Hooks/Interaction/useScrollLock',
  id: 'hooks-interaction-usescrolllock',
  tags: ['autodocs'],
  ...hookMeta('useScrollLock')
};

export const OverlayMenu = {
  name: 'Full-screen menu',
  parameters: example('While the menu covers the page, the page behind cannot scroll and focus stays in the menu; Escape or Close restores both. Content does not shift when the scrollbar disappears.', exampleSource),
  render: () => <FullScreenMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = canvasElement.ownerDocument.body;
    const before = body.style.overflow;
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    await waitFor(() => expect(body.style.overflow).toBe('hidden'));
    await userEvent.click(within(body).getByRole('button', { name: 'Close menu' }));
    await waitFor(() => expect(body.style.overflow).toBe(before));
  }
};
