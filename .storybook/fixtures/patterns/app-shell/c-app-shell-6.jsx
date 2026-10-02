'use client';
import { useState } from 'react';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../../../../src/components/core/Breadcrumb/parts/breadcrumb.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarGroupAction,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
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

const me = { name: 'Mira Stone', role: 'Product Lead', photo: 'https://randomuser.me/api/portraits/women/26.jpg' };
const workspaces = [
  { id: 'thunder', name: 'Thunder AI', members: 8, icon: 'Zap', tone: 'bg-discovery text-discovery-foreground' },
  { id: 'clarity', name: 'Clarity AI', members: 6, icon: 'Sparkles', tone: 'bg-info text-info-foreground' },
  { id: 'labs', name: 'Thunder Labs', members: 12, icon: 'Activity', tone: 'bg-warning text-warning-foreground' },
  { id: 'bold', name: 'Bold Studio', members: 4, icon: 'Palette', tone: 'bg-attention text-attention-foreground' }
];
// Each rail section brings its own pages; the workspace and community groups are shared.
const sections = [
  { id: 'insights', label: 'Insights', icon: 'BarChart3', pages: [
    { id: 'home', label: 'Home', icon: 'Zap' }, { id: 'updates', label: 'Updates', icon: 'Users' }, { id: 'inbox', label: 'Inbox', icon: 'UserRoundCog' },
    { id: 'clients', label: 'Clients', icon: 'Settings', badge: { label: 'Beta', variant: 'destructive-light' } }, { id: 'my-tasks', label: 'My Tasks', icon: 'TrendingUp' }
  ] },
  { id: 'people', label: 'People', icon: 'Users', pages: [
    { id: 'directory', label: 'Directory', icon: 'Users' }, { id: 'teams', label: 'Teams', icon: 'UsersRound' }, { id: 'time-off', label: 'Time Off', icon: 'Calendar' }
  ] },
  { id: 'security', label: 'Security', icon: 'ShieldCheck', pages: [
    { id: 'access', label: 'Access', icon: 'Lock' }, { id: 'audit-log', label: 'Audit Log', icon: 'FileText' }, { id: 'alerts', label: 'Alerts', icon: 'TriangleAlert', badge: { label: 3, variant: 'outline' } }
  ] },
  { id: 'developers', label: 'Developers', icon: 'Code', pages: [
    { id: 'api-keys', label: 'API Keys', icon: 'Lock' }, { id: 'webhooks', label: 'Webhooks', icon: 'Zap' }, { id: 'logs', label: 'Logs', icon: 'List' }
  ] },
  { id: 'documents', label: 'Documents', icon: 'FileText', pages: [
    { id: 'all-docs', label: 'All Documents', icon: 'FileText' }, { id: 'shared', label: 'Shared with me', icon: 'Users' }, { id: 'templates', label: 'Templates', icon: 'LayoutGrid' }
  ] },
  { id: 'alerts-center', label: 'Notifications', icon: 'Bell', pages: [
    { id: 'all-alerts', label: 'All', icon: 'Bell', badge: { label: 9, variant: 'outline' } }, { id: 'mentions', label: 'Mentions', icon: 'MessageSquare' }
  ] }
];
const apps = [
  { id: 'mail', label: 'Mail', icon: 'Mail' },
  { id: 'notes', label: 'Notes', icon: 'ClipboardList' },
  { id: 'app-settings', label: 'Settings', icon: 'Settings' }
];
const workspaceLinks = [
  { id: 'business-concepts', label: 'Business Concepts', icon: 'Briefcase' },
  { id: 'northstar', label: 'Northstar Studio', icon: 'Palette' },
  { id: 'teams-pro', label: 'Teams', icon: 'Users', badge: { label: 'Pro', variant: 'success-light' } },
  { id: 'reports', label: 'Reports', icon: 'BarChart3' }
];
const communities = [
  { id: 'designers-hub', label: 'Designers Hub', icon: 'Palette' },
  { id: 'react', label: 'React Js', icon: 'Code' },
  { id: 'node', label: 'Node Js', icon: 'Activity' }
];
const views = [
  { id: 'list', label: 'List', icon: 'ClipboardList', preset: 'list' },
  { id: 'kanban', label: 'Kanban', icon: 'LayoutGrid', preset: 'grid' },
  { id: 'calendar', label: 'Calendar', icon: 'Calendar', preset: 'split' },
  { id: 'dashboard', label: 'Dashboard', icon: 'Zap', preset: 'dashboard' }
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
        <Button variant='ghost' size='sm' aria-label={`Workspace: ${workspace.name}`} className='min-w-0 gap-2 px-1.5'>
          <span aria-hidden='true' className={`grid size-6 shrink-0 place-items-center rounded-(--ds-radius-control) ${workspace.tone}`}>
            <RegistryIcon lucide={workspace.icon} className='size-3.5' />
          </span>
          <span className='truncate font-medium'>{workspace.name}</span>
          <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='opacity-60' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-60'>
        <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Workspaces</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={workspace.id} onValueChange={(id) => onChange(workspaces.find((entry) => entry.id === id))}>
          {workspaces.map((entry) => (
            <DropdownMenuRadioItem key={entry.id} value={entry.id} className='gap-2'>
              <span aria-hidden='true' className={`grid size-6 shrink-0 place-items-center rounded-(--ds-radius-control) ${entry.tone}`}>
                <RegistryIcon lucide={entry.icon} className='size-3.5' />
              </span>
              <span className='grid leading-tight'>
                {entry.name}
                <span className='text-text-muted text-xs'>{entry.members} members</span>
              </span>
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
            <AvatarFallback>MS</AvatarFallback>
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
          Preferences
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

function PageHeader({ page }) {
  const { isMobile, state } = useSidebar();
  return (
    <AppShellHeader bordered className='gap-2'>
      {/* The trigger lives in the panel; once it is folded away (or on phones) the header carries it. */}
      {isMobile || state === 'collapsed' ? <SidebarTrigger className='-ms-1' /> : null}
      <Breadcrumb className='min-w-0'>
        <BreadcrumbList className='flex-nowrap'>
          <BreadcrumbItem className='hidden @md:inline-flex'>
            <BreadcrumbLink href='#home' onClick={(event) => event.preventDefault()}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className='hidden @md:block' />
          <BreadcrumbItem className='min-w-0'>
            <BreadcrumbPage className='truncate'>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='ms-auto flex shrink-0 items-center gap-1.5'>
        <InputGroup className='hidden w-44 @4xl:flex'>
          <InputGroupAddon>
            <RegistryIcon lucide='Search' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput aria-label='Search' placeholder='Search' />
        </InputGroup>
        <Button variant='outline' size='sm' className='hidden @2xl:inline-flex'>
          <RegistryIcon lucide='ClipboardList' aria-hidden='true' />
          Reports
        </Button>
        <Button size='sm' aria-label='Add' className='px-2 @lg:px-2.5'>
          <RegistryIcon lucide='Plus' aria-hidden='true' />
          <span className='hidden @lg:inline'>Add</span>
        </Button>
        <ProfileMenu />
      </div>
    </AppShellHeader>
  );
}

function Workspace({ view, onView }) {
  const [sort, setSort] = useState('updated');
  const [fields, setFields] = useState({ assignee: true, due: true, labels: false });
  const current = views.find((entry) => entry.id === view);
  return (
    <Tabs value={view} onValueChange={onView} className='min-h-0 flex-1 gap-0'>
      <div role='toolbar' aria-label='Workspace view' className='border-ui-border bg-ui-background sticky top-12 z-[1] flex min-h-12 items-center gap-2 border-b px-4'>
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
                <DropdownMenuRadioItem value='priority'>Priority</DropdownMenuRadioItem>
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
              {Object.entries({ assignee: 'Assignee', due: 'Due date', labels: 'Labels' }).map(([key, label]) => (
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
          <Button variant='soft' size='icon-sm' aria-label='Search workspace'>
            <RegistryIcon lucide='Search' aria-hidden='true' />
          </Button>
        </div>
      </div>
      <TabsContent value={view} className='@container'>
        <AppShellBody className='pt-4'>
          <AppShellPlaceholderGrid preset={current.preset} />
        </AppShellBody>
      </TabsContent>
    </Tabs>
  );
}

function ThunderShell() {
  const [workspace, setWorkspace] = useState(workspaces[0]);
  const [sectionId, setSectionId] = useState('insights');
  const [page, setPage] = useState('updates');
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
              <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent role='navigation' aria-label={`${section.label} pages`} className='gap-0'>
              <AppShellNav items={section.pages} value={page} onValueChange={setPage} />
              <SidebarSeparator className='mx-3' />
              <AppShellNav label='Workspaces' collapsible items={workspaceLinks} value={page} onValueChange={setPage} action={<GroupAction label='Create workspace' />} />
              <SidebarSeparator className='mx-3' />
              <AppShellNav
                label='Communities'
                collapsible
                items={[{ id: 'create-community', label: 'Create a Community', icon: 'Plus' }, ...communities]}
                value={page}
                onValueChange={setPage}
                action={<GroupAction label='Create community' />}
              />
            </SidebarContent>
          </div>
        </div>
        <SidebarRail handle />
      </Sidebar>
      <AppShellPanel inset={false}>
        <PageHeader page={label ?? 'Updates'} />
        <Workspace view={view} onView={setView} />
      </AppShellPanel>
    </SidebarProvider>
  );
}

/** The mini rail: product sections above, apps below. */
function MiniRail({ section, onSection }) {
  return (
    <div className='bg-ui-sidebar border-ui-border flex w-14 shrink-0 flex-col items-center border-e'>
      <div className='border-ui-border flex h-12 w-full shrink-0 items-center justify-center border-b'>
        <span aria-hidden='true' className='bg-ui-foreground text-ui-background grid size-8 place-items-center rounded-(--ds-radius-control)'>
          <RegistryIcon lucide='Command' className='size-4' />
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
      <ThunderShell />
    </AppShellFrame>
  );
}

