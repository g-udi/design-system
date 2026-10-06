'use client';
import { useState } from 'react';
import {
  Flow,
  FlowPanel,
  FlowProvider,
  FlowStatus,
  createsCycle,
  hasEdge,
  layoutFlow,
  useFlowHistory
} from '@gaudi/design-system/core/Flow';
import { default as Button } from '@gaudi/design-system/core/Button';
import { default as Field, FieldDescription, FieldError, FieldInput, FieldLabel } from '@gaudi/design-system/core/Field';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as ToastProvider, toast } from '@gaudi/design-system/core/Toast';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { NumberField, NumberFieldGroup, NumberFieldInput } from '@gaudi/design-system/core/NumberField';

const toasterId = 'flow-impact';
const periods = { week: 'This week', month: 'This month', quarter: 'This quarter' };
const people = {
  maya: { name: 'Mei Castellanos', src: '/avatars/person-20.svg' },
  sam: { name: 'Sam Rivera', src: '/avatars/person-41.svg' },
  priya: { name: 'Priya Patel', src: '/avatars/person-23.svg' }
};
// Metrics carry a value and change per period; [value, change, improving].
const metrics = {
  teams: { title: 'Weekly active teams', icon: 'Users', goal: '5,500', values: { week: ['4,820', '+6.2%', true], month: ['19.1k', '+4.0%', true], quarter: ['52.4k', '+11%', true] } },
  activation: { title: 'Activation rate', icon: 'Zap', goal: '45%', values: { week: ['38%', '+2.1 pts', true], month: ['36%', '+1.4 pts', true], quarter: ['35%', '+3.0 pts', true] } },
  invites: { title: 'Invites per team', icon: 'UserPlus', goal: '4.0', values: { week: ['3.4', '+0.3', true], month: ['3.2', '+0.1', true], quarter: ['3.1', '+0.4', true] } },
  retention: { title: 'Week 4 retention', icon: 'RotateCcw', goal: '65%', values: { week: ['61%', '−1.4 pts', false], month: ['62%', '−0.6 pts', false], quarter: ['63%', '+0.8 pts', true] } }
};
const initiatives = {
  onboarding: { title: 'Guided onboarding', icon: 'Target', progress: 72, status: 'running', statusLabel: 'On track', owner: people.maya, meta: ['6 weeks', 'Growth'] },
  templates: { title: 'Team templates', icon: 'LayoutGrid', progress: 40, status: 'waiting', statusLabel: 'At risk', owner: people.sam, meta: ['8 weeks', 'Product'] },
  nudges: { title: 'Invite nudges', icon: 'Send', progress: 100, status: 'success', statusLabel: 'Shipped', owner: people.priya, meta: ['3 weeks', 'Growth'] },
  digest: { title: 'Weekly usage digest', icon: 'Mail', progress: 15, status: 'queued', statusLabel: 'Planned', owner: people.maya, meta: ['4 weeks', 'Lifecycle'] }
};
const initialNodes = layoutFlow([
  ...Object.entries(initiatives).map(([id, data]) => ({ id, type: 'step', position: { x: 0, y: 0 }, data: { ...data, kind: 'initiative', progressLabel: 'Done', width: 232 } })),
  ...Object.keys(metrics).map((id) => ({ id, type: 'step', position: { x: 0, y: 0 }, data: { kind: 'metric', title: metrics[id].title, icon: metrics[id].icon, width: 232 } }))
], [
  { source: 'onboarding', target: 'activation' }, { source: 'templates', target: 'activation' }, { source: 'nudges', target: 'invites' },
  { source: 'digest', target: 'retention' }, { source: 'activation', target: 'teams' }, { source: 'invites', target: 'teams' }, { source: 'retention', target: 'teams' }
], { direction: 'LR', nodeWidth: 232, nodeHeight: 150, rankGap: 96, nodeGap: 24 });
const link = (source, target, r) => ({ id: `${source}-${target}`, source, target, data: { r } });
const initialEdges = [
  link('onboarding', 'activation', 0.62), link('templates', 'activation', 0.41), link('nudges', 'invites', 0.74),
  link('digest', 'retention', 0.28), link('activation', 'teams', 0.71), link('invites', 'teams', 0.55), link('retention', 'teams', 0.66)
];
// Strong links read green, moderate ones blue, weak ones dashed and grey.
const strength = (r) => (r >= 0.6 ? { tone: 'success', word: 'Strong' } : r >= 0.35 ? { tone: 'info', word: 'Moderate' } : { tone: 'neutral', word: 'Weak', dashed: true });

