'use client';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import {
  BreadcrumbRoot as Breadcrumb,
  BreadcrumbItemPrimitive as BreadcrumbItem,
  BreadcrumbListPrimitive as BreadcrumbList,
  BreadcrumbSeparatorPrimitive as BreadcrumbSeparator
} from '@gaudi/design-system/core/Breadcrumb';
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
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { TooltipRoot as Tooltip, TooltipContent, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellBody, AppShellFrame, AppShellPanel } from '@gaudi/design-system/blocks/AppShell';
import { AppShellNav } from '@gaudi/design-system/blocks/AppShell';
import { AppShellNotifications } from '@gaudi/design-system/blocks/AppShell';
import Dialog from '@gaudi/design-system/core/Dialog';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import Input from '@gaudi/design-system/core/Input';
import Textarea from '@gaudi/design-system/core/Textarea';
import { Label } from '@gaudi/design-system/core/Field';
import { Badge } from '@gaudi/design-system/core/Pill';
import { CardRoot, CardContent } from '@gaudi/design-system/core/Card';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@gaudi/design-system/core/Item';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const teams = ['Reading Circle', 'Thesis Group', 'Field Notes Club'];
const projects = ['Urban History', 'Climate Reading', 'Design Theory'];
const groups = [
  {
    id: 'library',
    label: 'Library',
    icon: 'Library',
    items: ['Overview', 'Collections', 'Reading List', 'Highlights', 'Authors', 'Archive']
  },
  { id: 'research', label: 'Research', icon: 'FlaskConical', items: ['Questions', 'Sources', 'Annotations', 'Citations'] },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: 'Settings2',
    items: ['Members', 'Imports', 'Tags', 'Activity']
  }
].map((group) => ({
  ...group,
  items: group.items.map((label) => ({ id: label.toLowerCase().replace(/\s+/g, '-'), label }))
}));
const apps = [
  { label: 'Notes', icon: 'PenSquare' },
  { label: 'Reader', icon: 'BookOpen' },
  { label: 'Clipper', icon: 'Scissors' },
  { label: 'Graph', icon: 'Share2' },
  { label: 'Journal', icon: 'PenTool' },
  { label: 'Feeds', icon: 'Globe' },
  { label: 'Ask', icon: 'Sparkles' },
  { label: 'People', icon: 'Users' },
  { label: 'Exports', icon: 'Download' }
];
const account = { name: 'Noor Haddad', email: 'noor@gaudi.page', photo: '/avatars/person-20.svg' };
const notifications = [
  {
    id: 'mention',
    unread: true,
    avatar: '/avatars/person-07.svg',
    title: 'Isaura Stenberg mentioned you in “Street grids”',
    body: 'Could you add the 1811 Commissioners’ Plan scan to this collection?',
    time: '2 min ago'
  },
  {
    id: 'import',
    unread: true,
    icon: 'CircleAlert',
    tone: 'warning',
    title: 'Feed import paused',
    badge: 'Action needed',
    body: 'The city archive feed returned errors for 6 minutes. 14 articles are waiting.',
    actions: [
      { label: 'Retry', primary: true, done: 'Retrying' },
      { label: 'Dismiss', dismiss: true }
    ],
    time: '15 min ago'
  },
  {
    id: 'rating',
    unread: true,
    avatar: '/avatars/person-38.svg',
    title: 'Leo Grant rated the new reader view',
    body: 'Margin notes beside the text make close reading much easier.',
    rating: 4,
    time: '1 hour ago'
  },
  {
    id: 'approval',
    unread: true,
    icon: 'CircleCheck',
    tone: 'warning',
    title: 'Pending approval',
    body: 'Leo asked to publish the Design Theory reading list to the circle.',
    actions: [
      { label: 'Approve', primary: true, done: 'Approved' },
      { label: 'Review', done: 'In review' }
    ],
    time: '2 hours ago',
    meta: { label: 'Priority', value: 'High', tone: 'warning' }
  },
  {
    id: 'summaries',
    unread: true,
    icon: 'Sparkles',
    tone: 'success',
    title: 'Summaries are ready',
    body: '28 saved articles now have a summary and suggested tags.',
    time: '3 hours ago'
  },
  {
    id: 'members',
    unread: true,
    icon: 'Users',
    tone: 'success',
    title: '3 new members joined the circle',
    body: 'Nora, Theo and David can now read and annotate Urban History.',
    people: [
      '/avatars/person-18.svg',
      '/avatars/person-43.svg',
      '/avatars/person-46.svg'
    ],
    peopleLabel: 'Nora, Theo and David',
    time: '4 hours ago'
  },
  {
    id: 'milestone',
    icon: 'Star',
    tone: 'success',
    title: 'Reading goal almost there',
    body: '40 articles finished this month across the circle.',
    progress: { value: 40, max: 50, label: 'Articles toward the goal' },
    time: '5 hours ago',
    meta: { label: 'Goal', value: '50 articles', tone: 'success' }
  },
  {
    id: 'session',
    icon: 'Calendar',
    tone: 'discovery',
    title: 'Reading session reminder',
    body: 'Chapter 4 of “The Death and Life of Great American Cities”.',
    schedule: { date: 'Oct 8, 2026', time: '6:00 to 7:30 PM' },
    actions: [
      { label: 'Acknowledge', primary: true, done: 'Acknowledged' },
      { label: 'Decline', dismiss: true }
    ],
    time: '6 hours ago',
    meta: { label: 'Where', value: 'Library room', tone: 'discovery' }
  },
  {
    id: 'audit',
    avatar: '/avatars/person-46.svg',
    title: 'Ottilie Nakamura shared his chapter notes',
    attachment: { name: 'Chapter 3 notes.pdf', size: '1.1 MB' },
    time: '8 hours ago'
  }
];
const pages = groups.flatMap((group) => group.items);
const shelves = {
  'Urban History': [
    ['The Death and Life of Great American Cities', 'Jane Jacobs', 'How do short blocks change a neighborhood?', 'Short blocks give walkers more chances to cross paths.'],
    ['The Commissioners’ Plan of 1811', 'New York City archives', 'Which streets break the grid?', 'Compare the straight avenues with the older paths of Lower Manhattan.'],
    ['The Image of the City', 'Kevin Lynch', 'How do people remember a route?', 'Sketch the paths, edges and landmarks from your last walk.']
  ],
  'Climate Reading': [
    ['Silent Spring', 'Rachel Carson', 'Where does the first chapter locate risk?', 'Look for the connections between farms, streams and kitchens.'],
    ['The Sea Around Us', 'Rachel Carson', 'What does the shoreline preserve?', 'Compare the timescales of tides and sediment.']
  ],
  'Design Theory': [
    ['The Design of Everyday Things', 'Don Norman', 'What makes an action discoverable?', 'Watch what a first-time visitor tries before reading the instructions.'],
    ['The Timeless Way of Building', 'Christopher Alexander', 'Where does a pattern recur?', 'Bring one example of a place that works well for its users.']
  ]
};
const members = {
  'Reading Circle': ['Noor Haddad', 'Isaura Stenberg', 'Leo Grant'],
  'Thesis Group': ['Noor Haddad', 'Ottilie Nakamura'],
  'Field Notes Club': ['Noor Haddad', 'Nora Quinn', 'Theo Grant']
};
const appRoutes = { Notes: 'annotations', Reader: 'reading-list', Graph: 'citations', Feeds: 'imports', Ask: 'questions', People: 'members' };

