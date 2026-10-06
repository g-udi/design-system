'use client';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Flow,
  FlowControls,
  FlowInspector,
  FlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  layoutFlow,
  useReactFlow
} from '@gaudi/design-system/core/Flow';
import { default as Button } from '@gaudi/design-system/core/Button';
import { default as Field, FieldInput, FieldLabel } from '@gaudi/design-system/core/Field';
import { SelectRoot as Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gaudi/design-system/core/Select';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { Redis } from '@gaudi/design-system/icons/brands/redis';
import { Stripe } from '@gaudi/design-system/icons/brands/stripe';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// Services a task can call; the icon follows the service everywhere it shows.
const services = {
  schedule: { label: 'Scheduler', icon: <RegistryIcon lucide='ZapIcon' className='text-text' /> },
  stripe: { label: 'Stripe', icon: <Stripe /> },
  paypal: { label: 'PayPal', icon: <RegistryIcon lucide='Paypal' className='text-info' /> },
  redis: { label: 'Redis', icon: <Redis /> },
  ledger: { label: 'Ledger', icon: <RegistryIcon lucide='BookOpenIcon' className='text-text' /> },
  gcp: { label: 'Google Cloud', icon: <RegistryIcon lucide='GoogleCloud' className='text-accent' /> },
  mail: { label: 'Email', icon: <RegistryIcon lucide='MailIcon' className='text-text' /> }
};
const kinds = {
  connection: { meta: 'Connection', icon: 'CableIcon' },
  test: { meta: 'Test', icon: 'ShieldCheckIcon' },
  model: { meta: 'Model', icon: 'Prisma' }
};

const tile = (id, service, title, meta, status, config = {}, extra = {}) => ({
  id,
  type: 'tile',
  position: { x: 0, y: 0 },
  data: { title, meta, status, service, icon: services[service].icon, config, ...extra }
});
const satellite = (id, title, kind, host) => ({
  id,
  type: 'tile',
  attachment: true,
  position: { x: 0, y: 0 },
  targetPosition: 'top',
  data: { title, meta: kinds[kind].meta, kind, host, shape: 'circle', icon: <RegistryIcon lucide={kinds[kind].icon} className='text-text' />, source: false }
});
const initialNodes = [
  tile('nightly', 'schedule', 'Nightly', '02:00 UTC', 'success', { cron: '0 2 * * *', timezone: 'UTC' }, { target: false }),
  tile('extract_stripe', 'stripe', 'extract_stripe', '2m 10s', 'success', { account: 'acct_live', since: 'last_run' }, { ports: [{ id: 'attach', position: 'bottom' }] }),
  satellite('stripe_prod', 'stripe_prod', 'connection', 'extract_stripe'),
  tile('extract_paypal', 'paypal', 'extract_paypal', '1m 48s', 'success', { region: 'eu', since: 'last_run' }, { ports: [{ id: 'attach', position: 'bottom' }] }),
  satellite('paypal_eu', 'paypal_eu', 'connection', 'extract_paypal'),
  tile('dedupe_payments', 'redis', 'dedupe_payments', '3m 12s', 'success', { key: 'charge_id', window: '72h' }, { ports: [{ id: 'attach', position: 'bottom' }] }),
  satellite('unique_charge', 'unique_charge', 'test', 'dedupe_payments'),
  tile('reconcile_ledger', 'ledger', 'reconcile_ledger', 'Duplicate charge id', 'failed', { tolerance: '0.01', ledger: 'ledger_v3' }, { metaTone: 'danger', ports: [{ id: 'attach', position: 'bottom' }] }),
  satellite('ledger_v3', 'ledger_v3', 'model', 'reconcile_ledger'),
  // The card is wider than a tile, so the first layout gets its width before it is measured.
  { id: 'publish_mrr', type: 'task', position: { x: 0, y: 0 }, width: 256, data: { title: 'publish_mrr', description: 'Awaiting approval', status: 'waiting', service: 'gcp', icon: services.gcp.icon, config: { currency: 'USD', approver: 'finance-lead' } } },
  tile('board_report', 'mail', 'board_report', 'Waits for approval', 'queued', { to: 'board@gaudi.dev', format: 'PDF' }, { source: false })
];
const main = (source, target, label) => ({ id: `${source}-${target}`, source, target, data: { label } });
const attach = (host, node) => ({ id: `${host}-${node}`, source: host, sourceHandle: 'attach', target: node, markerEnd: undefined, data: { variant: 'dotted', animated: false, satellite: true } });
const initialEdges = [
  main('nightly', 'extract_stripe'),
  main('nightly', 'extract_paypal'),
  main('extract_stripe', 'dedupe_payments', '1.2M rows'),
  main('extract_paypal', 'dedupe_payments', '384k rows'),
  main('dedupe_payments', 'reconcile_ledger', '1.5M rows'),
  main('dedupe_payments', 'publish_mrr'),
  main('reconcile_ledger', 'board_report'),
  main('publish_mrr', 'board_report'),
  attach('extract_stripe', 'stripe_prod'),
  attach('extract_paypal', 'paypal_eu'),
  attach('dedupe_payments', 'unique_charge'),
  attach('reconcile_ledger', 'ledger_v3')
];
const tidy = (nodes, edges) => layoutFlow(nodes, edges, { direction: 'LR', nodeWidth: 136, nodeHeight: 84, nodeGap: 40, rankGap: 64, attachmentGap: 36 });
const statusText = { success: 'Passed', failed: 'Failed', waiting: 'Waiting', running: 'Running', queued: 'Queued' };

// The run state picks the callout under the inspector's fields.
function calloutFor(node, onRetry) {
  const { status, meta } = node.data;
  if (status === 'waiting') return { tone: 'warning', icon: 'CirclePause', title: 'Awaiting approval', description: 'A finance lead approves before MRR is published.' };
  if (status === 'failed') return { tone: 'danger', icon: 'CircleX', title: meta, description: 'Two charges share an id after the merge.', action: onRetry };
  if (status === 'running') return { tone: 'info', icon: 'RefreshCw', title: 'Running now' };
  if (status === 'success') return { tone: 'success', icon: 'CircleCheck', title: 'Last run passed', description: node.data.meta };
  return null;
}

function Settings({ draft, setDraft, idPrefix }) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-title`}>Title</FieldLabel>
        <FieldInput id={`${idPrefix}-title`} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
      </Field>
      <div className='grid gap-1.5'>
        <span id={`${idPrefix}-service`} className='text-sm font-medium'>Service</span>
        <Select value={draft.service} onValueChange={(service) => setDraft({ ...draft, service })}>
          <SelectTrigger aria-labelledby={`${idPrefix}-service`} className='w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(services).map(([value, service]) => (
              <SelectItem key={value} value={value}>
                <span aria-hidden='true' className='inline-flex size-4 [&>svg]:size-4'>{service.icon}</span>
                {service.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {Object.entries(draft.config).map(([key, value]) => (
        <Field key={key}>
          <FieldLabel htmlFor={`${idPrefix}-${key}`}>{key}</FieldLabel>
          <FieldInput id={`${idPrefix}-${key}`} value={value} onChange={(event) => setDraft({ ...draft, config: { ...draft.config, [key]: event.target.value } })} />
        </Field>
      ))}
    </>
  );
}

function Wiring({ node, nodes, edges }) {
  const name = (id) => nodes.find((item) => item.id === id)?.data.title ?? id;
  const inputs = edges.filter((edge) => edge.target === node.id && !edge.data?.satellite);
  const outputs = edges.filter((edge) => edge.source === node.id && !edge.data?.satellite);
  const attached = edges.filter((edge) => edge.data?.satellite && (edge.source === node.id || edge.target === node.id));
  const section = (heading, list, side) => (
    <section className='grid gap-1.5'>
      <h3 className='text-text-muted text-xs font-medium'>{heading}</h3>
      {list.length ? (
        <ul className='grid gap-1 text-sm'>
          {list.map((edge) => (
            <li key={edge.id} className='flex items-center gap-2 rounded-(--ds-radius-control) border px-2.5 py-1.5'>
              <RegistryIcon lucide={side === 'in' ? 'ArrowRightIcon' : side === 'out' ? 'ArrowRightIcon' : 'CableIcon'} className='text-text-muted size-3.5 shrink-0' />
              <span className='truncate'>{name(side === 'in' ? edge.source : side === 'out' ? edge.target : edge.source === node.id ? edge.target : edge.source)}</span>
              {edge.data?.label && <span className='text-text-muted ms-auto text-xs tabular-nums'>{edge.data.label}</span>}
            </li>
          ))}
        </ul>
      ) : <p className='text-text-muted text-sm'>None</p>}
    </section>
  );
  return (
    <>
      {section('Inputs', inputs, 'in')}
      {section('Outputs', outputs, 'out')}
      {section('Attached', attached, 'attach')}
    </>
  );
}

function PaymentsPipeline() {
  const flow = useReactFlow();
  const [nodes, setNodes] = useState(() => tidy(initialNodes, initialEdges));
  const [edges, setEdges] = useState(initialEdges);
  const [variant, setVariant] = useState('dotted');
  const [animate, setAnimate] = useState(true);
  const [tool, setTool] = useState('select');
  const [openId, setOpenId] = useState(null);
  const [draft, setDraft] = useState(null);
  const timers = useRef([]);
  const idPrefix = useId();
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const open = nodes.find((node) => node.id === openId);
  const failed = nodes.filter((node) => node.data.status === 'failed');

  const update = (id, patch) => setNodes((current) => current.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...patch } } : node)));
  const inspect = (node) => {
    setOpenId(node.id);
    setDraft({ title: node.data.title, service: node.data.service || 'schedule', config: { ...(node.data.config || {}) } });
  };
  const approve = () => {
    update('publish_mrr', { status: 'running', description: 'Publishing MRR…' });
    timers.current.push(window.setTimeout(() => {
      update('publish_mrr', { status: 'success', description: 'Published 09:14' });
      update('board_report', { status: 'success', meta: 'Sent 09:15' });
    }, 1600));
  };
  const retry = () => {
    update('reconcile_ledger', { status: 'running', meta: 'Retrying…', metaTone: undefined });
    timers.current.push(window.setTimeout(() => update('reconcile_ledger', { status: 'success', meta: '1m 04s' }), 1400));
  };

  // Main connections take the chosen line and flow; satellites stay dotted and still. A run state
  // on either end colours the line: a failure turns it danger, a step in progress flows in the accent.
  const styled = useMemo(() => edges.map((edge) => {
    if (edge.data?.satellite) return edge;
    const from = nodes.find((node) => node.id === edge.source)?.data.status;
    const to = nodes.find((node) => node.id === edge.target)?.data.status;
    const status = to === 'running' || from === 'running' ? 'running' : from === 'failed' ? 'failed' : to === 'waiting' ? 'waiting' : undefined;
    return { ...edge, data: { ...edge.data, variant, animated: animate && from !== 'failed', status } };
  }), [edges, nodes, variant, animate]);
  const decorated = nodes.map((node) => (node.id === 'publish_mrr' && node.data.status === 'waiting'
    ? { ...node, data: { ...node.data, action: { label: 'Approve', onClick: approve } } }
    : node));

  const base = open && { title: open.data.title, service: open.data.service || 'schedule', config: open.data.config || {} };
  const dirty = Boolean(open && draft && JSON.stringify(draft) !== JSON.stringify(base));
  const save = () => {
    update(open.id, { title: draft.title, service: draft.service, icon: services[draft.service].icon, config: draft.config });
  };

  return (
    <div className='grid w-full gap-3'>
      <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
        <div className='me-auto grid'>
          <h3 className='text-sm font-semibold'>Payments to MRR</h3>
          <p className='text-text-muted text-xs'>Nightly at 02:00 UTC · last run 4 minutes ago</p>
        </div>
        <ToggleGroup type='single' variant='outline' size='sm' spacing={0} aria-label='Connection style' value={variant} onValueChange={(next) => next && setVariant(next)}>
          <ToggleGroupItem value='solid'>Solid</ToggleGroupItem>
          <ToggleGroupItem value='dashed'>Dashed</ToggleGroupItem>
          <ToggleGroupItem value='dotted'>Dotted</ToggleGroupItem>
        </ToggleGroup>
        <label className='flex items-center gap-2 text-sm'>
          <Switch checked={animate} onCheckedChange={setAnimate} aria-label='Animate connections' />
          Animate
        </label>
      </div>
      <Flow
        label='Payments to MRR pipeline'
        nodes={decorated}
        edges={styled}
        onNodesChange={(changes) => setNodes((current) => applyNodeChanges(changes, current))}
        onEdgesChange={(changes) => setEdges((current) => applyEdgeChanges(changes, current))}
        onNodeActivate={inspect}
        onPaneClick={() => setOpenId(null)}
        nodesConnectable={false}
        tool={tool}
        controls={false}
        nodeOrigin={[0.5, 0.5]}
        className='h-[36rem]'
      >
        <FlowControls
          variant='toolbar'
          tool={tool}
          onToolChange={setTool}
          showFitSelection
          onAutoLayout={({ nodes: current, edges: links }) => tidy(current, links)}
          issues={failed.length}
          onIssues={() => {
            flow.fitView({ nodes: failed.map(({ id }) => ({ id })), duration: 300, maxZoom: 1.2 });
            if (failed[0]) inspect(failed[0]);
          }}
        />
        <FlowInspector
          open={Boolean(open)}
          onOpenChange={(next) => !next && setOpenId(null)}
          nodeId={open?.id}
          icon={open && <span className='inline-flex size-4 [&>svg]:size-4'>{services[open.data.service]?.icon || open.data.icon}</span>}
          title={open?.data.title}
          status={open?.data.status}
          statusLabel={open && statusText[open.data.status]}
          tabs={open && draft ? [
            { value: 'settings', label: 'Settings', content: <Settings draft={draft} setDraft={setDraft} idPrefix={`${idPrefix}-${open.id}`} /> },
            { value: 'wiring', label: 'Wiring', content: <Wiring node={open} nodes={nodes} edges={edges} /> }
          ] : []}
          callout={open && calloutFor(open, open.data.status === 'failed' ? <Button size='xs' variant='outline' tone='neutral' onClick={retry}>Retry</Button> : undefined)}
          dirty={dirty}
          onSave={save}
          onCancel={() => setDraft(base)}
        />
      </Flow>
    </div>
  );
}

export function Pattern() {
  return (
    <FlowProvider>
      <PaymentsPipeline />
    </FlowProvider>
  );
}
