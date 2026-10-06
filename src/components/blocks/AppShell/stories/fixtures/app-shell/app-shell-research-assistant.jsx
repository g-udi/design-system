'use client';
import { GaudiLogo, GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useState } from 'react';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
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
import { InputGroupButton } from '@gaudi/design-system/core/Input';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';
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
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellFrame, AppShellHeader, AppShellPanel } from '@gaudi/design-system/blocks/AppShell';
import { AppShellNav } from '@gaudi/design-system/blocks/AppShell';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';
import { ChatBubble, ChatBubbleContent } from '@gaudi/design-system/chat/ChatBubble';
import { ChatModelSelect } from '@gaudi/design-system/chat/ChatInput';
import { ChatPromptComposer } from '@gaudi/design-system/chat/ChatInput';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent } from '@gaudi/design-system/chat/ChatMessage';
import { ChatMessageParts } from '@gaudi/design-system/chat/ChatMessageList';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// Research modes decide where answers come from; the header picker and the sidebar tiles stay in step.
const models = [
  { value: 'library', label: 'Library', icon: 'Library', badge: 'Default', badgeTone: 'discovery', description: 'Answers only from your saved articles, books and notes.' },
  { value: 'web', label: 'Library + web', icon: 'Globe', badge: 'Cited', badgeTone: 'success', description: 'Adds fresh sources from the web, each one cited.' },
  { value: 'deep', label: 'Deep read', icon: 'BookText', description: 'Slower, reads whole documents before answering.' }
];
const pinnedSeed = [{ id: 'attention-notes', label: 'Notes on “Attention Is All You Need”', icon: 'Book', model: 'Deep read', count: 12 }];
const recentSeed = [
  { id: 'spaced-repetition', label: 'Compare spaced repetition studies', icon: 'Brain' },
  { id: 'stoicism-highlights', label: 'Summarise my Stoicism highlights', icon: 'PenTool' },
  { id: 'printing-press', label: 'Timeline of the printing press', icon: 'History' },
  { id: 'shallows-claims', label: 'Key claims in The Shallows', icon: 'BookOpen' },
  { id: 'urban-gardens', label: 'Find notes on urban gardens', icon: 'Sprout' },
  { id: 'lit-review', label: 'Outline a literature review', icon: 'ListTree' }
];
const sources = [
  { id: 'saved-articles', label: 'Saved articles', icon: 'NewspaperIcon', badge: { label: 248, variant: 'plain' } },
  { id: 'highlights', label: 'Highlights', icon: 'PenTool', badge: { label: 31, variant: 'discovery-light' } },
  { id: 'notebooks', label: 'Notebooks', icon: 'Layers' },
  { id: 'saved-searches', label: 'Saved searches', icon: 'SearchCheck' }
];
const prompts = [
  { id: 'highlights', label: 'Summarise this week’s highlights', icon: 'PenTool' },
  { id: 'related', label: 'Find notes related to my draft', icon: 'Link2' },
  { id: 'compare', label: 'Compare two saved articles', icon: 'Columns2' },
  { id: 'plan', label: 'Build a reading plan on memory', icon: 'CalendarRange' }
];
const user = { name: 'Amira Haddad', status: 'Reader · 3 notebooks', photo: '/avatars/person-20.svg' };

function Brand() {
  return (
    <div className='flex items-center gap-2 group-data-[collapsible=icon]:flex-col'>
      <a
        href='#new-chat'
        aria-label='Gaudi Research'
        className='flex min-w-0 flex-1 items-center gap-2 rounded-(--ds-radius-control) px-1 py-1 text-sm font-semibold outline-hidden focus-visible:ring-2 focus-visible:ring-ui-sidebar-ring group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:px-0'
        onClick={(event) => event.preventDefault()}
      >
        <GaudiLogo aria-hidden='true' className='hidden size-7 group-data-[collapsible=icon]:block' />
        <span className='flex min-w-0 items-center gap-2 group-data-[collapsible=icon]:hidden'><GaudiBrand className='text-sm' /><span className='truncate'>Research</span></span>
      </a>
      {/* On the rail the trigger moves to the page header. */}
      <SidebarTrigger className='group-data-[collapsible=icon]:hidden' />
    </div>
  );
}



function NewChatButton({ onClick }) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const rail = state === 'collapsed' && !isMobile;
  return (
    <Button
      tone='neutral'
      aria-label={rail ? 'New question' : undefined}
      className={rail ? 'size-8 self-center p-0' : 'w-full justify-between'}
      onClick={() => {
        onClick();
        // In the phone sheet a new chat also closes the sheet, as choosing a thread does.
        if (isMobile) setOpenMobile(false);
      }}
    >
      {rail ? null : <span>New question</span>}
      <RegistryIcon lucide='SquarePen' aria-hidden='true' />
    </Button>
  );
}