function MetricValue({ metric, period }) {
  const [value, change, improving] = metric.values[period];
  return (
    <div className='grid gap-0.5'>
      <div className='flex items-baseline gap-2'>
        <span className='text-xl font-semibold tabular-nums'>{value}</span>
        <Badge variant={improving ? 'success-light' : 'destructive-light'} size='sm'>
          <RegistryIcon lucide={improving ? 'TrendingUpIcon' : 'TrendingDownIcon'} aria-hidden='true' />
          {change}
        </Badge>
      </div>
      <span className='text-text-muted text-xs'>{periods[period]} · goal {metric.goal}</span>
    </div>
  );
}

function RelinkForm({ edge, nodes, edges, onSave, onRemove }) {
  const [draft, setDraft] = useState({ source: edge.source, target: edge.target, r: String(edge.data.r) });
  const others = edges.filter((item) => item.id !== edge.id);
  const r = Number(draft.r);
  const error = draft.source === draft.target ? 'A link needs two different cards.'
    : hasEdge(others, draft.source, draft.target) ? 'These two cards are already linked.'
      : createsCycle(others, draft.source, draft.target) ? 'This link would create a loop back to its own driver.'
        : '';
  const rError = Number.isNaN(r) || r < 0 || r > 1 ? 'Use a value from 0 to 1.' : '';
  const title = (id) => nodes.find((node) => node.id === id)?.data.title;
  return (
    <form className='grid gap-3' onSubmit={(event) => { event.preventDefault(); if (!error && !rError) onSave({ ...draft, r }); }}>
      <Field>
        <FieldLabel>Driver</FieldLabel>
        <FieldInput as='select' value={draft.source} onChange={(event) => setDraft({ ...draft, source: event.target.value })}>
          {nodes.map((node) => <option key={node.id} value={node.id}>{node.data.title}</option>)}
        </FieldInput>
      </Field>
      <Field>
        <FieldLabel>Moves</FieldLabel>
        <FieldInput as='select' value={draft.target} onChange={(event) => setDraft({ ...draft, target: event.target.value })}>
          {nodes.filter((node) => node.data.kind === 'metric').map((node) => <option key={node.id} value={node.id}>{node.data.title}</option>)}
        </FieldInput>
        <FieldError>{error}</FieldError>
      </Field>
      <Field>
        <FieldLabel>Correlation</FieldLabel>
        <NumberField min={0} max={1} step={0.01} value={(draft.r) === '' || !Number.isFinite(Number(draft.r)) ? null : Number(draft.r)} onValueChange={(value) => setDraft({ ...draft, r: (value ?? '') })}>
          <NumberFieldGroup>
            <NumberFieldInput />
          </NumberFieldGroup>
        </NumberField>
        <FieldDescription>How closely {title(draft.target) || 'the metric'} has tracked its driver, from 0 to 1.</FieldDescription>
        <FieldError>{rError}</FieldError>
      </Field>
      <div className='flex gap-2'>
        <Button type='submit' size='sm' disabled={Boolean(error || rError)}>Save link</Button>
        <Button type='button' size='sm' variant='ghost' tone='danger' onClick={onRemove}>Remove</Button>
      </div>
    </form>
  );
}

