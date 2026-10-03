'use client';
import { useMemo, useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../../../../src/components/core/Sheet/parts/sheet.jsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { AppShellBody, AppShellFrame, AppShellPanel, useAppShellFrame } from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { AppShellNav } from '../../../../src/components/blocks/AppShell/parts/nav.jsx';
import { AppShellNotifications } from '../../../../src/components/blocks/AppShell/parts/notifications.jsx';
import { AppShellPlaceholderGrid } from '../../../../src/components/blocks/AppShell/parts/placeholder.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const sections = [
  { id: 'fleet', label: 'Fleet', icon: 'Bot' },
  { id: 'missions', label: 'Missions', icon: 'Route' },
  { id: 'stations', label: 'Stations', icon: 'Radio' },
  { id: 'maintenance', label: 'Maintenance', icon: 'Wrench' },
  { id: 'reports', label: 'Reports', icon: 'FileText' }
];
const groups = [
  {
    label: 'Fleet Overview',
    items: [
      ['Overview', 'LayoutDashboard'],
      ['Live Map', 'MapPin'],
      ['All Robots', 'Bot'],
      ['Robot Groups', 'Package'],
      ['Zones', 'Layers'],
      ['Assignments', 'ClipboardList']
    ]
  },
  {
    label: 'Fleet Activity',
    items: [
      ['Live Status', 'Activity'],
      ['Access Requests', 'KeyRound'],
      ['Alerts', 'CircleAlert'],
      ['Event Feed', 'History']
    ]
  },
  {
    label: 'Fleet Settings',
    items: [
      ['Robot Profiles', 'UserRound'],
      ['Tags & Labels', 'Tag'],
      ['Access Rules', 'ShieldCheck'],
      ['Data Sync', 'RefreshCw'],
      ['Fleet Preferences', 'SlidersHorizontal']
    ]
  }
].map((group) => ({
  ...group,
  items: group.items.map(([label, icon]) => ({ id: label.toLowerCase().replace(/[^a-z]+/g, '-'), label, icon }))
}));
const routes = groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.label })));
const account = {
  name: 'Ava Brooks',
  role: 'Fleet Operations Lead',
  email: 'ava@nimbusfleet.io',
  photo: '/avatars/women/79.jpg'
};
const statuses = [
  { id: 'none', label: 'No Status', dot: 'border border-text-muted' },
  { id: 'online', label: 'Online', dot: 'bg-success' },
  { id: 'away', label: 'Away', dot: 'bg-warning' },
  { id: 'offline', label: 'Offline', dot: 'bg-ui-destructive' }
];
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
const noop = (event) => event.preventDefault();
// The current route is a raised row: the muted fill with a hairline.
const raised = 'data-active:ring-1 data-active:ring-ui-sidebar-border';

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

