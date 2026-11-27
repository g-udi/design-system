'use client';
import { Separator } from '@gaudi/design-system/core/Separator';
import { GaudiLogo, GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useState } from 'react';
import { AvatarRoot as Avatar, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { Badge, StatusDot } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
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
import { Item, ItemContent, ItemDescription, ItemTitle } from '@gaudi/design-system/core/Item';
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

const extracts = {
  'spaced-repetition': ['Memory notebook', 'Compare the tested intervals, the time to the final test and what the participants had to recall. A shorter first interval can improve early recall without improving retention a month later.'],
  'attention-notes': ['Attention reading group', 'The group marked the passage on self-attention. Sketch how each token draws information from the other positions before comparing it with recurrence.'],
  'stoicism-highlights': ['Stoicism highlights', 'The highlighted passages distinguish what a reader can judge or choose from events outside their control. Compare one passage from each author.'],
  'printing-press': ['History of print notebook', 'Start with movable type in East Asia, then compare Gutenberg’s Mainz workshop with the spread of print shops in fifteenth-century Europe.'],
  'shallows-claims': ['The Shallows reading notes', 'The reading group marked an argument about interruptions and sustained attention. Compare the author’s examples with the evidence cited in the chapter.'],
  'urban-gardens': ['Field notes on gardens', 'The shared beds near the library have a watering rota and a seed exchange. Compare how each changes the work volunteers do.'],
  'lit-review': ['Research methods notebook', 'Group the papers by the question they answer, then compare settings, methods and limitations before drawing a conclusion.']
};
const history = Object.fromEntries([...pinnedSeed, ...recentSeed].map(item => [item.id, [
  { id: 'question', role: 'user', text: item.label },
  { id: 'answer', role: 'assistant', text: extracts[item.id][1], source: item.id }
]]));
const readingLists = {
  'saved-articles': ['attention-notes', 'printing-press', 'shallows-claims', 'spaced-repetition'],
  highlights: ['stoicism-highlights', 'urban-gardens'],
  'saved-searches': ['lit-review', 'printing-press']
};

function Brand({ onNew }) {
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <div className='flex items-center gap-2 group-data-[collapsible=icon]:flex-col'>
      <Link
        variant='bare'
        href='#new-chat'
        aria-label='Gaudi Research'
        className='flex min-w-0 flex-1 items-center gap-2 rounded-(--ds-radius-control) px-1 py-1 text-sm font-semibold outline-hidden focus-visible:ring-2 focus-visible:ring-ui-sidebar-ring group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:px-0'
        onClick={event => { event.preventDefault(); onNew(); if (isMobile) setOpenMobile(false); }}
      >
        <GaudiLogo aria-hidden='true' className='hidden size-7 group-data-[collapsible=icon]:block' />
        <span className='flex min-w-0 items-center gap-2 group-data-[collapsible=icon]:hidden'><GaudiBrand className='text-sm' /><span className='truncate'>Research</span></span>
      </Link>
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
              <span className='max-w-full truncate'>{label}</span>
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
                      <span aria-hidden='true'>·</span>
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

function UserMenu({ onNewChat, onLibrary }) {
  const { isMobile, setOpenMobile } = useSidebar();
  const act = action => { action(); if (isMobile) setOpenMobile(false); };
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
                <StatusDot className='absolute -end-0.5 -bottom-0.5 size-2.5 bg-success ring-2 ring-ui-sidebar' />
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
              <DropdownMenuItem onSelect={() => act(onNewChat)}><RegistryIcon lucide='Plus' aria-hidden='true' />New question</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => act(onLibrary)}><RegistryIcon lucide='Library' aria-hidden='true' />Open library</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function ChatHeader({ model, onModelChange, canSave, saved, onSave }) {
  const { isMobile, state } = useSidebar();
  return (
    <AppShellHeader>
      {isMobile || state === 'collapsed' ? (
        <>
          <SidebarTrigger className='-ms-1' />
          <Separator orientation='vertical' className='h-5 data-vertical:self-center' />
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
      <Button variant='ghost' size='sm' className='ms-auto' disabled={!canSave} aria-pressed={saved} onClick={onSave}>
        <RegistryIcon lucide='Book' aria-hidden='true' />
        {saved ? 'Saved to notebook' : 'Save to notebook'}
      </Button>
    </AppShellHeader>
  );
}

function Composer({ model, draft, onDraftChange, onSend }) {
  const [files, setFiles] = useState([]);
  const current = models.find((entry) => entry.value === model);
  return (
    <div className='bg-ui-background sticky bottom-0 z-1 px-4 pt-2 pb-3'>
      <ChatPromptComposer
        className='mx-auto w-full max-w-2xl [&_[data-slot=prompt-composer-footer]]:text-center'
        value={draft}
        onValueChange={onDraftChange}
        onSubmit={(text, details) => { onSend(text, details.attachments); setFiles([]); }}
        attachments={files}
        accept='application/pdf'
        onAttach={picked => setFiles(list => [...list, ...picked.map(file => ({ id: crypto.randomUUID(), name: file.name, size: file.size }))])}
        onRemoveAttachment={id => setFiles(list => list.filter(entry => entry.id !== id))}
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
                {Object.entries(extracts).map(([key, [label]]) => (
                  <DropdownMenuItem key={key} onSelect={() => onDraftChange([draft, label].filter(Boolean).join(' '))}>{label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
        actions={
          <>
            <span className='text-text-muted hidden px-1 font-mono text-xs @md:inline'>{current?.label}</span>

          </>
        }
        footer='Answers use passages from the example library.'
      />
    </div>
  );
}

function Thread({ turns, model, onSource }) {
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
              {turn.source && <Button size='sm' variant='link' onClick={() => onSource(turn.source)}>{extracts[turn.source][0]}</Button>}
            </ChatMessageContent>
          </ChatMessage>
        )
      )}
    </section>
  );
}

const sourceFor = text => {
  const query = text.toLowerCase();
  const topics = [['memory|recall|repetition', 'spaced-repetition'], ['attention|transformer', 'attention-notes'], ['stoic|highlight', 'stoicism-highlights'], ['print', 'printing-press'], ['shallows', 'shallows-claims'], ['garden', 'urban-gardens'], ['research|draft|literature|compare', 'lit-review']];
  return topics.find(([keywords, id]) => new RegExp(keywords).test(query) || query.includes(extracts[id][0].toLowerCase()))?.[1];
};

export function Pattern() {
  const [model, setModel] = useState('library');
  const [thread, setThread] = useState(null);
  const [pinned, setPinned] = useState(pinnedSeed.map(entry => ({ ...entry, count: history[entry.id].length })));
  const [recent, setRecent] = useState(recentSeed);
  const [draft, setDraft] = useState('');
  const [threads, setThreads] = useState(history);
  const [saved, setSaved] = useState([]);
  const [sourceId, setSourceId] = useState(null);
  const turns = threads[thread] ?? [];
  const modelLabel = models.find((entry) => entry.value === model)?.label;
  const openThread = id => { setThread(id); setDraft(''); setSourceId(null); };
  const newChat = () => openThread(null);
  const toggleSaved = id => setSaved(list => list.includes(id) ? list.filter(key => key !== id) : [...list, id]);
  const entries = [...pinned, ...recent];
  const collection = sources.find(item => item.id === thread);
  const collectionItems = thread === 'notebooks' ? saved : readingLists[thread] || [];
  const send = (text, attachments) => {
    if (!text && !attachments.length) return;
    const id = turns.length ? thread : crypto.randomUUID();
    const question = [text, ...attachments.map(file => file.name)].filter(Boolean).join(' · ');
    const source = sourceFor(question);
    const response = source ? extracts[source][1] : 'No matching passage in this example library. Try a saved source from the composer.';
    const stamp = crypto.randomUUID();
    if (!turns.length) setRecent(list => [{ id, label: text || question, icon: 'MessageSquare' }, ...list]);
    setThreads(list => ({ ...list, [id]: [...(list[id] || []), { id: 'user-' + stamp, role: 'user', text: question }, { id: 'answer-' + stamp, role: 'assistant', text: response, source }] }));
    openThread(id);
  };
  const pin = (item) => {
    setRecent((list) => list.filter((entry) => entry.id !== item.id));
    setPinned((list) => [...list, { ...item, model: modelLabel, count: threads[item.id]?.length || 0 }]);
  };
  const recentActions = (item) => (
    <>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onSelect={() => toggleSaved(item.id)}>
        <RegistryIcon lucide='Book' aria-hidden='true' />
        {saved.includes(item.id) ? 'Remove from notebook' : 'Save to notebook'}
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => pin(item)}>
        <RegistryIcon lucide='Pin' aria-hidden='true' />
        Pin question
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant='destructive'
        onSelect={() => {
          setRecent((list) => list.filter((entry) => entry.id !== item.id));
          setSaved(list => list.filter(id => id !== item.id));
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
            <Brand onNew={newChat} />
            <NewChatButton onClick={newChat} />
          </SidebarHeader>
          <SidebarContent role='navigation' aria-label='Research'>
            <ModelGrid model={model} onChange={setModel} />
            <PinnedThreads items={pinned} value={thread} onValueChange={openThread} />
            <AppShellNav label='Sources' items={sources.map(item => ({ ...item, badge: { label: item.id === 'notebooks' ? saved.length : readingLists[item.id].length, variant: 'plain' } }))} value={thread} onValueChange={openThread} />
            <AppShellNav label='Recent questions' hideOnRail items={recent} value={thread} onValueChange={openThread} actions={recentActions} />
          </SidebarContent>
          <SidebarFooter>
            <UserMenu onNewChat={newChat} onLibrary={() => openThread('saved-articles')} />
          </SidebarFooter>
        </Sidebar>
        <AppShellPanel inset={false} className='m-2 ms-0 rounded-(--ds-radius-card) border in-data-[compact=true]:m-0 in-data-[compact=true]:rounded-none in-data-[compact=true]:border-0'>
          <ChatHeader model={model} onModelChange={setModel} canSave={Boolean(turns.length)} saved={saved.includes(thread)} onSave={() => toggleSaved(thread)} />
          <div className='flex flex-1 flex-col'>
            {sourceId ? (
              <section className='mx-auto grid w-full max-w-2xl gap-3 p-5'><Button size='sm' variant='link' className='w-fit px-0' onClick={() => setSourceId(null)}>Back</Button>
                <h2 className='text-xl font-semibold'>{extracts[sourceId][0]}</h2><blockquote className='border-ui-border border-s-2 ps-4'>{extracts[sourceId][1]}</blockquote>
              </section>
            ) : collection ? (
              <section className='mx-auto grid w-full max-w-2xl gap-3 p-5'><h2 className='text-xl font-semibold'>{collection.label}</h2>
                {collectionItems.length ? <ul className='grid gap-2'>{collectionItems.map(id => <li key={id}><Item asChild variant='outline'><button type='button' className='w-full text-start'
                  onClick={() => thread === 'notebooks' ? openThread(id) : setSourceId(id)}><ItemContent><ItemTitle>{thread === 'notebooks' ? entries.find(entry => entry.id === id)?.label : extracts[id][0]}</ItemTitle>
                    <ItemDescription>{thread === 'notebooks' ? threads[id]?.[1]?.text : extracts[id][1]}</ItemDescription></ItemContent></button></Item></li>)}</ul> :
                  <EmptyState compact title='No saved answers' description='Save an answer from a research question to find it here.' />}
              </section>
            ) : turns.length ? (
              <Thread turns={turns} model={model} onSource={setSourceId} />
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
          <Composer key={thread || 'new'} model={model} draft={draft} onDraftChange={setDraft} onSend={send} />
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
  );
}
