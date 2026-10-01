'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnCount,
  KanbanColumnRail,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay
} from '../../../../src/components/core/KanbanBoard/parts/kanban-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { ProgressRing } from '../../../../src/components/core/Progress/parts/progress-ring.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

// A workflow board whose finished or parked stages fold into rails. The Columns menu (or a rail) shows
// a stage again, cards still drop onto a rail, and the same work reads as tasks or as deals.
const STAGES = {
  backlog: { title: 'Backlog', icon: 'CircleDashedIcon', badge: 'outline' },
  planned: { title: 'Planned', icon: 'CircleIcon', badge: 'outline' },
  progress: { title: 'In progress', icon: 'CircleDotIcon', badge: 'info' },
  paused: { title: 'Paused', icon: 'CirclePauseIcon', badge: 'warning-light' },
  completed: { title: 'Completed', icon: 'CircleCheckIcon', badge: 'success-light' },
  cancelled: { title: 'Cancelled', icon: 'CircleXIcon', badge: 'secondary' }
};
const TAG = { Prep: 'outline', Commercial: 'discovery-light', Legal: 'warning-light', Finance: 'info-light' };
const STATE = { Confirmed: 'bg-success', Ready: 'bg-success', Risk: 'bg-warning', Finance: 'bg-warning' };
const face = (portrait) => `https://randomuser.me/api/portraits/${portrait}.jpg`;
const PEOPLE = {
  nora: ['Nora Lee', 'Ops', 'women/65'],
  elena: ['Elena Torres', 'Review', 'women/44'],
  marcus: ['Marcus Chen', 'Finance', 'men/32'],
  omar: ['Omar Haddad', 'Planning', 'men/75'],
  priya: ['Priya Shah', 'Product', 'women/68'],
  liam: ['Liam Carter', 'Quality', 'men/11']
};
let next = 20;
const work = (title, tag, state, person, helper, score, files, checks, comments, days, amount, step) => {
  const [owner, role, portrait] = PEOPLE[person];
  const [helperName, , helperPortrait] = PEOPLE[helper];
  return {
    id: `w${(next += 1)}`,
    title, tag, state, owner, role, avatar: face(portrait), score, files, checks, comments, days, amount, step,
    team: [[owner, face(portrait)], [helperName, face(helperPortrait)]]
  };
};
const INITIAL = {
  backlog: [
    work('Draft renewal checklist for strategic workspace rollouts', 'Prep', 'Confirmed', 'nora', 'elena', 61, 1, 4, 2, 22, '$12,800', 'Define approval path'),
    work('Collect admin feedback on workspace handoff notes', 'Prep', 'Risk', 'elena', 'omar', 56, 2, 3, 1, 20, '$32,500', 'Choose data sources'),
    work('Prepare checklist template for regional launch teams', 'Prep', 'Ready', 'marcus', 'priya', 69, 1, 5, 2, 18, '$9,600', 'Attach vendor terms')
  ],
  planned: [
    work('Estimate migration scope for enterprise tenant groups', 'Commercial', 'Ready', 'omar', 'liam', 56, 2, 3, 1, 16, '$24,000', 'Set adoption target'),
    work('Map reviewer roles for procurement policy updates', 'Legal', 'Confirmed', 'priya', 'nora', 61, 1, 4, 3, 13, '$16,900', 'Confirm scoring weights')
  ],
  progress: [
    work('Connect workspace audit stream to the activity timeline', 'Commercial', 'Finance', 'priya', 'marcus', 83, 3, 6, 4, 8, '$41,200', 'Connect approval rules'),
    work('Tune procurement approval rules for finance reviewers', 'Finance', 'Risk', 'marcus', 'elena', 72, 2, 5, 6, 5, '$27,400', 'Log sync failures'),
    work('Refine saved view permissions for partner workspaces', 'Legal', 'Ready', 'liam', 'omar', 64, 2, 4, 5, 6, '$18,300', 'Review exceptions')
  ],
  paused: [
    work('Archive unused onboarding sequences', 'Prep', 'Risk', 'nora', 'liam', 34, 1, 2, 1, 30, '$4,200', 'Wait for sign-off'),
    work('Rebuild regional pricing sheet', 'Finance', 'Risk', 'marcus', 'nora', 22, 1, 1, 0, 41, '$7,900', 'Pending new rates')
  ],
  completed: [
    work('Publish workspace launch checklist', 'Prep', 'Confirmed', 'elena', 'priya', 100, 3, 8, 6, 0, '$21,000', 'Done'),
    work('Sign data processing addendum', 'Legal', 'Confirmed', 'priya', 'omar', 100, 2, 4, 3, 0, '$14,500', 'Done'),
    work('Close quarter-end invoice review', 'Finance', 'Confirmed', 'marcus', 'liam', 100, 4, 6, 2, 0, '$38,800', 'Done')
  ],
  cancelled: [
    work('Pilot a second approval tier', 'Commercial', 'Risk', 'omar', 'elena', 12, 1, 0, 2, 0, '$6,000', 'Dropped'),
    work('Migrate legacy export format', 'Prep', 'Risk', 'liam', 'nora', 8, 0, 1, 1, 0, '$3,100', 'Dropped')
  ]
};

