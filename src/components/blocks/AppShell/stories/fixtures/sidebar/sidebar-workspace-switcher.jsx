'use client';
import { GaudiLogo, GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useRef, useState } from 'react';
import Input from '@gaudi/design-system/core/Input';
import { Label } from '@gaudi/design-system/core/Field';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
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
  CardRoot as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellFrame, useSidebar } from '@gaudi/design-system/blocks/AppShell';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const WORKSPACES = [
  {
    id: 'gaudi-workspace',
    name: 'Gaudi Workspace',
    plan: 'Pro',
    initials: 'G',
    avatar: '/static/favicons/android-chrome-192x192.png'
  },
  {
    id: 'acme',
    name: 'Gaudi',
    plan: 'Team',
    initials: 'GA',
    avatar: '/static/favicons/android-chrome-192x192.png'
  },
  {
    id: 'personal',
    name: 'Personal',
    plan: 'Free',
    initials: 'PS',
    avatar:
      '/avatars/person-31.svg'
  }
];
const NAV = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <RegistryIcon lucide='LayoutDashboardIcon' aria-hidden='true' />
  },
  {
    id: 'inbox',
    label: 'Inbox',
    badge: 12,
    icon: <RegistryIcon lucide='InboxIcon' aria-hidden='true' />
  },
  {
    id: 'deployments',
    label: 'Deployments',
    isActive: true,
    icon: <RegistryIcon lucide='RocketIcon' aria-hidden='true' />
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <RegistryIcon lucide='BarChart3Icon' aria-hidden='true' />
  },
  {
    id: 'logs',
    label: 'Logs',
    badge: 3,
    icon: <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />
  },
  {
    id: 'storage',
    label: 'Storage',
    icon: <RegistryIcon lucide='LayersIcon' aria-hidden='true' />
  }
];
const PROJECTS = [
  { id: 'checkout', name: 'Checkout API' },
  { id: 'design-system', name: 'Design system' },
  { id: 'marketing', name: 'Marketing site' },
  { id: 'edge-cache', name: 'Edge cache' }
];
const DEPLOYMENTS = [
  {
    id: 'd-4821', project: 'edge-cache',
    title: 'Shorten the image cache lifetime',
    branch: 'main',
    time: '12m ago'
  },
  {
    id: 'd-4820', project: 'checkout',
    title: 'Split the archive page by year',
    branch: 'release/2.8',
    time: '1h ago'
  },
  {
    id: 'd-4819', project: 'design-system',
    title: 'Serve feeds from the edge cache',
    branch: 'feat/edge',
    time: '3h ago',
    failed: true
  },
  {
    id: 'd-4818',
    title: 'Add language fallbacks to search',
    branch: 'main',
    time: 'Yesterday'
  }
];
const STATS = [
  { id: 'build', label: 'Build time', value: '42s' },
  { id: 'success', label: 'Success rate', value: '99.2%' },
  { id: 'prs', label: 'Open PRs', value: '7' }
];

