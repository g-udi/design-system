'use client';
import { GaudiLogo } from '@gaudi/design-system/icons/brands/gaudi';
import { useMemo, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system/core/Accordion';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuCheckboxItemPrimitive as DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
import { Separator } from '@gaudi/design-system/core/Separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { TooltipRoot as Tooltip, TooltipContent, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
import { Sidebar, SidebarProvider, SidebarTrigger, useSidebar } from '@gaudi/design-system/blocks/AppShell';
import { AppShellBody, AppShellFrame, AppShellHeader, AppShellPanel } from '@gaudi/design-system/blocks/AppShell';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const sections = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'sources', label: 'Sources', icon: 'Globe' },
  { id: 'crawlers', label: 'Crawlers', icon: 'Workflow' },
  { id: 'library', label: 'Library', icon: 'Library' },
  { id: 'topics', label: 'Topics', icon: 'Tags' },
  { id: 'runs', label: 'Runs', icon: 'ClipboardList' }
];
const tools = [
  { id: 'logs', label: 'Logs', icon: 'SquareActivity' },
  { id: 'access-keys', label: 'Access Keys', icon: 'KeyRound' },
  { id: 'capture-rules', label: 'Capture Rules', icon: 'ShieldCheck' },
  { id: 'selectors', label: 'Selectors', icon: 'SquareDashedMousePointer' }
];
const curator = { name: 'Ines Duarte', email: 'ines@gaudi.page', photo: '/avatars/person-23.svg' };
const crew = {
  omar: { name: 'Omar', photo: '/avatars/person-41.svg' },
  theo: { name: 'Theo', photo: '/avatars/person-50.svg' }
};
// Sources have no portrait: a toned tile with the source glyph stands in.
const sourceTiles = {
  essays: { tone: 'bg-warning/15 text-ui-warning-ink', icon: 'BookText' },
  archive: { tone: 'bg-attention/15 text-ui-attention-ink', icon: 'Archive' },
  preprints: { tone: 'bg-success/15 text-ui-success-ink', icon: 'FileSearch' },
  podcasts: { tone: 'bg-info/15 text-ui-info-ink', icon: 'Podcast' },
  design: { tone: 'bg-discovery/15 text-ui-discovery-ink', icon: 'Globe' }
};
const status = {
  healthy: { label: 'Healthy', variant: 'success-light' },
  throttled: { label: 'Throttled', variant: 'warning-light', icon: 'Clock' },
  blocked: { label: 'Blocked', variant: 'destructive-light', icon: 'ShieldAlert' }
};
// Active capture runs in queue order; each carries its run detail and event feed.
const runs = [
  {
    id: 'essays',
    name: 'Essays feed',
    status: 'healthy',
    open: 'source',
    eta: '12m',
    pages: '184',
    quota: '88%',
    state: 'Summarizing',
    events: [
      { time: '15:02', label: 'Pages fetched', icon: 'Download', units: '9/9 pages' },
      { time: '15:09', label: 'Filed to shelf', icon: 'Library', shelf: 'A' }
    ]
  },
  {
    id: 'archive',
    name: 'City archive',
    status: 'throttled',
    open: 'source',
    eta: '24m',
    pages: '1.2k',
    quota: '76%',
    state: 'Deduplicating',
    crew: 'omar',
    events: [
      { time: '15:05', label: 'Pages fetched', icon: 'Download', units: '18/18 pages' },
      { time: '15:13', label: 'Rate limit hit', icon: 'Clock', delay: '+6 min' },
      { time: '15:15', label: 'Filed to shelf', icon: 'Library', shelf: 'B' },
      { time: '15:17', label: 'Selector changed by', crew: 'theo' },
      { time: '15:18', label: 'Quota dropped', icon: 'Gauge', bars: 3 }
    ]
  },
  {
    id: 'preprints',
    name: 'Preprints',
    status: 'healthy',
    open: 'source',
    eta: '18m',
    pages: '96',
    quota: '81%',
    state: 'Extracting',
    events: [
      { time: '14:58', label: 'Pages fetched', icon: 'Download', units: '12/12 pages' },
      { time: '15:11', label: 'Filed to shelf', icon: 'Library', shelf: 'J' }
    ]
  },
  {
    id: 'podcasts',
    name: 'Podcast notes',
    status: 'blocked',
    open: 'log',
    eta: '41m',
    pages: '22',
    quota: '34%',
    state: 'Stalled',
    crew: 'omar',
    events: [
      { time: '14:44', label: 'Rate limit hit', icon: 'Clock', delay: '+14 min' },
      { time: '15:01', label: 'Quota dropped', icon: 'Gauge', bars: 2 }
    ]
  },
  {
    id: 'design',
    name: 'Design blogs',
    status: 'healthy',
    open: 'log',
    eta: '9m',
    pages: '58',
    quota: '93%',
    state: 'Fetching',
    events: [{ time: '15:16', label: 'Fetching pages', icon: 'Download', units: '4/11 pages' }]
  }
];
const scheduled = [
  { id: 'design', name: 'Design blogs', time: '16:20', shelf: 'Shelf D' },
  { id: 'essays', name: 'Essays feed', time: '16:45', shelf: 'Shelf A' },
  { id: 'preprints', name: 'Preprints', time: '17:10', shelf: 'Shelf F' }
];
const totals = [
  { id: 'scheduled', label: 'Scheduled', count: 24, tone: 'bg-info' },
  { id: 'active', label: 'Active', count: 5, tone: 'bg-success' },
  { id: 'paused', label: 'Paused', count: 7, tone: 'bg-warning/60' },
  { id: 'failed', label: 'Blocked', count: 2, tone: 'bg-ui-destructive/50' }
];
const stats = [
  { label: 'Pages Today', value: '12.8k' },
  { label: 'Avg. Run', value: '4 min' },
  { label: 'Fresh', value: '92%' },
  { label: 'Sources', value: '46' }
];
const scopes = ['All Sources', 'Active Only', 'Paused', 'Blocked'];
const runCount = (count) => `${count} ${count === 1 ? 'Run' : 'Runs'}`;
const noop = (event) => event.preventDefault();

