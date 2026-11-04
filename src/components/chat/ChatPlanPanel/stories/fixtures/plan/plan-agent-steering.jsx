'use client';
import { useId, useRef, useState } from 'react';
import { ChatPlan } from '@gaudi/design-system/chat/ChatPlanPanel';
import { ChatPromptQueue } from '@gaudi/design-system/chat/ChatInput';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import Button from '@gaudi/design-system/core/Button';
import Textarea from '@gaudi/design-system/core/Textarea';
import { Badge } from '@gaudi/design-system/core/Pill';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const plan = [
  { id: 'read', title: 'Read the draft and reader replies', description: 'Understand the question readers are trying to answer.' },
  { id: 'outline', title: 'Outline the rewrite', description: 'Choose an opening and keep the useful examples.' },
  { id: 'write', title: 'Write the new opening', description: 'Draft a clear, focused introduction.' },
  { id: 'review', title: 'Check the sources and tone', description: 'Prepare the revision for your review.' }
];
function initialRun() {
  return { active: 1, paused: false, notes: { outline: [{ id: 'voice', text: 'Preserve the author’s voice.', label: 'Applied immediately' }] }, queue: [{ id: 'length', text: 'Keep the opening under 150 words.' }], nextId: 1, notice: 'Outlining the rewrite. One note is waiting for the next step.' };
}

