'use client';
import { useState } from 'react';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import {
  BreadcrumbRoot as Breadcrumb,
  BreadcrumbItemPrimitive as BreadcrumbItem,
  BreadcrumbLinkPrimitive as BreadcrumbLink,
  BreadcrumbListPrimitive as BreadcrumbList,
  BreadcrumbPagePrimitive as BreadcrumbPage,
  BreadcrumbSeparatorPrimitive as BreadcrumbSeparator
} from '@gaudi/design-system/core/Breadcrumb';
import { DropdownMenuRoot as DropdownMenu, DropdownMenuContent, DropdownMenuItemPrimitive as DropdownMenuItem, DropdownMenuLabelPrimitive as DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparatorPrimitive as DropdownMenuSeparator, DropdownMenuTrigger } from '@gaudi/design-system/core/DropdownMenu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
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
import Accordion from '@gaudi/design-system/core/Accordion';
import Input from '@gaudi/design-system/core/Input';
import { Label } from '@gaudi/design-system/core/Field';
import Button from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const workspaces = [
  { id: 'personal', name: 'Personal Library', initial: 'P', tone: 'bg-ui-foreground text-ui-background' },
  { id: 'circle', name: 'Reading Circle', initial: 'R', tone: 'bg-info text-info-foreground' },
  { id: 'thesis', name: 'Thesis Research', initial: 'T', tone: 'bg-ui-destructive text-ui-destructive-foreground' }
];
const library = [
  { id: 'home', label: 'Home', icon: 'House' },
  { id: 'inbox', label: 'Inbox', icon: 'Inbox', badge: 9 },
  {
    id: 'collections',
    label: 'Collections',
    icon: 'Library',
    defaultOpen: true,
    defaultValue: 'highlights',
    items: [
      { id: 'reading-now', label: 'Reading Now' },
      { id: 'highlights', label: 'Highlights' },
      { id: 'saved-for-later', label: 'Saved for Later' }
    ]
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: 'FileText',
    items: [
      { id: 'daily-notes', label: 'Daily Notes' },
      { id: 'literature-notes', label: 'Literature Notes' },
      { id: 'drafts', label: 'Drafts' }
    ]
  },
  { id: 'tags', label: 'Tags', icon: 'Tags' }
];
const initialSources = [
  { id: 'field-notes', label: 'Field Notes Weekly', dot: 'success', status: 'synced', tag: 'Daily' },
  { id: 'transcripts', label: 'Talk Transcripts', dot: 'violet', status: 'transcribing' },
  { id: 'papers', label: 'Conference Papers', dot: 'info', status: 'synced', tag: 'PDF' },
  { id: 'web-clipper', label: 'Web Clipper', dot: 'warning', status: 'paused' },
  { id: 'e-reader', label: 'E-reader Highlights', dot: 'danger', status: 'sync failed' }
];
const shelfEntries = [
  {
    id: 'street-atlas',
    workspace: 'personal',
    source: 'field-notes',
    title: 'An atlas made on foot',
    detail:
      'At the corner of two streets named Mill Lane, a handwritten sign supplies the missing landmark: the old flour mill.',
    collections: ['reading-now', 'daily-notes']
  },
  {
    id: 'oral-history',
    workspace: 'personal',
    source: 'transcripts',
    title: 'Listening to an oral history',
    detail:
      'The interviewer waits through the silence. Only then does the speaker remember the sound of the depot doors.',
    collections: ['highlights', 'literature-notes']
  },
  {
    id: 'small-archives',
    workspace: 'personal',
    source: 'papers',
    title: 'Who keeps a small archive?',
    detail:
      'The volunteers describe their index cards as the collection’s first finding aid. Photograph the drawer labels on the next visit.',
    collections: ['drafts']
  },
  {
    id: 'margins',
    workspace: 'circle',
    source: 'field-notes',
    title: 'A conversation in the margins',
    detail: 'Compare the two readers’ notes on the final paragraph before the next book-club meeting.',
    collections: ['reading-now', 'literature-notes']
  },
  {
    id: 'recall',
    workspace: 'thesis',
    source: 'papers',
    title: 'When a cue changes recall',
    detail:
      'The second trial used the same images with a new prompt. Keep the two recall conditions separate in the review.',
    collections: ['reading-now', 'literature-notes']
  }
];
const links = [{ id: 'guide', label: 'Reading guide', icon: 'Compass' }];
const user = { name: 'Leila Haddad', initials: 'LH', email: 'leila@gaudi.app', photo: '/avatars/person-20.svg' };

