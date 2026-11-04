'use client';
import { useState } from 'react';
import { ChatAgentFindings } from '@gaudi/design-system/chat/ChatAgentFindings';
import Button from '@gaudi/design-system/core/Button';
import { ToggleGroupRoot, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@gaudi/design-system/core/EmptyState';

const agents = [
  { id: 'security', name: 'Security', icon: 'Shield', task: 'Checking workspace permissions', checks: [8, 13, 16], total: 16 },
  { id: 'testing', name: 'Testing', icon: 'FlaskConical', task: 'Exercising invite retries', checks: [7, 14, 18], total: 18 },
  { id: 'accessibility', name: 'Accessibility', icon: 'Accessibility', task: 'Reviewing keyboard and announcements', checks: [5, 12, 12], total: 12 },
  { id: 'performance', name: 'Performance', icon: 'Gauge', task: 'Inspecting member queries', checks: [4, 8, 10], total: 10 }
];
// Fictional review data. No repository is scanned and no source files are changed.
const findings = [
  { id: 'owner', agent: 'security', severity: 'Critical', title: 'Invites can grant owner access', location: 'src/workspaces/invitations/create.ts:84', time: '14:02', phase: 0, evidence: 'The invite handler accepts the requested role without checking whether the inviter may grant it.', recommendation: 'Validate the requested role against the inviter’s permissions before saving the invitation.' },
  { id: 'retry', agent: 'testing', severity: 'Warning', title: 'Retry creates duplicate invitations', location: 'src/workspaces/invitations/retry.ts:37', time: '14:03', phase: 0, evidence: 'Repeating the same request creates a second pending invitation for the same email and workspace.', recommendation: 'Use an idempotency key and return the existing pending invitation on retry.' },
  { id: 'status', agent: 'accessibility', severity: 'Note', title: 'Invite status is not announced', location: 'src/components/InviteForm.tsx:112', time: '14:04', phase: 0, evidence: 'The success message appears visually, but the screen reader receives no update after submission.', recommendation: 'Expose the completion message in a polite status region without moving focus.' },
  { id: 'query', agent: 'performance', severity: 'Warning', title: 'Member rows repeat the same query', location: 'src/workspaces/members/list.ts:63', time: '14:05', phase: 1, evidence: 'Each member row requests the workspace permissions again. A list of 50 members makes 50 identical lookups.', recommendation: 'Load workspace permissions once per request and share the prepared result with each row.' },
  { id: 'expired', agent: 'security', severity: 'Critical', title: 'Expired invitations remain usable', location: 'src/workspaces/invitations/accept.ts:49', time: '14:06', phase: 2, evidence: 'The accept handler verifies the token signature but does not compare the invitation expiry with the current time.', recommendation: 'Reject expired invitations before assigning membership and cover the boundary with a regression test.' }
];
const severityTone = { Critical: 'destructive-light', Warning: 'warning-light', Note: 'secondary' };

export function Pattern({ title = 'Agent findings' } = {}) {
  const [phase, setPhase] = useState(0);
  const [mode, setMode] = useState('running');
  const [resetKey, setResetKey] = useState(0);
  const [reviewed, setReviewed] = useState([]);
  const [notice, setNotice] = useState('Review in progress. Three findings available.');
  const empty = mode === 'empty';
  const failed = mode === 'error';
  const stage = mode === 'completed' ? 2 : phase;
  const available = empty ? [] : findings.filter(item => item.phase <= stage).toReversed();
  const checked = empty ? 0 : agents.reduce((sum, agent) => sum + agent.checks[stage], 0);
  const total = agents.reduce((sum, agent) => sum + agent.total, 0);

  function changeMode(value) {
    if (!value) return;
    setMode(value); setPhase(0); setReviewed([]); setResetKey(key => key + 1);
    setNotice(value === 'empty' ? 'Review has not started.' : value === 'error' ? 'Testing agent disconnected. Collected findings are preserved.' : value === 'completed' ? 'Review complete. Five findings available.' : 'Review in progress. Three findings available.');
  }
  function advance() {
    const next = Math.min(stage + 1, 2); setPhase(next);
    if (next === 2) setMode('completed');
    setNotice(next === 2 ? 'Review complete. New critical finding: expired invitations remain usable.' : 'New warning from Performance: member rows repeat the same query.');
  }
  function toggleReviewed(item) {
    const wasReviewed = reviewed.includes(item.id);
    setReviewed(values => wasReviewed ? values.filter(id => id !== item.id) : [...values, item.id]);
    setNotice(`${item.title}: ${wasReviewed ? 'marked unreviewed' : 'marked reviewed'}. Source files are unchanged.`);
  }

  return (
    <div className='ds-touch-controls mx-auto grid w-full min-w-0 max-w-3xl grid-cols-1 gap-4'>
      <ChatAgentFindings key={resetKey} title={title} description='Workspace sharing review' summary={`${checked} of ${total} checks`}
        agents={agents.map(agent => { const done = !empty && agent.checks[stage] === agent.total; const error = failed && agent.id === 'testing'; return { ...agent, value: empty ? 0 : agent.checks[stage], max: agent.total, detail: error ? 'Connection lost. Findings preserved.' : empty ? 'Waiting to start' : done ? `Finished · ${available.filter(item => item.agent === agent.id).length} findings` : agent.task, statusLabel: error ? 'Error' : empty ? 'Queued' : done ? 'Done' : 'Running', tone: error ? 'destructive-light' : 'secondary' }; })}
        findings={available} severities={Object.keys(severityTone).map(id => ({ id, label: id, tone: severityTone[id] }))}
        reviewedIds={reviewed} onReviewedChange={id => toggleReviewed(findings.find(item => item.id === id))}
        emptyState={<Empty className='py-6'><EmptyHeader><EmptyTitle>No findings yet</EmptyTitle><EmptyDescription>Start the demo to see agents check the workspace.</EmptyDescription></EmptyHeader><Button size='sm' variant='outline' onClick={() => changeMode('running')}>Start demo review</Button></Empty>}
        footer={<>
          <p role='status' aria-live='polite' aria-atomic='true' className='min-w-0 flex-1 basis-64 text-xs leading-relaxed text-text-muted'>{notice}</p>
          <Button size='sm' disabled={mode === 'completed'} onClick={failed ? () => { setMode('running'); setNotice('Testing agent reconnected. Continuing the review.'); } : empty ? () => changeMode('running') : advance}>{failed ? 'Retry agent' : empty ? 'Start review' : mode === 'completed' ? 'Review complete' : 'Next update'}</Button>
        </>}
      />
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <ToggleGroupRoot className='min-w-0 max-w-full flex-wrap' type='single' size='sm' value={mode} onValueChange={changeMode} aria-label='Findings demo state'>
          <ToggleGroupItem value='running'>Running</ToggleGroupItem><ToggleGroupItem value='completed'>Completed</ToggleGroupItem><ToggleGroupItem value='error'>Error</ToggleGroupItem><ToggleGroupItem value='empty'>Empty</ToggleGroupItem>
        </ToggleGroupRoot>
        <Button size='sm' variant='ghost' onClick={() => changeMode('running')}>Reset demo</Button>
      </div>
      <p className='text-xs text-text-muted'>Fictional review. Updates and review marks stay in this demo; no repository is scanned or changed.</p>
    </div>
  );
}
