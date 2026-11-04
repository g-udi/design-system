'use client';
import { useId, useState } from 'react';
import { CardRoot, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../core/Card/index.js';
import Button from '../../core/Button/index.js';
import { Badge } from '../../core/Pill/index.js';
import { ProgressRoot } from '../../core/Progress/index.js';
import { ToggleGroupRoot, ToggleGroupItem } from '../../core/ToggleGroup/index.js';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../../core/Accordion/index.js';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '../../core/EmptyState/index.js';
import { ChatAgentMark } from '../ChatAgentMark/index.js';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';

import { cn } from '../../../utilities/cn/index.js';

/** Filter and inspect prepared findings. The host owns review persistence and agent execution. */
export function ChatAgentFindings({ title = 'Agent findings', description, summary, agents = [], findings = [], severities = [], reviewedIds = [], onReviewedChange, readOnly = false, emptyState, footer, className }) {
  const titleId = useId();
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [severity, setSeverity] = useState('__all');
  const available = findings;
  const visible = available.filter(item => (!selectedAgents.length || selectedAgents.includes(item.agent)) && (severity === '__all' || item.severity === severity));
  function clearFilters() { setSelectedAgents([]); setSeverity('__all'); }
  return (
      <CardRoot variant='outline' aria-labelledby={titleId} data-panel='chat-agent-findings' className={cn('ds-touch-controls @container w-full min-w-0', className)}>
        <CardHeader className='gap-2'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <CardTitle as='h2' id={titleId}>{title}</CardTitle>
            <span className='text-xs tabular-nums text-text-muted'><bdi>{summary}</bdi></span>
          </div>
          {description && <CardDescription>{description}</CardDescription>}
          <div className='flex flex-wrap gap-2' aria-label='Finding totals'>
            {severities.map(level => <Badge key={level.id} variant={level.tone || 'secondary'}><bdi>{available.filter(item => item.severity === level.id).length} {level.label}</bdi></Badge>)}
          </div>
        </CardHeader>
        <CardContent className='grid gap-5'>
          <div>
            <p className='mb-2 text-xs text-text-muted'>Select agents to filter their findings.</p>
            <ul aria-label='Review agents' className='m-0 grid list-none gap-3 p-0'>
              {agents.map(agent => {
                const hasProgress = Number.isFinite(agent.value) && agent.value >= 0 && Number.isFinite(agent.max) && agent.max > 0;
                return <li key={agent.id} className={cn('grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1', hasProgress && '@[30rem]:grid-cols-[minmax(0,1fr)_7rem_5rem]')}>
                  <Button variant={selectedAgents.includes(agent.id) ? 'secondary' : 'ghost'} aria-pressed={selectedAgents.includes(agent.id)} aria-label={`Filter by ${agent.name}`} className='h-auto min-w-0 justify-start gap-2 whitespace-normal px-2 py-2 text-start' onClick={() => setSelectedAgents(values => values.includes(agent.id) ? values.filter(id => id !== agent.id) : [...values, agent.id])}>
                    <ChatAgentMark name={agent.name} icon={agent.icon} tone='neutral' size='sm' decorative />
                    <span className='grid min-w-0 gap-0.5 break-words'><span className='text-sm font-medium'>{agent.name}</span><span className='text-xs font-normal text-text-muted'>{agent.detail}</span></span>
                  </Button>
                  {hasProgress && <div className='order-3 col-span-2 flex min-w-0 items-center gap-2 px-2 @[30rem]:order-none @[30rem]:col-span-1 @[30rem]:px-0'>
                    <ProgressRoot value={agent.value} max={agent.max} aria-label={`${agent.name} checks`} className='h-1 flex-1' />
                    <span className='shrink-0 text-xs tabular-nums text-text-muted'><bdi>{agent.value}/{agent.max}</bdi></span>
                  </div>}
                  <Badge className='justify-self-end' variant={agent.tone || 'secondary'}>{agent.statusLabel}</Badge>
                </li>;
              })}
            </ul>
          </div>
          <section aria-label='Findings' className='min-w-0 border-t border-border pt-4'>
            <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
              <h3 className='text-sm font-medium'>Findings <span className='font-normal text-text-muted'>({visible.length} of {available.length})</span></h3>
              <ToggleGroupRoot className='min-w-0 max-w-full flex-wrap' type='single' size='sm' value={severity} onValueChange={value => value && setSeverity(value)} aria-label='Finding severity'>
                {[{ id: '__all', label: 'All' }, ...severities].map(level => <ToggleGroupItem key={level.id} value={level.id}>{level.label}</ToggleGroupItem>)}
              </ToggleGroupRoot>
            </div>
            {!!selectedAgents.length && <div className='mb-2 flex flex-wrap items-center gap-2 text-xs text-text-muted'><span>Agents: {agents.filter(agent => selectedAgents.includes(agent.id)).map(agent => agent.name).join(', ')}</span><Button size='xs' variant='ghost' onClick={clearFilters}>Clear filters</Button></div>}
            {visible.length ? <ul className='m-0 max-h-[28rem] list-none overflow-y-auto overscroll-contain p-0' aria-label='Agent findings feed'>
              {visible.map(item => <li key={item.id} className='border-b border-border last:border-0'>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant='ghost' className='group h-auto w-full min-w-0 items-start justify-between gap-3 whitespace-normal px-2 py-3 text-start' aria-label={`Inspect ${item.title}`}>
                      <span className='grid min-w-0 gap-1.5'>
                        <span className='flex flex-wrap items-center gap-2'><Badge variant={severities.find(level => level.id === item.severity)?.tone || 'secondary'}>{severities.find(level => level.id === item.severity)?.label || item.severity}</Badge>{reviewedIds.includes(item.id) && <Badge variant='success-light'>Reviewed</Badge>}<span className='text-sm font-medium'>{item.title}</span></span>
                        <span className='flex flex-wrap gap-x-2 gap-y-1 text-xs font-normal text-text-muted'><span>{agents.find(agent => agent.id === item.agent)?.name || item.agent}</span><bdi className='break-all'>{item.location}</bdi><time><bdi>{item.time}</bdi></time></span>
                      </span>
                      <RegistryIcon lucide='ChevronDown' className='mt-1 size-3.5 shrink-0 group-data-[state=open]:rotate-180' />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className='px-2 pb-4'>
                    <div className='grid gap-3 text-sm leading-relaxed'>
                      {item.evidence != null && <div><h4 className='mb-1 text-xs font-medium'>Evidence</h4><p className='text-text-muted'>{item.evidence}</p></div>}
                      {item.recommendation != null && <div><h4 className='mb-1 text-xs font-medium'>Suggested change</h4><p className='text-text-muted'>{item.recommendation}</p></div>}
                      {item.evidence == null && item.recommendation == null && <p className='text-text-muted'>No supporting detail supplied.</p>}
                      {onReviewedChange && <Button size='sm' variant='outline' className='justify-self-start' disabled={readOnly} onClick={() => onReviewedChange(item.id, !reviewedIds.includes(item.id))}>{reviewedIds.includes(item.id) ? 'Mark unreviewed' : 'Mark reviewed'}</Button>}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </li>)}
            </ul> : !available.length && emptyState ? emptyState : <Empty className='py-6'><EmptyHeader><EmptyTitle>{available.length ? 'No matching findings' : 'No findings yet'}</EmptyTitle><EmptyDescription>{available.length ? 'Try another agent or severity. Collected findings are still available.' : 'Findings will appear here when available.'}</EmptyDescription></EmptyHeader>{available.length > 0 && <Button size='sm' variant='outline' onClick={clearFilters}>Clear filters</Button>}</Empty>}
          </section>
        </CardContent>
        {footer && <CardFooter className='flex-wrap justify-between gap-3 border-t border-border pt-4'>{footer}</CardFooter>}
      </CardRoot>
  );
}
