'use client';
import { GaudiLogo } from '@gaudi/design-system/icons/brands/gaudi';
import { useId, useMemo, useRef, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import Dialog from '@gaudi/design-system/core/Dialog';
import Input from '@gaudi/design-system/core/Input';
import { Label } from '@gaudi/design-system/core/Field';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { IconTile } from '@gaudi/design-system/core/Icon';
import { Badge } from '@gaudi/design-system/core/Pill';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system/core/Accordion';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuCheckboxItemPrimitive as DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@gaudi/design-system/core/Input';
import Timeline from '@gaudi/design-system/core/Timeline';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import DataTable from '@gaudi/design-system/core/DataTable';
import { StatCard, StatMeter } from '@gaudi/design-system/blocks/StatCard';
import { Separator } from '@gaudi/design-system/core/Separator';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { TooltipRoot as Tooltip, TooltipContent, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
import { Sidebar, SidebarProvider, SidebarTrigger, useSidebar } from '@gaudi/design-system/blocks/AppShell';
import { AppShellBody, AppShellFrame, AppShellHeader, AppShellPanel } from '@gaudi/design-system/blocks/AppShell';
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
    events: [
      { id: '15:02', time: '15:02', dateTime: '15:02', title: 'Pages fetched', description: '9/9 pages' },
      { id: '15:09', time: '15:09', dateTime: '15:09', title: 'Pages filed', description: 'Shelf A' }
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
    events: [
      { id: '15:05', time: '15:05', dateTime: '15:05', title: 'Pages fetched', description: '18/18 pages' },
      {
        id: '15:13',
        time: '15:13',
        dateTime: '15:13',
        title: 'Rate limit hit',
        description: 'Run delayed by 6 minutes'
      },
      { id: '15:15', time: '15:15', dateTime: '15:15', title: 'Pages filed', description: 'Shelf B' },
      { id: '15:17', time: '15:17', dateTime: '15:17', title: 'Selector updated', description: 'Changed by Theo' },
      { id: '15:18', time: '15:18', dateTime: '15:18', title: 'Quota dropped', description: '3 of 7 remaining' }
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
    events: [
      { id: '14:58', time: '14:58', dateTime: '14:58', title: 'Pages fetched', description: '12/12 pages' },
      { id: '15:11', time: '15:11', dateTime: '15:11', title: 'Pages filed', description: 'Shelf J' }
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
    events: [
      {
        id: '14:44',
        time: '14:44',
        dateTime: '14:44',
        title: 'Rate limit hit',
        description: 'Run delayed by 14 minutes'
      },
      { id: '15:01', time: '15:01', dateTime: '15:01', title: 'Quota dropped', description: '2 of 7 remaining' }
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
    events: [{ id: '15:16', time: '15:16', dateTime: '15:16', title: 'Fetching pages', description: '4/11 pages' }]
  }
];
const scheduled = [
  { id: 'design', name: 'Design blogs', time: '16:20', shelf: 'Shelf D' },
  { id: 'essays', name: 'Essays feed', time: '16:45', shelf: 'Shelf A' },
  { id: 'preprints', name: 'Preprints', time: '17:10', shelf: 'Shelf F' }
];
const totals = [
  { label: 'Scheduled', value: 24, tone: 'info' },
  { label: 'Active', value: 5, tone: 'success' },
  { label: 'Paused', value: 7, tone: 'warning' },
  { label: 'Blocked', value: 2, tone: 'danger' }
];
const stats = [
  { label: 'Pages Today', value: '12.8k' },
  { label: 'Avg. Run', value: '4 min' },
  { label: 'Fresh', value: '92%' },
  { label: 'Sources', value: '46' }
];
const allSources = 'All Sources';
const scopes = [allSources, ...Object.values(status).map((entry) => entry.label)];
const runColumns = [
  { key: 'name', header: 'Source' },
  {
    key: 'status',
    header: 'Status',
    render: (run) => (
      <Badge size='xs' variant={status[run.status].variant}>
        {status[run.status].label}
      </Badge>
    )
  },
  { key: 'eta', header: 'Time left' }
];
const runCount = (count) => `${count} ${count === 1 ? 'Run' : 'Runs'}`;
const activity = (entries) =>
  entries
    .flatMap((run) =>
      run.events.map((event) => ({
        ...event,
        id: `${run.id}-${event.id}`,
        title: `${run.name} · ${event.title}`
      }))
    )
    .sort((left, right) => right.time.localeCompare(left.time));

const sectionDetails = {
  overview: ['Overview', 'Capture activity across the library.'],
  sources: ['Sources', 'Feeds and collections connected to this workspace.'],
  crawlers: ['Capture runs', ''],
  library: ['Library', 'Captured pages filed to your reading shelves.'],
  topics: ['Topics', 'Subjects covered by the connected sources.'],
  runs: ['Runs', 'Current jobs in queue order. Expand a source to inspect its events.'],
  logs: ['Logs', 'The latest events from your capture runs.'],
  'access-keys': ['Access Keys', 'Workspace credentials used by the capture service.'],
  'capture-rules': ['Capture Rules', 'Rules applied to incoming pages.'],
  selectors: ['Selectors', 'The fields extracted from each source.']
};

const referenceRows = {
  topics: [
    ['Urban history', 'City archive'],
    ['Design practice', 'Design blogs'],
    ['Research', 'Preprints']
  ],
  'access-keys': [
    ['Archive reader', 'Read-only · City archive'],
    ['Feed worker', 'Capture · Research Lab']
  ],
  'capture-rules': [
    ['Rate limit', 'Respect the source retry window'],
    ['Duplicates', 'Skip URLs already on a shelf']
  ],
  selectors: [
    ['Page title', 'Heading or document title'],
    ['Body', 'Article text'],
    ['Published', 'Publication date']
  ],
  library: scheduled.map((item) => [item.shelf, item.name])
};
const referenceColumns = [
  { key: 'name', header: 'Name' },
  { key: 'detail', header: 'Details' }
];
const detailRows = (rows) => rows.map(([name, detail]) => ({ id: name, name, detail }));

function SourceAvatar({ id }) {
  return (
    <Avatar className='size-6'>
      <AvatarFallback className={(sourceTiles[id] || sourceTiles.design).tone}>
        <RegistryIcon
          lucide={(sourceTiles[id] || sourceTiles.design).icon}
          aria-hidden='true'
          className='size-3.5'
        />
      </AvatarFallback>
    </Avatar>
  );
}

/** A collapsible queue section with its run count. */
function QueueSection({ id, title, count, open, onOpenChange, compact, children }) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} asChild>
      <section
        aria-labelledby={`capture-queue-${id}`}
        className={`border-t border-ui-border first:border-t-0 first:pt-0 ${compact ? 'py-3' : 'py-2 last:pb-0'}`}
      >
        <div className='flex items-center gap-2'>
          <h3 id={`capture-queue-${id}`} className='truncate text-sm font-medium'>
            {title}
          </h3>
          <Badge variant='outline' size='sm' className='font-medium'>
            {compact ? count : runCount(count)}
          </Badge>
          <CollapsibleTrigger asChild>
            <Button
              variant='outline'
              size='icon-xs'
              className='ms-auto'
              aria-label={`${open ? 'Collapse' : 'Expand'} ${title.toLowerCase()}`}
            >
              <RegistryIcon
                lucide='ChevronDown'
                aria-hidden='true'
                className={`transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className={compact ? 'pt-3' : 'pt-2'}>{children}</CollapsibleContent>
      </section>
    </Collapsible>
  );
}

function RunRow({ run, expanded, onToggle, onInspect, compact }) {
  const tone = status[run.status];
  return (
    <Collapsible asChild open={expanded} onOpenChange={onToggle}>
      <li
        className={`border-b border-dashed border-ui-border first:pt-0 last:border-b-0 last:pb-0 ${compact ? 'py-2.5' : 'py-1.5'}`}
      >
        <div className='flex items-start gap-2'>
          <SourceAvatar id={run.id} />
          <div className='flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1'>
            <span className='text-sm font-medium leading-6'>{run.name}</span>
            <Badge variant={tone.variant} size='xs' className='gap-0.5'>
              {tone.icon ? <RegistryIcon lucide={tone.icon} aria-hidden='true' /> : null}
              {tone.label}
            </Badge>
          </div>
          <Button
            variant='outline'
            size='icon-xs'
            aria-label={run.open === 'log' ? `Open ${run.name} log` : `Open ${run.name} source`}
            onClick={() =>
              onInspect({
                title: run.open === 'log' ? `${run.name} log` : run.name,
                description: `${status[run.status].label} · ${run.pages} pages · ${run.quota} quota remaining`,
                events: run.events
              })
            }
          >
            <RegistryIcon lucide={run.open === 'log' ? 'SquareActivity' : 'ArrowUpRight'} aria-hidden='true' />
          </Button>
          <CollapsibleTrigger asChild>
            <Button
              variant='outline'
              size='icon-xs'
              aria-label={`${expanded ? 'Collapse' : 'Expand'} ${run.name} detail`}
            >
              <RegistryIcon
                lucide='ChevronDown'
                aria-hidden='true'
                className={`transition-transform duration-200 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent asChild>
          <div className={`grid grid-cols-1 ${compact ? 'gap-4 pt-4' : 'gap-3 pt-3'}`}>
            <dl className='grid grid-cols-3 gap-3'>
              {[
                ['Time left', run.eta],
                ['Pages', run.pages],
                ['Quota', run.quota]
              ].map(([label, value]) => (
                <div key={label} className='flex min-w-0 flex-col gap-1'>
                  <dt className='text-text-muted text-xs'>{label}</dt>
                  <dd className='text-sm font-medium tabular-nums'>{value}</dd>
                </div>
              ))}
            </dl>
            <Timeline label='Run events' items={run.events} />
            <Button
              variant='outline'
              size='xs'
              className='w-full'
              aria-label={`Open ${run.name} run log`}
              onClick={() => onInspect({ title: `${run.name} run log`, events: run.events })}
            >
              <RegistryIcon lucide='SquareActivity' aria-hidden='true' />
              Open Run Log
            </Button>
          </div>
        </CollapsibleContent>
      </li>
    </Collapsible>
  );
}

function CaptureQueue({ matchingRuns, onInspect }) {
  const { isMobile: compact } = useSidebar();
  const [open, setOpen] = useState({ scheduled: false, active: true, paused: false, failed: false });
  const [expanded, setExpanded] = useState('archive');
  const [sort, setSort] = useState('queue');
  const toggle = (id) => (value) => setOpen((state) => ({ ...state, [id]: value }));
  const visible = useMemo(() => {
    return sort === 'name' ? [...matchingRuns].sort((a, b) => a.name.localeCompare(b.name)) : matchingRuns;
  }, [matchingRuns, sort]);
  return (
    <div className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-(--ds-radius-card) border border-ui-border bg-surface-muted/60'>
      <div className='flex shrink-0 items-center gap-2 px-4 py-2'>
        <h3 className='min-w-0 flex-1 truncate text-sm font-medium'>Capture Queue</h3>
        <Button
          variant='outline'
          size={compact ? 'icon-sm' : 'sm'}
          aria-label={compact ? 'Add source' : undefined}
          onClick={() => onInspect({ title: 'Add source', kind: 'add' })}
        >
          <RegistryIcon lucide='Plus' aria-hidden='true' />
          {compact ? null : 'Add Source'}
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
      <ScrollArea
        type='auto'
        aria-label='Capture queue runs'
        className='min-h-0 flex-1 border-y border-ui-border bg-surface [&>[data-slot=scroll-area-viewport]>div]:!block'
        scrollbarClassName={{ thumb: 'bg-text-muted/60' }}
      >
        <div className={`flex min-w-0 flex-col px-4 ${compact ? 'gap-4 py-4' : 'gap-3 py-3'}`}>
          <StatMeter label='Runs by status' segments={totals} />
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
                      onInspect={onInspect}
                      expanded={expanded === run.id}
                      onToggle={() => setExpanded((current) => (current === run.id ? null : run.id))}
                    />
                  ))}
                </ul>
              ) : (
                <EmptyState
                  role='status'
                  compact
                  title='No matching runs'
                  description='Change the search or scope to see more sources.'
                />
              )}
            </QueueSection>
            <QueueSection
              id='paused'
              title='Paused'
              count={7}
              open={open.paused}
              onOpenChange={toggle('paused')}
              compact={compact}
            >
              <p className='text-text-muted text-xs'>Paused sources resume at their next scheduled window.</p>
            </QueueSection>
            <QueueSection
              id='failed'
              title='Blocked'
              count={2}
              open={open.failed}
              onOpenChange={toggle('failed')}
              compact={compact}
            >
              <p className='text-text-muted text-xs'>
                Blocked sources wait for a curator to update their capture rules.
              </p>
            </QueueSection>
          </div>
        </div>
      </ScrollArea>
      <div className='flex shrink-0 items-center gap-2 px-4 py-2.5'>
        <Button
          variant='solid'
          tone='neutral'
          size='sm'
          className='flex-1'
          aria-label='Review all captures'
          onClick={() => onInspect({ title: 'Review captures', rows: matchingRuns })}
        >
          <RegistryIcon lucide='ClipboardList' aria-hidden='true' />
          Review Captures
        </Button>
        <Button
          variant='outline'
          size={compact ? 'icon-sm' : 'sm'}
          aria-label={compact ? 'Activity' : undefined}
          onClick={() => onInspect({ title: 'Capture activity', events: activity(matchingRuns) })}
        >
          <RegistryIcon lucide='History' aria-hidden='true' />
          {compact ? null : 'Activity'}
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
      <Button
        variant='ghost'
        size='icon-sm'
        aria-label={label}
        className='text-text-muted data-[state=open]:bg-surface-muted'
      >
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

