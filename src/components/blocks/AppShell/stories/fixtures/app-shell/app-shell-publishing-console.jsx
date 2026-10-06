'use client';
import { useState } from 'react';
import { AvatarRoot as Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  BreadcrumbRoot as Breadcrumb,
  BreadcrumbItemPrimitive as BreadcrumbItem,
  BreadcrumbListPrimitive as BreadcrumbList,
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
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { default as Kbd } from '@gaudi/design-system/core/Kbd';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@gaudi/design-system/core/Sheet';
import { TooltipRoot as Tooltip, TooltipContent, TooltipTrigger } from '@gaudi/design-system/core/Tooltip';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
const me = { name: 'Amara Osei', email: 'amara@gaudi.dev', photo: portrait('person-16') };
const sites = [
  { id: 'field-notes', name: 'Field Notes', plan: 'fieldnotes.gaudi.dev', tone: 'bg-discovery' },
  { id: 'reading-room', name: 'Reading Room', plan: 'Shared with 4 editors', tone: 'bg-warning' },
  { id: 'lab-journal', name: 'Lab Journal', plan: 'Private', tone: 'bg-info' }
];
const publications = ['Essays', 'Notes', 'Newsletter'];
const environments = [
  { id: 'live', label: 'Live', tone: 'bg-success' },
  { id: 'preview', label: 'Preview', tone: 'bg-warning' },
  { id: 'draft', label: 'Draft', tone: 'bg-info' }
];
// Each rail section owns its secondary navigation and an optional widget at the foot of it.
const sections = [
  { id: 'home', label: 'Home', icon: 'House', groups: [
    { label: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'LayoutGrid' }, { id: 'activity', label: 'Activity', icon: 'Activity' }, { id: 'changelog', label: 'Changelog', icon: 'History' }] }
  ] },
  { id: 'content', label: 'Content', icon: 'BookText', widget: 'goal', groups: [
    { label: 'Writing', items: [{ id: 'essays', label: 'Essays', icon: 'BookOpen' }, { id: 'notes', label: 'Notes', icon: 'Pencil' }, { id: 'series', label: 'Series', icon: 'Layers' }, { id: 'comments', label: 'Comments', icon: 'MessageSquare', badge: { label: 18, variant: 'outline' } }] },
    { label: 'Library', items: [{ id: 'revisions', label: 'Revisions', icon: 'History' }, { id: 'sources', label: 'Sources', icon: 'Library' }, { id: 'media', label: 'Media', icon: 'Image' }, { id: 'broken-links', label: 'Broken links', icon: 'Unlink', badge: { label: 4, variant: 'outline' } }] }
  ] },
  { id: 'publishing', label: 'Publishing', icon: 'Rocket', widget: 'readers', groups: [
    { label: 'Releases', items: [{ id: 'all-releases', label: 'All releases', icon: 'List' }, { id: 'scheduled', label: 'Scheduled', icon: 'CalendarClock', badge: { label: 3, variant: 'outline' } }, { id: 'release-drafts', label: 'Drafts', icon: 'FileText' }] },
    { label: 'Distribution', items: [{ id: 'published', label: 'Published', icon: 'CircleCheck' }, { id: 'newsletter', label: 'Newsletter', icon: 'Mail' }, { id: 'feeds', label: 'Feeds', icon: 'Radio' }, { id: 'redirects', label: 'Redirects', icon: 'Route' }] }
  ] },
  { id: 'readers', label: 'Readers', icon: 'Users', groups: [
    { label: 'Audience', items: [{ id: 'subscribers', label: 'Subscribers', icon: 'Users' }, { id: 'segments', label: 'Reading circles', icon: 'Tag' }, { id: 'members', label: 'Patrons', icon: 'BadgeCheck' }] },
    { label: 'Conversation', items: [{ id: 'replies', label: 'Replies', icon: 'MessageCircle', badge: { label: 7, variant: 'outline' } }, { id: 'guestbook', label: 'Guestbook', icon: 'Book' }] }
  ] },
  { id: 'stats', label: 'Reading stats', icon: 'ChartLine', groups: [
    { label: 'Insights', items: [{ id: 'reads', label: 'Reads', icon: 'BookOpen' }, { id: 'referrers', label: 'Referrers', icon: 'Globe' }, { id: 'completion', label: 'Read-through', icon: 'Timer' }] }
  ] },
  { id: 'settings', label: 'Settings', icon: 'Settings', groups: [
    { label: 'Site', items: [{ id: 'general', label: 'General', icon: 'Settings' }, { id: 'domains', label: 'Domains', icon: 'Globe' }, { id: 'theme', label: 'Theme', icon: 'Palette' }, { id: 'integrations', label: 'Webhooks', icon: 'Webhook' }] }
  ] }
];
const pages = sections.flatMap((section) => section.groups.flatMap((group) => group.items.map((item) => ({ ...item, section }))));
const initialNotifications = [
  { id: 'comment', photo: 'person-20', title: 'Lina Sato commented on “On slow reading”', body: '“The bit about rereading as revision stayed with me all week.”', time: '2 min ago', unread: true },
  { id: 'links', icon: 'Unlink', tone: 'text-warning', title: 'Broken links found', tag: 'Live', body: '4 citations in “Letters from a lost press” point to pages that moved.', actions: ['Fix links', 'Dismiss'], time: '15 min ago', unread: true },
  { id: 'edit', icon: 'Pencil', tone: 'text-warning', title: 'Suggested edits waiting', body: 'Tomas proposed 12 edits to “Gardens of notes” before it goes live.', actions: ['Approve', 'Review'], time: '1 hour ago', unread: true },
  { id: 'scheduled', icon: 'CalendarClock', tone: 'text-info', title: 'Newsletter scheduled', body: 'Issue 42 goes out Friday at 7:00 to 1,284 subscribers.', time: '2 hours ago', unread: true },
  { id: 'editors', icon: 'Users', tone: 'text-success', title: '3 editors joined Reading Room', body: 'Hana, Owen and Clara can now review drafts.', people: ['person-23', 'person-44', 'person-24'], time: '4 hours ago', unread: true },
  { id: 'milestone', icon: 'BookOpen', tone: 'text-success', title: '10,000 reads this month', body: 'Read-through on essays is up to 68%.', progress: 100, time: '5 hours ago' }
];

