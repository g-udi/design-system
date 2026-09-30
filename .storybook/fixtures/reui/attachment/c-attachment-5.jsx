// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle
} from '../../../../src/components/core/Attachment/parts/attachment.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const ICON_QUEUED = <RegistryIcon lucide='ClockIcon' aria-hidden='true' />;
const ICON_SCANNING = <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />;
const ICON_FAILED = (
  <RegistryIcon lucide='TriangleAlertIcon' aria-hidden='true' />
);
const ICON_DONE = <RegistryIcon lucide='CheckIcon' aria-hidden='true' />;
const ICON_RETRY = <RegistryIcon lucide='RotateCwIcon' aria-hidden='true' />;
const ICON_REMOVE = <RegistryIcon lucide='XIcon' aria-hidden='true' />;
const MEDIA = {
  idle: ICON_QUEUED,
  uploading: <Spinner />,
  processing: ICON_SCANNING,
  error: ICON_FAILED,
  done: ICON_DONE
};
const QUEUE = [
  {
    id: 'terms',
    name: 'annual-plan-terms.pdf',
    note: 'Ready to upload',
    detail: '1.2 MB',
    state: 'idle'
  },
  {
    id: 'replay',
    name: 'session-replay.mp4',
    note: 'Uploading',
    detail: '62%',
    state: 'uploading'
  },
  {
    id: 'chargebacks',
    name: 'chargeback-export.csv',
    note: 'Scanning for card numbers',
    detail: '3.1 MB',
    state: 'processing'
  },
  {
    id: 'ledger',
    name: 'ledger-2024.xlsx',
    note: 'Failed',
    detail: 'connection dropped',
    state: 'error'
  },
  {
    id: 'evidence',
    name: 'dispute-evidence.pdf',
    note: 'Uploaded',
    detail: '840 KB',
    state: 'done'
  }
];
export function Pattern() {
  const [rows, setRows] = useState(QUEUE);
  const finished = rows.filter((row) => row.state === 'done').length;
  const retry = (id) =>
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? { ...row, state: 'done', note: 'Uploaded', detail: '640 KB' }
          : row
      )
    );
  const dismiss = (id) =>
    setRows((current) => current.filter((row) => row.id !== id));
  return (
    <div className='mx-auto flex w-full max-w-xl flex-col gap-2'>
      <p className='text-ui-muted-foreground text-xs' aria-live='polite'>
        {finished} of {rows.length} uploaded
      </p>
      {rows.map((row) => (
        <Attachment key={row.id} state={row.state} className='w-full'>
          <AttachmentMedia>{MEDIA[row.state]}</AttachmentMedia>
          <AttachmentContent>
            {/*
             * The uploading and processing titles animate their own highlight:
             * that is the primitive reacting to data-state, not a per row job.
             */}
            <AttachmentTitle>{row.name}</AttachmentTitle>
            {/*
             * The failing row states its reason here, because the error state
             * is otherwise carried by colour alone. The description truncates,
             * so the same text doubles as the title for a narrow card.
             */}
            <AttachmentDescription title={`${row.note} (${row.detail})`}>
              {row.note}
              <span
                aria-hidden='true'
                className='bg-ui-muted-foreground/40 mx-1.5 inline-block size-1 rounded-full align-middle'
              />
              {row.detail}
            </AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            {row.state === 'error' ? (
              <AttachmentAction
                type='button'
                aria-label={`Retry ${row.name}`}
                onClick={() => retry(row.id)}
              >
                {ICON_RETRY}
              </AttachmentAction>
            ) : null}
            {/*
             * The dismiss label changes with the state. Cancelling an upload in
             * flight and removing a finished file are different promises.
             */}
            <AttachmentAction
              type='button'
              aria-label={
                row.state === 'uploading' || row.state === 'processing'
                  ? `Cancel upload of ${row.name}`
                  : `Remove ${row.name}`
              }
              onClick={() => dismiss(row.id)}
            >
              {ICON_REMOVE}
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
      {rows.length === 0 ? (
        <p className='text-ui-muted-foreground text-xs'>
          Nothing left in the queue.
        </p>
      ) : null}
    </div>
  );
}
