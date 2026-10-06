import { verifyTitleOwnership } from '../../../../../tests/hooks/browserChecks.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { example, hookMeta } from '../../HookDocs.jsx';
import { TitlePreview } from './fixtures/use-document-title.jsx';
import exampleCode from './fixtures/use-document-title.jsx?raw';
import { hookExampleSource } from '../../hookExampleSource.js';
import readoutCode from '../fixtures/HookReadouts.jsx?raw';

const exampleSource = hookExampleSource(exampleCode, readoutCode, new URL('./fixtures/use-document-title.jsx', import.meta.url));

export default {
  title: 'Hooks/Environment/useDocumentTitle',
  id: 'hooks-environment-usedocumenttitle',
  tags: ['autodocs'],
  ...hookMeta('useDocumentTitle')
};

export const Playground = {
  parameters: example('A working example using Gaudi controls and the documented hook contract.', exampleSource),
  render: () => <TitlePreview />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await verifyTitleOwnership();
    const document = canvasElement.ownerDocument;
    const original = document.title;
    await userEvent.click(canvas.getByRole('button', { name: 'Apply title' }));
    await waitFor(() => expect(document.title).toBe('Writing room · Preview'));
    await userEvent.clear(canvas.getByRole('textbox', { name: 'Page title' }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Page title' }), 'Revised draft');
    await waitFor(() => expect(document.title).toBe('Revised draft · Preview'));
    await userEvent.click(canvas.getByRole('button', { name: 'Restore title' }));
    await expect(document.title).toBe(original);
  }
};