function RailItem({ section, current, onSelect }) {
  const { isMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={current}
        aria-current={current ? 'page' : undefined}
        // The rail is always icons, so its names show as tooltips on every desktop state.
        tooltip={{ children: section.label, hidden: isMobile }}
        onClick={() => onSelect(section.id)}
        className='justify-center data-active:bg-ui-background data-active:shadow-xs'
      >
        <RegistryIcon lucide={section.icon} aria-hidden='true' />
        <span className='sr-only'>{section.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function GoalWidget() {
  return (
    <div className='border-ui-border grid gap-2 border-t p-3 text-xs'>
      <p className='font-medium'>Writing goal</p>
      <p className='text-text-muted leading-snug'>Words drafted this month across every publication</p>
      <Progress value={62} aria-label='Monthly writing goal' className='bg-ui-muted h-1.5 rounded-full [&>[data-slot=progress-indicator]]:bg-info' />
      <div className='flex justify-between'>
        <span><b className='font-semibold tabular-nums'>12,400</b> <span className='text-text-muted'>words</span></span>
        <span className='text-text-muted'>of 20,000</span>
      </div>
    </div>
  );
}

function ReadersWidget() {
  return (
    <div className='border-ui-border grid gap-2 border-t p-3 text-xs'>
      <p className='flex items-center gap-1.5 font-medium'>
        <span aria-hidden='true' className='bg-success size-1.5 rounded-full' />
        Live readers
        <Badge variant='success-light' size='sm' className='ms-auto'>Live</Badge>
      </p>
      <dl className='grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5'>
        <dt className='text-text-muted'>Reading now</dt>
        <dd className='font-semibold tabular-nums'>37</dd>
        <dt className='text-text-muted'>Avg. time on essay</dt>
        <dd className='font-semibold tabular-nums'>6 min</dd>
      </dl>
    </div>
  );
}

/** The section's own navigation: beside the content on desktop, beside the rail in the phone sheet. */
function SectionNav({ section, page, onPage }) {
  return (
    <nav aria-label={`${section.label} navigation`} className='flex h-full min-h-0 flex-col'>
      <div className='min-h-0 flex-1 overflow-y-auto py-1'>
        {section.groups.map((group, index) => (
          <AppShellNav
            key={group.label}
            label={group.label}
            items={group.items}
            value={page}
            onValueChange={onPage}
            className={index ? 'border-ui-border border-t' : undefined}
          />
        ))}
      </div>
      {section.widget === 'goal' ? <GoalWidget /> : null}
      {section.widget === 'readers' ? <ReadersWidget /> : null}
    </nav>
  );
}

function AccountMenu() {
  const { isMobile } = useSidebar();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={`Account: ${me.name}`}>
          <Avatar className='size-7'>
            <AvatarImage src={me.photo} alt='' />
            <AvatarFallback>AO</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-56'>
        <DropdownMenuLabel className='grid font-normal leading-tight'>
          <span className='font-medium'>{me.name}</span>
          <span className='text-text-muted text-xs'>{me.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RegistryIcon lucide='User' aria-hidden='true' />
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Settings' aria-hidden='true' />
          Writing preferences
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Users' aria-hidden='true' />
          Switch account
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

/** One crumb that switches between options (site, publication, environment). */
function Switcher({ label, value, options, onChange, hideLabelOnPhone, className }) {
  const current = options.find((option) => option.id === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' aria-label={`${label}: ${current.label}`} className={`min-w-0 gap-1.5 px-2 ${className || ''}`}>
          {current.tone ? <span aria-hidden='true' className={`size-2.5 shrink-0 rounded-full ${current.tone}`} /> : null}
          <span className={`truncate ${hideLabelOnPhone ? 'sr-only @lg:not-sr-only' : ''}`}>{current.label}</span>
          <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='opacity-60' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-56'>
        <DropdownMenuLabel className='text-text-muted text-xs font-normal'>{`${label}s`}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id} className='gap-2'>
              {option.tone ? <span aria-hidden='true' className={`size-3 shrink-0 rounded-full ${option.tone}`} /> : null}
              <span className='grid leading-tight'>
                {option.label}
                {option.plan ? <span className='text-text-muted text-xs'>{option.plan}</span> : null}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {label === 'Environment' ? null : (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RegistryIcon lucide='Plus' aria-hidden='true' />
              Create {label}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationsSheet({ open, onOpenChange }) {
  const frame = useAppShellFrame();
  const [items, setItems] = useState(initialNotifications);
  const unread = items.filter((item) => item.unread).length;
  const act = (id, action) => setItems((list) => list.map((item) => (item.id === id ? { ...item, done: action, unread: false } : item)));
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent container={frame?.container ?? undefined} side='right' showCloseButton={false} className='w-96 max-w-[90%] gap-0 p-0'>
        <SheetHeader className='border-ui-border flex-row items-center gap-2 border-b px-4 py-3'>
          <SheetTitle className='text-sm'>Notifications</SheetTitle>
          {unread ? <Badge variant='invert' size='sm' className='rounded-full'>{unread}</Badge> : null}
          <SheetDescription className='sr-only'>Comments, link checks, edits and publishing activity.</SheetDescription>
          <div className='ms-auto flex gap-0.5'>
            <Button variant='ghost' size='icon-sm' aria-label='Mark all as read' onClick={() => setItems((list) => list.map((item) => ({ ...item, unread: false })))}>
              <RegistryIcon lucide='CheckCheck' aria-hidden='true' />
            </Button>
            <Button variant='ghost' size='icon-sm' aria-label='Close notifications' onClick={() => onOpenChange(false)}>
              <RegistryIcon lucide='X' aria-hidden='true' />
            </Button>
          </div>
        </SheetHeader>
        <ul aria-label='Site notifications' className='min-h-0 flex-1 overflow-y-auto overscroll-contain'>
          {items.map((item) => (
            <li key={item.id} className='border-ui-border relative flex gap-3 border-b px-4 py-3 text-sm'>
              {item.photo ? (
                <Avatar className='size-7'>
                  <AvatarImage src={portrait(item.photo)} alt='' />
                  <AvatarFallback>·</AvatarFallback>
                </Avatar>
              ) : (
                <span aria-hidden='true' className={`grid size-7 shrink-0 place-items-center ${item.tone}`}>
                  <RegistryIcon lucide={item.icon} className='size-4' />
                </span>
              )}
              <div className='grid min-w-0 flex-1 gap-1.5'>
                <p className='flex items-start gap-2 pe-3 leading-snug font-medium'>
                  {item.title}
                  {item.tag ? <Badge variant='outline' size='sm' className='ms-auto'>{item.tag}</Badge> : null}
                  {item.unread ? <span className='sr-only'> (unread)</span> : null}
                </p>
                <p className='text-text-muted leading-snug'>{item.body}</p>
                {item.people ? (
                  <AvatarGroup className='-space-x-1.5'>
                    {item.people.map((path) => (
                      <Avatar key={path} className='size-6'>
                        <AvatarImage src={portrait(path)} alt='' />
                        <AvatarFallback>·</AvatarFallback>
                      </Avatar>
                    ))}
                  </AvatarGroup>
                ) : null}
                {item.progress ? (
                  <Progress value={item.progress} aria-label='Monthly reads goal' className='bg-ui-muted h-1.5 rounded-full [&>[data-slot=progress-indicator]]:bg-success' />
                ) : null}
                {item.actions ? (
                  item.done ? (
                    <Badge variant='success-light' className='w-fit'>{item.done}</Badge>
                  ) : (
                    <div className='flex gap-1.5'>
                      <Button size='xs' onClick={() => act(item.id, item.actions[0] === 'Approve' ? 'Edits approved' : 'Links fixed')}>{item.actions[0]}</Button>
                      <Button size='xs' variant='outline' onClick={() => act(item.id, item.actions[1] === 'Review' ? 'In review' : 'Dismissed')}>{item.actions[1]}</Button>
                    </div>
                  )
                ) : null}
                <span className='text-text-muted text-xs'>{item.time}</span>
              </div>
              {item.unread ? <span aria-hidden='true' className='bg-ui-foreground absolute top-4 end-4 size-1.5 rounded-full' /> : null}
            </li>
          ))}
        </ul>
        <div className='border-ui-border border-t p-1'>
          <Button variant='ghost' size='sm' className='w-full'>View all notifications</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SearchPalette({ open, onOpenChange, onSelect }) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title='Search' description='Search pages across every section of the site.'>
      <Command>
        <CommandInput placeholder='Search essays, settings, readers...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {sections.map((section) => (
            <CommandGroup key={section.id} heading={section.label}>
              {pages.filter((entry) => entry.section.id === section.id).map((entry) => (
                <CommandItem key={entry.id} value={`${section.label} ${entry.label}`} onSelect={() => onSelect(entry)}>
                  <RegistryIcon lucide={entry.icon} aria-hidden='true' />
                  {entry.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function PublishingShell() {
  const frame = useAppShellFrame();
  const [sectionId, setSectionId] = useState('content');
  const [page, setPage] = useState('essays');
  const [site, setSite] = useState('field-notes');
  const [publication, setPublication] = useState('Essays');
  const [environment, setEnvironment] = useState('live');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  // ⌘K / Ctrl+K opens search while focus is inside this window.
  const shortcut = useHotkey('mod+k', () => setSearchOpen((value) => !value), { enableInInputs: true, target: frame?.container ?? null });
  const section = sections.find((entry) => entry.id === sectionId);
  const chooseSection = (id) => {
    setSectionId(id);
    setPage(sections.find((entry) => entry.id === id).groups[0].items[0].id);
  };
  return (
    <SidebarProvider shortcut={false} style={{ '--sidebar-width': '3.5rem', '--sidebar-width-icon': '3.5rem' }}>
      <Sidebar collapsible='icon'>
        <InnerSidebar section={section} page={page} onPage={setPage} onSection={chooseSection} />
      </Sidebar>
      <AppShellPanel>
        <AppShellHeader bordered className='gap-1 px-2'>
          <SidebarTrigger />
          <Breadcrumb className='min-w-0'>
            <BreadcrumbList className='flex-nowrap gap-0.5 sm:gap-0.5'>
              <BreadcrumbItem className='min-w-0'>
                <Switcher
                  label='Site'
                  value={site}
                  options={sites.map((entry) => ({ ...entry, label: entry.name }))}
                  onChange={setSite}
                  hideLabelOnPhone
                />
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden @lg:block' />
              <BreadcrumbItem className='hidden min-w-0 @lg:inline-flex'>
                <Switcher
                  label='Publication'
                  value={publication}
                  options={publications.map((name) => ({ id: name, label: name }))}
                  onChange={setPublication}
                />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className='min-w-0'>
                <Switcher label='Environment' value={environment} options={environments} onChange={setEnvironment} />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='ms-auto flex shrink-0 items-center gap-1 @5xl:absolute @5xl:start-1/2 @5xl:ms-0 @5xl:-translate-x-1/2'>
            <Button
              variant='outline'
              size='sm'
              aria-label='Search'
              aria-keyshortcuts={shortcut.ariaKeyShortcuts}
              onClick={() => setSearchOpen(true)}
              className='text-text-muted w-8 justify-start px-0 @3xl:w-56 @3xl:px-2.5 @6xl:w-80'
            >
              <RegistryIcon lucide='Search' aria-hidden='true' className='mx-auto @3xl:mx-0' />
              <span className='hidden @3xl:inline'>Search the site...</span>
              <span aria-hidden='true' className='ms-auto hidden @3xl:inline-flex'>
                <Kbd keys={shortcut.kbdKeys} size='sm' />
              </span>
            </Button>
          </div>
          <div className='flex shrink-0 items-center gap-1 @5xl:ms-auto'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='sm' aria-label='Write' className='px-2 @lg:px-2.5'>
                  <RegistryIcon lucide='SquarePen' aria-hidden='true' />
                  <span className='hidden @lg:inline'>Write</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-52'>
                <DropdownMenuItem><RegistryIcon lucide='BookOpen' aria-hidden='true' />New essay</DropdownMenuItem>
                <DropdownMenuItem><RegistryIcon lucide='Pencil' aria-hidden='true' />New note</DropdownMenuItem>
                <DropdownMenuItem><RegistryIcon lucide='Layers' aria-hidden='true' />New series</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem><RegistryIcon lucide='Upload' aria-hidden='true' />Import Markdown</DropdownMenuItem>
                <DropdownMenuItem><RegistryIcon lucide='Download' aria-hidden='true' />Export site</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon-sm' aria-label='Open live site' className='hidden @2xl:inline-flex'>
                  <RegistryIcon lucide='ExternalLink' aria-hidden='true' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>Open live site</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon-sm' aria-label='Notifications' className='relative' onClick={() => setNotificationsOpen(true)}>
                  <RegistryIcon lucide='Bell' aria-hidden='true' />
                  <span aria-hidden='true' className='bg-ui-foreground absolute top-1 end-1.5 size-1.5 rounded-full' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>Notifications</TooltipContent>
            </Tooltip>
          </div>
        </AppShellHeader>
        <div className='flex min-h-0 flex-1'>
          <SecondaryAside section={section} page={page} onPage={setPage} />
          <AppShellBody className='@container min-w-0 flex-1 overflow-y-auto pt-4'>
            <div aria-hidden='true' className='grid gap-4 p-4 sm:grid-cols-3'><Skeleton className='h-24' /><Skeleton className='h-24' /><Skeleton className='h-24' /><Skeleton className='h-64 sm:col-span-3' /></div>
          </AppShellBody>
        </div>
      </AppShellPanel>
      <SearchPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={(entry) => {
          setSectionId(entry.section.id);
          setPage(entry.id);
          setSearchOpen(false);
        }}
      />
      <NotificationsSheet open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </SidebarProvider>
  );
}

/** The rail, and in the phone sheet the section navigation beside it. */
function InnerSidebar({ section, page, onPage, onSection }) {
  const { isMobile } = useSidebar();
  const rail = (
    <div className='flex h-full w-14 shrink-0 flex-col'>
      <SidebarHeader className='items-center py-3'>
        <span aria-hidden='true' className='bg-ui-foreground text-ui-background grid size-8 place-items-center rounded-(--ds-radius-control)'>
          <RegistryIcon lucide='PenTool' className='size-4' />
        </span>
      </SidebarHeader>
      <SidebarContent role='navigation' aria-label='Sections'>
        <SidebarMenu className='gap-1 px-2'>
          {sections.map((entry) => (
            <RailItem key={entry.id} section={entry} current={entry.id === section.id} onSelect={onSection} />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='items-center'>
        <AccountMenu />
      </SidebarFooter>
    </div>
  );
  if (!isMobile) return rail;
  return (
    <div className='flex h-full'>
      {rail}
      <div className='bg-ui-background border-ui-border min-w-0 flex-1 border-s'>
        <SectionNav section={section} page={page} onPage={onPage} />
      </div>
    </div>
  );
}

/** The section navigation inside the panel; the trigger folds it away so only the rail remains. */
function SecondaryAside({ section, page, onPage }) {
  const { open, isMobile } = useSidebar();
  if (isMobile) return null;
  return (
    <div
      inert={!open}
      className={`border-ui-border shrink-0 overflow-hidden transition-[width] duration-200 ease-linear motion-reduce:transition-none ${open ? 'w-52 border-e' : 'w-0'}`}
    >
      <div className='h-full w-52'>
        <SectionNav section={section} page={page} onPage={onPage} />
      </div>
    </div>
  );
}

export function Pattern() {
  return (
    <AppShellFrame>
      <PublishingShell />
    </AppShellFrame>
  );
}
