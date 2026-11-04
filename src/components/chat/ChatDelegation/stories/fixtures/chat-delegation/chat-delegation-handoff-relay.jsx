'use client';
import { useId, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { Badge } from '@gaudi/design-system/core/Pill';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@gaudi/design-system/core/Accordion';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// Fictional handoffs. The application supplies context and decides when work may continue.
const agents = [
  { name: 'Researcher', icon: 'Search', role: 'Find the sources and prepare the brief.' },
  { name: 'Writer', icon: 'Pencil', role: 'Turn the brief into a useful first draft.' },
  { name: 'Reviewer', icon: 'FileCheck', role: 'Check the draft against its sources.' }
];
const handoffs = [
  { from: 'Researcher', to: 'Writer', title: 'Research brief', items: [
    { id: 'posts', icon: 'Copy', label: 'Two related posts', detail: 'Merging offline edits · CRDTs for writers' },
    { id: 'overlap', icon: 'SearchCheck', label: 'Overlap analysis', detail: '38% overlaps with the existing archive.' },
    { id: 'decision', icon: 'ListChecks', label: 'Link instead of repeating', detail: 'Keep the new draft focused on recovery.' },
    { id: 'backup', icon: 'MessageSquare', label: 'Keep the original copy', detail: 'Always ask readers to back up their local edits before merging.' }
  ] },
  { from: 'Writer', to: 'Reviewer', title: 'Draft for review', items: [
    { id: 'draft', icon: 'FileText', label: 'Recovering offline edits.md', detail: 'Draft 2 · 860 words' },
    { id: 'links', icon: 'Link', label: 'Two source links', detail: 'Both archive posts are cited in the draft.' },
    { id: 'constraint', icon: 'MessageSquare', label: 'Keep the original copy', detail: 'Always ask readers to back up their local edits before merging.', lost: true, why: 'The safety note was left out when the research brief was condensed.' }
  ] }
];

function Transfer({ handoff, restored, onRestore }) {
  const missing = handoff.items.some(item => item.lost) && !restored;
  return (
    <Collapsible defaultOpen className='min-w-0 border-t border-border pt-3'>
      <CollapsibleTrigger asChild>
        <Button variant='ghost' aria-label={`Inspect ${handoff.from} to ${handoff.to}`} className='group h-auto w-full min-w-0 items-start justify-between gap-2 whitespace-normal px-0 py-2 text-start'>
          <span className='grid min-w-0 gap-2'>
            <span className='flex flex-wrap items-center gap-1.5 text-xs font-normal text-text-muted'><span>{handoff.from}</span><RegistryIcon lucide='ArrowRight' className='size-3 rtl:rotate-180' /><span>{handoff.to}</span></span>
            <span className='text-sm font-medium'>{handoff.title}</span>
            <Badge variant={missing ? 'warning-light' : 'secondary'}><bdi>{missing ? '1 item missing' : `${handoff.items.length} items passed`}</bdi></Badge>
          </span>
          <RegistryIcon lucide='ChevronDown' className='mt-1 size-3.5 shrink-0 group-data-[state=open]:rotate-180' />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul aria-label={`${handoff.from} to ${handoff.to} context`} className='m-0 grid list-none gap-0 p-0'>
          {handoff.items.map(item => <li key={item.id} className='grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-2 border-b border-border py-3 last:border-0'>
            <RegistryIcon lucide={item.lost && !restored ? 'CircleAlert' : item.icon} className='mt-0.5 size-4 text-text-muted' />
            <div className='grid min-w-0 gap-1.5'>
              <span className='break-words text-sm font-medium'>{item.label}</span>
              <p className='text-xs leading-relaxed text-text-muted'>{item.detail}</p>
              {item.lost && <>
                <span className='text-xs font-medium'>{restored ? 'Restored to the review context' : 'Missing from the review context'}</span>
                {!restored && <p className='text-xs leading-relaxed text-text-muted'>{item.why}</p>}
                <Button size='sm' variant='outline' className='mt-1 justify-self-start' aria-disabled={restored} onClick={() => { if (!restored) onRestore(); }}>
                  <RegistryIcon lucide={restored ? 'Check' : 'Undo'} className='size-3.5' />{restored ? 'Context restored' : 'Restore context'}
                </Button>
              </>}
            </div>
          </li>)}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Pattern() {
  const titleId = useId();
  const [stage, setStage] = useState(2);
  const [restored, setRestored] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [notice, setNotice] = useState('The reviewer is waiting for one missing item. Restore the context to continue.');
  const blocked = stage === 2 && !restored;
  const done = stage === 3;
  const current = agents[Math.min(stage, 2)];

  function advance() {
    if (blocked || done || disconnected) return;
    const next = stage + 1;
    setStage(next);
    setNotice(next === 1 ? 'Researcher passed four context items to Writer.' : next === 2 ? 'Writer passed the draft to Reviewer. One safety note is missing.' : 'Review complete. The draft includes the sources and the safety note.');
  }
  function reset() {
    setStage(0); setRestored(false); setDisconnected(false);
    setNotice('Researcher is preparing the brief. No handoffs yet.');
  }

  return (
    <section aria-labelledby={titleId} className='ds-touch-controls @container mx-auto grid w-full min-w-0 max-w-6xl grid-cols-1 gap-5'>
      <header className='flex flex-wrap items-start justify-between gap-3'>
        <div className='grid min-w-0 gap-1'><h2 id={titleId} className='text-lg font-semibold'>An article, from brief to review</h2><p className='text-sm text-text-muted'>Follow the work. See what each agent passed on.</p></div>
        <Badge variant={done ? 'success-light' : blocked || disconnected ? 'warning-light' : 'secondary'}>{done ? 'Review complete' : disconnected ? 'Disconnected' : blocked ? 'Needs context' : 'In progress'}</Badge>
      </header>

      <ol aria-label='Agent handoff relay' className='m-0 grid min-w-0 list-none grid-cols-1 gap-6 p-0 @[56rem]:grid-cols-3'>
        {agents.map((agent, index) => {
          const finished = stage > index;
          const active = stage === index;
          const status = finished ? 'Done' : !active ? 'Queued' : disconnected ? 'Offline' : blocked ? 'Waiting' : 'Working';
          return <li key={agent.name} aria-current={active ? 'step' : undefined} className='grid min-w-0 content-start gap-4'>
            <div className='grid gap-2'>
              <div className='flex flex-wrap items-center gap-2'>
                <ChatAgentMark name={agent.name} icon={agent.icon} size='sm' tone='neutral' decorative />
                <h3 className='min-w-0 flex-1 text-sm font-semibold'>{agent.name}</h3>
                <Badge variant={active && (blocked || disconnected) ? 'warning-light' : finished ? 'success-light' : 'secondary'}>{status}</Badge>
              </div>
              <p className='text-xs leading-relaxed text-text-muted'>{agent.role}</p>
            </div>
            {index < 2 ? (stage > index ? <Transfer handoff={handoffs[index]} restored={restored} onRestore={() => { setRestored(true); setNotice(disconnected ? 'Safety note restored. Reconnect Reviewer to continue.' : 'Safety note restored. Reviewer can now finish the review.'); }} /> : <p className='border-t border-border pt-4 text-sm text-text-muted'>{active ? 'Preparing the next handoff.' : 'Waiting for the previous agent.'}</p>) : <div className='grid gap-3 border-t border-border pt-4'>
              <h4 className='text-sm font-medium'>{done ? 'Ready for your review' : blocked ? 'A safety note did not arrive' : stage < 2 ? 'Review has not started' : 'All context is available'}</h4>
              <p className='text-sm leading-relaxed text-text-muted'>{done ? 'The draft links to both archive posts and reminds readers to preserve their local edits before merging.' : blocked ? 'The draft explains how to merge edits, but the reviewer cannot verify the backup instruction. Restore it in the Writer’s handoff.' : stage < 2 ? 'The reviewer will check the draft and its supporting context when they arrive.' : 'The missing instruction is back. Continue to check the draft against the complete brief.'}</p>
              {stage >= 2 && <ul aria-label='Review checklist' className='m-0 grid list-none gap-2 p-0 text-xs'>
                {[{ label: 'Source links included', complete: true }, { label: 'Backup instruction included', complete: restored }].map(item => <li key={item.label} className='flex items-start gap-2'><RegistryIcon lucide={item.complete ? 'Check' : 'CircleDashed'} className='size-3.5 shrink-0' /><span>{item.complete ? item.label : 'Backup instruction missing'}</span></li>)}
              </ul>}
            </div>}
          </li>;
        })}
      </ol>

      <footer className='grid gap-4 border-t border-border pt-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <p role='status' aria-live='polite' aria-atomic='true' className='min-w-0 flex-1 basis-64 text-sm leading-relaxed text-text-muted'>{notice}</p>
          <Button size='sm' disabled={blocked || done || disconnected} onClick={advance}>{done ? 'Review complete' : stage === 2 ? 'Finish review' : 'Next step'}<RegistryIcon lucide={done ? 'Check' : 'ArrowRight'} className='size-3.5 rtl:rotate-180' /></Button>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <Button size='sm' variant='outline' onClick={reset}>Reset demo</Button>
          <Button size='sm' variant='ghost' disabled={done} onClick={() => { setDisconnected(value => !value); setNotice(disconnected ? `${current.name} reconnected. ${blocked ? 'Restore the missing context to continue.' : 'Ready to continue.'}` : `${current.name} disconnected. All handoffs are preserved. Retry to continue.`); }}>{disconnected ? 'Retry connection' : 'Simulate disconnect'}</Button>
          <span className='text-xs text-text-muted'>Local demo · no agents or files are changed.</span>
        </div>
      </footer>
    </section>
  );
}
