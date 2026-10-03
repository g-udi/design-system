'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
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
import { InputGroupButton } from '../../../../src/components/core/Input/parts/input-group.jsx';
import { ToggleGroup, ToggleGroupItem } from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { AppShellFrame, AppShellHeader, AppShellPanel } from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { AppShellNav } from '../../../../src/components/blocks/AppShell/parts/nav.jsx';
import { AppShellPlaceholderGrid } from '../../../../src/components/blocks/AppShell/parts/placeholder.jsx';
import { Bubble, BubbleContent } from '../../../../src/components/chat/Bubble/parts/bubble.jsx';
import { ChatModelSelect } from '../../../../src/components/chat/ChatInput/parts/chat-model-select.jsx';
import { PromptComposer } from '../../../../src/components/chat/ChatInput/parts/prompt-composer.jsx';
import { ChatWelcome } from '../../../../src/components/chat/ChatWelcome/parts/chat-welcome.jsx';
import { Message, MessageAvatar, MessageContent } from '../../../../src/components/chat/Message/parts/message.jsx';
import { MessageParts } from '../../../../src/components/chat/MessageList/parts/message-parts.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { ClaudeAiIcon } from '../../../../src/icons/brands/claudeAiIcon.jsx';
import { Gemini } from '../../../../src/icons/brands/gemini.jsx';
import { Openai } from '../../../../src/icons/brands/openai.jsx';

const models = [
  { value: 'gpt-4', label: 'GPT-4', icon: Openai, badge: 'Default', badgeTone: 'discovery', description: 'Most capable for complex reasoning.' },
  { value: 'claude', label: 'Claude', icon: ClaudeAiIcon, badge: 'Fast', badgeTone: 'success', description: 'Thoughtful, great for long writing.' },
  { value: 'gemini', label: 'Gemini', icon: Gemini, description: 'Fast multimodal answers and search.' }
];
const pinnedSeed = [{ id: 'onboarding-email', label: 'Onboarding email draft', icon: 'Mail', model: 'Claude', count: 7 }];
const recentSeed = [
  { id: 'quarterly-revenue', label: 'Quarterly revenue summary', icon: 'FileText' },
  { id: 'refactor-auth', label: 'Refactor auth middleware', icon: 'Code' },
  { id: 'lisbon-trip', label: 'Lisbon trip itinerary', icon: 'MapPin' },
  { id: 'launch-checklist', label: 'Launch checklist draft', icon: 'ListChecks' },
  { id: 'vector-search', label: 'Explain vector search', icon: 'Search' },
  { id: 'sql-query', label: 'Optimize SQL query', icon: 'Database' }
];
const quickActions = [
  { id: 'favorites', label: 'Favorites', icon: 'Star', badge: { label: 2, variant: 'discovery-light' } },
  { id: 'clear-history', label: 'Clear History', icon: 'Trash2' },
  { id: 'chat-history', label: 'Chat History', icon: 'History' },
  { id: 'templates', label: 'Templates', icon: 'FileText', badge: { label: 5, variant: 'destructive-light' } },
  { id: 'ai-settings', label: 'AI Settings', icon: 'SlidersHorizontal' }
];
const prompts = [
  { id: 'email', label: 'Draft an email', icon: 'Mail' },
  { id: 'summary', label: 'Summarize a file', icon: 'FileText' },
  { id: 'function', label: 'Write a function', icon: 'Code' },
  { id: 'trip', label: 'Plan a trip', icon: 'MapPin' }
];
const user = { name: 'AI Assistant', status: 'Always here to help', photo: '/avatars/women/65.jpg' };
const assistantPhoto = '/avatars/women/65.jpg';

