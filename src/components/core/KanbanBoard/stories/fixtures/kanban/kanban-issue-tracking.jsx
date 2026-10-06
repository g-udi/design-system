'use client';
import { useMemo, useState } from 'react';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  Kanban,
  KanbanBoardPrimitive as KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnCount,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay
} from '@gaudi/design-system/core/KanbanBoard';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuCheckboxItemPrimitive as DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { ProgressRing } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { cn } from '@gaudi/design-system/utilities/cn';

// Issue tracking: numbered status columns tinted by state, issue keys with priority, a status chip,
// the owner, a due date and a completion ring. In progress carries a work-in-progress limit of three.
const COLUMNS = {
  open: { title: '1. Open', frame: 'border-border bg-surface-muted' },
  triage: { title: '2. Triage', frame: 'border-warning-border bg-warning-subtle' },
  progress: { title: '3. In progress', frame: 'border-info-border bg-info-subtle', limit: 3 },
  info: { title: '4. Need info', frame: 'border-danger-border bg-danger-subtle' },
  review: { title: '5. In review', frame: 'border-discovery-border bg-discovery-subtle' },
  done: { title: '6. Done', frame: 'border-success-border bg-success-subtle' }
};
const STATUS = {
  queued: { label: 'Queued', dot: 'bg-text-muted' },
  blocked: { label: 'Blocked', dot: 'bg-danger' },
  track: { label: 'On track', dot: 'bg-success' },
  risk: { label: 'At risk', dot: 'bg-warning' },
  waiting: { label: 'Waiting', dot: 'bg-text-muted' },
  shipped: { label: 'Shipped', dot: 'bg-success' }
};
const RING_TONE = (value) => (value >= 60 ? 'success' : value >= 30 ? 'warning' : 'danger');
const PRIORITIES = ['P0', 'P1', 'P2'];
const face = (portrait) => `/avatars/${portrait}.svg`;
const issue = (id, area, priority, status, title, owner, portrait, due, done) => ({ id, area, priority, status, title, owner, avatar: face(portrait), due, done });
const INITIAL = {
  open: [
    issue('BUG-421', 'Access', 'P1', 'queued', 'User permissions block account switching', 'Nora Lee', 'person-23', 'Today', 12),
    issue('BUG-426', 'Forms', 'P2', 'risk', 'Forms submit duplicate confirmation emails', 'Omar Vale', 'person-43', 'Apr 26', 26)
  ],
  triage: [
    issue('BUG-438', 'Auth', 'P0', 'blocked', 'Login button does not redirect from invite links', 'Mia Hart', 'person-12', 'Today', 8),
    issue('BUG-445', 'API', 'P1', 'risk', 'API integration returns incorrect totals', 'Eli Stone', 'person-46', 'Apr 25', 42),
    issue('BUG-449', 'Import', 'P1', 'risk', 'Import wizard skips validation errors', 'Ari Blake', 'person-35', 'Apr 26', 31)
  ],
  progress: [
    issue('BUG-452', 'UI', 'P2', 'track', 'Button text truncates when zoomed in', 'Kai Chen', 'person-51', 'Apr 27', 58),
    issue('BUG-459', 'Nav', 'P2', 'track', 'Navigation menu renders inconsistent font sizes', 'Rae Kim', 'person-17', 'Apr 29', 66)
  ],
  info: [
    issue('BUG-467', 'Mobile', 'P0', 'blocked', 'Mobile app crashes when opening report history', 'Lina Ford', 'person-07', 'Waiting', 0),
    issue('BUG-472', 'Export', 'P1', 'risk', 'Data export creates broken report links', 'Theo West', 'person-42', 'Apr 28', 34)
  ],
  review: [issue('BUG-414', 'Search', 'P1', 'track', 'Search results ignore archived filter', 'Tara Quinn', 'person-21', 'Apr 24', 88)],
  done: [issue('BUG-402', 'Billing', 'P2', 'shipped', 'Invoice totals round to the wrong currency', 'Ben Ross', 'person-48', 'Apr 21', 100)]
};

