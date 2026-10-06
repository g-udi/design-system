'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import {
  Flow,
  FlowPanel,
  FlowProvider,
  FlowStatus,
  layoutFlow,
  useFlowHistory,
  useReactFlow
} from '@gaudi/design-system/core/Flow';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ButtonGroup } from '@gaudi/design-system/core/ButtonGroup';
import { default as Field, FieldError, FieldInput, FieldLabel } from '@gaudi/design-system/core/Field';
import { default as ToastProvider, toast } from '@gaudi/design-system/core/Toast';
import { Toggle } from '@gaudi/design-system/core/ToggleGroup';
import { ClaudeAiIcon } from '@gaudi/design-system/icons/brands/claudeAiIcon';
import { Redis } from '@gaudi/design-system/icons/brands/redis';
import { Slack } from '@gaudi/design-system/icons/brands/slack';
import { Stripe } from '@gaudi/design-system/icons/brands/stripe';
import { Supabase } from '@gaudi/design-system/icons/brands/supabase';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const toasterId = 'flow-agent';
const ATTACHMENT_GAP = 230;

// A collections agent: an overdue invoice is looked up, a reminder drafted, and the amount picks a branch.
const initialSteps = [
  { id: 'trigger', type: 'pill', data: { title: 'Invoice overdue', icon: <Stripe />, target: false } },
  { id: 'lookup', type: 'step', data: { title: 'Look up customer', description: 'Plan, contacts and payment history', icon: <Supabase />, meta: ['Postgres query'] } },
  { id: 'draft', type: 'step', data: { title: 'Draft reminder', description: 'Friendly, in the customer’s language', icon: <ClaudeAiIcon />, meta: ['Temperature 0.3'], ports: [{ id: 'context', label: 'Attachments', position: 'right', type: 'target' }] } },
  { id: 'route', type: 'step', data: { title: 'Route by amount', description: 'Pick the first branch that matches', icon: 'Split', tone: 'discovery', branches: [{ id: 'high', label: 'Over $1,000', min: 1000 }, { id: 'standard', label: 'Standard' }] } },
  { id: 'escalate', type: 'step', data: { title: 'Escalate to the team', description: 'Post in the collections channel', icon: <Slack /> } },
  { id: 'remind', type: 'step', data: { title: 'Send reminder email', description: 'From billing, with a pay link', icon: 'Mail', tone: 'accent' } },
  { id: 'log', type: 'step', data: { title: 'Log outcome', description: 'Store the result for reporting', icon: <Redis /> } },
  { id: 'model', type: 'pill', attachTo: 'draft', data: { title: 'Model · large', icon: 'Brain', tone: 'discovery', target: false } },
  { id: 'memory', type: 'pill', attachTo: 'draft', data: { title: 'Memory · past replies', icon: 'Database', tone: 'info', target: false } }
];
const initialLinks = [
  { id: 'trigger-lookup', source: 'trigger', target: 'lookup' },
  { id: 'lookup-draft', source: 'lookup', target: 'draft' },
  { id: 'draft-route', source: 'draft', target: 'route' },
  { id: 'route-escalate', source: 'route', sourceHandle: 'high', target: 'escalate', data: { branch: 'high' } },
  { id: 'route-remind', source: 'route', sourceHandle: 'standard', target: 'remind', data: { branch: 'standard' } },
  { id: 'escalate-log', source: 'escalate', target: 'log' },
  { id: 'remind-log', source: 'remind', target: 'log' },
  { id: 'model-draft', source: 'model', target: 'draft', targetHandle: 'context', data: { dashed: true }, markerEnd: undefined },
  { id: 'memory-draft', source: 'memory', target: 'draft', targetHandle: 'context', data: { dashed: true }, markerEnd: undefined }
];
// What a test run reports per step: tokens, cost and latency.
const runMetrics = {
  trigger: null,
  lookup: ['0 tokens', '$0.000', '32 ms'],
  draft: ['1.2k tokens', '$0.004', '840 ms'],
  route: ['0 tokens', '$0.000', '3 ms'],
  escalate: ['0 tokens', '$0.000', '120 ms'],
  remind: ['0 tokens', '$0.000', '210 ms'],
  log: ['0 tokens', '$0.000', '9 ms']
};
const testInvoice = { amount: 420 };

// Tree layout for the steps; attachments sit beside the step they feed instead of taking a rank.
function tidy(nodes, edges) {
  const steps = nodes.filter((node) => !node.attachTo);
  const laid = layoutFlow(steps, edges.filter((edge) => !edge.data?.dashed), { direction: 'TB', nodeWidth: 240, nodeHeight: 104, rankGap: 56 });
  const at = new Map(laid.map((node) => [node.id, node.position]));
  const count = {};
  const placed = nodes.filter((node) => node.attachTo).map((node) => {
    const parent = at.get(node.attachTo) || { x: 0, y: 0 };
    const index = (count[node.attachTo] = (count[node.attachTo] ?? -1) + 1);
    return { ...node, origin: [0.5, 0.5], sourcePosition: 'left', position: { x: parent.x + ATTACHMENT_GAP, y: parent.y - 22 + index * 44 } };
  });
  return [...laid, ...placed];
}