function LibraryPage({ page, project, team, entries, active, onActive, onCreate, onPage, saved, onSave, options }) {
  const books = [...(shelves[project] ?? []), ...entries.filter(item => item.kind === 'link').map(item => [item.title, item.value, '', ''])];
  const content = books.find(([title]) => title === active);
  const heading = pages.find(item => item.id === page)?.label ?? 'Library apps';
  const descriptions = {
    collections: 'Books, plans and notes collected for the circle.', overview: 'The latest reading in your collection.',
    'reading-list': 'Mark the texts you want to return to.', highlights: 'Passages to bring to the next discussion.',
    authors: 'Writers and collections behind these readings.', archive: 'Finished readings from this collection.',
    questions: 'Discussion questions from the reading group.', sources: 'Original works in this collection.',
    annotations: 'Notes saved by the circle.', citations: 'References for the reading group.',
    members: 'People in this reading circle.', imports: 'Links added to this collection.', tags: 'Subjects used in this collection.',
    activity: 'Recent changes in this collection.', apps: 'Choose a workspace tool.'
  };
  const bookRows = books.map(([title, author, question, highlight]) => ({
    title: page === 'highlights' ? highlight : page === 'questions' ? question : page === 'authors' ? author : title,
    detail: ['highlights','questions','authors'].includes(page) ? title : author,
    book: title
  })).filter(row => row.title);
  const items = {
    'reading-list': bookRows.filter(row => !saved.includes(row.book)), archive: bookRows.filter(row => saved.includes(row.book)),
    annotations: entries.filter(item => item.kind === 'note').map(item => ({ title: item.title, detail: item.value })),
    imports: entries.filter(item => item.kind === 'link').map(item => ({ title: item.title, detail: item.value })),
    members: (members[team] ?? []).map(name => ({ title: name, detail: name === account.name ? 'Circle coordinator' : 'Member' })),
    tags: [{ title: project, detail: `${books.length} readings` }],
    activity: entries.map(item => ({ title: item.title, detail: item.kind === 'note' ? 'Note added' : 'Link saved' })).reverse(),
    apps: Object.entries(appRoutes).map(([name, route]) => ({ title: name, detail: descriptions[route], route }))
  }[page] ?? bookRows;
  return (
    <section className='mx-auto grid w-full max-w-3xl content-start gap-5'>
      <header className='grid gap-1'>
        <p className='text-xs font-medium text-text-muted'>{team} · {project}</p>
        <h1 className='text-2xl font-semibold tracking-tight'>{heading}</h1>
        <p className='text-sm text-text-muted'>{descriptions[page]}</p>
      </header>
      {items.length ? <ItemGroup aria-label={heading}>
        {items.map((row, index) => <Item key={`${row.title}-${index}`} size='sm' className='px-0'>
          <ItemContent className='min-w-0'><ItemTitle className='line-clamp-none'>{row.title}</ItemTitle>
            {row.detail && <ItemDescription>{/^https?:\/\//i.test(row.detail) ? <Link href={row.detail}>{row.detail}</Link> : row.detail}</ItemDescription>}
          </ItemContent>
          {row.book ? <ItemActions><Button size='xs' variant='outline' aria-label={`Open ${row.book}`} onClick={() => onActive(row.book)}>Open</Button></ItemActions> : null}
          {row.route ? <Button variant='outline' size='xs' onClick={() => onPage(row.route)}>Open {row.title}</Button> : null}
        </Item>)}
      </ItemGroup> : <EmptyState compact title={{ archive: 'No finished readings', annotations: 'No shared notes yet', imports: 'No imported links yet', activity: 'No changes yet', 'reading-list': 'All readings finished' }[page] ?? 'No readings yet'}
        description={page === 'archive' ? 'Open a reading and mark it finished to archive it.' : 'Add a link or a note to this collection.'}
        actions={<Button size='sm' variant='outline' onClick={() => page === 'archive' ? onPage('reading-list') : onCreate(page === 'annotations' ? 'note' : 'link')}>{page === 'archive' ? 'Open reading list' : page === 'annotations' ? 'Add a note' : 'Save a link'}</Button>} />}
      {page === 'citations' && books.length ? <Button asChild size='sm' variant='outline' className='justify-self-start'>
        <a download='reading-references.txt' href={`data:text/plain;charset=utf-8,${encodeURIComponent(books.map(([name, author]) => `${author}. ${name}.`).join('\n'))}`}>Export references</a>
      </Button> : null}
      {content ? <Dialog open onOpenChange={open => { if (!open) onActive(null); }} title={content[0]} description={content[1]}>
        <div className='grid gap-4'>
          {/^https?:\/\//i.test(content[1]) && <Link href={content[1]}>Open saved link</Link>}
          {options.summaries && content[3] ? <p>{content[3]}</p> : null}
          {content[2] ? <div><Badge variant='secondary'>Discussion question</Badge><p className='mt-2'>{content[2]}</p></div> : null}
          <Button onClick={() => { onSave(content[0]); onActive(null); }}>{saved.includes(content[0]) ? 'Return to reading list' : 'Mark as finished'}</Button>
        </div>
      </Dialog> : null}
    </section>
  );
}
// Route rows sit indented under their group heading; the current page is a raised muted row.
const indented =
  'h-7 ps-6 text-xs text-ui-sidebar-foreground/75 data-active:text-ui-sidebar-foreground data-active:ring-1 data-active:ring-ui-sidebar-border';

function Logo({ onHome }) {
  return (
    <Link
      variant='bare'
      href='#home'
      onClick={event => { event.preventDefault(); onHome(); }}
      className='flex shrink-0 items-center gap-2 rounded-(--ds-radius-control) outline-hidden focus-visible:ring-2 focus-visible:ring-ui-ring'
    >
      <GaudiBrand className='text-sm' />
    </Link>
  );
}

function Switcher({ label, value, options, onChange, block = false }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          aria-label={`Switch ${label.toLowerCase()}`}
          className={
            block
              ? 'w-full justify-between px-2 hover:bg-ui-sidebar-accent data-[state=open]:bg-ui-sidebar-accent'
              : 'px-1.5 data-[state=open]:bg-surface-muted'
          }
        >
          <span className='truncate'>{value}</span>
          <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='opacity-60' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className={block ? 'w-(--radix-dropdown-menu-trigger-width) min-w-52' : 'w-52'}>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ToolButton({ label, children, ...props }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label={label} className='text-text-muted data-[state=open]:bg-surface-muted' {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side='bottom'>{label}</TooltipContent>
    </Tooltip>
  );
}

function AppsMenu({ onApp }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolButton label='Apps'>
          <RegistryIcon lucide='LayoutGrid' aria-hidden='true' />
        </ToolButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-60 p-2'>
        <DropdownMenuLabel className='px-1 pt-0'>Apps</DropdownMenuLabel>
        <DropdownMenuGroup className='grid grid-cols-3 gap-2'>
          {apps.map((app) => (
            <DropdownMenuItem
              key={app.label}
              onSelect={() => onApp(app.label)}
              className='bg-surface-muted/60 text-text-muted flex h-15 flex-col justify-center gap-1.5 rounded-(--ds-radius-card) border border-ui-border p-1 text-[11px]'
            >
              <RegistryIcon lucide={app.icon} aria-hidden='true' className='size-4' />
              {app.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className='-mx-2 my-2' />
        <DropdownMenuItem onSelect={() => onApp('Browse')} className='justify-center font-medium'>Browse All Apps</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SettingsMenu({ options, onOptions }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><ToolButton label='Open settings'><RegistryIcon lucide='Settings' aria-hidden='true' /></ToolButton></DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Reading settings</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={options.summaries} onCheckedChange={checked => onOptions({ ...options, summaries: checked })}>Show reading summaries</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AccountMenu({ onPage }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label='Open account menu' className='min-h-[1.5rem] min-w-[1.5rem] p-0'>
          <Avatar className='size-6'>
            <AvatarImage src={account.photo} alt='' />
            <AvatarFallback>NH</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-60'>
        <DropdownMenuLabel className='flex items-center gap-2 font-normal'>
          <Avatar className='size-8'>
            <AvatarImage src={account.photo} alt='' />
            <AvatarFallback>NH</AvatarFallback>
          </Avatar>
          <span className='grid min-w-0 leading-tight'>
            <span className='truncate font-medium'>{account.name}</span>
            <span className='text-text-muted truncate text-xs'>{account.email}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onPage('members')}>Circle members</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onPage('activity')}>Library activity</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NewItemMenu({ onCreate }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='gap-1 data-[state=open]:bg-surface-muted'>
          <span>New</span>
          <span className='hidden @xl:inline'>Entry</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuLabel>Add to Library</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onCreate('link')}>
          <RegistryIcon lucide='Link' aria-hidden='true' />
          Save a Link
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onCreate('note')}>
          <RegistryIcon lucide='PenSquare' aria-hidden='true' />
          New Note
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onCreate('collection')}>
          <RegistryIcon lucide='FolderPlus' aria-hidden='true' />
          New Collection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TopBar({ team, project, collections, onTeam, onProject, onPage, onApp, onCreate, options, onOptions }) {
  const { isMobile } = useSidebar();
  return (
    <header className='@container flex min-h-13 shrink-0 flex-wrap items-center gap-3 border-b border-ui-border px-4 py-2 @lg:px-6'>
      {isMobile ? <SidebarTrigger className='-ms-1' /> : null}
      <Logo onHome={() => onPage('collections')} />
      {isMobile ? null : (
        <>
          <span aria-hidden='true' className='h-3.5 w-px shrink-0 bg-ui-border' />
          <Breadcrumb className='min-w-0'>
            <BreadcrumbList className='flex-nowrap gap-1'>
              <BreadcrumbItem>
                <Switcher label='Circle' value={team} options={teams} onChange={onTeam} />
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <Switcher label='Collection' value={project} options={collections} onChange={onProject} />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}
      <div role='toolbar' aria-label='Workspace actions' className='ms-auto flex shrink-0 items-center gap-1'>
        {/* The primary action leads; account sits last after the utilities. */}
        <span className='me-1.5'>
          <NewItemMenu onCreate={onCreate} />
        </span>
        <AppShellNotifications defaultItems={notifications} triggerClassName='text-text-muted' />
        <AppsMenu onApp={onApp} />
        <SettingsMenu options={options} onOptions={onOptions} />
        <AccountMenu onPage={onPage} />
      </div>
    </header>
  );
}

function ReadingGoalCard({ onPage, read }) {
  const goal = 20;
  return (
    <CardRoot padding='none'><CardContent className='p-3'>
      <div className='flex items-center gap-2'>
        <RegistryIcon lucide='BookmarkCheck' aria-hidden='true' className='text-text-muted size-4' />
        <p className='text-sm font-medium'>October reading</p>
      </div>
      <p className='text-text-muted mt-1 text-xs'>{read} of {goal} articles finished</p>
      <Progress value={read} max={goal} aria-label='October reading goal' className='bg-ui-muted mt-2 h-1.5 rounded-full' />
      <Button variant='outline' size='xs' className='mt-3 w-full' onClick={() => onPage('reading-list')}>
        Open reading list
      </Button>
    </CardContent></CardRoot>
  );
}

function SheetSwitchers({ team, project, collections, onTeam, onProject }) {
  const { isMobile } = useSidebar();
  if (!isMobile) return null;
  return (
    <SidebarHeader className='gap-1 px-4 pt-4'>
      <Switcher block label='Circle' value={team} options={teams} onChange={onTeam} />
      <Switcher block label='Collection' value={project} options={collections} onChange={onProject} />
    </SidebarHeader>
  );
}

export function Pattern() {
  const [page, setPage] = useState('collections');
  const [team, setTeam] = useState(teams[0]);
  const [project, setProject] = useState(projects[0]);
  const [collectionsByTeam, setCollections] = useState({});
  const [library, setLibrary] = useState({});
  const [finished, setFinished] = useState({});
  const [active, setActive] = useState(null);
  const [create, setCreate] = useState(null);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [options, setOptions] = useState({ summaries: true });
  const collections = collectionsByTeam[team] ?? projects;
  const scope = JSON.stringify([team, project]);
  const entries = library[scope] ?? [];
  const saved = finished[scope] ?? [];
  const current = pages.find(entry => entry.id === page);
  const onPage = id => { setPage(id); setActive(null); };
  const onTeam = next => { setTeam(next); setProject((collectionsByTeam[next] ?? projects)[0]); setActive(null); };
  const onCreate = kind => { setName(''); setValue(''); setCreate(kind); };
  const onApp = app => {
    if (app === 'Exports') { onPage('citations'); return; }
    if (app === 'Clipper' || app === 'Journal') onCreate(app === 'Clipper' ? 'link' : 'note');
    else onPage(appRoutes[app] ?? 'apps');
  };
  const submit = event => {
    event.preventDefault();
    const title = name.trim();
    if (!title) return;
    if (create === 'collection') {
      setCollections(all => ({ ...all, [team]: [...new Set([...collections, title])] }));
      setProject(title); onPage('collections');
    } else {
      setLibrary(all => ({ ...all, [scope]: [...(all[scope] ?? []), { kind: create, title, value: value.trim() }] }));
      onPage(create === 'link' ? 'imports' : 'annotations');
    }
    setCreate(null);
  };
  return (
    <AppShellFrame>
      {/* The top bar spans the window; the sidebar and page share the row below it. */}
      <SidebarProvider shortcut={false} className='flex-col'>
        <TopBar team={team} project={project} collections={collections} onTeam={onTeam} onProject={setProject} onPage={onPage} onApp={onApp} onCreate={onCreate} options={options} onOptions={setOptions} />
        <div className='relative flex min-h-0 flex-1'>
          <Sidebar>
            <SheetSwitchers team={team} project={project} collections={collections} onTeam={onTeam} onProject={setProject} />
            <SidebarContent role='navigation' aria-label='Library routes' className='gap-1 px-4 py-4'>
              {groups.map((group) => (
                <AppShellNav
                  key={group.id}
                  label={group.label}
                  labelIcon={group.icon}
                  labelClassName='h-7 px-0 text-sm text-ui-sidebar-foreground'
                  className='p-0'
                  items={group.items}
                  value={page}
                  onValueChange={onPage}
                  itemClassName={indented}
                />
              ))}
            </SidebarContent>
            <SidebarFooter className='p-4 pt-2'>
              <ReadingGoalCard onPage={onPage} read={12 + Object.values(finished).reduce((n, titles) => n + titles.length, 0)} />
            </SidebarFooter>
          </Sidebar>
          <AppShellPanel inset={false} aria-label={current?.label}>
            <AppShellBody className='px-4 py-4 @lg:px-6 @lg:py-6'>
              <LibraryPage page={page} project={project} team={team} entries={entries} active={active} onActive={setActive} onCreate={onCreate} onPage={onPage} saved={saved} options={options}
                onSave={title => setFinished(all => ({ ...all, [scope]: saved.includes(title) ? saved.filter(item => item !== title) : [...saved, title] }))} />
              {create ? <Dialog open onOpenChange={open => { if (!open) setCreate(null); }} title={{ link: 'Save a link', note: 'New note', collection: 'New collection' }[create]}>
                <form onSubmit={submit} className='grid gap-3'>
                  <Label htmlFor='library-title'>Title</Label><Input id='library-title' autoFocus value={name} onChange={event => setName(event.target.value)} required />
                  {create === 'link' ? <><Label htmlFor='library-url'>URL</Label><Input id='library-url' type='url' value={value} onChange={event => setValue(event.target.value)} required /></> : null}
                  {create === 'note' ? <><Label htmlFor='library-note'>Note</Label><Textarea id='library-note' value={value} onChange={event => setValue(event.target.value)} required /></> : null}
                  <Button type='submit'>Save {create}</Button>
                </form>
              </Dialog> : null}
            </AppShellBody>
          </AppShellPanel>
        </div>
      </SidebarProvider>
    </AppShellFrame>
  );
}
