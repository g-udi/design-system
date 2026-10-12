import { expect, userEvent, waitFor, within } from 'storybook/test';

import { example, hookMeta } from '../../HookDocs.jsx';

import { ShareDialog, Details } from './fixtures/use-disclosure.jsx';
import exampleCode from './fixtures/use-disclosure.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-disclosure.jsx', import.meta.url));

export default {
  title: 'Hooks/State/useDisclosure',
  id: 'hooks-state-usedisclosure',
  tags: ['autodocs'],
  ...hookMeta('useDisclosure')
};

export const WithDialog = {
  name: 'Drive a Gaudi Dialog',
  parameters: example('Gaudi overlays take `open` and `onOpenChange`, so pass the state straight through; `onOpen` and `onClose` read well in handlers.', exampleSource),
  render: () => <ShareDialog />,
  play: async ({ canvasElement, id }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const opener = canvas.getByRole('button', { name: 'Share post' });
    opener.focus();
    await userEvent.keyboard('{Enter}');
    const dialog = await body.findByRole('dialog', { name: 'Share post' });
    await expect(dialog).toHaveAccessibleDescription('Send this post to a colleague.');
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ canvasElement, id: `${id}--open` });
    }
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
    for (const action of ['Cancel', 'Send']) {
      await userEvent.click(opener);
      const reopened = await body.findByRole('dialog', { name: 'Share post' });
      await userEvent.click(within(reopened).getByRole('button', { name: action }));
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
      await waitFor(() => expect(opener).toHaveFocus());
    }
  }
};

export const CustomTrigger = {
  name: 'Custom disclosure',
  parameters: example('`getTriggerProps()` adds `aria-expanded`, `aria-controls` and the toggle to your own button.', exampleSource),
  render: () => <Details />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Show the citation' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(canvas.getByRole('button', { name: 'Hide the citation' })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(/Calm technology/)).toBeVisible();
  }
};
