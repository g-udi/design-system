'use client';
import { useEffect, useState } from 'react';
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
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';

// Support escalations against their service levels. Each ticket counts down to its response target;
// the chip turns warning under three hours and danger under one, and the clock pauses while a ticket
// waits on the customer. Stages reorder by their handle.
const STAGES = {
  new: { title: 'New', icon: 'CircleDotIcon', tone: 'text-info' },
  reply: { title: 'Needs reply', icon: 'MessageSquareIcon', tone: 'text-discovery' },
  engineering: { title: 'Engineering', icon: 'WrenchIcon', tone: 'text-attention' },
  waiting: { title: 'Waiting on customer', icon: 'ClockIcon', tone: 'text-info', paused: true },
  risk: { title: 'SLA risk', icon: 'TriangleAlertIcon', tone: 'text-danger', frame: 'border-danger-border bg-danger-subtle' }
};
const PRIORITY = { Urgent: ['destructive-light', 'bg-danger'], High: ['warning-light', 'bg-warning'], Normal: ['info-light', 'bg-info'], Low: ['outline', 'bg-text-muted'] };
const face = (portrait) => `https://randomuser.me/api/portraits/${portrait}.jpg`;
const ticket = (id, priority, title, requester, company, owner, portrait, minutes) => ({ id, priority, title, requester, company, owner, avatar: face(portrait), minutes });
const INITIAL = {
  new: [
    ticket('SUP-10482', 'High', 'Export job stuck after regional data residency switch', 'Alicia Wong', 'Northstar Bio', 'Maya Ito', 'women/68', 105),
    ticket('SUP-10483', 'Normal', 'SSO group mapping not applying to new finance users', 'Jon Bell', 'Meridian Works', 'Omar Haddad', 'men/75', 200)
  ],
  reply: [
    ticket('SUP-10451', 'High', 'Workspace audit stream missing approval events', 'Sofia Klein', 'Aster Capital', 'Priya Shah', 'women/44', 52),
    ticket('SUP-10459', 'Normal', 'Billing contact cannot download April invoice bundle', 'Theo Martins', 'Civic Cloud', 'Marcus Chen', 'men/32', 245),
    ticket('SUP-10466', 'Low', 'Saved view permissions differ between parent and child spaces', 'Nina Patel', 'Harbor Grid', 'Elena Torres', 'women/21', 430)
  ],
  engineering: [
    ticket('SUP-10392', 'Urgent', 'Webhook retries duplicate seat change events', 'Iris Novak', 'LedgerPoint', 'Priya Shah', 'women/44', 36),
    ticket('SUP-10410', 'High', 'EU shard search results omit recently migrated projects', 'Mateo Ruiz', 'Atlas Legal', 'Omar Haddad', 'men/75', 135)
  ],
  waiting: [
    ticket('SUP-10437', 'Normal', 'Confirm SCIM token rotation window for APAC tenant', 'Grace Liu', 'Quantix Bank', 'Maya Ito', 'women/68', 300),
    ticket('SUP-10444', 'Low', 'Approve temporary allowlist for partner sandbox', 'Evan Brooks', 'Fieldstone Labs', 'Elena Torres', 'women/21', 520)
  ],
  risk: [
    ticket('SUP-10472', 'Urgent', 'Production admins locked out after enforced SAML change', 'Noah Grant', 'Summit Health', 'Marcus Chen', 'men/32', 18),
    ticket('SUP-10476', 'High', 'Regional failover report not visible to compliance team', 'Leah Stern', 'BluePeak Energy', 'Omar Haddad', 'men/75', 41)
  ]
};
const duration = (minutes) => (minutes >= 60 ? `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m` : `${minutes}m`);

function SlaChip({ minutes, paused }) {
  if (paused) {
    return (
      <Badge variant='outline' size='sm' className='gap-1'>
        <RegistryIcon lucide='CirclePauseIcon' className='size-3' />
        Paused
      </Badge>
    );
  }
  const variant = minutes <= 0 ? 'destructive' : minutes < 60 ? 'destructive-light' : minutes < 180 ? 'warning-light' : 'info-light';
  return (
    <Badge variant={variant} size='sm' className='gap-1 tabular-nums'>
      <RegistryIcon lucide='TimerIcon' className='size-3' />
      {minutes <= 0 ? 'Breached' : duration(minutes)}
      <span className='sr-only'>{minutes <= 0 ? ' past the response target' : ' left on the response target'}</span>
    </Badge>
  );
}

