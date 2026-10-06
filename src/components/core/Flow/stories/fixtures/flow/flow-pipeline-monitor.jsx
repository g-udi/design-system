'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  Flow,
  FlowProvider,
  FlowStatus,
  topologicalOrder,
  useFlowHistory,
  useReactFlow
} from '@gaudi/design-system/core/Flow';
import { default as Button } from '@gaudi/design-system/core/Button';
import { default as Progress } from '@gaudi/design-system/core/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { default as ToastProvider, toast } from '@gaudi/design-system/core/Toast';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const toasterId = 'flow-pipeline';
const DONE = new Set(['success', 'skipped']);
const SETTLED = new Set(['success', 'skipped', 'failed', 'blocked']);

// Tasks run left to right; positions are centres (nodeOrigin) placed by hand like a runbook diagram.
const task = (id, x, y, data, extra = {}) => ({ id, type: 'step', position: { x, y }, targetPosition: 'left', sourcePosition: 'right', data: { width: 236, ...data }, ...extra });
const attachment = (id, x, y, title, icon, tone) => ({ id, type: 'pill', attachment: true, position: { x, y }, sourcePosition: 'top', data: { title, icon, tone, target: false } });
const initialNodes = [
  { ...attachment('connection', -270, 150, 'Connection · warehouse', 'Database', 'info'), sourcePosition: 'right' },
  task('orders', 0, 0, { title: 'Extract orders', description: 'Yesterday’s orders', icon: 'Database', tone: 'info' }),
  task('customers', 0, 150, { title: 'Extract customers', description: 'Changed accounts', icon: 'Users', tone: 'info' }),
  task('events', 0, 300, { title: 'Extract events', description: 'Product usage stream', icon: 'Activity', tone: 'info' }),
  task('validate', 290, 150, { title: 'Validate schemas', description: 'Types, nulls and freshness', icon: 'ShieldCheck', tone: 'success', ports: [{ id: 'checks', label: 'Tests', position: 'bottom', type: 'target' }] }),
  attachment('tests', 290, 330, 'Tests · 24 checks', 'FlaskConical', 'success'),
  task('model', 580, 150, { title: 'Build revenue model', description: 'Daily revenue by plan', icon: 'Code', tone: 'discovery', ports: [{ id: 'sql', label: 'Model', position: 'bottom', type: 'target' }] }),
  attachment('sql', 580, 330, 'Model · revenue_daily', 'Braces', 'discovery'),
  task('gate', 870, 150, { title: 'Finance sign-off', description: 'A person checks the totals', icon: 'UserCheck', tone: 'warning' }, { deletable: false }),
  task('load', 1160, 150, { title: 'Load warehouse', description: 'Publish to reporting', icon: 'Server', tone: 'accent' }),
  task('dashboards', 1450, 0, { title: 'Refresh dashboards', description: 'Revenue and plan mix', icon: 'ChartLine', tone: 'accent' }),
  task('digest', 1450, 150, { title: 'Send revenue digest', description: 'Email to leadership', icon: 'Mail', tone: 'accent' }),
  task('crm', 1450, 300, { title: 'Sync CRM accounts', description: 'Plan and spend fields', icon: 'RefreshCw', tone: 'accent' })
];
const dep = (source, target) => ({ id: `${source}-${target}`, source, target });
const soft = (source, target, targetHandle) => ({ id: `${source}-${target}`, source, target, targetHandle, markerEnd: undefined, data: { dashed: true } });
const initialEdges = [
  soft('connection', 'orders'), soft('connection', 'customers'), soft('connection', 'events'),
  dep('orders', 'validate'), dep('customers', 'validate'), dep('events', 'validate'),
  soft('tests', 'validate', 'checks'), dep('validate', 'model'), soft('sql', 'model', 'sql'),
  dep('model', 'gate'), dep('gate', 'load'), dep('load', 'dashboards'), dep('load', 'digest'), dep('load', 'crm')
];
// How many ticks each task takes, the time it reports, and which task fails on its first attempt.
const timing = { orders: [2, '1m 12s'], customers: [1, '38s'], events: [3, '2m 40s'], validate: [2, '54s'], model: [3, '3m 05s'], gate: [0, '—'], load: [2, '1m 31s'], dashboards: [1, '22s'], digest: [1, '9s'], crm: [2, '47s'] };
const FLAKY = 'events';
const tasks = (nodes) => nodes.filter((node) => !node.attachment);
const parentsOf = (edges, id) => edges.filter((edge) => edge.target === id && !edge.data?.dashed).map((edge) => edge.source);
// Last night's run: events failed, so everything after it was blocked.
const lastNight = Object.fromEntries(tasks(initialNodes).map(({ id }) => [id, { status: ['orders', 'customers'].includes(id) ? 'success' : id === FLAKY ? 'failed' : 'blocked', attempt: 1, left: 0 }]));

