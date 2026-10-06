'use client';
import { useState } from 'react';
import { AvatarRoot as Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import {
  BreadcrumbRoot as Breadcrumb,
  BreadcrumbItemPrimitive as BreadcrumbItem,
  BreadcrumbLinkPrimitive as BreadcrumbLink,
  BreadcrumbListPrimitive as BreadcrumbList,
  BreadcrumbPagePrimitive as BreadcrumbPage,
  BreadcrumbSeparatorPrimitive as BreadcrumbSeparator
} from '@gaudi/design-system/core/Breadcrumb';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuCheckboxItemPrimitive as DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@gaudi/design-system/core/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { TooltipRoot as Tooltip, TooltipContent, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
import {
  Sidebar,
  SidebarContent,
  SidebarGroupAction,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from '@gaudi/design-system/blocks/AppShell';
import {
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellNav } from '@gaudi/design-system/blocks/AppShell';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const me = { name: 'Idris Kane', role: 'Research notebooks', photo: '/avatars/person-43.svg' };
const workspaces = [
  { id: 'memory', name: 'Memory & Learning', sources: 64, icon: 'Brain', tone: 'bg-discovery text-discovery-foreground' },
  { id: 'urban', name: 'Urban Reading', sources: 31, icon: 'Building2', tone: 'bg-info text-info-foreground' },
  { id: 'thesis', name: 'Thesis 2026', sources: 118, icon: 'GraduationCap', tone: 'bg-warning text-warning-foreground' },
  { id: 'kitchen', name: 'Kitchen Science', sources: 12, icon: 'FlaskConical', tone: 'bg-attention text-attention-foreground' }
];
// Each rail section brings its own pages; the collection and reading-group lists are shared.
const sections = [
  { id: 'research', label: 'Research', icon: 'Lightbulb', pages: [
    { id: 'overview', label: 'Overview', icon: 'LayoutGrid' }, { id: 'notes', label: 'Notes', icon: 'Pencil' }, { id: 'questions', label: 'Questions', icon: 'CircleHelp' },
    { id: 'sources', label: 'Sources', icon: 'Library', badge: { label: 'New', variant: 'info-light' } }, { id: 'queue', label: 'Reading queue', icon: 'BookOpen' }
  ] },
  { id: 'evidence', label: 'Evidence', icon: 'FlaskConical', pages: [
    { id: 'claims', label: 'Claims', icon: 'Quote' }, { id: 'citations', label: 'Citations', icon: 'BookText' }, { id: 'open-questions', label: 'Open questions', icon: 'CircleHelp', badge: { label: 3, variant: 'outline' } }
  ] },
  { id: 'datasets', label: 'Datasets', icon: 'Database', pages: [
    { id: 'tables', label: 'Tables', icon: 'Table' }, { id: 'imports', label: 'Imports', icon: 'Upload' }, { id: 'queries', label: 'Queries', icon: 'Search' }
  ] },
  { id: 'drafts', label: 'Drafts', icon: 'FileText', pages: [
    { id: 'all-drafts', label: 'All drafts', icon: 'FileText' }, { id: 'shared', label: 'Shared with me', icon: 'Share2' }, { id: 'templates', label: 'Templates', icon: 'LayoutTemplate' }
  ] },
  { id: 'collaborators', label: 'Collaborators', icon: 'Users', pages: [
    { id: 'contributors', label: 'Contributors', icon: 'Users' }, { id: 'reviewers', label: 'Reviewers', icon: 'UserCheck' }, { id: 'office-hours', label: 'Office hours', icon: 'Calendar' }
  ] }
];
const apps = [
  { id: 'reader', label: 'Reader', icon: 'BookOpen' },
  { id: 'flashcards', label: 'Flashcards', icon: 'Layers' },
  { id: 'app-settings', label: 'Settings', icon: 'Settings' }
];
const workspaceLinks = [
  { id: 'spaced-repetition', label: 'Spaced repetition', icon: 'Repeat' },
  { id: 'forgetting-curves', label: 'Forgetting curves', icon: 'TrendingDown' },
  { id: 'sleep-memory', label: 'Sleep and memory', icon: 'Moon', badge: { label: 'Shared', variant: 'success-light' } },
  { id: 'literature-map', label: 'Literature map', icon: 'Network' }
];
const communities = [
  { id: 'cogsci-club', label: 'Cognitive science club', icon: 'Brain' },
  { id: 'thesis-writers', label: 'Thesis writers', icon: 'Pencil' },
  { id: 'commonplace', label: 'Commonplace circle', icon: 'BookOpen' }
];
const views = [
  { id: 'list', label: 'Outline', icon: 'ListTree' },
  { id: 'kanban', label: 'Board', icon: 'Kanban' },
  { id: 'calendar', label: 'Timeline', icon: 'CalendarRange' },
  { id: 'dashboard', label: 'Canvas', icon: 'Waypoints' }
];

function RailButton({ item, current, onSelect, solid }) {
  const { isMobile } = useSidebar();
  const button = (
    <Button
      variant='ghost'
      size='icon'
      aria-label={item.label}
      aria-current={current ? 'page' : undefined}
      onClick={() => onSelect?.(item.id)}
      className={current && solid ? 'bg-ui-foreground text-ui-background hover:bg-ui-foreground/90 hover:text-ui-background' : 'text-text-muted'}
    >
      <RegistryIcon lucide={item.icon} aria-hidden='true' />
    </Button>
  );
  if (isMobile) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side='right'>{item.label}</TooltipContent>
    </Tooltip>
  );
}

function WorkspaceSwitcher({ workspace, onChange }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' aria-label={`Notebook: ${workspace.name}`} className='min-w-0 gap-2 px-1.5'>
          <span aria-hidden='true' className={`grid size-6 shrink-0 place-items-center rounded-(--ds-radius-control) ${workspace.tone}`}>
            <RegistryIcon lucide={workspace.icon} className='size-3.5' />
          </span>
          <span className='truncate font-medium'>{workspace.name}</span>
          <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='opacity-60' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-60'>
        <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Notebooks</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={workspace.id} onValueChange={(id) => onChange(workspaces.find((entry) => entry.id === id))}>
          {workspaces.map((entry) => (
            <DropdownMenuRadioItem key={entry.id} value={entry.id} className='gap-2'>
              <span aria-hidden='true' className={`grid size-6 shrink-0 place-items-center rounded-(--ds-radius-control) ${entry.tone}`}>
                <RegistryIcon lucide={entry.icon} className='size-3.5' />
              </span>
              <span className='grid leading-tight'>
                {entry.name}
                <span className='text-text-muted text-xs'>{entry.sources} sources</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='items-start'>
          <RegistryIcon lucide='Plus' aria-hidden='true' className='mt-0.5' />
          <span className='grid'>
            New notebook
            <span className='text-text-muted text-xs'>Start from a question or a source.</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GroupAction({ label }) {
  return (
    <SidebarGroupAction aria-label={label}>
      <RegistryIcon lucide='Plus' aria-hidden='true' />
    </SidebarGroupAction>
  );
}

function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={`Account: ${me.name}`}>
          <Avatar className='size-7'>
            <AvatarImage src={me.photo} alt='' />
            <AvatarFallback>IK</AvatarFallback>
            <AvatarBadge className='bg-success ring-ui-background' />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='grid font-normal leading-tight'>
          <span className='font-medium'>{me.name}</span>
          <span className='text-text-muted text-xs'>{me.role}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RegistryIcon lucide='User' aria-hidden='true' />
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Settings' aria-hidden='true' />
          Reading preferences
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RegistryIcon lucide='LogOut' aria-hidden='true' />
          Sign Out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PageHeader({ page, notebook }) {
  return (
    <AppShellHeader bordered className='gap-2'>
      <SidebarTrigger className='-ms-1' />
      <Breadcrumb className='min-w-0'>
        <BreadcrumbList className='flex-nowrap'>
          <BreadcrumbItem className='hidden @md:inline-flex'>
            <BreadcrumbLink href='#notebooks' onClick={(event) => event.preventDefault()}>{notebook}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className='hidden @md:block' />
          <BreadcrumbItem className='min-w-0'>
            <BreadcrumbPage className='truncate'>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='ms-auto flex shrink-0 items-center gap-1.5'>
        <Button variant='ghost' size='sm' className='hidden @2xl:inline-flex'>
          <RegistryIcon lucide='Share2' aria-hidden='true' />
          Share
        </Button>
        <Button variant='outline' size='sm' className='hidden @2xl:inline-flex'>
          <RegistryIcon lucide='Download' aria-hidden='true' />
          Export
        </Button>
        <Button size='sm' aria-label='New note' className='px-2 @lg:px-2.5'>
          <RegistryIcon lucide='Plus' aria-hidden='true' />
          <span className='hidden @lg:inline'>New note</span>
        </Button>
        <ProfileMenu />
      </div>
    </AppShellHeader>
  );
}

function Workspace({ view, onView }) {
  const [sort, setSort] = useState('updated');
  const [fields, setFields] = useState({ author: true, reviewed: true, tags: false });
  const current = views.find((entry) => entry.id === view);
  return (
    <Tabs value={view} onValueChange={onView} className='min-h-0 flex-1 gap-0'>
      <div role='toolbar' aria-label='Notebook view' className='border-ui-border bg-ui-background sticky top-12 z-[1] flex min-h-12 items-center gap-2 border-b px-4'>
        <InputGroup className='hidden w-52 @5xl:flex'>
          <InputGroupAddon>
            <RegistryIcon lucide='Search' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput aria-label='Search this notebook' placeholder='Search notes and sources' />
        </InputGroup>
        <TabsList variant='underline' aria-label='Views' className='hidden self-stretch @2xl:flex'>
          {views.map((entry) => (
            <TabsTrigger key={entry.id} value={entry.id} className='gap-1.5'>
              <RegistryIcon lucide={entry.icon} aria-hidden='true' className='size-4' />
              {entry.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* Narrow panels pick the view from a menu instead of the tab row. */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' aria-label={`View: ${current.label}`} className='@2xl:hidden'>
              <RegistryIcon lucide={current.icon} aria-hidden='true' />
              {current.label}
              <RegistryIcon lucide='ChevronDown' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuRadioGroup value={view} onValueChange={onView}>
              {views.map((entry) => (
                <DropdownMenuRadioItem key={entry.id} value={entry.id}>{entry.label}</DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className='ms-auto flex items-center gap-1'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' aria-label='Sort'>
                <RegistryIcon lucide='Funnel' aria-hidden='true' />
                <span className='hidden @xl:inline'>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value='updated'>Last updated</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='created'>Date created</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='cited'>Most cited</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' aria-label='View options'>
                <RegistryIcon lucide='Eye' aria-hidden='true' />
                <span className='hidden @xl:inline'>View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Show fields</DropdownMenuLabel>
              {Object.entries({ author: 'Author', reviewed: 'Last reviewed', tags: 'Tags' }).map(([key, label]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={fields[key]}
                  onCheckedChange={(on) => setFields((value) => ({ ...value, [key]: on === true }))}
                >
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant='outline' size='sm' aria-label='Filter' className='hidden @lg:inline-flex'>
            <RegistryIcon lucide='Filter' aria-hidden='true' />
            <span className='hidden @xl:inline'>Filter</span>
          </Button>
          <Button variant='soft' size='icon-sm' aria-label='Search notebook' className='@5xl:hidden'>
            <RegistryIcon lucide='Search' aria-hidden='true' />
          </Button>
        </div>
      </div>
      <TabsContent value={view} className='@container'>
        <AppShellBody className='pt-4'>
          <div aria-hidden='true' className='grid gap-4 p-4 sm:grid-cols-3'><Skeleton className='h-24' /><Skeleton className='h-24' /><Skeleton className='h-24' /><Skeleton className='h-64 sm:col-span-3' /></div>
        </AppShellBody>
      </TabsContent>
    </Tabs>
  );
}

function NotebookShell() {
  const [workspace, setWorkspace] = useState(workspaces[0]);
  const [sectionId, setSectionId] = useState('research');
  const [page, setPage] = useState('notes');
  const [view, setView] = useState('list');
  const section = sections.find((entry) => entry.id === sectionId);
  const chooseSection = (id) => {
    setSectionId(id);
    setPage(sections.find((entry) => entry.id === id).pages[0].id);
  };
  const label = [...sections.flatMap((entry) => entry.pages), ...workspaceLinks, ...communities].find((entry) => entry.id === page)?.label;
  return (
    <SidebarProvider shortcut={false} style={{ '--sidebar-width': '18rem', '--sidebar-width-icon': '3.5rem' }}>
      <Sidebar collapsible='icon'>
        <div className='flex h-full min-h-0'>
          <MiniRail section={section} onSection={chooseSection} />
          <div className='bg-ui-background flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden'>
            <SidebarHeader className='border-ui-border h-12 flex-row items-center justify-between border-b px-3 py-0'>
              <WorkspaceSwitcher workspace={workspace} onChange={setWorkspace} />
            </SidebarHeader>
            <SidebarContent role='navigation' aria-label={`${section.label} pages`} className='gap-0'>
              <AppShellNav items={section.pages} value={page} onValueChange={setPage} />
              <SidebarSeparator className='mx-3' />
              <AppShellNav label='Collections' collapsible items={workspaceLinks} value={page} onValueChange={setPage} action={<GroupAction label='Create collection' />} />
              <SidebarSeparator className='mx-3' />
              <AppShellNav
                label='Reading groups'
                collapsible
                items={[...communities, { id: 'join-group', label: 'Find a reading group', icon: 'Search' }]}
                value={page}
                onValueChange={setPage}
                action={<GroupAction label='Create reading group' />}
              />
            </SidebarContent>
          </div>
        </div>
      </Sidebar>
      <AppShellPanel inset={false}>
        <PageHeader page={label ?? 'Notes'} notebook={workspace.name} />
        <Workspace view={view} onView={setView} />
      </AppShellPanel>
    </SidebarProvider>
  );
}

/** The mini rail: notebook sections above, companion apps below. */
function MiniRail({ section, onSection }) {
  return (
    <div className='bg-ui-sidebar border-ui-border flex w-14 shrink-0 flex-col items-center border-e'>
      <div className='border-ui-border flex h-12 w-full shrink-0 items-center justify-center border-b'>
        <span aria-hidden='true' className='bg-ui-foreground text-ui-background grid size-8 place-items-center rounded-(--ds-radius-control)'>
          <RegistryIcon lucide='Brain' className='size-4' />
        </span>
      </div>
      <nav aria-label='Sections' className='flex flex-col items-center gap-1 py-2'>
        {sections.map((entry) => (
          <RailButton key={entry.id} item={entry} current={entry.id === section.id} onSelect={onSection} solid />
        ))}
      </nav>
      <SidebarMenu aria-label='Apps' className='mt-auto w-auto items-center gap-1 py-2'>
        {apps.map((entry) => (
          <SidebarMenuItem key={entry.id}>
            <RailButton item={entry} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}

export function Pattern() {
  return (
    <AppShellFrame surface='default'>
      <NotebookShell />
    </AppShellFrame>
  );
}

