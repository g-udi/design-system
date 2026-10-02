'use client';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../../../src/components/core/Breadcrumb/parts/breadcrumb.jsx';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from '../../../../src/components/core/Commander/parts/command.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Kbd, KbdGroup } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../src/components/core/Popover/parts/popover.jsx';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { Sparkline } from '../../../../src/components/charts/Sparkline/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const workspaces = [
  { id: 'editorial', name: 'Gaudi Editorial', plan: 'Team · 12 seats' },
  { id: 'labs', name: 'Gaudi Labs', plan: 'Pro · 4 seats' },
  { id: 'personal', name: 'Personal notes', plan: 'Free' }
];
const pinned = [
  { id: 'style', label: 'House style guide' },
  { id: 'launch', label: 'Autumn launch plan' },
  { id: 'interviews', label: 'Reader interviews' }
];
const notifications = [
  { id: 1, who: 'Priya Natarajan', avatar: 'women/44', text: 'left 3 comments on “Notes on local-first software”', when: '4m', unread: true },
  { id: 2, who: 'Tom Becker', avatar: 'men/32', text: 'approved “Small tools, long lifetimes” for Friday', when: '1h', unread: true },
  { id: 3, who: 'Gaudi', text: 'Your newsletter reached 12,400 readers', when: '3h', unread: false }
];
const apps = [
  ['Write', 'PenTool'], ['Analytics', 'BarChart3'], ['Newsletter', 'Mail'],
  ['Calendar', 'CalendarDays'], ['Files', 'Folder'], ['Assistant', 'Sparkles'],
  ['Forms', 'ClipboardList'], ['Automations', 'Workflow'], ['Settings', 'Settings']
];
const metrics = [
  { label: 'Readers', value: '48.2k', data: [31, 34, 33, 37, 36, 40, 42, 41, 45, 48] },
  { label: 'Subscribers', value: '12.4k', data: [10.1, 10.4, 10.6, 10.9, 11.2, 11.5, 11.7, 12, 12.2, 12.4] },
  { label: 'Read time', value: '4m 12s', data: [3.6, 3.8, 3.7, 3.9, 4, 3.9, 4.1, 4.2, 4.1, 4.2] }
];

