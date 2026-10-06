'use client';
import { useId, useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  Kanban,
  KanbanBoardPrimitive as KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnCount,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay
} from '@gaudi/design-system/core/KanbanBoard';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import { CheckboxRoot as Checkbox } from '@gaudi/design-system/core/Checkbox';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuCheckboxItemPrimitive as DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { Label } from '@gaudi/design-system/core/Field';
import {
  PopoverPrimitive as Popover,
  PopoverContentPrimitive as PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTriggerPrimitive as PopoverTrigger
} from '@gaudi/design-system/core/Popover';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { cn } from '@gaudi/design-system/utilities/cn';

// Release readiness: each change shows its risk, the service and environment it touches, its release
// window, the owner and a launch checklist. Tick checklist items from the card; filter by environment
// and release window; drag a change by its grip once it is ready to schedule.
const STAGES = {
  intake: { title: 'Intake', dot: 'bg-text-muted' },
  review: { title: 'Review needed', dot: 'bg-discovery' },
  blocked: { title: 'Blocked', dot: 'bg-danger' },
  scheduled: { title: 'Scheduled', dot: 'bg-text' }
};
const RISK = { Low: 'outline', Medium: 'discovery-light', High: 'warning-light', Critical: 'destructive-light' };
const SERVICE_ICON = { Checkout: 'CreditCardIcon', Identity: 'ShieldCheckIcon', Billing: 'FileTextIcon', Webhooks: 'WebhookIcon', Analytics: 'ActivityIcon' };
const CHECKS = ['Rollback plan', 'Feature flag', 'Load test', 'Runbook updated', 'On-call briefed'];
const WINDOWS = [
  ['all', 'All windows'],
  ['apr', 'April 30 – May 1'],
  ['may', 'May 2 – May 4']
];
const face = (portrait) => `/avatars/${portrait}.svg`;
const change = (id, risk, title, service, env, day, time, owner, portrait, done, total = 5) => ({
  id, risk, title, service, env, day, time, owner, avatar: face(portrait), checks: CHECKS.slice(0, total).map((label, index) => ({ label, done: index < done }))
});
const INITIAL = {
  intake: [
    change('REL-8429', 'Medium', 'Enable saved cards for guest checkout', 'Checkout', 'Production', 30, '20:00', 'Nina Santos', 'person-17', 1, 4),
    change('REL-8427', 'Low', 'Add resend controls to login recovery', 'Identity', 'Staging', 1, '16:30', 'Jonah Lee', 'person-38', 2, 4),
    change('REL-8425', 'Low', 'Log receipt resend events for admins', 'Billing', 'Staging', 1, '19:00', 'Theo Vincent', 'person-48', 1, 3)
  ],
  review: [
    change('REL-8421', 'Critical', 'Split EU checkout traffic by processor', 'Checkout', 'Production', 30, '22:00', 'Maya Patel', 'person-07', 2),
    change('REL-8418', 'High', 'Raise webhook retry ceiling for partners', 'Webhooks', 'Production', 1, '18:30', 'Kerem Haddadin', 'person-50', 3),
    change('REL-8417', 'High', 'Confirm processor failover limits', 'Checkout', 'Production', 1, '21:00', 'Priya Menon', 'person-21', 2)
  ],
  blocked: [
    change('REL-8416', 'High', 'Rotate signing keys for session tokens', 'Identity', 'Production', 2, '19:30', 'Priya Menon', 'person-21', 2, 4),
    change('REL-8413', 'Critical', 'Rebuild analytics partitions for exports', 'Analytics', 'Staging', 2, '23:00', 'Theo Vincent', 'person-48', 1)
  ],
  scheduled: [
    change('REL-8408', 'Medium', 'Move invoice workers to new queues', 'Billing', 'Staging', 3, '21:00', 'Theo Vincent', 'person-48', 4),
    change('REL-8405', 'Medium', 'Expand partner delivery event schema', 'Webhooks', 'Production', 4, '17:30', 'Kerem Haddadin', 'person-50', 3, 4),
    change('REL-8402', 'Medium', 'Reshard billing export queue', 'Billing', 'Production', 4, '23:00', 'Nina Santos', 'person-17', 3)
  ]
};
const dayLabel = (day) => (day === 30 ? 'Apr 30' : `May ${day}`);
const inWindow = (item, span) => span === 'all' || (span === 'apr' ? item.day === 30 || item.day === 1 : item.day >= 2 && item.day <= 4);
const BAR = (ratio, risk) =>
  ratio === 1 ? '*:data-[slot=progress-indicator]:bg-success' : risk === 'Critical' ? '*:data-[slot=progress-indicator]:bg-danger' : '*:data-[slot=progress-indicator]:bg-warning';