const labelOf = (id, sources) => {
  for (const item of [...library, ...sources, ...links]) {
    if (item.id === id) return item.label;
    const child = item.items?.find((entry) => entry.id === id);
    if (child) return child.label;
  }
  return id === 'profile' ? 'Profile' : 'Home';
};

function WorkspaceTile({ workspace }) {
  return (
    <span
      aria-hidden='true'
      className={`grid size-6 shrink-0 place-items-center rounded-(--ds-radius-control) text-xs font-semibold ${workspace.tone}`}
    >
      {workspace.initial}
    </span>
  );
}

function WorkspaceMenu({ workspace, onChange }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton aria-label={`Library: ${workspace.name}`} className='data-[state=open]:bg-ui-sidebar-accent'>
              <WorkspaceTile workspace={workspace} />
              <span className='truncate font-semibold'>{workspace.name}</span>
              <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' className='ms-auto opacity-60' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-(--radix-dropdown-menu-trigger-width) min-w-56'>
            <DropdownMenuLabel>Libraries</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={workspace.id} onValueChange={(id) => onChange(workspaces.find((entry) => entry.id === id))}>
              {workspaces.map((entry) => (
                <DropdownMenuRadioItem key={entry.id} value={entry.id} className='gap-2'>
                  <WorkspaceTile workspace={entry} />
                  {entry.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserMenu({ onPage }) {
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              variant='outline'
              aria-label={`Account: ${user.name}`}
              className='group-data-[collapsible=icon]:shadow-none'
            >
              <Avatar className='size-6'>
                <AvatarImage src={user.photo} alt='' />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <span className='truncate font-medium'>{user.name}</span>
              <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' className='ms-auto opacity-60' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-60'>
            <DropdownMenuLabel className='flex items-center gap-2 font-normal'>
              <Avatar className='size-8'>
                <AvatarImage src={user.photo} alt='' />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <span className='grid min-w-0 leading-tight'>
                <span className='truncate font-medium'>{user.name}</span>
                <span className='text-text-muted truncate text-xs'>{user.email}</span>
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onPage('profile')}>
              <RegistryIcon lucide='User' aria-hidden='true' /> Profile
            </DropdownMenuItem>
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
      <SidebarTrigger className='-ms-1' />
      <Breadcrumb>
        <BreadcrumbList>
          {isMobile ? null : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='#home'
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate('home');
                  }}
                >
                  Library
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
      <Button size='sm' variant='outline' className='ms-auto' onClick={() => onNavigate('inbox')}>
        <RegistryIcon lucide='Plus' aria-hidden='true' />
        Capture
      </Button>
    </AppShellHeader>
  );
}

export function Pattern() {
  const [page, setPage] = useState('home');
  const [workspace, setWorkspace] = useState(workspaces[0]);
  const [sources, setSources] = useState(initialSources);
  const [entries, setEntries] = useState(shelfEntries);
  const [saved, setSaved] = useState([]);
  const [capture, setCapture] = useState('');
  const activeSource = sources.find((entry) => entry.id === page);
  const shelf = entries.filter((entry) => entry.workspace === workspace.id);
  const visible = shelf.filter((entry) => {
    if (page === 'saved-for-later') return saved.includes(entry.id);
    if (activeSource) return activeSource.id === entry.source;
    if (library.some((item) => item.items?.some((child) => child.id === page)))
      return entry.collections.includes(page);
    return page !== 'inbox' || entry.collections.includes('inbox');
  });
  const addCapture = (event) => {
    event.preventDefault();
    if (!capture.trim()) return;
    setEntries((list) => [
      {
        id: crypto.randomUUID(),
        workspace: workspace.id,
        title: capture.trim(),
        detail: 'Captured in your inbox.',
        collections: ['inbox']
      },
      ...list
    ]);
    setCapture('');
  };
  const sourceActions = (item) => (
    <>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onSelect={() => setPage(item.id)}>
        <RegistryIcon lucide='ExternalLink' aria-hidden='true' />
        Open Source
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant='destructive'
        onSelect={() => setSources((list) => list.filter((entry) => entry.id !== item.id))}
      >
        <RegistryIcon lucide='Trash2' aria-hidden='true' />
        Unsubscribe
      </DropdownMenuItem>
    </>
  );
  return (
    <AppShellFrame>
      {/* Several shells share the docs page, so this one leaves ⌘B to the next and collapses from its header trigger. */}
      <SidebarProvider shortcut={false}>
        <Sidebar collapsible='icon'>
          <SidebarHeader>
            <WorkspaceMenu workspace={workspace} onChange={setWorkspace} />
          </SidebarHeader>
          <SidebarContent role='navigation' aria-label='Library'>
            <AppShellNav label='Library' items={library} value={page} onValueChange={setPage} />
            <AppShellNav
              label='Sources'
              collapsible
              hideOnRail
              items={sources}
              value={page}
              onValueChange={setPage}
              actions={sourceActions}
            />
            <AppShellNav className='mt-auto' size='sm' items={links} value={page} onValueChange={setPage} />
          </SidebarContent>
          <SidebarFooter>
            <UserMenu onPage={setPage} />
          </SidebarFooter>
        </Sidebar>
        <AppShellPanel>
          <PageHeader page={labelOf(page, sources)} onNavigate={setPage} />
          <AppShellBody>
            {page === 'guide' || page === 'profile' ? (
              <section className='mx-auto grid w-full max-w-2xl gap-3 p-4'>
                <h2 className='text-lg font-semibold'>{labelOf(page, sources)}</h2>
                {page === 'profile' ? (
                  <div>
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                  </div>
                ) : (
                  <p>
                    Open an entry on the reading shelf to read its excerpt or save it for later. Use Capture to add a
                    note to the current library’s inbox.
                  </p>
                )}
              </section>
            ) : (
            <section className='mx-auto grid w-full max-w-2xl gap-4 p-4' aria-label='Library entries'>
              <header className='grid gap-1'>
                <h2 className='text-lg font-semibold'>
                  {page === 'home' ? 'Reading shelf' : `${labelOf(page, sources)} entries`}
                </h2>
                <p className='text-text-muted text-sm'>
                  {workspace.name} · {visible.length} {visible.length === 1 ? 'entry' : 'entries'}
                </p>
              </header>
              {page === 'inbox' ? (
                <form onSubmit={addCapture} className='grid gap-2'>
                  <Label>
                    Capture a reading note
                    <Input
                      value={capture}
                      onChange={(event) => setCapture(event.target.value)}
                      placeholder='Title or quotation'
                    />
                  </Label>
                  <Button size='sm' className='justify-self-start' disabled={!capture.trim()} type='submit'>
                    Add to inbox
                  </Button>
                </form>
              ) : null}
              {visible.length ? (
                <Accordion
                  key={`${workspace.id}-${page}`}
                  items={visible.map((entry) => ({
                    value: entry.id,
                    title: entry.title,
                    description: initialSources.find((source) => source.id === entry.source)?.label,
                    content: (
                      <div className='grid justify-items-start gap-3'>
                        <p>{entry.detail}</p>
                        <Button
                          size='sm'
                          variant='outline'
                          aria-pressed={saved.includes(entry.id)}
                          onClick={() =>
                            setSaved((items) =>
                              items.includes(entry.id) ? items.filter((id) => id !== entry.id) : [...items, entry.id]
                            )
                          }
                        >
                          {saved.includes(entry.id) ? 'Remove from saved' : 'Save for later'}
                        </Button>
                      </div>
                    )
                  }))}
                />
              ) : (
                <p className='text-text-muted text-sm'>
                  {page === 'saved-for-later'
                    ? 'Save an entry from your reading shelf to find it here.'
                    : 'No entries in this collection yet.'}
                </p>
              )}
            </section>
            )}
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