function WorkspaceSwitcher({ workspace, onChange }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size='lg' aria-label={`Workspace: ${workspace.name}`}>
          <span className='bg-accent text-accent-foreground grid size-8 shrink-0 place-items-center rounded-(--ds-radius-control)'>
            <RegistryIcon lucide='PenTool' className='size-4' aria-hidden='true' />
          </span>
          <span className='grid min-w-0 flex-1 text-start leading-tight'>
            <span className='truncate text-sm font-medium'>{workspace.name}</span>
            <span className='text-text-muted truncate text-xs'>{workspace.plan}</span>
          </span>
          <RegistryIcon lucide='ChevronsUpDown' className='ms-auto size-4' aria-hidden='true' />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-60'>
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {workspaces.map((entry) => (
          <DropdownMenuItem key={entry.id} onSelect={() => onChange(entry)}>
            <span className='flex-1'>{entry.name}</span>
            {entry.id === workspace.id ? <RegistryIcon lucide='Check' className='size-4' aria-label='Current workspace' /> : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RegistryIcon lucide='Plus' className='size-4' aria-hidden='true' />
          New workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Notifications() {
  const [items, setItems] = useState(notifications);
  const unread = items.filter((item) => item.unread).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='icon-sm' variant='ghost' tone='neutral' aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'} className='relative'>
          <RegistryIcon lucide='Bell' className='size-4' aria-hidden='true' />
          {unread ? <span aria-hidden='true' className='bg-danger absolute top-1.5 end-1.5 size-1.5 rounded-full' /> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-80 p-0'>
        <div className='flex items-center justify-between border-b px-3 py-2'>
          <p className='text-sm font-medium'>Notifications</p>
          <Button size='xs' variant='ghost' tone='neutral' disabled={!unread} onClick={() => setItems((current) => current.map((item) => ({ ...item, unread: false })))}>Mark all read</Button>
        </div>
        <ul className='divide-y'>
          {items.map((item) => (
            <li key={item.id} className='flex gap-3 px-3 py-2.5 text-sm'>
              <Avatar className='size-7'>
                {item.avatar ? <AvatarImage src={`https://randomuser.me/api/portraits/${item.avatar}.jpg`} alt='' /> : null}
                <AvatarFallback className='text-xs'>{item.who[0]}</AvatarFallback>
              </Avatar>
              <p className='min-w-0 flex-1'>
                <span className='font-medium'>{item.who}</span> <span className='text-text-muted'>{item.text}</span>
                <span className='text-text-muted block text-xs'>{item.when} ago</span>
              </p>
              {item.unread ? <span className='bg-accent mt-1.5 size-2 shrink-0 rounded-full'><span className='sr-only'>Unread</span></span> : null}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function AppsMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='icon-sm' variant='ghost' tone='neutral' aria-label='Gaudi apps'>
          <RegistryIcon lucide='LayoutGrid' className='size-4' aria-hidden='true' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-72 p-2'>
        <ul className='grid grid-cols-3 gap-1' aria-label='Gaudi apps'>
          {apps.map(([label, icon]) => (
            <li key={label}>
              <a href={`#${label.toLowerCase()}`} className='hover:bg-surface-muted grid justify-items-center gap-1.5 rounded-(--ds-radius-control) p-3 text-xs'>
                <RegistryIcon lucide={icon} className='text-accent size-5' aria-hidden='true' />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function UserMenu() {
  const [theme, setTheme] = useState('system');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size='lg' aria-label='Account menu for Maya Lopez'>
          <Avatar className='size-8'>
            <AvatarImage src='https://randomuser.me/api/portraits/women/65.jpg' alt='' />
            <AvatarFallback>ML</AvatarFallback>
          </Avatar>
          <span className='grid min-w-0 flex-1 text-start leading-tight'>
            <span className='truncate text-sm font-medium'>Maya Lopez</span>
            <span className='text-text-muted truncate text-xs'>maya@gaudi.dev</span>
          </span>
          <RegistryIcon lucide='EllipsisVertical' className='ms-auto size-4' aria-hidden='true' />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' align='end' className='w-56'>
        <DropdownMenuItem><RegistryIcon lucide='User' className='size-4' aria-hidden='true' />Profile</DropdownMenuItem>
        <DropdownMenuItem><RegistryIcon lucide='CreditCard' className='size-4' aria-hidden='true' />Billing</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><RegistryIcon lucide='Sun' className='size-4' aria-hidden='true' />Theme</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value='light'>Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='dark'>Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='system'>System</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem><RegistryIcon lucide='LogOut' className='size-4' aria-hidden='true' />Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Pattern() {
  const [workspace, setWorkspace] = useState(workspaces[0]);
  const [variant, setVariant] = useState('sidebar');
  const [active, setActive] = useState('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [pins, setPins] = useState(pinned);

  // ⌘K / Ctrl+K opens the search palette from anywhere in the shell.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const nav = (id, label, icon, badge) => (
    <SidebarMenuItem key={id}>
      <SidebarMenuButton isActive={active === id} aria-current={active === id ? 'page' : undefined} tooltip={label} onClick={() => setActive(id)}>
        <RegistryIcon lucide={icon} aria-hidden='true' />
        <span>{label}</span>
      </SidebarMenuButton>
      {badge ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}
    </SidebarMenuItem>
  );

  return (
    <SidebarProvider storageKey='gaudi-writing-sidebar' className='bg-surface relative h-[44rem] min-h-0 w-full overflow-hidden rounded-(--ds-radius-card) border'>
      <Sidebar collapsible='icon' variant={variant} className='absolute h-full'>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <WorkspaceSwitcher workspace={workspace} onChange={setWorkspace} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav('home', 'Home', 'House')}
                {nav('inbox', 'Inbox', 'Inbox', 4)}
                <Collapsible defaultOpen asChild className='group/collapsible'>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip='Drafts' isActive={active.startsWith('drafts')}>
                        <RegistryIcon lucide='SquarePen' aria-hidden='true' />
                        <span>Drafts</span>
                        <RegistryIcon lucide='ChevronRight' className='ms-auto transition-transform group-data-[state=open]/collapsible:rotate-90' aria-hidden='true' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {[['drafts-all', 'All drafts', 6], ['drafts-review', 'In review', 2], ['drafts-scheduled', 'Scheduled', 3]].map(([id, label, count]) => (
                          <SidebarMenuSubItem key={id}>
                            <SidebarMenuSubButton href={`#${id}`} isActive={active === id} aria-current={active === id ? 'page' : undefined} onClick={(event) => { event.preventDefault(); setActive(id); }}>
                              <span>{label}</span>
                              <span className='text-text-muted ms-auto text-xs tabular-nums'>{count}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
                {nav('published', 'Published', 'Send', 24)}
                {nav('analytics', 'Analytics', 'BarChart3')}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Pinned</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {pins.map((pin) => (
                  <SidebarMenuItem key={pin.id}>
                    <SidebarMenuButton tooltip={pin.label} isActive={active === pin.id} aria-current={active === pin.id ? 'page' : undefined} onClick={() => setActive(pin.id)}>
                      <RegistryIcon lucide='Pin' aria-hidden='true' />
                      <span>{pin.label}</span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover aria-label={`Actions for ${pin.label}`}>
                          <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side='right' align='start'>
                        <DropdownMenuItem onSelect={() => setActive(pin.id)}>Open</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setPins((current) => current.filter((entry) => entry.id !== pin.id))}>Unpin</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <UserMenu />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className='min-h-0 min-w-0'>
        <header className='flex h-14 shrink-0 items-center gap-2 border-b px-3'>
          <SidebarTrigger />
          <Breadcrumb className='hidden min-w-0 sm:block'>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href='#workspace'>{workspace.name}</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Home</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='ms-auto flex items-center gap-1'>
            <Button size='sm' variant='outline' tone='neutral' className='text-text-muted hidden w-52 justify-start md:inline-flex' onClick={() => setSearchOpen(true)}>
              <RegistryIcon lucide='Search' className='size-4' aria-hidden='true' />
              <span className='flex-1 text-start'>Search…</span>
              <KbdGroup aria-hidden='true'><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
            </Button>
            <Button size='icon-sm' variant='ghost' tone='neutral' className='md:hidden' aria-label='Search' onClick={() => setSearchOpen(true)}>
              <RegistryIcon lucide='Search' className='size-4' aria-hidden='true' />
            </Button>
            <ToggleGroup type='single' size='sm' variant='outline' spacing={0} value={variant} onValueChange={(next) => next && setVariant(next)} aria-label='Sidebar style' className='hidden lg:flex'>
              <ToggleGroupItem value='sidebar'>Docked</ToggleGroupItem>
              <ToggleGroupItem value='floating'>Floating</ToggleGroupItem>
            </ToggleGroup>
            <Notifications />
            <AppsMenu />
          </div>
        </header>
        <div className='min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
          <div className='flex flex-wrap items-end justify-between gap-3'>
            <div>
              <h1 className='text-xl font-semibold'>Good morning, Maya</h1>
              <p className='text-text-muted text-sm'>Two drafts are waiting for review before Friday’s issue.</p>
            </div>
            <Button size='sm'><RegistryIcon lucide='Plus' className='size-4' aria-hidden='true' />New draft</Button>
          </div>
          <ul className='mt-6 grid gap-3 sm:grid-cols-3'>
            {metrics.map((metric) => (
              <li key={metric.label} className='rounded-(--ds-radius-card) border p-4'>
                <p className='text-text-muted text-xs'>{metric.label}</p>
                <p className='text-lg font-semibold tabular-nums'>{metric.value}</p>
                <Sparkline ariaLabel={`${metric.label}, last 10 weeks`} data={metric.data} valueLabel={metric.label} height={36} />
              </li>
            ))}
          </ul>
          <h2 className='mt-8 text-sm font-medium'>Recent drafts</h2>
          <ul className='mt-2 divide-y rounded-(--ds-radius-card) border'>
            {[['Notes on local-first software', 'In review', 'warning-light'], ['Small tools, long lifetimes', 'Scheduled', 'info-light'], ['Designing for real data', 'Draft', 'secondary']].map(([title, status, tone]) => (
              <li key={title} className='flex items-center gap-3 px-4 py-3 text-sm'>
                <RegistryIcon lucide='FileText' className='text-text-muted size-4' aria-hidden='true' />
                <span className='min-w-0 flex-1 truncate'>{title}</span>
                <Badge variant={tone}>{status}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </SidebarInset>
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen} title='Search Gaudi' description='Jump to a page or run an action'>
        <CommandInput placeholder='Search drafts, pages and actions…' />
        <CommandList>
          <CommandEmpty>Nothing matches that search.</CommandEmpty>
          <CommandGroup heading='Pages'>
            {['Home', 'Inbox', 'Drafts', 'Published', 'Analytics'].map((label) => (
              <CommandItem key={label} onSelect={() => { setActive(label.toLowerCase()); setSearchOpen(false); }}>{label}</CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading='Actions'>
            <CommandItem onSelect={() => setSearchOpen(false)}>New draft<CommandShortcut>N</CommandShortcut></CommandItem>
            <CommandItem onSelect={() => setSearchOpen(false)}>Invite a writer</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SidebarProvider>
  );
}
