import { useId, useRef, useState } from 'react';
import { Field, FieldInput, FieldLabel } from '@gaudi/design-system/core/Field';
import Button from '@gaudi/design-system/core/Button';
import { Alert, AlertDescription, AlertTitle } from '@gaudi/design-system/core/Banner';
import { useOnlineStatus } from '@gaudi/design-system/hooks/environment/use-online-status';

function PublishBar() {
  const online = useOnlineStatus();
  const id = useId();
  const input = useRef(null);
  const [draft, setDraft] = useState('November release notes');
  const [published, setPublished] = useState('');
  return (
    <div className='grid gap-3'>
      {online ? null : (
        <Alert variant='warning'>
          <AlertTitle>You are offline</AlertTitle>
          <AlertDescription>You can keep editing this draft. Reconnect to publish.</AlertDescription>
        </Alert>
      )}
      <Field>
        <FieldLabel htmlFor={id}>Draft title</FieldLabel>
        <FieldInput ref={input} id={id} value={draft} onChange={(event) => setDraft(event.target.value)} />
      </Field>
      <div className='flex gap-2'>
        <Button variant='outline' tone='neutral' onClick={() => input.current?.focus()}>
          Keep editing
        </Button>
        <Button disabled={!online || !draft.trim()} onClick={() => setPublished(draft.trim())}>
          Publish
        </Button>
      </div>
      <p role='status' className='text-sm text-text-muted'>
        {published && `Published in this example: ${published}`}
      </p>
    </div>
  );
}

export { PublishBar };
