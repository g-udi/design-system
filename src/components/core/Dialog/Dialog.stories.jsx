import { useLayoutEffect, useRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Button from '../Button';
import Field, { FieldDescription, FieldInput, FieldLabel } from '../Field';
import Input from '../Input';
import Dialog, { DialogClose } from './Dialog';
import { iris } from '../../../../.storybook/fixtures/site/artwork';

const docs = getComponentDocs('Core/Dialog');
const articleTitle = 'A practical guide to knowledge graphs';
const fields = (
  <Field>
    <FieldLabel>Title</FieldLabel>
    <Input defaultValue={articleTitle} />
  </Field>
);
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
    "  <img src='/static/images/art/iris.svg' alt='' />",
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

const stagePlacement = (variant, rect) => {
  if (!rect) return { visibility: 'hidden' };
  if (variant === 'sheet') {
    const width = Math.min(480, rect.width - 16);
    return { top: rect.top, left: rect.left + rect.width - width, right: 'auto', bottom: 'auto', width, height: rect.height, maxHeight: rect.height };
  }
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
    <div ref={stageRef} className='relative mx-auto h-[30rem] w-full max-w-3xl overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900'>
      <div className='grid gap-3 p-4'>
        <div className='flex items-center justify-between gap-3'>
          <p className='text-sm font-semibold text-gray-950 dark:text-gray-100'>Drafts</p>
          <Dialog
            {...args}
            modal={false}
            open={open}
            onOpenChange={change}
            trigger={<Button size='sm'>{editTrigger}</Button>}
            contentProps={{
              style: stagePlacement(args.variant, rect),
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
                  <p className='truncate text-sm font-semibold text-gray-950 dark:text-gray-100'>Cover image</p>
                  <p className='truncate text-xs text-gray-500 dark:text-gray-400'>iris.svg · 1600 × 900</p>
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
          <div key={title} className='rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300'>{title}</div>
        ))}
      </div>
      {open ? <div aria-hidden='true' className='absolute inset-0 bg-gray-950/50' /> : null}
    </div>
  );
}

export default {
  title: 'Core/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    variant: ['modal', 'sheet'],
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
    variant: 'modal',
    title: 'Edit article',
    description: 'Update the cover, title, and summary readers see.',
    onOpenChange: fn(),
    onSave: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'An article editor, open over the drafts list: a cover, a title field, and a summary with a hint, with Cancel and Save changes in the footer. `variant` switches between the centred modal and the edge sheet. The confirmation variant has its own examples below.'
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
    await expect(dialog.classList.contains('ds-sheet')).toBe(args.variant === 'sheet');
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
  }
};

export const DetailSheet = {
  parameters: { docs: { description: { story: "`variant='sheet'` slides the same content in from the edge for inspection without leaving the page." } } },
  render: () => (
    <Dialog variant='sheet' trigger={<Button>Article details</Button>} title='Article details' description='Review the metadata without leaving your collection.'>
      {fields}
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const { dialog, scope } = await openDialog(canvasElement, 'Article details');
    await expect(dialog).toHaveClass('ds-sheet');
    await userEvent.click(scope.getByRole('button', { name: 'Close dialog' }));
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
  }
};

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
        onConfirm={async () => {
          setAttempts((count) => count + 1);
          if (attempts === 0) throw new Error('Example failure');
          setArchived(true);
        }}
      />
      <p role='status'>{archived ? 'Draft archived in this example.' : ''}</p>
    </>
  );
}
export const Confirmation = {
  parameters: {
    docs: {
      description: {
        story: 'Confirmation focuses Cancel. A rejected `onConfirm` keeps the dialog open with an error so the user can retry; resolving closes it and restores focus.'
      }
    }
  },
  render: () => <ConfirmExample />,
  play: async ({ canvasElement }) => {
    const { dialog, scope } = await openDialog(canvasElement, 'Archive draft', 'alertdialog');
    const confirm = () => scope.getByRole('button', { name: 'Archive draft' });
    await expect(scope.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.click(confirm());
    await expect(await scope.findByRole('alert')).toHaveTextContent('The action could not be completed');
    await userEvent.click(confirm());
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Draft archived in this example.');
    await expect(within(canvasElement).getByRole('button', { name: 'Archive draft' })).toHaveFocus();
  }
};

export const PendingAction = {
  parameters: {
    docs: { description: { story: 'While the `onConfirm` promise is pending, both actions are disabled and Escape cannot dismiss the dialog.' } }
  },
  render: () => (
    <Dialog
      variant='confirmation'
      trigger={<Button>Publish article</Button>}
      title='Publish this article?'
      description='This example simulates a short save.'
      tone='accent'
      confirmLabel='Publish'
      onConfirm={() => new Promise((resolve) => setTimeout(resolve, 800))}
    />
  ),
  play: async ({ canvasElement }) => {
    const { dialog, scope } = await openDialog(canvasElement, 'Publish article', 'alertdialog');
    await userEvent.click(scope.getByRole('button', { name: 'Publish', exact: true }));
    await expect(dialog).toHaveAttribute('aria-busy', 'true');
    await expect(scope.getByRole('button', { name: 'Working…' })).toBeDisabled();
    await expect(scope.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await userEvent.keyboard('{Escape}');
    await expect(dialog).toBeInTheDocument();
    await waitFor(() => expect(dialog).not.toBeInTheDocument(), { timeout: 2000 });
    await expect(within(canvasElement).getByRole('button', { name: 'Publish article' })).toHaveFocus();
  }
};
