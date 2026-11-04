'use client';
import { useId, useRef, useState } from 'react';
import { useTree } from '@headless-tree/react';
import { hotkeysCoreFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent } from '@gaudi/design-system/core/Accordion';
import { Tree, TreeItem, TreeItemLabel } from '@gaudi/design-system/core/Tree';
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@gaudi/design-system/core/Dialog';
import Button from '@gaudi/design-system/core/Button';
import { Badge } from '@gaudi/design-system/core/Pill';
import { ProgressRoot } from '@gaudi/design-system/core/Progress';
import { ChatAgentMark } from '@gaudi/design-system/chat/ChatAgentMark';
import { ChatPlan } from '@gaudi/design-system/chat/ChatPlanPanel';
import { ChatMessageToolApproval } from '@gaudi/design-system/chat/ChatTool';

// Prepared demo data: costs belong to each agent, never to an already-totalled branch.
const leads = [
  { id: 'research', name: 'Research lead', task: 'Map the workspace migration', children: ['inventory', 'permissions', 'sources'] },
  { id: 'build', name: 'Build lead', task: 'Prepare the migration tools', children: ['schema', 'importer', 'rollback'] },
  { id: 'verify', name: 'Verification lead', task: 'Validate the release candidate', children: ['accessibility', 'regression', 'release'] }
];
const agents = {
  research: { ...leads[0], status: 'running', cost: 0.12, elapsed: '4m 12s' },
  inventory: { name: 'Inventory', task: 'Index existing workspaces', status: 'done', cost: 0.08, elapsed: '1m 20s' },
  permissions: { name: 'Permissions', task: 'Check inherited access', status: 'awaiting', cost: 0.06, elapsed: '2m 08s' },
  sources: { name: 'Source review', task: 'Verify migration references', status: 'running', cost: 0.04, elapsed: '1m 45s', children: ['docs', 'examples'] },
  docs: { name: 'Documentation', task: 'Compare the published schemas', status: 'done', cost: 0.03, elapsed: '48s' },
  examples: { name: 'Examples', task: 'Review import edge cases', status: 'running', cost: 0.02, elapsed: '57s' },
  build: { ...leads[1], status: 'running', cost: 0.15, elapsed: '3m 40s' },
  schema: { name: 'Schema', task: 'Prepare the compatibility layer', status: 'done', cost: 0.09, elapsed: '1m 12s' },
  importer: { name: 'Importer', task: 'Run the staging import', status: 'failed', cost: 0.07, elapsed: '36s' },
  rollback: { name: 'Rollback', task: 'Prepare a restore procedure', status: 'pending', cost: 0, elapsed: 'Not started' },
  verify: { ...leads[2], status: 'running', cost: 0.08, elapsed: '2m 11s' },
  accessibility: { name: 'Accessibility', task: 'Check the migration form', status: 'done', cost: 0.04, elapsed: '52s' },
  regression: { name: 'Regression', task: 'Exercise existing workspace flows', status: 'running', cost: 0.05, elapsed: '1m 19s' },
  release: { name: 'Release notes', task: 'Summarize verified changes', status: 'pending', cost: 0, elapsed: 'Not started' }
};
const states = {
  pending: ['Queued', 'secondary'], running: ['Running', 'info-light'], done: ['Done', 'success-light'],
  awaiting: ['Needs you', 'warning-light'], failed: ['Failed', 'destructive-light'],
  denied: ['Denied', 'secondary'], cancelled: ['Stopped', 'secondary']
};
const money = value => `$${value.toFixed(2)}`;
function branchIds(id) { return [id, ...(agents[id].children || []).flatMap(branchIds)]; }
function Status({ status }) { return <Badge variant={states[status][1]}>{states[status][0]}</Badge>; }
const activate = (_event, tree) => tree.getFocusedItem()?.getElement()?.click();
const hotkeys = {
  activateAgent: { hotkey: 'Enter', preventDefault: true, handler: activate },
  selectAgent: { hotkey: 'Space', preventDefault: true, handler: activate }
};

