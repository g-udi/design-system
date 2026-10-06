import { useState } from 'react';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { dusk } from '../../../../../docs/fixtures/site/artwork.js';
import { LoaderRoot } from '@gaudi/design-system/core/Loader';
import Button from '@gaudi/design-system/core/Button';
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from '@gaudi/design-system/core/Attachment';

// A realistic queue: the report follows the `state` control; its neighbours stay settled and failed.
export const files = [
  { name: 'cover-photo.jpg', size: '1.8 MB', image: dusk, state: 'done' },
  { name: 'quarterly-report.pdf', size: '2.4 MB', icon: 'FileTextIcon' },
  { name: 'subscribers.csv', size: '640 KB', icon: 'SheetIcon', state: 'error' }
];
export const [, controlled] = files;
// What each state shows: the media, the status line, and whether the upload is still in flight.
export const states = {
  idle: { icon: 'ClockIcon', status: 'Ready to upload' },
  uploading: { spinner: true, status: 'Uploading · 62%', inFlight: true },
  processing: { icon: 'ScanSearchIcon', status: 'Scanning for sensitive data', inFlight: true },
  done: {},
  error: { icon: 'TriangleAlertIcon', status: 'Failed · connection dropped' }
};
export const statusOf = (file, state) => states[state].status || file.size;
export const dismissLabel = (file, state) => `${states[state].inFlight ? 'Cancel upload of' : 'Remove'} ${file.name}`;

function FileAttachment({ file, state, onRemove, onRetry, ...props }) {
  const { spinner, icon = file.icon } = states[state];
  return (
    <Attachment state={state} {...props}>
      {file.image && state === 'done' ? (
        <AttachmentMedia variant='image'><img src={file.image} alt='' /></AttachmentMedia>
      ) : (
        <AttachmentMedia>{spinner ? <LoaderRoot /> : <RegistryIcon lucide={icon} aria-hidden='true' />}</AttachmentMedia>
      )}
      <AttachmentContent>
        <AttachmentTitle>{file.name}</AttachmentTitle>
        <AttachmentDescription>{statusOf(file, state)}</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        {state === 'error' ? (
          <AttachmentAction aria-label={`Retry ${file.name}`} onClick={() => onRetry(file.name)}>
            <RegistryIcon lucide='RotateCwIcon' aria-hidden='true' />
          </AttachmentAction>
        ) : null}
        <AttachmentAction aria-label={dismissLabel(file, state)} onClick={() => onRemove(file.name)}>
          <RegistryIcon lucide='XIcon' aria-hidden='true' />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}

export function AttachmentQueue({ onRemove, onRetry, ...args }) {
  const [entries, setEntries] = useState(files);
  const remove = (name) => { setEntries((current) => current.filter((file) => file.name !== name)); onRemove?.(name); };
  const retry = (name) => { setEntries((current) => current.map((file) => file.name === name ? { ...file, state: 'done' } : file)); onRetry?.(name); };
  return (
    <div className={args.orientation === 'vertical' ? 'flex flex-wrap justify-center gap-2' : 'mx-auto grid max-w-md gap-2'}>
      {entries.map((file) => <FileAttachment key={file.name} file={file} {...args} state={file.state || args.state} onRemove={remove} onRetry={retry} className={args.orientation === 'vertical' ? undefined : 'w-full'} />)}
      {entries.length < files.length && <Button variant='outline' size='sm' onClick={() => setEntries(files)}>Reset attachments</Button>}
    </div>
  );
}
