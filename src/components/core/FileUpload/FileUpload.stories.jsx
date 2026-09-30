import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import FileUpload from './FileUpload';
export default {
  tags: ['autodocs'],
  title: 'Core/FileUpload',
  component: FileUpload,
  ...applicationDocs(
    'Controlled file selection with type, size and count limits. files and onFilesChange own the selection. getFileState supplies progress/error/success, and onRetry/onCancel delegate transport actions.',
    "const [files, setFiles] = useState([]);\n<FileUpload files={files} onFilesChange={setFiles} multiple accept='.pdf,.md' maxFiles={3} maxSize={5000000} />",
    'The chooser works by keyboard as well as drop. Rejections and failures are announced; remove buttons name their files. No requests are made by the component.'
  )
};
function Picker(props) {
  const [files, setFiles] = useState([]);
  return (
    <ExampleFrame>
      <FileUpload files={files} onFilesChange={setFiles} {...props} />
    </ExampleFrame>
  );
}
export const Attachments = {
  render: () => <Picker multiple />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Attachments', { selector: 'input' });
    await userEvent.upload(
      input,
      new File(['reference'], 'notes.md', { type: 'text/markdown' })
    );
    await expect(canvas.getByText('notes.md')).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove notes.md' })
    );
    await expect(canvas.queryByText('notes.md')).not.toBeInTheDocument();
  }
};
export const FileLimits = {
  render: () => (
    <Picker
      multiple
      accept='.pdf,.md'
      maxFiles={2}
      maxSize={5000000}
      description='Up to two PDF or Markdown files, 5 MB each.'
    />
  )
};
export const Disabled = {
  render: () => (
    <Picker
      disabled
      description='Attachments are locked while this review is being submitted.'
    />
  )
};
function UploadStates() {
  const [files, setFiles] = useState(() => [
    new File(['report'], 'research.pdf', { type: 'application/pdf' }),
    new File(['draft'], 'draft.md', { type: 'text/markdown' })
  ]);
  const [retried, setRetried] = useState(false);
  return (
    <ExampleFrame>
      <FileUpload
        multiple
        files={files}
        onFilesChange={setFiles}
        getFileState={(file) =>
          file.name === 'research.pdf'
            ? { status: 'uploading', progress: 64 }
            : retried
              ? { status: 'success' }
              : {
                  status: 'error',
                  error: 'Connection interrupted. Try uploading again.'
                }
        }
        onCancel={(file) =>
          setFiles((current) => current.filter((item) => item !== file))
        }
        onRetry={() => setRetried(true)}
      />
    </ExampleFrame>
  );
}
export const ProgressAndRecovery = {
  parameters: {
    docs: {
      description: {
        story:
          'Simulated transport states. Retry changes the example state; Cancel removes the simulated transfer.'
      }
    }
  },
  render: () => <UploadStates />
};
