'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  CommandDialog,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
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
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { AppShellBody, AppShellFrame, AppShellHeader, AppShellPanel } from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { AppShellNav } from '../../../../src/components/blocks/AppShell/parts/nav.jsx';
import { AppShellPlaceholderGrid } from '../../../../src/components/blocks/AppShell/parts/placeholder.jsx';
import { ChatModelSelect } from '../../../../src/components/chat/ChatInput/parts/chat-model-select.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const models = [
  { value: 'claude-sonnet-5', label: 'Claude Sonnet 5', badge: 'Default', details: ['Anthropic', '200K context', 'Code'] },
  { value: 'gpt-5-1', label: 'GPT-5.1', details: ['OpenAI', '256K context', 'Balanced'] },
  { value: 'gemini-3-pro', label: 'Gemini 3 Pro', details: ['Google', '1M context', 'Long input'] },
  { value: 'mistral-large', label: 'Mistral Large', details: ['Mistral', '128K context', 'Fastest'] }
];
const shortcuts = [
  { id: 'new-chat', label: 'New Chat', icon: 'Plus' },
  { id: 'projects', label: 'Projects', icon: 'Folder', badge: { label: 4, variant: 'plain' } },
  { id: 'scheduled', label: 'Scheduled', icon: 'Clock', badge: { label: 2, variant: 'plain' } },
  { id: 'customize', label: 'Customize', icon: 'SlidersHorizontal' }
];
const chatsSeed = [
  { id: 'stripe-webhook', label: 'Stripe webhook 500s on charge.refunded', time: '2m', pinned: true },
  { id: 'release-notes', label: 'Q3 release notes draft', time: '1h', pinned: true },
  { id: 'stream-responses', label: 'Stream chat responses', time: '2h' },
  { id: 'churn-tier', label: 'Churn by plan tier', time: '3h' },
  { id: 'mobile-onboarding', label: 'Mobile onboarding revamp scope', time: 'Yesterday' },
  { id: 'p95-latency', label: 'Why is p95 latency up on eu-west', time: 'Yesterday' },
  { id: 'trial-email', label: 'Rewrite the trial expiry email', time: 'Tue' },
  { id: 'events-index', label: 'Postgres index for events table', time: 'Mon' }
];
const artifacts = [
  { id: 'release-pdf', label: 'release-notes-3.4.pdf', icon: 'FileText' },
  { id: 'webhook-ts', label: 'stripe-webhook.ts', icon: 'Code' },
  { id: 'churn-chart', label: 'Churn by plan tier chart', icon: 'BarChart3' },
  { id: 'adoption-chart', label: 'Adoption chart', icon: 'Image' }
];
const links = [
  { id: 'docs', label: 'Docs', icon: 'BookOpen' },
  { id: 'whats-new', label: 'What is new', icon: 'Star' },
  { id: 'help', label: 'Help', icon: 'CircleHelp' }
];
const organizations = [
  { id: 'atlas', name: 'Atlas', tone: 'bg-discovery' },
  { id: 'relay', name: 'Relay', tone: 'bg-info' },
  { id: 'orbit', name: 'Orbit', tone: 'bg-warning' }
];
const user = { name: 'Leo Hart', plan: 'Max', photo: 'https://randomuser.me/api/portraits/men/32.jpg' };