function Meta({ icon, children }) {
  return (
    <span className='inline-flex items-center gap-1'>
      <RegistryIcon lucide={icon} className='size-3.5' />
      {children}
    </span>
  );
}

function WorkCard({ item, view, isOverlay }) {
  const body = (
    <div className='grid gap-2.5 rounded-lg border border-border bg-surface p-3 text-sm shadow-xs'>
      <p className='line-clamp-2 font-medium text-text'>{item.title}</p>
      {view === 'tasks' ? (
        <>
          <div className='flex items-center gap-2 text-xs text-text-muted'>
            <Badge variant={TAG[item.tag]} size='sm'>{item.tag}</Badge>
            <span className='inline-flex items-center gap-1.5'>
              <span className={cn('size-1.5 rounded-full', STATE[item.state])} aria-hidden='true' />
              {item.state}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Avatar className='size-7'>
              <AvatarImage src={item.avatar} alt='' />
              <AvatarFallback>{item.owner.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className='grid min-w-0 flex-1 text-xs leading-tight'>
              <span className='truncate font-medium text-text'>{item.owner}</span>
              <span className='text-text-muted'>{item.role}</span>
            </span>
            <ProgressRing value={item.score} size='md' showValue tone={item.score >= 70 ? 'info' : 'neutral'} label={`${item.title} readiness`} />
          </div>
        </>
      ) : (
        <div className='grid gap-1.5 text-xs text-text-muted'>
          <span className='inline-flex items-center gap-2 text-text'>
            <Avatar className='size-5'>
              <AvatarImage src={item.avatar} alt='' />
              <AvatarFallback>{item.owner.charAt(0)}</AvatarFallback>
            </Avatar>
            {item.owner}
          </span>
          <Meta icon='DollarSignIcon'><span className='font-medium text-text tabular-nums'>{item.amount}</span></Meta>
          <Meta icon='SquareCheckIcon'><span className='truncate'>{item.step}</span></Meta>
        </div>
      )}
      <div className='flex items-center gap-3 border-t border-border pt-2 text-xs text-text-muted'>
        <Meta icon='PaperclipIcon'>{item.files}</Meta>
        <Meta icon='SquareCheckIcon'>{item.checks}</Meta>
        <Meta icon='MessageSquareIcon'>{item.comments}</Meta>
        {view === 'deals' ? (
          <AvatarGroup className='ms-auto'>
            {item.team.map(([name, src]) => (
              <Avatar key={name} className='size-5'>
                <AvatarImage src={src} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        ) : null}
        <span className={cn('inline-flex items-center gap-1 tabular-nums', view === 'tasks' && 'ms-auto')}>
          <RegistryIcon lucide='ClockIcon' className='size-3.5' />
          {item.days ? `${item.days}d` : 'Closed'}
        </span>
      </div>
    </div>
  );
  return <KanbanItem value={item.id}>{isOverlay ? body : <KanbanItemHandle>{body}</KanbanItemHandle>}</KanbanItem>;
}

function StageColumn({ value, items, view, collapsed, onToggle, onAdd, isOverlay }) {
  const stage = STAGES[value];
  if (collapsed) {
    return (
      <KanbanColumn value={value} collapsed>
        <KanbanColumnRail
          label={stage.title}
          count={items.length}
          icon={<RegistryIcon lucide={stage.icon} className='size-4 text-text-muted' />}
          onExpand={() => onToggle(value)}
        />
      </KanbanColumn>
    );
  }
  return (
    <KanbanColumn value={value} className='gap-2 rounded-xl border border-border bg-surface-muted p-2'>
      <div className='flex items-center gap-2 px-1'>
        <Badge variant={stage.badge} size='sm' className='gap-1 uppercase'>
          <RegistryIcon lucide={stage.icon} className='size-3' />
          {stage.title}
        </Badge>
        <KanbanColumnCount count={items.length} />
        <Button aria-label={`Collapse ${stage.title}`} aria-expanded size='icon-xs' variant='ghost' className='ms-auto' onClick={() => onToggle(value)}>
          <RegistryIcon lucide='ChevronsLeftIcon' />
        </Button>
      </div>
      <KanbanColumnContent value={value} className='min-h-16'>
        {items.map((item) => (
          <WorkCard key={item.id} item={item} view={view} isOverlay={isOverlay} />
        ))}
      </KanbanColumnContent>
      {isOverlay ? null : (
        <Button variant='ghost' size='sm' className='text-text-muted' onClick={() => onAdd(value)}>
          <RegistryIcon lucide='PlusIcon' />
          Add task
        </Button>
      )}
    </KanbanColumn>
  );
}

export function Pattern() {
  const [columns, setColumns] = useState(INITIAL);
  const [collapsed, setCollapsed] = useState(['paused', 'completed', 'cancelled']);
  const [view, setView] = useState('tasks');
  const toggle = (value) => setCollapsed((current) => (current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value]));
  const add = (value) =>
    setColumns({ ...columns, [value]: [...columns[value], work('Untitled task', 'Prep', 'Ready', 'nora', 'elena', 0, 0, 0, 0, 14, '$0', 'Add a next step')] });
  return (
    <div className='grid w-full gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-base font-semibold text-text'>Workflow board</h2>
        <div className='flex flex-wrap items-center gap-2'>
          <ToggleGroup aria-label='Card view' type='single' variant='outline' size='sm' spacing={0} value={view} onValueChange={(nextView) => setView(nextView || view)}>
            <ToggleGroupItem value='tasks'>Tasks</ToggleGroupItem>
            <ToggleGroupItem value='deals'>Deals</ToggleGroupItem>
          </ToggleGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <RegistryIcon lucide='Columns3Icon' />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Show stages</DropdownMenuLabel>
              {Object.entries(STAGES).map(([value, stage]) => (
                <DropdownMenuCheckboxItem key={value} checked={!collapsed.includes(value)} onCheckedChange={() => toggle(value)}>
                  {stage.title}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Kanban value={columns} onValueChange={setColumns} getItemValue={(item) => item.id}>
        <KanbanBoard layout='scroll' aria-label='Workflow board'>
          {Object.entries(columns).map(([value, items]) => (
            <StageColumn key={value} value={value} items={items} view={view} collapsed={collapsed.includes(value)} onToggle={toggle} onAdd={add} />
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          {({ value, variant }) => {
            if (variant === 'column') return null;
            const item = Object.values(columns).flat().find((entry) => entry.id === value);
            return item ? <WorkCard item={item} view={view} isOverlay /> : null;
          }}
        </KanbanOverlay>
      </Kanban>
    </div>
  );
}