function Checklist({ item, onToggle }) {
  const id = useId();
  const done = item.checks.filter((check) => check.done).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='xs' className='-ms-1.5 text-text-muted' aria-label={`${item.id} checklist, ${done} of ${item.checks.length} done`}>
          <RegistryIcon lucide='ListChecksIcon' />
          Checklist
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-64'>
        <PopoverHeader>
          <PopoverTitle>{item.id} launch checklist</PopoverTitle>
        </PopoverHeader>
        <div className='grid gap-2'>
          {item.checks.map((check, index) => (
            <Label key={check.label} htmlFor={`${id}-${index}`} className='flex items-center gap-2 text-sm font-normal'>
              <Checkbox id={`${id}-${index}`} checked={check.done} onCheckedChange={() => onToggle(item.id, index)} />
              {check.label}
            </Label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ChangeCard({ item, onToggle, isOverlay }) {
  const done = item.checks.filter((check) => check.done).length;
  const ratio = done / item.checks.length;
  return (
    <KanbanItem value={item.id} withHandle>
      <div className='grid gap-2 rounded-lg border border-border bg-surface p-3 text-sm shadow-xs'>
        <div className='flex items-center gap-2 text-xs text-text-muted'>
          {isOverlay ? null : (
            <KanbanItemHandle asChild>
              <Button aria-label={`Move ${item.id}`} size='icon-xs' variant='ghost' className='-ms-1'>
                <RegistryIcon lucide='GripVerticalIcon' />
              </Button>
            </KanbanItemHandle>
          )}
          <span className='tabular-nums'>{item.id}</span>
          <Badge variant={RISK[item.risk]} size='sm' className='ms-auto'>{item.risk}</Badge>
        </div>
        <h4 className='font-medium text-text'>{item.title}</h4>
        <div className='grid gap-1.5 text-xs text-text-muted'>
          <span className='flex items-center gap-2'>
            <RegistryIcon lucide={SERVICE_ICON[item.service]} className='size-3.5' />
            <span className='text-text'>{item.service}</span>
            <Badge variant={item.env === 'Production' ? 'attention-light' : 'outline'} size='xs'>{item.env}</Badge>
          </span>
          <span className='flex items-center gap-2'>
            <RegistryIcon lucide='CalendarClockIcon' className='size-3.5' />
            <span className='tabular-nums'>{dayLabel(item.day)}, {item.time} UTC</span>
          </span>
          <span className='flex items-center gap-2 text-text'>
            <Avatar className='size-4'>
              <AvatarImage src={item.avatar} alt='' />
              <AvatarFallback>{item.owner.charAt(0)}</AvatarFallback>
            </Avatar>
            {item.owner}
          </span>
        </div>
        <div className='grid gap-1'>
          <div className='flex items-center justify-between text-xs text-text-muted'>
            {isOverlay ? <span>Checklist</span> : <Checklist item={item} onToggle={onToggle} />}
            <span className='tabular-nums'>
              {done}/{item.checks.length} · {Math.round(ratio * 100)}%
            </span>
          </div>
          <Progress value={ratio * 100} aria-label={`${item.id} checklist progress`} className={cn('h-1.5', BAR(ratio, item.risk))} />
        </div>
      </div>
    </KanbanItem>
  );
}

function StageColumn({ value, items, onToggle, isOverlay }) {
  const stage = STAGES[value];
  return (
    <KanbanColumn value={value} className='gap-2 rounded-xl border border-border bg-surface-muted p-2'>
      <div className='flex items-center gap-2 px-1'>
        <span className={cn('size-2 rounded-full', stage.dot)} aria-hidden='true' />
        <h3 className='text-sm font-medium text-text'>{stage.title}</h3>
        <KanbanColumnCount count={items.length} />
      </div>
      <KanbanColumnContent value={value} className='min-h-16'>
        {items.map((item) => (
          <ChangeCard key={item.id} item={item} onToggle={onToggle} isOverlay={isOverlay} />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

export function Pattern() {
  const [columns, setColumns] = useState(INITIAL);
  const [envs, setEnvs] = useState(['Production', 'Staging']);
  const [span, setSpan] = useState('all');
  const keep = (item) => envs.includes(item.env) && inWindow(item, span);
  const filtered = envs.length < 2 || span !== 'all';
  const visible = Object.fromEntries(Object.entries(columns).map(([key, items]) => [key, items.filter(keep)]));
  // Moves made while filtered apply to the visible changes; hidden ones keep their column.
  const commit = (next) => setColumns(Object.fromEntries(Object.entries(next).map(([key, items]) => [key, [...items, ...columns[key].filter((item) => !keep(item))]])));
  const toggle = (id, index) =>
    setColumns(
      Object.fromEntries(
        Object.entries(columns).map(([key, items]) => [
          key,
          items.map((item) => (item.id === id ? { ...item, checks: item.checks.map((check, at) => (at === index ? { ...check, done: !check.done } : check)) } : item))
        ])
      )
    );
  const value = filtered ? visible : columns;
  return (
    <div className='grid w-full gap-4'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h2 className='text-base font-semibold text-text'>Release readiness</h2>
          <p className='text-sm text-text-muted'>Readiness, risk, and launch checks.</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <RegistryIcon lucide='FilterIcon' />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Environment</DropdownMenuLabel>
              {['Production', 'Staging'].map((env) => (
                <DropdownMenuCheckboxItem key={env} checked={envs.includes(env)} onCheckedChange={(checked) => setEnvs(checked ? [...envs, env] : envs.filter((entry) => entry !== env))}>
                  {env}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <RegistryIcon lucide='CalendarClockIcon' />
                {WINDOWS.find(([key]) => key === span)[1]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Release window</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={span} onValueChange={setSpan}>
                {WINDOWS.map(([key, label]) => (
                  <DropdownMenuRadioItem key={key} value={key}>{label}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size='sm'
            onClick={() => setColumns({ ...columns, intake: [change(`REL-${8430 + Object.values(columns).flat().length}`, 'Low', 'New change request', 'Billing', 'Staging', 4, '12:00', 'Nina Santos', 'person-17', 0), ...columns.intake] })}
          >
            <RegistryIcon lucide='PlusIcon' />
            New change
          </Button>
        </div>
      </div>
      <Kanban value={value} onValueChange={filtered ? commit : setColumns} getItemValue={(item) => item.id}>
        <KanbanBoard layout='scroll' aria-label='Release readiness board'>
          {Object.entries(value).map(([key, items]) => (
            <StageColumn key={key} value={key} items={items} onToggle={toggle} />
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          {({ value: id, variant }) => {
            if (variant === 'column') return null;
            const item = Object.values(columns).flat().find((entry) => entry.id === id);
            return item ? <ChangeCard item={item} isOverlay /> : null;
          }}
        </KanbanOverlay>
      </Kanban>
    </div>
  );
}
