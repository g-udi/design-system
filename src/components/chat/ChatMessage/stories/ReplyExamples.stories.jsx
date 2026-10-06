import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../../core/Button/index.js';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '../../../core/Banner/Alert.jsx';
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from '../../../core/Attachment/Attachment.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { ChatMessage, ChatMessageContent, ChatMessageHeader } from '../index.js';
import { ChatMessageParts } from '../../ChatMessageList/index.js';
import { attachmentExamples } from '../../../../docs/fixtures/attachments.js';

export default { title: 'Chat/ChatMessage', id: 'chat-message', tags: ['autodocs'] };

export const FailedReply = {
  name: 'Failed reply',
  args: { onRetry: fn() },
  parameters: { docs: {
    description: { story: 'A failed reply uses the shared Alert with its description and action. Retry belongs to the host.' },
    source: { language: 'jsx', code: "import { Alert, AlertTitle, AlertDescription, AlertAction, Button } from '@gaudi/design-system';\n\nexport function FailedReplyExample({ retry }) {\n  return (\n<Alert variant='destructive'>\n  <AlertTitle>The reply stopped before it finished.</AlertTitle>\n  <AlertDescription>The connection dropped. Your message is kept.</AlertDescription>\n  <AlertAction><Button size='xs' variant='outline' onClick={retry}>Try again</Button></AlertAction>\n</Alert>\n  );\n}" }
  } },
  render: ({ onRetry }) => (
    <div className='w-full max-w-xl'>
      <Alert variant='destructive'>
        <RegistryIcon lucide='TriangleAlert' />
        <AlertTitle className='line-clamp-none'>The reply stopped before it finished.</AlertTitle>
        <AlertDescription>The connection dropped. Your message is kept.</AlertDescription>
        <AlertAction><Button size='xs' variant='outline' onClick={onRetry}>Try again</Button></AlertAction>
      </Alert>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
  }
};

export const DeliveredFile = {
  name: 'Delivered file',
  args: { onPreview: fn() },
  parameters: { docs: {
    description: { story: 'Delivered files use the same Attachment media, content and actions as uploaded files. Each action names the file.' },
    source: { language: 'jsx', code: "import { Attachment, AttachmentMedia, AttachmentContent, AttachmentTitle, AttachmentDescription, AttachmentActions, AttachmentAction } from '@gaudi/design-system';\n\nexport function DeliveredFileExample({ preview, url }) {\n  return (\n<Attachment size='sm'>\n  <AttachmentMedia file={{ name: 'september-report.csv', type: 'text/csv' }} />\n  <AttachmentContent>\n    <AttachmentTitle>september-report.csv</AttachmentTitle>\n    <AttachmentDescription>Reading time per post · 18 KB</AttachmentDescription>\n  </AttachmentContent>\n  <AttachmentActions>\n    <AttachmentAction aria-label='Preview september-report.csv' onClick={preview}>Preview</AttachmentAction>\n    <AttachmentAction asChild aria-label='Download september-report.csv'><a href={url} download='september-report.csv'>Download</a></AttachmentAction>\n  </AttachmentActions>\n</Attachment>\n  );\n}" }
  } },
  render: ({ onPreview }) => (
    <Attachment size='sm' className='w-full max-w-sm'>
      <AttachmentMedia file={{ name: 'september-report.csv', type: 'text/csv' }} />
      <AttachmentContent>
        <AttachmentTitle>september-report.csv</AttachmentTitle>
        <AttachmentDescription>Reading time per post · 18 KB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label='Preview september-report.csv' onClick={onPreview}><RegistryIcon lucide='Eye' /></AttachmentAction>
        <AttachmentAction asChild aria-label='Download september-report.csv'><a href='#download' download='september-report.csv'><RegistryIcon lucide='Download' /></a></AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Preview september-report.csv' }));
    await expect(args.onPreview).toHaveBeenCalledOnce();
    await expect(canvas.getByRole('link', { name: 'Download september-report.csv' })).toHaveAttribute('download', 'september-report.csv');
  }
};

const mixedFiles = attachmentExamples
  .filter((file) => !['study', 'banner'].includes(file.id))
  .map((file) => ({ ...file, type: 'file', mediaType: file.type }));

export const MixedAttachments = {
  name: 'Mixed attachments',
  args: { onFileAction: fn() },
  parameters: { docs: {
    description: { story: 'A delivered reply uses ChatMessageParts and the same Core AttachmentMedia as the composer. Images and an explicit video poster show local thumbnails; audio, video, documents, code, spreadsheets and links use their shared type icons. These files are metadata examples: the host receives preview/download requests and supplies file content.' },
    source: { language: 'jsx', code: "import { useState } from 'react';\nimport { ChatMessage, ChatMessageContent, ChatMessageHeader, ChatMessageParts } from '@gaudi/design-system/chat';\n" + 'const files = ' + JSON.stringify(attachmentExamples.filter((file) => !['study', 'banner'].includes(file.id)), null, 2) + ';' + "\nexport function MixedAttachmentsExample() {\n  const [action, setAction] = useState('');\n  return <div className='grid gap-3'><ChatMessage><ChatMessageContent><ChatMessageHeader>Gaudi</ChatMessageHeader><ChatMessageParts parts={files.map((file) => ({ ...file, type: 'file', mediaType: file.type }))} onFileAction={(action, file) => setAction(action + ' requested: ' + file.name)} /></ChatMessageContent></ChatMessage><p role='status'>{action}</p></div>;\n}\n// Supply previewUrl for a local image thumbnail or video poster; retrieval stays host-owned." }
  } },
  render: function MixedReply({ onFileAction }) {
    const [action, setAction] = useState('');
    return (
      <div className='grid w-full max-w-xl gap-3'>
        <ChatMessage>
          <ChatMessageContent>
            <ChatMessageHeader>Gaudi</ChatMessageHeader>
            <ChatMessageParts
              parts={[{ type: 'text', text: 'The campaign files are ready to review.' }, ...mixedFiles]}
              onFileAction={(next, file) => { setAction(`${next === 'preview' ? 'Preview' : 'Download'} requested: ${file.name}`); onFileAction(next, file); }}
            />
          </ChatMessageContent>
        </ChatMessage>
        <p role='status' aria-label='File action' className='break-words text-sm text-text-muted'>{action}</p>
      </div>
    );
  },
  play: async ({ args, canvasElement }) => {
    args.onFileAction.mockClear();
    const canvas = within(canvasElement);
    const cover = mixedFiles.find((file) => file.id === 'cover');
    const audio = mixedFiles.find((file) => file.id === 'audio');
    const image = canvas.getByText(cover.name).closest('[data-slot="attachment"]').querySelector('img');
    await expect(image).toHaveAttribute('src', cover.previewUrl);
    await waitFor(() => expect(image.naturalWidth).toBeGreaterThan(0));
    await userEvent.click(canvas.getByRole('button', { name: `Preview ${cover.name}`, exact: true }));
    await expect(args.onFileAction).toHaveBeenLastCalledWith('preview', cover);
    await userEvent.click(canvas.getByRole('button', { name: `Download ${audio.name}`, exact: true }));
    await expect(args.onFileAction).toHaveBeenLastCalledWith('download', audio);
    await expect(canvas.getByRole('status', { name: 'File action' })).toHaveTextContent(`Download requested: ${audio.name}`);
  }
};
