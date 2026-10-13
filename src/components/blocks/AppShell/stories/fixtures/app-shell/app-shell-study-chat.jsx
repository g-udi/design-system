'use client';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useState } from 'react';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import {
  CommandDialog,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
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
  SidebarResizeHandle,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellBody, AppShellFrame, AppShellHeader, AppShellPanel } from '@gaudi/design-system/blocks/AppShell';
import { AppShellNav } from '@gaudi/design-system/blocks/AppShell';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
import { ChatModelSelect } from '@gaudi/design-system/chat/ChatInput';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// Study tutors: each answers the same thread in a different way.
const models = [
  { value: 'socratic', label: 'Socratic tutor', badge: 'Default', details: ['Asks before it tells', 'Discussion', 'Hints'] },
  { value: 'summariser', label: 'Summariser', details: ['Chapter recaps', 'Key terms', 'Short'] },
  { value: 'quiz', label: 'Quiz master', details: ['Flashcards', 'Spaced review', 'Scores'] },
  { value: 'critic', label: 'Devil’s advocate', details: ['Counter-arguments', 'Sources', 'Debate'] }
];
const shortcuts = [
  { id: 'new-chat', label: 'New thread', icon: 'SquarePen' },
  { id: 'groups', label: 'Reading groups', icon: 'UsersRound', badge: { label: 3, variant: 'plain' } },
  { id: 'flashcards', label: 'Flashcards due', icon: 'Layers', badge: { label: 12, variant: 'plain' } },
  { id: 'plan', label: 'Study plan', icon: 'CalendarRange' }
];
const chatsSeed = [
  { id: 'middlemarch', label: 'Book club: Middlemarch, chapters 1–10', time: '5m', pinned: true },
  { id: 'cog-psych', label: 'Exam prep: cognitive psychology', time: '1h', pinned: true },
  { id: 'geb', label: 'Questions on Gödel, Escher, Bach', time: '2h' },
  { id: 'odyssey', label: 'Compare two Odyssey translations', time: '4h' },
  { id: 'systems', label: 'Reading list for systems thinking', time: 'Yesterday' },
  { id: 'stoics', label: 'Notes from the Stoicism seminar', time: 'Yesterday' },
  { id: 'revolution', label: 'Quiz me on the French Revolution', time: 'Tue' },
  { id: 'sapiens', label: 'Weigh the critiques of Sapiens', time: 'Mon' }
];
const artifacts = [
  { id: 'themes-md', label: 'middlemarch-themes.md', icon: 'FileText' },
  { id: 'memory-cards', label: 'memory-flashcards.csv', icon: 'FileSpreadsheet' },
  { id: 'translations', label: 'Odyssey translations table', icon: 'Table' },
  { id: 'timeline', label: 'Revolution timeline', icon: 'History' }
];
const links = [
  { id: 'guide', label: 'Study guide', icon: 'GraduationCap' },
  { id: 'whats-new', label: 'What is new', icon: 'Sparkles' },
  { id: 'help', label: 'Help', icon: 'CircleHelp' }
];
const organizations = [
  { id: 'thursday', name: 'Thursday book club', tone: 'bg-discovery' },
  { id: 'psych', name: 'Psych 201 cohort', tone: 'bg-info' },
  { id: 'philosophy', name: 'Philosophy circle', tone: 'bg-warning' }
];
const user = { name: 'Maya Lindqvist', plan: 'Student', photo: '/avatars/person-22.svg' };

