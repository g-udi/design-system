import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { QuickReply, Lightbox } from './fixtures/use-focus-trap.jsx';
import exampleCode from './fixtures/use-focus-trap.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-focus-trap.jsx', import.meta.url));

export default {
  title: 'Hooks/A11y/useFocusTrap',
  id: 'hooks-a11y-usefocustrap',
  tags: ['autodocs'],
  ...hookMeta('useFocusTrap')
};

export const InlinePanel = {
  name: 'Custom reply panel',
  parameters: example('Opening the panel moves focus to its first field; Tab and Shift+Tab cycle inside it, and Escape or Cancel closes it and returns focus to the trigger.', exampleSource),
  render: () => <QuickReply />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Quick reply' });
    await userEvent.click(trigger);
    const field = await canvas.findByRole('textbox', { name: 'Message' });
    await waitFor(() => expect(field).toHaveFocus());
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Send' })).toHaveFocus();
    await userEvent.tab();
    await expect(field).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  }
};

export const ContainerFocus = {
  name: 'Focus the container first',
  parameters: example("`initialFocus: 'container'` focuses the overlay itself (give it `tabIndex={-1}`), useful when the first control is not the right starting point.", exampleSource),
  render: () => <Lightbox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'View diagram' }));
    const dialog = await canvas.findByRole('dialog', { name: 'Architecture diagram' });
    await waitFor(() => expect(dialog).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
  }
};
