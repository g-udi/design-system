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
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
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
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
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
const links = [
  { id: 'settings', label: 'Settings', icon: 'Settings' },
  { id: 'share', label: 'Share Library', icon: 'Users' },
  { id: 'guide', label: 'Reading Guide', icon: 'Compass' }
];
const user = { name: 'Leila Haddad', initials: 'LH', email: 'leila@gaudi.app', photo: '/avatars/person-20.svg' };

const labelOf = (id, sources) => {
  for (const item of [...library, ...sources, ...links]) {
    if (item.id === id) return item.label;
    const child = item.items?.find((entry) => entry.id === id);
    if (child) return child.label;
  }
  return 'Home';
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
            <DropdownMenuSeparator />
            <DropdownMenuItem className='items-start'>
              <RegistryIcon lucide='Plus' aria-hidden='true' className='mt-0.5' />
              <span className='grid'>
                New Library
                <span className='text-text-muted text-xs'>Keep a separate shelf of reading and notes.</span>
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserMenu() {
  const { isMobile } = useSidebar();
  const [theme, setTheme] = useState('system');
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
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon lucide='User' aria-hidden='true' />
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='Target' aria-hidden='true' />
                Reading Goals
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='Settings' aria-hidden='true' />
                Preferences
                <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon lucide='LifeBuoy' aria-hidden='true' />
                Help
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='Keyboard' aria-hidden='true' />
                Keyboard Shortcuts
                <DropdownMenuShortcut>?</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <RegistryIcon lucide='Palette' aria-hidden='true' />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value='light'>Light</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='dark'>Dark</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='system'>System</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RegistryIcon lucide='LogOut' aria-hidden='true' />
              Sign Out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
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
  const sourceActions = (item) => (
    <>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onSelect={() => setPage(item.id)}>
        <RegistryIcon lucide='ExternalLink' aria-hidden='true' />
        Open Source
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='Copy' aria-hidden='true' />
        Copy Link
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='RefreshCw' aria-hidden='true' />
        Sync Now
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
            <UserMenu />
          </SidebarFooter>
        </Sidebar>
        <AppShellPanel>
          <PageHeader page={labelOf(page, sources)} onNavigate={setPage} />
          <AppShellBody>
            <div aria-hidden='true' className='grid gap-4 p-4 sm:grid-cols-[2fr_1fr]'><Skeleton className='h-72' /><div className='grid gap-4'><Skeleton className='h-20' /><Skeleton className='h-20' /><Skeleton className='h-24' /></div></div>
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
