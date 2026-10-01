'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnCount,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay
} from '../../../../src/components/core/KanbanBoard/parts/kanban-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

// A feature roadmap weighted by demand: every card shows the accounts or revenue behind it, how far it
// has come, and its votes with the weekly trend. Upvote a card, sort each stage by demand, or drag a
// card by its grip into the next stage.
const STAGES = {
  triage: { title: 'Triage', note: 'New customer signals', dot: 'bg-text-muted', bar: '*:data-[slot=progress-indicator]:bg-text-muted' },
  planned: { title: 'Planned', note: 'Queued for scope', dot: 'bg-info', bar: '*:data-[slot=progress-indicator]:bg-info' },
  shaping: { title: 'Shaping', note: 'Solution design', dot: 'bg-discovery', bar: '*:data-[slot=progress-indicator]:bg-discovery' },
  building: { title: 'Building', note: 'Actively in progress', dot: 'bg-warning', bar: '*:data-[slot=progress-indicator]:bg-warning' },
  beta: { title: 'Beta', note: 'With design partners', dot: 'bg-attention', bar: '*:data-[slot=progress-indicator]:bg-attention' },
  shipped: { title: 'Shipped', note: 'Generally available', dot: 'bg-success', bar: '*:data-[slot=progress-indicator]:bg-success' }
};
const feature = (id, title, area, description, reach, reachNote, phase, progress, votes, trend, risky) => ({ id, title, area, description, reach, reachNote, phase, progress, votes, trend, risky });
const INITIAL = {
  triage: [
    feature('f1', 'Smart intake routing', 'Intake', 'Classify incoming requests by segment, account value, and urgency.', '23 accounts', 'Needs signal', 'Scoring', 20, 83, 14),
    feature('f2', 'Request capture from chat', 'Workflow', 'Turn product feedback threads into deduplicated roadmap signals.', '18 teams', 'Q3 review', 'Reviewing', 24, 67, 10),
    feature('f3', 'Customer signal clustering', 'Signals', 'Group related feedback by account segment and recent revenue motion.', '12 accounts', 'Signal review', 'Clustering', 18, 52, 7)
  ],
  planned: [
    feature('f4', 'Account search', 'Search', 'Permission-aware search across tickets, call notes, and docs.', '$72k pipeline', 'Q3 pilot', 'Discovery', 30, 142, 18),
    feature('f5', 'Outbound webhooks', 'Platform', 'Reliable event delivery for billing, seats, and lifecycle changes.', '14 accounts', 'Q3 scope', 'Pending scope', 28, 98, 6)
  ],
  shaping: [
    feature('f6', 'Custom report builder', 'Reports', 'Saved metrics, scoped filters, and reusable executive views.', '$81k ARR', 'Design review', 'Prototype', 34, 156, 21),
    feature('f7', 'Entitlement rules', 'Billing', 'Plan-aware capability gates with account overrides and audit notes.', '$63k ARR', 'Tech plan', 'Spec', 38, 132, -3),
    feature('f8', 'Renewal timeline view', 'Lifecycle', 'Unify renewal notes, owner changes, and risk events in one history.', '$49k ARR', 'Design review', 'Wireframe', 36, 118, 12)
  ],
  building: [
    feature('f9', 'Co-edit workspace', 'Teams', 'Shared editing with presence, conflict recovery, and audit history.', '$118k ARR', 'May beta', 'Dependency', 42, 234, 24),
    feature('f10', 'API v2 migration', 'API', 'Typed contract, migration helpers, and staged partner rollout.', '$54k ARR', 'Partner beta', 'At risk', 36, 176, -11, true)
  ],
  beta: [feature('f11', 'Scheduled exports', 'Reports', 'Recurring CSV and warehouse exports with delivery receipts.', '31 accounts', 'Beta cohort', 'Feedback', 78, 121, 9)],
  shipped: [feature('f12', 'Single sign-on', 'Security', 'SAML and OIDC sign-in with just-in-time provisioning.', '$140k ARR', 'Generally available', 'Released', 100, 288, 4)]
};

