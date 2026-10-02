'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
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
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../../../../src/components/core/Commander/parts/command.jsx';
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
import { default as Kbd } from '../../../../src/components/core/Kbd/index.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../src/components/core/Popover/parts/popover.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { ProgressRing } from '../../../../src/components/core/Progress/parts/progress-ring.jsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
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
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import {
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel,
  useAppShellFrame
} from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { AppShellNav } from '../../../../src/components/blocks/AppShell/parts/nav.jsx';
import { AppShellPlaceholderGrid } from '../../../../src/components/blocks/AppShell/parts/placeholder.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { useHotkey } from '../../../../src/hooks/interaction/use-hotkey.js';
import { ClaudeAiIcon } from '../../../../src/icons/brands/claudeAiIcon.jsx';
import { Openai } from '../../../../src/icons/brands/openai.jsx';
import { Stripe } from '../../../../src/icons/brands/stripe.jsx';

const portrait = (path) => `https://randomuser.me/api/portraits/${path}.jpg`;
const organizations = [
  { id: 'claude', name: 'Claude', plan: 'Enterprise', Logo: ClaudeAiIcon },
  { id: 'stripe', name: 'Stripe', plan: 'Pro', Logo: Stripe },
  { id: 'openai', name: 'OpenAI', plan: 'Team', Logo: Openai }
];
const platform = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'projects', label: 'Projects', icon: 'Folder' },
  { id: 'my-tasks', label: 'My Tasks', icon: 'SquareCheck' },
  {
    id: 'issues',
    label: 'Issues',
    icon: 'CircleDot',
    items: [
      { id: 'backlog', label: 'Backlog' },
      { id: 'in-progress', label: 'In Progress' },
      { id: 'resolved', label: 'Resolved' }
    ]
  },
  {
    id: 'team',
    label: 'Team',
    icon: 'Users',
    items: [
      { id: 'members', label: 'Members' },
      { id: 'workload', label: 'Workload' },
      { id: 'permissions', label: 'Permissions' }
    ]
  },
  { id: 'reports', label: 'Reports', icon: 'BarChart3' }
];
// Each active project shows its progress as a ring; the percentage is spoken with the name.
const ring = (value, tone) => (
  <span aria-hidden='true' className='ms-0.5 me-0.5 flex shrink-0'>
    <ProgressRing value={value} tone={tone} size='xs' label='' />
  </span>
);
const initialProjects = [
  { id: 'design-system', label: 'Design System', leading: ring(72, 'info'), status: '72% complete' },
  { id: 'api-integration', label: 'API Integration', leading: ring(35, 'discovery'), status: '35% complete' },
  { id: 'mobile-app', label: 'Mobile App', leading: ring(100, 'success'), status: 'complete' },
  { id: 'analytics-dashboard', label: 'Analytics Dashboard', leading: ring(18, 'warning'), status: '18% complete' },
  { id: 'auth-module', label: 'Auth Module', leading: ring(64, 'attention'), status: '64% complete' }
];
const pages = platform.flatMap((item) => (item.items ? item.items.map((child) => ({ ...child, section: item.label })) : [item]));