// Unique, trimmed, case-insensitive branch names; the first free "Branch n" for new ones.
const branchErrors = (branches) => branches.map((branch, index) => {
  const name = branch.label.trim().toLowerCase();
  if (!name) return 'Give this branch a name.';
  return branches.some((other, i) => i !== index && other.label.trim().toLowerCase() === name) ? 'Another branch already uses this name.' : '';
});
const nextBranchName = (branches) => {
  const taken = new Set(branches.map((branch) => branch.label.trim().toLowerCase()));
  let n = branches.length + 1;
  while (taken.has(`branch ${n}`)) n += 1;
  return `Branch ${n}`;
};

function AgentEditor() {
  const initial = useMemo(() => ({ nodes: tidy(initialSteps.map((node) => ({ ...node, position: { x: 0, y: 0 } })), initialLinks), edges: initialLinks }), []);
  const history = useFlowHistory(initial);
  const { nodes, edges, setNodes, commit } = history;
  const flow = useReactFlow();
  const [snap, setSnap] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [running, setRunning] = useState(false);
  const { copy } = useCopyToClipboard({
    onCopy: () => toast.success('Agent copied as JSON', { toasterId }),
    onError: () => toast.error('Copying is blocked in this browser', { toasterId })
  });
  const timers = useRef([]);
  const counter = useRef(1);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const selected = nodes.find((node) => node.id === selectedId);
  const relayout = (nextNodes, nextEdges = edges) => {
    commit(tidy(nextNodes, nextEdges), nextEdges);
    requestAnimationFrame(() => flow.fitView({ duration: 300, padding: 0.2 }));
  };

  const insert = ({ id, source, target }) => {
    const step = { id: `step-${counter.current++}`, type: 'step', position: { x: 0, y: 0 }, data: { title: 'New step', description: 'Configure what it does', icon: 'Settings2' } };
    const old = edges.find((edge) => edge.id === id);
    const nextEdges = [
      ...edges.filter((edge) => edge.id !== id),
      { ...old, id: `${source}-${step.id}`, target: step.id },
      { id: `${step.id}-${target}`, source: step.id, target }
    ];
    relayout([...nodes, step], nextEdges);
    setSelectedId(step.id);
  };

  const updateData = (id, patch) => setNodes((current) => current.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...patch } } : node)));
  const renameBranch = (index, label) => {
    const branches = selected.data.branches.map((branch, i) => (i === index ? { ...branch, label } : branch));
    updateData(selected.id, { branches });
  };
  const addBranch = () => {
    const branches = selected.data.branches;
    const branch = { id: `branch-${counter.current++}`, label: nextBranchName(branches) };
    const step = { id: `step-${counter.current++}`, type: 'step', position: { x: 0, y: 0 }, data: { title: 'New step', description: `Runs for ${branch.label}`, icon: 'Settings2' } };
    const nextNodes = nodes.map((node) => (node.id === selected.id ? { ...node, data: { ...node.data, branches: [...branches, branch] } } : node));
    relayout([...nextNodes, step], [...edges, { id: `${selected.id}-${step.id}`, source: selected.id, sourceHandle: branch.id, target: step.id, data: { branch: branch.id } }]);
  };

  // A test run walks the live tree: each step runs in turn and the router follows the matching branch.
  const testRun = () => {
    timers.current.forEach(clearTimeout);
    const path = [];
    let current = 'trigger';
    while (current) {
      path.push(current);
      const node = nodes.find((item) => item.id === current);
      const out = edges.filter((edge) => edge.source === current && !edge.data?.dashed);
      if (node?.data.branches) {
        const branch = node.data.branches.find((item) => item.min == null || testInvoice.amount > item.min);
        current = out.find((edge) => edge.sourceHandle === branch?.id)?.target;
      } else current = out[0]?.target;
    }
    setRunning(true);
    setNodes((list) => list.map((node) => (node.attachTo ? node : { ...node, data: { ...node.data, status: path.includes(node.id) ? 'queued' : 'skipped', footer: undefined } })));
    path.forEach((id, index) => {
      timers.current.push(setTimeout(() => updateData(id, { status: 'running' }), index * 450));
      timers.current.push(setTimeout(() => {
        const metrics = runMetrics[id] ?? ['0 tokens', '$0.000', '15 ms'];
        updateData(id, { status: 'success', footer: metrics && <span className='text-text-muted tabular-nums'>{metrics.join(' · ')}</span> });
        if (index === path.length - 1) {
          setRunning(false);
          toast.success('Test run passed', { toasterId, description: `${path.length} steps ran for a $${testInvoice.amount} invoice.` });
        }
      }, index * 450 + 380));
    });
  };

  const copyJson = async () => {
    const json = JSON.stringify({
      steps: nodes.map(({ id, type, attachTo, data }) => ({ id, type, attachTo, title: data.title, branches: data.branches?.map(({ id: branch, label }) => ({ id: branch, label })) })),
      links: edges.map(({ source, target, sourceHandle }) => ({ source, target, branch: sourceHandle }))
    }, null, 2);
    await copy(json);
  };

  // Routers expose one output per branch; branch names label their connectors.
  const view = nodes.map((node) => (node.data.branches ? { ...node, data: { ...node.data, outputs: node.data.branches.map(({ id }) => ({ id })) } } : node));
  const labelled = edges.map((edge) => {
    const from = nodes.find((node) => node.id === edge.source);
    const to = nodes.find((node) => node.id === edge.target);
    const branch = from?.data.branches?.find((item) => item.id === edge.sourceHandle);
    return edge.data?.dashed ? edge : {
      ...edge,
      data: { ...edge.data, label: branch?.label, tone: branch ? 'discovery' : undefined, onInsert: insert, insertLabel: `Add a step between ${from?.data.title} and ${to?.data.title}` }
    };
  });
  const errors = selected?.data.branches ? branchErrors(selected.data.branches) : [];

  return (
    <div className='grid w-full gap-3 lg:grid-cols-[minmax(0,1fr)_17rem]'>
      <Flow
        label='Collections agent'
        nodes={view}
        edges={labelled}
        onNodesChange={history.onNodesChange}
        onEdgesChange={history.onEdgesChange}
        onSelectionChange={({ nodes: picked }) => setSelectedId(picked[0]?.id ?? null)}
        snapToGrid={snap}
        snapGrid={[16, 16]}
        background={snap ? 'lines' : 'dots'}
        className='h-[38rem]'
      >
        <FlowPanel position='top-left' className='w-[calc(100%-1.5rem)] justify-between'>
          <ButtonGroup aria-label='Layout'>
            <Button size='sm' variant='outline' tone='neutral' onClick={() => relayout(nodes)}>
              <RegistryIcon lucide='NetworkIcon' aria-hidden='true' />
              Tidy tree
            </Button>
            <Toggle size='sm' variant='outline' pressed={snap} onPressedChange={setSnap} aria-label='Snap to grid' className='bg-surface'>
              <RegistryIcon lucide='MagnetIcon' aria-hidden='true' />
            </Toggle>
            <Button size='icon-sm' variant='outline' tone='neutral' aria-label='Reset layout' onClick={() => { timers.current.forEach(clearTimeout); timers.current = []; setRunning(false); history.reset(initial); setSelectedId(null); requestAnimationFrame(() => flow.fitView({ duration: 300, padding: 0.2 })); }}>
              <RegistryIcon lucide='RotateCcwIcon' aria-hidden='true' />
            </Button>
          </ButtonGroup>
          <div className='flex gap-1.5'>
          <Button size='sm' variant='outline' tone='neutral' onClick={copyJson}>
            <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
            Copy JSON
          </Button>
          <Button size='sm' disabled={running} onClick={testRun}>
            <RegistryIcon lucide='PlayIcon' aria-hidden='true' />
            {running ? 'Running…' : 'Test run'}
          </Button>
          </div>
        </FlowPanel>
      </Flow>
      <aside aria-label='Step inspector' className='bg-surface grid content-start gap-3 rounded-lg border p-3'>
        {!selected ? (
          <>
            <h3 className='text-sm font-medium'>Inspector</h3>
            <p className='text-text-muted text-sm'>Select a step to rename it or edit its branches. Use the plus on any connector to add a step there.</p>
            <dl className='grid grid-cols-2 gap-2 text-sm'>
              <dt className='text-text-muted'>Steps</dt><dd className='text-end tabular-nums'>{nodes.filter((node) => !node.attachTo).length}</dd>
              <dt className='text-text-muted'>Attachments</dt><dd className='text-end tabular-nums'>{nodes.filter((node) => node.attachTo).length}</dd>
              <dt className='text-text-muted'>Test invoice</dt><dd className='text-end tabular-nums'>${testInvoice.amount}</dd>
            </dl>
          </>
        ) : (
          <>
            <div className='flex items-center gap-2'>
              <h3 className='min-w-0 truncate text-sm font-medium'>{selected.data.title}</h3>
              {selected.data.status && <FlowStatus status={selected.data.status} className='ms-auto' />}
            </div>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldInput value={selected.data.title} onFocus={() => commit()} onChange={(event) => updateData(selected.id, { title: event.target.value })} />
            </Field>
            {selected.data.branches && (
              <fieldset className='grid gap-2'>
                <legend className='mb-1 text-sm font-medium'>Branches</legend>
                {selected.data.branches.map((branch, index) => (
                  <Field key={branch.id}>
                    <FieldLabel className='sr-only'>{`Branch ${index + 1} name`}</FieldLabel>
                    <FieldInput value={branch.label} onFocus={() => commit()} onChange={(event) => renameBranch(index, event.target.value)} />
                    <FieldError>{errors[index]}</FieldError>
                  </Field>
                ))}
                <Button size='sm' variant='outline' tone='neutral' onClick={addBranch}>
                  <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
                  Add branch
                </Button>
              </fieldset>
            )}
          </>
        )}
      </aside>
      <ToastProvider id={toasterId} />
    </div>
  );
}

export function Pattern() {
  return (
    <FlowProvider>
      <AgentEditor />
    </FlowProvider>
  );
}
