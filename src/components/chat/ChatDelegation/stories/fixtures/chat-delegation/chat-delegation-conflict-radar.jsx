'use client';
import { useId, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { Badge } from '@gaudi/design-system/core/Pill';
import DataTable from '@gaudi/design-system/core/DataTable';
import RadioGroup from '@gaudi/design-system/core/RadioGroup';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@gaudi/design-system/core/EmptyState';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const agents = [
  { id: 'security', name: 'Security', icon: 'Shield', branch: 'agents/invite-permissions', doneAt: 1 },
  { id: 'delivery', name: 'Delivery', icon: 'Mail', branch: 'agents/invite-delivery', doneAt: 2 },
  { id: 'retries', name: 'Retries', icon: 'RotateCw', branch: 'agents/retry-safety', doneAt: 2 }
];
// Prepared, fictional edit snapshots. This example does not inspect or alter a repository.
const files = [
  { id: 'create', path: 'src/invitations/create.ts', totalLines: 120, conflict: true, overlap: 'Lines 56–72', reason: 'Both agents replace the same invitation handler.', edits: [
    { agent: 'security', start: 44, end: 72, approach: 'Validate the requested role before creating the invitation.', tradeoff: 'Keeps the permission check; does not add the delivery receipt.' },
    { agent: 'delivery', start: 56, end: 88, approach: 'Create the invitation and return a delivery receipt.', tradeoff: 'Keeps the receipt response; the permission check needs a follow-up.' }
  ] },
  { id: 'mail', path: 'src/lib/mail.ts', totalLines: 96, conflict: true, overlap: 'Lines 32–42', reason: 'The delivery and retry agents changed the same send operation.', edits: [
    { agent: 'delivery', start: 18, end: 42, approach: 'Send once and expose the provider message ID.', tradeoff: 'Makes delivery traceable; temporary failures still need a retry.' },
    { agent: 'retries', start: 32, end: 60, approach: 'Retry temporary failures using a stable idempotency key.', tradeoff: 'Avoids duplicate sends; does not expose the provider message ID.' }
  ] },
  { id: 'tests', path: 'tests/invitations.spec.ts', totalLines: 110, conflict: false, reason: 'Two agents changed separate ranges; no overlapping lines.', edits: [
    { agent: 'security', start: 12, end: 30 }, { agent: 'retries', start: 70, end: 92 }
  ] },
  { id: 'roles', path: 'src/permissions/roles.ts', totalLines: 72, conflict: false, edits: [{ agent: 'security', start: 8, end: 34 }] },
  { id: 'receipt', path: 'src/invitations/receipt.tsx', totalLines: 84, conflict: false, edits: [{ agent: 'delivery', start: 20, end: 62 }] },
  { id: 'backoff', path: 'src/lib/backoff.ts', totalLines: 48, conflict: false, edits: [{ agent: 'retries', start: 1, end: 36 }] }
];
const conflicts = files.filter(file => file.conflict);
const initialNotice = 'Two files have overlapping edits. Compare the approaches before merging.';