function FeatureCard({ item, stage, voted, onVote, isOverlay }) {
  const body = (
    <div className='grid gap-2 rounded-lg border border-border bg-surface p-3 text-sm shadow-xs'>
      <div className='flex items-start gap-2'>
        {isOverlay ? null : (
          <KanbanItemHandle asChild>
            <Button aria-label={`Move ${item.title}`} size='icon-xs' variant='ghost' className='-ms-1 text-text-muted'>
              <RegistryIcon lucide='GripVerticalIcon' />
            </Button>
          </KanbanItemHandle>
        )}
        <h4 className='min-w-0 flex-1 font-medium text-text'>{item.title}</h4>
        <Badge variant={item.risky ? 'destructive-light' : 'outline'} size='sm'>{item.area}</Badge>
      </div>
      <p className='text-xs text-text-muted'>{item.description}</p>
      <p className='text-xs text-text-muted'>
        <span className='font-medium text-text'>{item.reach}</span> · {item.reachNote}
      </p>
      <Progress value={item.progress} aria-label={`${item.title}: ${item.phase}, ${item.progress}%`} className={cn('h-1.5', item.risky ? '*:data-[slot=progress-indicator]:bg-danger' : STAGES[stage].bar)} />
      <div className='flex items-center gap-2 text-xs text-text-muted'>
        <span className={cn(item.risky && 'font-medium text-danger')}>{item.phase}</span>
        <span className='tabular-nums'>· {item.progress}%</span>
        <Button
          variant={voted ? 'secondary' : 'ghost'}
          size='xs'
          className='ms-auto tabular-nums'
          aria-pressed={voted}
          aria-label={`Upvote ${item.title}, ${item.votes + (voted ? 1 : 0)} votes`}
          onClick={() => onVote?.(item.id)}
          disabled={isOverlay}
        >
          <RegistryIcon lucide='ThumbsUpIcon' />
          {item.votes + (voted ? 1 : 0)}
        </Button>
        <span className={cn('inline-flex items-center gap-0.5 font-medium tabular-nums', item.trend >= 0 ? 'text-success' : 'text-danger')}>
          <RegistryIcon lucide={item.trend >= 0 ? 'ArrowUpIcon' : 'ArrowDownIcon'} className='size-3' />
          {Math.abs(item.trend)}
          <span className='sr-only'>{item.trend >= 0 ? 'more' : 'fewer'} votes this week</span>
        </span>
      </div>
    </div>
  );
  return (
    <KanbanItem value={item.id} withHandle>
      {body}
    </KanbanItem>
  );
}

function StageColumn({ value, items, votes, onVote, isOverlay }) {
  const stage = STAGES[value];
  return (
    <KanbanColumn value={value} className='gap-2 rounded-xl border border-border bg-surface-muted p-2'>
      <div className='grid gap-0.5 px-1'>
        <div className='flex items-center gap-2'>
          <span className={cn('size-2 rounded-full', stage.dot)} aria-hidden='true' />
          <h3 className='text-sm font-medium text-text'>{stage.title}</h3>
          <KanbanColumnCount count={items.length} />
        </div>
        <p className='ps-4 text-xs text-text-muted'>{stage.note}</p>
      </div>
      <KanbanColumnContent value={value} className='min-h-16'>
        {items.map((item) => (
          <FeatureCard key={item.id} item={item} stage={value} voted={votes.includes(item.id)} onVote={onVote} isOverlay={isOverlay} />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

export function Pattern() {
  const [columns, setColumns] = useState(INITIAL);
  const [votes, setVotes] = useState([]);
  const [byDemand, setByDemand] = useState(false);
  const score = (item) => item.votes + (votes.includes(item.id) ? 1 : 0);
  // Sorting is a view of the board; turning it on writes the sorted order so later drags start from it.
  const sortAll = (value) => Object.fromEntries(Object.entries(value).map(([key, items]) => [key, [...items].sort((a, b) => score(b) - score(a))]));
  const vote = (id) => setVotes((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));
  const demand = (checked) => {
    setByDemand(checked);
    if (checked) setColumns(sortAll(columns));
  };
  const shown = byDemand ? sortAll(columns) : columns;
  return (
    <div className='grid w-full gap-4'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h2 className='text-base font-semibold text-text'>Feature roadmap</h2>
          <p className='text-sm text-text-muted'>Demand, impact, delivery.</p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <Label className='flex items-center gap-2 text-xs font-normal'>
            <Switch size='sm' checked={byDemand} onCheckedChange={demand} />
            Sort by demand
          </Label>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setColumns({ ...columns, triage: [feature(`f${Date.now()}`, 'Untitled feature', 'Intake', 'Describe the problem and who asked for it.', '0 accounts', 'New', 'Scoring', 0, 0, 0), ...columns.triage] })}
          >
            <RegistryIcon lucide='PlusIcon' />
            New feature
          </Button>
        </div>
      </div>
      <Kanban value={shown} onValueChange={setColumns} getItemValue={(item) => item.id}>
        <KanbanBoard layout='scroll' aria-label='Feature roadmap board'>
          {Object.entries(shown).map(([value, items]) => (
            <StageColumn key={value} value={value} items={items} votes={votes} onVote={vote} />
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          {({ value, variant }) => {
            if (variant === 'column') return null;
            const entry = Object.entries(columns).find(([, items]) => items.some((item) => item.id === value));
            const item = entry?.[1].find((candidate) => candidate.id === value);
            return item ? <FeatureCard item={item} stage={entry[0]} voted={votes.includes(item.id)} isOverlay /> : null;
          }}
        </KanbanOverlay>
      </Kanban>
    </div>
  );
}