function PipelineRun() {
  const history = useFlowHistory({ nodes: initialNodes, edges: initialEdges });
  const { nodes, edges } = history;
  const flow = useReactFlow();
  const [run, setRun] = useState(lastNight);
  const [active, setActive] = useState(false);
  const work = useMemo(() => tasks(nodes), [nodes]);
  const links = useMemo(() => edges.filter((edge) => !edge.data?.dashed), [edges]);
  const { order, cyclic } = useMemo(() => topologicalOrder(work, links), [work, links]);

  // One tick: finish running tasks, start tasks whose upstream all passed, block the rest behind failures.
  useEffect(() => {
    if (!active) return undefined;
    const timer = setInterval(() => {
      setRun((previous) => {
        const next = { ...previous };
        for (const id of order) {
          const state = next[id];
          if (!state) continue;
          if (state.status === 'running') {
            next[id] = state.left > 1 ? { ...state, left: state.left - 1 } : { ...state, left: 0, status: id === FLAKY && state.attempt === 1 ? 'failed' : 'success' };
          } else if (state.status === 'queued') {
            const parents = parentsOf(links, id).map((parent) => next[parent]?.status);
            if (parents.some((status) => status === 'failed' || status === 'blocked')) next[id] = { ...state, status: 'blocked' };
            else if (parents.every((status) => DONE.has(status ?? 'success'))) {
              next[id] = id === 'gate' ? { ...state, status: 'waiting' } : { ...state, status: 'running', attempt: state.attempt + 1, left: timing[id]?.[0] ?? 1 };
            }
          }
        }
        return next;
      });
    }, 420);
    return () => clearInterval(timer);
  }, [active, order, links]);
  // The run stops once every task has settled; a waiting gate keeps it open.
  useEffect(() => {
    if (active && Object.values(run).every((state) => SETTLED.has(state.status))) setActive(false);
  }, [active, run]);

  const replay = () => {
    setRun(Object.fromEntries(work.map(({ id }) => [id, { status: 'queued', attempt: 0, left: 0 }])));
    setActive(true);
  };
  // Retrying requeues the failed tasks and everything they blocked; skipping lets downstream go on.
  const retry = (ids = work.filter(({ id }) => run[id]?.status === 'failed').map(({ id }) => id)) => {
    setRun((previous) => Object.fromEntries(Object.entries(previous).map(([id, state]) => [id, ids.includes(id) || state.status === 'blocked' ? { ...state, status: 'queued' } : state])));
    setActive(true);
  };
  const skip = (id) => {
    setRun((previous) => Object.fromEntries(Object.entries(previous).map(([key, state]) => [key, key === id ? { ...state, status: 'skipped' } : state.status === 'blocked' ? { ...state, status: 'queued' } : state])));
    setActive(true);
  };
  const decide = (approved) => {
    setRun((previous) => ({ ...previous, gate: { ...previous.gate, status: approved ? 'success' : 'failed' } }));
    setActive(true);
  };
  const failed = work.filter(({ id }) => run[id]?.status === 'failed');
  const focusFailed = () => failed.length && flow.fitView({ nodes: failed.map(({ id }) => ({ id })), duration: 300, maxZoom: 1.1 });
  const remove = (id) => {
    const title = nodes.find((node) => node.id === id)?.data.title;
    history.commit(nodes.filter((node) => node.id !== id), edges.filter((edge) => edge.source !== id && edge.target !== id));
    setRun(({ [id]: _removed, ...rest }) => rest);
    toast(`Removed “${title}”`, { toasterId, duration: 8000, description: 'Its dependencies were removed too.', action: { label: 'Undo', onClick: () => { history.undo(); setRun((previous) => ({ ...previous, [id]: lastNight[id] || { status: 'queued', attempt: 0, left: 0 } })); } } });
  };

  const view = nodes.map((node) => {
    if (node.attachment) return node;
    const state = run[node.id] || { status: 'queued', attempt: 0 };
    const gate = node.id === 'gate';
    return {
      ...node,
      data: {
        ...node.data,
        status: state.status,
        statusLabel: gate && state.status === 'waiting' ? 'Needs approval' : state.status === 'blocked' ? 'Blocked upstream' : undefined,
        meta: [state.status === 'success' && !gate ? timing[node.id]?.[1] : null, state.attempt > 1 ? `Attempt ${state.attempt}` : null],
        content: gate && state.status === 'waiting' ? (
          <div className='nodrag nopan flex gap-1.5'>
            <Button size='xs' onClick={() => decide(true)}>Approve</Button>
            <Button size='xs' variant='outline' tone='neutral' onClick={() => decide(false)}>Reject</Button>
          </div>
        ) : null,
        actions: [
          { label: 'Retry', icon: 'RotateCcw', disabled: state.status !== 'failed', onSelect: (id) => retry([id]) },
          { label: 'Skip and continue', icon: 'Minus', disabled: state.status !== 'failed', onSelect: skip },
          { label: 'Focus', icon: 'Scan', onSelect: (id) => flow.fitView({ nodes: [{ id }], duration: 300, maxZoom: 1.2 }) },
          'separator',
          { label: gate ? 'Approval gates cannot be deleted' : 'Delete task', icon: 'Trash2', destructive: true, disabled: gate, onSelect: remove }
        ]
      }
    };
  });
  const edgesView = edges.map((edge) => {
    if (edge.data?.dashed) return edge;
    const status = run[edge.source]?.status;
    return { ...edge, animated: run[edge.target]?.status === 'running', data: { ...edge.data, tone: status === 'failed' ? 'danger' : status === 'success' ? 'success' : undefined, emphasis: status === 'blocked' ? 'muted' : undefined } };
  });
  const finished = work.filter(({ id }) => SETTLED.has(run[id]?.status)).length;

  return (
    <div className='grid w-full gap-3'>
      <div className='flex flex-wrap items-center gap-2'>
        <div className='min-w-0'>
          <h3 className='text-sm font-medium'>Nightly revenue pipeline</h3>
          <p className='text-text-muted text-xs'>Run 482 · started 02:00 · {cyclic ? 'cycle found, running in listed order' : 'dependency order'}</p>
        </div>
        <div className='ms-auto flex flex-wrap gap-2'>
          <Button size='sm' variant='outline' tone='neutral' disabled={!failed.length} onClick={focusFailed}>
            <RegistryIcon lucide='ScanIcon' aria-hidden='true' />
            Focus failed
          </Button>
          <Button size='sm' variant='outline' tone='neutral' disabled={!failed.length || active} onClick={() => retry()}>
            <RegistryIcon lucide='RotateCcwIcon' aria-hidden='true' />
            Retry failed
          </Button>
          <Button size='sm' disabled={active} onClick={replay}>
            <RegistryIcon lucide='PlayIcon' aria-hidden='true' />
            {active ? 'Running…' : 'Replay run'}
          </Button>
        </div>
      </div>
      <Progress label='Tasks settled' value={finished} max={work.length} valueText={`${finished} of ${work.length}`} tone={failed.length ? 'danger' : 'accent'} />
      <Tabs defaultValue='graph'>
        <TabsList aria-label='Run views'>
          <TabsTrigger value='graph'>Graph</TabsTrigger>
          <TabsTrigger value='log'>Run log</TabsTrigger>
        </TabsList>
        <TabsContent value='graph' forceMount className='data-[state=inactive]:hidden'>
          <Flow
            label='Nightly revenue pipeline'
            nodes={view}
            edges={edgesView}
            onNodesChange={history.onNodesChange}
            onEdgesChange={history.onEdgesChange}
            nodesConnectable={false}
            nodeOrigin={[0.5, 0.5]}
            minimap
            className='h-[30rem]'
          />
        </TabsContent>
        <TabsContent value='log'>
          <ol className='divide-y rounded-lg border'>
            {order.map((id) => {
              const node = work.find((item) => item.id === id);
              const state = run[id];
              if (!node || !state) return null;
              return (
                <li key={id} className='flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-sm'>
                  <span className='min-w-0 flex-1 truncate'>{node.data.title}</span>
                  <span className='text-text-muted tabular-nums text-xs'>{state.status === 'success' && id !== 'gate' ? timing[id]?.[1] : ''}{state.attempt > 1 ? ` · attempt ${state.attempt}` : ''}</span>
                  <FlowStatus status={state.status} label={id === 'gate' && state.status === 'waiting' ? 'Needs approval' : undefined} />
                </li>
              );
            })}
          </ol>
        </TabsContent>
      </Tabs>
      <ToastProvider id={toasterId} />
    </div>
  );
}

export function Pattern() {
  return (
    <FlowProvider>
      <PipelineRun />
    </FlowProvider>
  );
}