function WorkspaceSwitcher({ workspace, workspaces, onSelect, onNew }) {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              aria-label={`${workspace.name}, ${workspace.plan} plan`}
              className='aria-expanded:bg-ui-sidebar-accent aria-expanded:text-ui-sidebar-accent-foreground'
            >
              <span className='hidden group-data-[collapsible=icon]:block'>{workspace.id === 'personal' ? <Avatar size='sm'><AvatarImage src={workspace.avatar} alt='' /><AvatarFallback>{workspace.initials}</AvatarFallback></Avatar> : <GaudiLogo aria-hidden='true' className='size-8' />}</span>
              <span className='grid min-w-0 flex-1 gap-1 text-left leading-tight group-data-[collapsible=icon]:hidden'>
                <span className='flex items-center gap-2 text-sm font-medium'>
                  {!['gaudi-workspace', 'acme'].includes(workspace.id) ? workspace.name : <><GaudiBrand className='text-sm' />{workspace.id === 'gaudi-workspace' && <span>Workspace</span>}</>}
                </span>
                <span className='text-ui-sidebar-foreground truncate text-xs'>
                  {workspace.plan} plan
                </span>
              </span>
              <RegistryIcon
                lucide='ChevronsUpDownIcon'
                className='ml-auto opacity-60'
                aria-hidden='true'
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start'>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              {workspaces.map((item) => (
                <DropdownMenuItem key={item.id} onClick={() => onSelect(item)}>
                  {!['gaudi-workspace', 'acme'].includes(item.id) ? <><Avatar size='sm'><AvatarImage src={item.avatar} alt='' /><AvatarFallback>{item.initials}</AvatarFallback></Avatar><span>{item.name}</span></> : <><GaudiBrand className='text-sm' />{item.id === 'gaudi-workspace' && <span>Workspace</span>}</>}
                  {item.id === workspace.id ? (
                    <RegistryIcon
                      lucide='CheckIcon'
                      className='ml-auto size-3.5'
                      aria-hidden='true'
                    />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => { onNew(); setOpenMobile(false); }}>
                <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
                New workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
function WorkspaceNav({ page, onPage }) {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild isActive={page === item.id}>
                <a href={`#${item.id}`} aria-current={page === item.id ? 'page' : undefined} onClick={(event) => { event.preventDefault(); onPage(item.id); setOpenMobile(false); }}>
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
              {item.badge ? (
                <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
              ) : null}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
function ProjectNav({ projects, setProjects, page, onPage }) {
  const { setOpenMobile } = useSidebar();
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const addButton = useRef(null);
  const edit = (project) => {
    setEditing(project.id);
    setName(project.name);
  };
  const finish = () => {
    setEditing(null);
    requestAnimationFrame(() => addButton.current?.focus());
  };
  const save = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    if (editing === 'new') setProjects([...projects, { id: crypto.randomUUID(), name: name.trim() }]);
    else setProjects(projects.map((entry) => (entry.id === editing ? { ...entry, name: name.trim() } : entry)));
    finish();
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupAction ref={addButton} type='button' onClick={() => edit({ id: 'new', name: '' })}>
        <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
        <span className='sr-only'>New project</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {projects.map((project) => (
            <SidebarMenuItem key={project.id}>
              <SidebarMenuButton asChild isActive={page === project.id}>
                <a
                  href={`#${project.id}`}
                  aria-current={page === project.id ? 'page' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onPage(project.id);
                    setOpenMobile(false);
                  }}
                >
                  <RegistryIcon lucide='FolderIcon' aria-hidden='true' />
                  <span>{project.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover aria-label={`Actions for ${project.name}`}>
                    <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='right' align='start'>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => edit(project)}>Rename</DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        setProjects([...projects, { id: crypto.randomUUID(), name: `${project.name} (copy)` }])
                      }
                    >
                      <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
                      Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onSelect={() => {
                        setProjects(projects.filter((entry) => entry.id !== project.id));
                        if (page === project.id) onPage('deployments');
                        finish();
                      }}
                    >
                      <RegistryIcon lucide='ArchiveIcon' aria-hidden='true' />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {editing ? (
          <form className='grid gap-2 px-2 py-2' onSubmit={save}>
            <Label>
              Project name
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </Label>
            <div className='flex gap-2'>
              <Button type='submit' size='sm' disabled={!name.trim()}>
                Save project
              </Button>
              <Button size='sm' type='button' variant='ghost' onClick={finish}>
                Cancel
              </Button>
            </div>
          </form>
        ) : null}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
function AccountMenu({ onPage }) {
  const { setOpenMobile } = useSidebar();
  const select = (id) => { onPage(id); setOpenMobile(false); };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='aria-expanded:bg-ui-sidebar-accent aria-expanded:text-ui-sidebar-accent-foreground'
            >
              <Avatar>
                <AvatarImage src='/avatars/person-41.svg' alt='' />
                <AvatarFallback>NR</AvatarFallback>
              </Avatar>
              <span className='grid min-w-0 flex-1 text-left leading-tight'>
                <span className='truncate text-sm font-medium'>
                  Nadira Rahimi
                </span>
                <span className='text-ui-sidebar-foreground truncate text-xs'>
                  nadira@example.com
                </span>
              </span>
              <RegistryIcon
                lucide='MoreHorizontalIcon'
                className='ml-auto opacity-60'
                aria-hidden='true'
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='right' align='end'>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Nadira Rahimi</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => select('profile')}>
                <RegistryIcon lucide='UserIcon' aria-hidden='true' />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => select('billing')}>
                <RegistryIcon lucide='CreditCardIcon' aria-hidden='true' />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => select('notifications')}>
                <RegistryIcon lucide='BellIcon' aria-hidden='true' />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => select('sign-out')}>
                <RegistryIcon lucide='LogOutIcon' aria-hidden='true' />
                Sign out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
function DeploymentRow({ deployment }) {
  return (
    <div className='flex items-center gap-2 text-sm'>
      {deployment.failed ? (
        <RegistryIcon
          lucide='AlertCircleIcon'
          className='text-ui-destructive size-3.5 shrink-0'
          aria-hidden='true'
        />
      ) : (
        <RegistryIcon
          lucide='CircleCheckIcon'
          className='text-success size-3.5 shrink-0'
          aria-hidden='true'
        />
      )}
      <span className='sr-only'>
        {deployment.failed ? 'Failed' : 'Succeeded'}
      </span>
      <span className='min-w-0 flex-1 truncate'>{deployment.title}</span>
      <span className='text-ui-muted-foreground hidden shrink-0 text-xs sm:inline'>
        {deployment.branch}
      </span>
      <span className='text-ui-muted-foreground shrink-0 text-xs'>
        {deployment.time}
      </span>
    </div>
  );
}
function Workbench({ workspace, page, onPage, projects, onCreateWorkspace, members, onInvite }) {
  const [value, setValue] = useState('');
  const workspaceName = workspace.name;
  const project = projects.find((entry) => entry.id === page);
  const label =
    project?.name ??
    NAV.find((entry) => entry.id === page)?.label ??
    {
      profile: 'Profile',
      billing: 'Billing',
      notifications: 'Notifications',
      'sign-out': 'Session',
      invite: 'Workspace members',
      'new-workspace': 'New workspace'
    }[page];
  return (
    <SidebarInset className='min-w-0 overflow-hidden'>
      <header className='flex h-12 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <Breadcrumb className='min-w-0 flex-1'>
          <BreadcrumbList className='flex-nowrap'>
            <BreadcrumbItem className='min-w-0'>
              <BreadcrumbLink
                href='#overview'
                className='truncate'
                onClick={(event) => {
                  event.preventDefault();
                  onPage('overview');
                }}
              >
                {workspaceName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            setValue('');
            onPage('invite');
          }}
          className='ml-auto shrink-0 whitespace-nowrap'
        >
          Invite
        </Button>
      </header>

      <div className='flex-1 overflow-auto p-4'>
        {page === 'new-workspace' || page === 'invite' ? (
          <form
            className='grid justify-items-start gap-3'
            onSubmit={(event) => {
              event.preventDefault();
              if (!value.trim()) return;
              if (page === 'new-workspace') onCreateWorkspace(value.trim());
              else onInvite(value.trim());
              setValue('');
            }}
          >
            <Label>
              {page === 'new-workspace' ? 'Workspace name' : 'Member name'}
              <Input value={value} onChange={(event) => setValue(event.target.value)} />
            </Label>
            <Button size='sm' type='submit' disabled={!value.trim()}>
              {page === 'new-workspace' ? 'Create workspace' : 'Add member locally'}
            </Button>
            {page === 'invite' ? (
              <ul aria-label='Workspace members'>
                {members.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            ) : null}
          </form>
        ) : null}
        {['deployments', 'overview', 'analytics'].includes(page) ? (
          <>
            <div className='grid gap-3 sm:grid-cols-3'>
              {STATS.map((stat) => (
                <Card key={stat.id} size='sm'>
                  <CardHeader>
                    <CardDescription>{stat.label}</CardDescription>
                    <CardTitle>{stat.value}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </>
        ) : null}
        {page === 'deployments' || page === 'logs' || project ? (
          <Card size='sm' className='mt-3'>
            <CardHeader>
              <CardTitle>
                {project
                  ? `${project.name} deployments`
                  : page === 'logs'
                    ? 'Deployment log'
                    : 'Recent deployments'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-2.5'>
                {(project ? DEPLOYMENTS.filter((item) => item.project === project.id) : DEPLOYMENTS).map(
                  (deployment) => (
                    <DeploymentRow key={deployment.id} deployment={deployment} />
                  )
                )}
              </div>
              {project && !DEPLOYMENTS.some((item) => item.project === project.id) ? (
                <p className='text-sm text-text-muted'>No deployments for this project yet.</p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
        {page === 'storage' ? <p>Local projects in this workspace: {projects.length}.</p> : null}
        {['inbox', 'notifications'].includes(page) ? <p>No new workspace messages.</p> : null}
        {page === 'profile' ? <p>Nadira Rahimi · nadira@example.com</p> : null}
        {page === 'billing' ? (
          <p>
            {workspace.name} is on the {workspace.plan} plan.
          </p>
        ) : null}
        {page === 'sign-out' ? <p>This local preview has no signed-in account.</p> : null}
      </div>
    </SidebarInset>
  );
}
export function Pattern() {
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [workspaces, setWorkspaces] = useState(WORKSPACES);
  const [byWorkspace, setByWorkspace] = useState(() =>
    Object.fromEntries(WORKSPACES.map((entry) => [entry.id, PROJECTS]))
  );
  const [memberLists, setMemberLists] = useState({});
  const [page, setPage] = useState('deployments');
  const projects = byWorkspace[workspace.id] ?? [];
  const members = memberLists[workspace.id] ?? ['Nadira Rahimi'];
  const select = (entry) => {
    setWorkspace(entry);
    setPage('deployments');
  };
  const newWorkspace = (name) => {
    const entry = { id: crypto.randomUUID(), name, initials: name[0], plan: 'Free' };
    setWorkspaces((items) => [...items, entry]);
    select(entry);
  };
  const invite = (name) => {
    if (!members.includes(name)) setMemberLists((items) => ({ ...items, [workspace.id]: [...members, name] }));
  };
  return (
    <AppShellFrame>
      <SidebarProvider className='relative h-full min-h-0 w-full overflow-hidden'>
        <Sidebar variant='inset' className='absolute h-full'>
          <SidebarHeader>
            <WorkspaceSwitcher workspace={workspace} workspaces={workspaces} onSelect={select} onNew={() => setPage('new-workspace')} />
          </SidebarHeader>

          <SidebarContent role='navigation' aria-label='Workspace'>
            <WorkspaceNav page={page} onPage={setPage} />
            <ProjectNav key={workspace.id} page={page} onPage={setPage} projects={projects} setProjects={(next) => setByWorkspace((items) => ({ ...items, [workspace.id]: next }))} />
          </SidebarContent>

          <SidebarFooter>
            <SidebarSeparator className='mx-0' />
            <AccountMenu onPage={setPage} />
          </SidebarFooter>
        </Sidebar>

        <Workbench key={`${workspace.id}-${page}`} workspace={workspace} page={page} onPage={setPage} projects={projects} onCreateWorkspace={newWorkspace} members={members} onInvite={invite} />
      </SidebarProvider>
    </AppShellFrame>
  );
}
