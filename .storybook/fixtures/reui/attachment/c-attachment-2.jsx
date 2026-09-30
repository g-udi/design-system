// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useId, useState } from 'react';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle
} from '../../../../src/components/core/Attachment/parts/attachment.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const ICON_SHEET = (
  <RegistryIcon lucide='FileSpreadsheetIcon' aria-hidden='true' />
);
const ICON_IMAGE = <RegistryIcon lucide='ImageIcon' aria-hidden='true' />;
const ICON_TEXT = <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />;
const ICON_CODE = <RegistryIcon lucide='CodeIcon' aria-hidden='true' />;
const ICON_REMOVE = <RegistryIcon lucide='XIcon' aria-hidden='true' />;
const ICON_ATTACH = <RegistryIcon lucide='PaperclipIcon' aria-hidden='true' />;
const ICON_SEND = <RegistryIcon lucide='ArrowUpIcon' aria-hidden='true' />;
const FILES = [
  { id: 'churn', name: 'churn-drivers.csv', icon: ICON_SHEET },
  { id: 'pricing', name: 'pricing-tiers-v4.xlsx', icon: ICON_SHEET },
  { id: 'latency', name: 'checkout-latency.png', icon: ICON_IMAGE },
  { id: 'limits', name: 'rate-limits.md', icon: ICON_TEXT },
  { id: 'trace', name: 'stack-trace-2041.log', icon: ICON_CODE },
  { id: 'invoice', name: 'invoice-3182.pdf', icon: ICON_TEXT }
];
export function Pattern() {
  const id = useId();
  const [attachedIds, setAttachedIds] = useState([
    'churn',
    'pricing',
    'latency'
  ]);
  const attached = FILES.filter((file) => attachedIds.includes(file.id));
  const next = FILES.find((file) => !attachedIds.includes(file.id));
  const hasTray = attached.length > 0;
  const summary = `${attached.length} of ${FILES.length} attached`;
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-2'>
      <form onSubmit={(event) => event.preventDefault()}>
        <Field>
          <FieldLabel htmlFor={id} className='sr-only'>
            Message the assistant
          </FieldLabel>
          <InputGroup>
            {hasTray ? (
              <InputGroupAddon align='block-start'>
                {/*
                 * AttachmentGroup forces its children to flex-none and scrolls
                 * them, so the fourth and fifth chips slide sideways instead of
                 * adding a second row and shoving the transcript off screen.
                 */}
                <AttachmentGroup role='group' aria-label='Attached files'>
                  {attached.map((file) => (
                    <Attachment key={file.id} size='xs' className='max-w-52'>
                      <AttachmentMedia>{file.icon}</AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle>{file.name}</AttachmentTitle>
                      </AttachmentContent>
                      <AttachmentActions>
                        {/*
                         * type="button" is spelled out because this composer is
                         * a real form, and a button with no explicit type
                         * submits it.
                         */}
                        <AttachmentAction
                          type='button'
                          aria-label={`Remove ${file.name}`}
                          onClick={() =>
                            setAttachedIds((current) =>
                              current.filter((value) => value !== file.id)
                            )
                          }
                        >
                          {ICON_REMOVE}
                        </AttachmentAction>
                      </AttachmentActions>
                    </Attachment>
                  ))}
                </AttachmentGroup>
              </InputGroupAddon>
            ) : null}

            {/*
             * The textarea grows with the draft and stops at a cap, so a long
             * message scrolls inside the box instead of pushing the tray off
             * the top.
             */}
            <InputGroupTextarea
              aria-label='Ask about the billing incident...'
              id={id}
              placeholder='Ask about the billing incident...'
              className='field-sizing-content max-h-32 min-h-10'
            />

            <InputGroupAddon align='block-end'>
              {/*
               * Once the pool runs dry the paperclip is disabled rather than
               * removed: a control that vanishes reflows the row and explains
               * nothing.
               */}
              <InputGroupButton
                type='button'
                size='icon-sm'
                aria-label='Attach a file'
                disabled={!next}
                onClick={() => {
                  if (next) {
                    setAttachedIds((current) => [...current, next.id]);
                  }
                }}
              >
                {ICON_ATTACH}
              </InputGroupButton>
              <InputGroupText>{summary}</InputGroupText>
              <InputGroupButton
                type='submit'
                size='icon-sm'
                variant='default'
                className='ms-auto'
              >
                {ICON_SEND}
                <span className='sr-only'>Send</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </form>
      <span className='sr-only' aria-live='polite'>
        {summary}
      </span>
    </div>
  );
}