function ImpactMap() {
  const history = useFlowHistory({ nodes: initialNodes, edges: initialEdges });
  const { nodes, edges, commit } = history;
  const [period, setPeriod] = useState('week');
  const [north, setNorth] = useState('teams');
  const [selection, setSelection] = useState({ nodes: [], edges: [] });
  const selectedNode = nodes.find((node) => node.id === selection.nodes[0]);
  const selectedEdge = edges.find((edge) => edge.id === selection.edges[0]);

  const promote = (id) => {
    const previous = north;
    setNorth(id);
    toast(`${metrics[id].title} is the north star`, {
      toasterId,
      description: `${metrics[previous].title} is a driver again.`,
      action: { label: 'Undo', onClick: () => setNorth(previous) }
    });
  };

  const view = nodes.map((node) => {
    if (node.data.kind !== 'metric') return node;
    const isNorth = node.id === north;
    return {
      ...node,
      data: {
        ...node.data,
        badge: isNorth ? 'North star' : 'Driver',
        emphasis: isNorth ? 'primary' : undefined,
        tone: isNorth ? 'accent' : 'neutral',
        target: true,
        source: !isNorth,
        content: <MetricValue metric={metrics[node.id]} period={period} />,
        actions: [{ label: 'Make north star', icon: 'Star', disabled: isNorth, onSelect: promote }]
      }
    };
  });
  const edgesView = edges.map((edge) => {
    const { tone, dashed } = strength(edge.data.r);
    return { ...edge, data: { ...edge.data, label: `r ${edge.data.r.toFixed(2)}`, tone, dashed } };
  });

  return (
    <div className='grid w-full gap-3 lg:grid-cols-[minmax(0,1fr)_17rem]'>
      <Flow
        label='Growth impact map'
        nodes={view}
        edges={edgesView}
        onNodesChange={history.onNodesChange}
        onEdgesChange={history.onEdgesChange}
        onSelectionChange={({ nodes: pickedNodes, edges: pickedEdges }) => {
          // Keep the previous object when nothing changed, so the canvas does not re-render in a loop.
          const next = { nodes: pickedNodes.map(({ id }) => id), edges: pickedEdges.map(({ id }) => id) };
          setSelection((current) => (current.nodes.join() === next.nodes.join() && current.edges.join() === next.edges.join() ? current : next));
        }}
        nodesConnectable={false}
        deleteKeyCode={null}
        className='h-[36rem]'
      >
        <FlowPanel position='top-left'>
          <ToggleGroup type='single' variant='outline' size='sm' value={period} onValueChange={(value) => value && setPeriod(value)} aria-label='Period' className='bg-surface'>
            <ToggleGroupItem value='week'>Week</ToggleGroupItem>
            <ToggleGroupItem value='month'>Month</ToggleGroupItem>
            <ToggleGroupItem value='quarter'>Quarter</ToggleGroupItem>
          </ToggleGroup>
        </FlowPanel>
      </Flow>
      <aside aria-label='Map inspector' className='bg-surface grid content-start gap-3 rounded-lg border p-3'>
        {selectedEdge ? (
          <>
            <h3 className='text-sm font-medium'>Edit link</h3>
            <RelinkForm
              key={selectedEdge.id}
              edge={selectedEdge}
              nodes={nodes}
              edges={edges}
              onSave={({ source, target, r }) => {
                const id = `${source}-${target}`;
                commit(undefined, edges.map((edge) => (edge.id === selectedEdge.id ? { ...edge, id, source, target, data: { ...edge.data, r }, selected: true } : edge)));
                setSelection({ nodes: [], edges: [id] });
                toast.success('Link saved', { toasterId });
              }}
              onRemove={() => {
                commit(undefined, edges.filter((edge) => edge.id !== selectedEdge.id));
                setSelection({ nodes: [], edges: [] });
              }}
            />
          </>
        ) : selectedNode ? (
          <>
            <div className='flex items-center gap-2'>
              <h3 className='min-w-0 truncate text-sm font-medium'>{selectedNode.data.title}</h3>
              {selectedNode.data.kind === 'metric'
                ? <Badge variant={selectedNode.id === north ? 'primary-light' : 'outline'} size='sm' className='ms-auto'>{selectedNode.id === north ? 'North star' : 'Driver'}</Badge>
                : <FlowStatus status={selectedNode.data.status} label={selectedNode.data.statusLabel} className='ms-auto' />}
            </div>
            {selectedNode.data.kind === 'metric' ? (
              <>
                <dl className='grid grid-cols-2 gap-2 text-sm'>
                  {Object.entries(periods).map(([key, label]) => (
                    <div key={key} className='contents'>
                      <dt className='text-text-muted'>{label}</dt>
                      <dd className='text-end tabular-nums'>{metrics[selectedNode.id].values[key][0]} <span className='text-text-muted'>({metrics[selectedNode.id].values[key][1]})</span></dd>
                    </div>
                  ))}
                </dl>
                <Button size='sm' variant='outline' tone='neutral' disabled={selectedNode.id === north} onClick={() => promote(selectedNode.id)}>
                  <RegistryIcon lucide='StarIcon' aria-hidden='true' />
                  Make north star
                </Button>
              </>
            ) : (
              <p className='text-text-muted text-sm'>
                {selectedNode.data.progress}% done · {selectedNode.data.owner.name} · moves {edges.filter((edge) => edge.source === selectedNode.id).map((edge) => nodes.find((node) => node.id === edge.target)?.data.title).join(', ') || 'nothing yet'}
              </p>
            )}
          </>
        ) : (
          <>
            <h3 className='text-sm font-medium'>How to read the map</h3>
            <p className='text-text-muted text-sm'>Initiatives on the left drive metrics, which drive the north star. Select a link to relink it or change its correlation.</p>
            <ul className='grid gap-1.5 text-sm'>
              <li className='flex items-center gap-2'><Badge variant='success-light' size='sm'>r 0.60+</Badge> Strong link</li>
              <li className='flex items-center gap-2'><Badge variant='info-light' size='sm'>r 0.35+</Badge> Moderate link</li>
              <li className='flex items-center gap-2'><Badge variant='outline' size='sm'>r &lt; 0.35</Badge> Weak link, dashed</li>
            </ul>
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
      <ImpactMap />
    </FlowProvider>
  );
}
