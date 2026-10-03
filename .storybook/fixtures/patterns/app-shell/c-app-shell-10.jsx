'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from '../../../../src/components/core/Breadcrumb/parts/breadcrumb.jsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { AppShellBody, AppShellFrame, AppShellPanel } from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { AppShellNav } from '../../../../src/components/blocks/AppShell/parts/nav.jsx';
import { AppShellNotifications } from '../../../../src/components/blocks/AppShell/parts/notifications.jsx';
import { AppShellPlaceholderGrid } from '../../../../src/components/blocks/AppShell/parts/placeholder.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const teams = ['Operations Team', 'Logistics Team', 'Field Service Team'];
const projects = ['Fleet Control', 'Depot Rollout', 'Night Shift'];
const groups = [
  {
    id: 'fleet',
    label: 'Robot Fleet',
    icon: 'Bot',
    items: ['Overview', 'Robots', 'Stations', 'Fleet Map', 'Device Groups', 'Robot Health']
  },
  { id: 'missions', label: 'Mission Control', icon: 'Route', items: ['Missions', 'Requests', 'Schedules', 'Issue Reports'] },
  {
    id: 'tools',
    label: 'System Tools',
    icon: 'Workflow',
    items: ['Integrations', 'Automations', 'Team Access', 'Activity Logs', 'API Keys']
  }
].map((group) => ({
  ...group,
  items: group.items.map((label) => ({ id: label.toLowerCase().replace(/\s+/g, '-'), label }))
}));
const apps = [
  { label: 'Inbox', icon: 'Inbox' },
  { label: 'Calendar', icon: 'Calendar' },
  { label: 'Docs', icon: 'FileText' },
  { label: 'Tasks', icon: 'ListChecks' },
  { label: 'Reports', icon: 'BarChart3' },
  { label: 'Fleet Map', icon: 'MapPin' },
  { label: 'Chat', icon: 'MessageSquare' },
  { label: 'Team', icon: 'Users' },
  { label: 'Service', icon: 'Wrench' }
];
const account = { name: 'Riley Morgan', email: 'riley@nimbusfleet.io', photo: '/avatars/men/46.jpg' };
const notifications = [
  {
    id: 'mention',
    unread: true,
    avatar: '/avatars/women/12.jpg',
    title: 'Mira Stone mentioned you in Mission #8812',
    body: 'Can you check the pallet handover at Station 12 before tonight?',
    time: '2 min ago'
  },
  {
    id: 'telemetry',
    unread: true,
    icon: 'CircleAlert',
    tone: 'warning',
    title: 'Dock 4 lost telemetry',
    badge: 'Urgent',
    body: 'No heartbeat for 6 minutes. Robots queued at the dock were rerouted.',
    actions: [
      { label: 'Reconnect', primary: true, done: 'Reconnecting' },
      { label: 'Dismiss', dismiss: true }
    ],
    time: '15 min ago'
  },
  {
    id: 'rating',
    unread: true,
    avatar: '/avatars/men/22.jpg',
    title: 'Leo Grant rated the new mission planner',
    body: 'Route previews made the night shift handover much faster.',
    rating: 4,
    time: '1 hour ago'
  },
  {
    id: 'approval',
    unread: true,
    icon: 'CircleCheck',
    tone: 'warning',
    title: 'Pending approval',
    body: 'Night Shift route change for Depot B requires your approval before rollout.',
    actions: [
      { label: 'Approve', primary: true, done: 'Approved' },
      { label: 'Review', done: 'In review' }
    ],
    time: '2 hours ago',
    meta: { label: 'Priority', value: 'High', tone: 'warning' }
  },
  {
    id: 'firmware',
    unread: true,
    icon: 'Rocket',
    tone: 'success',
    title: 'Firmware 2.4.1 rolled out',
    body: '286 robots updated to the new battery controller without downtime.',
    time: '3 hours ago'
  },
  {
    id: 'operators',
    unread: true,
    icon: 'Users',
    tone: 'success',
    title: '3 new operators joined the fleet',
    body: 'Nora, Theo and David have been added to the Night Shift roster.',
    people: [
      '/avatars/women/31.jpg',
      '/avatars/men/41.jpg',
      '/avatars/men/52.jpg'
    ],
    peopleLabel: 'Nora, Theo and David',
    time: '4 hours ago'
  },
  {
    id: 'milestone',
    icon: 'Star',
    tone: 'success',
    title: 'Charging milestone reached!',
    body: '1,000 charge cycles completed this month across the fleet.',
    progress: { value: 1000, max: 1200, label: 'Charge cycles toward the goal' },
    time: '5 hours ago',
    meta: { label: 'Goal', value: '1,200 cycles', tone: 'success' }
  },
  {
    id: 'maintenance',
    icon: 'Calendar',
    tone: 'discovery',
    title: 'Maintenance window reminder',
    body: 'Quarterly dock service for Depot B chargers.',
    schedule: { date: 'Sep 3, 2026', time: '1:00 to 3:00 AM' },
    actions: [
      { label: 'Acknowledge', primary: true, done: 'Acknowledged' },
      { label: 'Decline', dismiss: true }
    ],
    time: '6 hours ago',
    meta: { label: 'Where', value: 'Depot B', tone: 'discovery' }
  },
  {
    id: 'audit',
    avatar: '/avatars/men/52.jpg',
    title: 'David Kim shared the monthly fleet audit',
    attachment: { name: 'Fleet audit August.pdf', size: '2.4 MB' },
    time: '8 hours ago'
  }
];
const pages = groups.flatMap((group) => group.items);
const noop = (event) => event.preventDefault();
// Route rows sit indented under their group heading; the current page is a raised muted row.
const indented =
  'h-7 ps-6 text-xs text-ui-sidebar-foreground/75 data-active:text-ui-sidebar-foreground data-active:ring-1 data-active:ring-ui-sidebar-border';

