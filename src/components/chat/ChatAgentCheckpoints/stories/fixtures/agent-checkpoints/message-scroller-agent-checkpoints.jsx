'use client';
import { useState } from 'react';
import { ChatAgentCheckpoints } from '@gaudi/design-system/chat/ChatAgentCheckpoints';
import Button from '@gaudi/design-system/core/Button';
import { ToggleGroupRoot, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// Example-owned run state. A real application saves snapshots and performs restores.
const initialCheckpoints = [
  { id: 'brief', attempt: 1, title: 'Read the task and repository', time: '0:08', files: 0, status: 'done' },
  { id: 'schema', parent: 'brief', attempt: 1, title: 'Mapped the checkout flow', time: '0:34', files: 2, status: 'done' },
  { id: 'patch', parent: 'schema', attempt: 1, title: 'Added the payment adapter', time: '1:12', files: 3, status: 'done' },
  { id: 'tests', parent: 'patch', attempt: 1, title: 'Validation failed', detail: 'Two checks failed: retry safety and duplicate charges.', time: '1:46', files: 3, status: 'failed' },
  { id: 'retry', parent: 'schema', attempt: 2, title: 'Reworking the retry strategy', time: '2:03', files: 2, status: 'running' }
];
const statusLabels = { done: 'Saved', failed: 'Failed', running: 'Running', stopped: 'Stopped' };

export function Pattern({ title = 'Agent checkpoints' } = {}) {
  const [checkpoints, setCheckpoints] = useState(initialCheckpoints);
  const [head, setHead] = useState('retry');
  const [mode, setMode] = useState('interactive');
  const [notice, setNotice] = useState('Attempt 2 is running. Attempt 1 is preserved.');
  const current = checkpoints.find(item => item.id === head);
  const empty = mode === 'empty';
  const readOnly = mode === 'read-only';
  const attempts = [...new Set(checkpoints.map(item => item.attempt))];
  const activePath = new Set();
  let ancestor = current;
  while (ancestor) {
    activePath.add(ancestor.id);
    ancestor = checkpoints.find(item => item.id === ancestor.parent);
  }

  function rewind(checkpoint) {
    const attempt = Math.max(...attempts) + 1;
    const id = `retry-${attempt}`;
    setCheckpoints(items => [
      ...items.map(item => item.status === 'running' ? { ...item, status: 'stopped' } : item),
      { id, parent: checkpoint.id, attempt, title: `Retry from “${checkpoint.title}”`, files: checkpoint.files, status: 'running', time: 'Just now' }
    ]);
    setHead(id);
    setNotice(`Attempt ${attempt} started from “${checkpoint.title}”. Earlier attempts are preserved.`);
  }

  function switchAttempt(checkpoint) {
    setCheckpoints(items => items.map(item => item.status === 'running' && item.id !== checkpoint.id ? { ...item, status: 'stopped' } : item));
    setHead(checkpoint.id);
    setNotice(`Viewing attempt ${checkpoint.attempt}. All checkpoints are preserved.`);
  }

  function finish(status) {
    setCheckpoints(items => items.map(item => item.id === head ? { ...item, status, title: status === 'done' ? 'Retry safety verified' : 'Validation failed', detail: status === 'done' ? 'All 12 checks passed. Workspace snapshot saved.' : 'The retry check failed. Rewind to a saved checkpoint to try again.' } : item));
    setNotice(status === 'done' ? `Attempt ${current.attempt} completed. All 12 checks passed.` : `Attempt ${current.attempt} failed. Its checkpoint is still available.`);
  }

  function reset() {
    setCheckpoints(initialCheckpoints);
    setHead('retry');
    setNotice('Demo reset. Attempt 2 is running.');
  }

  return (
    <div className='ds-touch-controls grid w-full min-w-0 max-w-2xl gap-4'>
      <ChatAgentCheckpoints title={title} description='Make checkout retries safe' summary={empty ? '0 checkpoints' : `${checkpoints.length} checkpoints · ${attempts.length} attempts`}
        attempts={empty ? [] : attempts.map(attempt => { const items = checkpoints.filter(item => item.attempt === attempt); const origin = checkpoints.find(item => item.id === items[0].parent); return {
          id: attempt, label: `Attempt ${attempt}`, origin: origin ? `Branches from ${origin.title} · Attempt ${origin.attempt}` : undefined,
          checkpoints: items.map(item => ({ ...item, running: item.status === 'running', restoreDisabled: item.status === 'running', statusLabel: statusLabels[item.status], tone: item.status === 'failed' ? 'destructive-light' : 'secondary', icon: item.status === 'failed' ? 'CircleAlert' : item.status === 'running' ? 'CircleDot' : item.status === 'stopped' ? 'CirclePause' : 'Check', meta: `${item.files} ${item.files === 1 ? 'file' : 'files'}` }))
        }; })}
        currentAttemptId={current?.attempt} currentId={head} activeIds={[...activePath]} readOnly={readOnly}
        onSelectAttempt={readOnly ? undefined : id => switchAttempt(checkpoints.filter(item => item.attempt === id).at(-1))}
        onRestore={readOnly ? undefined : id => rewind(checkpoints.find(item => item.id === id))}
        emptyState={<div className='grid justify-items-start gap-2 py-6'>
              <RegistryIcon lucide='Bookmark' className='size-5 text-text-muted' />
              <p className='text-sm font-medium'>No saved checkpoints yet</p>
              <p className='text-sm text-text-muted'>Saved steps will appear here as the agent works.</p>
              <Button size='sm' variant='outline' onClick={() => { reset(); setMode('interactive'); }}>Load demo run</Button>
            </div>}
        footer={<>
          <p role='status' aria-live='polite' aria-atomic='true' className='min-w-0 flex-1 basis-64 text-xs leading-relaxed text-text-muted'>{empty ? 'Demo only. No workspace changes.' : readOnly ? 'Read-only history. All attempts are preserved.' : notice}</p>
          {!empty && !readOnly && <div className='flex flex-wrap gap-2'>
            <Button variant='outline' size='sm' disabled={current.status !== 'running'} onClick={() => finish('failed')}>Fail step</Button>
            <Button size='sm' disabled={current.status !== 'running'} onClick={() => finish('done')}>Finish step</Button>
          </div>}
        </>}
      />
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <ToggleGroupRoot type='single' size='sm' value={mode} onValueChange={value => value && setMode(value)} aria-label='Checkpoint demo mode'>
          <ToggleGroupItem value='interactive'>Interactive</ToggleGroupItem>
          <ToggleGroupItem value='read-only'>Read-only</ToggleGroupItem>
          <ToggleGroupItem value='empty'>Empty</ToggleGroupItem>
        </ToggleGroupRoot>
        <Button size='sm' variant='ghost' onClick={reset}>Reset demo</Button>
      </div>
      <p className='text-xs text-text-muted'>Local demo. Rewind creates a new attempt; it never deletes earlier checkpoints or changes your files.</p>
    </div>
  );
}
