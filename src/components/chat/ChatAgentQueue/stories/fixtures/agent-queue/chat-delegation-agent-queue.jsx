'use client';
import { useEffect, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { Badge } from '@gaudi/design-system/core/Pill';
import { ChatAgentQueue } from '@gaudi/design-system/chat/ChatAgentQueue';
import { AreaChart } from '@gaudi/design-system/charts/AreaChart';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// A deterministic, local simulation. Scheduling and retry policy belong to the app.
function initialQueue(empty = false) {
  return {
    tick: 30, workers: [1, 2], nextWorker: 3, nextJob: 8, paused: false, limited: 0,
    notice: empty ? 'No jobs yet. Add a demo job to start.' : 'Two workers are busy. Three jobs are waiting.',
    history: empty ? [{ label: '30s', value: 0 }] : [{ label: '0s', value: 5 }, { label: '10s', value: 4 }, { label: '20s', value: 4 }, { label: '30s', value: 3 }],
    jobs: empty ? [] : [
      { id: 'job-1', name: 'Summarize the research brief', kind: 'LLM call', status: 'running', progress: 50, worker: 1, attempt: 1 },
      { id: 'job-2', name: 'Check source availability', kind: 'Tool call', status: 'running', progress: 75, worker: 2, attempt: 1, failOnce: true },
      { id: 'job-3', name: 'Draft the archive introduction', kind: 'Agent task', status: 'queued', progress: 0, attempt: 1 },
      { id: 'job-4', name: 'Extract the key decisions', kind: 'LLM call', status: 'queued', progress: 0, attempt: 1 },
      { id: 'job-5', name: 'Build the source index', kind: 'Tool call', status: 'queued', progress: 0, attempt: 1 },
      { id: 'job-6', name: 'Load the saved brief', kind: 'Tool call', status: 'done', progress: 100, attempt: 1, endedAt: 10 },
      { id: 'job-7', name: 'Fetch the reference notes', kind: 'Tool call', status: 'failed', progress: 0, attempt: 1, endedAt: 20, error: 'The source timed out. Retry to place this job back in the queue.' }
    ]
  };
}
function recordDepth(state) {
  const point = { label: `${state.tick}s`, value: state.jobs.filter(job => job.status === 'queued').length };
  const history = state.history.at(-1)?.label === point.label ? [...state.history.slice(0, -1), point] : [...state.history, point];
  return { ...state, history: history.slice(-18) };
}
function advanceQueue(state) {
  const next = { ...state, tick: state.tick + 10 };
  if (state.limited > 0) {
    next.limited = Math.max(0, state.limited - 10);
    if (!next.limited) next.notice = state.paused ? 'Rate limit ended. Resume the queue to continue.' : 'Rate limit ended. Workers continue on the next update.';
  } else if (!state.paused) {
    const completed = [];
    next.jobs = state.jobs.map(job => {
      if (job.status !== 'running') return job;
      const progress = Math.min(100, job.progress + 25);
      if (progress < 100) return { ...job, progress };
      const failed = job.failOnce && job.attempt === 1;
      completed.push(`${job.name} ${failed ? 'failed' : 'finished'}`);
      return { ...job, progress, worker: undefined, endedAt: next.tick, status: failed ? 'failed' : 'done', error: failed ? 'The source timed out. Retry to place this job back in the queue.' : undefined };
    });
    for (const worker of state.workers) {
      if (next.jobs.some(job => job.status === 'running' && job.worker === worker)) continue;
      const waiting = next.jobs.find(job => job.status === 'queued');
      if (waiting) next.jobs = next.jobs.map(job => job.id === waiting.id ? { ...job, status: 'running', worker, progress: 0 } : job);
    }
    if (completed.length) next.notice = `${completed.join('. ')}.`;
    if (!next.jobs.some(job => ['queued', 'running'].includes(job.status))) next.notice = 'Queue drained. Review failed jobs or add more work.';
  }
  return recordDepth(next);
}
const statusLabel = { queued: 'Waiting', running: 'Running', done: 'Done', failed: 'Failed', cancelled: 'Cancelled' };

export function Pattern({ title = 'Agent queue' } = {}) {
  const addRef = useRef(null);
  const [state, setState] = useState(initialQueue);
  const [playing, setPlaying] = useState(false);
  const waiting = state.jobs.filter(job => job.status === 'queued');
  const running = state.jobs.filter(job => job.status === 'running');
  const recent = state.jobs.filter(job => ['done', 'failed', 'cancelled'].includes(job.status)).sort((a, b) => b.endedAt - a.endedAt).slice(0, 6);
  const hasWork = !!(waiting.length || running.length || state.limited);
  const lastWorkerBusy = running.some(job => job.worker === state.workers.at(-1));
  useEffect(() => {
    if (!playing || !hasWork) return;
    const timer = setInterval(() => setState(advanceQueue), 1500);
    return () => clearInterval(timer);
  }, [playing, hasWork]);

  function action(id, actionName) {
    setState(current => {
      const job = current.jobs.find(item => item.id === id);
      if (!job) return current;
      const updated = actionName === 'promote' ? { ...job, priority: true } : actionName === 'retry' ? { ...job, status: 'queued', attempt: job.attempt + 1, progress: 0, worker: undefined, endedAt: undefined, error: undefined } : { ...job, status: 'cancelled', worker: undefined, endedAt: current.tick };
      const jobs = actionName === 'promote' ? [updated, ...current.jobs.filter(item => item.id !== id)] : actionName === 'retry' ? [...current.jobs.filter(item => item.id !== id), updated] : current.jobs.map(item => item.id === id ? updated : item);
      return recordDepth({ ...current, jobs, notice: `${job.name}: ${actionName === 'promote' ? 'moved to the front' : actionName === 'retry' ? 'queued for retry' : 'cancelled'}.` });
    });
  }
  function addJob() {
    setState(current => recordDepth({ ...current, nextJob: current.nextJob + 1, jobs: [...current.jobs, { id: `job-${current.nextJob}`, name: `Review archive note ${current.nextJob - 7}`, kind: 'Agent task', status: 'queued', progress: 0, attempt: 1 }], notice: 'A new archive review was added to the queue.' }));
  }
  function reset(empty = false) { setPlaying(false); setState(initialQueue(empty)); }

  function present(job, first = false) {
    return { ...job, icon: job.kind === 'LLM call' ? 'MessageSquare' : job.kind === 'Agent task' ? 'Bot' : 'Wrench', meta: job.attempt > 1 ? `Attempt ${job.attempt}` : statusLabel[job.status], detail: `${job.kind} · ${statusLabel[job.status]} · Attempt ${job.attempt}`, progress: job.status === 'running' ? job.progress : undefined,
      description: job.status === 'done' ? 'The demo job completed successfully.' : job.status === 'cancelled' ? 'This job was cancelled and will not run.' : undefined,
      actions: [...(job.status === 'queued' ? [{ id: 'promote', label: 'Move to front', disabled: first }] : []), ...(job.status === 'failed' ? [{ id: 'retry', label: 'Retry job' }] : []), ...(['queued', 'running'].includes(job.status) ? [{ id: 'cancel', label: 'Cancel job' }] : [])] };
  }
  return <ChatAgentQueue title={title} description='Archive preparation · shared worker pool' className='mx-auto max-w-6xl'
    waiting={waiting.map((job, index) => present(job, index === 0))} recent={recent.map(job => present(job))}
    workers={state.workers.map(id => { const job = running.find(item => item.worker === id); return { id, name: `Worker ${id}`, job: job ? present(job) : undefined, statusLabel: job ? state.paused || state.limited ? 'Paused' : 'Running' : 'Idle', tone: job && (state.paused || state.limited) ? 'warning-light' : 'secondary' }; })}
    summary={[['Waiting', waiting.length], ['Running', `${running.length}/${state.workers.length}`], ['Done', state.jobs.filter(job => job.status === 'done').length], ['Failed', state.jobs.filter(job => job.status === 'failed').length]].map(([label, value]) => ({ id: label, label, value }))}
    toolbar={<div className='flex flex-wrap items-center gap-2'>
        <Button size='sm' variant='outline' aria-pressed={state.paused} onClick={() => setState(current => ({ ...current, paused: !current.paused, notice: current.paused ? 'Queue resumed.' : 'Queue paused. Jobs keep their place and progress.' }))}><RegistryIcon lucide={state.paused ? 'Play' : 'Pause'} className='size-3.5' />{state.paused ? 'Resume queue' : 'Pause queue'}</Button>
        <div role='group' aria-label='Worker capacity' className='flex items-center gap-2'><Button size='icon-sm' variant='outline' aria-label='Remove idle worker' disabled={state.workers.length <= 1 || lastWorkerBusy} onClick={() => setState(current => ({ ...current, workers: current.workers.slice(0, -1), notice: 'One idle worker removed.' }))}><RegistryIcon lucide='Minus' className='size-3.5' /></Button><span className='text-xs tabular-nums'><bdi>{state.workers.length} {state.workers.length === 1 ? 'worker' : 'workers'}</bdi></span><Button size='icon-sm' variant='outline' aria-label='Add worker' disabled={state.workers.length >= 4} onClick={() => setState(current => ({ ...current, workers: [...current.workers, current.nextWorker], nextWorker: current.nextWorker + 1, notice: 'Worker added. The next update assigns waiting work.' }))}><RegistryIcon lucide='Plus' className='size-3.5' /></Button></div>
      </div>}
    notice={(state.paused || state.limited > 0 || waiting.length >= 6) && <div className='flex flex-wrap items-center gap-2 text-sm'><Badge variant='warning-light'>{state.paused ? 'Paused' : state.limited ? 'Rate limited' : 'Backlog growing'}</Badge><span>{state.limited ? `Provider limit resets in ${state.limited}s of demo time. ${state.paused ? 'Queue is also paused.' : 'Worker progress is held.'}` : state.paused ? 'New jobs can wait here while workers are paused.' : 'Six or more jobs are waiting. Add a worker or let the queue drain.'}</span></div>}
    workersDescription='Busy workers are kept until their jobs finish.' resultsDescription='Latest six results. Totals include the full demo run.'
    onJobAction={action} onInspectJob={() => setPlaying(false)} actionFocusRef={addRef}
    footer={<>
      <p role='status' aria-live='polite' aria-atomic='true' className='text-sm text-text-muted'>{state.notice}</p>
      <div className='flex flex-wrap items-center gap-2'>
        <Button ref={addRef} size='sm' onClick={addJob}><RegistryIcon lucide='Plus' className='size-3.5' />Add demo job</Button>
        <Button size='sm' variant='outline' onClick={() => setState(advanceQueue)}>Next update</Button>
        <Button size='sm' variant='outline' aria-pressed={playing} disabled={!hasWork && !playing} onClick={() => setPlaying(value => !value)}>{playing ? 'Stop demo' : 'Play demo'}</Button>
        <Button size='sm' variant='ghost' disabled={state.limited > 0} onClick={() => setState(current => ({ ...current, limited: 30, notice: 'Provider rate limit. Worker progress is held for 30 seconds of demo time.' }))}>Simulate rate limit</Button>
        <Button size='sm' variant='ghost' onClick={() => reset()}>Reset demo</Button>
        <Button size='sm' variant='ghost' onClick={() => reset(true)}>Empty queue</Button>
      </div>
      <p className='text-xs leading-relaxed text-text-muted'>Local simulation. Each update advances 10 seconds; play runs an update every 1.5 seconds. Inspecting a job stops playback. No services are called.</p>
</>}
  >
    <div className='min-w-0 border-t border-border pt-4'>
      <AreaChart title='Queue depth' description='Waiting jobs at each update · last 18 samples' ariaLabel='Waiting jobs over demo time' data={state.history} height={180} curve='step' framed={false} showData='toggle' showTooltip={false} references={[{ y: 6, label: 'Backlog', tone: 'warning' }]} formatValue={value => `${value} ${value === 1 ? 'job' : 'jobs'}`} />
    </div>
  </ChatAgentQueue>;
}
