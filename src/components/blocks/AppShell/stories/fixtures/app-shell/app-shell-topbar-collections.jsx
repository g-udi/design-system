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
  DropdownMenuShortcut,
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
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
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
const noop = (event) => event.preventDefault();
// Route rows sit indented under their group heading; the current page is a raised muted row.
const indented =
  'h-7 ps-6 text-xs text-ui-sidebar-foreground/75 data-active:text-ui-sidebar-foreground data-active:ring-1 data-active:ring-ui-sidebar-border';

function Logo() {
  return (
    <Link
      variant='bare'
      href='#home'
      onClick={noop}
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
  const [toggles, setToggles] = useState({ summaries: true, digest: true, focus: false });
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
          <RegistryIcon lucide='Library' aria-hidden='true' />
          Library Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Tags' aria-hidden='true' />
          Tagging Rules
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Bell' aria-hidden='true' />
          Digest Schedule
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Reading</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={toggles.summaries} onCheckedChange={set('summaries')}>
          Auto-Summaries
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={toggles.digest} onCheckedChange={set('digest')}>
          Weekly Digest
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={toggles.focus} onCheckedChange={set('focus')}>
          Focus Mode
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

function NewItemMenu() {
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
        <DropdownMenuItem>
          <RegistryIcon lucide='Link' aria-hidden='true' />
          Save a Link
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='PenSquare' aria-hidden='true' />
          New Note
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='FolderPlus' aria-hidden='true' />
          New Collection
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
                <Switcher label='Circle' value={team} options={teams} onChange={onTeam} />
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <Switcher label='Collection' value={project} options={projects} onChange={onProject} />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}
      <div role='toolbar' aria-label='Workspace actions' className='ms-auto flex shrink-0 items-center gap-1'>
        {/* The primary action leads; account sits last after the utilities. */}
        <span className='me-1.5'>
          <NewItemMenu />
        </span>
        <AppShellNotifications defaultItems={notifications} triggerClassName='text-text-muted' />
        <AppsMenu />
        <SettingsMenu />
        <AccountMenu />
      </div>
    </header>
  );
}

function ReadingGoalCard() {
  const read = 12;
  const goal = 20;
  return (
    <div className='bg-surface rounded-(--ds-radius-card) border border-ui-border p-3 shadow-xs'>
      <div className='flex items-center gap-2'>
        <RegistryIcon lucide='BookmarkCheck' aria-hidden='true' className='text-text-muted size-4' />
        <p className='text-sm font-medium'>October reading</p>
      </div>
      <p className='text-text-muted mt-1 text-xs'>{read} of {goal} articles finished</p>
      <Progress value={read} max={goal} aria-label='October reading goal' className='bg-ui-muted mt-2 h-1.5 rounded-full' />
      <Button variant='outline' size='xs' className='mt-3 w-full'>
        Open reading list
      </Button>
    </div>
  );
}

function SheetSwitchers({ team, project, onTeam, onProject }) {
  const { isMobile } = useSidebar();
  if (!isMobile) return null;
  return (
    <SidebarHeader className='gap-1 px-4 pt-4'>
      <Switcher block label='Circle' value={team} options={teams} onChange={onTeam} />
      <Switcher block label='Collection' value={project} options={projects} onChange={onProject} />
    </SidebarHeader>
  );
}

export function Pattern() {
  const [page, setPage] = useState('collections');
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
                  onValueChange={setPage}
                  itemClassName={indented}
                />
              ))}
            </SidebarContent>
            <SidebarFooter className='p-4 pt-2'>
              <ReadingGoalCard />
            </SidebarFooter>
          </Sidebar>
          <AppShellPanel inset={false} aria-label={current?.label}>
            <AppShellBody className='px-4 py-4 @lg:px-6 @lg:py-6'>
              <div aria-hidden='true' className='grid gap-4 p-4 sm:grid-cols-3'><Skeleton className='h-24' /><Skeleton className='h-24' /><Skeleton className='h-24' /><Skeleton className='h-64 sm:col-span-3' /></div>
            </AppShellBody>
          </AppShellPanel>
        </div>
      </SidebarProvider>
    </AppShellFrame>
  );
}
