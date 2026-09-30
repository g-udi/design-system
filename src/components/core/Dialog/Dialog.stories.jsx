import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  applicationDocs,
  ApplicationDocsPage,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Dialog, { DialogClose } from './Dialog';
import Button from '../Button';
import Field, { FieldLabel } from '../Field';
import Input from '../Input';
import { previewSource } from '../../../../.storybook/stories/previewSource';

export default {
  tags: ['autodocs'],
  title: 'Core/Dialog',
  component: Dialog,
  argTypes: {
    variant: { control: 'select', options: ['modal', 'sheet', 'confirmation'], description: 'Modal and sheet support arbitrary content. Confirmation requires an explicit decision and supports async actions.' },
    onConfirm: { control: false, description: 'Confirmation only. Resolving closes the dialog; rejecting announces an error and allows retry.' }
  },
  ...applicationDocs(
    'Modal, sheet and confirmation dialogs in one component. Use variant=\'confirmation\' for explicit decisions with pending and rejected-action recovery.',
    "<Dialog trigger={<Button>Edit title</Button>} title='Edit article' description='Update the title readers see.'><Field><FieldLabel>Title</FieldLabel><Input defaultValue='A useful idea' /></Field></Dialog>",
    'Radix traps focus, hides background content, locks scrolling and restores focus. Confirmation dialogs retain alertdialog semantics, focus Cancel initially and block dismissal while an action is pending.',
    { page: ApplicationDocsPage }
  )
};
const contents = (
  <Field>
    <FieldLabel>Title</FieldLabel>
    <Input defaultValue='A practical guide to knowledge graphs' />
  </Field>
);
export const Playground = {
  args: { title: 'Edit article', description: 'Review the details before continuing.', variant: 'modal', closeLabel: 'Close dialog' },
  argTypes: { title: {control: 'text'}, description: {control: 'text'}, closeLabel: {control: 'text'} },
  render: (args) => <ExampleFrame><Dialog {...args} trigger={<Button>Open dialog</Button>} onConfirm={async () => {}}>{contents}</Dialog></ExampleFrame>,
  parameters: { docs: { source: { type: 'dynamic', transform: (_, context) => previewSource('Dialog', context.args, {
    imports: "import { Button, Dialog, Field, FieldLabel, Input } from '@gaudi/design-system';",
    children: '  <Field><FieldLabel>Title</FieldLabel><Input defaultValue="A practical guide to knowledge graphs" /></Field>'
  }).replace('<Dialog\n', '<Dialog\n  trigger={<Button>Open dialog</Button>}\n  onConfirm={async () => { /* Save through your application. */ }}\n') } } }
};
export const EditArticle = {
  render: () => (
    <ExampleFrame>
      <Dialog
        trigger={<Button>Edit title</Button>}
        title='Edit article'
        description='Update the title readers see.'
        footer={
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        }
      >
        {contents}
      </Dialog>
    </ExampleFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Edit title' });
    await userEvent.click(trigger);
    const dialog = await body.findByRole('dialog', { name: 'Edit article' });
    await expect(dialog).toHaveAccessibleDescription(
      'Update the title readers see.'
    );
    await expect(
      within(dialog).getByRole('textbox', { name: 'Title' })
    ).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(body.queryByRole('dialog')).not.toBeInTheDocument()
    );
    await expect(trigger).toHaveFocus();
  }
};
export const DetailSheet = {
  parameters: {
    docs: {
      source: {
        code: "<Dialog variant='sheet' trigger={<Button>Article details</Button>} title='Article details' description='Review the metadata without leaving your collection.'>{fields}</Dialog>"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Dialog
        variant='sheet'
        trigger={<Button>Article details</Button>}
        title='Article details'
        description='Review the metadata without leaving your collection.'
      >
        {contents}
      </Dialog>
    </ExampleFrame>
  )
};
export const LongContent = {
  render: () => (
    <ExampleFrame>
      <Dialog
        trigger={<Button>Read review notes</Button>}
        title='Review notes'
        description='The body scrolls while controls remain reachable.'
      >
        {Array.from({ length: 12 }, (_, i) => (
          <p className='ds-description mb-4' key={i}>
            Review note {i + 1}: keep the argument clear, explain unfamiliar
            terms, and check each reference against the original source.
          </p>
        ))}
      </Dialog>
    </ExampleFrame>
  )
};

function ConfirmExample({ fail = false }) {
  const [archived, setArchived] = useState(false);
  return (
    <ExampleFrame>
      <Dialog
        variant='confirmation'
        trigger={
          <Button variant='outline' tone='danger'>
            Archive draft
          </Button>
        }
        title='Archive this draft?'
        description='The draft will leave your active collection. You can restore it from the archive.'
        confirmLabel='Archive draft'
        onConfirm={async () => {
          if (fail) throw new Error('Example failure');
          setArchived(true);
        }}
      />
      <p role='status'>{archived ? 'Draft archived in this example.' : ''}</p>
    </ExampleFrame>
  );
}
const confirmationSource = "import { Button, Dialog } from '@gaudi/design-system';\n\n<Dialog variant='confirmation' trigger={<Button>Archive draft</Button>} title='Archive this draft?' description='You can restore it from the archive.' confirmLabel='Archive draft' onConfirm={archiveDraft} />";
export const Confirmation = {
  render: () => <ConfirmExample />,
  parameters: { docs: { source: { code: confirmationSource } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Archive draft' });
    await userEvent.click(trigger);
    const dialog = await body.findByRole('alertdialog');
    await expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Archive draft' }));
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(canvas.getByRole('status')).toHaveTextContent('Draft archived in this example.');
    await expect(trigger).toHaveFocus();
  }
};
export const FailedAction = {
  parameters: { docs: { source: { code: confirmationSource.replace('archiveDraft', "async () => { throw new Error('Example failure'); }") } } },
  render: () => <ConfirmExample fail />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Archive draft' })
    );
    const dialog = await body.findByRole('alertdialog');
    await expect(
      within(dialog).getByRole('button', { name: 'Cancel' })
    ).toHaveFocus();
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Archive draft' })
    );
    await expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'The action could not be completed'
    );
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Cancel' })
    );
  }
};
export const PendingAction = {
  parameters: { docs: { source: { code: "<Dialog variant='confirmation' trigger={<Button>Publish article</Button>} title='Publish this article?' description='This example simulates a short save.' tone='accent' confirmLabel='Publish' onConfirm={() => new Promise((resolve) => setTimeout(resolve, 800))} />" } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Publish article' });
    await userEvent.click(trigger);
    const dialog = await body.findByRole('alertdialog');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Publish', exact: true }));
    await expect(dialog).toHaveAttribute('aria-busy', 'true');
    await expect(within(dialog).getByRole('button', { name: 'Working…' })).toBeDisabled();
    await expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await userEvent.keyboard('{Escape}');
    await expect(dialog).toBeInTheDocument();
    await waitFor(() => expect(dialog).not.toBeInTheDocument(), { timeout: 2000 });
    await expect(trigger).toHaveFocus();
  },
  render: () => (
    <ExampleFrame>
      <Dialog
        variant='confirmation'
        trigger={<Button>Publish article</Button>}
        title='Publish this article?'
        description='This example simulates a short save.'
        tone='accent'
        confirmLabel='Publish'
        onConfirm={() => new Promise((resolve) => setTimeout(resolve, 800))}
      />
    </ExampleFrame>
  )
};
