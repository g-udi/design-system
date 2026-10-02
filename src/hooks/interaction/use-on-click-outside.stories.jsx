import { useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../components/core/Button';
import Input from '../../components/core/Input';
import { useEventListener } from './use-event-listener.js';
import { example, hookMeta } from '../story-helpers.jsx';
import { useOnClickOutside } from './use-on-click-outside.js';

export default {
  title: 'Hooks/Interaction/useOnClickOutside',
  id: 'hooks-interaction-useonclickoutside',
  tags: ['autodocs'],
  ...hookMeta('useOnClickOutside')
};

function InlineTitleEditor() {
  const [ title, setTitle ] = useState('Designing calm interfaces');
  const [ draft, setDraft ] = useState(title);
  const [ editing, setEditing ] = useState(false);
  const editorRef = useRef(null);
  const triggerRef = useRef(null);
  const commit = () => {
    setTitle(draft.trim() || title);
    setEditing(false);
  };
  useOnClickOutside(editorRef, commit, { enabled: editing });
  useEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    setDraft(title);
    setEditing(false);
    triggerRef.current?.focus();
  }, editing ? 'document' : null);

  return editing ? (
    <div ref={editorRef} className='flex flex-wrap gap-2'>
      <Input aria-label='Post title' value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && commit()} autoFocus className='min-w-0 flex-1' />
      <Button onClick={commit}>Save</Button>
    </div>
  ) : (
    <div className='flex flex-wrap items-center gap-2'>
      <h3 className='text-base font-semibold'>{title}</h3>
      <Button ref={triggerRef} size='sm' variant='ghost' tone='neutral' onClick={() => {
        setDraft(title);
        setEditing(true);
      }}>Rename</Button>
    </div>
  );
}

export const InlineEditor = {
  name: 'Commit an inline editor',
  parameters: example('Clicking anywhere outside the editor saves it, Enter saves too, and Escape cancels and returns focus to Rename. `enabled` keeps the listener off while not editing.', `
import { Button, Input } from '@gaudi/design-system';
import { useEventListener, useOnClickOutside } from '@gaudi/design-system/hooks';

const editorRef = useRef(null);
useOnClickOutside(editorRef, commit, { enabled: editing });
useEventListener('keydown', (event) => event.key === 'Escape' && cancel(), editing ? 'document' : null);

<div ref={editorRef}>
  <Input aria-label='Post title' value={draft} onChange={(event) => setDraft(event.target.value)} />
  <Button onClick={commit}>Save</Button>
</div>`),
  render: () => <InlineTitleEditor />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Rename' }));
    const field = canvas.getByRole('textbox', { name: 'Post title' });
    await userEvent.clear(field);
    await userEvent.type(field, 'Calm by default');
    await userEvent.click(canvasElement.ownerDocument.body);
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Calm by default' })).toBeVisible());
  }
};

function HelpPanel() {
  const [ open, setOpen ] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  useOnClickOutside([ triggerRef, panelRef ], () => setOpen(false), { enabled: open });
  return (
    <div className='grid gap-2'>
      <Button ref={triggerRef} variant='outline' tone='neutral' className='w-fit' aria-expanded={open} aria-controls='markdown-help' onClick={() => setOpen(!open)}>Markdown help</Button>
      <div ref={panelRef} id='markdown-help' hidden={!open} className='rounded-(--ds-radius-card) border border-border bg-surface p-3 text-sm'>
        Use <code>**bold**</code>, <code>_italic_</code> and <code>[text](url)</code>.
      </div>
    </div>
  );
}

export const TriggerAndPanel = {
  name: 'Trigger and panel together',
  parameters: example('Pass both refs so clicking the trigger toggles instead of closing and reopening; a click anywhere else closes the panel.', `
useOnClickOutside([triggerRef, panelRef], () => setOpen(false), { enabled: open });`),
  render: () => <HelpPanel />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Markdown help' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
};