const initialNotifications = [
  { id: 'mention', kind: 'mention', unread: true, photo: portrait('women/65'), title: '@sarah_smith mentioned you in #PR-1024', body: '“Can you review the changes?”', time: '2m ago' },
  { id: 'approval', kind: 'approval', unread: true, icon: 'CircleCheck', tone: 'text-warning', title: 'Pending approval', body: 'Design System v2.0 release requires your approval before deployment.', time: '5m ago', meta: ['Priority', 'High'] },
  { id: 'file', kind: 'file', unread: true, photo: portrait('men/32'), title: '@maverick shared Project Timeline', file: 'project-plan.pdf', size: '2 MB', time: '15m ago' },
  { id: 'task', kind: 'task', unread: true, icon: 'SquareCheck', tone: 'text-info', title: 'Task assigned to you', body: 'Implement the user authentication flow for the mobile app.', time: '30m ago', meta: ['Due', 'Tomorrow'] },
  { id: 'joined', kind: 'joined', unread: true, icon: 'Users', tone: 'text-success', title: '4 people joined your workspace', body: 'Sarah, Mike, Emma and James just joined Gaudi Pro.', time: '45m ago', people: ['women/44', 'men/46', 'women/12'] },
  { id: 'event', kind: 'event', icon: 'Calendar', tone: 'text-discovery', title: 'Upcoming event reminder', body: 'Design system review with the product team.', time: '3h ago', when: ['Mar 3, 2026', '10:00 to 11:00 AM'] },
  { id: 'milestone', kind: 'milestone', icon: 'Award', tone: 'text-success', title: 'Monthly milestone reached!', body: '100 of 100 tasks completed this month. Outstanding work!', time: '4h ago', meta: ['Goal', '100 tasks'] },
  { id: 'payment', kind: 'plain', icon: 'CreditCard', tone: 'text-text-muted', title: 'Payment processed · $49.00', body: 'Your monthly subscription was renewed.', time: 'Yesterday' },
  { id: 'sign-in', kind: 'plain', icon: 'ShieldAlert', tone: 'text-attention', title: 'New sign-in detected', body: 'We noticed a new login from macOS, Chrome.', time: 'Yesterday' }
];

function Meta({ items }) {
  if (!items) return null;
  return (
    <span className='border-ui-border inline-flex items-center overflow-hidden rounded-(--ds-radius-control) border text-xs'>
      <span className='bg-ui-muted text-text-muted px-1.5 py-0.5'>{items[0]}</span>
      <span className='px-1.5 py-0.5 font-medium'>{items[1]}</span>
    </span>
  );
}

