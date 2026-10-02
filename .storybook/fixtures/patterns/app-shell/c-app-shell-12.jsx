'use client';
import { useMemo, useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { Sidebar, SidebarProvider, SidebarTrigger, useSidebar } from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { AppShellBody, AppShellFrame, AppShellHeader, AppShellPanel } from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { AppShellPlaceholderGrid } from '../../../../src/components/blocks/AppShell/parts/placeholder.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const sections = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'routes', label: 'Routes', icon: 'Map' },
  { id: 'robots', label: 'Robots', icon: 'Bot' },
  { id: 'cargo', label: 'Cargo', icon: 'Boxes' },
  { id: 'zones', label: 'Zones', icon: 'MapPinned' },
  { id: 'missions', label: 'Missions', icon: 'ClipboardList' }
];
const tools = [
  { id: 'telemetry', label: 'Telemetry', icon: 'SquareActivity' },
  { id: 'access-keys', label: 'Access Keys', icon: 'KeyRound' },
  { id: 'compliance', label: 'Compliance', icon: 'ShieldCheck' },
  { id: 'calibration', label: 'Calibration', icon: 'SquareDashedMousePointer' }
];
const operator = { name: 'Sienna Wells', email: 'sienna@nimbusfleet.io', photo: 'https://randomuser.me/api/portraits/women/65.jpg' };
const crew = {
  mark: { name: 'Mark', photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
  chris: { name: 'Chris', photo: 'https://randomuser.me/api/portraits/men/75.jpg' }
};
// Robots have no portrait: a toned tile with the bot glyph stands in.
const robotTones = {
  meow: 'bg-warning/15 text-ui-warning-ink',
  dock: 'bg-attention/15 text-ui-attention-ink',
  pip: 'bg-success/15 text-ui-success-ink',
  humble: 'bg-info/15 text-ui-info-ink',
  kiko: 'bg-discovery/15 text-ui-discovery-ink'
};
const status = {
  ontime: { label: 'On time', variant: 'success-light' },
  late: { label: 'Running late', variant: 'warning-light', icon: 'Clock' },
  failed: { label: 'Failed', variant: 'destructive-light', icon: 'ShieldAlert' }
};
// Active assignments in dispatch order; each carries its mission detail and event feed.
const assignments = [
  {
    id: 'meow',
    name: 'Meow S025',
    status: 'ontime',
    open: 'mission',
    eta: '12m',
    distance: '1.9km',
    battery: '88%',
    state: 'Delivering',
    events: [
      { time: '15:02', label: 'Cargo scanned', icon: 'ScanSearch', units: '9/9 units' },
      { time: '15:09', label: 'Checkpoint reached', icon: 'UserRound', zone: 'A' }
    ]
  },
  {
    id: 'dock',
    name: 'Dock C112',
    status: 'late',
    open: 'mission',
    eta: '24m',
    distance: '3.8km',
    battery: '76%',
    state: 'Checking',
    crew: 'mark',
    events: [
      { time: '15:05', label: 'Cargo scanned', icon: 'ScanSearch', units: '18/18 units' },
      { time: '15:13', label: 'Delay detected', icon: 'Clock', delay: '+6 min' },
      { time: '15:15', label: 'Checkpoint reached', icon: 'UserRound', zone: 'B' },
      { time: '15:17', label: 'Route changed by', crew: 'chris' },
      { time: '15:18', label: 'Battery dropped', icon: 'Zap', bars: 3 }
    ]
  },
  {
    id: 'pip',
    name: 'Pip W92',
    status: 'ontime',
    open: 'mission',
    eta: '18m',
    distance: '2.6km',
    battery: '81%',
    state: 'Delivering',
    events: [
      { time: '14:58', label: 'Cargo scanned', icon: 'ScanSearch', units: '12/12 units' },
      { time: '15:11', label: 'Checkpoint reached', icon: 'UserRound', zone: 'J' }
    ]
  },
  {
    id: 'humble',
    name: 'Humble P028',
    status: 'failed',
    open: 'fullscreen',
    eta: '41m',
    distance: '1.2km',
    battery: '34%',
    state: 'Stalled',
    crew: 'mark',
    events: [
      { time: '14:44', label: 'Delay detected', icon: 'Clock', delay: '+14 min' },
      { time: '15:01', label: 'Battery dropped', icon: 'Zap', bars: 2 }
    ]
  },
  {
    id: 'kiko',
    name: 'Kiko B17',
    status: 'ontime',
    open: 'fullscreen',
    eta: '9m',
    distance: '1.4km',
    battery: '93%',
    state: 'Loading',
    events: [{ time: '15:16', label: 'Cargo loading', icon: 'Package', units: '4/11 units' }]
  }
];
const scheduled = [
  { id: 'kiko', name: 'Kiko B17', time: '16:20', zone: 'Zone D' },
  { id: 'meow', name: 'Meow S025', time: '16:45', zone: 'Zone A' },
  { id: 'pip', name: 'Pip W92', time: '17:10', zone: 'Zone F' }
];
const totals = [
  { id: 'scheduled', label: 'Scheduled', count: 38, tone: 'bg-info' },
  { id: 'active', label: 'Active', count: 5, tone: 'bg-success' },
  { id: 'paused', label: 'Paused', count: 12, tone: 'bg-warning/60' },
  { id: 'failed', label: 'Failed', count: 3, tone: 'bg-ui-destructive/50' }
];
const stats = [
  { label: 'Order Value', value: '$12.8k' },
  { label: 'Avg. Run', value: '32 min' },
  { label: 'On Time', value: '68%' },
  { label: 'Zones', value: '28' }
];
const scopes = ['Across All Robots', 'Active Only', 'Charging', 'Offline'];
const missions = (count) => `${count} ${count === 1 ? 'Mission' : 'Missions'}`;
const noop = (event) => event.preventDefault();

function RobotAvatar({ id }) {
  return (
    <Avatar className='size-6'>
      <AvatarFallback className={robotTones[id]}>
        <RegistryIcon lucide='Bot' aria-hidden='true' className='size-3.5' />
      </AvatarFallback>
    </Avatar>
  );
}

function CrewBadge({ id }) {
  const person = crew[id];
  return (
    <Badge variant='outline' size='sm' className='h-4.5 gap-1 ps-0.5 font-medium'>
      <Avatar className='size-3.5'>
        <AvatarImage src={person.photo} alt='' />
        <AvatarFallback>{person.name[0]}</AvatarFallback>
      </Avatar>
      {person.name}
    </Badge>
  );
}

/** One tick per mission, coloured by state: a compact distribution of the whole queue. */
function MissionTicks() {
  const total = totals.reduce((sum, entry) => sum + entry.count, 0);
  return (
    <div className='grid gap-1.5'>
      <div
        role='img'
        aria-label={`${total} missions: ${totals.map((entry) => `${entry.count} ${entry.label.toLowerCase()}`).join(', ')}`}
        className='flex h-3.5 items-stretch justify-between gap-px'
      >
        {totals.flatMap((entry) =>
          Array.from({ length: entry.count }, (_, index) => <span key={`${entry.id}-${index}`} className={`max-w-0.75 min-w-px flex-1 ${entry.tone}`} />)
        )}
      </div>
      <ul className='flex flex-wrap gap-x-3 gap-y-1 text-xs'>
        {totals.map((entry) => (
          <li key={entry.id} className='text-text-muted flex items-center gap-1 font-medium'>
            <span aria-hidden='true' className={`h-2.5 w-0.75 ${entry.tone}`} />
            <span className='tabular-nums'>{entry.count}</span> {entry.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatStrip({ compact }) {
  return (
    <dl
      className={`grid rounded-(--ds-radius-card) border border-ui-border bg-surface-muted px-1 py-1.5 ${compact ? 'grid-cols-2 gap-y-1.5' : 'grid-cols-4'}`}
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`flex flex-col-reverse items-center text-center ${!compact && index ? 'border-s border-ui-border' : ''}`}
        >
          <dt className='text-text-muted text-[10px] leading-3.5'>{stat.label}</dt>
          <dd className='text-xs font-medium tabular-nums'>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A collapsible queue: title, count, View All and a chevron toggle. */
function QueueSection({ id, title, count, open, onOpenChange, compact, children }) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} asChild>
      <section aria-labelledby={`mission-queue-${id}`} className='border-t border-ui-border py-3 first:border-t-0 first:pt-0'>
        <div className='flex items-center gap-2'>
          <h3 id={`mission-queue-${id}`} className='truncate text-sm font-medium'>
            {title}
          </h3>
          <Badge variant='outline' size='sm' className='font-medium'>
            {compact ? count : missions(count)}
          </Badge>
          <Button asChild variant='outline' size={compact ? 'icon-xs' : 'xs'} className='ms-auto'>
            <a href={`#${id}`} aria-label={`View all ${title.toLowerCase()}`} onClick={noop}>
              {compact ? <RegistryIcon lucide='Eye' aria-hidden='true' /> : 'View All'}
            </a>
          </Button>
          <CollapsibleTrigger asChild>
            <Button variant='outline' size='icon-xs' aria-label={`${open ? 'Collapse' : 'Expand'} ${title.toLowerCase()}`}>
              <RegistryIcon
                lucide='ChevronDown'
                aria-hidden='true'
                className={`transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className='pt-3'>{children}</CollapsibleContent>
      </section>
    </Collapsible>
  );
}

function BatteryBars({ filled, total = 7 }) {
  return (
    <span role='img' aria-label={`Battery at ${filled} of ${total} bars`} className='flex items-center gap-0.75'>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={`h-3 w-0.75 ${index < filled ? 'bg-success' : 'bg-success/30'}`} />
      ))}
    </span>
  );
}

function EventFeed({ events, compact }) {
  return (
    <ol
      aria-label='Mission events'
      className='relative grid gap-3 ps-3.5 before:absolute before:inset-y-1 before:start-0.75 before:w-px before:bg-ui-border'
    >
      {events.map((event) => (
        <li key={event.time} className='relative flex min-h-4 items-center gap-2 text-xs'>
          <span aria-hidden='true' className='bg-text-muted/40 absolute -start-3.25 size-1.5 rounded-full' />
          <time className='text-text-muted w-8 shrink-0 tabular-nums'>{event.time}</time>
          <span aria-hidden='true' className='text-text-muted/60'>
            •
          </span>
          <span className='flex min-w-0 items-center gap-1'>
            <span className={compact ? 'whitespace-normal' : 'truncate'}>{event.label}</span>
            {event.icon ? <RegistryIcon lucide={event.icon} aria-hidden='true' className='text-text-muted size-3.5 shrink-0' /> : null}
            {event.crew ? <CrewBadge id={event.crew} /> : null}
          </span>
          <span className='ms-auto flex shrink-0 items-center'>
            {event.units ? <span className='text-text-muted text-[10px] leading-none'>{event.units}</span> : null}
            {event.delay ? (
              <Badge variant='warning-light' size='xs'>
                {event.delay}
              </Badge>
            ) : null}
            {event.zone ? (
              <Badge variant='outline' size='sm' className='gap-1 font-medium'>
                <RegistryIcon lucide='Grid2x2' aria-hidden='true' />
                <span className={compact ? 'sr-only' : undefined}>Zone</span> {event.zone}
              </Badge>
            ) : null}
            {event.bars ? <BatteryBars filled={event.bars} /> : null}
          </span>
        </li>
      ))}
    </ol>
  );
}

function AssignmentRow({ robot, expanded, onToggle, compact }) {
  const tone = status[robot.status];
  const detailId = `mission-detail-${robot.id}`;
  return (
    <li className='border-b border-dashed border-ui-border py-2.5 first:pt-0 last:border-b-0 last:pb-0'>
      <div className='flex items-center gap-1.5'>
        <RobotAvatar id={robot.id} />
        <span className='truncate text-xs font-medium'>{robot.name}</span>
        <Badge variant={tone.variant} size='xs' className='gap-0.5'>
          {tone.icon ? <RegistryIcon lucide={tone.icon} aria-hidden='true' /> : null}
          <span className={tone.icon ? '@max-[15rem]/missions:sr-only' : undefined}>{tone.label}</span>
        </Badge>
        <Button asChild variant='outline' size='icon-xs' className='ms-auto'>
          <a
            href={`#mission-${robot.id}`}
            aria-label={robot.open === 'fullscreen' ? `Track ${robot.name} fullscreen` : `Open ${robot.name} mission`}
            onClick={noop}
          >
            <RegistryIcon lucide={robot.open === 'fullscreen' ? 'Maximize2' : 'ArrowUpRight'} aria-hidden='true' />
          </a>
        </Button>
        <Button
          variant='outline'
          size='icon-xs'
          aria-expanded={expanded}
          aria-controls={expanded ? detailId : undefined}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${robot.name} detail`}
          onClick={onToggle}
        >
          <RegistryIcon
            lucide='ChevronDown'
            aria-hidden='true'
            className={`transition-transform duration-200 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
          />
        </Button>
      </div>
      {expanded ? (
        <div id={detailId} className='grid gap-3 pt-2.5'>
          <dl className='flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-medium'>
            {[
              ['Time left', 'Clock', robot.eta],
              ['Distance', 'Route', robot.distance],
              ['Battery', 'Smartphone', robot.battery]
            ].map(([label, icon, value]) => (
              <div key={label} className='flex items-center gap-1 after:ms-1 after:h-3 after:w-px after:bg-ui-border'>
                <dt className='text-text-muted'>
                  <RegistryIcon lucide={icon} aria-label={label} className='size-3.5' />
                </dt>
                <dd className='tabular-nums'>{value}</dd>
              </div>
            ))}
            <div className='flex min-w-0 items-center gap-1.5'>
              <dt className='text-text-muted'>
                <RegistryIcon lucide='Settings2' aria-label='State' className='size-3.5' />
              </dt>
              <dd className='flex min-w-0 items-center gap-1'>
                <span className={compact ? 'sr-only' : 'truncate'}>{robot.state}</span>
                {robot.crew ? <CrewBadge id={robot.crew} /> : null}
              </dd>
            </div>
          </dl>
          <EventFeed events={robot.events} compact={compact} />
          <Button asChild variant='outline' size='xs' className='w-full'>
            <a href={`#track-${robot.id}`} aria-label={`Track ${robot.name} mission`} onClick={noop}>
              <RegistryIcon lucide='MapPinned' aria-hidden='true' />
              Track Mission
            </a>
          </Button>
        </div>
      ) : null}
    </li>
  );
}

function EmptyPanel({ icon, title, children }) {
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-1 rounded-(--ds-radius-card) border border-ui-border px-6 text-center'>
      <span
        aria-hidden='true'
        className='bg-surface-muted mb-2 grid size-8 place-items-center rounded-(--ds-radius-control) border border-ui-border'
      >
        <RegistryIcon lucide={icon} className='size-4' />
      </span>
      <h3 className='text-sm font-medium'>{title}</h3>
      <p className='text-text-muted max-w-52 text-sm'>{children}</p>
    </div>
  );
}

function RobotManagement({ query }) {
  const { isMobile: compact } = useSidebar();
  const [open, setOpen] = useState({ scheduled: false, active: true, paused: false, failed: false });
  const [expanded, setExpanded] = useState('dock');
  const [sort, setSort] = useState('dispatch');
  const toggle = (id) => (value) => setOpen((state) => ({ ...state, [id]: value }));
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = assignments.filter((robot) => robot.name.toLowerCase().includes(term));
    return sort === 'name' ? [...list].sort((a, b) => a.name.localeCompare(b.name)) : list;
  }, [query, sort]);
  return (
    <div className='flex min-h-0 flex-1 flex-col rounded-(--ds-radius-card) border border-ui-border bg-surface-muted/60'>
      <div className='flex items-center gap-2 px-4 py-2'>
        <h3 className='min-w-0 flex-1 truncate text-sm font-medium'>Robot Management</h3>
        <Button asChild variant='outline' size={compact ? 'icon-sm' : 'sm'}>
          <a href='#onboarding' aria-label={compact ? 'Onboarding' : undefined} onClick={noop}>
            <RegistryIcon lucide='Bot' aria-hidden='true' />
            {compact ? null : 'Onboarding'}
          </a>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon-sm' aria-label='Sort assignments'>
              <RegistryIcon lucide='Settings2' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-44'>
            <DropdownMenuLabel>Sort Assignments</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              <DropdownMenuRadioItem value='dispatch'>Dispatch Order</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='name'>By Name</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='bg-surface -mx-px flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain rounded-(--ds-radius-card) border border-ui-border px-4 pt-4 pb-3'>
        <MissionTicks />
        <StatStrip compact={compact} />
        <div>
          <QueueSection
            id='scheduled'
            title='Scheduled'
            count={38}
            open={open.scheduled}
            onOpenChange={toggle('scheduled')}
            compact={compact}
          >
            <ul className='grid gap-2.5'>
              {scheduled.map((robot) => (
                <li key={robot.id} className='flex items-center gap-1.5 text-xs'>
                  <RobotAvatar id={robot.id} />
                  <span className='truncate font-medium'>{robot.name}</span>
                  <Badge variant='outline' size='xs' className='text-[10px]'>
                    Queued
                  </Badge>
                  <span className='text-text-muted ms-auto flex shrink-0 items-center gap-2 tabular-nums'>
                    {robot.time}
                    <span aria-hidden='true'>•</span>
                    {robot.zone}
                  </span>
                </li>
              ))}
            </ul>
          </QueueSection>
          <QueueSection
            id='active'
            title='Active Assignments'
            count={visible.length}
            open={open.active}
            onOpenChange={toggle('active')}
            compact={compact}
          >
            {visible.length ? (
              <ul>
                {visible.map((robot) => (
                  <AssignmentRow
                    key={robot.id}
                    robot={robot}
                    compact={compact}
                    expanded={expanded === robot.id}
                    onToggle={() => setExpanded((current) => (current === robot.id ? null : robot.id))}
                  />
                ))}
              </ul>
            ) : (
              <div role='status' className='grid gap-1 py-4 text-center'>
                <p className='text-sm font-medium'>No Robots Match</p>
                <p className='text-text-muted text-xs'>Clear the search to see every active assignment.</p>
              </div>
            )}
          </QueueSection>
          <QueueSection id='paused' title='Paused' count={12} open={open.paused} onOpenChange={toggle('paused')} compact={compact}>
            <p className='text-text-muted text-xs'>Paused missions resume from the depot queue.</p>
          </QueueSection>
          <QueueSection id='failed' title='Failed' count={3} open={open.failed} onOpenChange={toggle('failed')} compact={compact}>
            <p className='text-text-muted text-xs'>Failed missions wait for operator review.</p>
          </QueueSection>
        </div>
      </div>
      <div className='flex items-center gap-2 px-4 py-2.5'>
        <Button asChild variant='solid' tone='neutral' size='sm' className='flex-1'>
          <a href='#review' aria-label='Review all assignments' onClick={noop}>
            <RegistryIcon lucide='ClipboardList' aria-hidden='true' />
            Review Assignments
          </a>
        </Button>
        <Button asChild variant='outline' size={compact ? 'icon-sm' : 'sm'}>
          <a href='#activity' aria-label={compact ? 'Activity' : undefined} onClick={noop}>
            <RegistryIcon lucide='History' aria-hidden='true' />
            {compact ? null : 'Activity'}
          </a>
        </Button>
      </div>
    </div>
  );
}

function RailButton({ item, current, onSelect }) {
  const { isMobile } = useSidebar();
  const button = (
    <Button
      variant='ghost'
      size='icon-sm'
      aria-label={item.label}
      aria-current={current ? 'page' : undefined}
      onClick={() => onSelect(item.id)}
      className={current ? 'bg-text text-surface hover:bg-text hover:text-surface' : 'text-text-muted'}
    >
      <RegistryIcon lucide={item.icon} aria-hidden='true' />
    </Button>
  );
  // In the phone sheet the rail is focused on open, so it names items without tooltips.
  if (isMobile) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side='right'>{item.label}</TooltipContent>
    </Tooltip>
  );
}

function RailMenu({ label, icon, children }) {
  const { isMobile } = useSidebar();
  const trigger = (
    <DropdownMenuTrigger asChild>
      <Button variant='ghost' size='icon-sm' aria-label={label} className='text-text-muted data-[state=open]:bg-surface-muted'>
        <RegistryIcon lucide={icon} aria-hidden='true' />
      </Button>
    </DropdownMenuTrigger>
  );
  return (
    <DropdownMenu>
      {isMobile ? (
        trigger
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent side='right'>{label}</TooltipContent>
        </Tooltip>
      )}
      <DropdownMenuContent side='right' align='end' sideOffset={8} className='w-48'>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileMenu() {
  const [theme, setTheme] = useState('system');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label={`Open profile for ${operator.name}`} className='p-0'>
          <Avatar className='size-7'>
            <AvatarImage src={operator.photo} alt='' />
            <AvatarFallback>SW</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' align='end' sideOffset={8} className='w-56'>
        <DropdownMenuLabel className='flex items-center gap-2 font-normal'>
          <Avatar className='size-8'>
            <AvatarImage src={operator.photo} alt='' />
            <AvatarFallback>SW</AvatarFallback>
          </Avatar>
          <span className='grid min-w-0 leading-tight'>
            <span className='truncate font-medium'>{operator.name}</span>
            <span className='text-text-muted truncate text-xs'>{operator.email}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <RegistryIcon lucide='User' aria-hidden='true' />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='Lock' aria-hidden='true' />
            Sign-In Security
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='Bell' aria-hidden='true' />
            Alert Routing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='Settings' aria-hidden='true' />
            Preferences
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <RegistryIcon lucide='CalendarClock' aria-hidden='true' />
            Shift Roster
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='UserPlus' aria-hidden='true' />
            Invite Operator
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div role='group' aria-label='Theme' className='flex items-center gap-2 px-2 py-1 text-sm'>
          <RegistryIcon lucide='Palette' aria-hidden='true' className='text-text-muted size-4' />
          <span aria-hidden='true'>Theme</span>
          <span className='bg-surface-muted ms-auto flex items-center gap-0.5 rounded-(--ds-radius-control) p-0.5'>
            {[
              ['light', 'Sun', 'Light theme'],
              ['dark', 'Moon', 'Dark theme'],
              ['system', 'Monitor', 'System theme']
            ].map(([value, icon, label]) => (
              <DropdownMenuItem
                key={value}
                role='menuitemradio'
                aria-checked={theme === value}
                aria-label={label}
                onSelect={(event) => {
                  event.preventDefault();
                  setTheme(value);
                }}
                className={`size-6 justify-center p-0 ${theme === value ? 'bg-surface shadow-xs' : ''}`}
              >
                <RegistryIcon lucide={icon} aria-hidden='true' className='size-3.5' />
              </DropdownMenuItem>
            ))}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RegistryIcon lucide='LogOut' aria-hidden='true' />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Rail({ section, onSection }) {
  return (
    <div className='flex w-13 shrink-0 flex-col items-center gap-3 py-3'>
      <a
        href='#home'
        aria-label='Nimbus Fleet home'
        onClick={noop}
        className='grid size-7 place-items-center rounded-(--ds-radius-control) border border-ui-border outline-hidden focus-visible:ring-2 focus-visible:ring-ui-ring'
      >
        <RegistryIcon lucide='Command' aria-hidden='true' className='size-4' />
      </a>
      <nav aria-label='Sections' className='flex flex-1 flex-col items-center gap-2'>
        {sections.map((item) => (
          <RailButton key={item.id} item={item} current={section === item.id} onSelect={onSection} />
        ))}
        <Separator className='my-0.5 w-5' />
        {tools.map((item) => (
          <RailButton key={item.id} item={item} current={section === item.id} onSelect={onSection} />
        ))}
      </nav>
      <div className='flex flex-col items-center gap-2'>
        <RailMenu label='Help and support' icon='CircleHelp'>
          <DropdownMenuItem>
            Documentation
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard Shortcuts
            <DropdownMenuShortcut>⌘/</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Contact Support</DropdownMenuItem>
        </RailMenu>
        <RailMenu label='Workspace settings' icon='Settings'>
          <DropdownMenuLabel>Workspace</DropdownMenuLabel>
          <DropdownMenuItem>Fleet Defaults</DropdownMenuItem>
          <DropdownMenuItem>Robot Profiles</DropdownMenuItem>
          <DropdownMenuItem>API Tokens</DropdownMenuItem>
        </RailMenu>
        <ProfileMenu />
      </div>
    </div>
  );
}

const tabTrigger =
  'h-6 flex-none rounded-(--ds-radius-control) px-2 text-xs data-[state=active]:border-ui-border data-[state=active]:bg-surface data-[state=active]:shadow-xs';

function MissionsPanel({ query }) {
  return (
    <div className='@container/missions flex min-w-0 flex-1 flex-col gap-3 py-3 pe-3'>
      <h2 className='flex h-8 items-center px-4 text-base font-medium'>Mission Control Center</h2>
      <Tabs defaultValue='robots' className='min-h-0 flex-1 gap-3'>
        <TabsList
          variant='outline'
          aria-label='Mission views'
          className='bg-surface-muted h-7 w-full justify-start gap-0 rounded-(--ds-radius-control) border border-ui-border p-0'
        >
          {['Missions', 'Robots', 'Stations', 'Alerts'].map((tab) => (
            <TabsTrigger key={tab} value={tab.toLowerCase()} className={tabTrigger}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value='missions' className='flex min-h-0 flex-1 flex-col'>
          <EmptyPanel icon='ClipboardList' title='Queue Staged'>
            Scheduled missions are staged under the Robots view.
          </EmptyPanel>
        </TabsContent>
        <TabsContent value='robots' className='flex min-h-0 flex-1 flex-col'>
          <RobotManagement query={query} />
        </TabsContent>
        <TabsContent value='stations' className='flex min-h-0 flex-1 flex-col'>
          <EmptyPanel icon='MapPin' title='All Stations Nominal'>
            Charging docks and stations report no faults this shift.
          </EmptyPanel>
        </TabsContent>
        <TabsContent value='alerts' className='flex min-h-0 flex-1 flex-col'>
          <EmptyPanel icon='ShieldAlert' title='Incidents Routed'>
            Robot incidents surface directly on their mission cards.
          </EmptyPanel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SearchBar({ query, onQuery, scope, onScope }) {
  return (
    <InputGroup className='h-8 max-w-lg min-w-0 flex-1'>
      <InputGroupAddon>
        <RegistryIcon lucide='Search' aria-hidden='true' />
      </InputGroupAddon>
      <InputGroupInput
        type='search'
        aria-label='Search robots'
        placeholder='Enter Robot SKV or Nickname'
        className='@max-md:placeholder:text-transparent'
        value={query}
        onChange={(event) => onQuery(event.target.value)}
      />
      <InputGroupAddon align='inline-end'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton variant='soft' aria-label={`Search scope: ${scope}`} className='gap-1'>
              <RegistryIcon lucide='Bot' aria-hidden='true' />
              <span className='@max-3xl:hidden'>{scope}</span>
              <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='opacity-60' />
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-40'>
            <DropdownMenuRadioGroup value={scope} onValueChange={onScope}>
              {scopes.map((entry) => (
                <DropdownMenuRadioItem key={entry} value={entry}>
                  {entry}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>
  );
}

function PreferencesMenu() {
  const [insights, setInsights] = useState(true);
  const [battery, setBattery] = useState(true);
  const [workspace, setWorkspace] = useState('nimbus');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon-sm' aria-label='Workspace preferences'>
          <RegistryIcon lucide='Settings' aria-hidden='true' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-52'>
        <DropdownMenuLabel>Preferences</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={insights} onCheckedChange={setInsights}>
          AI Insights
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={battery} onCheckedChange={setBattery}>
          Battery Alerts
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={workspace} onValueChange={setWorkspace}>
          <DropdownMenuRadioItem value='nimbus'>Nimbus Fleet</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='harbor'>Harbor Depot</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TopBar({ query, onQuery }) {
  const { isMobile } = useSidebar();
  const [scope, setScope] = useState(scopes[0]);
  return (
    <AppShellHeader className='gap-2 px-3'>
      {isMobile ? (
        <>
          <SidebarTrigger className='-ms-1' />
          <span
            aria-hidden='true'
            className='grid size-7 shrink-0 place-items-center rounded-(--ds-radius-control) border border-ui-border'
          >
            <RegistryIcon lucide='Command' className='size-4' />
          </span>
        </>
      ) : null}
      <SearchBar query={query} onQuery={onQuery} scope={scope} onScope={setScope} />
      <div className='ms-auto flex shrink-0 items-center gap-2'>
        <Button asChild variant='solid' tone='neutral' size='sm' className='@max-3xl:size-7 @max-3xl:p-0'>
          <a href='#new-mission' aria-label='Create new mission' onClick={noop}>
            <RegistryIcon lucide='Plus' aria-hidden='true' />
            <span className='@max-3xl:hidden'>New Mission</span>
          </a>
        </Button>
        <Button asChild variant='outline' size='sm' className='@max-3xl:size-7 @max-3xl:p-0'>
          <a href='#ask-ai' aria-label='Ask AI about the fleet' onClick={noop}>
            <RegistryIcon lucide='Sparkles' aria-hidden='true' />
            <span className='@max-3xl:hidden'>Ask AI</span>
          </a>
        </Button>
        <PreferencesMenu />
      </div>
    </AppShellHeader>
  );
}

export function Pattern() {
  const [section, setSection] = useState('robots');
  const [query, setQuery] = useState('');
  return (
    <AppShellFrame surface='default' compactBelow={720}>
      {/* The rail and the missions panel are one sidebar: docked beside the page, one sheet in a narrow frame. */}
      <SidebarProvider shortcut={false} style={{ '--sidebar-width': '27.25rem' }}>
        <Sidebar
          mobileWidth='24rem'
          mobileClassName='max-w-[calc(100%-1rem)]'
          mobileTitle='Mission Control'
          mobileDescription='Sections and the missions panel.'
        >
          <div className='bg-surface flex h-full min-h-0'>
            <Rail section={section} onSection={setSection} />
            <MissionsPanel query={query} />
          </div>
        </Sidebar>
        <AppShellPanel inset={false} className='border-s-0'>
          <TopBar query={query} onQuery={setQuery} />
          <AppShellBody className='px-3 pb-3'>
            <AppShellPlaceholderGrid preset='stack' variant='solid' />
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
