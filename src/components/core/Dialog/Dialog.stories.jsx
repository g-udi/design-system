import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Button from '../Button';
import Field, { FieldLabel } from '../Field';
import Input from '../Input';
import Dialog, { DialogClose } from './Dialog';

const docs = getComponentDocs('Core/Dialog');
const articleTitle = 'A practical guide to knowledge graphs';
const fields = (
  <Field>
    <FieldLabel>Title</FieldLabel>
    <Input defaultValue={articleTitle} />
  </Field>
);
const doneFooter = (
  <DialogClose asChild>
    <Button>Done</Button>
  </DialogClose>
);
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const openDialog = async (canvasElement, trigger, role = 'dialog') => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: trigger }));
  const dialog = await page(canvasElement).findByRole(role);
  return { dialog, scope: within(dialog) };
};
const playgroundCode = playgroundSource('Dialog', {
  attributes: ['trigger={<Button>Open dialog</Button>}', 'footer={<DialogClose asChild><Button>Done</Button></DialogClose>}'],
  imports: "import { Button, Dialog, DialogClose, Field, FieldLabel, Input } from '@gaudi/design-system';",
  children: `  <Field>\n    <FieldLabel>Title</FieldLabel>\n    <Input defaultValue='${articleTitle}' />\n  </Field>`
});

export default {
  title: 'Core/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    variant: ['modal', 'sheet', 'confirmation'],
    title: 'text',
    description: 'text',
    closeLabel: 'text',
    confirmLabel: 'text',
    tone: ['accent', 'danger']
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
    description: 'Update the title readers see.',
    closeLabel: 'Close dialog',
    confirmLabel: 'Save',
    tone: 'accent',
    onOpenChange: fn(),
    onConfirm: fn()
  },
  parameters: {
    docs: {
      source: playgroundCode
    }
  },
  render: (args) => (
    <Dialog {...args} trigger={<Button>Open dialog</Button>} footer={doneFooter}>
      {fields}
    </Dialog>
  ),
  play: async ({ args, canvasElement }) => {
    const { dialog, scope } = await openDialog(canvasElement, 'Open dialog');
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await expect(dialog).toHaveAccessibleName(args.title);
    await expect(dialog).toHaveAccessibleDescription(args.description);
    await expect(scope.getByRole('textbox', { name: 'Title' })).toHaveValue(articleTitle);
    await userEvent.click(scope.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(within(canvasElement).getByRole('button', { name: 'Open dialog' })).toHaveFocus();
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