function SourceAvatar({ id }) {
  return (
    <Avatar className='size-6'>
      <AvatarFallback className={sourceTiles[id].tone}>
        <RegistryIcon lucide={sourceTiles[id].icon} aria-hidden='true' className='size-3.5' />
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

/** One tick per run, coloured by state: a compact distribution of the whole queue. */
function RunTicks() {
  const total = totals.reduce((sum, entry) => sum + entry.count, 0);
  return (
    <div className='grid gap-1.5'>
      <div
        role='img'
        aria-label={`${total} runs: ${totals.map((entry) => `${entry.count} ${entry.label.toLowerCase()}`).join(', ')}`}
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
      <section aria-labelledby={`capture-queue-${id}`} className='border-t border-ui-border py-3 first:border-t-0 first:pt-0'>
        <div className='flex items-center gap-2'>
          <h3 id={`capture-queue-${id}`} className='truncate text-sm font-medium'>
            {title}
          </h3>
          <Badge variant='outline' size='sm' className='font-medium'>
            {compact ? count : runCount(count)}
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

function QuotaBars({ filled, total = 7 }) {
  return (
    <span role='img' aria-label={`Quota at ${filled} of ${total} bars`} className='flex items-center gap-0.75'>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={`h-3 w-0.75 ${index < filled ? 'bg-success' : 'bg-success/30'}`} />
      ))}
    </span>
  );
}

function EventFeed({ events, compact }) {
  return (
    <ol
      aria-label='Run events'
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
            {event.shelf ? (
              <Badge variant='outline' size='sm' className='gap-1 font-medium'>
                <RegistryIcon lucide='Library' aria-hidden='true' />
                <span className={compact ? 'sr-only' : undefined}>Shelf</span> {event.shelf}
              </Badge>
            ) : null}
            {event.bars ? <QuotaBars filled={event.bars} /> : null}
          </span>
        </li>
      ))}
    </ol>
  );
}