function ProfileMenu({ onInspect }) {
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
      <DropdownMenuContent side='right' align='end'>
        <DropdownMenuLabel>{curator.name}</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onInspect({ title: 'Curator profile', description: curator.email })}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            onInspect({
              title: 'Sign-In Security',
              description:
                'This workspace uses single sign-on. Access keys for capture workers appear under Workspace settings.'
            })
          }
        >
          Sign-In Security
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Rail({ section, onSection, onInspect }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const help = (
    <>
      <DropdownMenuItem
        onSelect={() =>
          onInspect({
            title: 'Capture guide',
            description:
              'Add a source by URL. Filter the queue by status, then expand a run to inspect its timeline.'
          })
        }
      >
        Capture guide
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={() =>
          onInspect({
            title: 'Keyboard navigation',
            description:
              'Use Tab to reach controls, arrow keys to move between tabs or menu items, and Escape to close a menu or dialog.'
          })
        }
      >
        Keyboard navigation
      </DropdownMenuItem>
    </>
  );
  const settings = (
    <>
      <DropdownMenuLabel>Workspace</DropdownMenuLabel>
      <DropdownMenuItem
        onSelect={() => {
          onSection('capture-rules');
          if (isMobile) setOpenMobile(false);
        }}
      >
        Capture Defaults
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={() => {
          onSection('selectors');
          if (isMobile) setOpenMobile(false);
        }}
      >
        Selector Profiles
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={() => {
          onSection('access-keys');
          if (isMobile) setOpenMobile(false);
        }}
      >
        API Tokens
      </DropdownMenuItem>
    </>
  );
  return (
    <div
      className={`flex shrink-0 items-center gap-2 ${isMobile ? 'border-b border-ui-border px-3 py-2' : 'w-13 flex-col gap-3 py-3'}`}
    >
      <Button
        variant='outline'
        size='icon-sm'
        aria-label='Gaudi Capture home'
        onClick={() => {
          onSection('overview');
          if (isMobile) setOpenMobile(false);
        }}
      >
        <GaudiLogo aria-hidden='true' className='size-5' />
      </Button>
      {isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='me-auto' aria-label='Capture sections'>
              Sections <RegistryIcon lucide='ChevronDown' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuRadioGroup value={section} onValueChange={onSection}>
              {[...sections, ...tools].map((item) => (
                <DropdownMenuRadioItem key={item.id} value={item.id}>
                  <RegistryIcon lucide={item.icon} aria-hidden='true' />
                  {item.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Help and support</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>{help}</DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Workspace settings</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>{settings}</DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <nav aria-label='Sections' className='flex flex-1 flex-col items-center gap-2'>
          {sections.map((item) => (
            <RailButton key={item.id} item={item} current={section === item.id} onSelect={onSection} />
          ))}
          <Separator className='my-0.5 w-5' />
          {tools.map((item) => (
            <RailButton key={item.id} item={item} current={section === item.id} onSelect={onSection} />
          ))}
        </nav>
      )}
      {!isMobile ? (
        <div className='flex flex-col items-center gap-2'>
          <RailMenu label='Help and support' icon='CircleHelp'>
            {help}
          </RailMenu>
          <RailMenu label='Workspace settings' icon='Settings'>
            {settings}
          </RailMenu>
        </div>
      ) : null}
      <ProfileMenu onInspect={onInspect} />
      {isMobile ? (
        <Button
          variant='ghost'
          size='icon-sm'
          aria-label='Close capture navigation'
          onClick={() => setOpenMobile(false)}
        >
          <RegistryIcon lucide='X' aria-hidden='true' />
        </Button>
      ) : null}
    </div>
  );
}

const tabTrigger =
  'h-6 flex-none rounded-(--ds-radius-control) px-2 text-xs data-[state=active]:border-ui-border data-[state=active]:bg-surface data-[state=active]:shadow-xs';

function CapturePanel({ matchingRuns, onInspect }) {
  return (
    <div className='@container/capture flex min-h-0 min-w-0 flex-1 flex-col gap-3 py-3 pe-3 in-data-[compact=true]:ps-3'>
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
          <EmptyState
            compact
            titleAs='h3'
            title='Digest Builds at 18:00'
            description="Today's captures are summarized into one evening digest."
            icon={<RegistryIcon lucide='Sparkles' aria-hidden='true' />}
          />
        </TabsContent>
        <TabsContent value='queue' className='flex min-h-0 flex-1 flex-col'>
          <CaptureQueue matchingRuns={matchingRuns} onInspect={onInspect} />
        </TabsContent>
        <TabsContent value='shelves' className='flex min-h-0 flex-1 flex-col'>
          <EmptyState
            compact
            titleAs='h3'
            title='Shelves Up to Date'
            description='Every captured page has been filed to a shelf.'
            icon={<RegistryIcon lucide='Library' aria-hidden='true' />}
          />
        </TabsContent>
        <TabsContent value='issues' className='flex min-h-0 flex-1 flex-col'>
          <EmptyState
            compact
            titleAs='h3'
            title='Issues Shown Inline'
            description='Throttled and blocked sources are flagged on their run cards.'
            icon={<RegistryIcon lucide='ShieldAlert' aria-hidden='true' />}
          />
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
        placeholder='Search sources'
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

function TopBar({ query, onQuery, scope, onScope, onInspect }) {
  const { isMobile } = useSidebar();
  return (
    <AppShellHeader className='gap-2 px-3 @max-md:flex-wrap'>
      {isMobile ? (
        <>
          <SidebarTrigger className='-ms-1' />
          <IconTile size='xs' radius='full' aria-hidden='true' className='size-7'>
            <RegistryIcon lucide='Library' className='size-4' />
          </IconTile>
        </>
      ) : null}
      <SearchBar query={query} onQuery={onQuery} scope={scope} onScope={onScope} />
      <div className='ms-auto flex shrink-0 items-center gap-2'>
        <PreferencesMenu />
        <Button
          variant='outline'
          size='sm'
          className='@max-3xl:size-7 @max-3xl:p-0'
          aria-label='Ask the library'
          onClick={() => onInspect({ title: 'Ask the library', kind: 'search' })}
        >
          <RegistryIcon lucide='Sparkles' aria-hidden='true' />
          <span className='@max-3xl:hidden'>Ask Library</span>
        </Button>
        <Button
          variant='solid'
          tone='neutral'
          size='sm'
          className='@max-3xl:size-7 @max-3xl:p-0'
          aria-label='Capture a URL'
          onClick={() => onInspect({ title: 'Capture a URL', kind: 'capture' })}
        >
          <RegistryIcon lucide='Plus' aria-hidden='true' />
          <span className='@max-3xl:hidden'>Capture URL</span>
        </Button>
      </div>
    </AppShellHeader>
  );
}

function CaptureDialog({ detail, entries, onAdd, onClose, openerRef }) {
  const id = useId();
  const [value, setValue] = useState('');
  const adding = detail.kind === 'add' || detail.kind === 'capture';
  const searching = detail.kind === 'search';
  const results = searching
    ? activity(entries).filter((entry) =>
        `${entry.title} ${entry.description}`.toLowerCase().includes(value.trim().toLowerCase())
      )
    : detail.events;
  return (
    <Dialog
      open
      title={detail.title}
      description={detail.description}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      contentProps={{
        onCloseAutoFocus: (event) => {
          if (openerRef.current?.isConnected) {
            event.preventDefault();
            openerRef.current.focus();
          }
        }
      }}
    >
      {adding ? (
        <form
          className='grid gap-3'
          onSubmit={(event) => {
            event.preventDefault();
            onAdd(new URL(value));
            onClose();
          }}
        >
          <Label htmlFor={id}>Source URL</Label>
          <Input
            id={id}
            type='url'
            pattern='https?://.+'
            required
            placeholder='https://example.org/articles'
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <Button type='submit'>{detail.kind === 'add' ? 'Add to queue' : 'Queue capture'}</Button>
        </form>
      ) : null}
      {searching ? (
        <div className='mb-3 grid gap-2'>
          <Label htmlFor={id}>Find a source or event</Label>
          <Input id={id} type='search' value={value} onChange={(event) => setValue(event.target.value)} />
        </div>
      ) : null}
      {results?.length ? <Timeline label={detail.title} items={results} /> : null}
      {results?.length === 0 ? (
        <EmptyState compact role='status' title='No matching events' description='Try another source or event.' />
      ) : null}
      {detail.rows ? (
        <DataTable
          caption='Captured sources'
          columns={runColumns}
          rows={detail.rows}
          density='compact'
          emptyTitle='No matching runs'
        />
      ) : null}
    </Dialog>
  );
}

export function Pattern() {
  const [section, setSection] = useState('crawlers');
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState(scopes[0]);
  const [entries, setEntries] = useState(runs);
  const [detail, setDetail] = useState(null);
  const opener = useRef(null);
  const onInspect = (next) => {
    opener.current = document.activeElement;
    setDetail(next);
  };
  const addSource = (url) => {
    const now = new Date().toTimeString().slice(0, 5);
    const run = {
      id: crypto.randomUUID(),
      name: url.host + (url.pathname === '/' ? '' : url.pathname),
      status: 'healthy',
      open: 'source',
      eta: 'Queued',
      pages: '0',
      quota: '100%',
      events: [{ id: 'queued', time: now, dateTime: now, title: 'Capture queued', description: url.href }]
    };
    setEntries((current) => [run, ...current]);
    setSection('crawlers');
    setQuery('');
    setScope(allSources);
  };
  const matchingRuns = useMemo(
    () =>
      entries.filter((run) => {
        if (scope !== allSources && status[run.status].label !== scope) return false;
        return run.name.toLowerCase().includes(query.trim().toLowerCase());
      }),
    [entries, query, scope]
  );
  return (
    <AppShellFrame
      surface='default'
      compactBelow={960}
      height='66rem'
      style={{ '--ds-app-shell-frame-height-compact': '40rem' }}
    >
      {/* The rail and the capture panel are one sidebar: docked beside the page, one sheet in a narrow frame. */}
      <SidebarProvider shortcut={false} style={{ '--sidebar-width': '30rem' }}>
        <Sidebar
          mobileWidth='24rem'
          mobileClassName='max-w-[calc(100%-1rem)]'
          mobileTitle='Capture Control'
          mobileDescription='Sections and the capture queue.'
        >
          <div className='bg-surface flex h-full min-h-0 in-data-[compact=true]:flex-col'>
            <Rail section={section} onSection={setSection} onInspect={onInspect} />
            <CapturePanel matchingRuns={matchingRuns} onInspect={onInspect} />
          </div>
        </Sidebar>
        <AppShellPanel inset={false} className='border-s-0'>
          <TopBar query={query} onQuery={setQuery} scope={scope} onScope={setScope} onInspect={onInspect} />
          <AppShellBody className='p-4'>
            <h2 className='mb-3 text-lg font-semibold'>{sectionDetails[section][0]}</h2>
            {sectionDetails[section][1] && (
              <p className='mb-3 text-sm text-text-muted'>{sectionDetails[section][1]}</p>
            )}
            {referenceRows[section] ? (
              <DataTable
                caption={sectionDetails[section][0]}
                columns={referenceColumns}
                rows={detailRows(referenceRows[section])}
                density='compact'
              />
            ) : section === 'logs' ? (
              <Timeline label='Capture activity' items={activity(matchingRuns)} />
            ) : (
              <DataTable
                caption='Capture runs'
                columns={runColumns}
                rows={matchingRuns}
                density='compact'
                getRowLabel={(run) => run.name}
                emptyTitle='No matching runs'
                emptyDescription='Change the search or scope to see more sources.'
                renderExpanded={(run) => <Timeline label={`${run.name} run events`} items={run.events} />}
              />
            )}
            <div className='mt-4 grid grid-cols-2 gap-2 @3xl:grid-cols-4'>
              {stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          </AppShellBody>
        </AppShellPanel>
        {detail && (
          <CaptureDialog
            detail={detail}
            entries={entries}
            onAdd={addSource}
            onClose={() => setDetail(null)}
            openerRef={opener}
          />
        )}
      </SidebarProvider>
    </AppShellFrame>
  );
}
