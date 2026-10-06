import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { InlineTitleEditor, HelpPanel } from './fixtures/use-on-click-outside.jsx';
import exampleCode from './fixtures/use-on-click-outside.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-on-click-outside.jsx', import.meta.url));

export default {
  title: 'Hooks/Interaction/useOnClickOutside',
  id: 'hooks-interaction-useonclickoutside',
  tags: ['autodocs'],
  ...hookMeta('useOnClickOutside')
};

export const InlineEditor = {
  name: 'Commit an inline editor',
  parameters: example('Clicking anywhere outside the editor saves it, Enter saves too, and Escape cancels and returns focus to Rename. `enabled` keeps the listener off while not editing.', exampleSource),
  render: () => <InlineTitleEditor />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Rename' }));
    const field = canvas.getByRole('textbox', { name: 'Post title' });
    await userEvent.clear(field);
    await userEvent.type(field, 'Calm by default');
    await userEvent.click(canvasElement.ownerDocument.body);
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Calm by default' })).toBeVisible());
  }
};

export const TriggerAndPanel = {
  name: 'Trigger and panel together',
  parameters: example('Pass both refs so clicking the trigger toggles instead of closing and reopening; a click anywhere else closes the panel.', exampleSource),
  render: () => <HelpPanel />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Markdown help' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
};