function SectionPills({ section, onSection }) {
  return (
    <nav aria-label='Fleet sections' className='min-w-0'>
      <ul className='flex items-center gap-1'>
        {sections.map((item) => {
          const current = item.id === section;
          return (
            <li key={item.id}>
              <Button
                variant='ghost'
                size='sm'
                aria-current={current ? 'page' : undefined}
                onClick={() => onSection(item.id)}
                className={current ? 'bg-surface-muted border border-ui-border text-text' : 'text-text-muted border border-transparent'}
              >
                <RegistryIcon lucide={item.icon} aria-hidden='true' />
                {item.label}
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Below the wide layout the pills fold into a bottom sheet behind one button. */
function SectionsSheet({ section, onSection }) {
  const frame = useAppShellFrame();
  const [open, setOpen] = useState(false);
  const current = sections.find((item) => item.id === section);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label={`Fleet sections: ${current.label}`}>
          <RegistryIcon lucide='Menu' aria-hidden='true' />
        </Button>
      </SheetTrigger>
      <SheetContent
        side='bottom'
        container={frame?.container ?? undefined}
        showCloseButton={false}
        className='gap-0 rounded-t-(--ds-radius-card) p-2'
      >
        <SheetHeader className='sr-only'>
          <SheetTitle>Fleet Sections</SheetTitle>
          <SheetDescription>Jump to a fleet section.</SheetDescription>
        </SheetHeader>
        <span aria-hidden='true' className='bg-ui-border mx-auto mb-2 h-1 w-24 rounded-(--ds-radius-pill)' />
        <nav aria-label='Fleet sections'>
          <ul className='grid gap-0.5'>
            {sections.map((item) => (
              <li key={item.id}>
                <Button
                  variant='ghost'
                  aria-current={item.id === section ? 'page' : undefined}
                  className={`w-full justify-start ${item.id === section ? 'bg-surface-muted' : 'text-text-muted'}`}
                  onClick={() => {
                    onSection(item.id);
                    setOpen(false);
                  }}
                >
                  <RegistryIcon lucide={item.icon} aria-hidden='true' />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
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
          <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
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

function AccountHeader() {
  return (
    <DropdownMenuLabel className='flex items-center gap-2 font-normal'>
      <Avatar className='size-8'>
        <AvatarImage src={account.photo} alt='' />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <span className='grid min-w-0 leading-tight'>
        <span className='truncate font-medium'>{account.name}</span>
        <span className='text-text-muted truncate text-xs'>{account.email}</span>
      </span>
    </DropdownMenuLabel>
  );
}

function StatusMenu() {
  const [status, setStatus] = useState('none');
  const current = statuses.find((entry) => entry.id === status);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label={`Account and status for ${account.name}: ${current.label}`} className='p-0'>
          <Avatar className='size-6'>
            <AvatarImage src={account.photo} alt='' />
            <AvatarFallback>AB</AvatarFallback>
            {status === 'none' ? null : <AvatarBadge className={`${current.dot} ring-ui-background`} />}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-64'>
        <AccountHeader />
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
          {statuses.map((entry) => (
            <DropdownMenuRadioItem key={entry.id} value={entry.id} className='gap-2'>
              <span aria-hidden='true' className={`size-2 shrink-0 rounded-full ${entry.dot}`} />
              {entry.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem>
          <RegistryIcon lucide='User' aria-hidden='true' />
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='CalendarClock' aria-hidden='true' />
          Shift Roster
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Settings' aria-hidden='true' />
          Preferences
        </DropdownMenuItem>
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

function TopBar({ section, onSection, onSearch }) {
  const { isMobile } = useSidebar();
  return (
    <header className='@container flex h-13 shrink-0 items-center gap-2 border-b border-ui-border px-4 @lg:px-6'>
      {isMobile ? <SidebarTrigger className='-ms-1' /> : null}
      <span className='@4xl:hidden'>
        <SectionsSheet section={section} onSection={onSection} />
      </span>
      <a
        href='#home'
        aria-label='Nimbus Fleet home'
        onClick={noop}
        className='bg-surface hidden size-6 @xs:grid shrink-0 place-items-center rounded-(--ds-radius-control) border border-ui-border outline-hidden focus-visible:ring-2 focus-visible:ring-ui-ring'
      >
        <RegistryIcon lucide='Command' aria-hidden='true' className='size-3.5' />
      </a>
      <span aria-hidden='true' className='hidden h-3.5 w-px shrink-0 bg-ui-border @4xl:block' />
      <div className='hidden min-w-0 @4xl:block'>
        <SectionPills section={section} onSection={onSection} />
      </div>
      <div role='toolbar' aria-label='Workspace actions' className='ms-auto flex shrink-0 items-center gap-1'>
        <ToolButton label='Search fleet pages' onClick={onSearch}>
          <RegistryIcon lucide='Search' aria-hidden='true' />
        </ToolButton>
        <SettingsMenu />
        <AppShellNotifications inset defaultItems={notifications} triggerClassName='text-text-muted' />
        <StatusMenu />
        <span className='ms-1.5'>
          <NewMissionMenu />
        </span>
      </div>
    </header>
  );
}

function AccountCard() {
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' variant='outline' aria-label={`Open account menu for ${account.name}`} className='h-10'>
              <Avatar className='size-6'>
                <AvatarImage src={account.photo} alt='' />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <span className='grid min-w-0 flex-1 leading-tight'>
                <span className='truncate text-xs font-medium'>{account.name}</span>
                <span className='text-text-muted truncate text-[10px]'>{account.role}</span>
              </span>
              <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='opacity-60' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-60'>
            <AccountHeader />
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
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon lucide='CalendarClock' aria-hidden='true' />
                Shift Roster
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
                Runbooks
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function RouteSearch({ open, onOpenChange, onSelect }) {
  const [term, setTerm] = useState('');
  const results = useMemo(() => {
    const query = term.trim().toLowerCase();
    return groups
      .map((group) => ({ ...group, items: group.items.filter((item) => item.label.toLowerCase().includes(query)) }))
      .filter((group) => group.items.length);
  }, [term]);
  const count = results.reduce((sum, group) => sum + group.items.length, 0);
  return (
    <CommandDialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) setTerm('');
      }}
      title='Search Fleet'
      description='Find a fleet page by name.'
      showCloseButton
      footer={null}
    >
      <Command shouldFilter={false}>
        <CommandInput placeholder='Search fleet pages...' value={term} onValueChange={setTerm} />
        <p role='status' className='sr-only'>
          {count} {count === 1 ? 'result' : 'results'}
        </p>
        <CommandList>
          <CommandEmpty>No pages match.</CommandEmpty>
          {results.map((group) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.items.map((item) => (
                <CommandItem key={item.id} value={item.id} onSelect={() => onSelect(item.id)}>
                  <RegistryIcon lucide={item.icon} aria-hidden='true' />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

export function Pattern() {
  const [page, setPage] = useState('overview');
  const [section, setSection] = useState('fleet');
  const [searchOpen, setSearchOpen] = useState(false);
  const current = routes.find((item) => item.id === page);
  return (
    <AppShellFrame surface='default'>
      <SidebarProvider shortcut={false} className='flex-col' style={{ '--sidebar-width': '13rem' }}>
        <TopBar section={section} onSection={setSection} onSearch={() => setSearchOpen(true)} />
        <div className='relative flex min-h-0 flex-1'>
          <Sidebar mobileTitle='Fleet Navigation' mobileDescription='Fleet sections and routes.'>
            <SidebarContent role='navigation' aria-label='Fleet routes' className='gap-2 px-2 py-2'>
              {groups.map((group) => (
                <AppShellNav
                  key={group.label}
                  label={group.label}
                  items={group.items}
                  value={page}
                  onValueChange={setPage}
                  itemClassName={raised}
                />
              ))}
            </SidebarContent>
            <SidebarFooter className='p-4'>
              <AccountCard />
            </SidebarFooter>
          </Sidebar>
          <AppShellPanel inset={false} aria-label={current?.label}>
            <AppShellBody className='px-4 py-4 @lg:px-6 @lg:py-6'>
              <AppShellPlaceholderGrid preset='quad' variant='solid' />
            </AppShellBody>
          </AppShellPanel>
        </div>
      </SidebarProvider>
      <RouteSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={(id) => {
          setPage(id);
          setSearchOpen(false);
        }}
      />
    </AppShellFrame>
  );
}
