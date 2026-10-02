import { useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Input from '../../components/core/Input';
import { Field, FieldLabel } from '../../components/core/Field/index.js';
import { useEventListener } from '../interaction/use-event-listener.js';
import { example, hookMeta } from '../story-helpers.jsx';
import { useFocusTrap } from './use-focus-trap.js';

export default {
  title: 'Hooks/A11y/useFocusTrap',
  id: 'hooks-a11y-usefocustrap',
  tags: ['autodocs'],
  ...hookMeta('useFocusTrap')
};

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

export const InlinePanel = {
  name: 'Custom reply panel',
  parameters: example('Opening the panel moves focus to its first field; Tab and Shift+Tab cycle inside it, and Escape or Cancel closes it and returns focus to the trigger.', `
import { useState } from 'react';
import { Button, Field, FieldLabel, Input } from '@gaudi/design-system';
import { useEventListener, useFocusTrap } from '@gaudi/design-system/hooks';

export function QuickReply() {
  const [open, setOpen] = useState(false);
  const trapRef = useFocusTrap({ active: open });
  useEventListener('keydown', (event) => event.key === 'Escape' && setOpen(false), open ? 'document' : null);

  return (
    <>
      <Button aria-expanded={open} onClick={() => setOpen(true)}>Quick reply</Button>
      {open && (
        <div ref={trapRef} role='dialog' aria-labelledby='quick-reply-title'>
          <h3 id='quick-reply-title'>Reply to Amira</h3>
          <Field><FieldLabel>Message</FieldLabel><Input /></Field>
          <Button variant='ghost' onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Send</Button>
        </div>
      )}
    </>
  );
}`),
  render: () => <QuickReply />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Quick reply' });
    await userEvent.click(trigger);
    const field = await canvas.findByRole('textbox', { name: 'Message' });
    await waitFor(() => expect(field).toHaveFocus());
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Send' })).toHaveFocus();
    await userEvent.tab();
    await expect(field).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  }
};

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

export const ContainerFocus = {
  name: 'Focus the container first',
  parameters: example("`initialFocus: 'container'` focuses the overlay itself (give it `tabIndex={-1}`), useful when the first control is not the right starting point.", `
const trapRef = useFocusTrap({ active: open, initialFocus: 'container' });

<div ref={trapRef} tabIndex={-1} role='dialog' aria-label='Architecture diagram'>
  …
  <Button onClick={() => setOpen(false)}>Close</Button>
</div>`),
  render: () => <Lightbox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'View diagram' }));
    const dialog = await canvas.findByRole('dialog', { name: 'Architecture diagram' });
    await waitFor(() => expect(dialog).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
  }
};
