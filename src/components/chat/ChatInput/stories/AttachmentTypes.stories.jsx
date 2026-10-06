import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { attachmentExamples } from '../../../../docs/fixtures/attachments.js';
import Button from '../../../core/Button/index.js';
import { ChatPromptComposer } from '../index.js';

const files = attachmentExamples.filter((file) => ['cover', 'document', 'audio', 'video', 'video-poster', 'link'].includes(file.id));

function MixedAttachmentsDemo({ variant, onSubmit }) {
  const [attachments, setAttachments] = useState(files);
  const [sent, setSent] = useState(null);
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-3'>
      <ChatPromptComposer
        variant={variant}
        attachments={attachments}
        onRemoveAttachment={(id) => setAttachments((current) => current.filter((file) => file.id !== id))}
        labels={{ placeholder: 'Ask about these files…' }}
        onSubmit={(text, metadata) => {
          onSubmit(text, metadata);
          setSent({ text, count: metadata.attachments.length });
          setAttachments([]);
        }}
      />
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p role='status' aria-label='Attachment submission' className='text-text-muted text-sm'>{sent ? `Sent ${sent.count} attachments: ${sent.text}` : `${attachments.length} attachments ready`}</p>
        <Button size='sm' variant='outline' onClick={() => { setAttachments(files); setSent(null); }}>Reset attachments</Button>
      </div>
    </div>
  );
}

export default {
  title: 'Chat/ChatInput',
  id: 'chat-chatinput',
  tags: ['autodocs'],
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const MixedAttachments = {
  name: 'Mixed attachments: compact media pills',
  args: { variant: 'card', onSubmit: fn() },
  argTypes: { variant: { control: 'inline-radio', options: ['card', 'default'] } },
  parameters: {
    docs: {
      description: { story: 'Image thumbnails, PDF, audio, video (with and without a poster), and a link share the existing compact Attachment parts inside ChatPromptComposer. Remove actions name their file; reset restores the sample tray. Submission passes the complete attachment metadata to the host. Preview URLs are explicitly supplied thumbnails, not the original audio/video file; the host owns object URL creation and cleanup. These sample files illustrate presentation without uploading or fetching media.' },
      source: { language: 'jsx', code: "import { useState } from 'react';\nimport { ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';\n" + 'const files = ' + JSON.stringify(files, null, 2) + ';' + "\nexport function MixedAttachmentsExample() {\n  const [attachments, setAttachments] = useState(files);\n  const [sent, setSent] = useState('');\n  return <div className='grid gap-3'><ChatPromptComposer variant='card' attachments={attachments} onRemoveAttachment={(id) => setAttachments((items) => items.filter((file) => file.id !== id))} onSubmit={(text, { attachments }) => { setSent('Sent ' + attachments.length + ' attachments: ' + text); setAttachments([]); }} /><p role='status'>{sent}</p></div>;\n}\n// Supply previewUrl for a local image thumbnail or video poster; omit it to use the shared type icon." }
    }
  },
  render: (args) => <MixedAttachmentsDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('podcast.mp3')).toBeVisible();
    await expect(canvas.getByText('demo.mp4')).toBeVisible();
    await expect(canvasElement.querySelector('[data-slot="attachment-media"] img')).toHaveAttribute('alt', '');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove podcast.mp3' }));
    await expect(canvas.queryByText('podcast.mp3')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset attachments' }));
    await userEvent.type(canvas.getByRole('combobox', { name: 'Message' }), 'Review these files.{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledWith('Review these files.', expect.objectContaining({ attachments: files }));
    await expect(canvas.getByRole('status', { name: 'Attachment submission' })).toHaveTextContent(`Sent ${files.length} attachments: Review these files.`);
    await expect(canvas.queryByText('podcast.mp3')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset attachments' }));
    await expect(canvas.getByText('podcast.mp3')).toBeVisible();
  }
};
