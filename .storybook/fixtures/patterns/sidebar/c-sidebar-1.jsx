'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
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
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const WORKSPACES = [
  {
    id: 'gaudi-workspace',
    name: 'Gaudi Workspace',
    plan: 'Pro',
    initials: 'RL',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 'acme',
    name: 'Gaudi',
    plan: 'Team',
    initials: 'GA',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 'personal',
    name: 'Personal',
    plan: 'Free',
    initials: 'PS',
    avatar:
      'https://randomuser.me/api/portraits/men/11.jpg'
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
    id: 'd-4821',
    title: 'Tighten the webhook retry window',
    branch: 'main',
    time: '12m ago'
  },
  {
    id: 'd-4820',
    title: 'Split the pricing bundle',
    branch: 'release/2.8',
    time: '1h ago'
  },
  {
    id: 'd-4819',
    title: 'Move invoices to the edge cache',
    branch: 'feat/edge',
    time: '3h ago',
    failed: true
  },
  {
    id: 'd-4818',
    title: 'Add locale fallbacks to search',
    branch: 'main',
    time: 'Yesterday'
  }
];
const STATS = [
  { id: 'build', label: 'Build time', value: '42s' },
  { id: 'success', label: 'Success rate', value: '99.2%' },
  { id: 'prs', label: 'Open PRs', value: '7' }
];
function BrandMark({ className }) {
  return (
    <span
      aria-hidden='true'
      className={cn(
        'bg-ui-sidebar-primary text-ui-sidebar-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-md',
        className
      )}
    >
      <svg
        viewBox='25.5002 25.1352 50 50'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='size-3'
      >
        <circle cx='70.634' cy='29.8334' r='4.69799' fill='currentColor' />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M25.668 57.0144V29.8332C25.668 27.2386 27.7713 25.1352 30.366 25.1352C32.9606 25.1352 35.0639 27.2386 35.0639 29.8332V57.0144C35.0639 61.833 38.9702 65.7392 43.7888 65.7392H57.2116C62.0302 65.7392 65.9364 61.833 65.9364 57.0144V43.7258C65.9364 41.1312 68.0398 39.0278 70.6344 39.0278C73.229 39.0278 75.3324 41.1312 75.3324 43.7258V57.0144C75.3324 67.0222 67.2194 75.1352 57.2116 75.1352H43.7888C33.7809 75.1352 25.668 67.0222 25.668 57.0144Z'
          fill='currentColor'
        />
      </svg>
    </span>
  );
}
function WorkspaceSwitcher({ workspace, onSelect }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='aria-expanded:bg-ui-sidebar-accent aria-expanded:text-ui-sidebar-accent-foreground'
            >
              <BrandMark className='size-8 rounded-lg [&>svg]:size-4' />
              <span className='grid min-w-0 flex-1 text-left leading-tight'>
                <span className='truncate text-sm font-medium'>
                  {workspace.name}
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
              {WORKSPACES.map((item) => (
                <DropdownMenuItem key={item.id} onClick={() => onSelect(item)}>
                  <Avatar size='sm'>
                    <AvatarImage src={item.avatar} alt='' />
                    <AvatarFallback>{item.initials}</AvatarFallback>
                  </Avatar>
                  <span className='truncate'>{item.name}</span>
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
              <DropdownMenuItem>
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
function WorkspaceNav() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild isActive={item.isActive}>
                <a href='#'>
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
function ProjectNav() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupAction type='button'>
        <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
        <span className='sr-only'>New project</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {PROJECTS.map((project) => (
            <SidebarMenuItem key={project.id}>
              <SidebarMenuButton asChild>
                <a href='#'>
                  <RegistryIcon lucide='FolderIcon' aria-hidden='true' />
                  <span>{project.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    aria-label={`Actions for ${project.name}`}
                  >
                    <RegistryIcon
                      lucide='MoreHorizontalIcon'
                      aria-hidden='true'
                    />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='right' align='start'>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>
                      <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
                      Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <RegistryIcon lucide='ArchiveIcon' aria-hidden='true' />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
function AccountMenu() {
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
                <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' alt='' />
                <AvatarFallback>NR</AvatarFallback>
              </Avatar>
              <span className='grid min-w-0 flex-1 text-left leading-tight'>
                <span className='truncate text-sm font-medium'>
                  Nadia Rahman
                </span>
                <span className='text-ui-sidebar-foreground truncate text-xs'>
                  nadia@example.com
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
              <DropdownMenuLabel>Nadia Rahman</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon lucide='UserIcon' aria-hidden='true' />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='CreditCardIcon' aria-hidden='true' />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='BellIcon' aria-hidden='true' />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
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
function Workbench({ workspaceName }) {
  return (
    <SidebarInset className='min-w-0 overflow-hidden'>
      <header className='flex h-12 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <Breadcrumb className='min-w-0 flex-1'>
          <BreadcrumbList className='flex-nowrap'>
            <BreadcrumbItem className='min-w-0'>
              <BreadcrumbLink href='#' className='truncate'>
                {workspaceName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Deployments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button variant='outline' size='sm' className='ml-auto shrink-0 whitespace-nowrap'>
          Invite
        </Button>
      </header>

      <div className='flex-1 overflow-auto p-4'>
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

        <Card size='sm' className='mt-3'>
          <CardHeader>
            <CardTitle>Recent deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-2.5'>
              {DEPLOYMENTS.map((deployment) => (
                <DeploymentRow key={deployment.id} deployment={deployment} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
export function Pattern() {
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  return (
    <SidebarProvider className='relative h-dvh min-h-0 w-full overflow-hidden'>
      <Sidebar variant='inset' className='absolute h-full'>
        <SidebarHeader>
          <WorkspaceSwitcher workspace={workspace} onSelect={setWorkspace} />
        </SidebarHeader>

        <SidebarContent role='navigation' aria-label='Workspace'>
          <WorkspaceNav />
          <ProjectNav />
        </SidebarContent>

        <SidebarFooter>
          {/*
      `mx-0` is a fix, not a preference. SidebarSeparator ships `w-auto`
      to undo Separator's `data-horizontal:w-full`, but a variant
      selector outranks a plain utility, so the rule stays full width and
      the primitive's own `mx-2` then pushes it 8px past the panel's
      right edge while leaving a 16px gap on the left. Zeroing the margin
      lines it up with the footer's own padding.
    */}
          <SidebarSeparator className='mx-0' />
          <AccountMenu />
        </SidebarFooter>
      </Sidebar>

      <Workbench workspaceName={workspace.name} />
    </SidebarProvider>
  );
}