function AgentTree({ lead, current, onInspect }) {
  const tree = useTree({
    rootItemId: lead.id,
    initialState: { expandedItems: ['sources'], focusedItem: lead.children[0] },
    getItemName: item => `${current[item.getId()].name}, ${states[current[item.getId()].status][0]}`,
    isItemFolder: item => Boolean(item.getItemData().children?.length),
    dataLoader: { getItem: id => agents[id], getChildren: id => agents[id].children || [] },
    onPrimaryAction: item => { if (!item.isFolder()) onInspect(item.getId(), item.getElement()); },
    hotkeys, features: [syncDataLoaderFeature, hotkeysCoreFeature]
  });
  return (
    <Tree tree={tree} indent={18} aria-label={`${lead.name} agents`} className='min-w-0'>
      {tree.getItems().map(item => {
        const agent = current[item.getId()];
        return (
          <TreeItem key={item.getId()} item={item} className='min-w-0 text-start'>
            <TreeItemLabel className='items-start gap-2 py-3'>
              <ChatAgentMark name={agent.name} size='xs' className='mt-0.5 shrink-0' />
              <span className='grid min-w-0 flex-1 gap-1'>
                <span className='flex flex-wrap items-center justify-between gap-2'><span className='font-medium [overflow-wrap:anywhere]'>{agent.name}</span><Status status={agent.status} /></span>
                <span className='text-text-muted text-xs [overflow-wrap:anywhere]'>{agent.task}</span>
                <span className='text-text-muted flex flex-wrap gap-x-3 gap-y-1 text-xs tabular-nums'><span>{agent.elapsed}</span><span>{money(agent.cost)}</span>{!item.isFolder() && <span className='underline underline-offset-4'>View tasks</span>}</span>
              </span>
            </TreeItemLabel>
          </TreeItem>
        );
      })}
    </Tree>
  );
}