function Brand() {
  return (
    <div className='flex items-center gap-2 group-data-[collapsible=icon]:flex-col'>
      <a
        href='#new-chat'
        className='flex min-w-0 flex-1 items-center gap-2 rounded-(--ds-radius-control) px-1 py-1 text-sm font-semibold outline-hidden focus-visible:ring-2 focus-visible:ring-ui-sidebar-ring group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:px-0'
        onClick={(event) => event.preventDefault()}
      >
        <BrandMark />
        <span className='truncate group-data-[collapsible=icon]:sr-only'>Gaudi AI</span>
      </a>
      {/* On the rail the trigger moves to the page header. */}
      <SidebarTrigger className='group-data-[collapsible=icon]:hidden' />
    </div>
  );
}

function BrandMark({ className = 'size-7' }) {
  return (
    <span aria-hidden='true' className={`bg-ui-foreground text-ui-background grid shrink-0 place-items-center rounded-(--ds-radius-control) ${className}`}>
      <RegistryIcon lucide='Sparkles' className='size-4' aria-hidden='true' />
    </span>
  );
}

function NewChatButton({ onClick }) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const rail = state === 'collapsed' && !isMobile;
  return (
    <Button
      tone='neutral'
      aria-label={rail ? 'New Chat' : undefined}
      className={rail ? 'size-8 self-center p-0' : 'w-full justify-between'}
      onClick={() => {
        onClick();
        // In the phone sheet a new chat also closes the sheet, as choosing a thread does.
        if (isMobile) setOpenMobile(false);
      }}
    >
      {rail ? null : <span>New Chat</span>}
      <RegistryIcon lucide='Sparkles' aria-hidden='true' />
    </Button>
  );
}

