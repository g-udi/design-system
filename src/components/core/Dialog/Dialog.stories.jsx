import { useLayoutEffect, useRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Button from '../Button';
import Icon from '../Icon';
import Field, { FieldDescription, FieldInput, FieldLabel } from '../Field';
import Dialog, { DialogClose } from './Dialog';
import { iris } from '../../../../.storybook/fixtures/site/artwork';

const docs = getComponentDocs('Core/Dialog');
const articleTitle = 'A practical guide to knowledge graphs';
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const openDialog = async (canvasElement, trigger, role = 'dialog') => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: trigger }));
  const dialog = await page(canvasElement).findByRole(role);
  return { dialog, scope: within(dialog) };
};
// The Playground's editor: a cover, a title, and a summary, with Cancel and Save in the footer.
const summary = 'How linked entities and typed relations make a library searchable by meaning.';
const library = ['Local-first software', 'Design for real data', 'Research methods'];
const editTrigger = 'Edit article';
const playgroundCode = playgroundSource('Dialog', {
  attributes: [
    `trigger={<Button>${editTrigger}</Button>}`,
    "footer={<><DialogClose asChild><Button variant='outline' tone='neutral'>Cancel</Button></DialogClose><DialogClose asChild><Button onClick={save}>Save changes</Button></DialogClose></>}"
  ],
  imports: "import { Button, Dialog, DialogClose, Field, FieldDescription, FieldInput, FieldLabel } from '@gaudi/design-system';",
  children: [
    "  <img src='/static/images/art/5.svg' alt='' />",
    "  <Button size='sm' variant='outline' tone='neutral'>Replace</Button>",
    '  <Field>',
    '    <FieldLabel>Title</FieldLabel>',
    `    <FieldInput defaultValue='${articleTitle}' />`,
    '  </Field>',
    '  <Field>',
    '    <FieldLabel>Summary</FieldLabel>',
    `    <FieldInput as='textarea' rows={2} defaultValue='${summary}' />`,
    '    <FieldDescription>Shown in search results and link previews.</FieldDescription>',
    '  </Field>'
  ].join('\n')
});

// Tracks the stage in viewport coordinates so the open dialog stays inside the docs canvas.
function useStageRect(ref) {
  const [rect, setRect] = useState(null);
  useLayoutEffect(() => {
    const node = ref.current;
    const view = node.ownerDocument.defaultView;
    const update = () => {
      const { top, left, width, height } = node.getBoundingClientRect();
      setRect({ top, left, width, height });
    };
    update();
    const observer = new view.ResizeObserver(update);
    observer.observe(node);
    view.addEventListener('scroll', update, true);
    view.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      view.removeEventListener('scroll', update, true);
      view.removeEventListener('resize', update);
    };
  }, [ref]);
  return rect;
}

const stagePlacement = (rect) => {
  if (!rect) return { visibility: 'hidden' };
  return { top: rect.top + rect.height / 2, left: rect.left + rect.width / 2, width: Math.min(576, rect.width - 32), maxHeight: rect.height - 32 };
};

/**
 * The preview opens the dialog non-modally inside a stage that stands in for the page, so it can stay open in the
 * docs while the controls change it. Opening it from the trigger moves focus in as usual.
 */
function EditorExample({ onOpenChange, onSave, ...args }) {
  const stageRef = useRef(null);
  const rect = useStageRect(stageRef);
  const [open, setOpen] = useState(true);
  const openedFromTrigger = useRef(false);
  const change = (next) => {
    openedFromTrigger.current = next;
    setOpen(next);
    onOpenChange(next);
  };
  return (
    <div ref={stageRef} className='relative mx-auto h-[30rem] w-full max-w-3xl overflow-hidden rounded-lg border border-border bg-surface-muted'>
      <div className='grid gap-2 p-3'>
        <div className='flex items-center justify-between gap-3'>
          <p className='text-sm font-semibold text-text'>Drafts</p>
          <Dialog
            {...args}
            modal={false}
            open={open}
            onOpenChange={change}
            trigger={<Button size='sm'>{editTrigger}</Button>}
            contentProps={{
              style: stagePlacement(rect),
              onOpenAutoFocus: (event) => (openedFromTrigger.current ? undefined : event.preventDefault()),
              onInteractOutside: (event) => event.preventDefault()
            }}
            footer={(
              <>
                <DialogClose asChild><Button variant='outline' tone='neutral'>Cancel</Button></DialogClose>
                <DialogClose asChild><Button onClick={onSave}>Save changes</Button></DialogClose>
              </>
            )}
          >
            <div className='grid gap-4'>
              <div className='flex items-center gap-3'>
                <img src={iris} alt='' className='aspect-video w-16 shrink-0 rounded-md object-cover sm:w-24' />
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-semibold text-text'>Cover image</p>
                  <p className='truncate text-xs text-text-muted'>iris.svg · 1600 × 900</p>
                </div>
                <Button size='sm' variant='outline' tone='neutral'>Replace</Button>
              </div>
              <Field>
                <FieldLabel>Title</FieldLabel>
                <FieldInput defaultValue={articleTitle} />
              </Field>
              <Field>
                <FieldLabel>Summary</FieldLabel>
                <FieldInput as='textarea' rows={2} className='py-2' defaultValue={summary} />
                <FieldDescription>Shown in search results and link previews.</FieldDescription>
              </Field>
            </div>
          </Dialog>
        </div>
        {[articleTitle, ...library].map((title) => (
          <div key={title} className='rounded-md border border-border bg-surface p-3 text-sm text-text-muted'>{title}</div>
        ))}
      </div>
      {open ? <div aria-hidden='true' className='absolute inset-0 bg-(--ds-color-launcher-overlay-bg)' /> : null}
    </div>
  );
}

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
      source: playgroundCode
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
    await expect(scope.getByRole('textbox', { name: 'Title' })).toHaveValue(articleTitle);
    await expect(scope.getByRole('textbox', { name: 'Summary' })).toHaveAccessibleDescription('Shown in search results and link previews.');

    await userEvent.click(scope.getByRole('button', { name: 'Save changes' }));
    await expect(args.onSave).toHaveBeenCalledOnce();
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    const reopened = await body.findByRole('dialog');
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
  play: async ({ canvasElement }) => {
    const { dialog, scope } = await openDialog(canvasElement, 'Archive draft', 'alertdialog');
    await expect(scope.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.click(scope.getByRole('button', { name: 'Archive draft' }));
    await expect(await scope.findByRole('alert')).toHaveTextContent('The action could not be completed');
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
            <Button ref={closeRef} variant='ghost' tone='neutral' size='icon' aria-label='Close artwork' className='absolute end-3 top-3'>
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
  play: async ({ canvasElement }) => {
    const opener = within(canvasElement).getByRole('button', { name: 'View artwork' });
    const { dialog, scope } = await openDialog(canvasElement, 'View artwork');
    await expect(dialog).toHaveAccessibleName('Iris artwork');
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