function Logo() {
  return (
    <a
      href='#home'
      onClick={noop}
      className='flex shrink-0 items-center gap-2 rounded-(--ds-radius-control) outline-hidden focus-visible:ring-2 focus-visible:ring-ui-ring'
    >
      <span aria-hidden='true' className='bg-surface grid size-6 place-items-center rounded-(--ds-radius-control) border border-ui-border'>
        <RegistryIcon lucide='Command' className='size-3.5' />
      </span>
      <span className='text-xs font-semibold tracking-[0.2em] @max-xl:sr-only'>GAUDI</span>
    </a>
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

function AppsMenu() {
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
              className='bg-surface-muted/60 text-text-muted flex h-15 flex-col justify-center gap-1.5 rounded-(--ds-radius-card) border border-ui-border p-1 text-[11px]'
            >
              <RegistryIcon lucide={app.icon} aria-hidden='true' className='size-4' />
              {app.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className='-mx-2 my-2' />
        <DropdownMenuItem className='justify-center font-medium'>Browse All Apps</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SettingsMenu() {
  const [toggles, setToggles] = useState({ dispatch: true, battery: true, maintenance: false });
  const set = (key) => (value) => setToggles((state) => ({ ...state, [key]: value }));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolButton label='Open settings'>
          <RegistryIcon lucide='Settings' aria-hidden='true' />
        </ToolButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-60'>
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuItem>
          <RegistryIcon lucide='Bot' aria-hidden='true' />
          Fleet Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Building2' aria-hidden='true' />
          Station Defaults
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Bell' aria-hidden='true' />
          Alert Rules
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Operations</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={toggles.dispatch} onCheckedChange={set('dispatch')}>
          Auto-Dispatch
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={toggles.battery} onCheckedChange={set('battery')}>
          Low-Battery Return
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={toggles.maintenance} onCheckedChange={set('maintenance')}>
          Maintenance Mode
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeRow() {
  const [theme, setTheme] = useState('system');
  return (
    <div role='group' aria-label='Theme' className='flex items-center gap-2 px-2 py-1 text-sm'>
      <RegistryIcon lucide='Palette' aria-hidden='true' className='text-text-muted size-4' />
      <span aria-hidden='true'>Theme</span>
      <span className='bg-surface-muted ms-auto flex items-center gap-0.5 rounded-(--ds-radius-control) p-0.5'>
        {[
          ['light', 'Sun', 'Light theme'],
          ['dark', 'Moon', 'Dark theme'],
          ['system', 'Monitor', 'System theme']
        ].map(([value, icon, label]) => (
          <DropdownMenuItem
            key={value}
            role='menuitemradio'
            aria-checked={theme === value}
            aria-label={label}
            onSelect={(event) => {
              event.preventDefault();
              setTheme(value);
            }}
            className={`size-6 justify-center p-0 ${theme === value ? 'bg-surface shadow-xs' : ''}`}
          >
            <RegistryIcon lucide={icon} aria-hidden='true' className='size-3.5' />
          </DropdownMenuItem>
        ))}
      </span>
    </div>
  );
}

function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label='Open account menu' className='p-0'>
          <Avatar className='size-6'>
            <AvatarImage src={account.photo} alt='' />
            <AvatarFallback>RM</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-60'>
        <DropdownMenuLabel className='flex items-center gap-2 font-normal'>
          <Avatar className='size-8'>
            <AvatarImage src={account.photo} alt='' />
            <AvatarFallback>RM</AvatarFallback>
          </Avatar>
          <span className='grid min-w-0 leading-tight'>
            <span className='truncate font-medium'>{account.name}</span>
            <span className='text-text-muted truncate text-xs'>{account.email}</span>
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
            <RegistryIcon lucide='Lock' aria-hidden='true' />
            Sign-In Security
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='Users' aria-hidden='true' />
            Manage Accounts
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='Settings' aria-hidden='true' />
            Preferences
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <RegistryIcon lucide='BookOpen' aria-hidden='true' />
            Documentation
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RegistryIcon lucide='LifeBuoy' aria-hidden='true' />
            Help & Support
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ThemeRow />
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

function NewMissionMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='gap-1 data-[state=open]:bg-surface-muted'>
          <span>New</span>
          <span className='hidden @xl:inline'>Mission</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuLabel>Start From</DropdownMenuLabel>
        <DropdownMenuItem>
          <RegistryIcon lucide='Route' aria-hidden='true' />
          Transport Run
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='ScanSearch' aria-hidden='true' />
          Inspection Sweep
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Zap' aria-hidden='true' />
          Recharge Cycle
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TopBar({ team, project, onTeam, onProject }) {
  const { isMobile } = useSidebar();
  return (
    <header className='@container flex h-13 shrink-0 items-center gap-3 border-b border-ui-border px-4 @lg:px-6'>
      {isMobile ? <SidebarTrigger className='-ms-1' /> : null}
      <Logo />
      {isMobile ? null : (
        <>
          <span aria-hidden='true' className='h-3.5 w-px shrink-0 bg-ui-border' />
          <Breadcrumb className='min-w-0'>
            <BreadcrumbList className='flex-nowrap gap-1'>
              <BreadcrumbItem>
                <Switcher label='Team' value={team} options={teams} onChange={onTeam} />
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <Switcher label='Project' value={project} options={projects} onChange={onProject} />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}
      <div role='toolbar' aria-label='Workspace actions' className='ms-auto flex shrink-0 items-center gap-1'>
        <AppsMenu />
        <SettingsMenu />
        <AppShellNotifications defaultItems={notifications} triggerClassName='text-text-muted' />
        <AccountMenu />
        <span className='ms-1.5'>
          <NewMissionMenu />
        </span>
      </div>
    </header>
  );
}

function UpgradeCard() {
  return (
    <div className='bg-surface relative overflow-hidden rounded-(--ds-radius-card) border border-ui-border px-4 py-4 text-center shadow-xs'>
      {/* A faint grid drawn from the border token. */}
      <span
        aria-hidden='true'
        className='absolute inset-0 opacity-40'
        style={{
          backgroundImage:
            'linear-gradient(var(--ds-color-border) 1px, transparent 1px), linear-gradient(90deg, var(--ds-color-border) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
          maskImage: 'linear-gradient(to bottom, black, transparent)'
        }}
      />
      <div className='relative flex flex-col items-center gap-1'>
        <span
          aria-hidden='true'
          className='bg-surface-muted mb-2 grid size-11 place-items-center rounded-(--ds-radius-card) border border-ui-border'
        >
          <span className='bg-surface grid size-8 place-items-center rounded-(--ds-radius-control) shadow-xs'>
            <RegistryIcon lucide='Bot' className='size-4' />
          </span>
        </span>
        <p className='text-sm font-medium'>Integrations</p>
        <p className='text-text-muted text-xs'>Connect more tools to your fleet on Pro</p>
        <Button variant='solid' tone='neutral' size='xs' className='mt-2'>
          Upgrade
        </Button>
      </div>
    </div>
  );
}

function SheetSwitchers({ team, project, onTeam, onProject }) {
  const { isMobile } = useSidebar();
  if (!isMobile) return null;
  return (
    <SidebarHeader className='gap-1 px-4 pt-4'>
      <Switcher block label='Team' value={team} options={teams} onChange={onTeam} />
      <Switcher block label='Project' value={project} options={projects} onChange={onProject} />
    </SidebarHeader>
  );
}

export function Pattern() {
  const [page, setPage] = useState('stations');
  const [team, setTeam] = useState(teams[0]);
  const [project, setProject] = useState(projects[0]);
  const current = pages.find((entry) => entry.id === page);
  return (
    <AppShellFrame>
      {/* The top bar spans the window; the sidebar and page share the row below it. */}
      <SidebarProvider shortcut={false} className='flex-col'>
        <TopBar team={team} project={project} onTeam={setTeam} onProject={setProject} />
        <div className='relative flex min-h-0 flex-1'>
          <Sidebar>
            <SheetSwitchers team={team} project={project} onTeam={setTeam} onProject={setProject} />
            <SidebarContent role='navigation' aria-label='Fleet routes' className='gap-1 px-4 py-4'>
              {groups.map((group) => (
                <AppShellNav
                  key={group.id}
                  label={group.label}
                  labelIcon={group.icon}
                  labelClassName='h-7 px-0 text-sm text-ui-sidebar-foreground'
                  className='p-0'
                  items={group.items}
                  value={page}
                  onValueChange={setPage}
                  itemClassName={indented}
                />
              ))}
            </SidebarContent>
            <SidebarFooter className='p-4 pt-2'>
              <UpgradeCard />
            </SidebarFooter>
          </Sidebar>
          <AppShellPanel inset={false} aria-label={current?.label}>
            <AppShellBody className='px-4 py-4 @lg:px-6 @lg:py-6'>
              <AppShellPlaceholderGrid preset='tiles' variant='solid' />
            </AppShellBody>
          </AppShellPanel>
        </div>
      </SidebarProvider>
    </AppShellFrame>
  );
}
