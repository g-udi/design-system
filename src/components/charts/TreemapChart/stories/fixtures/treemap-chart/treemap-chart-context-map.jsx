'use client';
import { useRef, useState } from 'react';
import { TreemapChart } from '@gaudi/design-system/charts/TreemapChart';
import Button from '@gaudi/design-system/core/Button';
import Select from '@gaudi/design-system/core/Select';
import { ToggleGroupRoot, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';

// Prepared snapshots, not a tokenizer or a model integration.
const agents = [
  { id: 'builder', name: 'Invitation builder', limit: 32000, files: [
    { id: 'create', name: 'src/invitations/create.ts', value: 4600, detail: 'Invitation creation, permission checks and delivery receipt handling.' },
    { id: 'tests', name: 'tests/invitations.spec.ts', value: 3200, detail: 'Permission, duplicate-send and delivery-retry test cases.' }
  ] },
  { id: 'reviewer', name: 'Security reviewer', limit: 24000, files: [
    { id: 'roles', name: 'src/permissions/roles.ts', value: 2400, detail: 'Workspace roles and the permissions required to invite a member.' },
    { id: 'policy', name: 'docs/access-policy.md', value: 1800, detail: 'The project’s access policy and review checklist.' }
  ] }
];
const kinds = {
  system: { label: 'System', color: 'var(--ds-color-chart-1)' },
  tools: { label: 'Tools', color: 'var(--ds-color-chart-2)' },
  memory: { label: 'Memory', color: 'var(--ds-color-chart-3)' },
  file: { label: 'Files', color: 'var(--ds-color-chart-4)' },
  chat: { label: 'Conversation', color: 'var(--ds-color-chart-5)' },
  result: { label: 'Tool results', color: 'var(--ds-color-chart-6)' },
  summary: { label: 'Summary', color: 'var(--ds-color-chart-7)' },
  free: { label: 'Available', color: 'var(--ds-color-text-muted)' }
};
const number = new Intl.NumberFormat('en-US');
const tokens = (value) => `${number.format(value)} tokens`;
const summary = { id: 'summary', name: 'Session summary', kind: 'summary', value: 1800, detail: 'Keeps the agreed permission rules, delivery decisions and unresolved retry question. Replaces the conversation and test output; repeated logs are omitted. Files, memory and instructions stay unchanged.' };

function snapshot(agent, added) {
  return [
    { id: 'system', name: 'System instructions', kind: 'system', value: 1600, detail: 'Role, output format and the project’s safety instructions.' },
    { id: 'tools', name: 'Tool definitions', kind: 'tools', value: 2600, detail: 'Prepared definitions for file reading, searching, editing and running checks.' },
    { id: 'memory', name: 'Project memory', kind: 'memory', value: 1200, detail: 'Naming conventions, repository structure and earlier project decisions.' },
    ...agent.files.map((file) => ({ ...file, kind: 'file' })),
    { id: 'chat', name: 'Conversation', kind: 'chat', value: 4400, detail: 'The current request, clarifications and decisions from the invitation workflow discussion.' },
    { id: 'result', name: 'Test output', kind: 'result', value: 3600, detail: 'Prepared output from permission and delivery tests, including repeated diagnostic lines.' },
    ...(added ? [{ id: 'search', name: 'Search results', kind: 'result', value: 2400, detail: 'Additional references to invitation creation and retry handling found in the repository.' }] : [])
  ];
}

export function Pattern() {
  const [agentId, setAgentId] = useState('builder');
  const [added, setAdded] = useState(false);
  const [compacted, setCompacted] = useState(false);
  const [view, setView] = useState('before');
  const [empty, setEmpty] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState('Select a tile to inspect its contents.');
  const root = useRef(null);
  const resetButton = useRef(null);
  const agent = agents.find((item) => item.id === agentId);
  const before = snapshot(agent, added);
  const after = [...before.filter((item) => !['chat', 'result'].includes(item.kind)), summary];
  const blocks = empty ? [] : compacted && view === 'after' ? after : before;
  const used = blocks.reduce((total, item) => total + item.value, 0);
  const saved = before.reduce((total, item) => total + item.value, 0) - after.reduce((total, item) => total + item.value, 0);
  const parts = [...blocks, { id: 'free', name: 'Available capacity', kind: 'free', value: agent.limit - used, detail: 'Unused space in this illustrative context window. It is included in the map so tile areas stay proportional to the full capacity.' }];
  const selected = parts.find((item) => item.id === selectedId);
  const reset = (nextAgent = agentId) => {
    setAgentId(nextAgent); setAdded(false); setCompacted(false); setView('before'); setEmpty(false); setSelectedId(null);
    setNotice('Original context restored. No model or service was changed.');
  };
  const changeView = (next) => {
    if (!next) return;
    setView(next); setSelectedId(null);
    setNotice(next === 'after' ? `After compaction: ${tokens(saved)} freed.` : 'Showing the context before compaction.');
  };

  return (
    <section ref={root} aria-label='Agent context map demo' className='ds-touch-controls mx-auto grid w-full min-w-0 max-w-4xl gap-5 text-sm' onKeyDown={(event) => {
      if (event.key === 'Escape' && event.target.closest('[data-slot="chart-plot"]')) setSelectedId(null);
    }}>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div className='grid gap-1'>
          <h2 className='text-lg font-semibold'>Context map</h2>
          <p className='text-text-muted'>What occupies the agent’s context window.</p>
        </div>
        <Select aria-label='Agent' value={agentId} onValueChange={(next) => next && reset(next)} options={agents.map((item) => ({ value: item.id, label: item.name }))} className='w-full max-w-none sm:w-56' />
      </header>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='tabular-nums'><bdi dir='ltr'><strong>{number.format(used)}</strong> / <bdi>{number.format(agent.limit)}</bdi> tokens <span className='text-text-muted'>· <bdi>{Math.round(used / agent.limit * 100)}%</bdi> used</span></bdi></p>
        <ToggleGroupRoot aria-label='Compaction snapshot' type='single' variant='outline' size='sm' spacing={0} value={view} onValueChange={changeView} disabled={!compacted}>
          <ToggleGroupItem value='before'>Before</ToggleGroupItem>
          <ToggleGroupItem value='after'>After</ToggleGroupItem>
        </ToggleGroupRoot>
      </div>
      <TreemapChart
        key={`${agentId}-${empty}-${view}-${added}`}
        ariaLabel={`${agent.name} context allocation`}
        data={parts}
        colors={parts.map((item) => kinds[item.kind].color)}
        height={320}
        framed={false}
        showData='toggle'
        valueLabel='Tokens'
        formatValue={(value) => number.format(value)}
        onActivate={(_, index) => { setSelectedId(parts[index].id); setNotice(`${parts[index].name}: ${tokens(parts[index].value)}.`); }}
        className='my-0 w-full min-w-0'
      />
      <ul aria-label='Context categories' className='flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-muted'>
        {[...new Set(parts.map((item) => item.kind))].map((kind) => <li key={kind} className='flex items-center gap-1.5'><span aria-hidden='true' className='h-2 w-2 rounded-xs' style={{ backgroundColor: kinds[kind].color }} />{kinds[kind].label}</li>)}
      </ul>
      <div className='grid gap-2 border-t pt-4'>
        {selected ? <>
          <div className='flex flex-wrap items-start justify-between gap-2'>
            <div className='grid min-w-0 gap-1'><h3 className='font-medium wrap-anywhere'>{selected.name}</h3><p className='text-xs text-text-muted'>{kinds[selected.kind].label} · <bdi>{tokens(selected.value)}</bdi></p></div>
            <Button size='xs' variant='ghost' onClick={() => { setSelectedId(null); root.current?.querySelector('[data-slot="chart-plot"]')?.focus(); }}>Close details</Button>
          </div>
          <p className='max-w-prose text-text-muted'>{selected.detail}</p>
        </> : <p className='text-text-muted'>Select a tile for details. Use arrow keys to explore, Enter to inspect, or Show data for full labels and counts.</p>}
      </div>
      <footer className='grid gap-3 border-t pt-4'>
        <p>{empty ? 'Context cleared: the full capacity is available.' : compacted ? <><bdi>{tokens(saved)}</bdi> freed. Conversation and tool results become one summary; files and instructions are retained.</> : 'Not compacted yet. Add a result or compact this prepared snapshot.'}</p>
        <div className='flex flex-wrap gap-2'>
          <Button size='sm' disabled={compacted || empty} onClick={() => { setCompacted(true); setView('after'); setSelectedId('summary'); setNotice(`Demo compacted. ${tokens(saved)} freed. Review Before and After to compare.`); }}>Compact demo</Button>
          <Button size='sm' variant='outline' disabled={added || compacted || empty} onClick={() => { setAdded(true); setSelectedId('search'); setNotice('Search results added: 2,400 tokens.'); }}>Add tool result</Button>
          <Button size='sm' variant='ghost' disabled={empty} onClick={() => { setEmpty(true); setCompacted(false); setView('before'); setSelectedId(null); setNotice('Context cleared. All capacity is available.'); resetButton.current?.focus(); }}>Clear context</Button>
          <Button ref={resetButton} size='sm' variant='ghost' onClick={() => reset()}>Reset demo</Button>
        </div>
        <p role='status' className='text-xs text-text-muted'>{notice}</p>
        <p className='text-xs text-text-muted'>Illustrative token counts and prepared summaries. Compaction runs locally; no model, files or conversation are changed.</p>
      </footer>
    </section>
  );
}