function NotificationItem({ item, onResolve }) {
  return (
    <li className='border-ui-border relative flex gap-3 border-b px-4 py-3 last:border-b-0'>
      {item.photo ? (
        <Avatar className='size-7'>
          <AvatarImage src={item.photo} alt='' />
          <AvatarFallback>{item.title.slice(1, 3)}</AvatarFallback>
        </Avatar>
      ) : (
        <span aria-hidden='true' className={`grid size-7 shrink-0 place-items-center ${item.tone}`}>
          <RegistryIcon lucide={item.icon} className='size-4' />
        </span>
      )}
      <div className='grid min-w-0 flex-1 gap-1.5 text-sm'>
        <p className='pe-4 font-medium leading-snug'>
          {item.title}
          {item.unread ? <span className='sr-only'> (unread)</span> : null}
        </p>
        {item.body ? <p className='text-text-muted leading-snug'>{item.body}</p> : null}
        {item.kind === 'approval' ? (
          item.resolved ? (
            <Badge variant='success-light' className='w-fit'>
              <RegistryIcon lucide='Check' aria-hidden='true' />
              {item.resolved}
            </Badge>
          ) : (
            <div className='flex gap-1.5'>
              <Button size='xs' onClick={() => onResolve(item.id, 'Approved')}>Approve</Button>
              <Button size='xs' variant='outline' onClick={() => onResolve(item.id, 'In review')}>Review</Button>
            </div>
          )
        ) : null}
        {item.file ? (
          <span className='border-ui-border flex w-fit items-center gap-1.5 rounded-(--ds-radius-control) border ps-2 text-xs'>
            <RegistryIcon lucide='Paperclip' aria-hidden='true' className='size-3.5' />
            <span className='font-medium'>{item.file}</span>
            <span className='text-text-muted'>({item.size})</span>
            <Button size='icon-xs' variant='ghost' aria-label={`Download ${item.file}`}>
              <RegistryIcon lucide='Download' aria-hidden='true' />
            </Button>
          </span>
        ) : null}
        {item.people ? (
          <AvatarGroup>
            {item.people.map((path) => (
              <Avatar key={path} className='size-6'>
                <AvatarImage src={portrait(path)} alt='' />
                <AvatarFallback>·</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount className='bg-ui-muted size-6 rounded-full text-xs' aria-label='1 more'>+1</AvatarGroupCount>
          </AvatarGroup>
        ) : null}
        {item.when ? (
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='border-ui-border flex items-center gap-1.5 rounded-(--ds-radius-control) border px-2 py-0.5 text-xs'>
              <RegistryIcon lucide='Calendar' aria-hidden='true' className='size-3.5' />
              <span className='font-medium'>{item.when[0]}</span>
              <span className='text-text-muted'>{item.when[1]}</span>
            </span>
            <Button size='xs'>Join</Button>
            <Button size='xs' variant='outline'>Decline</Button>
          </div>
        ) : null}
        {item.kind === 'milestone' ? (
          <Progress value={100} aria-label='Monthly goal' className='bg-ui-muted h-1.5 rounded-full [&>[data-slot=progress-indicator]]:bg-success' />
        ) : null}
        <div className='text-text-muted flex flex-wrap items-center gap-2 text-xs'>
          <span>{item.time}</span>
          <Meta items={item.meta} />
        </div>
      </div>
      {item.unread ? <span aria-hidden='true' className='bg-ui-foreground absolute top-4 end-4 size-1.5 rounded-full' /> : null}
    </li>
  );
}

function NotificationsPopover() {
  const { isMobile, state } = useSidebar();
  const [items, setItems] = useState(initialNotifications);
  const unread = items.filter((item) => item.unread).length;
  const resolve = (id, label) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, resolved: label, unread: false } : item)));
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant='ghost' size='icon-sm' aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} className='relative'>
              <RegistryIcon lucide='Bell' aria-hidden='true' />
              {unread ? <span aria-hidden='true' className='bg-ui-foreground absolute top-1 end-1.5 size-1.5 rounded-full' /> : null}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side={state === 'collapsed' ? 'right' : 'bottom'}>Notifications</TooltipContent>
      </Tooltip>
      <PopoverContent
        side={isMobile ? 'bottom' : state === 'collapsed' ? 'right' : 'bottom'}
        align='start'
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
            <NotificationItem key={item.id} item={item} onResolve={resolve} />
          ))}
        </ul>
        <div className='border-ui-border border-t p-1'>
          <Button variant='ghost' size='sm' className='w-full'>
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Brand() {
  return (
    <div className='flex items-center gap-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2'>
      <a
        href='#dashboard'
        className='focus-visible:ring-ui-sidebar-ring flex min-w-0 flex-1 items-center gap-2 rounded-(--ds-radius-control) p-1 text-sm font-semibold outline-hidden focus-visible:ring-2 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:p-0'
        onClick={(event) => event.preventDefault()}
      >
        <span aria-hidden='true' className='bg-ui-foreground text-ui-background grid size-7 shrink-0 place-items-center rounded-(--ds-radius-control)'>
          <RegistryIcon lucide='Command' className='size-4' />
        </span>
        <span className='truncate group-data-[collapsible=icon]:sr-only'>Gaudi</span>
      </a>
      <NotificationsPopover />
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

function SpendingLimit() {
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <section aria-labelledby='app-shell-3-spending' className='bg-ui-muted border-ui-border rounded-(--ds-radius-card) border'>
        <h2 id='app-shell-3-spending' className='text-ui-warning-ink px-2.5 py-1.5 text-xs font-semibold'>
          Spending Limit
        </h2>
        <div className='bg-ui-background border-ui-border -m-px grid gap-2 rounded-(--ds-radius-card) border p-2.5'>
          <p className='text-text-muted text-xs leading-snug'>Consumption and balance will be reset at the end of the month</p>
          <Progress value={82} aria-label='Spending used' className='bg-ui-muted h-1.5 rounded-full [&>[data-slot=progress-indicator]]:bg-success' />
          <div className='flex justify-between text-xs'>
            <span><b className='font-semibold'>82%</b> <span className='text-text-muted'>Used</span></span>
            <span><b className='font-semibold'>18%</b> <span className='text-text-muted'>Free</span></span>
          </div>
        </div>
      </section>
    </SidebarGroup>
  );
}

function OrganizationMenu({ organization, onChange }) {
  const { isMobile } = useSidebar();
  const [theme, setTheme] = useState('system');
  const { Logo } = organization;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' aria-label={`Organization: ${organization.name}`} className='data-[state=open]:bg-ui-sidebar-accent'>
              <span aria-hidden='true' className='grid size-6 shrink-0 place-items-center group-data-[collapsible=icon]:size-4'>
                <Logo className='size-5 group-data-[collapsible=icon]:size-4' />
              </span>
              <span className='truncate font-medium'>{organization.name}</span>
              <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' className='ms-auto opacity-60' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-60'>
            <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Organizations</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={organization.id} onValueChange={(id) => onChange(organizations.find((entry) => entry.id === id))}>
              {organizations.map((entry) => (
                <DropdownMenuRadioItem key={entry.id} value={entry.id} className='gap-2'>
                  <entry.Logo aria-hidden='true' className='size-5' />
                  <span className='grid leading-tight'>
                    {entry.name}
                    <span className='text-text-muted text-xs'>{entry.plan}</span>
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuItem>
              <RegistryIcon lucide='Plus' aria-hidden='true' />
              New Organization
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon lucide='User' aria-hidden='true' />
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='CreditCard' aria-hidden='true' />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='Settings' aria-hidden='true' />
                Preferences
              </DropdownMenuItem>
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
            </DropdownMenuGroup>
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
                  href='#dashboard'
                  className='flex items-center gap-1.5'
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate('dashboard');
                  }}
                >
                  <RegistryIcon lucide='House' aria-hidden='true' className='size-4' />
                  Home
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

/** ⌘K / Ctrl+K opens the palette while the reader works inside this window. */
function SearchPalette({ open, onOpenChange, onSelect, children }) {
  const frame = useAppShellFrame();
  const shortcut = useHotkey('mod+k', () => onOpenChange(!open), { enableInInputs: true, target: frame?.container ?? null });
  return (
    <>
      {children(shortcut)}
      <CommandDialog open={open} onOpenChange={onOpenChange} title='Search' description='Search your workspace content.'>
        <Command>
          <CommandInput placeholder='Type to search...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Pages'>
              {pages.map((entry) => (
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
  const [organization, setOrganization] = useState(organizations[0]);
  const [projects, setProjects] = useState(initialProjects);
  const [searchOpen, setSearchOpen] = useState(false);
  const label = [...pages, ...projects].find((entry) => entry.id === page)?.label ?? 'Overview';
  const projectActions = (item) => (
    <>
      <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Actions</DropdownMenuLabel>
      <DropdownMenuItem onSelect={() => setPage(item.id)}>
        <RegistryIcon lucide='ExternalLink' aria-hidden='true' />
        Open Project
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='UserPlus' aria-hidden='true' />
        Assign Members
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='Flag' aria-hidden='true' />
        Set Milestone
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='Copy' aria-hidden='true' />
        Duplicate
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant='destructive' onSelect={() => setProjects((list) => list.filter((entry) => entry.id !== item.id))}>
        <RegistryIcon lucide='Archive' aria-hidden='true' />
        Archive
      </DropdownMenuItem>
    </>
  );
  return (
    <AppShellFrame>
      <SidebarProvider shortcut={false}>
        <SearchPalette
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
                <Brand />
                <SearchButton onOpen={() => setSearchOpen(true)} shortcut={shortcut} />
              </SidebarHeader>
              <SidebarContent role='navigation' aria-label='Workspace'>
                <AppShellNav label='Platform' items={platform} value={page} onValueChange={setPage} />
                <AppShellNav
                  label='Active Projects'
                  collapsible
                  hideOnRail
                  items={projects}
                  value={page}
                  onValueChange={setPage}
                  actions={projectActions}
                />
                <div className='mt-auto'>
                  <SpendingLimit />
                </div>
              </SidebarContent>
              <SidebarFooter>
                <OrganizationMenu organization={organization} onChange={setOrganization} />
              </SidebarFooter>
              <SidebarRail handle />
            </Sidebar>
          )}
        </SearchPalette>
        <AppShellPanel>
          <PageHeader page={label} onNavigate={setPage} />
          <AppShellBody>
            <AppShellPlaceholderGrid preset='dashboard' variant='solid' />
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