function Brand({ onSearch }) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  if (state === 'collapsed' && !isMobile) {
    // On the rail the header is the expand control; the trigger keeps its tooltip and shortcut hint.
    return <SidebarTrigger label='Expand sidebar' className='mx-auto' />;
  }
  return (
    <div className='flex items-center gap-1'>
      <Link
        variant='bare'
        href='#new-chat'
        className='flex min-w-0 flex-1 items-center gap-2 rounded-(--ds-radius-control) py-1 text-sm font-semibold outline-hidden focus-visible:ring-2 focus-visible:ring-ui-sidebar-ring'
        onClick={(event) => event.preventDefault()}
      >
        <GaudiBrand className='text-sm' />
        <span className='truncate'>Study</span>
      </Link>
      <Button
        variant='ghost'
        size='icon-sm'
        aria-label='Search threads'
        onClick={() => {
          // The palette replaces the phone sheet.
          if (isMobile) setOpenMobile(false);
          onSearch();
        }}
      >
        <RegistryIcon lucide='Search' aria-hidden='true' />
      </Button>
      {isMobile ? null : <SidebarTrigger label='Collapse sidebar' />}
    </div>
  );
}

/** Pinned and Recent open as menus beside the collapsed rail. */
function RailThreads({ pinned, recent, value, onValueChange, onSearch }) {
  const groups = [
    { id: 'pinned', label: 'Pinned threads', icon: 'Pin', items: pinned },
    { id: 'recent', label: 'Recent threads', icon: 'MessageSquare', items: recent }
  ];
  return (
    <SidebarMenu className='hidden gap-0.5 px-2 group-data-[collapsible=icon]:flex'>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip='Search threads' aria-label='Search threads' onClick={onSearch}>
          <RegistryIcon lucide='Search' aria-hidden='true' />
          <span>Search threads</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {groups.map((group) => (
        <SidebarMenuItem key={group.id}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton aria-label={group.label}>
                <RegistryIcon lucide={group.icon} aria-hidden='true' />
                <span>{group.label}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='right' align='start' className='w-72'>
              <DropdownMenuLabel>{group.label.replace(' threads', '')}</DropdownMenuLabel>
              {group.items.map((chat) => (
                <DropdownMenuItem key={chat.id} aria-current={chat.id === value ? 'page' : undefined} className='aria-[current=page]:font-medium' onSelect={() => onValueChange(chat.id)}>
                  <span className='min-w-0 flex-1 truncate'>{chat.label}</span>
                  <DropdownMenuShortcut>{chat.time}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function Count({ children, label }) {
  return (
    <>
      <span className='flex-1 text-start'>{label}</span>
      <span className='text-text-muted me-1 font-normal tabular-nums'>{children}</span>
    </>
  );
}

function AccountMenu() {
  const { isMobile } = useSidebar();
  const [organization, setOrganization] = useState('thursday');
  const [theme, setTheme] = useState('system');
  const current = organizations.find((entry) => entry.id === organization);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              variant='outline'
              aria-label={`Account and group: ${user.name}, ${current.name}`}
              className='group-data-[collapsible=icon]:shadow-none'
            >
              <Avatar className='size-8 rounded-full'>
                <AvatarImage src={user.photo} alt='' className='rounded-full' />
                <AvatarFallback className='rounded-full'>ML</AvatarFallback>
              </Avatar>
              <span className='grid min-w-0 leading-tight'>
                <span className='truncate font-medium'>{user.name}</span>
                <span className='text-text-muted flex items-center gap-1 text-xs'>
                  <span aria-hidden='true' className={`size-2 rounded-full ${current.tone}`} />
                  {current.name}
                  <span aria-hidden='true'>·</span>
                  {user.plan}
                </span>
              </span>
              <RegistryIcon lucide='MoreHorizontal' aria-hidden='true' className='ms-auto opacity-60' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-60'>
            <DropdownMenuLabel>Reading groups</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={organization} onValueChange={setOrganization}>
              {organizations.map((entry) => (
                <DropdownMenuRadioItem key={entry.id} value={entry.id} className='gap-2'>
                  <span aria-hidden='true' className={`size-2 rounded-full ${entry.tone}`} />
                  {entry.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuItem>
              <RegistryIcon lucide='Plus' aria-hidden='true' />
              Start a group
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon lucide='User' aria-hidden='true' />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='Target' aria-hidden='true' />
                Study goals
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

function ChatHeader({ title, model, onModelChange, onSearch, onNewChat }) {
  const { isMobile } = useSidebar();
  const [memory, setMemory] = useState(true);
  return (
    <>
      {isMobile ? (
        // Phones get an app bar: the menu, the product, search and a new thread.
        <div className='flex items-center gap-1 border-b px-3 py-2'>
          <SidebarTrigger className='-ms-1' />
          <span className='flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold'>
            <GaudiBrand className='text-sm' />
            <span className='truncate'>Study</span>
          </span>
          <Button variant='ghost' size='icon-sm' aria-label='Search threads' onClick={onSearch}>
            <RegistryIcon lucide='Search' aria-hidden='true' />
          </Button>
          <Button variant='ghost' size='icon-sm' aria-label='New thread' onClick={onNewChat}>
            <RegistryIcon lucide='Plus' aria-hidden='true' />
          </Button>
        </div>
      ) : null}
      <AppShellHeader>
        <h2 className='min-w-0 flex-1 truncate text-sm font-medium'>{title}</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon-sm'
              aria-label='Spoiler guard'
              aria-pressed={memory}
              className='aria-pressed:bg-ui-accent hidden @md:inline-flex'
              onClick={() => setMemory((on) => !on)}
            >
              <RegistryIcon lucide={memory ? 'EyeOff' : 'Eye'} aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>{memory ? 'Hiding chapters you have not read' : 'Showing the whole book'}</TooltipContent>
        </Tooltip>
        <ChatModelSelect models={models} value={model} onValueChange={onModelChange} label='Tutor' icon={false} variant='outline' size='sm' align='end' contentClassName='w-72'>
          <div className='text-text-muted flex items-center justify-between text-xs'>
            <span>Switching keeps this thread</span>
            <Link href='#compare' className='underline underline-offset-2' onClick={(event) => event.preventDefault()}>
              Compare tutors
            </Link>
          </div>
        </ChatModelSelect>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon-sm' aria-label='Thread options'>
              <RegistryIcon lucide='EllipsisVertical' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuLabel>This thread</DropdownMenuLabel>
            <DropdownMenuItem>
              <RegistryIcon lucide='Share2' aria-hidden='true' />
              Share with group
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='Layers' aria-hidden='true' />
              Make flashcards
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='Pencil' aria-hidden='true' />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'>
              <RegistryIcon lucide='Trash2' aria-hidden='true' />
              Delete thread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </AppShellHeader>
    </>
  );
}

function SearchPalette({ open, onOpenChange, chats, onSelect }) {
  const groups = [
    { heading: 'Pinned', items: chats.filter((chat) => chat.pinned) },
    { heading: 'Recent', items: chats.filter((chat) => !chat.pinned) }
  ];
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title='Search threads' description='Find a study thread by title.'>
      <Command>
        <CommandInput placeholder='Search threads and notes' />
        <CommandList>
          <CommandEmpty>No threads found.</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group.heading} heading={group.heading}>
              {group.items.map((chat) => (
                <CommandItem key={chat.id} value={chat.label} onSelect={() => onSelect(chat.id)}>
                  <RegistryIcon lucide='MessageSquare' aria-hidden='true' />
                  <span className='truncate'>{chat.label}</span>
                  <CommandShortcut>{chat.time}</CommandShortcut>
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
  const [chats, setChats] = useState(chatsSeed);
  const [chat, setChat] = useState('middlemarch');
  const [tab, setTab] = useState('chats');
  const [model, setModel] = useState('socratic');
  const [searchOpen, setSearchOpen] = useState(false);
  const pinned = chats.filter((entry) => entry.pinned);
  const recent = chats.filter((entry) => !entry.pinned);
  const destinations = [...chats, ...artifacts, ...links];
  const current = destinations.find((entry) => entry.id === chat);
  const togglePin = (item) => setChats((list) => list.map((entry) => (entry.id === item.id ? { ...entry, pinned: !entry.pinned } : entry)));
  const select = (id) => {
    if (id === 'new-chat') return setChat(null);
    if (destinations.some((entry) => entry.id === id)) setChat(id);
    setSearchOpen(false);
  };
  const quickAction = (item) => ({ label: `${item.pinned ? 'Unpin' : 'Pin'} ${item.label}`, icon: item.pinned ? 'PinOff' : 'Pin', onSelect: () => togglePin(item) });
  const rowActions = (item) => (
    <>
      <DropdownMenuItem onSelect={() => togglePin(item)}>
        <RegistryIcon lucide={item.pinned ? 'PinOff' : 'Pin'} aria-hidden='true' />
        {item.pinned ? 'Unpin' : 'Pin to top'}
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='Pencil' aria-hidden='true' />
        Rename
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='Share2' aria-hidden='true' />
        Share with group
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='Archive' aria-hidden='true' />
        Archive
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant='destructive'
        onSelect={() => {
          setChats((list) => list.filter((entry) => entry.id !== item.id));
          if (chat === item.id) setChat(null);
        }}
      >
        <RegistryIcon lucide='Trash2' aria-hidden='true' />
        Delete
      </DropdownMenuItem>
    </>
  );
  return (
    <AppShellFrame surface='default'>
      {/* Several shells share the docs page, so this one leaves ⌘B to another and collapses from its trigger. */}
      <SidebarProvider defaultWidth={248} shortcut={false}>
        <Sidebar collapsible='icon'>
          {/* The tabs span the header and the list, so each tab controls a real panel. */}
          <Tabs value={tab} onValueChange={setTab} className='min-h-0 flex-1 gap-0'>
            <SidebarHeader>
              <Brand onSearch={() => setSearchOpen(true)} />
              <TabsList variant='outline' className='grid w-full grid-cols-2 group-data-[collapsible=icon]:hidden'>
                <TabsTrigger value='chats'>Threads</TabsTrigger>
                <TabsTrigger value='artifacts'>Notes</TabsTrigger>
              </TabsList>
            </SidebarHeader>
            <SidebarContent role='navigation' aria-label='Study threads'>
              <AppShellNav items={shortcuts} value={chat ?? 'new-chat'} onValueChange={select} />
              <SidebarSeparator className='mx-0' />
              <TabsContent value='chats' className='p-0'>
                {pinned.length ? (
                  <AppShellNav
                    label={<Count label='Pinned'>{pinned.length}</Count>}
                    collapsible
                    hideOnRail
                    items={pinned}
                    value={chat}
                    onValueChange={select}
                    quickAction={quickAction}
                    actions={rowActions}
                  />
                ) : null}
                <AppShellNav
                  label={<Count label='Recent'>{recent.length}</Count>}
                  collapsible
                  hideOnRail
                  items={recent}
                  value={chat}
                  onValueChange={select}
                  quickAction={quickAction}
                  actions={rowActions}
                />
                <RailThreads pinned={pinned} recent={recent} value={chat} onValueChange={select} onSearch={() => setSearchOpen(true)} />
              </TabsContent>
              <TabsContent value='artifacts' className='p-0'>
                <AppShellNav label='Study notes' hideOnRail items={artifacts} value={chat} onValueChange={select} />
              </TabsContent>
              <AppShellNav className='mt-auto' size='sm' items={links} value={chat} onValueChange={select} />
            </SidebarContent>
          </Tabs>
          <SidebarFooter>
            <AccountMenu />
          </SidebarFooter>
          <SidebarResizeHandle min={224} max={384} />
        </Sidebar>
        <AppShellPanel inset={false}>
          <ChatHeader
            title={current?.label ?? 'New thread'}
            model={model}
            onModelChange={setModel}
            onSearch={() => setSearchOpen(true)}
            onNewChat={() => setChat(null)}
          />
          <AppShellBody>
            <div key={chat ?? 'new'} aria-hidden='true' className='flex min-h-0 flex-1 flex-col gap-4 p-4'><Skeleton className='ms-auto h-10 w-1/2' /><Skeleton className='h-24 w-3/4' /><Skeleton className='ms-auto h-10 w-1/3' /><Skeleton className='h-40 w-full' /></div>
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} chats={chats} onSelect={select} />
    </AppShellFrame>
  );
}