/** The sidebar's model picker: one tile per model, in step with the header picker. */
function ModelGrid({ model, onChange }) {
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel id='ai-model-label'>AI Model</SidebarGroupLabel>
      <SidebarGroupContent>
        <ToggleGroup
          type='single'
          variant='outline'
          spacing={2}
          value={model}
          onValueChange={(next) => next && onChange(next)}
          aria-labelledby='ai-model-label'
          className='grid w-full grid-cols-3'
        >
          {models.map(({ value, label, icon: Icon }) => (
            <ToggleGroupItem
              key={value}
              value={value}
              aria-label={label}
              className='bg-ui-background data-[state=on]:bg-ui-sidebar-accent h-auto min-w-0 flex-col gap-1.5 py-2.5 text-xs font-medium'
            >
              <Icon aria-hidden='true' className='size-4 fill-current' />
              <span className='truncate'>{label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

/** Pinned threads sit on dashed cards with their model and message count. */
function PinnedThreads({ items, value, onValueChange }) {
  const { isMobile, setOpenMobile } = useSidebar();
  if (!items.length) return null;
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Pinned</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className='gap-1'>
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                isActive={item.id === value}
                className='h-auto items-start rounded-(--ds-radius-card) border border-dashed border-ui-sidebar-border py-2'
              >
                <a
                  href={`#${item.id}`}
                  aria-current={item.id === value ? 'page' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onValueChange(item.id);
                    if (isMobile) setOpenMobile(false);
                  }}
                >
                  <RegistryIcon lucide={item.icon} aria-hidden='true' className='text-text-muted mt-0.5' />
                  <span className='grid min-w-0 gap-1'>
                    <span className='truncate font-medium'>{item.label}</span>
                    <span className='text-text-muted flex items-center gap-1.5 text-xs font-normal'>
                      <Badge variant='outline' size='xs' className='font-normal'>{item.model}</Badge>
                      <span aria-hidden='true' className='bg-text-muted/60 size-1 rounded-full' />
                      {item.count} msgs
                    </span>
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function UserMenu({ onNewChat }) {
  const { isMobile } = useSidebar();
  const [theme, setTheme] = useState('system');
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' aria-label={`Account: ${user.name}`} className='data-[state=open]:bg-ui-sidebar-accent'>
              <span className='relative shrink-0 group-data-[collapsible=icon]:-ms-1'>
                <Avatar className='size-8 rounded-full'>
                  <AvatarImage src={user.photo} alt='' className='rounded-full' />
                  <AvatarFallback className='rounded-full'>AI</AvatarFallback>
                </Avatar>
                <span aria-hidden='true' className='bg-success ring-ui-sidebar absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full ring-2' />
              </span>
              <span className='grid min-w-0 leading-tight'>
                <span className='truncate font-semibold'>{user.name}</span>
                <span className='text-text-muted truncate text-xs'>{user.status}</span>
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-60'>
            <DropdownMenuLabel className='grid font-normal leading-tight'>
              <span className='font-medium'>{user.name}</span>
              <span className='text-text-muted text-xs'>{user.status}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={onNewChat}>
                <RegistryIcon lucide='Plus' aria-hidden='true' />
                New Chat
                <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='History' aria-hidden='true' />
                Chat History
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='SlidersHorizontal' aria-hidden='true' />
                AI Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='LifeBuoy' aria-hidden='true' />
                Help & Support
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
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

function ChatHeader({ model, onModelChange }) {
  const { isMobile, state } = useSidebar();
  return (
    <AppShellHeader>
      {isMobile || state === 'collapsed' ? (
        <>
          <SidebarTrigger className='-ms-1' />
          <span aria-hidden='true' className='bg-ui-border h-5 w-px' />
        </>
      ) : null}
      <ChatModelSelect
        models={models}
        value={model}
        onValueChange={onModelChange}
        label='Model'
        variant='outline'
        size='sm'
        contentClassName='w-72'
      />
      <Button variant='outline' size='sm' className='ms-auto'>
        <RegistryIcon lucide='Share2' aria-hidden='true' />
        Share Chat
      </Button>
    </AppShellHeader>
  );
}

function Composer({ model, draft, onDraftChange, onSend }) {
  const [search, setSearch] = useState(false);
  const current = models.find((entry) => entry.value === model);
  return (
    <div className='bg-ui-background sticky bottom-0 z-1 px-4 pt-2 pb-3'>
      <PromptComposer
        className='mx-auto w-full max-w-2xl [&_[data-slot=prompt-composer-footer]]:text-center'
        value={draft}
        onValueChange={onDraftChange}
        onSubmit={onSend}
        labels={{ message: 'Message Gaudi AI', placeholder: 'Message Gaudi AI...', send: 'Send message' }}
        toolbar={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton size='icon-sm' aria-label='Add attachment'>
                  <RegistryIcon lucide='Plus' />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side='top' align='start' className='w-44'>
                <DropdownMenuItem>
                  <RegistryIcon lucide='Upload' aria-hidden='true' />
                  Upload File
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RegistryIcon lucide='Image' aria-hidden='true' />
                  Add Photo
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RegistryIcon lucide='Code' aria-hidden='true' />
                  Add Code
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupButton size='sm' aria-pressed={search} aria-label='Search the web' className='aria-pressed:bg-ui-accent aria-pressed:text-accent' onClick={() => setSearch((on) => !on)}>
              <RegistryIcon lucide='Globe' />
              Search
            </InputGroupButton>
          </>
        }
        actions={
          <>
            <span className='text-text-muted hidden px-1 font-mono text-xs @md:inline'>{current?.label}</span>
            <InputGroupButton size='icon-sm' aria-label='Use voice input'>
              <RegistryIcon lucide='Mic' />
            </InputGroupButton>
          </>
        }
        footer='Gaudi AI can make mistakes. Check important info.'
      />
    </div>
  );
}

function Thread({ turns, model }) {
  const current = models.find((entry) => entry.value === model);
  return (
    <section aria-label='Conversation' className='mx-auto grid w-full max-w-2xl gap-6 px-4 py-6'>
      {turns.map((turn) =>
        turn.role === 'user' ? (
          <Message key={turn.id} align='end'>
            <MessageContent>
              <span className='sr-only'>You:</span>
              <Bubble align='end' variant='secondary'>
                <BubbleContent>{turn.text}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        ) : (
          <Message key={turn.id}>
            <MessageAvatar>
              <Avatar className='size-7 rounded-full'>
                <AvatarImage src={assistantPhoto} alt='' className='rounded-full' />
                <AvatarFallback className='rounded-full'>AI</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <span className='sr-only'>{current?.label}:</span>
              <MessageParts parts={[{ type: 'text', text: turn.text }]} />
            </MessageContent>
          </Message>
        )
      )}
    </section>
  );
}

const replyTo = (model) => `Here is a first pass, written with **${model}**. Tell me what to tighten, and I will revise it.`;

export function Pattern() {
  const [model, setModel] = useState('gpt-4');
  const [thread, setThread] = useState(null);
  const [pinned, setPinned] = useState(pinnedSeed);
  const [recent, setRecent] = useState(recentSeed);
  const [draft, setDraft] = useState('');
  const [turns, setTurns] = useState([]);
  const modelLabel = models.find((entry) => entry.value === model)?.label;
  const newChat = () => {
    setThread(null);
    setTurns([]);
    setDraft('');
  };
  const openThread = (id) => {
    setThread(id);
    setTurns([]);
  };
  const send = (text) => {
    if (!text) return;
    const stamp = turns.length;
    setThread(null);
    setTurns((list) => [
      ...list,
      { id: `user-${stamp}`, role: 'user', text },
      { id: `assistant-${stamp}`, role: 'assistant', text: replyTo(modelLabel) }
    ]);
    setDraft('');
  };
  const pin = (item) => {
    setRecent((list) => list.filter((entry) => entry.id !== item.id));
    setPinned((list) => [...list, { ...item, model: modelLabel, count: 1 }]);
  };
  const recentActions = (item) => (
    <>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem>
        <RegistryIcon lucide='Star' aria-hidden='true' />
        Add To Favorites
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => pin(item)}>
        <RegistryIcon lucide='Pin' aria-hidden='true' />
        Pin Chat
      </DropdownMenuItem>
      <DropdownMenuItem>
        <RegistryIcon lucide='Copy' aria-hidden='true' />
        Copy Link
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant='destructive'
        onSelect={() => {
          setRecent((list) => list.filter((entry) => entry.id !== item.id));
          if (thread === item.id) newChat();
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
      <SidebarProvider shortcut={false}>
        <Sidebar variant='floating' collapsible='icon'>
          <SidebarHeader>
            <Brand />
            <NewChatButton onClick={newChat} />
          </SidebarHeader>
          <SidebarContent role='navigation' aria-label='Chats'>
            <ModelGrid model={model} onChange={setModel} />
            <PinnedThreads items={pinned} value={thread} onValueChange={openThread} />
            <AppShellNav label='Recent' hideOnRail items={recent} value={thread} onValueChange={openThread} actions={recentActions} />
            <AppShellNav label='Quick Actions' items={quickActions} value={thread} onValueChange={openThread} />
          </SidebarContent>
          <SidebarFooter>
            <UserMenu onNewChat={newChat} />
          </SidebarFooter>
        </Sidebar>
        <AppShellPanel inset={false} className='m-2 ms-0 rounded-(--ds-radius-card) border in-data-[compact=true]:m-0 in-data-[compact=true]:rounded-none in-data-[compact=true]:border-0'>
          <ChatHeader model={model} onModelChange={setModel} />
          <div className='flex flex-1 flex-col'>
            {thread ? (
              <div className='flex flex-1 flex-col px-4 pt-4'>
                <h2 className='sr-only'>{[...pinned, ...recent, ...quickActions].find((entry) => entry.id === thread)?.label}</h2>
                <AppShellPlaceholderGrid preset='thread' variant='bare' />
              </div>
            ) : turns.length ? (
              <Thread turns={turns} model={model} />
            ) : (
              <ChatWelcome
                className='max-w-2xl pt-12'
                icon={<BrandMark className='size-8' />}
                title='How Can I Help?'
                description='Start a chat or pick a prompt below.'
                suggestions={prompts}
                suggestionsVariant='cards'
                onSelect={(prompt) => setDraft(prompt)}
              />
            )}
          </div>
          <Composer model={model} draft={draft} onDraftChange={setDraft} onSend={send} />
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
