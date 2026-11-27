'use client';
import { IconTile } from '@gaudi/design-system/core/Icon';
import { useState } from 'react';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { BreadcrumbRoot as Breadcrumb, BreadcrumbItemPrimitive as BreadcrumbItem, BreadcrumbListPrimitive as BreadcrumbList, BreadcrumbPagePrimitive as BreadcrumbPage, BreadcrumbSeparatorPrimitive as BreadcrumbSeparator } from '@gaudi/design-system/core/Breadcrumb';
import { default as Button } from '@gaudi/design-system/core/Button';
import { DropdownMenuRoot as DropdownMenu, DropdownMenuCheckboxItemPrimitive as DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabelPrimitive as DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@gaudi/design-system/core/DropdownMenu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@gaudi/design-system/core/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { TooltipRoot as Tooltip, TooltipContent, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
import { Sidebar, SidebarContent, SidebarGroupAction, SidebarHeader, SidebarProvider, SidebarSeparator, SidebarTrigger, useSidebar } from '@gaudi/design-system/blocks/AppShell';
import {
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellNav } from '@gaudi/design-system/blocks/AppShell';
import Accordion from '@gaudi/design-system/core/Accordion';
import Card from '@gaudi/design-system/core/Card';
import KanbanBoard from '@gaudi/design-system/core/KanbanBoard';
import Timeline from '@gaudi/design-system/core/Timeline';
import { Label } from '@gaudi/design-system/core/Field';
import Input from '@gaudi/design-system/core/Input';
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

const reviewStages = [
  { id: 'inbox', label: 'To review' },
  { id: 'checked', label: 'Reviewed' }
];
const notebookEntries = [
  {
    id: 'spacing',
    pages: ['spaced-repetition', 'forgetting-curves', 'cogsci-club', 'claims', 'citations'],
    notebook: 'memory',
    title: 'Spacing the second practice session',
    detail: 'Repeat the word list after two days and compare recall with the same-day group.',
    author: 'Idris Kane',
    tag: 'Recall',
    day: 18,
    cited: 4,
    columnId: 'inbox'
  },
  {
    id: 'diary',
    pages: ['sleep-memory', 'literature-map', 'questions', 'sources', 'open-questions', 'citations'],
    notebook: 'memory',
    title: 'What the sleep diaries leave out',
    detail: 'Add a separate field for naps before comparing the evening recall scores.',
    author: 'Nadia Karim',
    tag: 'Methods',
    day: 14,
    cited: 7,
    columnId: 'checked'
  },
  {
    id: 'stations',
    pages: ['literature-map', 'sources', 'tables', 'citations'],
    notebook: 'urban',
    title: 'A station with three names',
    detail: 'Match the old station labels on the map to the names residents use in interviews.',
    author: 'Idris Kane',
    tag: 'Maps',
    day: 16,
    cited: 2,
    columnId: 'inbox'
  },
  {
    id: 'walks',
    pages: ['questions', 'open-questions', 'commonplace'],
    notebook: 'urban',
    title: 'Walking interviews along the canal',
    detail: 'Participants describe the bridge by its paint colour even after the repaint.',
    author: 'Leila Haddad',
    tag: 'Interviews',
    day: 12,
    cited: 5,
    columnId: 'checked'
  },
  {
    id: 'methods',
    pages: ['thesis-writers', 'sources', 'claims', 'citations'],
    notebook: 'thesis',
    title: 'Testing the coding guide',
    detail: 'Have two readers independently code the first transcript before comparing labels.',
    author: 'Idris Kane',
    tag: 'Methods',
    day: 11,
    cited: 3,
    columnId: 'inbox'
  },
  {
    id: 'dough',
    pages: ['sources', 'tables', 'claims'],
    notebook: 'kitchen',
    title: 'A cooler proof for the second loaf',
    detail: 'Keep hydration fixed and compare the crumb after two proofing temperatures.',
    author: 'Idris Kane',
    tag: 'Trials',
    day: 15,
    cited: 1,
    columnId: 'inbox'
  }
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
          <IconTile size='xs' variant='solid' radius='full' aria-hidden='true' className={workspace.tone}>
            <RegistryIcon lucide={workspace.icon} />
          </IconTile>
          <span className='truncate font-medium'>{workspace.name}</span>
          <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='opacity-60' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-60'>
        <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Notebooks</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={workspace.id} onValueChange={(id) => onChange(workspaces.find((entry) => entry.id === id))}>
          {workspaces.map((entry) => (
            <DropdownMenuRadioItem key={entry.id} value={entry.id} className='gap-2'>
              <IconTile size='xs' variant='solid' radius='full' aria-hidden='true' className={entry.tone}>
                <RegistryIcon lucide={entry.icon} />
              </IconTile>
              <span className='grid leading-tight'>
                {entry.name}
                <span className='text-text-muted text-xs'>{entry.sources} sources</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GroupAction({ label, onClick }) {
  return (
    <SidebarGroupAction aria-label={label} onClick={onClick}>
      <RegistryIcon lucide='Plus' aria-hidden='true' />
    </SidebarGroupAction>
  );
}

function ReaderAvatar() {
  return <Avatar className='size-7' title={me.name}><AvatarImage src={me.photo} alt={me.name} /><AvatarFallback>IK</AvatarFallback></Avatar>;
}

function PageHeader({ page, notebook, onNewNote }) {
  return (
    <AppShellHeader bordered className='gap-2'>
      <SidebarTrigger className='-ms-1' />
      <Breadcrumb className='min-w-0'>
        <BreadcrumbList className='flex-nowrap'>
          <BreadcrumbItem className='hidden @md:inline-flex'>
            {notebook}
          </BreadcrumbItem>
          <BreadcrumbSeparator className='hidden @md:block' />
          <BreadcrumbItem className='min-w-0'>
            <BreadcrumbPage className='truncate'>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='ms-auto flex shrink-0 items-center gap-1.5'>
        <Button size='sm' onClick={onNewNote} aria-label='New note' className='px-2 @lg:px-2.5'>
          <RegistryIcon lucide='Plus' aria-hidden='true' />
          <span className='hidden @lg:inline'>New note</span>
        </Button>
        <ReaderAvatar />
      </div>
    </AppShellHeader>
  );
}

function Workspace({ view, onView, notebook, page, bucket, creating, onCreated }) {
  const [sort, setSort] = useState('updated');
  const [fields, setFields] = useState({ author: true, reviewed: true, tags: false });
  const [entries, setEntries] = useState(notebookEntries);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [title, setTitle] = useState('');
  const visible = entries.filter(
    (entry) =>
      entry.notebook === notebook.id &&
      (!bucket || entry.pages?.includes(bucket) || (bucket === 'queue' && entry.columnId === 'inbox')) &&
      (!pendingOnly || entry.columnId === 'inbox') &&
      `${entry.title} ${entry.detail}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  if (sort === 'created') visible.reverse();
  else if (sort === 'cited') visible.sort((a, b) => b.cited - a.cited);
  else visible.sort((a, b) => b.day - a.day);
  const metadata = (entry) =>
    [
      fields.author && entry.author,
      fields.reviewed && (entry.columnId === 'checked' ? 'Reviewed' : 'To review'),
      fields.tags && entry.tag
    ]
      .filter(Boolean)
      .join(' · ');
  const addNote = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    setEntries((items) => [
      {
        id: crypto.randomUUID(),
        notebook: notebook.id,
        pages: bucket ? [bucket] : [],
        title: title.trim(),
        detail: 'New notebook entry.',
        tag: 'Note',
        day: 21,
        cited: 0,
        columnId: 'inbox',
        author: me.name
      },
      ...items
    ]);
    setTitle('');
    setQuery('');
    onCreated();
  };
  const current = views.find((entry) => entry.id === view);
  return (
    <Tabs value={view} onValueChange={onView} className='min-h-0 flex-1 gap-0'>
      <div role='toolbar' aria-label='Notebook view' className='border-ui-border bg-ui-background sticky top-12 z-[1] flex min-h-12 flex-wrap items-center gap-2 border-b px-4 py-2'>
        <InputGroup
          className={searchOpen ? 'order-last w-full @5xl:order-none @5xl:w-52' : 'hidden w-52 @5xl:flex'}
        >
          <InputGroupAddon>
            <RegistryIcon lucide='Search' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput
            aria-label='Search this notebook'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search notes and sources'
          />
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
          <Button
            variant='outline'
            size='sm'
            aria-label='Only notes to review'
            aria-pressed={pendingOnly}
            onClick={() => setPendingOnly(!pendingOnly)}
            className='hidden @lg:inline-flex'
          >
            <RegistryIcon lucide='Filter' aria-hidden='true' />
            <span className='hidden @xl:inline'>Filter</span>
          </Button>
          <Button
            variant='soft'
            size='icon-sm'
            aria-label='Search notebook'
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
            className='@5xl:hidden'
          >
            <RegistryIcon lucide='Search' aria-hidden='true' />
          </Button>
        </div>
      </div>
      <TabsContent value={view} className='@container'>
        <AppShellBody className='pt-4'>
          <section
            className='mx-auto grid w-full min-w-0 max-w-3xl grid-cols-1 gap-4 px-4 pb-4'
            aria-label='Notebook entries'
          >
            <header className='grid gap-1'>
              <h2 className='text-lg font-semibold'>{notebook.name}</h2>
              <p className='text-sm text-text-muted'>
                {page} · {visible.length} {visible.length === 1 ? 'entry' : 'entries'}
              </p>
            </header>
            {creating ? (
              <form onSubmit={addNote} className='grid gap-2'>
                <Label>
                  Note title
                  <Input value={title} onChange={(event) => setTitle(event.target.value)} autoFocus />
                </Label>
                <div className='flex gap-2'>
                  <Button type='submit' size='sm' disabled={!title.trim()}>
                    Save note
                  </Button>
                  <Button variant='ghost' size='sm' onClick={onCreated}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : null}
            {!visible.length ? <p className='text-sm text-text-muted'>No notes match these filters.</p> : null}
            {visible.length > 0 && view === 'list' ? (
              <Accordion
                key={notebook.id}
                items={visible.map((entry) => ({
                  value: entry.id,
                  title: entry.title,
                  description: metadata(entry),
                  content: entry.detail
                }))}
              />
            ) : null}
            {view === 'kanban' ? (
              <KanbanBoard
                label='Notebook review board'
                columns={reviewStages}
                items={visible}
                renderItem={(entry) => (
                  <div className='grid gap-1'>
                    <strong>{entry.title}</strong>
                    <p className='text-sm text-text-muted'>{metadata(entry)}</p>
                  </div>
                )}
                onMove={(id, columnId) =>
                  setEntries((items) => items.map((entry) => (entry.id === id ? { ...entry, columnId } : entry)))
                }
              />
            ) : null}
            {view === 'calendar' ? (
              <Timeline
                label='Notebook timeline'
                items={[...visible]
                  .sort((a, b) => a.day - b.day)
                  .map((entry) => ({
                    id: entry.id,
                    title: entry.title,
                    description: entry.detail,
                    time: `Nov ${entry.day}`,
                    dateTime: `2026-11-${entry.day}`
                  }))}
              />
            ) : null}
            {view === 'dashboard' ? (
              <div className='grid gap-3 @lg:grid-cols-2'>
                {visible.map((entry) => (
                  <Card key={entry.id} variant='outline' padding='sm' title={entry.title} subtitle={metadata(entry)}>
                    <p className='text-sm'>{entry.detail}</p>
                  </Card>
                ))}
              </div>
            ) : null}
          </section>
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
  const [creating, setCreating] = useState(false);
  const [folders, setFolders] = useState([]);
  const [kind, setKind] = useState(null);
  const [folderName, setFolderName] = useState('');
  const custom = folders.filter((folder) => folder.notebook === workspace.id);
  const createFolder = (event) => {
    event.preventDefault();
    if (!folderName.trim()) return;
    const folder = {
      id: crypto.randomUUID(),
      notebook: workspace.id,
      label: folderName.trim(),
      kind,
      icon: kind === 'collection' ? 'Folder' : 'Users'
    };
    setFolders((list) => [...list, folder]);
    setPage(folder.id);
    setFolderName('');
    setKind(null);
  };
  const section = sections.find((entry) => entry.id === sectionId);
  const chooseSection = (id) => {
    setSectionId(id);
    setPage(sections.find((entry) => entry.id === id).pages[0].id);
  };
  const label = [
    ...sections.flatMap((entry) => entry.pages),
    ...workspaceLinks,
    ...communities,
    ...custom
  ].find((entry) => entry.id === page)?.label;
  return (
    <SidebarProvider shortcut={false} style={{ '--sidebar-width': '18rem', '--sidebar-width-icon': '3.5rem' }}>
      <Sidebar collapsible='icon'>
        <div className='flex h-full min-h-0'>
          <MiniRail section={section} onSection={chooseSection} />
          <div className='bg-ui-background flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden'>
            <SidebarHeader className='border-ui-border h-12 flex-row items-center justify-between border-b px-3 py-0'>
              <WorkspaceSwitcher workspace={workspace} onChange={(next) => { setWorkspace(next); setPage('notes'); setKind(null); }} />
            </SidebarHeader>
            <SidebarContent role='navigation' aria-label={`${section.label} pages`} className='gap-0'>
              <AppShellNav items={section.pages} value={page} onValueChange={setPage} />
              <SidebarSeparator className='mx-3' />
              <AppShellNav
                label='Collections'
                collapsible
                items={[...workspaceLinks, ...custom.filter((folder) => folder.kind === 'collection')]}
                value={page}
                onValueChange={setPage}
                action={
                  <GroupAction
                    label='Create collection'
                    onClick={() => {
                      setKind('collection');
                      setFolderName('');
                    }}
                  />
                }
              />
              <SidebarSeparator className='mx-3' />
              <AppShellNav
                label='Reading groups'
                collapsible
                items={[...communities, ...custom.filter((folder) => folder.kind === 'reading group')]}
                value={page}
                onValueChange={setPage}
                action={<GroupAction label='Create reading group' onClick={() => { setKind('reading group'); setFolderName(''); }} />}
              />
              {kind ? (
                <form onSubmit={createFolder} className='grid gap-2 px-3 py-2'>
                  <Label>
                    New {kind} name
                    <Input value={folderName} onChange={(event) => setFolderName(event.target.value)} autoFocus />
                  </Label>
                  <div className='flex gap-2'>
                    <Button size='sm' type='submit' disabled={!folderName.trim()}>
                      Create
                    </Button>
                    <Button size='sm' variant='ghost' type='button' onClick={() => setKind(null)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : null}
            </SidebarContent>
          </div>
        </div>
      </Sidebar>
      <AppShellPanel inset={false}>
        <PageHeader page={label ?? 'Notes'} notebook={workspace.name} onNewNote={() => setCreating(true)} />
        <Workspace
          bucket={['overview', 'notes'].includes(page) ? null : page}
          view={view}
          onView={setView}
          notebook={workspace}
          page={label ?? 'Notes'}
          creating={creating}
          onCreated={() => setCreating(false)}
        />
      </AppShellPanel>
    </SidebarProvider>
  );
}

/** The mini rail switches notebook sections. */
function MiniRail({ section, onSection }) {
  return (
    <div className='bg-ui-sidebar border-ui-border flex w-14 shrink-0 flex-col items-center border-e'>
      <div className='border-ui-border flex h-12 w-full shrink-0 items-center justify-center border-b'>
        <IconTile size='sm' variant='solid' aria-hidden='true' className='bg-ui-foreground text-ui-background'>
          <RegistryIcon lucide='Brain' className='size-4' />
        </IconTile>
      </div>
      <nav aria-label='Sections' className='flex flex-col items-center gap-1 py-2'>
        {sections.map((entry) => (
          <RailButton key={entry.id} item={entry} current={entry.id === section.id} onSelect={onSection} solid />
        ))}
      </nav>
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

