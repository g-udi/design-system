import { useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Input from '@gaudi/design-system/core/Input';
import { Field, FieldLabel } from '@gaudi/design-system/core/Field';
import { useEventListener } from '@gaudi/design-system/hooks/interaction/use-event-listener';
import { useFocusTrap } from '@gaudi/design-system/hooks/a11y/use-focus-trap';

function QuickReply() {
  const [ open, setOpen ] = useState(false);
  const triggerRef = useRef(null);
  const trapRef = useFocusTrap({ active: open });
  useEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  }, open ? 'document' : null);

  return (
    <div className='grid gap-3'>
      <Button ref={triggerRef} variant='outline' tone='neutral' className='w-fit' aria-expanded={open} onClick={() => setOpen(true)}>Quick reply</Button>
      {open ? (
        <div ref={trapRef} role='dialog' aria-labelledby='quick-reply-title' className='grid gap-3 rounded-(--ds-radius-card) border border-border bg-surface p-4'>
          <h3 id='quick-reply-title' className='text-sm font-semibold'>Reply to Amira</h3>
          <Field>
            <FieldLabel>Message</FieldLabel>
            <Input placeholder='Thanks, I will take a look' />
          </Field>
          <div className='flex justify-end gap-2'>
            <Button variant='ghost' tone='neutral' onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Send</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Lightbox() {
  const [ open, setOpen ] = useState(false);
  const trapRef = useFocusTrap({ active: open, initialFocus: 'container' });
  return (
    <div className='grid gap-3'>
      <Button variant='outline' tone='neutral' className='w-fit' onClick={() => setOpen(true)}>View diagram</Button>
      {open ? (
        <div ref={trapRef} tabIndex={-1} role='dialog' aria-label='Architecture diagram' className='grid gap-3 rounded-(--ds-radius-card) border border-border bg-surface-muted p-4 outline-none focus-visible:ring-2 focus-visible:ring-accent'>
          <div aria-hidden='true' className='grid h-32 place-items-center rounded-(--ds-radius-control) bg-surface text-sm text-text-muted'>Diagram</div>
          <p className='text-sm text-text-muted'>The reader starts on the dialog itself, so a screen reader reads its name before any control.</p>
          <Button className='w-fit' onClick={() => setOpen(false)}>Close</Button>
        </div>
      ) : null}
    </div>
  );
}

export { QuickReply, Lightbox };