function IssueCard({ item, isOverlay }) {
  const status = STATUS[item.status];
  const body = (
    <div className='grid gap-2 rounded-lg border border-border bg-surface p-3 text-sm shadow-xs'>
      <div className='flex items-center gap-2 text-xs text-text-muted'>
        <Badge variant='outline' size='sm'>{item.area}</Badge>
        <span className='tabular-nums'>{item.id}</span>
        <span>{item.priority}</span>
        <span className='ms-auto inline-flex items-center gap-1.5 text-text'>
          <span className={cn('size-1.5 rounded-full', status.dot)} aria-hidden='true' />
          {status.label}
        </span>
      </div>
      <p className='font-medium text-text'>{item.title}</p>
      <div className='flex items-center gap-2 text-xs text-text-muted'>
        <Avatar className='size-5'>
          <AvatarImage src={item.avatar} alt='' />
          <AvatarFallback>{item.owner.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className='min-w-0 flex-1 truncate'>{item.owner}</span>
        <span className='inline-flex items-center gap-1'>
          <RegistryIcon lucide='CalendarIcon' className='size-3.5' />
          {item.due}
        </span>
        <ProgressRing value={item.done} size='xs' tone={RING_TONE(item.done)} label={`${item.id} completion`} />
        <span className='w-8 text-end tabular-nums'>{item.done}%</span>
      </div>
    </div>
  );
  return <KanbanItem value={item.id}>{isOverlay ? body : <KanbanItemHandle>{body}</KanbanItemHandle>}</KanbanItem>;
}

function IssueColumn({ value, items, isOverlay }) {
  const column = COLUMNS[value];
  return (
    <KanbanColumn value={value} className={cn('gap-2 rounded-xl border p-2', column.frame)}>
      <div className='flex items-center gap-2 px-1'>
        <h3 className='text-sm font-medium text-text'>{column.title}</h3>
        <KanbanColumnCount count={items.length} limit={column.limit} />
        <KanbanColumnHandle asChild>
          <Button aria-label={`Reorder ${column.title}`} size='icon-xs' variant='ghost' className='ms-auto'>
            <RegistryIcon lucide='GripVerticalIcon' />
          </Button>
        </KanbanColumnHandle>
      </div>
      <KanbanColumnContent value={value} className='min-h-16'>
        {items.map((item) => (
          <IssueCard key={item.id} item={item} isOverlay={isOverlay} />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

export function Pattern() {
  const [columns, setColumns] = useState(INITIAL);
  const [priorities, setPriorities] = useState(PRIORITIES);
  const [copyError, setCopyError] = useState(false);
  const { copy, isCopied } = useCopyToClipboard({ onCopy: () => setCopyError(false), onError: () => setCopyError(true) });
  // Filtering hides cards from view only; the board value keeps every issue so moves stay lossless.
  const visible = useMemo(
    () => Object.fromEntries(Object.entries(columns).map(([key, items]) => [key, items.filter((item) => priorities.includes(item.priority))])),
    [columns, priorities]
  );
  const filtered = priorities.length < PRIORITIES.length;
  // Moves made while filtered apply to the visible cards; hidden cards stay at the end of their column.
  const commitVisible = (next) =>
    setColumns(
      Object.fromEntries(
        Object.entries(next).map(([key, items]) => [key, [...items, ...columns[key].filter((item) => !priorities.includes(item.priority))]])
      )
    );
  const addIssue = () => {
    const count = Object.values(columns).flat().length;
    const id = `BUG-${480 + count}`;
    setColumns({ ...columns, open: [issue(id, 'Triage', 'P2', 'queued', 'New issue, needs a title', 'Nora Lee', 'person-23', 'No date', 0), ...columns.open] });
  };
  const share = () => copy('https://example.com/boards/issue-tracking');
  return (
    <div className='grid w-full gap-4'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h2 className='text-base font-semibold text-text'>Issue tracking</h2>
          <p className='text-sm text-text-muted'>Track ownership, severity, and release risk.</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <RegistryIcon lucide='FilterIcon' />
                Filters{filtered ? ` (${priorities.length})` : ''}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              {PRIORITIES.map((priority) => (
                <DropdownMenuCheckboxItem
                  key={priority}
                  checked={priorities.includes(priority)}
                  onCheckedChange={(checked) => setPriorities(checked ? [...priorities, priority] : priorities.filter((entry) => entry !== priority))}
                >
                  {priority}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant='outline' size='sm' onClick={share}>
            <RegistryIcon lucide='Share2Icon' />
            {copyError ? 'Retry copy' : 'Share'}
          </Button>
          <Button size='sm' onClick={addIssue}>
            <RegistryIcon lucide='PlusIcon' />
            New task
          </Button>
        </div>
      </div>
      <Kanban value={filtered ? visible : columns} onValueChange={filtered ? commitVisible : setColumns} getItemValue={(item) => item.id}>
        <KanbanBoard layout='scroll' aria-label='Issue tracking board'>
          {Object.entries(filtered ? visible : columns).map(([value, items]) => (
            <IssueColumn key={value} value={value} items={items} />
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          {({ value, variant }) => {
            if (variant === 'column') return <IssueColumn value={String(value)} items={columns[value] ?? []} isOverlay />;
            const item = Object.values(columns).flat().find((entry) => entry.id === value);
            return item ? <IssueCard item={item} isOverlay /> : null;
          }}
        </KanbanOverlay>
      </Kanban>
      <p role='status' className='text-xs text-text-muted'>{copyError ? 'Could not copy the board link. Try again.' : isCopied ? 'Board link copied.' : ''}</p>
      {filtered ? <p className='text-xs text-text-muted'>Showing {priorities.join(', ') || 'no'} issues.</p> : null}
    </div>
  );
}
