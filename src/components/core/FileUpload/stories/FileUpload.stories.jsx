import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { UploadQueue, photo, added } from './fixtures/UploadQueueExample.jsx';
import queueSource from './fixtures/UploadQueueExample.jsx?raw';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import FileUpload from '../FileUpload';

const docs = getComponentDocs('Core/FileUpload');
const file = (name, type) => new File([name], name, { type });
const notes = file('notes.md', 'text/markdown');
const report = file('research.pdf', 'application/pdf');
const picker = (canvasElement, label = 'Attachments') => within(canvasElement).getByLabelText(label, { selector: 'input' });

function Controlled({ onFilesChange, ...props }) {
  const [files, setFiles] = useState([]);
  const update = (next) => {
    setFiles(next);
    onFilesChange?.(next);
  };
  return <FileUpload files={files} onFilesChange={update} {...props} />;
}

export default {
  title: 'Core/Advanced Inputs/FileUpload', id: 'core-fileupload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    label: 'text',
    description: 'text',
    multiple: 'boolean',
    disabled: 'boolean'
  }),
  parameters: {
    visualAudit: { wide: 'Drop zones span the width of their container.' },
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: {
    label: 'Project files',
    description: 'Drop images, PDFs, or spreadsheets up to 10 MB.',
    multiple: true,
    disabled: false,
    onFilesChange: fn(),
    onRetry: fn(),
    onCancel: fn()
  },
  parameters: {
    docs: {
      description: { story: 'An upload queue with a finished photo, a brief mid-upload, and a failed spreadsheet. `multiple` switches between a single file and the whole queue; `disabled` locks the drop zone and every row action.' },
      source: { type: 'code', language: 'jsx', transform: (_source, { args }) => previewSource('UploadQueue', args, { before: `${publicSource(queueSource, new URL('./fixtures/UploadQueueExample.jsx', import.meta.url))}\n\n` }) }
    }
  },
  // Remount when `multiple` flips so the seeded queue matches the picker mode.
  render: (args) => <UploadQueue key={String(args.multiple)} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = picker(canvasElement, args.label);
    await expect(canvas.getByText(photo.name)).toBeVisible();
    await expect(canvas.getByText('Uploaded')).toBeVisible();
    if (args.multiple) {
      await expect(canvas.getByRole('progressbar')).toBeVisible();
      await expect(canvas.getByText('Connection dropped. Try again.')).toBeVisible();
    }
    if (args.disabled) {
      await expect(input).toBeDisabled();
      return expect(canvas.getByRole('button', { name: `Remove ${photo.name}` })).toBeDisabled();
    }
    if (args.multiple) await expect(canvas.getByRole('button', { name: 'Retry' })).toBeEnabled();
    await userEvent.upload(input, added);
    await expect(args.onFilesChange).toHaveBeenLastCalledWith(expect.arrayContaining([added]));
    await expect(canvas.getByText(added.name)).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: `Remove ${added.name}` }));
    await expect(canvas.queryByText(added.name)).not.toBeInTheDocument();
  }
};

export const FileLimits = {
  args: { onReject: fn() },
  parameters: {
    docs: { description: { story: '`accept`, `maxSize`, and `maxFiles` reject files with an announced reason, call `onReject`, and keep the valid ones.' } }
  },
  render: (args) => (
    <Controlled multiple accept='.pdf,.md' maxFiles={2} maxSize={5000000} description='Up to two PDF or Markdown files, 5 MB each.' {...args} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.upload(picker(canvasElement), [notes, report, file('draft.md', 'text/markdown')]);
    await expect(canvas.getByRole('alert')).toHaveTextContent('draft.md: file count limit reached.');
    await expect(args.onReject).toHaveBeenCalledWith([expect.objectContaining({ reason: 'count' })]);
    await expect(canvas.getByText('notes.md')).toBeVisible();
  }
};

function UploadStates() {
  const [files, setFiles] = useState([report, notes]);
  const [retried, setRetried] = useState(false);
  return (
    <FileUpload
      multiple
      files={files}
      onFilesChange={setFiles}
      getFileState={(item) =>
        item === report
          ? { status: 'uploading', progress: 64 }
          : retried ? { status: 'success' } : { status: 'error', error: 'Connection interrupted. Try uploading again.' }
      }
      onCancel={(item) => setFiles((current) => current.filter((entry) => entry !== item))}
      onRetry={() => setRetried(true)}
    />
  );
}
export const ProgressAndRecovery = {
  parameters: { docs: { description: { story: '`getFileState` reports progress, errors, and success. `onRetry` and `onCancel` hand transport actions back to the host.' } } },
  render: () => <UploadStates />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('progressbar')).toBeVisible();
    await expect(canvas.getByRole('alert')).toHaveTextContent('Connection interrupted');
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await expect(canvas.getByText('Uploaded')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.queryByText('research.pdf')).not.toBeInTheDocument();
  }
};
