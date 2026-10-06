import { useLayoutEffect, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Field, { FieldDescription, FieldInput, FieldLabel } from '@gaudi/design-system/core/Field';
import Dialog, { DialogClose } from '@gaudi/design-system/core/Dialog';
const iris = '/static/images/art/5.svg';
const articleTitle = 'A practical guide to knowledge graphs';
const summary = 'How linked entities and typed relations make a library searchable by meaning.';
const library = ['Local-first software', 'Design for real data', 'Research methods'];
const editTrigger = 'Edit article';

// Tracks the stage in viewport coordinates so the open dialog stays inside the docs canvas.
function useStageRect(ref) {
  const [rect, setRect] = useState(null);
  useLayoutEffect(() => {
    const node = ref.current;
    const view = node.ownerDocument.defaultView;
    const update = () => {
      const { top, left, width, height } = node.getBoundingClientRect();
      setRect({ top, left, width, height });
    };
    update();
    const observer = new view.ResizeObserver(update);
    observer.observe(node);
    view.addEventListener('scroll', update, true);
    view.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      view.removeEventListener('scroll', update, true);
      view.removeEventListener('resize', update);
    };
  }, [ref]);
  return rect;
}

const stagePlacement = (rect) => {
  if (!rect) return { visibility: 'hidden' };
  return { top: rect.top + rect.height / 2, left: rect.left + rect.width / 2, width: Math.min(576, rect.width - 32), maxHeight: rect.height - 32 };
};

/**
 * The preview opens the dialog non-modally inside a stage that stands in for the page, so it can stay open in the
 * docs while the controls change it. Opening it from the trigger moves focus in as usual.
 */
export function EditorExample({ onOpenChange, onSave, ...args }) {
  const stageRef = useRef(null);
  const [title, setTitle] = useState(articleTitle);
  const [description, setDescription] = useState(summary);
  const [alternateCover, setAlternateCover] = useState(false);
  const [saved, setSaved] = useState(false);
  const rect = useStageRect(stageRef);
  const [open, setOpen] = useState(true);
  const openedFromTrigger = useRef(false);
  const change = (next) => {
    openedFromTrigger.current = next;
    setOpen(next);
    onOpenChange?.(next);
  };
  return (
    <div ref={stageRef} className='relative mx-auto h-[30rem] w-full max-w-3xl overflow-hidden rounded-lg border border-border bg-surface-muted'>
      <div className='grid gap-2 p-3'>
        <div className='flex items-center justify-between gap-3'>
          <p className='text-sm font-semibold text-text'>Drafts</p>
          <Dialog
            {...args}
            modal={false}
            open={open}
            onOpenChange={change}
            trigger={<Button size='sm'>{editTrigger}</Button>}
            contentProps={{
              style: stagePlacement(rect),
              onOpenAutoFocus: (event) => (openedFromTrigger.current ? undefined : event.preventDefault()),
              onInteractOutside: (event) => event.preventDefault()
            }}
            footer={(
              <>
                <DialogClose asChild><Button variant='outline' tone='neutral'>Cancel</Button></DialogClose>
                <DialogClose asChild><Button onClick={() => { setSaved(true); onSave?.({ title, summary: description }); }}>Save changes</Button></DialogClose>
              </>
            )}
          >
            <div className='grid gap-4'>
              <div className='flex items-center gap-3'>
                <img src={alternateCover ? '/static/images/art/1.svg' : iris} alt='' className='aspect-video w-16 shrink-0 rounded-md object-cover sm:w-24' />
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-semibold text-text'>Cover image</p>
                  <p className='truncate text-xs text-text-muted'>{alternateCover ? 'Alternate local cover' : 'iris.svg · 1600 × 900'}</p>
                </div>
                <Button size='sm' variant='outline' tone='neutral' onClick={() => setAlternateCover((current) => !current)}>Replace</Button>
              </div>
              <Field>
                <FieldLabel>Title</FieldLabel>
                <FieldInput value={title} onChange={(event) => setTitle(event.target.value)} />
              </Field>
              <Field>
                <FieldLabel>Summary</FieldLabel>
                <FieldInput as='textarea' rows={2} className='py-2' value={description} onChange={(event) => setDescription(event.target.value)} />
                <FieldDescription>Shown in search results and link previews.</FieldDescription>
              </Field>
            </div>
          </Dialog>
        </div>
        {[articleTitle, ...library].map((title) => (
          <div key={title} className='rounded-md border border-border bg-surface p-3 text-sm text-text-muted'>{title}</div>
        ))}
      </div>
      {saved && !open && <p role='status' className='px-3 text-sm text-text-muted'>Saved “{title}” in this demo.</p>}
      {open ? <div aria-hidden='true' className='absolute inset-0 bg-(--ds-color-launcher-overlay-bg)' /> : null}
    </div>
  );
}
