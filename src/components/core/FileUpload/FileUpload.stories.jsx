import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import FileUpload from './FileUpload';

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

const source = playgroundSource('FileUpload', {
  imports: "import { useState } from 'react';\nimport { FileUpload } from '@gaudi/design-system';",
  attributes: ['files={files}', 'onFilesChange={setFiles}'],
  before: 'const [files, setFiles] = useState([]);\n\n'
});

export default {
  title: 'Core/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    label: 'text',
    description: 'text',
    accept: 'text',
    multiple: 'boolean',
    maxFiles: 'number',
    maxSize: 'number',
    disabled: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { label: 'Attachments', multiple: true, disabled: false, onFilesChange: fn() },
  parameters: { docs: { source } },
  render: (args) => <Controlled {...args} />,
  play: async ({ args, canvasElement }) => {
    const input = picker(canvasElement, args.label);
    if (args.disabled) return expect(input).toBeDisabled();
    const canvas = within(canvasElement);
    await userEvent.upload(input, notes);
    await expect(args.onFilesChange).toHaveBeenLastCalledWith([notes]);
    await expect(canvas.getByText('notes.md')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Remove notes.md' }));
    await expect(args.onFilesChange).toHaveBeenLastCalledWith([]);
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