function Brand({ onSearch }) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  if (state === 'collapsed' && !isMobile) {
    // On the rail the header is the expand control; the trigger keeps its tooltip and shortcut hint.
    return <SidebarTrigger label='Expand sidebar' className='mx-auto' />;
  }
  return (
    <div className='flex items-center gap-1'>
      <a
        href='#new-chat'
        className='flex min-w-0 flex-1 items-center gap-2 rounded-(--ds-radius-control) py-1 text-sm font-semibold outline-hidden focus-visible:ring-2 focus-visible:ring-ui-sidebar-ring'
        onClick={(event) => event.preventDefault()}
      >
        <span aria-hidden='true' className='bg-ui-background grid size-8 shrink-0 place-items-center rounded-(--ds-radius-control) border'>
          <RegistryIcon lucide='MessageSquare' className='size-4' aria-hidden='true' />
        </span>
        <span className='truncate'>Gaudi Chat</span>
      </a>
      <Button
        variant='ghost'
        size='icon-sm'
        aria-label='Search chats'
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
    { id: 'pinned', label: 'Pinned chats', icon: 'Pin', items: pinned },
    { id: 'recent', label: 'Recent chats', icon: 'MessageSquare', items: recent }
  ];
  return (
    <SidebarMenu className='hidden gap-0.5 px-2 group-data-[collapsible=icon]:flex'>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip='Search chats' aria-label='Search chats' onClick={onSearch}>
          <RegistryIcon lucide='Search' aria-hidden='true' />
          <span>Search chats</span>
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
              <DropdownMenuLabel>{group.label.replace(' chats', '')}</DropdownMenuLabel>
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
  const [organization, setOrganization] = useState('atlas');
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
              aria-label={`Account and workspace: ${user.name}, ${current.name}`}
              className='group-data-[collapsible=icon]:shadow-none'
            >
              <Avatar className='size-8 rounded-full group-data-[collapsible=icon]:-ms-1'>
                <AvatarImage src={user.photo} alt='' className='rounded-full' />
                <AvatarFallback className='rounded-full'>LH</AvatarFallback>
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
            <DropdownMenuLabel>Organizations</DropdownMenuLabel>
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
              New Organization
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Account</DropdownMenuLabel>
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

function ChatHeader({ title, model, onModelChange, onSearch, onNewChat }) {
  const { isMobile } = useSidebar();
  const [memory, setMemory] = useState(true);
  return (
    <>
      {isMobile ? (
        // Phones get an app bar: the menu, the product, search and a new chat.
        <div className='flex items-center gap-1 border-b px-3 py-2'>
          <SidebarTrigger className='-ms-1' />
          <span className='flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold'>
            <span aria-hidden='true' className='grid size-7 shrink-0 place-items-center rounded-(--ds-radius-control) border'>
              <RegistryIcon lucide='MessageSquare' className='size-3.5' aria-hidden='true' />
            </span>
            <span className='truncate'>Gaudi Chat</span>
          </span>
          <Button variant='ghost' size='icon-sm' aria-label='Search chats' onClick={onSearch}>
            <RegistryIcon lucide='Search' aria-hidden='true' />
          </Button>
          <Button variant='ghost' size='icon-sm' aria-label='New chat' onClick={onNewChat}>
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
              aria-label='Chat memory'
              aria-pressed={memory}
              className='aria-pressed:bg-ui-accent hidden @md:inline-flex'
              onClick={() => setMemory((on) => !on)}
            >
              <RegistryIcon lucide={memory ? 'BookmarkCheck' : 'Bookmark'} aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>{memory ? 'Memory on for this chat' : 'Memory off for this chat'}</TooltipContent>
        </Tooltip>
        <ChatModelSelect models={models} value={model} onValueChange={onModelChange} icon={false} variant='outline' size='sm' align='end' contentClassName='w-72'>
          <div className='text-text-muted flex items-center justify-between text-xs'>
            <span>Switching keeps this chat</span>
            <a href='#compare' className='text-text underline underline-offset-2' onClick={(event) => event.preventDefault()}>
              Compare
            </a>
          </div>
        </ChatModelSelect>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon-sm' aria-label='Chat options'>
              <RegistryIcon lucide='EllipsisVertical' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuLabel>This chat</DropdownMenuLabel>
            <DropdownMenuItem>
              <RegistryIcon lucide='Share2' aria-hidden='true' />
              Share chat
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='Download' aria-hidden='true' />
              Export transcript
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='Pencil' aria-hidden='true' />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'>
              <RegistryIcon lucide='Trash2' aria-hidden='true' />
              Delete chat
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
    <CommandDialog open={open} onOpenChange={onOpenChange} title='Search chats' description='Find a conversation by title.'>
      <Command>
        <CommandInput placeholder='Search chats and projects' />
        <CommandList>
          <CommandEmpty>No chats found.</CommandEmpty>
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
  const [chat, setChat] = useState('stripe-webhook');
  const [tab, setTab] = useState('chats');
  const [model, setModel] = useState('claude-sonnet-5');
  const [searchOpen, setSearchOpen] = useState(false);
  const pinned = chats.filter((entry) => entry.pinned);
  const recent = chats.filter((entry) => !entry.pinned);
  const current = chats.find((entry) => entry.id === chat);
  const togglePin = (item) => setChats((list) => list.map((entry) => (entry.id === item.id ? { ...entry, pinned: !entry.pinned } : entry)));
  const select = (id) => {
    if (id === 'new-chat') return setChat(null);
    if (chats.some((entry) => entry.id === id)) setChat(id);
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
        Share link
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
                <TabsTrigger value='chats'>Chats</TabsTrigger>
                <TabsTrigger value='artifacts'>Artifacts</TabsTrigger>
              </TabsList>
            </SidebarHeader>
            <SidebarContent role='navigation' aria-label='Chats'>
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
                <AppShellNav label='Recent artifacts' hideOnRail items={artifacts} value={chat} onValueChange={() => {}} />
              </TabsContent>
              <AppShellNav className='mt-auto' size='sm' items={links} value={chat} onValueChange={() => {}} />
            </SidebarContent>
          </Tabs>
          <SidebarFooter>
            <AccountMenu />
          </SidebarFooter>
          <SidebarResizeHandle min={224} max={384} />
        </Sidebar>
        <AppShellPanel inset={false}>
          <ChatHeader
            title={current?.label ?? 'New chat'}
            model={model}
            onModelChange={setModel}
            onSearch={() => setSearchOpen(true)}
            onNewChat={() => setChat(null)}
          />
          <AppShellBody>
            <AppShellPlaceholderGrid key={chat ?? 'new'} preset='chat' variant='bare' />
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} chats={chats} onSelect={select} />
    </AppShellFrame>
  );
}