function TicketCard({ item, paused, isOverlay }) {
  const [badge, dot] = PRIORITY[item.priority];
  const body = (
    <div className={cn('grid gap-2 rounded-lg border bg-surface p-3 text-sm shadow-xs', !paused && item.minutes < 60 ? 'border-danger-border' : 'border-border')}>
      <div className='flex items-center gap-2 text-xs text-text-muted'>
        <span className='tabular-nums'>{item.id}</span>
        <Badge variant={badge} size='sm' className='ms-auto gap-1'>
          <span className={cn('size-1.5 rounded-full', dot)} aria-hidden='true' />
          {item.priority}
        </Badge>
      </div>
      <p className='line-clamp-2 font-medium text-text'>{item.title}</p>
      <p className='truncate text-xs text-text-muted'>
        {item.requester} at {item.company}
      </p>
      <div className='flex items-center gap-2 text-xs'>
        <Avatar className='size-5'>
          <AvatarImage src={item.avatar} alt='' />
          <AvatarFallback>{item.owner.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className='min-w-0 flex-1 truncate text-text'>{item.owner}</span>
        <SlaChip minutes={item.minutes} paused={paused} />
      </div>
    </div>
  );
  return <KanbanItem value={item.id}>{isOverlay ? body : <KanbanItemHandle>{body}</KanbanItemHandle>}</KanbanItem>;
}

function StageColumn({ value, items, onAdd, isOverlay }) {
  const stage = STAGES[value];
  return (
    <KanbanColumn value={value} className={cn('gap-2 rounded-xl border p-2', stage.frame ?? 'border-border bg-surface-muted')}>
      <div className='flex items-center gap-2 px-1'>
        <RegistryIcon lucide={stage.icon} className={cn('size-4', stage.tone)} />
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
          <TicketCard key={item.id} item={item} paused={stage.paused} isOverlay={isOverlay} />
        ))}
      </KanbanColumnContent>
      {isOverlay ? null : (
        <Button variant='ghost' size='sm' className='text-text-muted' onClick={() => onAdd(value)}>
          <RegistryIcon lucide='PlusIcon' />
          Add ticket
        </Button>
      )}
    </KanbanColumn>
  );
}

export function Pattern() {
  const [columns, setColumns] = useState(INITIAL);
  // One tick a minute; tickets waiting on the customer keep their remaining time.
  useEffect(() => {
    const timer = setInterval(() => {
      setColumns((current) =>
        Object.fromEntries(
          Object.entries(current).map(([key, items]) => [key, STAGES[key].paused ? items : items.map((item) => ({ ...item, minutes: item.minutes - 1 }))])
        )
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  const add = (value) =>
    setColumns({ ...columns, [value]: [...columns[value], ticket(`SUP-${10500 + Object.values(columns).flat().length}`, 'Normal', 'New ticket', 'Unassigned requester', 'New account', 'Maya Ito', 'women/68', 480)] });
  const atRisk = Object.entries(columns).flatMap(([key, items]) => (STAGES[key].paused ? [] : items)).filter((item) => item.minutes < 60).length;
  return (
    <div className='grid w-full gap-4'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h2 className='text-base font-semibold text-text'>Support escalations</h2>
          <p className='text-sm text-text-muted' role='status'>
            {atRisk} {atRisk === 1 ? 'ticket is' : 'tickets are'} under an hour from the response target.
          </p>
        </div>
        <Button variant='outline' size='sm' onClick={() => add('new')}>
          <RegistryIcon lucide='PlusIcon' />
          Ticket
        </Button>
      </div>
      <Kanban value={columns} onValueChange={setColumns} getItemValue={(item) => item.id}>
        <KanbanBoard layout='scroll' aria-label='Support escalations board'>
          {Object.entries(columns).map(([value, items]) => (
            <StageColumn key={value} value={value} items={items} onAdd={add} />
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          {({ value, variant }) => {
            if (variant === 'column') return <StageColumn value={String(value)} items={columns[value] ?? []} isOverlay />;
            const entry = Object.entries(columns).find(([, items]) => items.some((item) => item.id === value));
            const item = entry?.[1].find((candidate) => candidate.id === value);
            return item ? <TicketCard item={item} paused={STAGES[entry[0]].paused} isOverlay /> : null;
          }}
        </KanbanOverlay>
      </Kanban>
    </div>
  );
}