export function Pattern() {
  const titleId = useId();
  const compareId = useId();
  const resetButton = useRef(null);
  const comparison = useRef(null);
  const [stage, setStage] = useState(0);
  const [selectedId, setSelectedId] = useState('create');
  const [resolutions, setResolutions] = useState({});
  const [disconnected, setDisconnected] = useState(false);
  const [merged, setMerged] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [notice, setNotice] = useState(initialNotice);
  const selected = conflicts.find(file => file.id === selectedId);
  const unsettled = conflicts.filter(file => !resolutions[file.id]).length;
  const done = agents.filter(agent => stage >= agent.doneAt && !(disconnected && agent.id === 'delivery')).length;
  const canMerge = !empty && !merged && !disconnected && done === agents.length && unsettled === 0;
  const stateOf = agent => disconnected && agent.id === 'delivery' ? 'Disconnected' : stage >= agent.doneAt ? 'Done' : 'Writing';
  const mergeReason = empty ? 'No changes to merge.' : merged ? 'Demo changes merged. Your choices remain available for review.' : disconnected ? 'Reconnect Delivery before merging.' : unsettled ? `${unsettled} ${unsettled === 1 ? 'conflict remains' : 'conflicts remain'}.` : done < agents.length ? 'Choices saved. Waiting for agents to finish.' : 'All conflicts settled. Ready to merge the demo changes.';

  function reset(makeEmpty = false) {
    setStage(0); setSelectedId('create'); setResolutions({}); setDisconnected(false); setMerged(false); setEmpty(makeEmpty);
    setNotice(makeEmpty ? 'No edits in this snapshot.' : initialNotice);
    resetButton.current?.focus();
  }
  function inspect(file) { setSelectedId(file.id); setNotice(`Comparing ${file.path}. ${file.overlap} overlap.`); }
  function choose(agentId) {
    setResolutions(previous => ({ ...previous, [selected.id]: agentId }));
    setNotice(`${agents.find(agent => agent.id === agentId).name} approach kept for ${selected.path}. No source files were changed.`);
  }
  const columns = [
    { key: 'path', header: 'File', width: '34%', render: file => <div className='grid min-w-48 gap-1'>
      {file.conflict ? <Button variant='ghost' aria-label={`Compare ${file.path}`} aria-controls={compareId} aria-pressed={selectedId === file.id} onClick={() => inspect(file)} className='h-auto min-w-0 justify-start px-0 py-1 text-start whitespace-normal'><span dir='ltr' className='wrap-anywhere'>{file.path}</span></Button> : <span dir='ltr' className='text-sm wrap-anywhere'>{file.path}</span>}
      <span className='flex items-center gap-1 text-xs text-text-muted'><RegistryIcon lucide={file.conflict ? resolutions[file.id] ? 'Check' : 'GitMerge' : 'FileCheck'} className='size-3' />{file.conflict ? resolutions[file.id] ? 'Settled' : 'Overlapping edits' : file.edits.length > 1 ? 'Separate ranges' : 'Independent edit'}</span>
    </div> },
    ...agents.map(agent => ({ key: agent.id, header: <div className='flex min-w-36 items-center gap-2'>
      <ChatAgentMark name={agent.name} icon={agent.icon} tone='neutral' size='sm' decorative />
      <span className='grid gap-1'><span>{agent.name}</span><span dir='ltr' className='max-w-40 text-xs font-normal text-text-muted wrap-anywhere'>{agent.branch}</span><span className='text-xs font-normal text-text-muted'>{stateOf(agent)}</span></span>
    </div>, render: file => {
      const edit = file.edits.find(item => item.agent === agent.id);
      if (!edit) return <span className='text-xs text-text-muted'>No edit</span>;
      const kept = resolutions[file.id] === agent.id;
      const replaced = file.conflict && resolutions[file.id] && !kept;
      return <div className='grid min-w-36 gap-1.5' aria-label={`${agent.name}, ${file.path}`}>
        <span className='text-xs tabular-nums'><bdi>Lines {edit.start}–{edit.end}</bdi></span>
        <span aria-hidden='true' className='block h-1.5 w-full overflow-hidden rounded-(--ds-radius-control) bg-surface-muted'>
          <span className={`block h-full rounded-(--ds-radius-control) ${kept ? 'bg-success' : replaced ? 'bg-border' : file.conflict ? 'bg-warning' : 'bg-accent'}`} style={{ marginInlineStart: `${(edit.start - 1) / file.totalLines * 100}%`, width: `${(edit.end - edit.start + 1) / file.totalLines * 100}%` }} />
        </span>
        <span className='text-xs text-text-muted'>{kept ? 'Kept' : replaced ? 'Not kept' : stateOf(agent) === 'Done' ? 'Changed' : stateOf(agent)}</span>
      </div>;
    } }))
  ];

  return (
    <section aria-labelledby={titleId} className='ds-touch-controls mx-auto grid w-full min-w-0 max-w-5xl gap-5'>
      <header className='flex flex-wrap items-start justify-between gap-3'>
        <div className='grid gap-1'><h2 id={titleId} className='m-0 text-lg font-semibold'>Conflict radar</h2><p className='m-0 text-sm text-text-muted'>Invitation workflow · parallel edits</p></div>
        <div className='flex flex-wrap gap-2'><Badge variant={merged ? 'success-light' : 'secondary'}><bdi>{empty ? 'No changes' : merged ? 'Demo merged' : `${done} of ${agents.length} agents done`}</bdi></Badge>{!empty && <Badge variant={unsettled ? 'warning-light' : 'success-light'}><bdi>{unsettled ? `${unsettled} open ${unsettled === 1 ? 'conflict' : 'conflicts'}` : 'Conflicts settled'}</bdi></Badge>}</div>
      </header>
      {empty ? <Empty><EmptyHeader><EmptyTitle>No edits to compare</EmptyTitle><EmptyDescription>Start the demo to inspect where three agents changed the same files.</EmptyDescription></EmptyHeader><Button onClick={() => reset()}>Start demo</Button></Empty> : <>
        <div className='grid min-w-0 gap-2'>
          <DataTable caption='Files by agent' overflowLabel='Files by agent' columns={columns} rows={files} density='normal' className='[&_table]:min-w-[44rem]' />
          <p className='m-0 text-xs text-text-muted'>Bars locate each edit within its file. Separate ranges can coexist; overlapping edits need a choice. Scroll the table sideways on narrow screens.</p>
        </div>
        <section ref={comparison} id={compareId} aria-label='Conflict comparison' className='grid min-w-0 gap-4 border-t border-border pt-4'>
          <div className='flex flex-wrap items-center justify-between gap-2'><h3 className='m-0 text-base font-semibold'>Choose an approach</h3><span className='text-xs text-text-muted'><bdi>{conflicts.length - unsettled} of {conflicts.length} settled</bdi></span></div>
          <div role='group' aria-label='Conflicting files' className='flex flex-wrap gap-2'>
            {conflicts.map(file => <Button key={file.id} size='sm' variant={selectedId === file.id ? 'secondary' : 'outline'} aria-pressed={selectedId === file.id} aria-controls={compareId} onClick={() => inspect(file)}><RegistryIcon lucide={resolutions[file.id] ? 'Check' : 'GitMerge'} />{file.path.split('/').at(-1)}</Button>)}
          </div>
          <div className='grid gap-1'><p dir='ltr' className='m-0 text-sm font-medium wrap-anywhere'>{selected.path}</p><p className='m-0 text-sm text-text-muted'><bdi>{selected.overlap}</bdi> · {selected.reason}</p></div>
          <RadioGroup label={`Approaches for ${selected.path}`} value={resolutions[selected.id] || ''} onValueChange={choose} disabled={merged} options={selected.edits.map(edit => ({value:edit.agent,label:agents.find(agent => agent.id === edit.agent).name,description:<span className='grid gap-1'><span>{edit.approach}</span><span>{edit.tradeoff}</span></span>}))} />
          <div className='flex flex-wrap items-center justify-between gap-2'><p className='m-0 text-xs text-text-muted'>A choice keeps one approach for this file. It does not combine both changes.</p><Button size='sm' variant='ghost' disabled={merged || !resolutions[selected.id]} onClick={() => {setResolutions(previous => {const next = {...previous}; delete next[selected.id]; return next;});setNotice(`Choice cleared for ${selected.path}.`);comparison.current?.querySelector('[role="radio"]')?.focus();}}>Clear choice</Button></div>
        </section>
        <div className='grid gap-2 border-t border-border pt-4'>
          <div className='flex flex-wrap items-center justify-between gap-3'><p id={`${titleId}-merge`} className='m-0 text-sm text-text-muted'>{mergeReason}</p><Button aria-describedby={`${titleId}-merge`} disabled={!canMerge} onClick={() => {setMerged(true);setNotice('Demo merged: six files with your two chosen approaches. No repository was changed.');}}><RegistryIcon lucide='GitMerge' />{merged ? 'Demo merged' : 'Merge demo changes'}</Button></div>
          {disconnected && <div className='flex flex-wrap items-center justify-between gap-2'><p className='m-0 text-sm'>Delivery disconnected. Edits and choices are preserved.</p><Button size='sm' variant='outline' onClick={() => {setDisconnected(false);setNotice('Delivery reconnected. Edits and choices are preserved.');}}>Retry connection</Button></div>}
        </div>
      </>}
      <footer className='grid gap-3 border-t border-border pt-3'>
        <div className='flex flex-wrap gap-2'><Button size='sm' variant='outline' disabled={empty || merged || disconnected || stage === 2} onClick={() => {const next = Math.min(stage+1,2);setStage(next);setNotice(next === 2 ? unsettled ? 'All agents finished writing. Resolve remaining conflicts before merging.' : 'All agents finished writing. Your choices are ready to merge.' : 'Security finished. Delivery and Retries are still writing.');}}>Next update<RegistryIcon lucide='ArrowRight' className='rtl:rotate-180' /></Button><Button size='sm' variant='ghost' disabled={empty || merged || disconnected} onClick={() => {setDisconnected(true);setNotice('Delivery disconnected. Existing edits and choices are preserved.');}}>Simulate disconnect</Button><Button size='sm' variant='ghost' disabled={empty} onClick={() => reset(true)}>Empty snapshot</Button><Button ref={resetButton} size='sm' variant='ghost' onClick={() => reset()}>Reset demo</Button></div>
        <p role='status' aria-live='polite' className='m-0 text-xs text-text-muted'>{notice}</p>
        <p className='m-0 text-xs leading-relaxed text-text-muted'>Local simulation with prepared edits. Choices, branch names and merging are illustrative; no repository or service is changed.</p>
      </footer>
    </section>
  );
}
