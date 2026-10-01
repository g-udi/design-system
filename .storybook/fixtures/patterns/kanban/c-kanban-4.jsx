'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnCount,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay
} from '../../../../src/components/core/KanbanBoard/parts/kanban-extended.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Rating } from '../../../../src/components/core/Rating/parts/rating-extended.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { Loom } from '../../../../src/icons/brands/loom.jsx';
import { Openai } from '../../../../src/icons/brands/openai.jsx';
import { Slack } from '../../../../src/icons/brands/slack.jsx';
import { Stripe } from '../../../../src/icons/brands/stripe.jsx';
import { Supabase } from '../../../../src/icons/brands/supabase.jsx';
import { Zoom } from '../../../../src/icons/brands/zoom.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

// Two pipelines on one card layout: deals moving through sales stages, and access requests moving
// through review. Each card carries a mark, a tag, two detail lines, an owner, a star score, activity
// counts and a due chip; stages reorder by their handle and the access board adds requests per stage.
const face = (portrait) => `https://randomuser.me/api/portraits/${portrait}.jpg`;
// fill-current lets single-colour marks follow the text colour in dark mode.
const logo = (Mark) => <Mark className='size-4 fill-current text-text' aria-hidden='true' />;
const dot = (tone) => <span className={cn('size-2.5 rounded-full', tone)} aria-hidden='true' />;
const RISK = { Low: ['success-light', 'bg-success'], Medium: ['warning-light', 'bg-warning'], High: ['destructive-light', 'bg-danger'], Critical: ['destructive', 'bg-danger'] };

const BOARDS = {
  sales: {
    title: 'Sales pipeline',
    subtitle: 'Track accounts and next steps.',
    create: 'New deal',
    stages: {
      prospecting: { title: 'Prospecting', mark: dot('bg-text-muted') },
      qualification: { title: 'Qualification', mark: dot('bg-text') },
      meeting: { title: 'Meeting', mark: dot('bg-warning') },
      proposal: { title: 'Proposal', mark: dot('bg-discovery') }
    },
    lines: ['DollarSignIcon', 'CalendarIcon'],
    score: 'Deal confidence',
    items: {
      prospecting: [
        ['s1', logo(Supabase), 'Supabase', 'Inbound', 'info-light', '$34,800', 'Annual platform expansion', 'Map technical buyer', 'May 6', 'Mara Bell', 'women/44', 4, [2, 3, 5], '2d left'],
        ['s2', logo(Slack), 'Slack', 'Partner', 'secondary', '$18,400', 'Team workflow pilot', 'Confirm champion contact', 'May 8', 'Jonas Park', 'men/22', 3.5, [1, 2, 3], 'Today']
      ],
      qualification: [
        ['s3', logo(Stripe), 'Stripe', 'Expansion', 'success-light', '$52,600', 'Usage-based billing layer', 'Validate security review', 'May 9', 'Lina Ortiz', 'women/21', 5, [3, 5, 4], '4d left'],
        ['s4', logo(Openai), 'OpenAI', 'Strategic', 'warning-light', '$41,200', 'Research workspace rollout', 'Align procurement path', 'May 11', 'Theo Grant', 'men/52', 4.5, [4, 4, 7], '1d left']
      ],
      meeting: [
        ['s5', logo(Zoom), 'Zoom', 'Discovery', 'discovery-light', '$29,600', 'Scheduling workspace pilot', 'Run discovery call', 'May 12', 'Mara Bell', 'women/44', 4, [2, 3, 4], 'Booked']
      ],
      proposal: [
        ['s6', logo(Loom), 'Loom', 'Pilot', 'info-light', '$27,300', 'Enablement content hub', 'Share success plan', 'May 14', 'Jonas Park', 'men/22', 3, [2, 3, 2], '2d left']
      ]
    }
  },
  access: {
    title: 'Access review',
    subtitle: 'Review access changes, risk signals, and owner attestations.',
    create: 'New review',
    stages: {
      intake: { title: 'Intake', mark: <RegistryIcon lucide='InboxIcon' className='size-4 text-info' /> },
      owner: { title: 'Owner review', mark: <RegistryIcon lucide='UserCheckIcon' className='size-4 text-discovery' /> },
      risk: { title: 'Risk review', mark: <RegistryIcon lucide='ShieldAlertIcon' className='size-4 text-danger' /> },
      exception: { title: 'Exception', mark: <RegistryIcon lucide='FileTextIcon' className='size-4 text-info' /> },
      removal: { title: 'Removal', mark: <RegistryIcon lucide='KeyRoundIcon' className='size-4 text-warning' /> }
    },
    lines: ['KeyRoundIcon', 'CalendarIcon'],
    score: 'Reviewer confidence',
    add: true,
    items: {
      intake: [
        ['a1', dot(RISK.Medium[1]), 'Billing console', 'Medium', RISK.Medium[0], 'IAM-1021', 'Billing admin', 'Verify billing admin scope', '18m ago', 'Avery Stone', 'men/86', 3, [2, 2, 3], 'Today'],
        ['a2', dot(RISK.Low[1]), 'Support console', 'Low', RISK.Low[0], 'IAM-1022', 'Session replay', 'Confirm support coverage', '2h ago', 'Talia Moss', 'women/30', 2, [1, 2, 1], '2d']
      ],
      owner: [
        ['a3', dot(RISK.Medium[1]), 'Data warehouse', 'Medium', RISK.Medium[0], 'IAM-1104', 'Schema owner', 'Attest warehouse grants', '41m ago', 'Dev Iqbal', 'men/41', 3, [3, 2, 2], '1d'],
        ['a4', dot(RISK.Low[1]), 'Workspace admin', 'Low', RISK.Low[0], 'IAM-1107', 'Org settings', 'Review workspace roles', 'Yesterday', 'Camila Reed', 'women/12', 2, [1, 2, 4], '3d']
      ],
      risk: [
        ['a5', dot(RISK.Critical[1]), 'Source control', 'Critical', RISK.Critical[0], 'IAM-1208', 'Repository admin', 'Remove dormant admins', '44d ago', 'Jonas Hart', 'men/18', 5, [4, 2, 7], 'Overdue'],
        ['a6', dot(RISK.High[1]), 'Payroll', 'High', RISK.High[0], 'IAM-1212', 'Payroll export', 'Validate payroll export', '6d ago', 'Freya Chen', 'women/47', 4, [2, 2, 5], 'Today']
      ],
      exception: [
        ['a7', dot(RISK.High[1]), 'Identity provider', 'High', RISK.High[0], 'IAM-1301', 'Break-glass admin', 'Time-box break-glass access', '12m ago', 'Avery Stone', 'men/86', 4, [3, 2, 4], '12h']
      ],
      removal: [
        ['a8', dot(RISK.Medium[1]), 'Customer data platform', 'Medium', RISK.Medium[0], 'IAM-1416', 'Audience export', 'Queue marketing removal', '3d ago', 'Talia Moss', 'women/30', 3, [2, 2, 2], '1d']
      ]
    }
  }
};
const toCard = ([id, mark, name, tag, tagVariant, primary, primaryNote, step, when, person, portrait, score, [files, checks, comments], due]) =>
  ({ id, mark, name, tag, tagVariant, primary, primaryNote, step, when, person, avatar: face(portrait), score, files, checks, comments, due });
