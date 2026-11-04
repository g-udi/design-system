'use client';
import { useId, useMemo, useRef, useState } from 'react';
import '@gaudi/design-system/flow.css';
import { Flow, FlowInspector, FlowStatus } from '@gaudi/design-system/core/Flow';
import Button from '@gaudi/design-system/core/Button';
import { Toggle } from '@gaudi/design-system/core/ToggleGroup';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { ChatMessageToolApproval } from '@gaudi/design-system/chat/ChatTool';
import { useElementSize } from '@gaudi/design-system/hooks/layout/use-element-size';

const members = [
  { id: 'you', name: 'You', kind: 'Person', detail: 'Requested a workspace migration brief.', icon: 'UserRound', cost: 0 },
  { id: 'lead', name: 'Coordinator', kind: 'Agent', detail: 'Delegates research and writing, then combines the results.', cost: 0.14 },
  { id: 'research', name: 'Researcher', kind: 'Agent', detail: 'Checks sources and compares migration approaches.', cost: 0.09 },
  { id: 'writer', name: 'Writer', kind: 'Agent', detail: 'Drafts the brief and requests permission to publish it.', cost: 0.06 },
  { id: 'search', name: 'Web search', kind: 'Tool', detail: 'Searches public documentation.', icon: 'Search', cost: 0.02 },
  { id: 'library', name: 'Library', kind: 'Tool', detail: 'Reads the local workspace migration notes.', icon: 'Library', cost: 0 },
  { id: 'publish', name: 'Publisher', kind: 'Tool', detail: 'Publishes the draft to the shared workspace after approval.', icon: 'Send', cost: 0 }
];
const byId = Object.fromEntries(members.map(member => [member.id, member]));
// A fixed demo clock and prepared costs keep the example reproducible. No services are called.
const initialCalls = [
  { id: 'brief', from: 'you', to: 'lead', label: 'Prepare a migration brief', status: 'success', time: '14:02:01', duration: '120 ms' },
  { id: 'delegate-research', from: 'lead', to: 'research', label: 'Compare migration paths', status: 'running', time: '14:02:03' },
  { id: 'delegate-writing', from: 'lead', to: 'writer', label: 'Draft the recommendation', status: 'success', time: '14:02:04', duration: '840 ms' },
  { id: 'search-docs', from: 'research', to: 'search', label: 'Find schema compatibility notes', status: 'failed', time: '14:02:06', duration: '5.0 s' },
  { id: 'read-notes', from: 'research', to: 'library', label: 'Read workspace constraints', status: 'success', time: '14:02:08', duration: '92 ms' },
  { id: 'read-draft', from: 'writer', to: 'library', label: 'Read the approved outline', status: 'success', time: '14:02:09', duration: '64 ms' },
  { id: 'publish-brief', from: 'writer', to: 'publish', label: 'Publish the migration brief', status: 'waiting', time: '14:02:12' }
];
const statusLabels = { idle: 'Idle', running: 'Running', success: 'Done', waiting: 'Needs approval', failed: 'Failed', skipped: 'Denied' };
const price = value => `$${value.toFixed(2)}`;
function memberStatus(member, calls) {
  if (member.kind === 'Person') return 'idle';
  const relevant = calls.filter(call => member.kind === 'Agent' ? call.from === member.id || call.to === member.id : call.to === member.id);
  return ['failed', 'waiting', 'running', 'skipped', 'success'].find(status => relevant.some(call => call.status === status)) || 'idle';
}

