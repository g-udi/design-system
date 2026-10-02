'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../../../../src/components/core/Breadcrumb/parts/breadcrumb.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import {
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel
} from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { AppShellNav } from '../../../../src/components/blocks/AppShell/parts/nav.jsx';
import { AppShellPlaceholderGrid } from '../../../../src/components/blocks/AppShell/parts/placeholder.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const workspaces = [
  { id: 'gaudi', name: 'Gaudi', initial: 'G', tone: 'bg-ui-foreground text-ui-background' },
  { id: 'atlas', name: 'Atlas Labs', initial: 'A', tone: 'bg-info text-info-foreground' },
  { id: 'meridian', name: 'Meridian', initial: 'M', tone: 'bg-ui-destructive text-ui-destructive-foreground' }
];
const platform = [
  { id: 'overview', label: 'Overview', icon: 'House' },
  {
    id: 'pipelines',
    label: 'Pipelines',
    icon: 'Zap',
    defaultOpen: true,
    defaultValue: 'deployments',
    items: [
      { id: 'build-runs', label: 'Build Runs' },
      { id: 'deployments', label: 'Deployments' },
      { id: 'release-gates', label: 'Release Gates' }
    ]
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: 'Layers',
    items: [
      { id: 'clusters', label: 'Clusters' },
      { id: 'namespaces', label: 'Namespaces' },
      { id: 'storage-volumes', label: 'Storage Volumes' }
    ]
  },
  { id: 'observability', label: 'Observability', icon: 'Activity', badge: 14 },
  { id: 'security', label: 'Security', icon: 'ShieldCheck' }
];
const initialResources = [
  { id: 'api-gateway', label: 'API Gateway', dot: 'success', status: 'healthy', tag: 'Prod' },
  { id: 'ml-pipeline', label: 'ML Pipeline', dot: 'violet', status: 'training' },
  { id: 'database', label: 'Database', dot: 'info', status: 'healthy', tag: 'US-East' },
  { id: 'cdn', label: 'CDN', dot: 'warning', status: 'degraded' },
  { id: 'authentication', label: 'Authentication', dot: 'danger', status: 'incident' }
];
const links = [
  { id: 'settings', label: 'Settings', icon: 'Settings' },
  { id: 'invite', label: 'Invite Team', icon: 'Users' },
  { id: 'docs', label: 'Documentation', icon: 'BookOpen' }
];
const user = { name: 'Maya Chen', email: 'maya@gaudi.dev', photo: 'https://randomuser.me/api/portraits/women/68.jpg' };

const labelOf = (id, resources) => {
  for (const item of [...platform, ...resources, ...links]) {
    if (item.id === id) return item.label;
    const child = item.items?.find((entry) => entry.id === id);
    if (child) return child.label;
  }
  return 'Overview';
};

function WorkspaceTile({ workspace, className }) {
  return (
    <span
      aria-hidden='true'
      className={`grid size-6 shrink-0 place-items-center rounded-(--ds-radius-control) text-xs font-semibold ${workspace.tone} ${className || ''}`}
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
            <SidebarMenuButton aria-label={`Workspace: ${workspace.name}`} className='data-[state=open]:bg-ui-sidebar-accent'>
              <WorkspaceTile workspace={workspace} className='group-data-[collapsible=icon]:-ms-1' />
              <span className='truncate font-semibold'>{workspace.name}</span>
              <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' className='ms-auto opacity-60' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-(--radix-dropdown-menu-trigger-width) min-w-56'>
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
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
                New Workspace
                <span className='text-text-muted text-xs'>Collaborate with others.</span>
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
              <Avatar className='size-6 group-data-[collapsible=icon]:-ms-1'>
                <AvatarImage src={user.photo} alt='' />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <span className='truncate font-medium'>{user.name}</span>
              <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' className='ms-auto opacity-60' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-60'>
            <DropdownMenuLabel className='flex items-center gap-2 font-normal'>
              <Avatar className='size-8'>
                <AvatarImage src={user.photo} alt='' />
                <AvatarFallback>MC</AvatarFallback>
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
                <RegistryIcon lucide='CreditCard' aria-hidden='true' />
                Billing & Usage
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
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='BookOpen' aria-hidden='true' />
                API Reference
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
      {isMobile ? <SidebarTrigger className='-ms-1' /> : null}
      <Breadcrumb>
        <BreadcrumbList>
          {isMobile ? null : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='#overview'
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate('overview');
                  }}
                >
                  Dashboard
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
    </AppShellHeader>
  );
}

export function Pattern() {
  const [page, setPage] = useState('overview');
  const [workspace, setWorkspace] = useState(workspaces[0]);
  const [resources, setResources] = useState(initialResources);
  const resourceActions = (item) => (
    <>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onSelect={() => setPage(item.id)}>
        <RegistryIcon lucide='ExternalLink' aria-hidden='true' />
        Details
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='Copy' aria-hidden='true' />
        Copy Link
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='Star' aria-hidden='true' />
        Pin to Favorites
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant='destructive'
        onSelect={() => setResources((list) => list.filter((entry) => entry.id !== item.id))}
      >
        <RegistryIcon lucide='Trash2' aria-hidden='true' />
        Remove
      </DropdownMenuItem>
    </>
  );
  return (
    <AppShellFrame>
      {/* Several shells share the docs page, so this one leaves ⌘B to the next and collapses from its rail handle. */}
      <SidebarProvider shortcut={false}>
        <Sidebar collapsible='icon'>
          <SidebarHeader>
            <WorkspaceMenu workspace={workspace} onChange={setWorkspace} />
          </SidebarHeader>
          <SidebarContent role='navigation' aria-label='Workspace'>
            <AppShellNav label='Platform' items={platform} value={page} onValueChange={setPage} />
            <AppShellNav
              label='Resources'
              collapsible
              hideOnRail
              items={resources}
              value={page}
              onValueChange={setPage}
              actions={resourceActions}
            />
            <AppShellNav className='mt-auto' size='sm' items={links} value={page} onValueChange={setPage} />
          </SidebarContent>
          <SidebarFooter>
            <UserMenu />
          </SidebarFooter>
          <SidebarRail handle />
        </Sidebar>
        <AppShellPanel>
          <PageHeader page={labelOf(page, resources)} onNavigate={setPage} />
          <AppShellBody>
            <AppShellPlaceholderGrid preset='dashboard' />
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