const initialItems = (key) => Object.fromEntries(Object.entries(BOARDS[key].items).map(([stage, rows]) => [stage, rows.map(toCard)]));
const URGENT = new Set(['Overdue', 'Today']);

function PipelineCard({ item, board, isOverlay }) {
  const [primaryIcon, stepIcon] = board.lines;
  const body = (
    <div className='grid gap-2 rounded-lg border border-border bg-surface p-3 text-sm shadow-xs'>
      <div className='flex items-center gap-2'>
        {item.mark}
        <span className='min-w-0 flex-1 truncate font-medium text-text'>{item.name}</span>
        <Badge variant={item.tagVariant} size='sm'>{item.tag}</Badge>
      </div>
      <p className='flex min-w-0 items-center gap-2 text-xs text-text-muted'>
        <RegistryIcon lucide={primaryIcon} className='size-3.5 shrink-0' />
        <span className='font-medium text-text tabular-nums'>{item.primary}</span>
        <span className='truncate'>{item.primaryNote}</span>
      </p>
      <p className='flex min-w-0 items-center gap-2 text-xs text-text-muted'>
        <RegistryIcon lucide={stepIcon} className='size-3.5 shrink-0' />
        <span className='truncate text-text'>{item.step}</span>
        <span className='ms-auto shrink-0'>{item.when}</span>
      </p>
      <div className='flex items-center gap-2 text-xs text-text-muted'>
        <Avatar className='size-5'>
          <AvatarImage src={item.avatar} alt='' />
          <AvatarFallback>{item.person.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className='truncate'>{item.person}</span>
        <Rating rating={item.score} size='sm' className='ms-auto gap-0.5' starClassName='size-3.5' aria-label={`${board.score}: ${item.score} of 5`} />
      </div>
      <div className='flex items-center gap-3 border-t border-border pt-2 text-xs text-text-muted'>
        <span className='inline-flex items-center gap-1'><RegistryIcon lucide='PaperclipIcon' className='size-3.5' />{item.files}</span>
        <span className='inline-flex items-center gap-1'><RegistryIcon lucide='SquareCheckIcon' className='size-3.5' />{item.checks}</span>
        <span className='inline-flex items-center gap-1'><RegistryIcon lucide='MessageSquareIcon' className='size-3.5' />{item.comments}</span>
        <span className={cn('ms-auto inline-flex items-center gap-1', URGENT.has(item.due) && 'font-medium text-danger')}>
          <RegistryIcon lucide='ClockIcon' className='size-3.5' />
          {item.due}
        </span>
      </div>
    </div>
  );
  return <KanbanItem value={item.id}>{isOverlay ? body : <KanbanItemHandle>{body}</KanbanItemHandle>}</KanbanItem>;
}

function PipelineColumn({ value, items, board, onAdd, isOverlay }) {
  const stage = board.stages[value];
  return (
    <KanbanColumn value={value} className={cn('gap-2', board.add && 'rounded-xl border border-border bg-surface-muted p-2')}>
      <div className='flex items-center gap-2 px-1'>
        {stage.mark}
        <h3 className='text-sm font-medium text-text'>{stage.title}</h3>
        <KanbanColumnCount count={items.length} />
        <KanbanColumnHandle asChild>
          <Button aria-label={`Reorder ${stage.title}`} size='icon-xs' variant='ghost' className='ms-auto'>
            <RegistryIcon lucide='GripVerticalIcon' />
          </Button>
        </KanbanColumnHandle>
      </div>
      <KanbanColumnContent value={value} className='min-h-16'>
        {items.map((item) => (
          <PipelineCard key={item.id} item={item} board={board} isOverlay={isOverlay} />
        ))}
      </KanbanColumnContent>
      {board.add && !isOverlay ? (
        <Button variant='ghost' size='sm' className='text-text-muted' onClick={() => onAdd(value)}>
          <RegistryIcon lucide='PlusIcon' />
          Add {stage.title.toLowerCase()}
        </Button>
      ) : null}
    </KanbanColumn>
  );
}

export function Pattern() {
  const [boardKey, setBoardKey] = useState('sales');
  const [values, setValues] = useState(() => ({ sales: initialItems('sales'), access: initialItems('access') }));
  const board = BOARDS[boardKey];
  const columns = values[boardKey];
  const setColumns = (next) => setValues((current) => ({ ...current, [boardKey]: next }));
  const total = Object.values(columns).flat().length;
  const add = (stage) => {
    const id = `${boardKey}-${Date.now()}`;
    const first = Object.values(board.items)[0][0];
    const draft = toCard([id, first[1], boardKey === 'sales' ? 'New account' : 'New request', 'Draft', 'outline', '—', 'Add details', 'Assign an owner', 'Now', first[9], first[10], 0, [0, 0, 0], 'No date']);
    setColumns({ ...columns, [stage]: [draft, ...columns[stage]] });
  };
  return (
    <div className='grid w-full gap-4'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h2 className='flex items-center gap-2 text-base font-semibold text-text'>
            {board.title}
            <Badge variant='outline' size='sm' className='tabular-nums'>{total}</Badge>
          </h2>
          <p className='text-sm text-text-muted'>{board.subtitle}</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <ToggleGroup aria-label='Pipeline' type='single' variant='outline' size='sm' spacing={0} value={boardKey} onValueChange={(next) => setBoardKey(next || boardKey)}>
            <ToggleGroupItem value='sales'>Sales</ToggleGroupItem>
            <ToggleGroupItem value='access'>Access review</ToggleGroupItem>
          </ToggleGroup>
          <Button variant='outline' size='sm' onClick={() => add(Object.keys(board.stages)[0])}>
            <RegistryIcon lucide='PlusIcon' />
            {board.create}
          </Button>
        </div>
      </div>
      <Kanban key={boardKey} value={columns} onValueChange={setColumns} getItemValue={(item) => item.id}>
        <KanbanBoard layout='scroll' aria-label={`${board.title} board`}>
          {Object.entries(columns).map(([value, items]) => (
            <PipelineColumn key={value} value={value} items={items} board={board} onAdd={add} />
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          {({ value, variant }) => {
            if (variant === 'column') return <PipelineColumn value={String(value)} items={columns[value] ?? []} board={board} isOverlay />;
            const item = Object.values(columns).flat().find((entry) => entry.id === value);
            return item ? <PipelineCard item={item} board={board} isOverlay /> : null;
          }}
        </KanbanOverlay>
      </Kanban>
    </div>
  );
}