export function Pattern() {
  const [run, setRun] = useState(initialRun);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);
  const titleId = useId();
  const fieldId = useId();
  const hintId = useId();
  const done = run.active >= plan.length;
  const finalStep = run.active === plan.length - 1;
  const canQueue = !done && !finalStep && !!draft.trim();
  const canApply = !done && !run.paused && !!draft.trim();
  const steps = plan.map((step, index) => ({ ...step, status: index < run.active ? 'done' : index === run.active ? run.paused ? 'awaiting' : 'running' : 'pending', notes: run.notes[step.id] }));

  function focusInput() { requestAnimationFrame(() => inputRef.current?.focus()); }
  function submit(now = false) {
    const text = draft.trim();
    if (!text || done || (now ? run.paused : finalStep)) return;
    setRun(current => {
      const note = { id: `steer-${current.nextId}`, text };
      if (!now) return { ...current, nextId: current.nextId + 1, queue: [...current.queue, note], notice: 'Note queued for the next step. The current step continues.' };
      const step = plan[current.active];
      return { ...current, nextId: current.nextId + 1, notes: { ...current.notes, [step.id]: [...(current.notes[step.id] || []), { ...note, label: 'Applied immediately' }] }, notice: `Instruction applied to ${step.title}. The current step now follows your note.` };
    });
    setDraft(''); focusInput();
  }
  function applyQueued(id) {
    if (done || run.paused) return;
    setRun(current => {
      const note = current.queue.find(item => item.id === id);
      if (!note) return current;
      const step = plan[current.active];
      return { ...current, queue: current.queue.filter(item => item.id !== id), notes: { ...current.notes, [step.id]: [...(current.notes[step.id] || []), { ...note, label: 'Applied immediately' }] }, notice: `Queued note applied immediately to ${step.title}.` };
    });
    focusInput();
  }
  function advance() {
    if (done || run.paused || (finalStep && draft.trim())) return;
    setRun(current => {
      const next = current.active + 1;
      if (next === plan.length) return { ...current, active: next, notice: 'Revision ready for review. All applied notes remain with their steps.' };
      const step = plan[next];
      const pickedUp = current.queue.map(note => ({ ...note, label: 'Picked up at step start' }));
      return { ...current, active: next, queue: [], notes: { ...current.notes, [step.id]: [...(current.notes[step.id] || []), ...pickedUp] }, notice: `${step.title} started. ${pickedUp.length ? `${pickedUp.length} queued ${pickedUp.length === 1 ? 'note was' : 'notes were'} picked up.` : 'No notes were waiting.'}` };
    });
  }

  return <section aria-labelledby={titleId} className='ds-touch-controls mx-auto grid w-full min-w-0 max-w-2xl grid-cols-1 gap-4'>
    <header className='flex flex-wrap items-center justify-between gap-3'>
      <div className='flex min-w-0 items-center gap-2'><ChatAgentMark name='Writing agent' icon='Pencil' tone='neutral' size='sm' decorative /><div className='grid min-w-0 gap-1'><h2 id={titleId} className='text-lg font-semibold'>Steer the rewrite</h2><p className='text-xs text-text-muted'>Writing agent · a revision in progress</p></div></div>
      <div className='flex flex-wrap items-center gap-2'><Badge variant={done ? 'success-light' : run.paused ? 'warning-light' : 'secondary'}>{done ? 'Complete' : run.paused ? 'Paused' : 'Running'}</Badge><Button size='sm' variant='outline' disabled={done} aria-pressed={run.paused} onClick={() => setRun(current => ({ ...current, paused: !current.paused, notice: current.paused ? 'Run resumed. Queued notes will be picked up at the next step.' : 'Run paused. You can still queue, edit or remove notes.' }))}><RegistryIcon lucide={run.paused ? 'Play' : 'Pause'} className='size-3.5' />{run.paused ? 'Resume run' : 'Pause run'}</Button></div>
    </header>
    <ChatPlan title='Revision plan' steps={steps} />
    <ChatPromptQueue items={run.queue} labels={{ title: 'Next-step notes', hint: run.paused ? 'Waiting until the run resumes.' : 'Picked up when the next step starts.', sendNow: 'Apply now' }} onEdit={(id, text) => setRun(current => ({ ...current, queue: current.queue.map(note => note.id === id ? { ...note, text } : note), notice: 'Queued note updated.' }))} onRemove={id => { setRun(current => ({ ...current, queue: current.queue.filter(note => note.id !== id), notice: 'Note removed from the queue.' })); focusInput(); }} onSendNow={run.paused || done ? undefined : applyQueued} />
    <form className='grid min-w-0 gap-2' onSubmit={event => { event.preventDefault(); submit(); }}>
      <label htmlFor={fieldId} className='text-sm font-medium'>{done ? 'Run complete' : 'Steer the agent'}</label>
      <Textarea ref={inputRef} id={fieldId} value={draft} disabled={done} rows={3} maxLength={1000} aria-describedby={hintId} placeholder={done ? 'Start another run to add instructions.' : finalStep ? 'Add an instruction for this final step…' : 'What should the agent do differently?'} className='min-h-24 w-full min-w-0' onChange={event => setDraft(event.target.value)} onKeyDown={event => {
        if (event.nativeEvent.isComposing || event.keyCode === 229) return;
        if (event.key === 'Escape') { event.preventDefault(); setDraft(''); }
        if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(event.metaKey || event.ctrlKey); }
      }} />
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p id={hintId} className='min-w-0 flex-1 basis-64 text-xs leading-relaxed text-text-muted'>{done ? 'The plan retains every applied instruction.' : finalStep ? 'Final step: apply notes now. Clear or apply your draft before finishing.' : 'Enter queues · Ctrl/Cmd+Enter applies now · Shift+Enter adds a line · Escape clears.'}{run.paused && !done ? ' Resume to apply a note immediately.' : ''}</p>
        <span className='text-xs tabular-nums text-text-muted'><bdi>{draft.length}/1000</bdi></span>
      </div>
      <div className='flex flex-wrap gap-2'><Button type='submit' size='sm' disabled={!canQueue}>Queue for next step</Button><Button type='button' size='sm' variant='outline' disabled={!canApply} onClick={() => submit(true)}>Apply now</Button></div>
    </form>
    <footer className='grid gap-3 border-t border-border pt-4'>
      <p role='status' aria-live='polite' aria-atomic='true' className='text-sm leading-relaxed text-text-muted'>{run.notice}</p>
      <div className='flex flex-wrap items-center justify-between gap-2'><Button size='sm' variant='outline' disabled={done || run.paused || (finalStep && !!draft.trim())} onClick={advance}>{done ? 'Run complete' : finalStep ? 'Finish run' : 'Next step'}<RegistryIcon lucide={done ? 'Check' : 'ArrowRight'} className='size-3.5 rtl:rotate-180' /></Button><Button size='sm' variant='ghost' onClick={() => { setRun(initialRun()); setDraft(''); }}>Reset demo</Button></div>
      <p className='text-xs text-text-muted'>Local demo. Advance steps to simulate the agent picking up your notes; no document or service is changed.</p>
    </footer>
  </section>;
}
