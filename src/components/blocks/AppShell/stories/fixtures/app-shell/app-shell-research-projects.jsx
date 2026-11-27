'use client';
import { MetaSeparator } from '@gaudi/design-system/core/Separator';
import { Frame, FramePanel } from '@gaudi/design-system/core/Card';
import { IconTile } from '@gaudi/design-system/core/Icon';
import { GaudiLogo, GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useState } from 'react';
import { Badge, StatusDot } from '@gaudi/design-system/core/Pill';
import {
  BreadcrumbRoot as Breadcrumb,
  BreadcrumbItemPrimitive as BreadcrumbItem,
  BreadcrumbLinkPrimitive as BreadcrumbLink,
  BreadcrumbListPrimitive as BreadcrumbList,
  BreadcrumbPagePrimitive as BreadcrumbPage,
  BreadcrumbSeparatorPrimitive as BreadcrumbSeparator
} from '@gaudi/design-system/core/Breadcrumb';
import { default as Button } from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@gaudi/design-system/core/Commander';
import { DropdownMenuRoot as DropdownMenu, DropdownMenuContent, DropdownMenuItemPrimitive as DropdownMenuItem, DropdownMenuLabelPrimitive as DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparatorPrimitive as DropdownMenuSeparator, DropdownMenuTrigger } from '@gaudi/design-system/core/DropdownMenu';
import { default as Kbd } from '@gaudi/design-system/core/Kbd';
import { PopoverPrimitive as Popover, PopoverContentPrimitive as PopoverContent, PopoverTriggerPrimitive as PopoverTrigger } from '@gaudi/design-system/core/Popover';
import Progress, { ProgressRoot, ProgressRing } from '@gaudi/design-system/core/Progress';
import { TooltipRoot as Tooltip, TooltipContent, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@gaudi/design-system/blocks/AppShell';
import {
  AppShellNotificationItem,
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel,
  useAppShellFrame
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellNav } from '@gaudi/design-system/blocks/AppShell';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@gaudi/design-system/core/Item';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { useHotkey } from '@gaudi/design-system/hooks/interaction/use-hotkey';

const portrait = (path) => `/avatars/${path}.svg`;
const labs = [
  { id: 'cognition', name: 'Cognition Lab', detail: '12 members', initial: 'C', tone: 'bg-ui-foreground text-ui-background' },
  { id: 'urban', name: 'Urban Studies Group', detail: '5 members', initial: 'U', tone: 'bg-success text-success-foreground' },
  { id: 'independent', name: 'Independent', detail: 'Just you', initial: 'I', tone: 'bg-info text-info-foreground' }
];
const research = [
  { id: 'dashboard', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'projects', label: 'Projects', icon: 'Folder' },
  { id: 'my-reading', label: 'My Reading', icon: 'Bookmark' },
  {
    id: 'questions',
    label: 'Questions',
    icon: 'Lightbulb',
    items: [
      { id: 'open', label: 'Open' },
      { id: 'investigating', label: 'Investigating' },
      { id: 'answered', label: 'Answered' }
    ]
  },
  {
    id: 'collaborators',
    label: 'Collaborators',
    icon: 'Users',
    items: [
      { id: 'members', label: 'Members' },
      { id: 'reviewers', label: 'Reviewers' },
      { id: 'access', label: 'Access' }
    ]
  },
  { id: 'citations', label: 'Citations', icon: 'Quote' }
];
// Each active project shows its progress as a ring; the percentage is spoken with the name.
const ring = (value, tone) => (
  <span aria-hidden='true' className='ms-0.5 me-0.5 flex shrink-0'>
    <ProgressRing value={value} tone={tone} size='xs' label='' />
  </span>
);
const initialProjects = [
  {
    id: 'memory-sleep',
    lead: 'Nadia Karim',
    next: 'Compare delayed recall after the two sleep conditions.',
    source: 'Sleep diary, cohort A',
    question: 'Does a later bedtime change next-day recall?',
    questionState: 'investigating',
    label: 'Memory & Sleep',
    leading: ring(72, 'info'),
    status: '72% complete'
  },
  {
    id: 'literature-review',
    lead: 'Theo Martin',
    next: 'Reconcile the inclusion criteria in the review protocol.',
    source: 'Screening log, revision 3',
    question: 'Which studies report the comparison condition?',
    questionState: 'open',
    label: 'Literature Review',
    leading: ring(35, 'discovery'),
    status: '35% complete'
  },
  {
    id: 'field-interviews',
    lead: 'Omar Aziz',
    next: 'Index the interview transcripts by theme and consent status.',
    source: 'Interview transcripts, batch 3',
    question: 'Which route changes did participants mention?',
    questionState: 'answered',
    label: 'Field Interviews',
    leading: ring(100, 'success'),
    status: 'complete'
  },
  {
    id: 'survey-analysis',
    lead: 'Ines Silva',
    next: 'Check the response distribution before coding free text.',
    source: 'Pilot questionnaire',
    question: 'Do the two recruitment channels reach different age groups?',
    questionState: 'investigating',
    label: 'Survey Analysis',
    leading: ring(18, 'warning'),
    status: '18% complete'
  },
  {
    id: 'grant-proposal',
    lead: 'Yusuf Ali',
    next: 'Collect cost estimates for the proposed second study.',
    source: 'Pilot budget',
    question: 'What would a second recruitment wave cost?',
    questionState: 'open',
    label: 'Grant Proposal',
    leading: ring(64, 'attention'),
    status: '64% complete'
  }
];
const pages = research.flatMap((item) => (item.items ? item.items.map((child) => ({ ...child, section: item.label })) : [item]));

const transcript =
  'Interview transcripts, batch 3\n\nField interviews, participant 03 (illustrative excerpt)\nInterviewer: How did you find the reading room?\nParticipant: I followed the hand-drawn map by the entrance.\n';
const bibliography =
  '@misc{cognition-notes,\n  title = {Memory and Sleep: Pilot Study Notes},\n  author = {Cognition Lab},\n  year = {2026},\n  note = {Illustrative research notebook}\n}\n';

const initialNotifications = [
  { id: 'mention', unread: true, avatar: portrait('person-23'), title: '@nadia mentioned you in Memory & Sleep notes', body: '“Can you check this citation?”', time: '2m ago' },
  { id: 'approval', unread: true, icon: 'CircleCheck', tone: 'warning', title: 'Sign-off requested', body: 'The Literature Review draft needs your sign-off before it is shared with the lab.', time: '5m ago', meta: { label: 'Priority', value: 'High' }, actions: [{ label: 'Approve', primary: true, done: 'Approved' }, { label: 'Review', done: 'In review' }] },
  { id: 'file', unread: true, avatar: portrait('person-41'), title: '@omar shared Interview transcripts', attachment: { name: 'interviews-batch-3.txt', text: transcript, size: new Blob([transcript]).size + ' B' }, time: '15m ago' },
  { id: 'task', unread: true, icon: 'Bookmark', tone: 'info', title: 'Reading assigned to you', body: 'Annotate chapter 4 of the sleep-spindles review.', time: '30m ago', meta: { label: 'Due', value: 'Tomorrow' } },
  { id: 'joined', unread: true, icon: 'Users', tone: 'success', title: '4 people joined Cognition Lab', body: 'Nadia, Theo, Ines and Yusuf just joined the lab workspace.', time: '45m ago', people: ['person-20', 'person-44', 'person-07'].map(portrait), peopleExtra: 1 },
  { id: 'event', icon: 'Calendar', tone: 'discovery', title: 'Reading group reminder', body: 'Discussion of this week’s paper with the lab.', time: '3h ago', schedule: { date: 'Mar 3, 2026', time: '10:00 to 11:00 AM' }, actions: [{ label: 'Bookmark event', done: 'Bookmarked' }] },
  { id: 'milestone', icon: 'Award', tone: 'success', title: 'Weekly reading goal reached', body: '12 of 12 papers read this week.', time: '4h ago', meta: { label: 'Goal', value: '12 papers' }, progress: { value: 100, label: 'Weekly reading goal' } },
  { id: 'export', icon: 'Download', tone: 'neutral', title: 'Bibliography export ready', body: 'One sample reference is ready to download.', attachment: { name: 'cognition-notes.bib', text: bibliography, size: new Blob([bibliography]).size + ' B' }, time: 'Yesterday' },
  { id: 'sign-in', icon: 'ShieldAlert', tone: 'attention', title: 'New sign-in detected', body: 'We noticed a new login from macOS, Chrome.', time: 'Yesterday' }
];

function NotificationsPopover() {
  const [items, setItems] = useState(initialNotifications);
  const unread = items.filter((item) => item.unread).length;
  const resolve = (notification, action) =>
    setItems((list) => list.map((item) => (item.id === notification.id ? { ...item, resolved: action.done || action.label, unread: false } : item)));
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant='ghost' size='icon-sm' aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} className='relative'>
              <RegistryIcon lucide='Bell' aria-hidden='true' />
              {unread ? <StatusDot className='bg-ui-foreground absolute top-1 end-1.5' /> : null}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Notifications</TooltipContent>
      </Tooltip>
      <PopoverContent
        side='bottom'
        align='end'
        aria-label='Notifications'
        className='w-[22rem] max-w-[calc(100vw-1.5rem)] p-0'
      >
        <div className='border-ui-border flex items-center gap-2 border-b px-4 py-2.5'>
          <h2 className='text-sm font-semibold'>Notifications</h2>
          {unread ? (
            <Badge variant='invert' size='sm' className='rounded-full'>
              {unread}
            </Badge>
          ) : null}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon-sm'
                className='ms-auto'
                aria-label='Mark all as read'
                disabled={!unread}
                onClick={() => setItems((list) => list.map((item) => ({ ...item, unread: false })))}
              >
                <RegistryIcon lucide='CheckCheck' aria-hidden='true' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark all as read</TooltipContent>
          </Tooltip>
        </div>
        <ul aria-label='Recent notifications' className='max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain'>
          {items.map((item) => (
            <AppShellNotificationItem key={item.id} item={item} onAction={resolve} />
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function Brand({ onHome }) {
  return (
    <div className='flex items-center gap-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2'>
      <Link
        variant='bare'
        href='#overview'
        aria-label='Gaudi Research'
        className='focus-visible:ring-ui-sidebar-ring flex min-w-0 flex-1 items-center gap-2 rounded-(--ds-radius-control) p-1 text-sm font-semibold outline-hidden focus-visible:ring-2 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:p-0'
        onClick={(event) => { event.preventDefault(); onHome(); }}
      >
        <GaudiLogo aria-hidden='true' className='hidden size-7 group-data-[collapsible=icon]:block' />
        <span className='flex min-w-0 items-center gap-2 group-data-[collapsible=icon]:hidden'><GaudiBrand className='text-sm' /><span className='truncate'>Research</span></span>
      </Link>
      <SidebarTrigger />
    </div>
  );
}

function SearchButton({ onOpen, shortcut }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          variant='outline'
          tooltip='Search'
          onClick={onOpen}
          aria-keyshortcuts={shortcut.ariaKeyShortcuts}
          className='bg-ui-background'
        >
          <RegistryIcon lucide='Search' aria-hidden='true' />
          <span>Search...</span>
          <span aria-hidden='true' className='ms-auto group-data-[collapsible=icon]:hidden'>
            <Kbd keys={shortcut.kbdKeys} size='sm' />
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function ReadingGoal() {
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <Frame role='region' aria-labelledby='app-shell-research-goal' spacing='sm'>
        <h2 id='app-shell-research-goal' className='text-ui-warning-ink px-2.5 py-1.5 text-xs font-semibold'>
          Weekly Reading Goal
        </h2>
        <FramePanel className='grid gap-2 p-2.5'>
          <p className='text-text-muted text-xs leading-snug'>9 of 11 papers read; the goal resets on Monday.</p>
          <ProgressRoot
            value={82}
            aria-label='Reading goal progress'
            className='bg-ui-muted h-1.5 rounded-full [&>[data-slot=progress-indicator]]:bg-success'
          />
          <div className='flex justify-between text-xs'>
            <span><b className='font-semibold'>82%</b> <span className='text-text-muted'>Read</span></span>
            <span><b className='font-semibold'>18%</b> <span className='text-text-muted'>Left</span></span>
          </div>
        </FramePanel>
      </Frame>
    </SidebarGroup>
  );
}

function LabTile({ lab, className = 'size-6' }) {
  return (
    <IconTile variant='solid' aria-hidden='true' className={`text-xs font-semibold ${lab.tone} ${className}`}>
      {lab.initial}
    </IconTile>
  );
}

function LabMenu({ lab, onChange }) {
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' aria-label={`Lab: ${lab.name}`} className='data-[state=open]:bg-ui-sidebar-accent'>
              <LabTile lab={lab} />
              <span className='truncate font-medium'>{lab.name}</span>
              <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' className='ms-auto opacity-60' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-60'>
            <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Labs</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={lab.id} onValueChange={(id) => onChange(labs.find((entry) => entry.id === id))}>
              {labs.map((entry) => (
                <DropdownMenuRadioItem key={entry.id} value={entry.id} className='gap-2'>
                  <LabTile lab={entry} className='size-5' />
                  <span className='grid leading-tight'>
                    {entry.name}
                    <span className='text-text-muted text-xs'>{entry.detail}</span>
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function PageHeader({ page, onNavigate }) {
  const { isMobile } = useSidebar();
  return (
    <AppShellHeader>
      {isMobile ? <SidebarTrigger className='-ms-1' /> : null}
      <Breadcrumb>
        <BreadcrumbList>
          {isMobile ? null : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='#dashboard'
                  className='flex items-center gap-1.5'
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate('dashboard');
                  }}
                >
                  <RegistryIcon lucide='FlaskConical' aria-hidden='true' className='size-4' />
                  Research
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='ms-auto'>
        <NotificationsPopover />
      </div>
    </AppShellHeader>
  );
}

/** ⌘K / Ctrl+K opens the palette while the reader works inside this window. */
function SearchPalette({ open, onOpenChange, onSelect, projects, children }) {
  const frame = useAppShellFrame();
  const shortcut = useHotkey('mod+k', () => onOpenChange(!open), { enableInInputs: true, target: frame?.container ?? null });
  return (
    <>
      {children(shortcut)}
      <CommandDialog open={open} onOpenChange={onOpenChange} title='Search' description='Search projects, questions and collaborators.'>
        <Command>
          <CommandInput placeholder='Search research pages...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Pages'>
              {[...pages, ...projects].map((entry) => (
                <CommandItem key={entry.id} value={`${entry.section ?? ''} ${entry.label}`} onSelect={() => onSelect(entry.id)}>
                  <RegistryIcon lucide={entry.icon || 'CornerDownRight'} aria-hidden='true' />
                  {entry.section ? <span className='text-text-muted'>{entry.section} /</span> : null}
                  {entry.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

export function Pattern() {
  const [page, setPage] = useState('dashboard');
  const [lab, setLab] = useState(labs[0]);
  const [projectsByLab, setProjectsByLab] = useState({
    cognition: initialProjects,
    urban: initialProjects.filter((entry) => ['field-interviews', 'survey-analysis'].includes(entry.id)),
    independent: initialProjects.filter((entry) => entry.id === 'literature-review')
  });
  const projects = projectsByLab[lab.id];
  const setProjects = (update) => setProjectsByLab((byLab) => ({ ...byLab, [lab.id]: update(byLab[lab.id]) }));
  const [searchOpen, setSearchOpen] = useState(false);
  const label = [...pages, ...projects].find((entry) => entry.id === page)?.label ?? 'Overview';
  const currentProject = projects.find((entry) => entry.id === page);
  const questions = ['open', 'investigating', 'answered'].includes(page);
  const people = ['members', 'reviewers', 'access'].includes(page);
  const sourceView = ['my-reading', 'citations'].includes(page);
  const visibleProjects = questions ? projects.filter((entry) => entry.questionState === page) : projects;
  const projectActions = (item) => (
    <>
      <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Actions</DropdownMenuLabel>
      <DropdownMenuItem onSelect={() => setPage(item.id)}>
        <RegistryIcon lucide='ExternalLink' aria-hidden='true' />
        Open Study
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a
          download={`${item.id}.bib`}
          href={
            'data:text/plain;charset=utf-8,' +
            encodeURIComponent(
              `@misc{${item.id},\n  title = {${item.label}},\n  author = {${item.lead}}\n}\n`
            )
          }
        >
          <RegistryIcon lucide='Quote' aria-hidden='true' />
          Export study citation
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => {
        const copy = { ...item, id: crypto.randomUUID(), label: `${item.label} (copy)` };
        setProjects((list) => [...list, copy]);
        setPage(copy.id);
      }}>
        <RegistryIcon lucide='Copy' aria-hidden='true' />Duplicate
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant='destructive'
        onSelect={() => {
          setProjects((list) => list.filter((entry) => entry.id !== item.id));
          if (page === item.id) setPage('dashboard');
        }}
      >
        <RegistryIcon lucide='Archive' aria-hidden='true' />
        Archive
      </DropdownMenuItem>
    </>
  );
  return (
    <AppShellFrame>
      <SidebarProvider shortcut={false}>
        <SearchPalette projects={projects}
          open={searchOpen}
          onOpenChange={setSearchOpen}
          onSelect={(id) => {
            setPage(id);
            setSearchOpen(false);
          }}
        >
          {(shortcut) => (
            <Sidebar collapsible='icon'>
              <SidebarHeader>
                <Brand onHome={() => setPage('dashboard')} />
                <SearchButton onOpen={() => setSearchOpen(true)} shortcut={shortcut} />
              </SidebarHeader>
              <SidebarContent role='navigation' aria-label='Research'>
                <AppShellNav label='Research' items={research} value={page} onValueChange={setPage} />
                <AppShellNav
                  label='Active Studies'
                  collapsible
                  hideOnRail
                  items={projects}
                  value={page}
                  onValueChange={setPage}
                  actions={projectActions}
                />
                <div className='mt-auto'>
                  <ReadingGoal />
                </div>
              </SidebarContent>
              <SidebarFooter>
                <LabMenu lab={lab} onChange={(next) => { setLab(next); setPage('dashboard'); }} />
              </SidebarFooter>
            </Sidebar>
          )}
        </SearchPalette>
        <AppShellPanel>
          <PageHeader page={label} onNavigate={setPage} />
          <AppShellBody>
            <section className='mx-auto grid w-full max-w-2xl gap-4 p-4' aria-label='Research workspace'>
              <header className='grid gap-1'>
                <h2 className='text-lg font-semibold'>
                  {currentProject?.label ??
                    (questions
                      ? 'Research questions'
                      : people
                        ? 'Study contacts'
                        : sourceView
                          ? 'Study sources'
                          : 'Active studies')}
                </h2>
                <p className='text-sm text-text-muted'>
                  {lab.name} <MetaSeparator /> {currentProject ? currentProject.lead : `${visibleProjects.length} studies`}
                </p>
              </header>
              {currentProject ? (
                <div className='grid gap-3'>
                  <Progress
                    label='Study completion'
                    value={parseInt(currentProject.status, 10) || 100}
                    valueText={currentProject.status}
                  />
                  <h3 className='font-medium'>{currentProject.question}</h3>
                  <p className='text-sm'>{currentProject.next}</p>
                  <p className='text-sm text-text-muted'>Source: {currentProject.source}</p>
                  <Button size='sm' variant='outline' className='justify-self-start' onClick={() => setPage('projects')}>
                    Back to studies
                  </Button>
                </div>
              ) : (
                <ItemGroup aria-label='Study directory'>
                  {visibleProjects.map((entry) => (
                    <Item key={entry.id} size='sm' className='flex-nowrap border-b last:border-b-0'>
                      <ItemContent>
                        <ItemTitle>
                          {questions ? entry.question : people ? entry.lead : sourceView ? entry.source : entry.label}
                        </ItemTitle>
                        <ItemDescription>{questions || people || sourceView ? entry.label : entry.next}</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          size='sm'
                          variant='outline'
                          aria-label={`Open study: ${entry.label}`}
                          onClick={() => setPage(entry.id)}
                        >
                          Open
                        </Button>
                      </ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              )}
            </section>
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