function RunRow({ run, expanded, onToggle, compact }) {
  const tone = status[run.status];
  const detailId = `run-detail-${run.id}`;
  return (
    <li className='border-b border-dashed border-ui-border py-2.5 first:pt-0 last:border-b-0 last:pb-0'>
      <div className='flex items-center gap-1.5'>
        <SourceAvatar id={run.id} />
        <span className='truncate text-xs font-medium'>{run.name}</span>
        <Badge variant={tone.variant} size='xs' className='gap-0.5'>
          {tone.icon ? <RegistryIcon lucide={tone.icon} aria-hidden='true' /> : null}
          <span className={tone.icon ? '@max-[15rem]/capture:sr-only' : undefined}>{tone.label}</span>
        </Badge>
        <Button asChild variant='outline' size='icon-xs' className='ms-auto'>
          <a
            href={`#source-${run.id}`}
            aria-label={run.open === 'log' ? `Open ${run.name} log` : `Open ${run.name} source`}
            onClick={noop}
          >
            <RegistryIcon lucide={run.open === 'log' ? 'SquareActivity' : 'ArrowUpRight'} aria-hidden='true' />
          </a>
        </Button>
        <Button
          variant='outline'
          size='icon-xs'
          aria-expanded={expanded}
          aria-controls={expanded ? detailId : undefined}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${run.name} detail`}
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
              ['Time left', 'Clock', run.eta],
              ['Pages', 'FileText', run.pages],
              ['Quota', 'Gauge', run.quota]
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
                <span className={compact ? 'sr-only' : 'truncate'}>{run.state}</span>
                {run.crew ? <CrewBadge id={run.crew} /> : null}
              </dd>
            </div>
          </dl>
          <EventFeed events={run.events} compact={compact} />
          <Button asChild variant='outline' size='xs' className='w-full'>
            <a href={`#log-${run.id}`} aria-label={`Open ${run.name} run log`} onClick={noop}>
              <RegistryIcon lucide='SquareActivity' aria-hidden='true' />
              Open Run Log
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

function CaptureQueue({ query }) {
  const { isMobile: compact } = useSidebar();
  const [open, setOpen] = useState({ scheduled: false, active: true, paused: false, failed: false });
  const [expanded, setExpanded] = useState('archive');
  const [sort, setSort] = useState('queue');
  const toggle = (id) => (value) => setOpen((state) => ({ ...state, [id]: value }));
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = runs.filter((run) => run.name.toLowerCase().includes(term));
    return sort === 'name' ? [...list].sort((a, b) => a.name.localeCompare(b.name)) : list;
  }, [query, sort]);
  return (
    <div className='flex min-h-0 flex-1 flex-col rounded-(--ds-radius-card) border border-ui-border bg-surface-muted/60'>
      <div className='flex items-center gap-2 px-4 py-2'>
        <h3 className='min-w-0 flex-1 truncate text-sm font-medium'>Capture Queue</h3>
        <Button asChild variant='outline' size={compact ? 'icon-sm' : 'sm'}>
          <a href='#add-source' aria-label={compact ? 'Add source' : undefined} onClick={noop}>
            <RegistryIcon lucide='Plus' aria-hidden='true' />
            {compact ? null : 'Add Source'}
          </a>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon-sm' aria-label='Sort runs'>
              <RegistryIcon lucide='Settings2' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-44'>
            <DropdownMenuLabel>Sort Runs</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              <DropdownMenuRadioItem value='queue'>Queue Order</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='name'>By Name</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='bg-surface -mx-px flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain rounded-(--ds-radius-card) border border-ui-border px-4 pt-4 pb-3'>
        <RunTicks />
        <StatStrip compact={compact} />
        <div>
          <QueueSection
            id='scheduled'
            title='Scheduled'
            count={24}
            open={open.scheduled}
            onOpenChange={toggle('scheduled')}
            compact={compact}
          >
            <ul className='grid gap-2.5'>
              {scheduled.map((run) => (
                <li key={run.id} className='flex items-center gap-1.5 text-xs'>
                  <SourceAvatar id={run.id} />
                  <span className='truncate font-medium'>{run.name}</span>
                  <Badge variant='outline' size='xs' className='text-[10px]'>
                    Queued
                  </Badge>
                  <span className='text-text-muted ms-auto flex shrink-0 items-center gap-2 tabular-nums'>
                    {run.time}
                    <span aria-hidden='true'>•</span>
                    {run.shelf}
                  </span>
                </li>
              ))}
            </ul>
          </QueueSection>
          <QueueSection
            id='active'
            title='Active Runs'
            count={visible.length}
            open={open.active}
            onOpenChange={toggle('active')}
            compact={compact}
          >
            {visible.length ? (
              <ul>
                {visible.map((run) => (
                  <RunRow
                    key={run.id}
                    run={run}
                    compact={compact}
                    expanded={expanded === run.id}
                    onToggle={() => setExpanded((current) => (current === run.id ? null : run.id))}
                  />
                ))}
              </ul>
            ) : (
              <div role='status' className='grid gap-1 py-4 text-center'>
                <p className='text-sm font-medium'>No Runs Match</p>
                <p className='text-text-muted text-xs'>Clear the search to see every active run.</p>
              </div>
            )}
          </QueueSection>
          <QueueSection id='paused' title='Paused' count={7} open={open.paused} onOpenChange={toggle('paused')} compact={compact}>
            <p className='text-text-muted text-xs'>Paused sources resume at their next scheduled window.</p>
          </QueueSection>
          <QueueSection id='failed' title='Blocked' count={2} open={open.failed} onOpenChange={toggle('failed')} compact={compact}>
            <p className='text-text-muted text-xs'>Blocked sources wait for a curator to update their capture rules.</p>
          </QueueSection>
        </div>
      </div>
      <div className='flex items-center gap-2 px-4 py-2.5'>
        <Button asChild variant='solid' tone='neutral' size='sm' className='flex-1'>
          <a href='#review' aria-label='Review all captures' onClick={noop}>
            <RegistryIcon lucide='ClipboardList' aria-hidden='true' />
            Review Captures
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
        <Button variant='ghost' size='icon-sm' aria-label={`Open profile for ${curator.name}`} className='p-0'>
          <Avatar className='size-7'>
            <AvatarImage src={curator.photo} alt='' />
            <AvatarFallback>ID</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' align='end' sideOffset={8} className='w-56'>
        <DropdownMenuLabel className='flex items-center gap-2 font-normal'>
          <Avatar className='size-8'>
            <AvatarImage src={curator.photo} alt='' />
            <AvatarFallback>ID</AvatarFallback>
          </Avatar>
          <span className='grid min-w-0 leading-tight'>
            <span className='truncate font-medium'>{curator.name}</span>
            <span className='text-text-muted truncate text-xs'>{curator.email}</span>
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
            Digest Routing
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
            Curator Rota
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='UserPlus' aria-hidden='true' />
            Invite Curator
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
      <Link
        variant='bare'
        href='#home'
        aria-label='Gaudi Capture home'
        onClick={noop}
        className='grid size-7 place-items-center rounded-(--ds-radius-control) border border-ui-border outline-hidden focus-visible:ring-2 focus-visible:ring-ui-ring'
      >
        <GaudiLogo aria-hidden='true' className='size-5' />
      </Link>
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
          <DropdownMenuItem>Capture Defaults</DropdownMenuItem>
          <DropdownMenuItem>Selector Profiles</DropdownMenuItem>
          <DropdownMenuItem>API Tokens</DropdownMenuItem>
        </RailMenu>
        <ProfileMenu />
      </div>
    </div>
  );
}

