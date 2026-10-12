import { useRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { EditorExample } from './fixtures/DialogEditorExample.jsx';
import editorSource from './fixtures/DialogEditorExample.jsx?raw';
import Button from '../../Button';
import Icon from '../../Icon';
import Dialog, { DialogClose } from '../Dialog';
import { iris } from '../../../../docs/fixtures/site/artwork';

const docs = getComponentDocs('Core/Dialog');
const articleTitle = 'A practical guide to knowledge graphs';
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const openDialog = async (canvasElement, trigger, role = 'dialog') => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: trigger }));
  const dialog = await page(canvasElement).findByRole(role);
  return { dialog, scope: within(dialog) };
};
const editTrigger = 'Edit article';

export default {
  title: 'Core/Overlays & Menus/Dialog', id: 'core-dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    title: 'text',
    description: 'text'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: {
    title: 'Edit article',
    description: 'Update the cover, title, and summary readers see.',
    onOpenChange: fn(),
    onSave: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'An article editor, open over the drafts list: a cover, a title field, and a summary with a hint, with Cancel and Save changes in the footer. Side panels use Sheet; the confirmation variant has its own examples below.'
      },
      source: { type: 'code', language: 'jsx', transform: (_source, { args }) => previewSource('EditorExample', args, { before: `${publicSource(editorSource, new URL('./fixtures/DialogEditorExample.jsx', import.meta.url))}\n\n` }) }
    }
  },
  render: (args) => <EditorExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const body = page(canvasElement);
    const trigger = within(canvasElement).getByRole('button', { name: editTrigger });
    const dialog = await body.findByRole('dialog');
    const scope = within(dialog);
    await expect(dialog).toHaveAccessibleName(args.title);
    await expect(dialog).toHaveAccessibleDescription(args.description);
    const heading = scope.getByRole('heading', { name: args.title });
    await expect(heading).toHaveAttribute('data-slot', 'dialog-title');
    await expect(getComputedStyle(heading).fontSize).toBe('16px');
    await expect(getComputedStyle(heading).fontWeight).toBe('500');
    await expect(scope.getByRole('textbox', { name: 'Title' })).toHaveValue(articleTitle);
    await expect(scope.getByRole('textbox', { name: 'Summary' })).toHaveAccessibleDescription('Shown in search results and link previews.');

    await userEvent.click(scope.getByRole('button', { name: 'Replace' }));
    await expect(scope.getByText('Alternate local cover')).toBeVisible();
    await userEvent.clear(scope.getByRole('textbox', { name: 'Title' }));
    await userEvent.type(scope.getByRole('textbox', { name: 'Title' }), 'Edited article');
    await userEvent.click(scope.getByRole('button', { name: 'Save changes' }));
    await expect(args.onSave).toHaveBeenCalledOnce();
    await expect(args.onSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'Edited article' }));
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    const reopened = await body.findByRole('dialog');
    await expect(within(reopened).getByRole('textbox', { name: 'Title' })).toHaveValue('Edited article');
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await waitFor(() => expect(reopened).toContainElement(reopened.ownerDocument.activeElement));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(reopened).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    // Rest on the open editor so the controls visibly change it.
    await userEvent.click(trigger);
    await body.findByRole('dialog');
  }
};

