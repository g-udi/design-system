import { useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Input from '@gaudi/design-system/core/Input';
import { useEventListener } from '@gaudi/design-system/hooks/interaction/use-event-listener';
import { useOnClickOutside } from '@gaudi/design-system/hooks/interaction/use-on-click-outside';

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

export { InlineTitleEditor, HelpPanel };
