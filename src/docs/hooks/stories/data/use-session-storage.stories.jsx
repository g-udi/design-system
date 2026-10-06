import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';

import { ContactDraft } from './fixtures/use-session-storage.jsx';
import exampleCode from './fixtures/use-session-storage.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-session-storage.jsx', import.meta.url));

export default {
  title: 'Hooks/Data/useSessionStorage',
  id: 'hooks-data-usesessionstorage',
  tags: ['autodocs'],
  ...hookMeta('useSessionStorage')
};

export const FormDraft = {
  name: 'Keep a form draft',
  parameters: example('A contact form keeps what was typed through a reload of this tab, and Send or Clear removes it. Session storage ends with the tab.', exampleSource),
  render: () => <ContactDraft />,
  play: async ({ canvasElement }) => {
    window.sessionStorage.removeItem('gaudi-docs:contact-draft');
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Name' }), 'Amira');
    await waitFor(() => expect(JSON.parse(window.sessionStorage.getItem('gaudi-docs:contact-draft'))).toEqual({ name: 'Amira', message: '' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Clear draft' }));
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveValue(''));
    await expect(window.sessionStorage.getItem('gaudi-docs:contact-draft')).toBeNull();
  }
};
