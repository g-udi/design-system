// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle
} from '../../../../src/components/core/Attachment/parts/attachment.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const ICON_REPORT = <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />;
const ICON_DOWNLOAD = <RegistryIcon lucide='DownloadIcon' aria-hidden='true' />;
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-3'>
      <p className='text-sm'>
        Here is the cohort breakdown you asked for. Numbers run through 30
        September.
      </p>
      {/*
       * The root sizes to its own content, so a chip meant to fill the reply
       * column has to be told to stretch.
       */}
      <Attachment className='w-full'>
        <AttachmentMedia>{ICON_REPORT}</AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>retention-cohorts-q3.pdf</AttachmentTitle>
          <AttachmentDescription>
            PDF
            <span
              aria-hidden='true'
              className='bg-ui-muted-foreground/40 mx-1.5 inline-block size-1 rounded-full align-middle'
            />
            1.9 MB
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          {/*
           * type="button" is spelled out because a bare <button> inside a form
           * defaults to submit, and this chip is meant to be pasted into one.
           */}
          <AttachmentAction
            type='button'
            size='icon-sm'
            variant='secondary'
            aria-label='Download retention-cohorts-q3.pdf'
          >
            {ICON_DOWNLOAD}
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  );
}
