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
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuShortcut,
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
import { Badge, StatusDot } from '@gaudi/design-system/core/Pill';
import { ChatMessage, ChatMessageContent, ChatMessageGroup, ChatMessageHeader } from '@gaudi/design-system/chat/ChatMessage';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import Dialog from '@gaudi/design-system/core/Dialog';
import Input from '@gaudi/design-system/core/Input';
import { Label } from '@gaudi/design-system/core/Field';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@gaudi/design-system/core/Item';
import { ChatModelSelect, ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';
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

const discussions = {
  middlemarch: ['Why does Dorothea want to marry Casaubon?', 'At first she sees his research as a way into an intellectual life. Compare her hopes in chapter 3 with the way he describes their future in his letter.'],
  'cog-psych': ['What makes retrieval practice different from rereading?', 'Retrieval asks you to reconstruct an idea from memory. Try explaining yesterday’s experiment before looking at your notes.'],
  geb: ['How does the book connect a picture with a proof?', 'Look for a rule that refers back to the system it belongs to. Which part of the drawing crosses between levels?'],
  odyssey: ['How do the translations introduce Odysseus?', 'Read the first four lines aloud. Note which words describe him and which tell you what happened to him.'],
  systems: ['Where should our reading group start?', 'Begin with feedback loops. Bring one example in which the result of an action changes what happens next.'],
  stoics: ['What did we mean by control in the seminar?', 'Separate your judgment about an event from the event itself. Then test the distinction against the example in your notes.'],
  revolution: ['Which event should I place first on the timeline?', 'Start with the opening of the Estates-General in May 1789. What changed between that meeting and the Tennis Court Oath?'],
  sapiens: ['How should we assess the chapter’s central claim?', 'Write down the claim, its evidence and a possible counterexample. Which of the three does the chapter leave least clear?']
};
const studyNotes = {
  'themes-md': ['Ambition and obligation', 'Dorothea imagines a life of useful work. Keep a note of the promises she makes to herself before the marriage.'],
  'memory-cards': ['Memory prompts', 'Define retrieval practice from memory. Then name a case where recognition would give a different result.'],
  translations: ['Opening lines', 'Compare the first description of Odysseus, the voice of the invocation and the ordering of the journey.'],
  timeline: ['1789 in three dates', '5 May · Estates-General opens. 20 June · Tennis Court Oath. 14 July · Storming of the Bastille.'],
  guide: ['Before the next meeting', 'Choose one passage, write down a question and bring a quotation that supports your reading.'],
  'whats-new': ['Notes alongside threads', 'Open the Notes tab to revisit chapter notes, revision cards and reading timelines.'],
  help: ['Using the study space', 'Open a thread to discuss a text. Use its pin action to keep it at the top of your sidebar.'],
  plan: ['Thursday reading session', 'Finish chapters 1–10 of Middlemarch. Gather two passages and one question for the group.'],
  flashcards: ['Retrieval practice', 'Without looking at your notes, describe one difference between recall and recognition.'],
  groups: ['Reading groups', 'Your groups are Thursday book club, Psych 201 cohort and Philosophy circle. Switch between them from your account menu.']
};

function Discussion({ thread, messages, model, onSend, guard }) {
  const starter = discussions[thread?.id];
  const history = [...(starter ? [{ who: 'You', text: starter[0] }, { who: 'Socratic tutor', text: starter[1] }] : []), ...messages];
  return (
    <section aria-label='Study discussion' className='mx-auto grid w-full min-w-0 max-w-2xl content-start gap-6 p-4 @md:p-6'>
      {history.length ? (
        <ChatMessageGroup aria-label='Thread messages' className='gap-5'>
          {history.map(({ who, text }, index) => (
            <ChatMessage key={index} align={who === 'You' ? 'end' : 'start'} aria-label={who}>
              <ChatMessageContent className='gap-1.5'>
                <ChatMessageHeader className={who === 'You' ? 'justify-end' : undefined}><strong className='text-xs text-text-muted'>{who}</strong></ChatMessageHeader>
                <ChatBubble variant={who === 'You' ? 'muted' : 'ghost'} align={who === 'You' ? 'end' : 'start'}><ChatBubbleContent>{text}</ChatBubbleContent></ChatBubble>
              </ChatMessageContent>
            </ChatMessage>
          ))}
        </ChatMessageGroup>
      ) : <EmptyState compact title='Start a study thread' description='Ask a question about your reading or bring a passage to discuss.' />}
      {!guard && thread?.id === 'middlemarch' && <aside className='border-ui-border border-s-2 ps-3 text-sm'><strong>Later chapters</strong><p>Revisit Dorothea’s choice after Casaubon’s will. How does the codicil change what she can do?</p></aside>}
      <ChatPromptComposer key={thread?.id ?? 'new'} onSubmit={onSend} labels={{ message: 'Study message', placeholder: 'Add to the discussion…', send: 'Send message' }}
        footer={<span className='text-xs text-text-muted'>Studying with {model}</span>} />
    </section>
  );
}

function Brand({ onSearch, onNewChat }) {
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
        onClick={(event) => { event.preventDefault(); onNewChat(); if (isMobile) setOpenMobile(false); }}
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

function AccountMenu({ onSelect, organization, setOrganization }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const go = id => { onSelect(id); if (isMobile) setOpenMobile(false); };
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
                  <StatusDot className={`size-2 ${current.tone}`} />
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
                  <StatusDot className={`size-2 ${entry.tone}`} />
                  {entry.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => go('groups')}>View reading groups</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => go('plan')}>Study plan</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function ChatHeader({ title, model, onModelChange, onSearch, onNewChat, thread, onAction, guard, setGuard }) {
  const { isMobile } = useSidebar();
  const [tutorsOpen, setTutorsOpen] = useState(false);
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
      <AppShellHeader className='h-auto min-h-12 py-1.5'>
        <h2 className='min-w-0 flex-1 break-words text-sm leading-tight font-medium'>{title}</h2>
        {thread?.id === 'middlemarch' && <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon-sm'
              aria-label='Spoiler guard'
              aria-pressed={guard}
              className='aria-pressed:bg-ui-accent'
              onClick={() => setGuard((on) => !on)}
            >
              <RegistryIcon lucide={guard ? 'EyeOff' : 'Eye'} aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>{guard ? 'Hiding chapters you have not read' : 'Showing the whole book'}</TooltipContent>
        </Tooltip>}
        <ChatModelSelect open={tutorsOpen} onOpenChange={setTutorsOpen} models={models} value={model} onValueChange={onModelChange} label='Tutor' icon={false} variant='outline' size='sm' align='end' contentClassName='w-72'>
          <div className='text-text-muted flex items-center justify-between text-xs'>
            <span>Switching keeps this thread</span>
            <Link href='#compare' className='underline underline-offset-2' onClick={(event) => { event.preventDefault(); setTutorsOpen(false); onAction('compare'); }}>
              Compare tutors
            </Link>
          </div>
        </ChatModelSelect>
        {thread ? (<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon-sm' aria-label='Thread options'>
              <RegistryIcon lucide='EllipsisVertical' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuLabel>This thread</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => onAction('share')}>
              <RegistryIcon lucide='Share2' aria-hidden='true' />
              Share with group
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onAction('cards')}>
              <RegistryIcon lucide='Layers' aria-hidden='true' />
              Make flashcards
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onAction('rename')}>
              <RegistryIcon lucide='Pencil' aria-hidden='true' />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive' onSelect={() => onAction('delete')}>
              <RegistryIcon lucide='Trash2' aria-hidden='true' />
              Delete thread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>) : null}
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
  const [messages, setMessages] = useState({});
  const [action, setAction] = useState(null);
  const [newName, setNewName] = useState('');
  const [cards, setCards] = useState([]);
  const [guard, setGuard] = useState(true);
  const [shared, setShared] = useState([]);
  const [organization, setOrganization] = useState('thursday');
  const group = organizations.find(item => item.id === organization);
  const [chat, setChat] = useState('middlemarch');
  const [tab, setTab] = useState('chats');
  const [model, setModel] = useState('socratic');
  const [searchOpen, setSearchOpen] = useState(false);
  const pinned = chats.filter((entry) => entry.pinned);
  const recent = chats.filter((entry) => !entry.pinned);
  const destinations = [...chats, ...artifacts, ...links, ...shortcuts];
  const current = destinations.find((entry) => entry.id === chat);
  const thread = chats.find(entry => entry.id === chat);
  const note = studyNotes[chat];
  const startAction = (kind, item = thread) => { setNewName(item?.label ?? ''); setAction({ kind, item }); };
  const send = (text) => {
    const id = thread?.id ?? crypto.randomUUID();
    if (!thread) setChats(list => [{ id, label: text.slice(0, 60), time: 'Now' }, ...list]);
    setMessages(list => ({ ...list, [id]: [...(list[id] ?? []), { who: 'You', text }] }));
    setChat(id);
  };
  const remove = (id) => {
    setChats(list => list.filter(entry => entry.id !== id));
    if (chat === id) setChat(null);
  };
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
      <DropdownMenuItem onSelect={() => startAction('rename', item)}>Rename</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => startAction('share', item)}>Share with group</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant='destructive'
        onSelect={() => startAction('delete', item)}
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
              <Brand onNewChat={() => select('new-chat')} onSearch={() => setSearchOpen(true)} />
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
            <AccountMenu onSelect={select} organization={organization} setOrganization={setOrganization} />
          </SidebarFooter>
          <SidebarResizeHandle min={224} max={384} />
        </Sidebar>
        <AppShellPanel inset={false}>
          <ChatHeader guard={guard} setGuard={setGuard}
            title={current?.label ?? 'New thread'}
            model={model}
            onModelChange={setModel}
            onSearch={() => setSearchOpen(true)}
            onNewChat={() => setChat(null)}
            thread={thread}
            onAction={startAction}
          />
          <AppShellBody>
            {note ? (
              <section className='mx-auto grid w-full max-w-2xl content-start gap-4 p-4 @md:p-6'>
                <h3 className='text-xl font-semibold'>{note[0]}</h3>
                <p className='text-sm leading-relaxed text-text-muted'>{note[1]}</p>
                {chat === 'flashcards' && cards.map(card => <Badge key={card} variant='outline'>{card}</Badge>)}
              </section>
            ) : <Discussion guard={guard} thread={thread} messages={messages[chat] ?? []} model={models.find(entry => entry.value === model).label} onSend={send} />}
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
      {action && (
        <Dialog open onOpenChange={open => { if (!open) setAction(null); }} title={{ compare: 'Compare tutors', rename: 'Rename thread', share: 'Share with group', cards: 'Practice card', delete: 'Delete thread?' }[action.kind]}>
          {action.kind === 'compare' ? <ItemGroup>{models.map(tutor => <Item key={tutor.value} size='sm'><ItemContent><ItemTitle>{tutor.label}</ItemTitle><ItemDescription>{tutor.details.join(' · ')}</ItemDescription></ItemContent></Item>)}</ItemGroup> : null}
          {action.kind === 'rename' ? <form className='grid gap-3' onSubmit={event => { event.preventDefault(); if (!newName.trim()) return; setChats(list => list.map(entry => entry.id === action.item.id ? { ...entry, label: newName.trim() } : entry)); setAction(null); }}><Label htmlFor='study-thread-name'>Thread name</Label><Input id='study-thread-name' value={newName} onChange={event => setNewName(event.target.value)} required /><Button type='submit' disabled={!newName.trim()}>Save name</Button></form> : null}
          {action.kind === 'share' ? <div className='grid gap-3'><p>Share “{action.item.label}” with {group.name}.</p><Button disabled={shared.includes(organization + '/' + action.item.id)} onClick={() => setShared(list => [...list, organization + '/' + action.item.id])}>{shared.includes(organization + '/' + action.item.id) ? 'Shared with group' : 'Share thread'}</Button></div> : null}
          {action.kind === 'cards' ? <div className='grid gap-3'><p>{discussions[action.item.id]?.[0] ?? action.item.label}</p><Button disabled={cards.includes(action.item.label)} onClick={() => setCards(list => [...list, action.item.label])}>{cards.includes(action.item.label) ? 'Added to flashcards' : 'Add to flashcards'}</Button></div> : null}
          {action.kind === 'delete' ? <div className='grid gap-3'><p>Remove “{action.item.label}” from this study space?</p><Button tone='danger' onClick={() => { remove(action.item.id); setAction(null); }}>Delete thread</Button></div> : null}
        </Dialog>
      )}
      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} chats={chats} onSelect={select} />
    </AppShellFrame>
  );
}