export function Pattern() {
  const titleId = useId();
  const [current, setCurrent] = useState(agents);
  const [open, setOpen] = useState('research');
  const [selected, setSelected] = useState(null);
  const [empty, setEmpty] = useState(false);
  const [notice, setNotice] = useState('');
  const opener = useRef(null);
  const all = empty ? [] : Object.values(current);
  const done = all.filter(agent => agent.status === 'done').length;
  const attention = all.filter(agent => ['awaiting', 'failed'].includes(agent.status)).length;
  const active = selected ? current[selected] : null;
  function inspect(id, element) { opener.current = element; setSelected(id); }
  function update(status, message) {
    setCurrent(value => ({ ...value, [selected]: { ...value[selected], status } }));
    setNotice(message); setSelected(null);
  }
  function reset() { setCurrent(agents); setEmpty(false); setOpen('research'); setNotice('Demo fleet reset.'); }
  function complete() {
    setCurrent(Object.fromEntries(Object.entries(agents).map(([id, agent]) => [id, { ...agent, status: 'done' }])));
    setNotice('Demo run complete. All agents finished.');
  }
  return (
    <section aria-labelledby={titleId} className='ds-touch-controls fleet-example mx-auto grid w-full min-w-0 max-w-6xl grid-cols-1 gap-5 text-sm'>
      <style>{`
        .fleet-example { container-type: inline-size; }
        .fleet-list { display: grid; gap: calc(var(--ds-space-scale, 1) * 12px); }
        .fleet-list > .ds-accordion-item { border: 0; min-width: 0; }
        .fleet-list .ds-accordion-heading { border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-card); min-width: 0; }
        .fleet-list .ds-accordion-trigger { align-items: flex-start; padding: calc(var(--ds-space-scale, 1) * 16px); }
        .fleet-list .ds-accordion-label { min-width: 0; }
        .fleet-list .ds-accordion-title { display: block; }
        .fleet-list .ds-accordion-content-inner { padding: calc(var(--ds-space-scale, 1) * 16px) 0; }
        @container (min-width: 52rem) {
          .fleet-list { grid-template-columns: minmax(0, 18rem) minmax(0, 1fr); }
          .fleet-list > .ds-accordion-item { display: contents; }
          .fleet-list .ds-accordion-heading { grid-column: 1; grid-row: var(--fleet-row); }
          .fleet-list .ds-accordion-content { grid-column: 2; grid-row: 1 / span 3; align-self: start; animation: none; }
          .fleet-list .ds-accordion-content-inner { padding: 0; }
          .fleet-empty-selection { grid-column: 2; grid-row: 1 / span 3; }
        }
      `}</style>
      <header className='grid gap-3 border-b pb-4'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div className='grid min-w-0 gap-1'><h2 id={titleId} className='text-lg font-semibold'>Migration fleet</h2><p className='text-text-muted'>Workspace migration · Demo run</p></div>
          <Badge variant={attention ? 'warning-light' : 'secondary'}>{attention ? `${attention} ${attention === 1 ? 'needs' : 'need'} you` : all.length && done === all.length ? 'Complete' : 'No blockers'}</Badge>
        </div>
        <div aria-label='Fleet summary' className='text-text-muted flex flex-wrap gap-x-5 gap-y-2 text-xs tabular-nums'>
          <span>{empty ? 0 : leads.length} leads · {Math.max(0, all.length - (empty ? 0 : leads.length))} sub-agents</span>
          <span>{all.filter(agent => agent.status === 'running').length} running</span><span>{done} of {all.length} done</span><span>{money(all.reduce((sum, agent) => sum + agent.cost, 0))} total</span>
        </div>
      </header>
      {empty ? <div className='grid justify-items-start gap-3 py-8'><h3 className='font-medium'>No agents assigned</h3><p className='text-text-muted'>Start the demo to explore delegated work and approvals.</p><Button onClick={reset}>Start demo fleet</Button></div> : (
        <AccordionRoot value={open} onValueChange={setOpen} variant='plain' className='fleet-list'>
          {leads.map((lead, index) => {
            const members = branchIds(lead.id).map(id => current[id]);
            const finished = members.filter(agent => agent.status === 'done').length;
            const needsYou = members.filter(agent => ['awaiting', 'failed'].includes(agent.status)).length;
            return (
              <AccordionItem key={lead.id} value={lead.id} style={{ '--fleet-row': index + 1 }}>
                <AccordionTrigger aria-label={`Show ${lead.name}`}>
                  <span className='grid min-w-0 gap-3 text-start'>
                    <span className='flex items-center gap-2'><ChatAgentMark name={lead.name} size='sm' /><span className='min-w-0 [overflow-wrap:anywhere]'>{lead.name}</span></span>
                    <span className='text-text-muted text-xs font-normal [overflow-wrap:anywhere]'>{lead.task}</span>
                    <span className='flex flex-wrap gap-2'><Status status={current[lead.id].status} />{needsYou > 0 && <Badge variant='warning-light'>{needsYou} {needsYou === 1 ? 'needs' : 'need'} you</Badge>}</span>
                    <ProgressRoot value={finished / members.length * 100} aria-label={`${lead.name} completion`} className='h-1' />
                    <span className='text-text-muted flex flex-wrap justify-between gap-2 text-xs font-normal tabular-nums'><span>{finished}/{members.length} done · {current[lead.id].elapsed}</span><span>{money(members.reduce((sum, agent) => sum + agent.cost, 0))}</span></span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='min-w-0 rounded-(--ds-radius-card) border p-3'>
                    <div className='mb-2 grid gap-1 border-b px-2 pb-3'><h4 className='font-medium'>{lead.name} team</h4><p className='text-text-muted text-xs'>Expand a team or open an agent’s tasks.</p></div>
                    <AgentTree lead={lead} current={current} onInspect={inspect} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
          {!open && <p className='fleet-empty-selection text-text-muted px-3 py-8'>Select a lead to inspect its delegated work.</p>}
        </AccordionRoot>
      )}
      <footer className='flex flex-wrap items-center justify-between gap-3 border-t pt-3'>
        <p className='text-text-muted text-xs'>Illustrative agents, timings and costs. Actions update this demo only.</p>
        <div className='flex flex-wrap gap-2'><Button variant='outline' size='sm' onClick={reset}>Reset</Button><Button variant='outline' size='sm' disabled={empty || done === all.length} onClick={complete}>Finish run</Button><Button variant='ghost' size='sm' disabled={empty} onClick={() => { setEmpty(true); setNotice('Demo fleet cleared.'); }}>Clear fleet</Button></div>
      </footer>
      <p role='status' className='sr-only'>{notice}</p>
      <DialogRoot open={Boolean(selected)} onOpenChange={value => { if (!value) setSelected(null); }}>
        <DialogContent className='max-h-[85dvh] grid-cols-1 overflow-y-auto' onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus(); }}>
          {active && <>
            <DialogHeader><DialogTitle>{active.name}</DialogTitle><DialogDescription>{active.task}</DialogDescription></DialogHeader>
            <div className='flex flex-wrap items-center gap-3 text-xs'><Status status={active.status} /><span>{active.elapsed}</span><span>{money(active.cost)} own cost</span></div>
            <ChatPlan title='Tasks' steps={[
              { id: 'context', title: 'Read the brief', status: active.status === 'pending' ? 'pending' : 'done' },
              { id: 'work', title: active.task, status: active.status },
              { id: 'report', title: 'Report to lead', status: active.status === 'done' ? 'done' : ['denied', 'cancelled'].includes(active.status) ? 'cancelled' : 'pending' }
            ]} />
            {active.status === 'awaiting' && <ChatMessageToolApproval name='Inspect staging permissions' description='Allow read-only access to staging workspace roles for this review?' onApprove={() => update('running', `${active.name} approved. Demo agent resumed.`)} onDeny={() => update('denied', `${active.name} denied. Access was not granted.`)} />}
            {active.status === 'failed' && <div className='grid gap-3'><p role='alert' className='text-text-muted'>The staging import timed out. Completed work is preserved.</p><div className='flex flex-wrap gap-2'><Button onClick={() => update('running', `${active.name} retry started in the demo.`)}>Retry agent</Button><Button variant='outline' onClick={() => update('cancelled', `${active.name} dismissed. Completed work preserved.`)}>Dismiss failure</Button></div></div>}
            <DialogFooter><Button variant='outline' onClick={() => setSelected(null)}>Close tasks</Button></DialogFooter>
          </>}
        </DialogContent>
      </DialogRoot>
    </section>
  );
}
