'use client';
import { GaudiLogo, GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useState } from 'react';
import { AvatarRoot as Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
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
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@gaudi/design-system/core/Commander';
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
import { default as Kbd } from '@gaudi/design-system/core/Kbd';
import { PopoverPrimitive as Popover, PopoverContentPrimitive as PopoverContent, PopoverTriggerPrimitive as PopoverTrigger } from '@gaudi/design-system/core/Popover';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { ProgressRing } from '@gaudi/design-system/core/Progress';
import { TooltipRoot as Tooltip, TooltipContent, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
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
  SidebarTrigger,
  useSidebar
} from '@gaudi/design-system/blocks/AppShell';
import {
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel,
  useAppShellFrame
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellNav } from '@gaudi/design-system/blocks/AppShell';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { useHotkey } from '@gaudi/design-system/hooks/interaction/use-hotkey';

const portrait = (path) => `/avatars/${path}.svg`;
const labs = [
  { id: 'cognition', name: 'Cognition Lab', detail: '12 members', initial: 'C', tone: 'bg-ui-foreground text-ui-background' },
  { id: 'urban', name: 'Urban Studies Group', detail: '5 members', initial: 'U', tone: 'bg-success text-success-foreground' },
  { id: 'independent', name: 'Independent', detail: 'Just you', initial: 'I', tone: 'bg-info text-info-foreground' }
];
const research = [
  { id: 'dashboard', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'projects', label: 'Projects', icon: 'Folder' },
  { id: 'my-reading', label: 'My Reading', icon: 'Bookmark' },
  {
    id: 'questions',
    label: 'Questions',
    icon: 'Lightbulb',
    items: [
      { id: 'open', label: 'Open' },
      { id: 'investigating', label: 'Investigating' },
      { id: 'answered', label: 'Answered' }
    ]
  },
  {
    id: 'collaborators',
    label: 'Collaborators',
    icon: 'Users',
    items: [
      { id: 'members', label: 'Members' },
      { id: 'reviewers', label: 'Reviewers' },
      { id: 'access', label: 'Access' }
    ]
  },
  { id: 'citations', label: 'Citations', icon: 'Quote' }
];
// Each active project shows its progress as a ring; the percentage is spoken with the name.
const ring = (value, tone) => (
  <span aria-hidden='true' className='ms-0.5 me-0.5 flex shrink-0'>
    <ProgressRing value={value} tone={tone} size='xs' label='' />
  </span>
);
const initialProjects = [
  { id: 'memory-sleep', label: 'Memory & Sleep', leading: ring(72, 'info'), status: '72% complete' },
  { id: 'literature-review', label: 'Literature Review', leading: ring(35, 'discovery'), status: '35% complete' },
  { id: 'field-interviews', label: 'Field Interviews', leading: ring(100, 'success'), status: 'complete' },
  { id: 'survey-analysis', label: 'Survey Analysis', leading: ring(18, 'warning'), status: '18% complete' },
  { id: 'grant-proposal', label: 'Grant Proposal', leading: ring(64, 'attention'), status: '64% complete' }
];
const pages = research.flatMap((item) => (item.items ? item.items.map((child) => ({ ...child, section: item.label })) : [item]));

const initialNotifications = [
  { id: 'mention', kind: 'mention', unread: true, photo: portrait('person-23'), title: '@nadia mentioned you in Memory & Sleep notes', body: '“Can you check this citation?”', time: '2m ago' },
  { id: 'approval', kind: 'approval', unread: true, icon: 'CircleCheck', tone: 'text-warning', title: 'Sign-off requested', body: 'The Literature Review draft needs your sign-off before it is shared with the lab.', time: '5m ago', meta: ['Priority', 'High'] },
  { id: 'file', kind: 'file', unread: true, photo: portrait('person-41'), title: '@omar shared Interview transcripts', file: 'interviews-batch-3.pdf', size: '2 MB', time: '15m ago' },
  { id: 'task', kind: 'task', unread: true, icon: 'Bookmark', tone: 'text-info', title: 'Reading assigned to you', body: 'Annotate chapter 4 of the sleep-spindles review.', time: '30m ago', meta: ['Due', 'Tomorrow'] },
  { id: 'joined', kind: 'joined', unread: true, icon: 'Users', tone: 'text-success', title: '4 people joined Cognition Lab', body: 'Nadia, Theo, Ines and Yusuf just joined the lab workspace.', time: '45m ago', people: ['person-20', 'person-44', 'person-07'] },
  { id: 'event', kind: 'event', icon: 'Calendar', tone: 'text-discovery', title: 'Reading group reminder', body: 'Discussion of this week’s paper with the lab.', time: '3h ago', when: ['Mar 3, 2026', '10:00 to 11:00 AM'] },
  { id: 'milestone', kind: 'milestone', icon: 'Award', tone: 'text-success', title: 'Weekly reading goal reached', body: '12 of 12 papers read this week.', time: '4h ago', meta: ['Goal', '12 papers'] },
  { id: 'export', kind: 'plain', icon: 'Download', tone: 'text-text-muted', title: 'Bibliography export ready', body: 'Your BibTeX export of 214 references is ready to download.', time: 'Yesterday' },
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
          <Progress value={100} aria-label='Weekly reading goal' className='bg-ui-muted h-1.5 rounded-full [&>[data-slot=progress-indicator]]:bg-success' />
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
        <TooltipContent side='bottom'>Notifications</TooltipContent>
      </Tooltip>
      <PopoverContent
        side='bottom'
        align='end'
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
        href='#overview'
        aria-label='Gaudi Research'
        className='focus-visible:ring-ui-sidebar-ring flex min-w-0 flex-1 items-center gap-2 rounded-(--ds-radius-control) p-1 text-sm font-semibold outline-hidden focus-visible:ring-2 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:p-0'
        onClick={(event) => event.preventDefault()}
      >
        <GaudiLogo aria-hidden='true' className='hidden size-7 group-data-[collapsible=icon]:block' />
        <span className='flex min-w-0 items-center gap-2 group-data-[collapsible=icon]:hidden'><GaudiBrand className='text-sm' /><span className='truncate'>Research</span></span>
      </a>
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

function ReadingGoal() {
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <section aria-labelledby='app-shell-research-goal' className='bg-ui-muted border-ui-border rounded-(--ds-radius-card) border'>
        <h2 id='app-shell-research-goal' className='text-ui-warning-ink px-2.5 py-1.5 text-xs font-semibold'>
          Weekly Reading Goal
        </h2>
        <div className='bg-ui-background border-ui-border -m-px grid gap-2 rounded-(--ds-radius-card) border p-2.5'>
          <p className='text-text-muted text-xs leading-snug'>9 of 11 papers read; the goal resets on Monday.</p>
          <Progress value={82} aria-label='Reading goal progress' className='bg-ui-muted h-1.5 rounded-full [&>[data-slot=progress-indicator]]:bg-success' />
          <div className='flex justify-between text-xs'>
            <span><b className='font-semibold'>82%</b> <span className='text-text-muted'>Read</span></span>
            <span><b className='font-semibold'>18%</b> <span className='text-text-muted'>Left</span></span>
          </div>
        </div>
      </section>
    </SidebarGroup>
  );
}

function LabTile({ lab, className = 'size-6' }) {
  return (
    <span aria-hidden='true' className={`grid shrink-0 place-items-center rounded-(--ds-radius-control) text-xs font-semibold ${lab.tone} ${className}`}>
      {lab.initial}
    </span>
  );
}

function LabMenu({ lab, onChange }) {
  const { isMobile } = useSidebar();
  const [theme, setTheme] = useState('system');
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' aria-label={`Lab: ${lab.name}`} className='data-[state=open]:bg-ui-sidebar-accent'>
              <LabTile lab={lab} />
              <span className='truncate font-medium'>{lab.name}</span>
              <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' className='ms-auto opacity-60' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-60'>
            <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Labs</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={lab.id} onValueChange={(id) => onChange(labs.find((entry) => entry.id === id))}>
              {labs.map((entry) => (
                <DropdownMenuRadioItem key={entry.id} value={entry.id} className='gap-2'>
                  <LabTile lab={entry} className='size-5' />
                  <span className='grid leading-tight'>
                    {entry.name}
                    <span className='text-text-muted text-xs'>{entry.detail}</span>
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuItem>
              <RegistryIcon lucide='Plus' aria-hidden='true' />
              New Lab
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
                <RegistryIcon lucide='Target' aria-hidden='true' />
                Reading Goals
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
                  <RegistryIcon lucide='FlaskConical' aria-hidden='true' className='size-4' />
                  Research
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
      <div className='ms-auto'>
        <NotificationsPopover />
      </div>
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
      <CommandDialog open={open} onOpenChange={onOpenChange} title='Search' description='Search projects, questions and collaborators.'>
        <Command>
          <CommandInput placeholder='Search research pages...' />
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
  const [lab, setLab] = useState(labs[0]);
  const [projects, setProjects] = useState(initialProjects);
  const [searchOpen, setSearchOpen] = useState(false);
  const label = [...pages, ...projects].find((entry) => entry.id === page)?.label ?? 'Overview';
  const projectActions = (item) => (
    <>
      <DropdownMenuLabel className='text-text-muted text-xs font-normal'>Actions</DropdownMenuLabel>
      <DropdownMenuItem onSelect={() => setPage(item.id)}>
        <RegistryIcon lucide='ExternalLink' aria-hidden='true' />
        Open Study
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='UserPlus' aria-hidden='true' />
        Invite Collaborator
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='Quote' aria-hidden='true' />
        Export Citations
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
              <SidebarContent role='navigation' aria-label='Research'>
                <AppShellNav label='Research' items={research} value={page} onValueChange={setPage} />
                <AppShellNav
                  label='Active Studies'
                  collapsible
                  hideOnRail
                  items={projects}
                  value={page}
                  onValueChange={setPage}
                  actions={projectActions}
                />
                <div className='mt-auto'>
                  <ReadingGoal />
                </div>
              </SidebarContent>
              <SidebarFooter>
                <LabMenu lab={lab} onChange={setLab} />
              </SidebarFooter>
            </Sidebar>
          )}
        </SearchPalette>
        <AppShellPanel>
          <PageHeader page={label} onNavigate={setPage} />
          <AppShellBody>
            <div aria-hidden='true' className='grid gap-4 p-4 sm:grid-cols-2'><Skeleton className='h-32' /><Skeleton className='h-32' /><Skeleton className='h-56 sm:col-span-2' /></div>
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
