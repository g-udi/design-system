'use client';
import { cn } from '../../../../utilities/cn/index.js';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle
} from '../../../core/Attachment/parts/attachment.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';

const fileIcon = (name = '', type = '') => {
  if (/image\//.test(type) || /\.(png|jpe?g|gif|webp|svg)$/i.test(name)) return 'Image';
  if (/\.(csv|xlsx?)$/i.test(name)) return 'FileSpreadsheet';
  if (/\.(js|jsx|ts|tsx|json|md|mdx|css|py)$/i.test(name)) return 'FileCode';
  return 'FileText';
};

/** A file the assistant delivered, with optional preview and download actions. */
function MessageFile({ name, type, size, description, onPreview, onDownload, href, className }) {
  return (
    <Attachment data-slot='message-file' size='sm' className={cn('ds-part-message-file max-w-sm', className)}>
      <AttachmentMedia>
        <RegistryIcon lucide={fileIcon(name, type)} />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{name}</AttachmentTitle>
        <AttachmentDescription>{[description, size].filter(Boolean).join(' · ')}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        {onPreview ? <AttachmentAction aria-label={`Preview ${name}`} onClick={onPreview}><RegistryIcon lucide='Eye' /></AttachmentAction> : null}
        {onDownload || href ? (
          <AttachmentAction aria-label={`Download ${name}`} onClick={onDownload} {...(href ? { asChild: true } : {})}>
            {href ? <a href={href} download={name}><RegistryIcon lucide='Download' /></a> : <RegistryIcon lucide='Download' />}
          </AttachmentAction>
        ) : null}
      </AttachmentActions>
    </Attachment>
  );
}

export { MessageFile };
