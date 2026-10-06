import { useRef, useState } from 'react';
import { attachmentExamples } from '../../../../../docs/fixtures/attachments.js';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import Button from '@gaudi/design-system/core/Button';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle, AttachmentTrigger } from '@gaudi/design-system/core/Attachment';

const descriptions = {
  cover: 'SVG image · local artwork',
  study: 'SVG image · local artwork',
  banner: 'SVG image · local artwork',
  document: 'PDF document · sample metadata',
  audio: 'MP3 audio · sample metadata',
  video: 'MP4 video · sample metadata',
  'video-poster': 'MP4 video · illustrative poster',
  link: 'Website link · sample metadata',
  code: 'TypeScript source · sample metadata',
  sheet: 'CSV spreadsheet · sample metadata'
};
const imageFiles = attachmentExamples.filter((file) => file.type.startsWith('image/'));
export const selectionLabel = (file) => `${file.type.startsWith('image/') ? 'Preview' : 'View details for'} ${file.name}`;

export function MediaExamples({ layout, onSelect, onRemove }) {
  const initial = layout === 'grid' ? imageFiles : attachmentExamples;
  const [files, setFiles] = useState(initial);
  const [selected, setSelected] = useState(null);
  const reset = useRef(null);
  const grid = layout === 'grid';
  const pills = layout === 'pills';
  return (
    <div className='mx-auto grid w-full max-w-2xl gap-4'>
      <div className='flex flex-col items-start justify-between gap-2 sm:flex-row'>
        <p className='min-w-0 flex-1 text-sm text-text-muted'>Select an attachment to inspect it. Images use local artwork; other entries show sample metadata.</p>
        <Button ref={reset} size='sm' variant='outline' onClick={() => { setFiles(initial); setSelected(null); }}>Reset attachments</Button>
      </div>
      {files.length ? (
        <ul aria-label='Attachments' className={grid ? 'grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3' : pills ? 'flex min-w-0 flex-wrap gap-2' : 'grid min-w-0 gap-2'}>
          {files.map((file) => (
            <li key={file.id} className='min-w-0 max-w-full'>
              <Attachment size={pills ? 'xs' : 'default'} orientation={grid ? 'vertical' : 'horizontal'} className={pills ? 'min-w-0 max-w-56 flex-nowrap' : 'w-full min-w-0 flex-nowrap'}>
                <AttachmentMedia file={file} />
                <AttachmentContent>
                  <AttachmentTitle title={file.name}>{file.name}</AttachmentTitle>
                  {!pills ? <AttachmentDescription title={descriptions[file.id]}>{descriptions[file.id]}</AttachmentDescription> : null}
                </AttachmentContent>
                <AttachmentTrigger aria-label={selectionLabel(file)} aria-pressed={selected?.id === file.id} onClick={() => { setSelected(file); onSelect?.(file); }} />
                <AttachmentActions>
                  <AttachmentAction aria-label={`Remove ${file.name}`} className={grid ? 'bg-surface' : undefined} onClick={() => {
                    setFiles((current) => current.filter((item) => item.id !== file.id));
                    if (selected?.id === file.id) setSelected(null);
                    onRemove?.(file.id);
                    reset.current?.focus();
                  }}><RegistryIcon lucide='X' /></AttachmentAction>
                </AttachmentActions>
              </Attachment>
            </li>
          ))}
        </ul>
      ) : <EmptyState compact title='No attachments' description='Reset the examples to restore the files.' />}
      <p role='status' className='text-xs text-text-muted'>{selected ? `Selected ${selected.name}` : `${files.length} attachments`}</p>
      {selected ? (
        <section aria-label='Selected attachment' className='grid min-w-0 gap-3 rounded-(--ds-radius-card) border p-3'>
          <h3 className='break-words text-sm font-semibold'>{selected.name}</h3>
          {selected.type.startsWith('image/') ? (
            <img src={selected.previewUrl} alt={`Abstract artwork from ${selected.name}`} className='aspect-video w-full rounded-(--ds-radius-card) object-cover' />
          ) : <p className='text-sm text-text-muted'>Sample metadata only. No file content, playable audio/video, or destination URL is supplied for this example.</p>}
          <p className='break-words text-xs text-text-muted'>{descriptions[selected.id]} · {selected.type}</p>
        </section>
      ) : null}
    </div>
  );
}