// The first attempt fails so the retry path shows; the retry takes a moment so the pending state shows too.
function ConfirmExample() {
  const [attempts, setAttempts] = useState(0);
  const [archived, setArchived] = useState(false);
  return (
    <>
      <Dialog
        variant='confirmation'
        trigger={<Button variant='outline' tone='danger'>Archive draft</Button>}
        title='Archive this draft?'
        description='The draft will leave your active collection. You can restore it from the archive.'
        confirmLabel='Archive draft'
        pendingLabel='Archiving…'
        onConfirm={async () => {
          setAttempts((count) => count + 1);
          if (attempts === 0) throw new Error('Example failure');
          await new Promise((resolve) => setTimeout(resolve, 600));
          setArchived(true);
        }}
      />
      <p role='status' className='text-sm text-text-muted'>{archived ? 'Draft archived in this example.' : ''}</p>
    </>
  );
}
export const Confirmation = {
  name: 'Async confirmation',
  parameters: {
    docs: {
      description: {
        story: 'Confirmation focuses Cancel. A rejected `onConfirm` keeps the dialog open with an error so the user can retry; while the retry is pending both actions are disabled and Escape cannot dismiss it; resolving closes it and restores focus.'
      }
    }
  },
  render: () => <ConfirmExample />,
  play: async ({ canvasElement, id }) => {
    const { dialog, scope } = await openDialog(canvasElement, 'Archive draft', 'alertdialog');
    const heading = scope.getByRole('heading');
    await expect(heading).toHaveAttribute('data-slot', 'alert-dialog-title');
    await expect(getComputedStyle(heading).fontSize).toBe('16px');
    await expect(getComputedStyle(heading).fontWeight).toBe('500');
    await expect(scope.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ canvasElement, id: `${id}--open` });
    }
    await userEvent.click(scope.getByRole('button', { name: 'Archive draft' }));
    await expect(await scope.findByRole('alert')).toHaveTextContent('The action could not be completed');
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ canvasElement, id: `${id}--error` });
    }
    await userEvent.click(scope.getByRole('button', { name: 'Archive draft' }));
    await expect(dialog).toHaveAttribute('aria-busy', 'true');
    await expect(scope.getByRole('button', { name: 'Archiving…' })).toBeDisabled();
    await expect(scope.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await userEvent.keyboard('{Escape}');
    await expect(dialog).toBeInTheDocument();
    await waitFor(() => expect(dialog).not.toBeInTheDocument(), { timeout: 2000 });
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Draft archived in this example.');
    await expect(within(canvasElement).getByRole('button', { name: 'Archive draft' })).toHaveFocus();
  }
};

function Lightbox() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  return (
    <>
      <Button variant='outline' tone='neutral' onClick={() => setOpen(true)}>View artwork</Button>
      <Dialog
        variant='bare'
        open={open}
        onOpenChange={setOpen}
        label='Iris artwork'
        initialFocusRef={closeRef}
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm'
      >
        <figure className='relative m-0 w-full max-w-2xl overflow-hidden rounded-lg bg-surface shadow-xl'>
          <DialogClose asChild>
            <Button ref={closeRef} variant='secondary' tone='neutral' size='icon' aria-label='Close artwork' className='absolute end-3 top-3'>
              <Icon name='X' decorative size='sm' />
            </Button>
          </DialogClose>
          <img src={iris} alt='Iris gradient artwork' className='aspect-video w-full object-cover' />
          <figcaption className='px-4 py-3 text-sm text-text-muted'>Iris, one of the abstract gradients used across the catalogue.</figcaption>
        </figure>
      </Dialog>
    </>
  );
}

export const BareSurface = {
  name: 'Bare full-screen surface',
  parameters: {
    docs: {
      description: {
        story: '`variant="bare"` drops the dialog chrome for lightboxes, video players, launchers and mobile menus that bring their own layout. The dialog still traps focus, locks scrolling, closes on Escape or a backdrop click, and marks the page behind it inert. `initialFocusRef` chooses the first focus, and focus returns to the opener on close.'
      }
    }
  },
  render: () => <Lightbox />,
  play: async ({ canvasElement, id }) => {
    const opener = within(canvasElement).getByRole('button', { name: 'View artwork' });
    const { dialog, scope } = await openDialog(canvasElement, 'View artwork');
    await expect(dialog).toHaveAccessibleName('Iris artwork');
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ canvasElement, id: `${id}--open` });
    }
    const close = scope.getByRole('button', { name: 'Close artwork' });
    await waitFor(() => expect(close).toHaveFocus());
    await userEvent.tab();
    await expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(opener).toHaveFocus();
    await userEvent.click(opener);
    const reopened = await page(canvasElement).findByRole('dialog');
    // A click on the backdrop, outside the figure, closes it.
    await userEvent.pointer({ keys: '[MouseLeft]', target: reopened, coords: { clientX: 4, clientY: 4 } });
    await waitFor(() => expect(reopened).not.toBeInTheDocument());
  }
};
