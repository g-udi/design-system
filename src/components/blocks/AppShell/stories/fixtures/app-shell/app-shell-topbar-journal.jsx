'use client';
import { GaudiLogo } from '@gaudi/design-system/icons/brands/gaudi';
import { useMemo, useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import { AvatarRoot as Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
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
  DropdownMenuCheckboxItemPrimitive as DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@gaudi/design-system/core/Sheet';
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
import { AppShellBody, AppShellFrame, AppShellPanel, useAppShellFrame } from '@gaudi/design-system/blocks/AppShell';
import { AppShellNav } from '@gaudi/design-system/blocks/AppShell';
import { AppShellNotifications } from '@gaudi/design-system/blocks/AppShell';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const sections = [
  { id: 'today', label: 'Today', icon: 'Sun' },
  { id: 'entries', label: 'Entries', icon: 'BookText' },
  { id: 'prompts', label: 'Prompts', icon: 'Lightbulb' },
  { id: 'reviews', label: 'Reviews', icon: 'History' },
  { id: 'archive', label: 'Archive', icon: 'Archive' }
];
const groups = [
  {
    label: 'Write',
    items: [
      ["Today's Page", 'PenSquare'],
      ['All Entries', 'BookText'],
      ['Drafts', 'FileText'],
      ['Themes', 'Layers'],
      ['Templates', 'ClipboardList']
    ]
  },
  {
    label: 'Reflect',
    items: [
      ['Weekly Review', 'History'],
      ['Prompt Library', 'Lightbulb'],
      ['Mood Log', 'Activity'],
      ['Quotes', 'Quote']
    ]
  },
  {
    label: 'Journal Settings',
    items: [
      ['Reminders', 'Bell'],
      ['Tags & Labels', 'Tag'],
      ['Privacy', 'ShieldCheck'],
      ['Sync & Backup', 'RefreshCw'],
      ['Writing Preferences', 'SlidersHorizontal']
    ]
  }
].map((group) => ({
  ...group,
  items: group.items.map(([label, icon]) => ({ id: label.toLowerCase().replace(/[^a-z]+/g, '-'), label, icon }))
}));
const routes = groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.label })));
const account = {
  name: 'Sami Okafor',
  role: 'Daily journal',
  email: 'sami@gaudi.page',
  photo: '/avatars/person-41.svg'
};
const statuses = [
  { id: 'none', label: 'No Status', dot: 'border border-text-muted' },
  { id: 'online', label: 'Online', dot: 'bg-success' },
  { id: 'away', label: 'Away', dot: 'bg-warning' },
  { id: 'offline', label: 'Offline', dot: 'bg-ui-destructive' }
];
const notifications = [
  {
    id: 'comment',
    unread: true,
    avatar: '/avatars/person-07.svg',
    title: 'Isaura Stenberg commented on “Walking to work”',
    body: 'The paragraph about the river fog deserves its own entry.',
    time: '2 min ago'
  },
  {
    id: 'sync',
    unread: true,
    icon: 'CircleAlert',
    tone: 'warning',
    title: 'Backup paused',
    badge: 'Check',
    body: 'The last three entries have not reached your backup folder yet.',
    actions: [
      { label: 'Retry backup', primary: true, done: 'Backing up' },
      { label: 'Dismiss', dismiss: true }
    ],
    time: '15 min ago'
  },
  {
    id: 'share',
    unread: true,
    icon: 'CircleCheck',
    tone: 'warning',
    title: 'Share request',
    body: 'Leo Grant asked to read your October travel entries.',
    actions: [
      { label: 'Approve', primary: true, done: 'Approved' },
      { label: 'Review', done: 'In review' }
    ],
    time: '1 hour ago',
    meta: { label: 'Entries', value: '6', tone: 'warning' }
  },
  {
    id: 'streak',
    unread: true,
    icon: 'Star',
    tone: 'success',
    title: '21-day writing streak',
    body: 'You have written every day for three weeks.',
    progress: { value: 21, max: 30, label: 'Days toward a 30-day streak' },
    time: '3 hours ago',
    meta: { label: 'Goal', value: '30 days', tone: 'success' }
  },
  {
    id: 'review',
    icon: 'Calendar',
    tone: 'discovery',
    title: 'Weekly review is ready',
    body: 'Seven entries, two recurring themes and one open question.',
    schedule: { date: 'Sunday', time: '7:00 PM' },
    time: '6 hours ago'
  },
  {
    id: 'export',
    avatar: '/avatars/person-46.svg',
    title: 'Ottilie Nakamura sent you the writing group anthology',
    attachment: { name: 'Autumn anthology.pdf', size: '3.2 MB' },
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
    <nav aria-label='Journal sections' className='min-w-0'>
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
        <Button variant='ghost' size='icon-sm' aria-label={`Journal sections: ${current.label}`}>
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
          <SheetTitle>Journal Sections</SheetTitle>
          <SheetDescription>Jump to a journal section.</SheetDescription>
        </SheetHeader>
        <span aria-hidden='true' className='bg-ui-border mx-auto mb-2 h-1 w-24 rounded-(--ds-radius-pill)' />
        <nav aria-label='Journal sections'>
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
  const [toggles, setToggles] = useState({ reminder: true, wordCount: true, typewriter: false });
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
          <RegistryIcon lucide='BookText' aria-hidden='true' />
          Journal Settings
          <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='ClipboardList' aria-hidden='true' />
          Entry Templates
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Bell' aria-hidden='true' />
          Reminder Times
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Editor</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={toggles.reminder} onCheckedChange={set('reminder')}>
          Evening Reminder
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={toggles.wordCount} onCheckedChange={set('wordCount')}>
          Show Word Count
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={toggles.typewriter} onCheckedChange={set('typewriter')}>
          Typewriter Scrolling
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
        <AvatarFallback>SO</AvatarFallback>
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
            <AvatarFallback>SO</AvatarFallback>
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
          Writing Schedule
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

function NewEntryMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='gap-1 data-[state=open]:bg-surface-muted'>
          <span>New</span>
          <span className='hidden @xl:inline'>Entry</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuLabel>Start From</DropdownMenuLabel>
        <DropdownMenuItem>
          <RegistryIcon lucide='PenSquare' aria-hidden='true' />
          Blank Page
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Lightbulb' aria-hidden='true' />
          Today's Prompt
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='ClipboardList' aria-hidden='true' />
          A Template
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TopBar({ section, onSection }) {
  const { isMobile } = useSidebar();
  return (
    <header className='@container flex h-13 shrink-0 items-center gap-2 border-b border-ui-border px-4 @lg:px-6'>
      {isMobile ? <SidebarTrigger className='-ms-1' /> : null}
      <span className='@4xl:hidden'>
        <SectionsSheet section={section} onSection={onSection} />
      </span>
      <a
        href='#home'
        aria-label='Gaudi Journal home'
        onClick={noop}
        className='bg-surface hidden size-6 @xs:grid shrink-0 place-items-center rounded-(--ds-radius-control) border border-ui-border outline-hidden focus-visible:ring-2 focus-visible:ring-ui-ring'
      >
        <GaudiLogo aria-hidden='true' className='size-5' />
      </a>
      <span aria-hidden='true' className='hidden h-3.5 w-px shrink-0 bg-ui-border @4xl:block' />
      <div className='hidden min-w-0 @4xl:block'>
        <SectionPills section={section} onSection={onSection} />
      </div>
      <div role='toolbar' aria-label='Workspace actions' className='ms-auto flex shrink-0 items-center gap-1'>
        <span className='me-1.5'>
          <NewEntryMenu />
        </span>
        <AppShellNotifications inset defaultItems={notifications} triggerClassName='text-text-muted' />
        <SettingsMenu />
        <StatusMenu />
      </div>
    </header>
  );
}

function SearchButton({ onClick }) {
  return (
    <Button variant='outline' size='sm' onClick={onClick} aria-label='Search journal pages' className='text-text-muted w-full justify-start'>
      <RegistryIcon lucide='Search' aria-hidden='true' />
      <span aria-hidden='true'>Search…</span>
    </Button>
  );
}

function JournalSearch({ onSelect }) {
  const [open, setOpen] = useState(false);
  const { setOpenMobile } = useSidebar();
  return (
    <>
      <SearchButton onClick={() => setOpen(true)} />
      <RouteSearch
        open={open}
        onOpenChange={setOpen}
        onSelect={(id) => {
          onSelect(id);
          setOpen(false);
          setOpenMobile(false);
        }}
      />
    </>
  );
}

function WordGoalCard() {
  const words = 640;
  const goal = 750;
  return (
    <div className='bg-surface-muted/60 rounded-(--ds-radius-card) border border-ui-border p-3'>
      <p className='text-xs font-medium'>Today's words</p>
      <p className='text-text-muted text-[11px]'>{words} of {goal}</p>
      <Progress value={words} max={goal} aria-label="Today's word goal" className='bg-ui-muted mt-2 h-1.5 rounded-full' />
    </div>
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
      title='Search Journal'
      description='Find a journal page by name.'
      showCloseButton
      footer={null}
    >
      <Command shouldFilter={false}>
        <CommandInput placeholder='Search journal pages...' value={term} onValueChange={setTerm} />
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
  const [page, setPage] = useState('today-s-page');
  const [section, setSection] = useState('today');
  const current = routes.find((item) => item.id === page);
  return (
    <AppShellFrame surface='default'>
      <SidebarProvider shortcut={false} className='flex-col' style={{ '--sidebar-width': '13rem' }}>
        <TopBar section={section} onSection={setSection} />
        <div className='relative flex min-h-0 flex-1'>
          <Sidebar mobileTitle='Journal Navigation' mobileDescription='Journal pages and settings.'>
            <SidebarHeader className='px-2 pt-3 pb-0'>
              <JournalSearch onSelect={setPage} />
            </SidebarHeader>
            <SidebarContent role='navigation' aria-label='Journal pages' className='gap-2 px-2 py-2'>
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
            <SidebarFooter className='p-3'>
              <WordGoalCard />
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