const tabTrigger =
  'h-6 flex-none rounded-(--ds-radius-control) px-2 text-xs data-[state=active]:border-ui-border data-[state=active]:bg-surface data-[state=active]:shadow-xs';

function CapturePanel({ query }) {
  return (
    <div className='@container/capture flex min-w-0 flex-1 flex-col gap-3 py-3 pe-3'>
      <h2 className='flex h-8 items-center px-4 text-base font-medium'>Capture Control</h2>
      <Tabs defaultValue='queue' className='min-h-0 flex-1 gap-3'>
        <TabsList
          variant='outline'
          aria-label='Capture views'
          className='bg-surface-muted h-7 w-full justify-start gap-0 rounded-(--ds-radius-control) border border-ui-border p-0'
        >
          {['Digest', 'Queue', 'Shelves', 'Issues'].map((tab) => (
            <TabsTrigger key={tab} value={tab.toLowerCase()} className={tabTrigger}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value='digest' className='flex min-h-0 flex-1 flex-col'>
          <EmptyPanel icon='Sparkles' title='Digest Builds at 18:00'>
            Today's captures are summarized into one evening digest.
          </EmptyPanel>
        </TabsContent>
        <TabsContent value='queue' className='flex min-h-0 flex-1 flex-col'>
          <CaptureQueue query={query} />
        </TabsContent>
        <TabsContent value='shelves' className='flex min-h-0 flex-1 flex-col'>
          <EmptyPanel icon='Library' title='Shelves Up to Date'>
            Every captured page has been filed to a shelf.
          </EmptyPanel>
        </TabsContent>
        <TabsContent value='issues' className='flex min-h-0 flex-1 flex-col'>
          <EmptyPanel icon='ShieldAlert' title='Issues Shown Inline'>
            Throttled and blocked sources are flagged on their run cards.
          </EmptyPanel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SearchBar({ query, onQuery, scope, onScope }) {
  return (
    <InputGroup className='h-8 max-w-lg min-w-0 flex-1 @max-md:order-last @max-md:max-w-none @max-md:basis-full'>
      <InputGroupAddon>
        <RegistryIcon lucide='Search' aria-hidden='true' />
      </InputGroupAddon>
      <InputGroupInput
        type='search'
        aria-label='Search sources'
        placeholder='Source name or URL'
        className='@max-md:placeholder:text-transparent'
        value={query}
        onChange={(event) => onQuery(event.target.value)}
      />
      <InputGroupAddon align='inline-end'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton variant='soft' aria-label={`Search scope: ${scope}`} className='gap-1'>
              <RegistryIcon lucide='Filter' aria-hidden='true' />
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
  const [quotaAlerts, setQuotaAlerts] = useState(true);
  const [workspace, setWorkspace] = useState('personal');
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
          Auto-Summaries
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={quotaAlerts} onCheckedChange={setQuotaAlerts}>
          Quota Alerts
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={workspace} onValueChange={setWorkspace}>
          <DropdownMenuRadioItem value='personal'>Personal Library</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='lab'>Research Lab</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TopBar({ query, onQuery }) {
  const { isMobile } = useSidebar();
  const [scope, setScope] = useState(scopes[0]);
  return (
    <AppShellHeader className='gap-2 px-3 @max-md:flex-wrap'>
      {isMobile ? (
        <>
          <SidebarTrigger className='-ms-1' />
          <span
            aria-hidden='true'
            className='grid size-7 shrink-0 place-items-center rounded-(--ds-radius-control) border border-ui-border'
          >
            <RegistryIcon lucide='Library' className='size-4' />
          </span>
        </>
      ) : null}
      <SearchBar query={query} onQuery={onQuery} scope={scope} onScope={setScope} />
      <div className='ms-auto flex shrink-0 items-center gap-2'>
        <PreferencesMenu />
        <Button asChild variant='outline' size='sm' className='@max-3xl:size-7 @max-3xl:p-0'>
          <a href='#ask-library' aria-label='Ask the library' onClick={noop}>
            <RegistryIcon lucide='Sparkles' aria-hidden='true' />
            <span className='@max-3xl:hidden'>Ask Library</span>
          </a>
        </Button>
        <Button asChild variant='solid' tone='neutral' size='sm' className='@max-3xl:size-7 @max-3xl:p-0'>
          <a href='#capture' aria-label='Capture a URL' onClick={noop}>
            <RegistryIcon lucide='Plus' aria-hidden='true' />
            <span className='@max-3xl:hidden'>Capture URL</span>
          </a>
        </Button>
      </div>
    </AppShellHeader>
  );
}

export function Pattern() {
  const [section, setSection] = useState('crawlers');
  const [query, setQuery] = useState('');
  return (
    <AppShellFrame surface='default' compactBelow={720}>
      {/* The rail and the capture panel are one sidebar: docked beside the page, one sheet in a narrow frame. */}
      <SidebarProvider shortcut={false} style={{ '--sidebar-width': '27.25rem' }}>
        <Sidebar
          mobileWidth='24rem'
          mobileClassName='max-w-[calc(100%-1rem)]'
          mobileTitle='Capture Control'
          mobileDescription='Sections and the capture queue.'
        >
          <div className='bg-surface flex h-full min-h-0'>
            <Rail section={section} onSection={setSection} />
            <CapturePanel query={query} />
          </div>
        </Sidebar>
        <AppShellPanel inset={false} className='border-s-0'>
          <TopBar query={query} onQuery={setQuery} />
          <AppShellBody className='px-3 pb-3'>
            <div aria-hidden='true' className='grid gap-4 p-4 sm:grid-cols-3'><Skeleton className='h-24' /><Skeleton className='h-24' /><Skeleton className='h-24' /><Skeleton className='h-64 sm:col-span-3' /></div>
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