/** The sidebar's mode picker: one tile per research mode, in step with the header picker. */
function ModelGrid({ model, onChange }) {
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel id='ai-model-label'>Answer from</SidebarGroupLabel>
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
          {models.map(({ value, label, icon }) => (
            <ToggleGroupItem
              key={value}
              value={value}
              aria-label={label}
              className='bg-ui-background data-[state=on]:bg-ui-sidebar-accent h-auto min-w-0 flex-col gap-1.5 py-2.5 text-xs font-medium'
            >
              <RegistryIcon lucide={icon} aria-hidden='true' className='size-4' />
              <span className='truncate'>{label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

/** Pinned questions sit on dashed cards with their mode and message count. */
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
                      {item.count} {item.count === 1 ? 'turn' : 'turns'}
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
              <span className='relative shrink-0'>
                <Avatar className='size-8 rounded-full'>
                  <AvatarImage src={user.photo} alt='' className='rounded-full' />
                  <AvatarFallback className='rounded-full'>AH</AvatarFallback>
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
                New question
                <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='Library' aria-hidden='true' />
                Open library
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='Quote' aria-hidden='true' />
                Citation style
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='Keyboard' aria-hidden='true' />
                Keyboard shortcuts
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
        label='Mode'
        variant='outline'
        size='sm'
        contentClassName='w-72'
      />
      <Button variant='ghost' size='sm' className='ms-auto'>
        <RegistryIcon lucide='Book' aria-hidden='true' />
        Save to notebook
      </Button>
    </AppShellHeader>
  );
}

function Composer({ model, draft, onDraftChange, onSend }) {
  const [search, setSearch] = useState(false);
  const current = models.find((entry) => entry.value === model);
  return (
    <div className='bg-ui-background sticky bottom-0 z-1 px-4 pt-2 pb-3'>
      <ChatPromptComposer
        className='mx-auto w-full max-w-2xl [&_[data-slot=prompt-composer-footer]]:text-center'
        value={draft}
        onValueChange={onDraftChange}
        onSubmit={onSend}
        labels={{ message: 'Ask your library', placeholder: 'Ask about anything you have saved…', send: 'Ask' }}
        toolbar={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton size='icon-sm' aria-label='Add a source'>
                  <RegistryIcon lucide='Plus' />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side='top' align='start' className='w-44'>
                <DropdownMenuItem>
                  <RegistryIcon lucide='Upload' aria-hidden='true' />
                  Attach a PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RegistryIcon lucide='Bookmark' aria-hidden='true' />
                  Cite a bookmark
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RegistryIcon lucide='FileText' aria-hidden='true' />
                  Quote a note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupButton size='sm' aria-pressed={search} aria-label='Only cited answers' className='aria-pressed:bg-ui-accent aria-pressed:text-accent' onClick={() => setSearch((on) => !on)}>
              <RegistryIcon lucide='Quote' />
              Cite
            </InputGroupButton>
          </>
        }
        actions={
          <>
            <span className='text-text-muted hidden px-1 font-mono text-xs @md:inline'>{current?.label}</span>
            <InputGroupButton size='icon-sm' aria-label='Dictate a question'>
              <RegistryIcon lucide='Mic' />
            </InputGroupButton>
          </>
        }
        footer='Answers quote your sources. Open them before you rely on a claim.'
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
          <ChatMessage key={turn.id} align='end'>
            <ChatMessageContent>
              <span className='sr-only'>You:</span>
              <ChatBubble align='end' variant='secondary'>
                <ChatBubbleContent>{turn.text}</ChatBubbleContent>
              </ChatBubble>
            </ChatMessageContent>
          </ChatMessage>
        ) : (
          <ChatMessage key={turn.id}>
            <ChatMessageAvatar>
              <GaudiLogo aria-hidden='true' className='size-7' />
            </ChatMessageAvatar>
            <ChatMessageContent>
              <span className='sr-only'>{current?.label}:</span>
              <ChatMessageParts parts={[{ type: 'text', text: turn.text }]} />
            </ChatMessageContent>
          </ChatMessage>
        )
      )}
    </section>
  );
}

const replyTo = (model) => `Answered in **${model}** mode: I found 4 relevant passages. Here is a short synthesis with the sources linked; ask me to go deeper on any of them.`;

export function Pattern() {
  const [model, setModel] = useState('library');
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
        <RegistryIcon lucide='Book' aria-hidden='true' />
        Save to notebook
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => pin(item)}>
        <RegistryIcon lucide='Pin' aria-hidden='true' />
        Pin question
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
          <SidebarContent role='navigation' aria-label='Research'>
            <ModelGrid model={model} onChange={setModel} />
            <PinnedThreads items={pinned} value={thread} onValueChange={openThread} />
            <AppShellNav label='Sources' items={sources} value={thread} onValueChange={openThread} />
            <AppShellNav label='Recent questions' hideOnRail items={recent} value={thread} onValueChange={openThread} actions={recentActions} />
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
                <h2 className='sr-only'>{[...pinned, ...recent, ...sources].find((entry) => entry.id === thread)?.label}</h2>
                <div aria-hidden='true' className='flex min-h-0 flex-1 flex-col gap-4 p-4'><Skeleton className='ms-auto h-10 w-1/2' /><Skeleton className='h-24 w-3/4' /><Skeleton className='ms-auto h-10 w-1/3' /><Skeleton className='h-40 w-full' /></div>
              </div>
            ) : turns.length ? (
              <Thread turns={turns} model={model} />
            ) : (
              <EmptyState
                className='max-w-2xl pt-12'
                icon={<GaudiLogo aria-hidden='true' className='size-8' />}
                title={<h2>What are you researching?</h2>}
                description='Ask a question about your library, or start from one of these.'
                actions={
                  <ul aria-label='Suggested prompts' className='grid w-full grid-cols-1 gap-2 @lg:grid-cols-2'>
                    {prompts.map((prompt) => (
                      <li key={prompt.id} className='min-w-0'>
                        <Button variant='outline' className='h-auto w-full justify-start gap-2 py-2.5 text-start font-medium whitespace-normal' onClick={() => setDraft(prompt.label)}>
                          <RegistryIcon lucide={prompt.icon} className='text-text-muted' />
                          <span className='min-w-0 flex-1 break-words'>{prompt.label}</span>
                          <RegistryIcon lucide='ArrowUpRight' aria-hidden='true' className='ds-part-rtl-flip text-text-muted' />
                        </Button>
                      </li>
                    ))}
                  </ul>
                }
              />
            )}
          </div>
          <Composer model={model} draft={draft} onDraftChange={setDraft} onSend={send} />
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