export function Pattern() {
  const titleId = useId();
  const retryOutcome = useRef(null);
  const [measure, size] = useElementSize({ initialSize: { width: 900, height: 550 } });
  const [calls, setCalls] = useState(initialCalls);
  const [selectedId, setSelectedId] = useState(null);
  const [animate, setAnimate] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [phase, setPhase] = useState(0);
  const [notice, setNotice] = useState('');
  const narrow = size.width < 680;
  const width = Math.max(size.width - 2, 270);
  const selected = byId[selectedId];
  const visibleMembers = empty ? [] : members;
  const activeCalls = empty ? [] : calls;
  const blocked = activeCalls.filter(call => ['failed', 'waiting'].includes(call.status));
  const pending = activeCalls.some(call => call.status === 'running');
  const related = activeCalls.filter(call => call.from === selectedId || call.to === selectedId);
  const selectedStatus = selected && memberStatus(selected, activeCalls);
  const neighbourhood = new Set([selectedId, ...related.flatMap(call => [call.from, call.to])]);
  const nodes = visibleMembers.map(member => {
    const positions = narrow ? {
      you: [width / 2, 24], lead: [width / 2, 164], research: [width / 4, 318], writer: [width * .75, 318],
      search: [width / 4, 488], library: [width * .75, 488], publish: [width / 2, 658]
    } : {
      you: [width / 2, 24], lead: [width / 2, 164], research: [width * .22, 205], writer: [width * .78, 205],
      search: [width * .13, 400], library: [width / 2, 400], publish: [width * .87, 400]
    };
    const [x, y] = positions[member.id];
    const status = memberStatus(member, activeCalls);
    return {
      // Fixed monitor tiles keep React Flow's measured geometry stable across call updates.
      id: member.id, type: 'tile', width: 136, height: 112, origin: [.5, 0], position: { x, y }, sourcePosition: 'bottom', targetPosition: 'top',
      selected: member.id === selectedId,
      ariaLabel: `${member.name}, ${member.kind}, ${statusLabels[status]}. Open details.`,
      data: {
        title: member.name, status: status === 'idle' ? undefined : status,
        icon: member.icon || <ChatAgentMark name={member.name} decorative size='sm' />,
        shape: member.kind === 'Person' ? 'circle' : 'square',
        meta: status === 'idle' ? member.kind : statusLabels[status],
        metaTone: status === 'failed' ? 'danger' : status === 'waiting' ? 'warning' : undefined,
        emphasis: selectedId && !neighbourhood.has(member.id) ? 'muted' : undefined
      }
    };
  });
  const edges = useMemo(() => {
    const links = new Map();
    for (const call of empty ? [] : calls) {
      const id = `${call.from}-${call.to}`;
      const link = links.get(id) || { id, source: call.from, target: call.to, count: 0 };
      links.set(id, { ...link, count: link.count + 1, latest: call });
    }
    return [...links.values()].map(({ count, latest, ...edge }) => ({
      ...edge, focusable: false,
      ariaLabel: `${byId[edge.source].name} to ${byId[edge.target].name}: ${count} ${count === 1 ? 'call' : 'calls'}, ${statusLabels[latest.status]}`,
      style: { strokeWidth: Math.min(1.5 + (count - 1) * .75, 4) },
      data: { path: 'bezier', status: latest.status, animated: animate && latest.status === 'running', variant: 'solid', emphasis: selectedId && edge.source !== selectedId && edge.target !== selectedId ? 'muted' : undefined }
    }));
  }, [calls, empty, animate, selectedId]);
  function reset() { setCalls(initialCalls); setSelectedId(null); setEmpty(false); setPhase(0); setNotice('Demo network reset.'); }
  function advance() {
    setCalls(current => {
      const settled = current.map(call => call.status === 'running' ? { ...call, status: 'success', duration: '240 ms' } : call);
      return phase < 2 ? [...settled, { id: `followup-${phase}`, from: 'research', to: 'library', label: phase === 0 ? 'Compare the archived schema' : 'Check the migration checklist', status: 'running', time: phase === 0 ? '14:02:14' : '14:02:16' }] : settled;
    });
    setPhase(value => Math.min(value + 1, 3));setNotice('Demo calls updated. Approvals and failed calls remain available for review.');
  }
  function resolve(id, status, message) {
    setCalls(current => current.map(call => call.id === id ? { ...call, status, duration: undefined } : call));setNotice(message);
  }
  return (
    <section aria-labelledby={titleId} className='ds-touch-controls mx-auto grid w-full min-w-0 max-w-6xl grid-cols-1 gap-4 text-sm'>
      <header className='flex flex-wrap items-start justify-between gap-3'>
        <div className='grid min-w-0 gap-1'><h2 id={titleId} className='text-lg font-semibold'>Agent network</h2><p className='text-text-muted'>Workspace migration brief · Demo run</p></div>
        <div className='flex flex-wrap gap-2'><Toggle size='sm' variant='outline' pressed={animate} onPressedChange={setAnimate} aria-label='Animate calls'>Animate calls</Toggle><Button size='sm' variant='outline' disabled={empty || phase >= 3 && !pending} onClick={advance}>Next update</Button><Button size='sm' variant='ghost' onClick={reset}>Reset</Button></div>
      </header>
      <div className='flex flex-wrap items-center justify-between gap-3 border-y py-3'>
        <p className='text-text-muted flex flex-wrap gap-x-4 gap-y-1 text-xs tabular-nums'><bdi>{empty ? 0 : 3} agents</bdi><bdi>{empty ? 0 : 3} tools</bdi><bdi>{activeCalls.length} calls</bdi><bdi>{price(visibleMembers.reduce((total, member) => total + member.cost, 0))} total</bdi></p>
        <div className='flex flex-wrap gap-2' aria-label='Calls needing attention'>{blocked.map(call => <Button key={call.id} size='sm' variant='outline' onClick={() => setSelectedId(call.to)}>{byId[call.to].name}: {statusLabels[call.status]}</Button>)}</div>
      </div>
      {empty ? <div className='grid justify-items-start gap-3 py-12'><h3 className='font-medium'>No agents connected</h3><p className='text-text-muted'>Start the demo to explore agents, tools and their calls.</p><Button onClick={reset}>Start demo network</Button></div> : (
        <div ref={measure} style={{ height: narrow ? 800 : 550 }} className='min-w-0'>
          <Flow label='Agent call network' nodes={nodes} edges={edges} className='h-full! bg-surface!' background='none' controls={false}
            viewport={{ x: 0, y: 0, zoom: 1 }} fitView={false} nodesDraggable={false} nodesConnectable={false} edgesReconnectable={false}
            deleteKeyCode={null} panOnDrag={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false} preventScrolling={false}
            labels={{ activateDescription: 'Press Enter to inspect this member and its recent calls.' }}
            onNodeActivate={node => setSelectedId(node.id)}
          >
            <FlowInspector open={Boolean(selected)} nodeId={selectedId} onOpenChange={open => { if (!open) setSelectedId(null); }} title={selected?.name} status={selectedStatus} statusLabel={statusLabels[selectedStatus]} description={selected?.kind}
              footer={<p className='text-text-muted text-xs'>Local demo only. No tools or services are called.</p>}
            >
              {selected && <div className='grid min-w-0 gap-4'>
                <p className='text-text-muted'>{selected.detail}</p>
                <p className='text-xs tabular-nums'><bdi>{price(selected.cost)} own cost · {related.length} {related.length === 1 ? 'call' : 'calls'}</bdi></p>
                {related.some(call => call.id === 'publish-brief') && <ChatMessageToolApproval state={({ waiting: 'requested', running: 'approved', success: 'executed', skipped: 'denied' })[calls.find(call => call.id === 'publish-brief').status]} name='publish the brief' description='Allow the Writer to publish the prepared brief to the shared workspace?' onApprove={() => resolve('publish-brief', 'running', 'Publishing approved in the demo. Next update completes the call.')} onDeny={() => resolve('publish-brief', 'skipped', 'Publishing denied. The draft is preserved.')} />}
                {related.some(call => call.id === 'search-docs' && call.status === 'failed') && <div className='grid justify-items-start gap-2'><p role='alert'>Search timed out. The other agents’ work is preserved.</p><Button size='sm' onClick={() => { resolve('search-docs', 'running', 'Search retry queued in the demo. Next update completes the call.'); requestAnimationFrame(() => retryOutcome.current?.focus()); }}>Retry search</Button></div>}
                <div ref={retryOutcome} tabIndex={-1} className='grid gap-2 outline-none'><h3 className='font-medium'>Recent calls</h3><ol className='grid gap-3'>{related.toReversed().map(call => <li key={call.id} className='grid min-w-0 gap-1 border-b pb-3'><p className='text-text-muted text-xs'><bdi>{byId[call.from].name} → {byId[call.to].name}</bdi></p><p className='[overflow-wrap:anywhere]'>{call.label}</p><div className='flex flex-wrap items-center gap-2'><FlowStatus status={call.status} label={statusLabels[call.status]} /><span className='text-text-muted text-xs'><bdi>{call.time}{call.duration ? ` · ${call.duration}` : ''}</bdi></span></div></li>)}</ol></div>
              </div>}
            </FlowInspector>
          </Flow>
        </div>
      )}
      <div className='flex flex-wrap items-center justify-between gap-3'><p className='text-text-muted max-w-prose text-xs'>Select a member to inspect its calls. Moving connections show requests in progress; thicker connections carry more calls. Reduced motion keeps them still.</p><Button size='sm' variant='ghost' disabled={empty} onClick={() => { setEmpty(true); setSelectedId(null); setNotice('Demo network cleared.'); }}>Clear network</Button></div>
      <p role='status' className='sr-only'>{notice}</p>
    </section>
  );
}
